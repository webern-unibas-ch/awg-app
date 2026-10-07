import { Injectable } from '@angular/core';

import type { Quad, Quad_Object, Quad_Predicate, Quad_Subject } from '@rdfjs/types';
import { DataFactory } from 'n3';

import { RdfTerm } from '../models/rdf.model';
import {
    RdfStore,
    RdfStoreConstructResponse,
    RdfStoreGlobal,
    RdfStoreNode,
    RdfStoreSelectResponse,
    RdfStoreSelectResult,
    RdfStoreToken,
} from './rdf-store.model';

const { blankNode, literal, namedNode, quad } = DataFactory;

/**
 * String constant: ERROR_LOCATION.
 *
 * It keeps the location prefix of all error messages of the service.
 */
const ERROR_LOCATION = '[RdfStoreService]';

/**
 * The RdfStore service.
 *
 * It is the adapter to the rdfstore engine: it loads turtle data into a new in-memory store,
 * executes SPARQL queries and converts the responses into RDF/JS terms.
 * It is the only place that knows the rdfstore API and response formats.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class RdfStoreService {
    /**
     * Public method: construct.
     *
     * It executes a CONSTRUCT query against the given turtle data.
     *
     * @param {string} turtle The given turtle data.
     * @param {string} query The given CONSTRUCT query.
     * @returns {Promise<Quad[]>} A promise of the constructed quads.
     */
    async construct(turtle: string, query: string): Promise<Quad[]> {
        const response = await this._execute<RdfStoreConstructResponse | null>(turtle, query);

        return (response?.triples ?? []).map(triple =>
            quad(
                this._toSubject(this._nodeToTerm(triple.subject)),
                this._toPredicate(this._nodeToTerm(triple.predicate)),
                this._nodeToTerm(triple.object) as Quad_Object
            )
        );
    }

    /**
     * Public method: select.
     *
     * It executes a SELECT query against the given turtle data.
     *
     * @param {string} turtle The given turtle data.
     * @param {string} query The given SELECT query.
     * @returns {Promise<RdfStoreSelectResult>} A promise of the variables and bindings.
     */
    async select(turtle: string, query: string): Promise<RdfStoreSelectResult> {
        const rows = (await this._execute<RdfStoreSelectResponse | null>(turtle, query)) ?? [];

        const variables = rows.length ? Object.keys(rows[0]) : [];
        const bindings = rows.map(row =>
            Object.freeze(
                Object.fromEntries(
                    Object.entries(row)
                        .filter((entry): entry is [string, RdfStoreToken] => entry[1] != null)
                        .map(([variable, token]) => [variable, this._tokenToTerm(token)])
                )
            )
        );

        return { variables, bindings };
    }

    /**
     * Private method: _execute.
     *
     * It creates a new store, loads the turtle data and executes the query.
     *
     * @param {string} turtle The given turtle data.
     * @param {string} query The given query.
     * @returns {Promise<T>} A promise of the raw response.
     */
    private async _execute<T>(turtle: string, query: string): Promise<T> {
        const store = await this._createStore();
        await this._load(store, turtle);

        return this._query<T>(store, query);
    }

    /**
     * Private method: _createStore.
     *
     * It creates a new in-memory store.
     *
     * @returns {Promise<RdfStore>} A promise of the store.
     */
    private _createStore(): Promise<RdfStore> {
        const rdfstore = (globalThis as { rdfstore?: RdfStoreGlobal }).rdfstore;

        return new Promise((resolve, reject) => {
            if (!rdfstore?.create) {
                reject(this._error('rdfstore is not available in the current runtime.'));
                return;
            }
            rdfstore.create((err, store) => {
                if (err) {
                    reject(this._toError(err, 'An unknown error occurred while creating the store.'));
                    return;
                }
                resolve(store);
            });
        });
    }

    /**
     * Private method: _load.
     *
     * It loads the given turtle data into the given store.
     *
     * @param {RdfStore} store The given store.
     * @param {string} turtle The given turtle data.
     * @returns {Promise<number>} A promise of the number of loaded triples.
     */
    private _load(store: RdfStore, turtle: string): Promise<number> {
        return new Promise((resolve, reject) => {
            store.load('text/turtle', turtle, (err, size) => {
                if (err) {
                    reject(this._toError(err, 'An unknown error occurred while loading the triples.'));
                    return;
                }
                resolve(size);
            });
        });
    }

    /**
     * Private method: _query.
     *
     * It executes the given query against the given store.
     *
     * @param {RdfStore} store The given store.
     * @param {string} query The given query.
     * @returns {Promise<T>} A promise of the raw response.
     */
    private _query<T>(store: RdfStore, query: string): Promise<T> {
        return new Promise((resolve, reject) => {
            store.execute(query, (err, result) => {
                if (err) {
                    reject(this._toError(err, 'An unknown error occurred while executing the query.'));
                    return;
                }
                resolve(result as T);
            });
        });
    }

    /**
     * Private method: _nodeToTerm.
     *
     * It converts a node of a CONSTRUCT response into an RDF/JS term.
     *
     * @param {RdfStoreNode} node The given node.
     * @returns {RdfTerm} The term.
     */
    private _nodeToTerm(node: RdfStoreNode): RdfTerm {
        switch (node.interfaceName) {
            case 'NamedNode':
                return namedNode(node.nominalValue);
            case 'BlankNode':
                return blankNode(String(node.bnodeId ?? this._stripBlankNodePrefix(node.nominalValue)));
            case 'Literal': {
                const datatype = typeof node.datatype === 'string' ? node.datatype : node.datatype?.nominalValue;
                return this._literal(node.nominalValue, node.language, datatype);
            }
            default:
                throw this._error(`Unknown node type: ${String(node.interfaceName)}.`);
        }
    }

    /**
     * Private method: _tokenToTerm.
     *
     * It converts a token of a SELECT response into an RDF/JS term.
     *
     * @param {RdfStoreToken} token The given token.
     * @returns {RdfTerm} The term.
     */
    private _tokenToTerm(token: RdfStoreToken): RdfTerm {
        const value = String(token.value);

        switch (token.token) {
            case 'uri':
                return namedNode(value);
            case 'blank':
                return blankNode(this._stripBlankNodePrefix(value));
            case 'literal':
                return this._literal(value, token.lang, token.type);
            default:
                throw this._error(`Unknown token type: ${String(token.token)}.`);
        }
    }

    /**
     * Private method: _literal.
     *
     * It creates a literal with an optional language tag or datatype.
     *
     * @param {string} value The given value.
     * @param {string} [language] The optional language tag.
     * @param {string} [datatype] The optional datatype IRI.
     * @returns {RdfTerm} The literal.
     */
    private _literal(value: string, language?: string, datatype?: string): RdfTerm {
        if (language) {
            return literal(value, language);
        }
        return datatype ? literal(value, namedNode(datatype)) : literal(value);
    }

    /**
     * Private method: _toSubject.
     *
     * It narrows a term to a valid subject (named node or blank node).
     *
     * @param {RdfTerm} term The given term.
     * @returns {Quad_Subject} The subject.
     */
    private _toSubject(term: RdfTerm): Quad_Subject {
        if (term.termType === 'Literal') {
            throw this._error(`Invalid subject: literal "${term.value}".`);
        }
        return term;
    }

    /**
     * Private method: _toPredicate.
     *
     * It narrows a term to a valid predicate (named node).
     *
     * @param {RdfTerm} term The given term.
     * @returns {Quad_Predicate} The predicate.
     */
    private _toPredicate(term: RdfTerm): Quad_Predicate {
        if (term.termType !== 'NamedNode') {
            throw this._error(`Invalid predicate: ${term.termType} "${term.value}".`);
        }
        return term;
    }

    /**
     * Private method: _stripBlankNodePrefix.
     *
     * It removes the `_:` prefix of a blank node value.
     *
     * @param {string} value The given value.
     * @returns {string} The blank node id.
     */
    private _stripBlankNodePrefix(value: string): string {
        return value.startsWith('_:') ? value.slice(2) : value;
    }

    /**
     * Private method: _error.
     *
     * It creates an Error with the given message, prefixed with the location of the service.
     *
     * @param {string} message The given message.
     * @param {unknown} [cause] The optional original error.
     * @returns {Error} The error.
     */
    private _error(message: string, cause?: unknown): Error {
        return new Error(`${ERROR_LOCATION} ${message}`, cause === undefined ? undefined : { cause });
    }

    /**
     * Private method: _toError.
     *
     * It converts an unknown error of rdfstore into an Error with the location of the service.
     * The original error is kept as `cause`.
     *
     * @param {unknown} err The given error.
     * @param {string} fallbackMessage The message if the error has none.
     * @returns {Error} The error.
     */
    private _toError(err: unknown, fallbackMessage: string): Error {
        if (err instanceof Error) {
            return this._error(err.message || fallbackMessage, err);
        }
        return this._error(typeof err === 'string' ? err : fallbackMessage, err);
    }
}
