import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import * as N3 from 'n3';

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';

import {
    QuerySelectResult,
    RDFStoreConstructResponse,
    RDFStoreConstructResponseTriple,
    RDFStoreSelectResponse,
    Triple,
} from '../models';
import { PrefixPipe } from '../prefix-pipe';

import { GraphVisualizerService } from './graph-visualizer.service';

// Mock implementation of rdfstore.Store for testing purposes
class MockStore {
    private _quads: N3.Quad[] = [];

    load(mimeType: string, triples: string, callback: (err: Error | null, size?: number) => void): void {
        if (mimeType !== 'text/turtle' && mimeType !== 'application/ld+json') {
            callback(new Error(`Cannot find parser for the provided media type:${mimeType}`));
            return;
        }

        if (mimeType === 'application/ld+json') {
            const nTriplesParser = new N3.Parser({ format: 'N-Triples' });
            const fakeNTriples =
                '<http://example.org/subject> <http://example.org/predicate> <http://example.org/object> .';
            this._quads = nTriplesParser.parse(fakeNTriples);
            callback(null, this._quads.length);
            return;
        }

        const parser = new N3.Parser();
        const parsed: N3.Quad[] = [];

        parser.parse(triples, (error, quad) => {
            if (error) {
                callback(error);
                return;
            }
            if (quad) {
                parsed.push(quad);
                return;
            }

            this._quads = parsed;
            callback(null, this._quads.length);
        });
    }

    execute(query: string, callback: (err: Error | null, res?: any) => void): void {
        if (!query) {
            callback(new Error('Query must not be empty.'));
            return;
        }

        const lower = query.toLowerCase();

        if (lower.includes('construct')) {
            const triples = this._quads.map(quad => ({
                subject: { nominalValue: quad.subject.value },
                predicate: { nominalValue: quad.predicate.value },
                object: { nominalValue: quad.object.value },
                toString: () => `<${quad.subject.value}> <${quad.predicate.value}> <${quad.object.value}> .`,
            }));
            callback(null, { triples });
            return;
        }

        if (lower.includes('select')) {
            const rows = this._quads.map(quad => ({
                s: this._mapTerm(quad.subject),
                p: this._mapTerm(quad.predicate),
                o: this._mapTerm(quad.object),
            }));
            callback(null, rows);
            return;
        }

        callback(null, []);
    }

    private _mapTerm(term: N3.Term): any {
        if (term.termType === 'Literal') {
            const mapped: Record<string, string> = {
                token: 'literal',
                value: term.value,
                type: term.datatype?.value,
            };
            if (term.language) {
                mapped['lang'] = term.language;
            }
            return mapped;
        }

        return {
            token: 'uri',
            value: term.value,
        };
    }
}

const mockRdfstore = {
    create: (callback: (err: Error | null, store?: MockStore) => void): void => {
        callback(null, new MockStore());
    },
};

describe('GraphVisualizerService', () => {
    let graphVisualizerService: GraphVisualizerService;

    let expectedTriples: Triple[];
    let expectedConstructResponseTriples: RDFStoreConstructResponseTriple[];

    let consoleSpy: Spy;

    beforeEach(() => {
        (globalThis as any).rdfstore = mockRdfstore;

        TestBed.configureTestingModule({
            providers: [GraphVisualizerService, PrefixPipe],
        });

        // Inject services
        graphVisualizerService = TestBed.inject(GraphVisualizerService);

        // Test data
        expectedTriples = [
            {
                subject: 'http://example.org/subject1',
                predicate: 'http://example.org/predicate1',
                object: 'http://example.org/object1',
            },
            {
                subject: 'http://example.org/subject2',
                predicate: 'http://example.org/predicate2',
                object: 'http://example.org/object2',
            },
            {
                subject: 'https://example.org/subject3',
                predicate: 'https://example.org/predicate3',
                object: 'https://example.org/object3',
            },
            {
                subject: 'http://example.org/subject4',
                predicate: 'http://example.org/predicate4',
                object: 'http://example.org/object4',
            },
        ];

        expectedConstructResponseTriples = [
            {
                subject: { nominalValue: 'http://example.org/subject1' },
                predicate: { nominalValue: 'http://example.org/predicate1' },
                object: { nominalValue: 'http://example.org/object1' },
            },
            {
                subject: { nominalValue: 'https://example.org/subject2' },
                predicate: { nominalValue: 'https://example.org/predicate2' },
                object: { nominalValue: 'https://example.org/object2' },
            },
        ];

        // Spies on service functions
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
    });

    afterEach(() => {
        // Clear mock console after each test
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(graphVisualizerService).toBeTruthy();
    });

    it('... should have not _store property yet', () => {
        expect((graphVisualizerService as any)._store).toBeUndefined();
    });

    describe('#checkNamespacesInQuery()', () => {
        it('... should have a method `checkNamespacesInQuery`', () => {
            expect(graphVisualizerService.checkNamespacesInQuery).toBeDefined();
        });

        describe('... should return an empty string if', () => {
            it.each([
                {
                    desc: 'no queryString is given',
                    query: '',
                    triples:
                        '@prefix ex: <http://example.org/> <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>',
                },
                {
                    desc: 'no tripleString is given',
                    query: 'PREFIX ex: <http://example.org/> SELECT * WHERE { ?s ?p ?o }',
                    triples: '',
                },
                {
                    desc: 'no queryString and tripleString is given',
                    query: '',
                    triples: '',
                },
            ])('... $desc', ({ query, triples }) => {
                const result = graphVisualizerService.checkNamespacesInQuery(query, triples);

                expectToBe(result, '');
            });
        });

        it('... should add missing namespaces from the tripleString to the queryString', () => {
            const tripleStr =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
            const queryStr = 'SELECT * WHERE { ?s ?p ?o }';
            const expectedResult = 'PREFIX ex: <http://example.org/>\nSELECT * WHERE { ?s ?p ?o }';

            const result = graphVisualizerService.checkNamespacesInQuery(queryStr, tripleStr);

            expectToBe(result, expectedResult);
        });

        describe('... should check qNames from the query if a qName is not referenced in the list of namespaces and ...', () => {
            describe('if the qName is not in the list of default namespaces', () => {
                it('... error in the console ', () => {
                    const tripleStr =
                        '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>';
                    const queryStr = 'SELECT * WHERE { ?s xyz:composer ?o }';
                    const expectedError = `Prefix 'xyz' is unknown. Please provide a declaration.`;

                    graphVisualizerService.checkNamespacesInQuery(queryStr, tripleStr);

                    expectSpyCall(consoleSpy, 1, [expectedError]);
                });
            });

            describe('if the qName is in the list of default namespaces', () => {
                it('... prepend missing namespaces to the queryString prefixes', () => {
                    const tripleStr =
                        '@prefix ex: <http://example.org/> .\n<http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
                    const queryStr = 'PREFIX ex: <http://example.org/>\nSELECT * WHERE { ?s foaf:age ?o }';
                    const expectedResult = `PREFIX foaf: <http://xmlns.com/foaf/0.1/>\nPREFIX ex: <http://example.org/>\nSELECT * WHERE { ?s foaf:age ?o }`;

                    const result = graphVisualizerService.checkNamespacesInQuery(queryStr, tripleStr);

                    expectToBe(result, expectedResult);
                });
            });
        });

        it('... should throw an error if extractNamespacesFromString() is called with another type than TURTLE or SPARQL', () => {
            const tripleStr =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>';
            const expectedError = 'The type must be TURTLE or SPARQL, but was: undefined.';

            expect(() => (graphVisualizerService as any)._extractNamespacesFromString(undefined, tripleStr)).toThrow(
                expectedError
            );
        });
    });

    describe('#doQuery()', () => {
        it('... should have a method `doQuery`', () => {
            expect(graphVisualizerService.doQuery).toBeDefined();
        });

        it('... should default mimeType to `text/turtle` if not provided', async () => {
            const queryStr = 'CONSTRUCT WHERE { ?s ?p ?o }';
            const tripleStr =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
            const queryType = 'construct';
            const loadTriplesSpy = vi.spyOn(graphVisualizerService as any, '_loadTriplesInStore');

            await graphVisualizerService.doQuery(queryType, queryStr, tripleStr);

            expectSpyCall(loadTriplesSpy, 1, [expect.anything(), tripleStr, 'text/turtle']);
        });

        it('... should keep the provided mimeType and skip the default', async () => {
            const queryStr = 'CONSTRUCT WHERE { ?s ?p ?o }';
            const tripleStr =
                '[{"@id":"http://example.org/object"},{"@id":"http://example.org/subject","http://example.org/predicate":[{"@id":"http://example.org/object"}]}]';
            const queryType = 'construct';
            const mimeType = 'application/ld+json';
            const loadTriplesSpy = vi.spyOn(graphVisualizerService as any, '_loadTriplesInStore');

            await graphVisualizerService.doQuery(queryType, queryStr, tripleStr, mimeType);

            expectSpyCall(loadTriplesSpy, 1, [expect.anything(), tripleStr, mimeType]);
        });

        it('... should create an instance of rdfstore', async () => {
            const queryStr = 'CONSTRUCT WHERE { ?s ?p ?o }';
            const tripleStr =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
            const queryType = 'construct';

            await graphVisualizerService.doQuery(queryType, queryStr, tripleStr);

            expect((graphVisualizerService as any)._store).toBeDefined();
            expectToEqual((graphVisualizerService as any)._store.constructor.name, 'MockStore');
        });

        describe('should perform a given query with a given turtle string against the rdfstore', () => {
            it('... and return Triple[] with CONSTRUCT query', async () => {
                const queryStr = 'CONSTRUCT WHERE { ?s ?p ?o }';
                const tripleStr =
                    '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
                const queryType = 'construct';
                const expectedConstructResult: Triple[] = [
                    {
                        subject: 'ex:subject',
                        predicate: 'ex:predicate',
                        object: 'ex:object',
                    },
                ];

                const result = await graphVisualizerService.doQuery(queryType, queryStr, tripleStr);

                expectToEqual(result, expectedConstructResult);
            });

            it('... and return QuerySelectResult with SELECT query', async () => {
                const queryStr = 'PREFIX ex: <http://example.org/> SELECT * WHERE { ?s ?p ?o . }';
                const tripleStr =
                    '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
                const queryType = 'select';
                const expectedSelectResult: QuerySelectResult = {
                    head: {
                        vars: ['s', 'p', 'o'],
                    },
                    body: {
                        bindings: [
                            {
                                s: {
                                    type: 'uri',
                                    value: 'http://example.org/subject',
                                    label: 'http://example.org/subject',
                                },
                                p: {
                                    type: 'uri',
                                    value: 'http://example.org/predicate',
                                    label: 'http://example.org/predicate',
                                },
                                o: {
                                    type: 'uri',
                                    value: 'http://example.org/object',
                                    label: 'http://example.org/object',
                                },
                            },
                        ],
                    },
                };

                const result = await graphVisualizerService.doQuery(queryType, queryStr, tripleStr);

                expectToEqual(result, expectedSelectResult);
            });

            it('... and transform integer literals to number labels in a SELECT response', async () => {
                const queryStr = 'PREFIX ex: <http://example.org/> SELECT * WHERE { ?s ?p ?o . }';
                const tripleStr =
                    '@prefix ex: <http://example.org/>. ' +
                    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> . ' +
                    '<http://example.org/subject> <http://example.org/predicate> "1"^^xsd:nonNegativeInteger . ' +
                    '<http://example.org/subject2> <http://example.org/predicate2> "2"^^xsd:integer . ';
                const queryType = 'select';
                const expectedSelectResult: QuerySelectResult = {
                    head: {
                        vars: ['s', 'p', 'o'],
                    },
                    body: {
                        bindings: [
                            {
                                s: {
                                    type: 'uri',
                                    value: 'http://example.org/subject',
                                    label: 'http://example.org/subject',
                                },
                                p: {
                                    type: 'uri',
                                    value: 'http://example.org/predicate',
                                    label: 'http://example.org/predicate',
                                },
                                o: {
                                    type: 'literal',
                                    value: '1',
                                    label: 1,
                                    datatype: 'http://www.w3.org/2001/XMLSchema#nonNegativeInteger',
                                },
                            },
                            {
                                s: {
                                    type: 'uri',
                                    value: 'http://example.org/subject2',
                                    label: 'http://example.org/subject2',
                                },
                                p: {
                                    type: 'uri',
                                    value: 'http://example.org/predicate2',
                                    label: 'http://example.org/predicate2',
                                },
                                o: {
                                    type: 'literal',
                                    value: '2',
                                    label: 2,
                                    datatype: 'http://www.w3.org/2001/XMLSchema#integer',
                                },
                            },
                        ],
                    },
                };

                const result = await graphVisualizerService.doQuery(queryType, queryStr, tripleStr);

                expectToEqual(result, expectedSelectResult);
            });

            describe('... and return `undefined`', () => {
                it('... if querytype is not CONSTRUCT or SELECT', async () => {
                    const queryStr = 'ASK WHERE { ?s ?p ?o }';
                    const tripleStr =
                        '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
                    const queryType = 'ask';

                    const result = await graphVisualizerService.doQuery(queryType, queryStr, tripleStr);

                    expect(result).toBeUndefined();
                });

                it('... if response of a SELECT query is undefined', async () => {
                    const queryStr = 'PREFIX ex: <http://example.org/> SELECT * WHERE { ?s ?p ?o . }';
                    const tripleStr =
                        '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
                    const queryType = 'select';

                    vi.spyOn(graphVisualizerService as any, '_executeQuery').mockResolvedValue('');

                    const result = await graphVisualizerService.doQuery(queryType, queryStr, tripleStr);

                    expect(result).toBeUndefined();
                });
            });

            it('... and return `Query returned no results` if SELECT query returns an empty array', async () => {
                const queryStr = 'PREFIX ex: <http://example.org/> SELECT * WHERE { ?s ?p ?o . }';
                const tripleStr =
                    '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
                const queryType = 'select';
                const expectedResponse = 'Query returned no results';

                vi.spyOn(graphVisualizerService as any, '_executeQuery').mockResolvedValue([]);

                const result = await graphVisualizerService.doQuery(queryType, queryStr, tripleStr);

                expectToEqual(result, expectedResponse);
            });
        });
    });

    describe('#extractLabelsFromTriples()', () => {
        it('... should have a method `extractLabelsFromTriples`', () => {
            expect(graphVisualizerService.extractLabelsFromTriples).toBeDefined();
        });

        describe('... should return an empty Map if triples are falsy or empty', () => {
            it.each([
                { desc: 'null', value: null },
                { desc: 'undefined', value: undefined },
                { desc: 'an empty array', value: [] as Triple[] },
            ])('... with $desc', ({ value }) => {
                const result = graphVisualizerService.extractLabelsFromTriples(value);

                expectToBe(result instanceof Map, true);
                expectToBe(result.size, 0);
            });
        });

        it('... should extract rdfs:label triples with short form predicates', () => {
            const triples: Triple[] = [
                {
                    subject: 'http://example.org/person1',
                    predicate: 'rdfs:label',
                    object: 'John Doe',
                },
                {
                    subject: 'http://example.org/person2',
                    predicate: 'rdfs:label',
                    object: 'Jane Smith',
                },
            ];

            const result = graphVisualizerService.extractLabelsFromTriples(triples);

            expectToBe(result.size, 2);
            expectToBe(result.has('http://example.org/person1'), true);
            expectToBe(result.has('http://example.org/person2'), true);
        });

        it('... should extract rdfs:label triples with long form predicates', () => {
            const triples: Triple[] = [
                {
                    subject: 'http://example.org/concept1',
                    predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
                    object: 'Important Concept',
                },
                {
                    subject: 'http://example.org/concept2',
                    predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
                    object: 'Another Concept',
                },
            ];

            const result = graphVisualizerService.extractLabelsFromTriples(triples);

            expectToBe(result.size, 2);
            expectToBe(result.has('http://example.org/concept1'), true);
            expectToBe(result.has('http://example.org/concept2'), true);
        });

        it('... should handle mixed triples with both short and long form rdfs:label predicates', () => {
            const triples: Triple[] = [
                {
                    subject: 'http://example.org/resource1',
                    predicate: 'rdfs:label',
                    object: 'Resource One',
                },
                {
                    subject: 'http://example.org/resource2',
                    predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
                    object: 'Resource Two',
                },
            ];

            const result = graphVisualizerService.extractLabelsFromTriples(triples);

            expectToBe(result.size, 2);
            expectToBe(result.has('http://example.org/resource1'), true);
            expectToBe(result.has('http://example.org/resource2'), true);
        });

        it('... should store labels using PrefixPipe transformation of subjects', () => {
            const triples: Triple[] = [
                {
                    subject: 'http://xmlns.com/foaf/0.1/Person',
                    predicate: 'rdfs:label',
                    object: 'Person Class',
                },
                {
                    subject: 'http://example.org/resource',
                    predicate: 'rdfs:label',
                    object: 'Resource Label',
                },
            ];

            const result = graphVisualizerService.extractLabelsFromTriples(triples);

            expectToBe(result.size, 2);
            // Subject with default prefix gets shortened by PrefixPipe
            expectToBe(result.has('foaf:Person'), true);
            // Subject without default prefix remains as full URI
            expectToBe(result.has('http://example.org/resource'), true);
        });

        it('... should store and retrieve correct label values for subjects', () => {
            const triples: Triple[] = [
                {
                    subject: 'http://xmlns.com/foaf/0.1/Person',
                    predicate: 'rdfs:label',
                    object: 'Person Class',
                },
                {
                    subject: 'http://example.org/resource',
                    predicate: 'rdfs:label',
                    object: 'Resource Label',
                },
            ];

            const result = graphVisualizerService.extractLabelsFromTriples(triples);

            expectToBe(result.get('foaf:Person'), 'Person Class');
            expectToBe(result.get('http://example.org/resource'), 'Resource Label');
        });

        it('... should ignore non-label predicates', () => {
            const triples: Triple[] = [
                {
                    subject: 'http://example.org/person1',
                    predicate: 'rdfs:label',
                    object: 'John Doe',
                },
                {
                    subject: 'http://example.org/person1',
                    predicate: 'http://example.org/age',
                    object: '30',
                },
                {
                    subject: 'http://example.org/person1',
                    predicate: 'rdf:type',
                    object: 'http://example.org/Person',
                },
                {
                    subject: 'http://example.org/person2',
                    predicate: 'http://xmlns.com/foaf/0.1/name',
                    object: 'Jane Smith',
                },
            ];

            const result = graphVisualizerService.extractLabelsFromTriples(triples);

            expectToBe(result.size, 1);
            expectToBe(result.has('http://example.org/person1'), true);
            expectToBe(result.has('http://example.org/person2'), false);
        });
    });

    describe('#getQuerytype()', () => {
        it('... should have a method `getQuerytype`', () => {
            expect(graphVisualizerService.getQuerytype).toBeDefined();
        });

        describe('... should return correct querytype', () => {
            it.each([
                { desc: 'is a SELECT query', query: 'SELECT * WHERE { ?s ?p ?o }', expected: 'select' },
                {
                    desc: 'is a CONSTRUCT query',
                    query: 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }',
                    expected: 'construct',
                },
                { desc: 'is an ASK query', query: 'ASK WHERE { ?s ?p ?o }', expected: 'ask' },
                { desc: 'is a DESCRIBE query', query: 'DESCRIBE ?s WHERE { ?s ?p ?o }', expected: 'describe' },
                { desc: 'is a COUNT query', query: 'COUNT ?s WHERE { ?s ?p ?o }', expected: 'count' },
                { desc: 'is a DELETE query', query: 'DELETE  {?s ?p ?o } WHERE { ?s ?p ?o }', expected: 'update' },
                { desc: 'is an INSERT query', query: 'INSERT { ?s ?p ?o } WHERE { ?s ?p ?o} ', expected: 'update' },
                {
                    desc: 'starts with prefixes',
                    query: 'PREFIX ex: <http://example.org> SELECT * WHERE { ?s ?p ?o }',
                    expected: 'select',
                },
            ])('...  if the query $desc', ({ query, expected }) => {
                expectToBe(graphVisualizerService.getQuerytype(query), expected);
            });
        });

        it('... should return the first query type if the query uses multiple query types', () => {
            const query = 'CONSTRUCT { ?s ?p ?y } WHERE { SELECT ?s ?p ( bnode() AS ?y ) WHERE { ?s ?p ?o } }';

            const result = graphVisualizerService.getQuerytype(query);

            expectToBe(result, 'construct');
        });

        it('... should return `null` if the query is not a SELECT, CONSTRUCT, ASK, COUNT, DESCRIBE, INSERT or DELETE query', () => {
            const query = 'LOAD <http://example.org/graph>';

            const result = graphVisualizerService.getQuerytype(query);

            expectToBe(result, null);
        });
    });

    describe('#limitTriples()', () => {
        it('... should have a method `limitTriples`', () => {
            expect(graphVisualizerService.limitTriples).toBeDefined();
        });

        describe('should return an empty array if', () => {
            it.each([
                { desc: 'triples are undefined', triples: undefined },
                { desc: 'triples are null', triples: null },
                { desc: 'triples are empty array', triples: [] },
            ])('... $desc', ({ triples }) => {
                const limit = 3;

                const result = graphVisualizerService.limitTriples(triples, limit);

                expectToEqual(result, []);
            });
        });

        describe('should return the original Triple array if', () => {
            it.each([
                {
                    desc: 'the Triple array length is smaller than the given limit',
                    count: 2,
                    limit: 3,
                },
                {
                    desc: 'the Triple array length is equal with the given limit',
                    count: 3,
                    limit: 3,
                },
            ])('... $desc', ({ count, limit }) => {
                const triples = expectedTriples.slice(0, count);

                const result = graphVisualizerService.limitTriples(triples, limit);

                expectToEqual(result, triples);
            });
        });

        describe('should return a limited Triple array', () => {
            it('... if the Triple array is larger than the limit', () => {
                const inputWithFourTriples: Triple[] = expectedTriples.slice(0, 4);
                const outputWithTwoTriples: Triple[] = expectedTriples.slice(0, 2);
                const outputWithThreeTriples: Triple[] = expectedTriples.splice(0, 3);

                const limit = 3;

                const result = graphVisualizerService.limitTriples(inputWithFourTriples, limit);

                expectToEqual(result, outputWithThreeTriples);

                const limit2 = 2;
                const result2 = graphVisualizerService.limitTriples(inputWithFourTriples, limit2);

                expectToEqual(result2, outputWithTwoTriples);
            });
        });
    });

    describe('#parseTripleString()', () => {
        it('... should have a method `parseTripleString`', () => {
            expect(graphVisualizerService.parseTripleString).toBeDefined();
        });

        it('... should return a Promise of triples and namespaces for a given triple string', async () => {
            const triples =
                '@prefix ex: <http://example.org/>. @prefix ex2: <http://example2.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';

            await expect(graphVisualizerService.parseTripleString(triples)).resolves.not.toThrow();

            const result = await graphVisualizerService.parseTripleString(triples);

            expect(result).toBeDefined();
            expectToEqual(result.namespaces, {
                ex: 'http://example.org/',
                ex2: 'http://example2.org/',
            } as unknown as N3.Prefixes);
            expectToBe(Array.isArray(result.quads), true);
            expectToBe(result.quads.length, 1);
            expectToBe(result.quads[0].subject.id, 'http://example.org/subject');
            expectToBe(result.quads[0].predicate.id, 'http://example.org/predicate');
            expectToBe(result.quads[0].object.id, 'http://example.org/object');
        });

        it('... should return a Promise of empty triples and namespaces for an empty triple string', async () => {
            const triples = '';

            await expect(graphVisualizerService.parseTripleString(triples)).resolves.not.toThrow();

            const result = await graphVisualizerService.parseTripleString(triples);

            expect(result).toBeDefined();
            expectToEqual(result.namespaces, {});
            expectToBe(Array.isArray(result.quads), true);
            expectToBe(result.quads.length, 0);
        });

        describe('... should throw an error', () => {
            it('... for missing dots', async () => {
                const triplesWithSyntaxError =
                    '@prefix ex: <http://example.org/>  @prefix ex2: <http://example2.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';

                await expect(graphVisualizerService.parseTripleString(triplesWithSyntaxError)).rejects.toThrow(
                    'Expected declaration to end with a dot on line 1.'
                );
            });

            it('... for missing @', async () => {
                const triplesWithSyntaxError =
                    'prefix ex: <http://example.org/>. @prefix ex2: <http://example2.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';

                await expect(graphVisualizerService.parseTripleString(triplesWithSyntaxError)).rejects.toThrow(
                    'Expected entity but got . on line 1.'
                );
            });

            it('... for missing prefix marker', async () => {
                const triplesWithSyntaxError =
                    '@prefix ex: <http://example.org/>. ex2: <http://example2.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';

                await expect(graphVisualizerService.parseTripleString(triplesWithSyntaxError)).rejects.toThrow(
                    'Undefined prefix "ex2:" on line 1.'
                );
            });
        });
    });

    describe('#_abbreviate()', () => {
        it('... should have a method `_abbreviate`', () => {
            expect((graphVisualizerService as any)._abbreviate).toBeDefined();
        });

        describe('... should return an abbreviated IRI if', () => {
            it.each([
                {
                    desc: 'the given IRI matches a given namespace',
                    iri: 'http://example.org/subject',
                    namespaces: { ex: 'http://example.org/' },
                    expectedAbbreviation: 'ex:subject',
                },
                {
                    desc: 'the given IRI matches one of the provided namespaces',
                    iri: 'http://example2.org/subject',
                    namespaces: {
                        ex: 'http://example.org/',
                        ex2: 'http://example2.org/',
                        ex3: 'http://example3.org/',
                    },
                    expectedAbbreviation: 'ex2:subject',
                },
                {
                    desc: 'the given IRI matches multiple namespaces (using the first matching namespace)',
                    iri: 'http://example.com/subject',
                    namespaces: {
                        other: 'http://other.org/subject',
                        ex1: 'http://example.com/',
                        ex2: 'http://example.com/',
                        ex3: 'http://example.com/',
                    },
                    expectedAbbreviation: 'ex1:subject',
                },
            ])('... $desc', ({ iri, namespaces, expectedAbbreviation }) => {
                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });
        });

        describe('... should return a partially (incorrect) abbreviated IRI if the namespace ', () => {
            it.each([
                {
                    desc: 'does not have a trailing slash',
                    iri: 'http://example.org/subject',
                    namespaces: { ex: 'http://example.org' },
                    expected: 'ex:/subject',
                },
                {
                    desc: 'does not have a trailing hash',
                    iri: 'http://example.org#subject',
                    namespaces: { ex: 'http://example.org' },
                    expected: 'ex:#subject',
                },
                {
                    desc: 'matches the IRI exactly',
                    iri: 'http://example.org/',
                    namespaces: { ex: 'http://example.org/' },
                    expected: 'ex:',
                },
            ])('... $desc', ({ iri, namespaces, expected }) => {
                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, expected);
            });
        });

        describe('... should return the original IRI if', () => {
            it.each([
                {
                    desc: 'the given IRI does not start with http',
                    iri: 'ex:subject',
                    namespaces: { ex: 'http://example.org/' },
                },
                {
                    desc: 'no namespaces are provided',
                    iri: 'http://example.org/subject',
                    namespaces: {},
                },
                {
                    desc: 'the given namespaces are undefined',
                    iri: 'http://example.org/subject',
                    namespaces: undefined,
                },
                {
                    desc: 'the given namespaces are null',
                    iri: 'http://example.org/subject',
                    namespaces: null,
                },
                {
                    desc: 'the given IRI does not match a given namespace',
                    iri: 'http://other.org/subject',
                    namespaces: { ex: 'http://example.org/' },
                },
                {
                    desc: 'the given IRI does not match any of the provided namespaces',
                    iri: 'http://other.org/subject',
                    namespaces: {
                        ex: 'http://example.org/',
                        ex2: 'http://example2.org/',
                        ex3: 'http://example3.org/',
                    },
                },
                {
                    desc: 'the given IRI does not match a given namespace respecting case sensitivity',
                    iri: 'http://example.org/subject',
                    namespaces: { ex: 'http://EXAMPLE.org/' },
                },
                {
                    desc: 'the given IRI only partially matches a given namespace',
                    iri: 'http://example.org#subject',
                    namespaces: { ex: 'http://example.org/' },
                },
            ])('... $desc', ({ iri, namespaces }) => {
                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, iri);
            });
        });

        describe('... should return the falsy input value directly if it is not a valid IRI string', () => {
            it.each([
                { desc: 'undefined', value: undefined },
                { desc: 'null', value: null },
            ])('... with $desc', ({ value }) => {
                const namespaces = { ex: 'http://example.org/' };

                const result = (graphVisualizerService as any)._abbreviate(value, namespaces);

                if (value === undefined) {
                    expect(result).toBeUndefined();
                } else {
                    expectToEqual(result, value);
                }
            });
        });
    });

    describe('#_createStore()', () => {
        it('... should have a method `_createStore`', () => {
            expect((graphVisualizerService as any)._createStore).toBeDefined();
        });

        it('... should return a Promise of an rdfstore instance', async () => {
            await expect((graphVisualizerService as any)._createStore(mockRdfstore)).resolves.not.toThrow();
        });

        it('... should return a Promise of an rdfstore instance with load and execute methods', async () => {
            const result = await (graphVisualizerService as any)._createStore(mockRdfstore);

            expect(result).toBeDefined();
            expectToBe(result.constructor.name, 'MockStore');
            expect(result.load).toBeDefined();
            expect(result.execute).toBeDefined();
        });

        it('... should reject if rdfstore is not available in the current runtime', async () => {
            const expectedError = new Error('rdfstore is not available in the current runtime.');

            await expect((graphVisualizerService as any)._createStore(undefined)).rejects.toEqual(expectedError);
        });

        it('... should reject if store.create encounters an error', async () => {
            const expectedError = new Error('Test error');
            const mockStoreWithCreateError: any = {
                create: (callback: (err: Error | null, res: any) => void) => {
                    callback(expectedError, null as any);
                },
            };

            const storeSpy = vi.spyOn(mockStoreWithCreateError, 'create');

            await expect((graphVisualizerService as any)._createStore(mockStoreWithCreateError)).rejects.toEqual(
                expectedError
            );

            expectSpyCall(storeSpy, 1, [expect.any(Function)]);
        });
    });

    describe('#_executeQuery()', () => {
        let store: MockStore;

        beforeEach(async () => {
            store = await (graphVisualizerService as any)._createStore(mockRdfstore);

            let tripleStr =
                '@prefix ex: <http://example.org/>. @prefix ex1: <http://example1.org>. @prefix ex2: <http://example2.org>.';

            for (let i = 1; i <= 2; i++) {
                tripleStr += `<http://example.org/subject${i}> <http://example.org/predicate${i}> <http://example.org/object${i}>. `;
            }

            await (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr);
        });

        it('... should have a method `_executeQuery`', () => {
            expect((graphVisualizerService as any)._executeQuery).toBeDefined();
        });

        it('... should resolve a construct response for a CONSTRUCT query', async () => {
            const query = 'CONSTRUCT WHERE { ?s ?p ?o . }';
            const expectedQueryResult = [
                '<http://example.org/subject1> <http://example.org/predicate1> <http://example.org/object1> .',
                '<http://example.org/subject2> <http://example.org/predicate2> <http://example.org/object2> .',
            ];

            const result: RDFStoreConstructResponse = await (graphVisualizerService as any)._executeQuery(store, query);
            const triples = result.triples ?? [];

            expectToBe(triples.length, 2);
            triples.forEach((triple, index: number) => {
                expectToBe(triple.toString().trim(), expectedQueryResult[index]);
            });
        });

        it('... should resolve a select response for a SELECT query', async () => {
            const query = 'SELECT * WHERE { ?s ?p ?o . }';
            const expectedQueryResult = [
                {
                    s: { token: 'uri', value: 'http://example.org/subject1' },
                    p: { token: 'uri', value: 'http://example.org/predicate1' },
                    o: { token: 'uri', value: 'http://example.org/object1' },
                },
                {
                    s: { token: 'uri', value: 'http://example.org/subject2' },
                    p: { token: 'uri', value: 'http://example.org/predicate2' },
                    o: { token: 'uri', value: 'http://example.org/object2' },
                },
            ];

            const result: RDFStoreSelectResponse = await (graphVisualizerService as any)._executeQuery(store, query);

            expectToBe(result.length, 2);
            result.forEach((triple, index: number) => {
                expectToEqual(triple, expectedQueryResult[index] as any);
            });
        });

        it('... should reject if query is empty', async () => {
            const emptyQuery = '';

            await expect((graphVisualizerService as any)._executeQuery(store, emptyQuery)).rejects.toThrow();
        });

        it('... should reject and throw/log an error if store.execute encounters an error', async () => {
            const expectedError = new Error('Test error');
            const mockStore: any = {
                execute: (_query: string, callback: (err: Error | null, res: any) => void) => {
                    callback(expectedError, null as any);
                },
            };

            const storeSpy = vi.spyOn(mockStore, 'execute');

            const testQuery = 'SELECT * WHERE { ?s ?p ?o }';

            await expect((graphVisualizerService as any)._executeQuery(mockStore, testQuery)).rejects.toEqual(
                expectedError
            );

            expectSpyCall(storeSpy, 1, [testQuery, expect.any(Function)]);
            expectSpyCall(consoleSpy, 1, ['_executeQuery# got ERROR', expectedError]);
        });
    });

    describe('#_extractNamespacesFromString()', () => {
        it('... should have a method `_extractNamespacesFromString`', () => {
            expect((graphVisualizerService as any)._extractNamespacesFromString).toBeDefined();
        });

        it('... should return an object with namespaces from a given turtle string', () => {
            const turtleStr =
                '@prefix ex: <http://example.org/>. @prefix ex2: <http://example2.org>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
            const expectedNamespaces = { ex: 'http://example.org/', ex2: 'http://example2.org' };

            const result = (graphVisualizerService as any)._extractNamespacesFromString('TURTLE', turtleStr);

            expectToEqual(result, expectedNamespaces);
        });

        it('... should return an object with namespaces from a given SPARQL string', () => {
            const sparqlStr =
                'PREFIX ex: <http://example.org/>. PREFIX ex2: <http://example2.org>. SELECT * WHERE { ?s ?p ?o }';
            const expectedNamespaces = { ex: 'http://example.org/', ex2: 'http://example2.org' };

            const result = (graphVisualizerService as any)._extractNamespacesFromString('SPARQL', sparqlStr);

            expectToEqual(result, expectedNamespaces);
        });

        describe('... should return an empty object if', () => {
            it('... the given string is empty', () => {
                const emptyStr = '';
                const expectedNamespaces = {};

                const result = (graphVisualizerService as any)._extractNamespacesFromString('TURTLE', emptyStr);

                expectToEqual(result, expectedNamespaces);

                const result2 = (graphVisualizerService as any)._extractNamespacesFromString('SPARQL', emptyStr);

                expectToEqual(result2, expectedNamespaces);
            });

            it('... the given string has no prefixes in TURTLE', () => {
                const noPrefixTurtleStr =
                    '<http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
                const expectedNamespaces = {};

                const result = (graphVisualizerService as any)._extractNamespacesFromString(
                    'TURTLE',
                    noPrefixTurtleStr
                );

                expectToEqual(result, expectedNamespaces);
            });

            it('... the given string has no prefixes in SPARQL', () => {
                const noPrefixSparqlStr = 'SELECT * WHERE { ?s ?p ?o }';
                const expectedNamespaces = {};

                const result = (graphVisualizerService as any)._extractNamespacesFromString(
                    'SPARQL',
                    noPrefixSparqlStr
                );

                expectToEqual(result, expectedNamespaces);
            });
        });

        it('... should throw an error if called with another type than TURTLE or SPARQL', () => {
            const tripleStr =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>';
            const expectedError = 'The type must be TURTLE or SPARQL, but was: OTHER.';

            expect(() => (graphVisualizerService as any)._extractNamespacesFromString('OTHER', tripleStr)).toThrow(
                expectedError
            );
        });
    });

    describe('#_extractQNamePrefixesFromSPARQLWhereClause()', () => {
        it('... should have a method `_extractQNamePrefixesFromSPARQLWhereClause`', () => {
            expect((graphVisualizerService as any)._extractQNamePrefixesFromSPARQLWhereClause).toBeDefined();
        });

        describe('... should return', () => {
            it.each([
                {
                    desc: 'an empty Array if no prefixes are in the where clause',
                    query: 'SELECT * WHERE { ?s ?p ?o . }',
                    expected: [],
                },
                {
                    desc: 'an array of prefixes from the where clause',
                    query: 'SELECT * WHERE { ex:s ex1:p ex2:o .}',
                    expected: ['ex', 'ex1', 'ex2'],
                },
                {
                    desc: 'an array of unique prefixes from the where clause',
                    query: 'SELECT * WHERE { ex:s ex1:p ex2:o . ex:s1 ex1:p1 ex2:o1 .}',
                    expected: ['ex', 'ex1', 'ex2'],
                },
                {
                    desc: 'an array of unique prefixes from the where clause respecting case sensitivity',
                    query: 'SELECT * WHERE { ex:s ex1:p ex2:o . Ex:s1 Ex1:p1 Ex2:o1 . EX:s2 EX1:p2 EX2:o2 . eX:s3 eX1:p3 eX2:o3 .}',
                    expected: ['ex', 'ex1', 'ex2', 'Ex', 'Ex1', 'Ex2', 'EX', 'EX1', 'EX2', 'eX', 'eX1', 'eX2'],
                },
                {
                    desc: 'an array of unique prefixes even if no WHERE keyword is given',
                    query: 'SELECT * { ex:s ex1:p ex2:o . ex:s1 ex1:p1 ex2:o1 .}',
                    expected: ['ex', 'ex1', 'ex2'],
                },
                {
                    desc: 'an array of prefixes starting with underscore, small letter or capital letter',
                    query: 'SELECT * WHERE { _:s Ex1:p EX2:o . ex:s1 ex1:p1 ex2:o1 .}',
                    expected: ['_', 'Ex1', 'EX2', 'ex', 'ex1', 'ex2'],
                },
            ])('... $desc', ({ query, expected }) => {
                const result = (graphVisualizerService as any)._extractQNamePrefixesFromSPARQLWhereClause(query);

                expectToEqual(result, expected);
            });
        });
    });

    describe('#_loadTriplesInStore()', () => {
        let store: MockStore;

        beforeEach(async () => {
            store = await (graphVisualizerService as any)._createStore(mockRdfstore);
        });

        it('... should have a method `_loadTriplesInStore`', () => {
            expect((graphVisualizerService as any)._loadTriplesInStore).toBeDefined();
        });

        describe('... should load triples into the rdfstore', () => {
            it.each([
                { desc: 'a single triple', expectedSize: 1 },
                { desc: 'multiple triples', expectedSize: 3 },
                { desc: 'a huge number of triples', expectedSize: 100 },
            ])('... $desc', async ({ expectedSize }) => {
                const base = 'http://example.org';
                const tripleStr = Array.from(
                    { length: expectedSize },
                    (_, i) => `<${base}/subject${i}> <${base}/predicate${i}> <${base}/object${i}>.`
                ).join(' ');

                const size = await (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr);

                expectToBe(size, expectedSize);
            });
        });

        describe('... should load different serializations of triples into the rdfstore', () => {
            it.each([
                {
                    desc: 'triples without prefixes or URIs',
                    tripleStr: '<subject> <predicate> <object>.',
                },
                {
                    desc: 'triples with prefix and default mimetype `text/turtle` (no mimetype given)',
                    tripleStr: '@prefix ex: <http://example.org/>. ex:subject ex:predicate ex:object.',
                },
                {
                    desc: 'triples with given mimetype `text/turtle`',
                    tripleStr: '@prefix ex: <http://example.org/>. ex:subject ex:predicate ex:object.',
                    mimeType: 'text/turtle',
                },
                {
                    desc: 'triples with given mimetype `application/ld+json`',
                    tripleStr:
                        '[{"@id":"http://example.org/object"},{"@id":"http://example.org/subject","http://example.org/predicate":[{"@id":"http://example.org/object"}]}]',
                    mimeType: 'application/ld+json',
                },
            ])('... $desc', async ({ tripleStr, mimeType }) => {
                const size = await (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr, mimeType);

                expectToBe(size, 1);
            });
        });

        it('... should reject and throw/log an error if no parser is found for the provided mimeType', async () => {
            const tripleStr = '@prefix ex: <http://example.org/>. ex:subject ex:predicate ex:object.';
            const mimeType = 'application/rdf+xml';
            const expectedErrorMessage = `Cannot find parser for the provided media type:${mimeType}`;
            const expectedError = new Error(expectedErrorMessage);

            await expect(
                (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr, mimeType)
            ).rejects.toThrow(expectedErrorMessage);

            expectSpyCall(consoleSpy, 1, ['_loadTriplesInStore# got ERROR', expectedError]);
        });
    });

    describe('_mapKeys', () => {
        it('... should have a method `_mapKeys`', () => {
            expect((graphVisualizerService as any)._mapKeys).toBeDefined();
        });

        describe('... should return an empty object if the input object is falsy or empty', () => {
            it.each([
                { desc: 'empty', input: {} },
                { desc: 'null', input: null },
                { desc: 'undefined', input: undefined },
            ])('... with input = $desc', ({ input }) => {
                const keyMap = {
                    token: 'type',
                    type: 'datatype',
                    lang: 'xml:lang',
                };

                const result = (graphVisualizerService as any)._mapKeys(input, keyMap);

                expectToEqual(result, {});
            });
        });

        describe('... should return the original object if the keyMap is', () => {
            it.each([
                { desc: 'empty', map: {} },
                { desc: 'null', map: null },
                { desc: 'undefined', map: undefined },
            ])('... $desc', ({ map }) => {
                const inputObj = {
                    key1: 'value1',
                    key2: 'value2',
                };

                const result = (graphVisualizerService as any)._mapKeys(inputObj, map);

                expectToEqual(result, inputObj);
            });
        });

        it('... should return an object with mapped keys', () => {
            const inputObj: Record<string, string> = {
                key1: 'value1',
                key2: 'value2',
            };
            const keyMap: Record<string, string> = {
                key1: 'key1Mapped',
                key2: 'key2Mapped',
            };
            const outputObj: Record<string, string> = {
                key1Mapped: 'value1',
                key2Mapped: 'value2',
            };

            const result = (graphVisualizerService as any)._mapKeys(inputObj, keyMap);

            expectToEqual(result, outputObj);
        });

        it('... should map token, type and lang keys in a given object', () => {
            const inputObj = {
                token: 'literal',
                type: 'http://www.w3.org/2001/XMLSchema#string',
                lang: 'en',
            };
            const keyMap = {
                token: 'type',
                type: 'datatype',
                lang: 'xml:lang',
            };
            const outputObj = {
                type: 'literal',
                datatype: 'http://www.w3.org/2001/XMLSchema#string',
                'xml:lang': 'en',
            };

            const result = (graphVisualizerService as any)._mapKeys(inputObj, keyMap);

            expectToEqual(result, outputObj);
        });
    });

    describe('_prepareMappedBindings', () => {
        it('... should have a method `_prepareMappedBindings`', () => {
            expect((graphVisualizerService as any)._prepareMappedBindings).toBeDefined();
        });

        it('... should return an array with mapped bindings and label', () => {
            const selectResponse = [
                {
                    key1: {
                        token: 'uri',
                        value: 'https://edition.anton-webern.ch/webern-onto#Op25_1',
                    },
                    key2: {
                        token: 'literal',
                        type: 'http://www.w3.org/2001/XMLSchema#integer',
                        value: '1',
                    },
                },
            ];
            const expectedMappedBindings = [
                {
                    key1: {
                        label: 'awg:Op25_1',
                        type: 'uri',
                        value: 'https://edition.anton-webern.ch/webern-onto#Op25_1',
                    },
                    key2: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
                        label: 1,
                        type: 'literal',
                        value: '1',
                    },
                },
            ];

            const result = (graphVisualizerService as any)._prepareMappedBindings(selectResponse);

            expectToEqual(result, expectedMappedBindings);
        });

        it('... should return a prefixed label for a URI value', () => {
            const selectResponse = [
                {
                    key1: {
                        token: 'uri',
                        value: 'https://edition.anton-webern.ch/webern-onto#Op25_1',
                    },
                },
                {
                    key1: {
                        token: 'uri',
                        value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                    },
                },
            ];
            const expectedMappedBindings = [
                {
                    key1: {
                        label: 'awg:Op25_1',
                        type: 'uri',
                        value: 'https://edition.anton-webern.ch/webern-onto#Op25_1',
                    },
                },
                {
                    key1: {
                        label: 'rdf:type',
                        type: 'uri',
                        value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                    },
                },
            ];

            const result = (graphVisualizerService as any)._prepareMappedBindings(selectResponse);

            expectToEqual(result, expectedMappedBindings);
        });

        describe('... should return a number label for', () => {
            it('... literal integer values', () => {
                const selectResponse = [
                    {
                        key1: {
                            token: 'literal',
                            type: 'http://www.w3.org/2001/XMLSchema#integer',
                            value: '1',
                        },
                    },
                ];
                const expectedMappedBindings = [
                    {
                        key1: {
                            datatype: 'http://www.w3.org/2001/XMLSchema#integer',
                            label: 1,
                            type: 'literal',
                            value: '1',
                        },
                    },
                ];

                const result = (graphVisualizerService as any)._prepareMappedBindings(selectResponse);

                expectToEqual(result, expectedMappedBindings);
            });

            it('... literal non-negative integer values', () => {
                const selectResponse = [
                    {
                        key1: {
                            token: 'literal',
                            type: 'http://www.w3.org/2001/XMLSchema#nonNegativeInteger',
                            value: '1',
                        },
                    },
                ];
                const expectedMappedBindings = [
                    {
                        key1: {
                            datatype: 'http://www.w3.org/2001/XMLSchema#nonNegativeInteger',
                            label: 1,
                            type: 'literal',
                            value: '1',
                        },
                    },
                ];

                const result = (graphVisualizerService as any)._prepareMappedBindings(selectResponse);

                expectToEqual(result, expectedMappedBindings);
            });
        });

        it('... should trigger `_mapKeys` method for each key', () => {
            const selectResponse = [
                {
                    key1: {
                        token: 'uri',
                        value: 'https://edition.anton-webern.ch/webern-onto#Op25_1',
                    },
                    key2: {
                        token: 'literal',
                        type: 'http://www.w3.org/2001/XMLSchema#integer',
                        value: '1',
                    },
                },
            ];
            const mapKeysSpy = vi.spyOn(graphVisualizerService as any, '_mapKeys');

            (graphVisualizerService as any)._prepareMappedBindings(selectResponse);

            expectSpyCall(mapKeysSpy, 2);
        });
    });

    describe('#_prepareConstructResponse()', () => {
        it('... should have a method `_prepareConstructResponse`', () => {
            expect((graphVisualizerService as any)._prepareConstructResponse).toBeDefined();
        });

        describe('should flatten and abbreviate the given StoreTriples', () => {
            it('... according to the given namespaces', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };

                const result = (graphVisualizerService as any)._prepareConstructResponse(triples, namespaces);

                expectToBe(result[0].subject, 'ex:subject1');
                expectToBe(result[0].predicate, 'ex:predicate1');
                expectToBe(result[0].object, 'ex:object1');

                expectToBe(result[1].subject, 'exs:subject2');
                expectToBe(result[1].predicate, 'exs:predicate2');
                expectToBe(result[1].object, 'exs:object2');

                expectToEqual(result, [
                    {
                        subject: 'ex:subject1',
                        predicate: 'ex:predicate1',
                        object: 'ex:object1',
                    },
                    {
                        subject: 'exs:subject2',
                        predicate: 'exs:predicate2',
                        object: 'exs:object2',
                    },
                ]);
            });

            it('... if mimetype `text/turtle` is given', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };
                const mimetypeTurtle = 'text/turtle';

                const result = (graphVisualizerService as any)._prepareConstructResponse(
                    triples,
                    namespaces,
                    mimetypeTurtle
                );

                expectToBe(result[0].subject, 'ex:subject1');
                expectToBe(result[0].predicate, 'ex:predicate1');
                expectToBe(result[0].object, 'ex:object1');

                expectToBe(result[1].subject, 'exs:subject2');
                expectToBe(result[1].predicate, 'exs:predicate2');
                expectToBe(result[1].object, 'exs:object2');

                expectToEqual(result, [
                    {
                        subject: 'ex:subject1',
                        predicate: 'ex:predicate1',
                        object: 'ex:object1',
                    },
                    {
                        subject: 'exs:subject2',
                        predicate: 'exs:predicate2',
                        object: 'exs:object2',
                    },
                ]);
            });

            it('... if no mimetype is given (`text/turtle` applied by default)', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };
                const mimetypeEmpty = '';

                const result = (graphVisualizerService as any)._prepareConstructResponse(
                    triples,
                    namespaces,
                    mimetypeEmpty
                );

                expectToBe(result[0].subject, 'ex:subject1');
                expectToBe(result[0].predicate, 'ex:predicate1');
                expectToBe(result[0].object, 'ex:object1');

                expectToBe(result[1].subject, 'exs:subject2');
                expectToBe(result[1].predicate, 'exs:predicate2');
                expectToBe(result[1].object, 'exs:object2');

                expectToEqual(result, [
                    {
                        subject: 'ex:subject1',
                        predicate: 'ex:predicate1',
                        object: 'ex:object1',
                    },
                    {
                        subject: 'exs:subject2',
                        predicate: 'exs:predicate2',
                        object: 'exs:object2',
                    },
                ]);
            });

            it('... should trigger `_abbreviate` method for each part of a triple', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };
                const abbreviateSpy = vi.spyOn(graphVisualizerService as any, '_abbreviate');

                (graphVisualizerService as any)._prepareConstructResponse(triples, namespaces);

                const tripleLength = triples.length;
                const tripleKeysLength = Object.keys(triples[0]).length;
                const expectedCalls = tripleLength * tripleKeysLength;

                expectSpyCall(abbreviateSpy, expectedCalls);
            });
        });

        describe('should flatten, but not abbreviate the given StoreTriples', () => {
            it('... if no namespaces are provided', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {};

                const result = (graphVisualizerService as any)._prepareConstructResponse(triples, namespaces);

                expectToBe(result[0].subject, 'http://example.org/subject1');
                expectToBe(result[0].predicate, 'http://example.org/predicate1');
                expectToBe(result[0].object, 'http://example.org/object1');

                expectToBe(result[1].subject, 'https://example.org/subject2');
                expectToBe(result[1].predicate, 'https://example.org/predicate2');
                expectToBe(result[1].object, 'https://example.org/object2');

                expectToEqual(result, [
                    {
                        subject: 'http://example.org/subject1',
                        predicate: 'http://example.org/predicate1',
                        object: 'http://example.org/object1',
                    },
                    {
                        subject: 'https://example.org/subject2',
                        predicate: 'https://example.org/predicate2',
                        object: 'https://example.org/object2',
                    },
                ]);
            });

            it('... if namespaces do not match the IRIs', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ot: 'http://other.org/',
                };

                const result = (graphVisualizerService as any)._prepareConstructResponse(triples, namespaces);

                expectToBe(result[0].subject, 'http://example.org/subject1');
                expectToBe(result[0].predicate, 'http://example.org/predicate1');
                expectToBe(result[0].object, 'http://example.org/object1');

                expectToBe(result[1].subject, 'https://example.org/subject2');
                expectToBe(result[1].predicate, 'https://example.org/predicate2');
                expectToBe(result[1].object, 'https://example.org/object2');

                expectToEqual(result, [
                    {
                        subject: 'http://example.org/subject1',
                        predicate: 'http://example.org/predicate1',
                        object: 'http://example.org/object1',
                    },
                    {
                        subject: 'https://example.org/subject2',
                        predicate: 'https://example.org/predicate2',
                        object: 'https://example.org/object2',
                    },
                ]);
            });

            it('... if a given mimetype is not `text/turtle`', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };
                const mimetypePlain = 'text/plain';

                const result = (graphVisualizerService as any)._prepareConstructResponse(
                    triples,
                    namespaces,
                    mimetypePlain
                );

                expectToBe(result[0].subject, 'http://example.org/subject1');
                expectToBe(result[0].predicate, 'http://example.org/predicate1');
                expectToBe(result[0].object, 'http://example.org/object1');

                expectToBe(result[1].subject, 'https://example.org/subject2');
                expectToBe(result[1].predicate, 'https://example.org/predicate2');
                expectToBe(result[1].object, 'https://example.org/object2');

                expectToEqual(result, [
                    {
                        subject: 'http://example.org/subject1',
                        predicate: 'http://example.org/predicate1',
                        object: 'http://example.org/object1',
                    },
                    {
                        subject: 'https://example.org/subject2',
                        predicate: 'https://example.org/predicate2',
                        object: 'https://example.org/object2',
                    },
                ]);
            });
        });
    });

    describe('_prepareSelectResponse', () => {
        it('... should have a method `_prepareSelectResponse`', () => {
            expect((graphVisualizerService as any)._prepareSelectResponse).toBeDefined();
        });

        describe('... should return status=404 and undefined if selectResponse is falsy', () => {
            const expectedResponse = {
                status: 404,
                data: undefined,
            };

            it.each([
                { desc: 'undefined', value: undefined },
                { desc: 'null', value: null },
            ])('... with $desc', ({ value }) => {
                const result = (graphVisualizerService as any)._prepareSelectResponse(value);

                expectToEqual(result, expectedResponse);
            });
        });

        it('... should return status=400 and `Query returned no results` if selectRespone is empty', () => {
            const selectResponse: RDFStoreSelectResponse = [];
            const expectedResponse: {
                status: number;
                data: QuerySelectResult | string;
            } = {
                status: 400,
                data: 'Query returned no results',
            };

            const result = (graphVisualizerService as any)._prepareSelectResponse(selectResponse);

            expectToEqual(result, expectedResponse);
        });

        it('... should return a QuerySelectResult object with mapped bindings and vars', () => {
            const selectResponse: RDFStoreSelectResponse = [
                {
                    subject: {
                        label: 'awg:Op25_1',
                        type: 'uri',
                        value: 'https://edition.anton-webern.ch/webern-onto#Op25_1',
                    },
                    predicate: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
                        label: 1,
                        type: 'literal',
                        value: '1',
                    },
                },
            ] as unknown as RDFStoreSelectResponse;

            const expectedQueryResult: {
                status: number;
                data: QuerySelectResult | string;
            } = {
                status: 200,
                data: {
                    head: {
                        vars: ['subject', 'predicate'],
                    },
                    body: {
                        bindings: [
                            {
                                subject: {
                                    label: 'awg:Op25_1',
                                    datatype: 'uri',
                                    value: 'https://edition.anton-webern.ch/webern-onto#Op25_1',
                                },
                                predicate: {
                                    label: '1',
                                    datatype: 'literal',
                                    value: '1',
                                },
                            },
                        ],
                    },
                },
            };

            const result = (graphVisualizerService as any)._prepareSelectResponse(selectResponse);

            expectToEqual(result, expectedQueryResult);
        });

        it('... should trigger `_prepareMappedBindings` method', () => {
            const selectResponse: RDFStoreSelectResponse = [
                {
                    subject: {
                        type: 'uri',
                        label: 'awg:Op25_1',
                        value: 'https://edition.anton-webern.ch/webern-onto#Op25_1',
                    },
                    predicate: {
                        type: 'literal',
                        label: 1,
                        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
                        value: '1',
                    },
                },
            ] as unknown as RDFStoreSelectResponse;

            const prepareMappedBindingsSpy = vi.spyOn(graphVisualizerService as any, '_prepareMappedBindings');

            (graphVisualizerService as any)._prepareSelectResponse(selectResponse);

            expectSpyCall(prepareMappedBindingsSpy, 1, [selectResponse]);
        });
    });
});
