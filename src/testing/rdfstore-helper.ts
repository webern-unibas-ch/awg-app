// The relative path lets esbuild bundle the file with the text loader
// (a bare `rdfstore` import would be externalized and loaded as module).
import rdfstoreBundle from '../../node_modules/rdfstore/dist/rdfstore_min.js' with { loader: 'text' };

import { vi } from 'vitest';

import {
    RdfStore,
    RdfStoreGlobal,
    RdfStoreNode,
    RdfStoreToken,
} from '@awg-views/edition-view/edition-outlets/edition-complex/edition-detail/edition-graph/graph-visualizer/rdf-store/rdf-store.model';

/**
 * The MockRdfstoreOptions interface.
 *
 * It configures the callbacks of a mocked rdfstore.
 */
export interface MockRdfstoreOptions {
    /**
     * The error passed to the callback of `create`.
     */
    createError?: unknown;

    /**
     * The error passed to the callback of `load`.
     */
    loadError?: unknown;

    /**
     * The error passed to the callback of `execute`.
     */
    executeError?: unknown;

    /**
     * The raw response passed to the callback of `execute`.
     */
    response?: unknown;
}

/**
 * Helper function: setGlobalRdfstore.
 *
 * It sets (or removes) the global rdfstore that the RdfStoreService uses.
 *
 * @param {RdfStoreGlobal | undefined} rdfstore The given rdfstore, or undefined to remove it.
 * @returns {void} Sets the global rdfstore.
 */
export function setGlobalRdfstore(rdfstore: RdfStoreGlobal | undefined): void {
    (globalThis as { rdfstore?: RdfStoreGlobal }).rdfstore = rdfstore;
}

/**
 * Helper function: createRealRdfstore.
 *
 * It creates a new real (not mocked) rdfstore by evaluating its browser bundle
 * (added as script via angular.json in the app)
 * and returns the `rdfstore` object, without setting a global.
 * It works in the jsdom and in the browser test runner.
 *
 * @returns {RdfStoreGlobal} The real rdfstore object.
 */
export function createRealRdfstore(): RdfStoreGlobal {
    return new Function(`${rdfstoreBundle}\nreturn rdfstore;`)() as RdfStoreGlobal;
}

/**
 * Helper function: createMockRdfstore.
 *
 * It creates a mocked rdfstore with a store that answers with the given raw response.
 * All methods are spies.
 *
 * @param {MockRdfstoreOptions} [options] The optional options.
 * @returns {{ rdfstore: RdfStoreGlobal; store: RdfStore }} The mocked rdfstore and its store.
 */
export function createMockRdfstore(options: MockRdfstoreOptions = {}): { rdfstore: RdfStoreGlobal; store: RdfStore } {
    const store: RdfStore = {
        load: vi.fn((_mimeType, _data, callback) => callback(options.loadError ?? null, 1)),
        execute: vi.fn((_query, callback) => callback(options.executeError ?? null, options.response)),
    };
    const rdfstore: RdfStoreGlobal = {
        create: vi.fn(callback => callback(options.createError ?? null, store)),
    };
    return { rdfstore, store };
}

/**
 * Helper function: createRdfStoreNode.
 *
 * It creates a node of a CONSTRUCT response of rdfstore.
 *
 * @param {RdfStoreNode['interfaceName']} interfaceName The type of the node.
 * @param {string} nominalValue The value of the node.
 * @param {Partial<RdfStoreNode>} [extra] Optional further properties (e.g. language, datatype).
 * @returns {RdfStoreNode} The node.
 */
export function createRdfStoreNode(
    interfaceName: RdfStoreNode['interfaceName'],
    nominalValue: string,
    extra: Partial<RdfStoreNode> = {}
): RdfStoreNode {
    return { interfaceName, nominalValue, ...extra };
}

/**
 * Helper function: createRdfStoreToken.
 *
 * It creates a token (bound value) of a SELECT response of rdfstore.
 *
 * @param {RdfStoreToken['token']} type The type of the token.
 * @param {string | number} value The value of the token.
 * @param {Partial<RdfStoreToken>} [extra] Optional further properties (e.g. lang, type).
 * @returns {RdfStoreToken} The token.
 */
export function createRdfStoreToken(
    type: RdfStoreToken['token'],
    value: string | number,
    extra: Partial<RdfStoreToken> = {}
): RdfStoreToken {
    return { token: type, value, ...extra };
}
