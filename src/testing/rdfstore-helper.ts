import { MockInstance, vi } from 'vitest';

import {
    RdfStore,
    RdfStoreModule,
    RdfStoreNode,
    RdfStoreToken,
} from '@awg-graph/graph-visualizer/rdf-store/rdf-store.model';
import { RdfStoreService } from '@awg-graph/graph-visualizer/rdf-store/rdf-store.service';

/**
 * Number constant: RDFSTORE_INTEGRATION_TIMEOUT_MS.
 *
 * It keeps the timeout for integration tests with the real rdfstore.
 * It is far above the expected run time, but low enough to catch a slow `nextTick` polyfill
 * (the browser clamps nested `setTimeout` calls, see `src/polyfills.ts`).
 */
export const RDFSTORE_INTEGRATION_TIMEOUT_MS = 10_000;

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
 * Helper function: spyOnRdfstoreImport.
 *
 * It spies on the import of the rdfstore module in the given RdfStoreService
 * and resolves it with the given rdfstore (e.g. a mocked one), if any.
 *
 * @param {RdfStoreService} service The given service.
 * @param {RdfStoreModule} [rdfstore] The optional rdfstore that the import resolves with.
 * @returns {MockInstance<() => Promise<RdfStoreModule>>} The spy on the import.
 */
export function spyOnRdfstoreImport(
    service: RdfStoreService,
    rdfstore?: RdfStoreModule
): MockInstance<() => Promise<RdfStoreModule>> {
    const serviceWithImport = service as unknown as { _importRdfstore: () => Promise<RdfStoreModule> };
    const importSpy = vi.spyOn(serviceWithImport, '_importRdfstore');
    return rdfstore ? importSpy.mockResolvedValue(rdfstore) : importSpy;
}

/**
 * Helper function: createMockRdfstore.
 *
 * It creates a mocked rdfstore with a store that answers with the given raw response.
 * All methods are spies.
 *
 * @param {MockRdfstoreOptions} [options] The optional options.
 * @returns {{ rdfstore: RdfStoreModule; store: RdfStore }} The mocked rdfstore and its store.
 */
export function createMockRdfstore(options: MockRdfstoreOptions = {}): { rdfstore: RdfStoreModule; store: RdfStore } {
    const store: RdfStore = {
        load: vi.fn((_mimeType, _data, callback) => callback(options.loadError ?? null, 1)),
        execute: vi.fn((_query, callback) => callback(options.executeError ?? null, options.response)),
    };
    const rdfstore: RdfStoreModule = {
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
