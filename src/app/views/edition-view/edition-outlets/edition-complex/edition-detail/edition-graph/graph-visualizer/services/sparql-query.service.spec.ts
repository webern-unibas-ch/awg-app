import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import type { Quad } from '@rdfjs/types';
import { DataFactory } from 'n3';

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { RdfStoreSelectResult } from '../rdf-store/rdf-store.model';
import { RdfStoreService } from '../rdf-store/rdf-store.service';
import { DEFAULT_PREFIXES } from '../utils/prefix.utils';
import { SparqlQueryService } from './sparql-query.service';

const { literal, namedNode, quad } = DataFactory;

const EX = 'http://example.org/';
const AWG = DEFAULT_PREFIXES['awg'];
const TURTLE = `@prefix ex: <${EX}> .\nex:a ex:p ex:b .\nex:a ex:q "x" .`;

describe('SparqlQueryService (DONE)', () => {
    let service: SparqlQueryService;

    let mockRdfStoreService: { construct: Spy; select: Spy };

    let expectedQuads: Quad[];
    let expectedSelectResult: RdfStoreSelectResult;

    beforeEach(() => {
        // Test data
        expectedQuads = [quad(namedNode(`${EX}a`), namedNode(`${EX}p`), namedNode(`${EX}b`)) as Quad];
        expectedSelectResult = { variables: ['s'], bindings: [{ s: namedNode(`${EX}a`) }] };

        // Mock services
        mockRdfStoreService = {
            construct: vi.fn().mockResolvedValue(expectedQuads),
            select: vi.fn().mockResolvedValue(expectedSelectResult),
        };

        TestBed.configureTestingModule({
            providers: [{ provide: RdfStoreService, useValue: mockRdfStoreService }],
        });

        service = TestBed.inject(SparqlQueryService);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(service).toBeTruthy();
    });

    describe('#parseTurtle()', () => {
        it('... should have a method `parseTurtle`', () => {
            expect(service.parseTurtle).toBeDefined();
        });

        it('... should hold the number of quads and the declared prefixes', async () => {
            const result = await service.parseTurtle(TURTLE);

            expectToBe(result.quadCount, 2);
            expectToEqual(result.prefixes, { ex: EX });
        });

        it('... should hold frozen prefixes', async () => {
            const { prefixes } = await service.parseTurtle(TURTLE);

            expectToBe(Object.isFrozen(prefixes), true);
        });

        it('... should hold no quads and no prefixes for empty turtle data', async () => {
            expectToEqual(await service.parseTurtle(''), { quadCount: 0, prefixes: {} });
        });

        it('... should reject invalid turtle data with the line of the error and keep the parser error as cause', async () => {
            const invalidTurtle = `@prefix ex: <${EX}> .\nex:a ex:p ex:b .\nex:c ex:p .\n`;

            const error = await service.parseTurtle(invalidTurtle).catch((err: Error) => err);

            expectToBe(
                (error as Error).message,
                '[SparqlQueryService] Invalid turtle: Expected entity but got . on line 3.'
            );
            expect((error as Error).cause).toBeInstanceOf(Error);
        });
    });

    describe('#run()', () => {
        it('... should have a method `run`', () => {
            expect(service.run).toBeDefined();
        });

        describe('... for construct queries', () => {
            it('... should construct the quads via the RdfStoreService', async () => {
                const query = 'CONSTRUCT WHERE { ?s ?p ?o }';

                const run = await service.run(query, TURTLE);

                expectSpyCall(mockRdfStoreService.construct, 1, [TURTLE, query]);
                expectSpyCall(mockRdfStoreService.select, 0);
                expectToEqual(run.result, {
                    kind: 'construct',
                    quads: expectedQuads,
                    prefixes: { ...DEFAULT_PREFIXES, ex: EX },
                });
            });
        });

        describe('... for select queries', () => {
            it('... should select the bindings via the RdfStoreService', async () => {
                const query = 'SELECT ?s WHERE { ?s ?p ?o }';

                const run = await service.run(query, TURTLE);

                expectSpyCall(mockRdfStoreService.select, 1, [TURTLE, query]);
                expectSpyCall(mockRdfStoreService.construct, 0);
                expectToEqual(run.result, {
                    kind: 'select',
                    variables: expectedSelectResult.variables,
                    bindings: expectedSelectResult.bindings,
                    prefixes: { ...DEFAULT_PREFIXES, ex: EX },
                });
            });
        });

        describe('... for other queries', () => {
            it('... should hold an unsupported result with the query type', async () => {
                const run = await service.run('ASK { ?s ?p ?o }', TURTLE);

                expectToEqual(run.result, { kind: 'unsupported', queryType: 'ask' });
                expectSpyCall(mockRdfStoreService.construct, 0);
                expectSpyCall(mockRdfStoreService.select, 0);
            });

            it('... should hold an unsupported result with null if the query type is unknown', async () => {
                const run = await service.run('WHERE { ?s ?p ?o }', TURTLE);

                expectToEqual(run.result, { kind: 'unsupported', queryType: null });
            });
        });

        describe('... prefixes', () => {
            it('... should declare missing prefixes from the turtle data and the default prefixes', async () => {
                const query = 'SELECT ?s WHERE { ?s ex:p awg:x }';

                const run = await service.run(query, TURTLE);

                expectToBe(run.query, `PREFIX ex: <${EX}>\nPREFIX awg: <${AWG}>\n${query}`);
                expectSpyCall(mockRdfStoreService.select, 1, [TURTLE, run.query]);
            });

            it('... should keep a query with all prefixes declared', async () => {
                const query = `PREFIX ex: <${EX}>\nSELECT ?s WHERE { ?s ex:p ?o }`;

                expectToBe((await service.run(query, TURTLE)).query, query);
            });

            it('... should prefer the prefixes of the turtle data over the default prefixes', async () => {
                const otherAwg = 'http://example.org/other-awg#';
                const turtle = `@prefix awg: <${otherAwg}> .\nawg:a awg:p awg:b .`;

                const run = await service.run('CONSTRUCT WHERE { ?s awg:p ?o }', turtle);

                expectToBe(run.query.startsWith(`PREFIX awg: <${otherAwg}>\n`), true);
                expectToBe(run.result.kind === 'construct' && run.result.prefixes['awg'], otherAwg);
            });

            it('... should reject unknown prefixes without querying the RdfStoreService', async () => {
                await expect(service.run('SELECT ?s WHERE { ?s foo:p bar:o }', TURTLE)).rejects.toThrow(
                    '[SparqlQueryService] Unknown prefix(es): foo, bar.'
                );
                expectSpyCall(mockRdfStoreService.select, 0);
            });
        });

        describe('... errors', () => {
            it('... should reject invalid turtle data without querying the RdfStoreService', async () => {
                await expect(service.run('CONSTRUCT WHERE { ?s ?p ?o }', 'ex:a ex:p .')).rejects.toThrow(
                    '[SparqlQueryService] Invalid turtle:'
                );
                expectSpyCall(mockRdfStoreService.construct, 0);
            });

            it('... should pass on errors of the RdfStoreService', async () => {
                const error = new Error('[RdfStoreService] Unknown filter expression type');
                mockRdfStoreService.select.mockRejectedValue(error);

                await expect(service.run('SELECT (COUNT(?s) AS ?n) WHERE { ?s ?p ?o }', TURTLE)).rejects.toBe(error);
            });
        });

        describe('... duration', () => {
            it('... should hold the duration of the run in milliseconds', async () => {
                vi.spyOn(performance, 'now').mockReturnValueOnce(100).mockReturnValueOnce(142.5);

                const run = await service.run('SELECT ?s WHERE { ?s ?p ?o }', TURTLE);

                expectToBe(run.durationMs, 42.5);
            });
        });
    });

    describe('#_toPrefixMap()', () => {
        it('... should have a method `_toPrefixMap`', () => {
            expect(service['_toPrefixMap']).toBeDefined();
        });

        it('... should convert namespaces given as strings or named nodes', () => {
            expectToEqual(service['_toPrefixMap']({ ex: EX, awg: namedNode(AWG) }), { ex: EX, awg: AWG });
        });

        it('... should hold an empty map for missing prefixes', () => {
            expectToEqual(service['_toPrefixMap'](undefined), {});
        });
    });

    describe('#_error()', () => {
        it('... should have a method `_error`', () => {
            expect(service['_error']).toBeDefined();
        });

        it('... should prefix the message with the location and keep a given cause', () => {
            const cause = literal('x');
            const error = service['_error']('Something failed.', cause);

            expectToBe(error.message, '[SparqlQueryService] Something failed.');
            expectToBe(error.cause, cause);
        });

        it('... should not set a cause if none is given', () => {
            expect(service['_error']('Something failed.').cause).toBeUndefined();
        });
    });
});
