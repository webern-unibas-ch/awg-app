/*
 * This service is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */

import { Injectable } from '@angular/core';

import * as N3 from 'n3';

import {
    Namespace,
    QueryResult,
    QueryTypeIndex,
    PrefixForm,
    SelectResponse,
    SelectResponseBindings,
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
     * Public method: appendNamespacesToQuery.
     *
     * It appends namespaces for prefixes used in a SPARQL query.
     *
     * @param {string} query The given query.
     * @param {string} ttlString The given turtle string with possible prefixes.
     *
     * @returns {string} The query with appended namespaces.
     */
    appendNamespacesToQuery(query: string, ttlString: string): string {
        if (!query || !ttlString) {
            return;
        }
        // Get namespaces from triples
        const namespaces: Namespace = this._extractNamespacesFromTTL(ttlString);

        // Get prefixes from query
        const prefixes: string[] = this._extractPrefixesFromQuery(query);

        // Append the used namespaces to the query
        const keys = Object.keys(namespaces);
        let pfxString = '';
        keys.forEach(key => {
            if (prefixes.indexOf(key) !== -1) {
                pfxString += `PREFIX ${key} ${namespaces[key]}\n`;
            }
        });

        if (pfxString !== '') {
            query = pfxString + '\n' + query;
        }

        return query;
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
    ): Promise<string | SelectResponse | Triple[]> {
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
     * Private method: _extractNamespacesFromTTL.
     *
     * It extracts the namespaces from a given triple string.
     *
     * @param {string} triples The given triple string.
     *
     * @returns {Promise<Namespace>} A promise of the namespaces.
     */
    private _extractNamespacesFromTTL(triples: string) {
        // Replace all whitespace characters with a single space and split by space
        // Remove empty values
        const arr = triples
            .replace(/\s/g, ' ')
            .split(' ')
            .filter(el => el !== '');

        // Get index of all occurences of @prefix
        const prefixIndexArray = arr.reduce((a, e, i) => {
            if (e === '@prefix') {
                a.push(i);
            }
            return a;
        }, []);

        const obj = {};
        prefixIndexArray.forEach(prefixIndex => {
            obj[arr[prefixIndex + 1]] = arr[prefixIndex + 2];
        });

        return obj;
    }

    /**
     * Private method: _extractPrefixesFromQuery.
     *
     * It identifies the prefixes that are used in a SPARQL query.
     *
     * @param {string} query The given query.
     *
     * @returns {string[]} A string array of the used namespaces.
     */
    private _extractPrefixesFromQuery(query: string): string[] {
        const nameSpaces: string[] = [];

        const regex = /[a-zA-Z]+:/g;
        let m;

        // eslint-disable-next-line no-cond-assign
        while ((m = regex.exec(query)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach(match => {
                if (nameSpaces.indexOf(match) === -1) {
                    nameSpaces.push(match);
                }
            });
        }
        return nameSpaces;
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

    private _prepareSelectResponse(data: SelectResponseBindings[]): { status: number; data: SelectResponse | string } {
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
        const reformatted: SelectResponse = { head: { vars: varKeys }, body: { bindings: b } };

        return { status: 200, data: reformatted };
    }
}
