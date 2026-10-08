import { inject, Injectable } from '@angular/core';

import { Parser } from 'n3';

import { PrefixMap } from '../models/rdf.model';
import { SparqlQueryRun, SparqlResult } from '../models/sparql-result.model';
import { RdfStoreService } from '../rdf-store/rdf-store.service';
import { DEFAULT_PREFIXES, PREFIX_UTILS } from '../utils/prefix.utils';
import { SPARQL_UTILS } from '../utils/sparql.utils';

/**
 * String constant: ERROR_LOCATION.
 *
 * It keeps the location prefix of all error messages of the service.
 */
const ERROR_LOCATION = '[SparqlQueryService]';

/**
 * The TurtleParseResult interface.
 *
 * It represents the result of parsing turtle data.
 */
export interface TurtleParseResult {
    /**
     * The number of parsed quads.
     */
    readonly quadCount: number;

    /**
     * The prefixes declared in the turtle data.
     */
    readonly prefixes: PrefixMap;
}

/**
 * The SparqlQuery service.
 *
 * It performs SPARQL queries against turtle data:
 * it validates the turtle data, completes missing prefix declarations,
 * dispatches the query by its type to the {@link RdfStoreService}
 * and measures its duration.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class SparqlQueryService {
    /**
     * Private readonly injection variable: _rdfStoreService.
     *
     * It keeps the instance of the injected RdfStoreService.
     */
    private readonly _rdfStoreService = inject(RdfStoreService);

    /**
     * Private variable: _lastTurtleParse.
     *
     * It keeps the turtle data of the latest parse and its (pending) result,
     * so that repeated runs against unchanged turtle data do not parse it again.
     */
    private _lastTurtleParse: { turtle: string; result: Promise<TurtleParseResult> } | undefined;

    /**
     * Public method: run.
     *
     * It performs a given SPARQL query against the given turtle data.
     * Prefixes that are used, but not declared in the query, are declared
     * from the turtle data or the default prefixes.
     *
     * @param {string} query The given SPARQL query.
     * @param {string} turtle The given turtle data.
     * @returns {Promise<SparqlQueryRun>} A promise of the performed query, its result and duration.
     */
    async run(query: string, turtle: string): Promise<SparqlQueryRun> {
        const startTime = performance.now();

        const { prefixes: turtlePrefixes } = await this._parseTurtleCached(turtle);
        const prefixes = PREFIX_UTILS.mergePrefixes(DEFAULT_PREFIXES, turtlePrefixes);

        const { query: completedQuery, unknownPrefixes } = PREFIX_UTILS.addMissingPrefixes(query, prefixes);
        if (unknownPrefixes.length) {
            throw this._error(`Unknown prefix(es): ${unknownPrefixes.join(', ')}.`);
        }

        const result = await this._execute(completedQuery, turtle, prefixes);

        return { query: completedQuery, result, durationMs: performance.now() - startTime };
    }

    /**
     * Public method: parseTurtle.
     *
     * It parses the given turtle data to validate it and to get its prefixes.
     *
     * @param {string} turtle The given turtle data.
     * @returns {Promise<TurtleParseResult>} A promise of the number of quads and the declared prefixes.
     */
    parseTurtle(turtle: string): Promise<TurtleParseResult> {
        return new Promise((resolve, reject) => {
            let quadCount = 0;

            // The n3 parser calls back once per quad and once at the end (without quad).
            // After an error, it does not call back anymore.
            new Parser().parse(turtle, (err, quad, prefixes) => {
                if (err) {
                    reject(this._error(`Invalid turtle: ${err.message}`, err));
                    return;
                }
                if (quad) {
                    quadCount++;
                    return;
                }
                resolve({ quadCount, prefixes: this._toPrefixMap(prefixes) });
            });
        });
    }

    /**
     * Private method: _parseTurtleCached.
     *
     * It parses the given turtle data via {@link parseTurtle},
     * unless it is the same as in the latest parse (then it reuses that result).
     *
     * @param {string} turtle The given turtle data.
     * @returns {Promise<TurtleParseResult>} A promise of the number of quads and the declared prefixes.
     */
    private _parseTurtleCached(turtle: string): Promise<TurtleParseResult> {
        if (this._lastTurtleParse?.turtle !== turtle) {
            this._lastTurtleParse = { turtle, result: this.parseTurtle(turtle) };
        }
        return this._lastTurtleParse.result;
    }

    /**
     * Private method: _execute.
     *
     * It dispatches the given query by its type to the RdfStoreService.
     *
     * @param {string} query The given (completed) query.
     * @param {string} turtle The given turtle data.
     * @param {PrefixMap} prefixes The prefixes for the result.
     * @returns {Promise<SparqlResult>} A promise of the result.
     */
    private async _execute(query: string, turtle: string, prefixes: PrefixMap): Promise<SparqlResult> {
        const queryType = SPARQL_UTILS.getQueryType(query);

        switch (queryType) {
            case 'construct': {
                const quads = await this._rdfStoreService.construct(turtle, query);
                return { kind: 'construct', quads, prefixes };
            }
            case 'select': {
                const { variables, bindings } = await this._rdfStoreService.select(turtle, query);
                return { kind: 'select', variables, bindings, prefixes };
            }
            default:
                return { kind: 'unsupported', queryType };
        }
    }

    /**
     * Private method: _toPrefixMap.
     *
     * It converts the prefixes of the n3 parser into a prefix map.
     * The n3 parser provides the namespaces as strings at runtime,
     * although they are typed as named nodes.
     *
     * @param {Record<string, unknown>} prefixes The given prefixes of the n3 parser.
     * @returns {PrefixMap} The prefix map.
     */
    private _toPrefixMap(prefixes: Record<string, unknown> | undefined): PrefixMap {
        return Object.freeze(
            Object.fromEntries(
                Object.entries(prefixes ?? {}).map(([prefix, namespace]) => [
                    prefix,
                    typeof namespace === 'string' ? namespace : (namespace as { value: string }).value,
                ])
            )
        );
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
}
