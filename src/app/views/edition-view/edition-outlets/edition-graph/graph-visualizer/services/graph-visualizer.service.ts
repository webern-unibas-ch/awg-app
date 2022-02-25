/*
 * This service is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */

import { Injectable } from '@angular/core';

import * as N3 from 'n3';

import {
    Namespace,
    NamespaceType,
    PrefixForm,
    QueryResult,
    QueryTypeIndex,
    SearchResult,
    SearchResultBindings,
    Triple,
    TripleComponent,
} from '../models';
import { PrefixPipe } from '../prefix-pipe/prefix.pipe';

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
     * Constructor of the GraphVisualizerService.
     *
     * It declares a private instance of the {@link PrefixPipe}.
     *
     * @param {PrefixPipe} prefixPipe Instance of the PrefixPipe.
     */
    constructor(private prefixPipe: PrefixPipe) {}

    /**
     * Public method: parseTriples.
     *
     * It parses the triples from a given triple array.
     *
     * @param {Triple[]} triples The given triple array.
     *
     * @returns {Promise<{triples; namespaces}>} A promise of the parsed triples.
     */
    parseTriples(triples: Triple[]): Promise<{ triples; namespaces }> {
        const parser = new N3.Parser();
        const jsonTriples = [];

        return new Promise((resolve, reject) => {
            parser.parse(triples, (err, triple, namespaceValues) => {
                if (triple) {
                    jsonTriples.push(triple);
                } else {
                    resolve({ triples: jsonTriples, namespaces: namespaceValues });
                }
                if (err) {
                    reject(err);
                }
            });
        });
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
        if (triples.length > limit) {
            return triples.slice(0, limit);
        } else {
            return triples;
        }
    }

    /**
     * Public method: abbreviateTriples.
     *
     * It abbreviates the given triples according to the given namespaces.
     *
     * @param {Triple[]} triples The given triples.
     * @param {string} namespaces The given namespaces.
     * @param {string} [mimeType] The given optional mimeType.
     *
     * @returns {Triple[]} The array of abbreviated triples.
     */
    abbreviateTriples(triples: Triple[], namespaces: Namespace, mimeType?: string): Triple[] {
        if (!mimeType) {
            mimeType = 'text/turtle';
        }
        return triples.map((triple: Triple) => {
            let s: TripleComponent = triple.subject.nominalValue;
            let p: TripleComponent = triple.predicate.nominalValue;
            let o: TripleComponent = triple.object.nominalValue;

            // Abbreviate turtle format
            if (mimeType === 'text/turtle') {
                if (this._abbreviate(s, namespaces) != null) {
                    s = this._abbreviate(s, namespaces);
                }
                if (this._abbreviate(p, namespaces) != null) {
                    p = this._abbreviate(p, namespaces);
                }
                if (this._abbreviate(o, namespaces) != null) {
                    o = this._abbreviate(o, namespaces);
                }
            }
            return { subject: s, predicate: p, object: o };
        });
    }

    /**
     * Public method: checkNamespacesInQuery.
     *
     * It checks the existing namespaces and prefixes in a SPARQL query
     * and appends missing declarations, if possible, from the Turtle string.
     *
     * @param {string} queryStr The given SPARQL query string.
     * @param {string} turtleStr The given Turtle string.
     *
     * @returns {string} The query with appended namespaces.
     */
    checkNamespacesInQuery(queryStr: string, turtleStr: string): string {
        if (!queryStr || !turtleStr) {
            return;
        }
        // Get namespaces from Turtle triples
        const turtleNamespaces: Namespace = this._extractNamespacesFromString(NamespaceType.TURTLE, turtleStr);
        // Get namespaces from SPARQL query
        const sparqlNamespaces: Namespace = this._extractNamespacesFromString(NamespaceType.SPARQL, queryStr);
        // Get prefixes used in the query
        const prefixes: string[] = this._extractPrefixesFromSPARQLWhereClause(queryStr);

        // Get keys of namespace objects
        const turtleNamespaceKeys = Object.keys(turtleNamespaces);
        const sparqlNamespaceKeys = Object.keys(sparqlNamespaces);
        let missingNamespacesStr = '';

        // Loop over namespaces from Turtle prefix clause
        turtleNamespaceKeys.forEach(key => {
            // If namespace is missing in SPARQL header, add them from Turtle
            if (sparqlNamespaceKeys.indexOf(key) === -1) {
                missingNamespacesStr += `PREFIX ${key} ${turtleNamespaces[key]}\n`;
            }
        });

        // Loop over existing prefixes from SPARQL query
        if (prefixes.length > 0) {
            prefixes.forEach(prefix => {
                // If prefix is not in the list...
                if (sparqlNamespaceKeys.indexOf(prefix) === -1) {
                    // TODO: Warnings should go into error messages
                    console.warn(`Prefix '${prefix}' not declared in SPARQL and/or Turtle header`);

                    const cachedNamespace = this.prefixPipe.transform(prefix, PrefixForm.long);
                    if (cachedNamespace !== prefix) {
                        console.warn(`Added prefix from cache`);
                        missingNamespacesStr += `PREFIX ${prefix} <${cachedNamespace}>\n`;
                    } else {
                        console.warn(`'${prefix}' is unknown. Please provide a declaration.`);
                    }
                }
            });
        }

        if (missingNamespacesStr !== '') {
            queryStr = missingNamespacesStr + queryStr;
        }

        return queryStr;
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
    ): Promise<string | SearchResult | Triple[]> {
        if (!mimeType) {
            mimeType = 'text/turtle';
        }

        return this._createStore()
            .then(store => {
                this._store = store;

                return this._loadTriplesInStore(store, ttlString, mimeType);
            })
            .then((storeSize: number) => this._executeQuery(this._store, query))
            .then((res: any) => {
                const response = res;

                // Reformat data if select query
                if (queryType === 'select') {
                    return this._prepareSelectResponse(response).data;
                }

                // Reformat data if select query
                if (queryType === 'construct') {
                    /**
                     * NB! THE PREFIXING SHOULD BE HANDLED BY A PIPE!
                     */

                    // PrepareConstructResponse

                    // Get namespaces
                    return this._getNamespaces(ttlString).then((namespaces: Namespace) =>
                        // Process result
                        this.abbreviateTriples(response.triples, namespaces, mimeType)
                    );
                }
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
    getQuerytype(query: string): string {
        let keyWords: QueryTypeIndex[] = [
            { queryType: 'select', index: -1 },
            { queryType: 'construct', index: -1 },
            { queryType: 'ask', index: -1 },
            { queryType: 'count', index: -1 },
            { queryType: 'describe', index: -1 },
            { queryType: 'insert', index: -1 },
            { queryType: 'delete', index: -1 },
        ];

        // Get indexes and set a variable if at least one matches + store lowest index
        let match = false; // Set to true if some keyword match is found
        let low = Infinity;

        keyWords = keyWords.map(item => {
            item.index = query.toLowerCase().indexOf(item.queryType);
            if (item.index !== -1) {
                match = true;
                if (item.index < low) {
                    low = item.index;
                }
            }
            return item;
        });

        // If none of the keywords match return null
        if (!match) {
            return null;
        }

        // If more exist, take the lowest
        const lowest: QueryTypeIndex = keyWords.find(item => item.index === low);
        if (!lowest) {
            return null;
        }
        const type: string = lowest.queryType;

        if (type === 'insert' || type === 'delete') {
            return 'update';
        }

        return type;
    }

    /**
     * Private method: _abbreviate.
     *
     * It abbreviates the namespaces of a given iri.
     *
     * @param {*} iri The given iri.
     * @param {Namespace} namespaces The given namespaces.
     *
     * @returns {TripleComponent} The abbreviated triple component.
     */
    private _abbreviate(iri: any, namespaces: Namespace): TripleComponent {
        let newVal: TripleComponent = null;
        // If IRI has 'http' in its name, continue
        if (iri.indexOf('http') !== -1) {
            // Loop over namespaces
            Object.entries(namespaces).forEach(([key, value], index) => {
                // If the IRI has the prefixed namespace in its name, return it
                if (iri.indexOf(value) !== -1) {
                    newVal = iri.replace(value, key + ':');
                }
            });
        }
        return newVal;
    }

    /**
     * Private method: _createStore.
     *
     * It creates an instance of the triple store.
     *
     * @returns {Promise<any>} A promise of the triple store instance.
     */
    private _createStore(): Promise<any> {
        return new Promise((resolve, reject) => {
            rdfstore.create((err, store) => {
                if (err) {
                    reject(err);
                }
                resolve(store);
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
     * @returns {Promise<QueryResult>} A promise of the query result.
     */
    private _executeQuery(store: any, query: string): Promise<QueryResult> {
        return new Promise((resolve, reject) => {
            store.execute(query, (err, res: QueryResult) => {
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
     * @param {string} str The given string.
     * @param {NamespaceType} type The given namespace type.
     *
     * @returns {Promise<Namespace>} A promise of the namespaces.
     */
    private _extractNamespacesFromString(type: NamespaceType, str: string) {
        // Replace all whitespace characters with a single space and split by space
        // Remove empty values
        const arr = str
            .toLowerCase()
            .replace(/\s/g, ' ')
            .split(' ')
            .filter(el => el !== '');

        let prefixStr;

        switch (type) {
            case NamespaceType.TURTLE:
                prefixStr = '@prefix'.toLowerCase();
                break;
            case NamespaceType.SPARQL:
                prefixStr = 'PREFIX'.toLowerCase();
                break;
            default:
                prefixStr = '';
        }

        // Get index of all occurrences of prefix string
        const prefixIndexArray = arr.reduce((a, e, i) => {
            if (e === prefixStr) {
                a.push(i);
            }
            return a;
        }, []);

        // Create object of qNames and namespaceNames
        const obj = {};
        prefixIndexArray.forEach(prefixIndex => {
            const qName = arr[prefixIndex + 1];
            let namespaceName = arr[prefixIndex + 2];
            // Remove final dot if given
            if (namespaceName[namespaceName.length - 1] === '.') {
                namespaceName = namespaceName.slice(0, -1);
            }
            obj[qName] = namespaceName;
        });

        return obj;
    }

    /**
     * Private method: _extractPrefixesFromSPARQLWhereClause.
     *
     * It identifies the prefixes that are used in the WHERE clause of a SPARQL query.
     *
     * @param {string} queryStr The given query string.
     *
     * @returns {string[]} A string array of the used prefixes.
     */
    private _extractPrefixesFromSPARQLWhereClause(query: string): string[] {
        let m;
        let queryStr = query.toLowerCase();
        let start = 0;
        const prefixes: string[] = [];
        const regex = /\b[a-zA-Z]{2,15}:/g;
        const where = 'WHERE {'.toLowerCase();

        // Find WHERE clause
        if (queryStr.includes(where)) {
            start = queryStr.indexOf(where) + where.length;
        }

        // Remove everything before WHERE clause from query string
        queryStr = queryStr.slice(start);

        // Find prefixes in query
        // eslint-disable-next-line no-cond-assign
        while ((m = regex.exec(queryStr)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach(match => {
                if (prefixes.indexOf(match) === -1) {
                    prefixes.push(match);
                }
            });
        }
        return prefixes;
    }

    /**
     * Private method: _getNamespaces.
     *
     * It extracts the namespaces from a given triple string.
     *
     * @param {string} triples The given triple string.
     *
     * @returns {Promise<Namespace>} A promise of the namespaces.
     */
    private _getNamespaces(triples: string): Promise<Namespace> {
        // Parse triples
        const parser = new N3.Parser();

        return new Promise((resolve, reject) => {
            parser.parse(triples, (err, triple, prefixes) => {
                if (!triple) {
                    resolve(prefixes);
                }
                if (err) {
                    reject(err);
                }
            });
        });
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
            store.load(mimeType, triples, (err, size) => {
                if (err) {
                    console.error('_loadTriplesInStore# got error', err);
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
     * @param {[key:string]: string} obj The given obj.
     * @param {[key:string]: string} newKeys The given new keys.
     *
     * @returns {[key:string]: string} An object with the new keys.
     */
    private _mapKeys(obj: { [key: string]: string }, newKeys: { [key: string]: string }): { [key: string]: string } {
        const keyValues = Object.keys(obj).map(key => {
            const newKey = newKeys[key] || key;
            return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    }

    /**
     * Private method: _prepareSelectResponse.
     *
     * It prepares the data of the select response.
     *
     * @param {SearchResultBindings[]} data The given obj.
     *
     * @returns  {status: number; data: SearchResult | string } An object with a status code, and the data as SearchResult or string.
     */
    private _prepareSelectResponse(data: SearchResultBindings[]): { status: number; data: SearchResult | string } {
        if (!data) {
            return;
        }

        // Check that it didn't return null results
        if (data[0] == null) {
            return { status: 400, data: 'Query returned no results' };
        }
        // Get variable keys
        const varKeys = Object.keys(data[0]);

        // Get object array
        const b = data;

        // Rename keys according to below mapping table
        const map = {
            token: 'type',
            type: 'datatype',
            lang: 'xml:lang',
        };

        // Loop over data to rename the keys
        for (const i in b) {
            if (b.hasOwnProperty(i)) {
                for (const key in varKeys) {
                    if (varKeys.hasOwnProperty(key)) {
                        // Map keys
                        b[i][varKeys[key]] = this._mapKeys(b[i][varKeys[key]], map);

                        // Add label with short prefix
                        b[i][varKeys[key]]['label'] = '';
                        if (b[i][varKeys[key]]['value']) {
                            b[i][varKeys[key]]['label'] = this.prefixPipe.transform(
                                b[i][varKeys[key]]['value'],
                                PrefixForm.short
                            );

                            // Transform integer values to numbers
                            const xmlsInteger = 'http://www.w3.org/2001/XMLSchema#integer';
                            if (
                                b[i][varKeys[key]]['type'] === 'literal' &&
                                b[i][varKeys[key]]['datatype'] === xmlsInteger
                            ) {
                                b[i][varKeys[key]]['label'] = +b[i][varKeys[key]]['value'];
                            }
                        }
                    }
                }
            }
        }

        // Re-format data
        const reformatted: SearchResult = { head: { vars: varKeys }, body: { bindings: b } };

        return { status: 200, data: reformatted };
    }
}
