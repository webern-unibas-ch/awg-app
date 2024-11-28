/*
 * This service is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */

import { inject, Injectable } from '@angular/core';

import * as N3 from 'n3';

import {
    Namespace,
    NamespaceType,
    PrefixForm,
    QueryResult,
    QueryResultBindings,
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
            return undefined;
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
     * @returns {Promise<Triple[]>} A promise of the query result triples.
     */
    doQuery(
        queryType: string,
        query: string,
        ttlString: string,
        mimeType?: string
    ): Promise<string | QueryResult | Triple[]> {
        if (!mimeType) {
            mimeType = 'text/turtle';
        }

        return this._createStore(rdfstore)
            .then(store => {
                this._store = store;

                return this._loadTriplesInStore(store, ttlString, mimeType);
            })
            .then(() => this._executeQuery(this._store, query))
            .then((res: RDFStoreConstructResponse | RDFStoreSelectResponse) => {
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
                    const constructResponse = this._prepareConstructResponse(response.triples, namespaces, mimeType);
                    return constructResponse;
                }

                return undefined;
            });
    }

    /**
     * Public method: getQuerytype.
     *
     * It gets the query type from a given query.
     *
     * @param {string} query The given query.
     *
     * @returns {string} The query type.
     */
    getQuerytype(query: string): string | null {
        const queryTypes = ['select', 'construct', 'ask', 'count', 'describe', 'insert', 'delete'];

        let lowestIndex = Infinity;
        let foundType: string | null = null;

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

        return foundType === 'insert' || foundType === 'delete' ? 'update' : foundType;
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
     * @returns {Promise<{triples; namespaces}>} A promise of the parsed triples.
     */
    parseTripleString(triples: string): Promise<{ quads: N3.DataFactory.quad[]; namespaces: N3.DataFactory.prefixes }> {
        const parser = new N3.Parser();
        const jsonTriples = [];

        return new Promise((resolve, reject) => {
            parser.parse(triples, (error, quad, prefixes) => {
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
     * @returns {Promise<any>} A promise of the rdfstore instance.
     */
    private _createStore(store: typeof rdfstore): Promise<any> {
        return new Promise((resolve, reject) => {
            store.create((err, createdStore) => {
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
     * @param {any} store The given triplestore.
     * @param {string} query The given query string.
     *
     * @returns {Promise<RDFStoreConstructResponse | RDFStoreSelectResponse>} A promise of the rdfstore construct or select response.
     */
    private _executeQuery(store: any, query: string): Promise<RDFStoreConstructResponse | RDFStoreSelectResponse> {
        return new Promise((resolve, reject) => {
            store.execute(query, (err, res: RDFStoreConstructResponse | RDFStoreSelectResponse) => {
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
        const queryStr = start !== -1 ? query.slice(start) : query;

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
            store.load(mimeType, triples, (err, size: number) => {
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
     * @returns {QueryResultBindings[]} The array of bindings.
     */
    private _prepareMappedBindings(selectResponse: RDFStoreSelectResponse): QueryResultBindings[] {
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
     *
     * @returns  {status: number; data: QueryResult | string } An object with a status code, and the data as QueryResult or string.
     */
    private _prepareSelectResponse(selectResponse: RDFStoreSelectResponse): {
        status: number;
        data: QueryResult | string;
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
        const reformatted: QueryResult = {
            head: { vars: selectResponseKeys },
            body: { bindings: selectResponseBindings },
        };

        return { status: 200, data: reformatted };
    }
}
