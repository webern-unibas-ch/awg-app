/*
 * This service is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */

import { inject, Injectable } from '@angular/core';

import * as N3 from 'n3';

import { GraphSparqlQueryType } from '@awg-views/edition-view/models/graph.model';
import {
    Namespace,
    NamespaceType,
    PrefixForm,
    QueryResult,
    QuerySelectResult,
    QuerySelectResultBindings,
    RDFStoreConstructResponse,
    RDFStoreConstructResponseTriple,
    RDFStoreSelectResponse,
    Triple,
} from '../models';
import { PrefixPipe } from '../prefix-pipe';

/**
 * Declared variable: rdfstore.
 *
 * It provides access to the rdfstore library.
 */
declare let rdfstore: any;

/**
 * The GraphVisualizer service.
 *
 * It handles the query requests of the graph visualizer.
 */
@Injectable()
export class GraphVisualizerService {
    /**
     * Private variable: _store.
     *
     * It keeps the rdfstore instance.
     */
    private _store: any;

    /**
     * Private readonly injection variable: _prefixPipe.
     *
     * It keeps the instance of the injected PrefixPipe.
     */
    private readonly _prefixPipe = inject(PrefixPipe);

    /**
     * Public method: checkNamespacesInQuery.
     *
     * It checks the existing namespaces and prefixes in a SPARQL query
     * and appends missing prefix declarations, if possible, from the Turtle string.
     *
     * @param {string} queryStr The given SPARQL query string.
     * @param {string} turtleStr The given Turtle string.
     *
     * @returns {string} The query with appended namespaces.
     */
    checkNamespacesInQuery(queryStr: string, turtleStr: string): string {
        if (!queryStr || !turtleStr) {
            return '';
        }
        const turtleNamespaces: Namespace = this._extractNamespacesFromString(NamespaceType.TURTLE, turtleStr);
        const sparqlNamespaces: Namespace = this._extractNamespacesFromString(NamespaceType.SPARQL, queryStr);
        const sparqlPrefixes: string[] = this._extractQNamePrefixesFromSPARQLWhereClause(queryStr);
        const sparqlNamespaceKeys = new Set(Object.keys(sparqlNamespaces));

        let missingNamespacesStr = '';

        // Merge turtle namespaces with those from SPARQL WHERE clause (expanded if any)
        // And add missing prefixes to the SPARQL query
        [
            ...Object.entries(turtleNamespaces),
            ...sparqlPrefixes.map(prefix => [prefix, this._prefixPipe.transform(prefix, PrefixForm.LONG)]),
        ].forEach(([key, value]) => {
            if (!sparqlNamespaceKeys.has(key) && key !== value) {
                missingNamespacesStr += `PREFIX ${key}: <${value}>\n`;
            } else if (key === value) {
                console.error(`Prefix '${key}' is unknown. Please provide a declaration.`);
            }
        });

        return missingNamespacesStr + queryStr;
    }

    /**
     * Public method: doQuery.
     *
     * It performs a query against the rdfstore.
     *
     * @param {string} queryType The given query type.
     * @param {string} query The given query.
     * @param {string} ttlString The given turtle string.
     * @param {string} [mimeType] The optional given mimetype.
     *
     * @returns {Promise<QueryResult>} A promise of the query result.
     */
    async doQuery(queryType: string, query: string, ttlString: string, mimeType?: string): Promise<QueryResult> {
        if (!mimeType) {
            mimeType = 'text/turtle';
        }

        const store = await this._createStore(rdfstore);
        this._store = store;

        await this._loadTriplesInStore(store, ttlString, mimeType);
        const res: RDFStoreConstructResponse | RDFStoreSelectResponse = await this._executeQuery(this._store, query);

        // Reformat data if select query
        if (queryType === 'select') {
            const response = res as RDFStoreSelectResponse;
            const selectResponse = this._prepareSelectResponse(response);
            return selectResponse.data;
        }

        // Reformat data if construct query
        if (queryType === 'construct') {
            const response = res as RDFStoreConstructResponse;
            const namespaces = this._extractNamespacesFromString(NamespaceType.TURTLE, ttlString);
            const constructResponse = this._prepareConstructResponse(response.triples || [], namespaces, mimeType);
            return constructResponse;
        }

        return undefined;
    }

    /**
     * Public method: extractLabelsFromTriples.
     *
     * It extracts any existing labels from the RDF triples data.
     * Subject URIs are transformed using PrefixPipe - only those matching
     * default prefixes get shortened to prefix form, others remain as full URIs.
     *
     * @param {Triple[]} triples The given triple array.
     *
     * @returns {Map<string, string>} A map of URI (shortened or full) to label mappings.
     */
    extractLabelsFromTriples(triples: Triple[]): Map<string, string> {
        const labelMap = new Map<string, string>();

        if (!triples) {
            return labelMap;
        }

        const rdfsLabelShort = 'rdfs:label';
        const rdfsLabelLong = this._prefixPipe.transform('rdfs:label', PrefixForm.LONG);

        triples.forEach(triple => {
            const predId = this._prefixPipe.transform(triple.predicate, PrefixForm.SHORT);

            if (predId === rdfsLabelShort || triple.predicate === rdfsLabelLong) {
                const subjId = this._prefixPipe.transform(triple.subject, PrefixForm.SHORT);
                labelMap.set(subjId, triple.object);
            }
        });

        return labelMap;
    }

    /**
     * Public method: getQuerytype.
     *
     * It gets the query type from a given query.
     *
     * @param {string} query The given query.
     *
     * @returns {GraphSparqlQueryType} The query type.
     */
    getQuerytype(query: string): GraphSparqlQueryType {
        const queryTypes = ['select', 'construct', 'ask', 'count', 'describe', 'insert', 'delete'];

        let lowestIndex = Infinity;
        let foundType: (typeof queryTypes)[number] | null = null;

        queryTypes.forEach(type => {
            const index = query.toLowerCase().indexOf(type);
            if (index !== -1 && index < lowestIndex) {
                lowestIndex = index;
                foundType = type;
            }
        });

        if (foundType === null) {
            return null;
        }

        return (foundType === 'insert' || foundType === 'delete' ? 'update' : foundType) as GraphSparqlQueryType;
    }

    /**
     * Public method: limitTriples.
     *
     * It limits a given array of triples by a given limit.
     *
     * @param {Triple[]} triples The given triples array.
     * @param {number} limit The given limit.
     *
     * @returns {Triple[]} The array of limited triples.
     */
    limitTriples(triples: Triple[], limit: number): Triple[] {
        if (!triples) {
            return [];
        }
        return triples.length > limit ? triples.slice(0, limit) : triples;
    }

    /**
     * Public method: parseTripleString.
     *
     * It parses the triples from a given triple string.
     *
     * @param {string} triples The given triple string.
     *
     * @returns {Promise<{ quads: N3.Quad[]; namespaces: N3.Prefixes }>} A promise of the parsed quads and namespaces.
     */
    parseTripleString(triples: string): Promise<{ quads: N3.Quad[]; namespaces: N3.Prefixes }> {
        const parser = new N3.Parser();
        const jsonTriples: N3.Quad[] = [];

        return new Promise((resolve, reject) => {
            parser.parse(triples, (error: unknown, quad: N3.Quad, prefixes: N3.Prefixes) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (quad) {
                    jsonTriples.push(quad);
                } else {
                    resolve({ quads: jsonTriples, namespaces: prefixes });
                }
            });
        });
    }

    /**
     * Private method: _abbreviate.
     *
     * It abbreviates the namespaces of a given iri.
     *
     * @param {string} iri The given iri string.
     * @param {Namespace} namespaces The given namespaces.
     *
     * @returns {string} The abbreviated or original iri string.
     */
    private _abbreviate(iri: string, namespaces: Namespace): string {
        if (!iri?.startsWith('http') || !namespaces) {
            return iri;
        }

        for (const [namespaceKey, namespaceValue] of Object.entries(namespaces)) {
            if (iri.includes(namespaceValue)) {
                return iri.replace(namespaceValue, namespaceKey + ':');
            }
        }

        return iri;
    }

    /**
     * Private method: _createStore.
     *
     * It creates an instance of the rdfstore.
     *
     * @param {typeof rdfstore} store The given rdfstore.
     *
     * @returns {Promise<typeof rdfstore>} A promise of the rdfstore instance.
     */
    private _createStore(store: typeof rdfstore): Promise<typeof rdfstore> {
        return new Promise((resolve, reject) => {
            if (!store?.create) {
                reject(new Error('rdfstore is not available in the current runtime.'));
                return;
            }

            store.create((err: unknown, createdStore: typeof rdfstore) => {
                if (err) {
                    reject(err);
                }
                resolve(createdStore);
            });
        });
    }

    /**
     * Private method: _executeQuery.
     *
     * It executes a given query against a given triple store.
     *
     * @param {typeof rdfstore} store The given triplestore.
     * @param {string} query The given query string.
     *
     * @returns {Promise<RDFStoreConstructResponse | RDFStoreSelectResponse>} A promise of the rdfstore construct or select response.
     */
    private _executeQuery(
        store: typeof rdfstore,
        query: string
    ): Promise<RDFStoreConstructResponse | RDFStoreSelectResponse> {
        return new Promise((resolve, reject) => {
            store.execute(query, (err: unknown, res: RDFStoreConstructResponse | RDFStoreSelectResponse) => {
                if (err) {
                    console.error('_executeQuery# got ERROR', err);
                    reject(err);
                }

                resolve(res);
            });
        });
    }

    /**
     * Private method: _extractNamespacesFromString.
     *
     * It extracts the namespaces (qname: <baseURI>) of a given type (SPARQL, TURTLE)
     * from a given string.
     *
     * @param {NamespaceType} type The given namespace type.
     * @param {string} str The given string.
     *
     * @returns {Namespace} A namespace object.
     */
    private _extractNamespacesFromString(type: NamespaceType, str: string): Namespace {
        let regex: RegExp;
        let exhaustiveCheck: never;
        switch (type) {
            case NamespaceType.TURTLE:
                regex = /@prefix\s+(\w+):\s+<([^>]+)>/g;
                break;
            case NamespaceType.SPARQL:
                regex = /PREFIX\s+(\w+):\s+<([^>]+)>/g;
                break;
            default:
                exhaustiveCheck = type;
                throw new Error(`The type must be TURTLE or SPARQL, but was: ${exhaustiveCheck}.`);
        }

        const namespaces: Namespace = {};
        for (const match of str.matchAll(regex)) {
            const [, prefix, namespaceName] = match;
            namespaces[prefix] = namespaceName;
        }

        return namespaces;
    }

    /**
     * Private method: _extractQNamePrefixesFromSPARQLWhereClause.
     *
     * It identifies the qname prefixes that are used in the WHERE clause of a SPARQL query.
     *
     * @param {string} query The given query string.
     *
     * @returns {string[]} A string array of the used qname prefixes.
     */
    private _extractQNamePrefixesFromSPARQLWhereClause(query: string): string[] {
        const where = 'WHERE {';
        const regex = /\b([a-zA-Z_][a-zA-Z0-9._-]{0,15}):/g;

        // Find WHERE clause
        const start = query.toLowerCase().indexOf(where.toLowerCase());
        const queryStr = start === -1 ? query : query.slice(start);

        // Find prefixes in query using matchAll
        const matches = queryStr.matchAll(regex);
        // Use captured group (index 1) to return prefixes without the colon
        const prefixes = new Set<string>(Array.from(matches, match => match[1]));

        return Array.from(prefixes);
    }

    /**
     * Private method: _loadTriplesInStore.
     *
     * It loads the given triple string into the given triplestore.
     *
     * @param {any} store The given triplestore.
     * @param {string} triples The given triple string.
     * @param {string} [mimeType] The optional given mimetype.
     *
     * @returns {Promise<number>} A promise of the size of the triples loaded into the store.
     */
    private _loadTriplesInStore(store: any, triples: string, mimeType?: string): Promise<number> {
        if (!mimeType) {
            mimeType = 'text/turtle';
        }

        return new Promise((resolve, reject) => {
            store.load(mimeType, triples, (err: unknown, size: number) => {
                if (err) {
                    console.error('_loadTriplesInStore# got ERROR', err);
                    reject(err);
                }
                resolve(size);
            });
        });
    }

    /**
     * Private method: _mapKeys.
     *
     * It maps the keys of a given key-value paired object to given newKeys.
     *
     * @param {Record<string, string>} obj The given object.
     * @param {Record<string, string>} newKeysObj The given new keys object.
     *
     * @returns {Record<string, string>} An object with the new keys.
     */
    private _mapKeys(obj: Record<string, string>, keyMap: Record<string, string>): Record<string, string> {
        if (!obj) {
            return {};
        }
        if (!keyMap) {
            return obj;
        }
        return Object.entries(obj).reduce(
            (acc, [key, value]) => {
                const newKey = keyMap[key] || key;
                acc[newKey] = value;
                return acc;
            },
            {} as { [key: string]: string }
        );
    }

    /**
     * Private method: _prepareMappedBindings.
     *
     * It prepares the bindings with mapped keys and label of a given select response.
     *
     * @param {RDFStoreSelectResponse} selectResponse The given select response.
     *
     * @returns {QuerySelectResultBindings[]} The array of bindings.
     */
    private _prepareMappedBindings(selectResponse: RDFStoreSelectResponse): QuerySelectResultBindings[] {
        const xmlsInteger = 'http://www.w3.org/2001/XMLSchema#integer';
        const xmlsNonNegativeInteger = 'http://www.w3.org/2001/XMLSchema#nonNegativeInteger';
        const keyMap = {
            token: 'type',
            type: 'datatype',
            lang: 'xml:lang',
        };

        return selectResponse.map(item => {
            const newItem: Record<string, any> = {};

            Object.entries(item).forEach(([itemEntryKey, itemEntryValue]) => {
                // Map keys
                newItem[itemEntryKey] = this._mapKeys(itemEntryValue, keyMap);

                // Set label
                const { value, type, datatype = '' } = newItem[itemEntryKey];
                newItem[itemEntryKey]['label'] =
                    type === 'literal' && (datatype === xmlsInteger || datatype === xmlsNonNegativeInteger)
                        ? +value
                        : this._prefixPipe.transform(value, PrefixForm.SHORT);
            });
            return newItem;
        });
    }

    /**
     * Private method: _prepareConstructResponse.
     *
     * It prepares the triples of the construct response.
     *
     * @param {RDFStoreConstructResponseTriple[]} storeTriples The given triples from the rdf construct response.
     * @param {string} namespaces The given namespaces.
     * @param {string} [mimeType] The given optional mimeType.
     *
     * @returns {Triple[]} The array of abbreviated triples.
     */
    private _prepareConstructResponse(
        storeTriples: RDFStoreConstructResponseTriple[],
        namespaces: Namespace,
        mimeType?: string
    ): Triple[] {
        const shouldAbbreviate = !mimeType || mimeType === 'text/turtle';

        return storeTriples.map((storeTriple: RDFStoreConstructResponseTriple) => {
            let {
                subject: s,
                predicate: p,
                object: o,
            } = {
                subject: storeTriple.subject.nominalValue,
                predicate: storeTriple.predicate.nominalValue,
                object: storeTriple.object.nominalValue,
            };

            if (shouldAbbreviate) {
                s = this._abbreviate(s, namespaces);
                p = this._abbreviate(p, namespaces);
                o = this._abbreviate(o, namespaces);
            }
            return { subject: s, predicate: p, object: o };
        });
    }

    /**
     * Private method: _prepareSelectResponse.
     *
     * It prepares the data of the select response.
     *
     * @param {RDFStoreSelectResponse} selectResponse The given selectResponse.
     * @returns  {status: number; data: QuerySelectResult | string | undefined } An object with a status code, and the data as QuerySelectResult, string, or undefined.
     */
    private _prepareSelectResponse(selectResponse: RDFStoreSelectResponse): {
        status: number;
        data: QuerySelectResult | string | undefined;
    } {
        if (!selectResponse) {
            return { status: 404, data: undefined };
        }

        if (selectResponse.length === 0) {
            return { status: 400, data: 'Query returned no results' };
        }

        // Get variable keys and bindings
        const selectResponseKeys = Object.keys(selectResponse[0]);
        const selectResponseBindings = this._prepareMappedBindings(selectResponse);

        // Re-format data
        const reformatted: QuerySelectResult = {
            head: { vars: selectResponseKeys },
            body: { bindings: selectResponseBindings },
        };

        return { status: 200, data: reformatted };
    }
}
