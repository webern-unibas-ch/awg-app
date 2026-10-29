import { TestBed } from '@angular/core/testing';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { RdfStore, RdfStoreModule } from '@awg-graph/graph-visualizer/rdf-store/rdf-store.model';
import { RdfStoreService } from '@awg-graph/graph-visualizer/rdf-store/rdf-store.service';

import { expectSpyCall, expectToBe, expectToEqual } from './expect-helper';
import {
    createMockRdfstore,
    createRdfStoreNode,
    createRdfStoreToken,
    RDFSTORE_INTEGRATION_TIMEOUT_MS,
    spyOnRdfstoreImport,
} from './rdfstore-helper';

/**
 * Helper function: createStore.
 *
 * It creates a store from the given rdfstore and resolves it (or rejects with the error).
 */
const createStore = (rdfstore: RdfStoreModule): Promise<RdfStore> =>
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- rdfstore passes its errors as unknown
    new Promise((resolve, reject) => rdfstore.create((err, store) => (err ? reject(err) : resolve(store))));

describe('rdfstore-helper', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('#spyOnRdfstoreImport()', () => {
        it('... should have a method `spyOnRdfstoreImport`', () => {
            expect(spyOnRdfstoreImport).toBeDefined();
        });

        it('... should let the service import the given rdfstore', async () => {
            const service = TestBed.inject(RdfStoreService);
            const { rdfstore } = createMockRdfstore();

            const importSpy = spyOnRdfstoreImport(service, rdfstore);

            expectToBe(await service['_importRdfstore'](), rdfstore);
            expectSpyCall(importSpy, 1);
        });
    });

    describe('RDFSTORE_INTEGRATION_TIMEOUT_MS', () => {
        it('... should hold a timeout of 10 seconds', () => {
            expectToBe(RDFSTORE_INTEGRATION_TIMEOUT_MS, 10_000);
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
            const rdfStoreNode = createRdfStoreNode('NamedNode', 'http://example.org/a');

            expectToEqual(rdfStoreNode, {
                interfaceName: 'NamedNode',
                nominalValue: 'http://example.org/a',
            });
        });

        it('... should add the given extra properties', () => {
            const rdfStoreNode = createRdfStoreNode('Literal', 'x', { language: 'de' });

            expectToEqual(rdfStoreNode, {
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
            const rdfStoreToken = createRdfStoreToken('uri', 'http://example.org/a');

            expectToEqual(rdfStoreToken, {
                token: 'uri',
                value: 'http://example.org/a',
            });
        });

        it('... should add the given extra properties', () => {
            const rdfStoreToken = createRdfStoreToken('literal', 5, {
                type: 'http://www.w3.org/2001/XMLSchema#integer',
            });

            expectToEqual(rdfStoreToken, {
                token: 'literal',
                value: 5,
                type: 'http://www.w3.org/2001/XMLSchema#integer',
            });
        });
    });
});
