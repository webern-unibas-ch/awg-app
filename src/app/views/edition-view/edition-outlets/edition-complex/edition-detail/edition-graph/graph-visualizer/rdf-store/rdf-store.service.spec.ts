import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';

import type { Quad } from '@rdfjs/types';
import { DataFactory } from 'n3';

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import {
    createMockRdfstore,
    createRdfStoreNode,
    createRdfStoreToken,
    setGlobalRdfstore,
} from '@testing/rdfstore-helper';

import { RdfStoreService } from './rdf-store.service';

const { blankNode, literal, namedNode, quad } = DataFactory;

const EX = 'http://example.org/';
const XSD_INTEGER = 'http://www.w3.org/2001/XMLSchema#integer';
const TURTLE = `@prefix ex: <${EX}> . ex:a ex:p ex:b .`;

describe('RdfStoreService (DONE)', () => {
    let service: RdfStoreService;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(RdfStoreService);
    });

    afterEach(() => {
        setGlobalRdfstore(undefined);
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(service).toBeTruthy();
    });

    describe('#construct()', () => {
        it('... should have a method `construct`', () => {
            expect(service.construct).toBeDefined();
        });

        it('... should load the turtle data and execute the query in a new store', async () => {
            const { rdfstore, store } = createMockRdfstore({ response: { triples: [] } });
            setGlobalRdfstore(rdfstore);

            await service.construct(TURTLE, 'CONSTRUCT WHERE { ?s ?p ?o }');

            expectSpyCall(rdfstore.create as any, 1);
            expectToBe((store.load as any).mock.calls[0][0], 'text/turtle');
            expectToBe((store.load as any).mock.calls[0][1], TURTLE);
            expectToBe((store.execute as any).mock.calls[0][0], 'CONSTRUCT WHERE { ?s ?p ?o }');
        });

        it('... should convert named nodes, blank nodes and literals into quads', async () => {
            const triples = [
                {
                    subject: createRdfStoreNode('NamedNode', `${EX}a`),
                    predicate: createRdfStoreNode('NamedNode', `${EX}p`),
                    object: createRdfStoreNode('NamedNode', `${EX}b`),
                },
                {
                    subject: createRdfStoreNode('BlankNode', '_:8', { bnodeId: '8' }),
                    predicate: createRdfStoreNode('NamedNode', `${EX}p`),
                    object: createRdfStoreNode('Literal', 'x'),
                },
                {
                    subject: createRdfStoreNode('BlankNode', '_:9'),
                    predicate: createRdfStoreNode('NamedNode', `${EX}q`),
                    object: createRdfStoreNode('Literal', 'x', { language: 'de' }),
                },
                {
                    subject: createRdfStoreNode('NamedNode', `${EX}a`),
                    predicate: createRdfStoreNode('NamedNode', `${EX}n`),
                    object: createRdfStoreNode('Literal', '5', { datatype: XSD_INTEGER }),
                },
                {
                    subject: createRdfStoreNode('NamedNode', `${EX}a`),
                    predicate: createRdfStoreNode('NamedNode', `${EX}m`),
                    object: createRdfStoreNode('Literal', '6', { datatype: { nominalValue: XSD_INTEGER } }),
                },
            ];
            setGlobalRdfstore(createMockRdfstore({ response: { triples } }).rdfstore);

            const quads = await service.construct(TURTLE, 'CONSTRUCT WHERE { ?s ?p ?o }');

            const expectedQuads: Quad[] = [
                quad(namedNode(`${EX}a`), namedNode(`${EX}p`), namedNode(`${EX}b`)),
                quad(blankNode('8'), namedNode(`${EX}p`), literal('x')),
                quad(blankNode('9'), namedNode(`${EX}q`), literal('x', 'de')),
                quad(namedNode(`${EX}a`), namedNode(`${EX}n`), literal('5', namedNode(XSD_INTEGER))),
                quad(namedNode(`${EX}a`), namedNode(`${EX}m`), literal('6', namedNode(XSD_INTEGER))),
            ];
            expectToBe(quads.length, expectedQuads.length);
            quads.forEach((actualQuad, i) => {
                expectToBe(actualQuad.equals(expectedQuads[i]), true);
            });
        });

        it('... should resolve an empty array if the response has no triples', async () => {
            setGlobalRdfstore(createMockRdfstore({ response: {} }).rdfstore);
            expectToEqual(await service.construct(TURTLE, 'CONSTRUCT WHERE { ?s ?p ?o }'), []);

            setGlobalRdfstore(createMockRdfstore({ response: null }).rdfstore);
            expectToEqual(await service.construct(TURTLE, 'CONSTRUCT WHERE { ?s ?p ?o }'), []);
        });

        it('... should reject for a literal subject', async () => {
            const triples = [
                {
                    subject: createRdfStoreNode('Literal', 'x'),
                    predicate: createRdfStoreNode('NamedNode', `${EX}p`),
                    object: createRdfStoreNode('NamedNode', `${EX}b`),
                },
            ];
            setGlobalRdfstore(createMockRdfstore({ response: { triples } }).rdfstore);

            await expect(service.construct(TURTLE, 'CONSTRUCT WHERE { ?s ?p ?o }')).rejects.toThrow(
                '[RdfStoreService] Invalid subject: literal "x".'
            );
        });

        it('... should reject for a predicate that is not a named node', async () => {
            const triples = [
                {
                    subject: createRdfStoreNode('NamedNode', `${EX}a`),
                    predicate: createRdfStoreNode('BlankNode', '_:1'),
                    object: createRdfStoreNode('NamedNode', `${EX}b`),
                },
            ];
            setGlobalRdfstore(createMockRdfstore({ response: { triples } }).rdfstore);

            await expect(service.construct(TURTLE, 'CONSTRUCT WHERE { ?s ?p ?o }')).rejects.toThrow(
                '[RdfStoreService] Invalid predicate: BlankNode "1".'
            );
        });

        it('... should reject for an unknown node type', async () => {
            const triples = [
                {
                    subject: createRdfStoreNode('Variable' as any, 'x'),
                    predicate: createRdfStoreNode('NamedNode', `${EX}p`),
                    object: createRdfStoreNode('NamedNode', `${EX}b`),
                },
            ];
            setGlobalRdfstore(createMockRdfstore({ response: { triples } }).rdfstore);

            await expect(service.construct(TURTLE, 'CONSTRUCT WHERE { ?s ?p ?o }')).rejects.toThrow(
                '[RdfStoreService] Unknown node type: Variable.'
            );
        });
    });

    describe('#preload()', () => {
        it('... should have a method `preload`', () => {
            expect(service.preload).toBeDefined();
        });

        it('... should start loading the rdfstore script', async () => {
            const loadRdfstoreSpy = vi
                .spyOn(service as any, '_loadRdfstore')
                .mockResolvedValue(createMockRdfstore().rdfstore);

            await service.preload();

            expectSpyCall(loadRdfstoreSpy, 1);
        });

        it('... should resolve even if the loading fails', async () => {
            vi.spyOn(service as any, '_loadRdfstore').mockRejectedValue(new Error('Failed'));

            await expect(service.preload()).resolves.toBeUndefined();
        });
    });

    describe('#select()', () => {
        it('... should have a method `select`', () => {
            expect(service.select).toBeDefined();
        });

        it('... should return the variables of the first row (also unbound ones)', async () => {
            const response = [{ s: createRdfStoreToken('uri', `${EX}a`), x: null }];
            setGlobalRdfstore(createMockRdfstore({ response }).rdfstore);

            const result = await service.select(TURTLE, 'SELECT * WHERE { ?s ?p ?o }');

            expectToEqual(result.variables, ['s', 'x']);
        });

        it('... should convert uris, blank nodes and literals into terms and omit unbound variables', async () => {
            const response = [
                {
                    s: createRdfStoreToken('uri', `${EX}a`),
                    b: createRdfStoreToken('blank', '_:8'),
                    l: createRdfStoreToken('literal', 'x', { lang: 'de' }),
                    t: createRdfStoreToken('literal', '5', { type: XSD_INTEGER }),
                    n: createRdfStoreToken('literal', 7),
                    p: createRdfStoreToken('literal', 'plain'),
                    x: null,
                },
            ];
            setGlobalRdfstore(createMockRdfstore({ response }).rdfstore);

            const { bindings } = await service.select(TURTLE, 'SELECT * WHERE { ?s ?p ?o }');
            const binding = bindings[0];

            expectToEqual(Object.keys(binding), ['s', 'b', 'l', 't', 'n', 'p']);
            expectToBe(binding['s'].equals(namedNode(`${EX}a`)), true);
            expectToBe(binding['b'].equals(blankNode('8')), true);
            expectToBe(binding['l'].equals(literal('x', 'de')), true);
            expectToBe(binding['t'].equals(literal('5', namedNode(XSD_INTEGER))), true);
            expectToBe(binding['n'].equals(literal('7')), true);
            expectToBe(binding['p'].equals(literal('plain')), true);
        });

        it('... should keep blank node values without `_:` prefix as id', async () => {
            setGlobalRdfstore(createMockRdfstore({ response: [{ b: createRdfStoreToken('blank', '8') }] }).rdfstore);

            const { bindings } = await service.select(TURTLE, 'SELECT * WHERE { ?s ?p ?o }');

            expectToBe(bindings[0]['b'].equals(blankNode('8')), true);
        });

        it('... should return frozen bindings', async () => {
            setGlobalRdfstore(createMockRdfstore({ response: [{ s: createRdfStoreToken('uri', `${EX}a`) }] }).rdfstore);

            const { bindings } = await service.select(TURTLE, 'SELECT * WHERE { ?s ?p ?o }');

            expectToBe(Object.isFrozen(bindings[0]), true);
        });

        it('... should resolve empty variables and bindings for an empty or missing response', async () => {
            setGlobalRdfstore(createMockRdfstore({ response: [] }).rdfstore);
            expectToEqual(await service.select(TURTLE, 'SELECT * WHERE { ?s ?p ?o }'), { variables: [], bindings: [] });

            setGlobalRdfstore(createMockRdfstore({ response: null }).rdfstore);
            expectToEqual(await service.select(TURTLE, 'SELECT * WHERE { ?s ?p ?o }'), { variables: [], bindings: [] });
        });

        it('... should reject for an unknown token type', async () => {
            setGlobalRdfstore(
                createMockRdfstore({ response: [{ s: createRdfStoreToken('variable' as any, 'x') }] }).rdfstore
            );

            await expect(service.select(TURTLE, 'SELECT * WHERE { ?s ?p ?o }')).rejects.toThrow(
                '[RdfStoreService] Unknown token type: variable.'
            );
        });
    });

    describe('... error handling', () => {
        const query = 'SELECT * WHERE { ?s ?p ?o }';

        it('... should prefix the message of Error instances and keep them as cause', async () => {
            const error = new Error('Parse error at line 3');
            setGlobalRdfstore(createMockRdfstore({ loadError: error }).rdfstore);

            await expect(service.select(TURTLE, query)).rejects.toMatchObject({
                message: '[RdfStoreService] Parse error at line 3',
                cause: error,
            });
        });

        it('... should prefix string errors and keep them as cause', async () => {
            setGlobalRdfstore(createMockRdfstore({ executeError: 'Unknown filter expression type' }).rdfstore);

            await expect(service.select(TURTLE, query)).rejects.toMatchObject({
                message: '[RdfStoreService] Unknown filter expression type',
                cause: 'Unknown filter expression type',
            });
        });

        it('... should use the fallback message for Error instances without message', async () => {
            const error = new Error('');
            setGlobalRdfstore(createMockRdfstore({ loadError: error }).rdfstore);

            await expect(service.select(TURTLE, query)).rejects.toMatchObject({
                message: '[RdfStoreService] An unknown error occurred while loading the triples.',
                cause: error,
            });
        });

        it('... should reject with the error of a failed script loading without cause', async () => {
            // Keeps the script out of the document, so neither jsdom nor the browser fetches it
            const appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(node => node);

            const selection = service.select(TURTLE, query);
            (appendChildSpy.mock.calls[0][0] as HTMLScriptElement).dispatchEvent(new Event('error'));
            const error = await selection.catch((err: unknown) => err);

            expect(error).toBeInstanceOf(Error);
            expectToBe((error as Error).message, '[RdfStoreService] Failed to load the rdfstore script (rdfstore.js).');
            expect((error as Error).cause).toBeUndefined();
        });

        it('... should use a fallback message for other errors per step and keep them as cause', async () => {
            const createError = { code: 1 };
            setGlobalRdfstore(createMockRdfstore({ createError }).rdfstore);
            await expect(service.select(TURTLE, query)).rejects.toMatchObject({
                message: '[RdfStoreService] An unknown error occurred while creating the store.',
                cause: createError,
            });

            setGlobalRdfstore(createMockRdfstore({ loadError: { code: 2 } }).rdfstore);
            await expect(service.select(TURTLE, query)).rejects.toThrow(
                '[RdfStoreService] An unknown error occurred while loading the triples.'
            );

            setGlobalRdfstore(createMockRdfstore({ executeError: { code: 3 } }).rdfstore);
            await expect(service.select(TURTLE, query)).rejects.toThrow(
                '[RdfStoreService] An unknown error occurred while executing the query.'
            );
        });
    });

    describe('#_loadRdfstore()', () => {
        let appendChildSpy: MockInstance<(node: Node) => Node>;

        const getAppendedScripts = (): HTMLScriptElement[] =>
            appendChildSpy.mock.calls.map(([node]) => node as HTMLScriptElement);

        beforeEach(() => {
            // Fakes the timeout of pending loadings, so it neither outlasts nor slows down the tests
            vi.useFakeTimers();
            // Keeps the script out of the document, so neither jsdom nor the browser fetches it
            appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(node => node);
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('... should have a method `_loadRdfstore`', () => {
            expect(service['_loadRdfstore']).toBeDefined();
        });

        it('... should return the global rdfstore without loading the script if it is available', async () => {
            const { rdfstore } = createMockRdfstore();
            setGlobalRdfstore(rdfstore);

            const loadedRdfstore = await service['_loadRdfstore']();

            expectToBe(loadedRdfstore, rdfstore);
            expectSpyCall(appendChildSpy, 0);
        });

        it('... should load the script once and return the global rdfstore after loading', async () => {
            const { rdfstore } = createMockRdfstore();

            const firstLoading = service['_loadRdfstore']();
            const secondLoading = service['_loadRdfstore']();
            const scripts = getAppendedScripts();
            setGlobalRdfstore(rdfstore);
            scripts[0].dispatchEvent(new Event('load'));
            const loadedRdfstores = await Promise.all([firstLoading, secondLoading]);

            expectSpyCall(appendChildSpy, 1);
            expectToBe(scripts[0].getAttribute('src'), 'rdfstore.js');
            expectToEqual(loadedRdfstores, [rdfstore, rdfstore]);
        });

        it('... should hold no pending loading after a successful loading', async () => {
            const loading = service['_loadRdfstore']();
            setGlobalRdfstore(createMockRdfstore().rdfstore);
            getAppendedScripts()[0].dispatchEvent(new Event('load'));
            await loading;

            expectToBe(service['_rdfstoreLoading'], null);
        });

        it('... should reject and remove the script if rdfstore is not available after loading the script', async () => {
            const loading = service['_loadRdfstore']();
            const script = getAppendedScripts()[0];
            const removeSpy = vi.spyOn(script, 'remove');
            script.dispatchEvent(new Event('load'));

            await expect(loading).rejects.toThrow(
                '[RdfStoreService] rdfstore is not available in the current runtime.'
            );
            expectSpyCall(removeSpy, 1);
        });

        it('... should reject and remove the script if it fails to load, and load it again on the next call', async () => {
            const failedLoading = service['_loadRdfstore']();
            const script = getAppendedScripts()[0];
            const removeSpy = vi.spyOn(script, 'remove');
            script.dispatchEvent(new Event('error'));

            await expect(failedLoading).rejects.toThrow(
                '[RdfStoreService] Failed to load the rdfstore script (rdfstore.js).'
            );
            expectSpyCall(removeSpy, 1);

            void service['_loadRdfstore']();

            expectSpyCall(appendChildSpy, 2);
        });

        it('... should reject and remove the script if the loading times out, and load it again on the next call', async () => {
            const pendingLoading = service['_loadRdfstore']();
            const removeSpy = vi.spyOn(getAppendedScripts()[0], 'remove');
            vi.advanceTimersByTime(30_000);

            await expect(pendingLoading).rejects.toThrow(
                '[RdfStoreService] Timed out loading the rdfstore script (rdfstore.js).'
            );
            expectSpyCall(removeSpy, 1);

            void service['_loadRdfstore']();

            expectSpyCall(appendChildSpy, 2);
        });

        it('... should not time out after a successful loading', async () => {
            const loading = service['_loadRdfstore']();
            const script = getAppendedScripts()[0];
            const removeSpy = vi.spyOn(script, 'remove');
            setGlobalRdfstore(createMockRdfstore().rdfstore);
            script.dispatchEvent(new Event('load'));
            await loading;
            vi.advanceTimersByTime(30_000);

            expectSpyCall(removeSpy, 0);
        });
    });
});
