import { Injectable } from '@angular/core';

import * as N3 from 'n3';
declare var rdfstore;

/*
 * This service is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */

export interface Qres {
    actions?;
    duplicates?: object[];
    triples?: Triple[];
}

export interface Triple {
    subject: TripleComponent;
    predicate: TripleComponent;
    object: TripleComponent;
}

export interface TripleComponent {
    nominalValue;
}

@Injectable()
export class EditionGraphService {
    private store; // rdfstore

    constructor() {}

    appendPrefixesToQuery(query: string, triples: string): string {
        if (!query || !triples) {
            return;
        }
        // Get prefixes from triples
        const prefixes = this.extractPrefixesFromTTL(triples);

        // Get prefixes in query
        const namespaces = this.nameSpacesInQuery(query);

        // Append the used namespaces to the query
        const keys = Object.keys(prefixes);
        let pfxString = '';
        keys.forEach(key => {
            if (namespaces.indexOf(key) !== -1) {
                pfxString += `PREFIX ${key} ${prefixes[key]}\n`;
            }
        });

        if (pfxString !== '') {
            query = pfxString + '\n' + query;
        }

        return query;
    }

    doQuery(queryType, query, triples, mimeType?) {
        if (!mimeType) {
            mimeType = 'text/turtle';
        }

        console.log('----------');
        console.log('PERFORMING query with: ');
        console.log(query);
        console.log(triples);
        console.log('QUERYTYPE', queryType);
        console.log('----------');

        return this.createStore()
            .then(store => {
                // console.log('STORE', store);
                this.store = store;

                return this.loadTriplesInStore(store, triples, mimeType);
            })
            .then(storeSize => {
                // console.log('STORESIZE', storeSize);
                return this.executeQuery(this.store, query);
            })
            .then(res => {
                console.log('RES', res);
                const data: Qres = res;

                // Reformat data if select query
                if (queryType === 'select') {
                    console.log('got SELECT request');
                    // return this.sparqlJSON(data).data;
                }

                /**
                 * NB! THE PREFIXING SHOULD BE HANDLED BY A PIPE!
                 */

                // Get prefixes
                return this.getPrefixes(triples).then(prefixes => {
                    // Process result

                    return data.triples.map((triple: Triple) => {
                        let s = triple.subject.nominalValue;
                        let p = triple.predicate.nominalValue;
                        let o = triple.object.nominalValue;

                        // Abbreviate turtle format
                        if (mimeType === 'text/turtle') {
                            if (this.abbreviate(s, prefixes) != null) {
                                s = this.abbreviate(s, prefixes);
                            }
                            if (this.abbreviate(p, prefixes) != null) {
                                p = this.abbreviate(p, prefixes);
                            }
                            if (this.abbreviate(o, prefixes) != null) {
                                o = this.abbreviate(o, prefixes);
                            }
                        }
                        return { subject: s, predicate: p, object: o };
                    });
                });
            });
    }

    getQuerytype(query) {
        let keyWords = [
            { text: 'select', index: -1 },
            { text: 'construct', index: -1 },
            { text: 'count', index: -1 },
            { text: 'describe', index: -1 },
            { text: 'insert', index: -1 },
            { text: 'delete', index: -1 }
        ];

        // Get indexes and set a variable if at least one matches + store lowest index
        let match = false; // Set to true if some keyword match is found
        let low = Infinity;

        keyWords = keyWords.map(item => {
            item.index = query.toLowerCase().indexOf(item.text);
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
        const lowest = keyWords.find(item => item.index === low);
        if (!lowest) {
            return null;
        }
        const type = lowest.text;

        if (type === 'insert' || type === 'delete') {
            return 'update';
        }

        return type;
    }

    private abbreviate(foi, prefixes) {
        let newVal = null;
        // If FoI has 'http' in its name, continue
        if (foi.indexOf('http') !== -1) {
            // Loop over prefixes
            Object.entries(prefixes).forEach(([key, value], index) => {
                // If the FoI has the prefixed namespace in its name, return it
                if (foi.indexOf(value) !== -1) {
                    newVal = foi.replace(value, key + ':');
                }
            });
        }
        return newVal;
    }

    private createStore() {
        return new Promise((resolve, reject) => {
            rdfstore.create((err, store) => {
                if (err) {
                    reject(err);
                }
                resolve(store);
            });
        });
    }

    private executeQuery(store, query) {
        // console.log('executeQuery# QUERY', query);
        return new Promise((resolve, reject) => {
            store.execute(query, (err, res) => {
                if (err) {
                    console.log('executeQuery# got ERROR', err);
                    reject(err);
                }
                console.log('executeQuery# RESOLVED', res);
                resolve(res);
            });
        });
    }

    private extractPrefixesFromTTL(triples) {
        // Replace all whitespace characters with a single space and split by space
        // remove empty values
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

    private getPrefixes(triples) {
        // ParseTriples
        const parser = new N3.Parser();

        console.log('PARSER', parser);
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

    private loadTriplesInStore(store, triples, mimeType?) {
        if (!mimeType) {
            mimeType = 'text/turtle';
        }
        return new Promise((resolve, reject) => {
            store.load(mimeType, triples, (err, size) => {
                if (err) {
                    console.log('loadTriplesInStore# got error', err);
                    reject(err);
                }
                // console.log('loadTriplesInStore# resolved', size);
                resolve(size);
            });
        });
    }

    private nameSpacesInQuery(queryString) {
        const array = [];

        const regex = /[a-zA-Z]+:/g;
        let m;

        // tslint:disable-next-line:no-conditional-assignment
        while ((m = regex.exec(queryString)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach(match => {
                if (array.indexOf(match) === -1) {
                    array.push(match);
                }
            });
        }
        return array;
    }

    private renameKeys(obj, newKeys) {
        const keyValues = Object.keys(obj).map(key => {
            const newKey = newKeys[key] || key;
            return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    }

    /*
    TODO: needed only for SELECT request
    private sparqlJSON(data) {
        if (!data) {
            return;
        }
        // Get variable keys
        const varKeys = Object.keys(data[0]);

        // check that it doesn't return null results
        if (data[0][varKeys[0]] == null) {
            return { status: 400, data: 'Query returned no results' };
        }

        // Flatten object array
        const b = _.flatMap(data);

        // Rename keys according to below mapping table
        const map = {
            token: 'type',
            type: 'datatype',
            lang: 'xml:lang'
        };

        // Loop over data to rename the keys
        for (const i in b) {
            if (b.hasOwnProperty(i)) {
                for (const key in varKeys) {
                    if (varKeys.hasOwnProperty(key)) {
                        b[i][varKeys[key]] = this.renameKeys(b[i][varKeys[key]], map);
                    }
                }
            }
        }

        // Re-format data
        const reformatted = { head: { vars: varKeys }, results: { bindings: b } };

        return { status: 200, data: reformatted };
    }*/
}
