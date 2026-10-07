import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectSpyCall, expectToBe, expectToEqual } from './expect-helper';
import {
    createMockRdfstore,
    createRdfStoreNode,
    createRdfStoreToken,
    RDFSTORE_INTEGRATION_TIMEOUT_MS,
    createRealRdfstore,
    setGlobalRdfstore,
} from './rdfstore-helper';

import {
    RdfStore,
    RdfStoreGlobal,
} from '@awg-views/edition-view/edition-outlets/edition-complex/edition-detail/edition-graph/graph-visualizer/rdf-store/rdf-store.model';

/**
 * Helper function: createStore.
 *
 * It creates a store from the given rdfstore and resolves it (or rejects with the error).
 */
const createStore = (rdfstore: RdfStoreGlobal): Promise<RdfStore> =>
    new Promise((resolve, reject) => rdfstore.create((err, store) => (err ? reject(err) : resolve(store))));

describe('rdfstore-helper', () => {
    afterEach(() => {
        setGlobalRdfstore(undefined);
    });

    describe('#setGlobalRdfstore()', () => {
        it('... should have a method `setGlobalRdfstore`', () => {
            expect(setGlobalRdfstore).toBeDefined();
        });

        it('... should set the global rdfstore', () => {
            const { rdfstore } = createMockRdfstore();

            setGlobalRdfstore(rdfstore);

            expectToBe((globalThis as { rdfstore?: RdfStoreGlobal }).rdfstore, rdfstore);
        });

        it('... should remove the global rdfstore', () => {
            setGlobalRdfstore(createMockRdfstore().rdfstore);

            setGlobalRdfstore(undefined);

            expect((globalThis as { rdfstore?: RdfStoreGlobal }).rdfstore).toBeUndefined();
        });
    });

    describe('#createRealRdfstore()', () => {
        it('... should have a method `createRealRdfstore`', () => {
            expect(createRealRdfstore).toBeDefined();
        });

        it('... should load an rdfstore that creates stores with `load` and `execute`', async () => {
            const store = await createStore(createRealRdfstore());

            expectToBe(typeof store.load, 'function');
            expectToBe(typeof store.execute, 'function');
        });

        it('... should not set a global rdfstore', () => {
            createRealRdfstore();

            expect((globalThis as { rdfstore?: RdfStoreGlobal }).rdfstore).toBeUndefined();
        });
    });

    describe('RDFSTORE_INTEGRATION_TIMEOUT_MS', () => {
        it('... should hold a timeout of 60 seconds', () => {
            expectToBe(RDFSTORE_INTEGRATION_TIMEOUT_MS, 60_000);
        });
    });

    describe('#createMockRdfstore()', () => {
        it('... should have a method `createMockRdfstore`', () => {
            expect(createMockRdfstore).toBeDefined();
        });

        it('... should create the mocked store via `create`', async () => {
            const { rdfstore, store } = createMockRdfstore();

            expectToBe(await createStore(rdfstore), store);
        });

        it('... should answer `load` with one loaded triple and `execute` with the given response', () => {
            const response = { triples: [] };
            const { store } = createMockRdfstore({ response });
            const loadCallback = vi.fn();
            const executeCallback = vi.fn();

            store.load('text/turtle', '', loadCallback);
            store.execute('SELECT * WHERE { ?s ?p ?o }', executeCallback);

            expectSpyCall(loadCallback, 1, [null, 1]);
            expectSpyCall(executeCallback, 1, [null, response]);
        });

        it('... should pass the given errors to the callbacks', async () => {
            const createError = new Error('create');
            const loadError = new Error('load');
            const executeError = 'execute';
            const { rdfstore, store } = createMockRdfstore({ createError, loadError, executeError });
            const loadCallback = vi.fn();
            const executeCallback = vi.fn();

            await expect(createStore(rdfstore)).rejects.toBe(createError);
            store.load('text/turtle', '', loadCallback);
            store.execute('', executeCallback);

            expectToBe(loadCallback.mock.calls[0][0], loadError);
            expectToBe(executeCallback.mock.calls[0][0], executeError);
        });

        it('... should provide spies for all methods', () => {
            const { rdfstore, store } = createMockRdfstore();

            expectToBe(vi.isMockFunction(rdfstore.create), true);
            expectToBe(vi.isMockFunction(store.load), true);
            expectToBe(vi.isMockFunction(store.execute), true);
        });
    });

    describe('#createRdfStoreNode()', () => {
        it('... should have a method `createRdfStoreNode`', () => {
            expect(createRdfStoreNode).toBeDefined();
        });

        it('... should create a node with interface name and nominal value', () => {
            expectToEqual(createRdfStoreNode('NamedNode', 'http://example.org/a'), {
                interfaceName: 'NamedNode',
                nominalValue: 'http://example.org/a',
            });
        });

        it('... should add the given extra properties', () => {
            expectToEqual(createRdfStoreNode('Literal', 'x', { language: 'de' }), {
                interfaceName: 'Literal',
                nominalValue: 'x',
                language: 'de',
            });
        });
    });

    describe('#createRdfStoreToken()', () => {
        it('... should have a method `createRdfStoreToken`', () => {
            expect(createRdfStoreToken).toBeDefined();
        });

        it('... should create a token with type and value', () => {
            expectToEqual(createRdfStoreToken('uri', 'http://example.org/a'), {
                token: 'uri',
                value: 'http://example.org/a',
            });
        });

        it('... should add the given extra properties', () => {
            expectToEqual(createRdfStoreToken('literal', 5, { type: 'http://www.w3.org/2001/XMLSchema#integer' }), {
                token: 'literal',
                value: 5,
                type: 'http://www.w3.org/2001/XMLSchema#integer',
            });
        });
    });
});
