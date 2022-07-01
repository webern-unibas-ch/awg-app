import { TestBed } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { expectSpyCall } from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';

import { QueryResult, RDFStoreConstructResponseTriple, Triple } from '../models';
import { PrefixPipe } from '../prefix-pipe';

import { GraphVisualizerService } from './graph-visualizer.service';

describe('GraphVisualizerService', () => {
    let graphVisualizerService: GraphVisualizerService;

    let expectedTriples: Triple[];
    let expectedConstructResponseTriples: RDFStoreConstructResponseTriple[];

    let consoleSpy: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GraphVisualizerService, PrefixPipe],
        });
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
        consoleSpy = spyOn(console, 'warn').and.callFake(mockConsole.log);
    });

    afterEach(() => {
        // Clear mock console after each test
        mockConsole.clear();
    });

    it('should be created', () => {
        expect(graphVisualizerService).toBeTruthy();
    });

    it('should have not _store property yet', () => {
        expect((graphVisualizerService as any)._store).toBeUndefined();
    });

    describe('#limitTriples()', () => {
        it('should have a `limitTriples` method', () => {
            expect(graphVisualizerService.limitTriples).toBeDefined();
        });

        describe('should return an empty array', () => {
            it('... if triples are undefined', () => {
                const limit = 3;

                const result = graphVisualizerService.limitTriples(undefined, limit);

                expect(result).toEqual([]);
            });

            it('... if triples are null', () => {
                const limit = 3;

                const result = graphVisualizerService.limitTriples(null, limit);

                expect(result).toEqual([]);
            });

            it('... if triples are empty array', () => {
                const limit = 3;

                const result = graphVisualizerService.limitTriples([], limit);

                expect(result).toEqual([]);
            });
        });

        describe('should return the same Triple array', () => {
            it('... if the Triple array length is smaller than the given limit', () => {
                const inputWithTwoTriples: Triple[] = expectedTriples.slice(0, 2);
                const limit = 3;

                const result = graphVisualizerService.limitTriples(inputWithTwoTriples, limit);

                expect(result).toEqual(inputWithTwoTriples);
            });

            it('... if the Triple array length is equal with the given limit', () => {
                const inputWithThreeTriples: Triple[] = expectedTriples.splice(0, 3);
                const limit = 3;

                const result = graphVisualizerService.limitTriples(inputWithThreeTriples, limit);

                expect(result).toEqual(inputWithThreeTriples);
            });
        });

        describe('should return a limited Triple array', () => {
            it('... if the Triple array is larger than the limit', () => {
                const inputWithFourTriples: Triple[] = expectedTriples.slice(0, 4);
                const outputWithTwoTriples: Triple[] = expectedTriples.slice(0, 2);
                const outputWithThreeTriples: Triple[] = expectedTriples.splice(0, 3);

                const limit = 3;

                const result = graphVisualizerService.limitTriples(inputWithFourTriples, limit);

                expect(result).toEqual(outputWithThreeTriples);

                const limit2 = 2;
                const result2 = graphVisualizerService.limitTriples(inputWithFourTriples, limit2);

                expect(result2).toEqual(outputWithTwoTriples);
            });
        });
    });

    describe('#abbreviateTriples()', () => {
        it('should have an `abbreviateTriples` method', () => {
            expect(graphVisualizerService.abbreviateTriples).toBeDefined();
        });

        describe('should abbreviate the given StoreTriples', () => {
            it('... according to the given namespaces', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };

                const result = graphVisualizerService.abbreviateTriples(triples, namespaces);

                expect(result[0].subject).toBeDefined();
                expect(result[0].predicate).toBeDefined();
                expect(result[0].object).toBeDefined();
                expect(result[0].subject).withContext(`should be 'ex:subject1'`).toBe('ex:subject1');
                expect(result[0].predicate).withContext(`should be 'ex:predicate1'`).toBe('ex:predicate1');
                expect(result[0].object).withContext(`should be 'ex:object1'`).toBe('ex:object1');

                expect(result[1].subject).toBeDefined();
                expect(result[1].predicate).toBeDefined();
                expect(result[1].object).toBeDefined();
                expect(result[1].subject).withContext(`should be 'exs:subject2'`).toBe('exs:subject2');
                expect(result[1].predicate).withContext(`should be 'exs:predicate2'`).toBe('exs:predicate2');
                expect(result[1].object).withContext(`should be 'exs:object2'`).toBe('exs:object2');
            });

            it('... if mimetype `text/turtle` is given', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };
                const mimetypeTurtle = 'text/turtle';

                const result = graphVisualizerService.abbreviateTriples(triples, namespaces, mimetypeTurtle);

                expect(result[0].subject).toBeDefined();
                expect(result[0].predicate).toBeDefined();
                expect(result[0].object).toBeDefined();
                expect(result[0].subject).withContext(`should be 'ex:subject1'`).toBe('ex:subject1');
                expect(result[0].predicate).withContext(`should be 'ex:predicate1'`).toBe('ex:predicate1');
                expect(result[0].object).withContext(`should be 'ex:object1'`).toBe('ex:object1');

                expect(result[1].subject).toBeDefined();
                expect(result[1].predicate).toBeDefined();
                expect(result[1].object).toBeDefined();
                expect(result[1].subject).withContext(`should be 'exs:subject2'`).toBe('exs:subject2');
                expect(result[1].predicate).withContext(`should be 'exs:predicate2'`).toBe('exs:predicate2');
                expect(result[1].object).withContext(`should be 'exs:object2'`).toBe('exs:object2');
            });

            it('... if no mimetype is given (`text/turtle` applied by default)', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };
                const mimetypeEmpty = '';

                const result = graphVisualizerService.abbreviateTriples(triples, namespaces, mimetypeEmpty);

                expect(result[0].subject).toBeDefined();
                expect(result[0].predicate).toBeDefined();
                expect(result[0].object).toBeDefined();
                expect(result[0].subject).withContext(`should be 'ex:subject1'`).toBe('ex:subject1');
                expect(result[0].predicate).withContext(`should be 'ex:predicate1'`).toBe('ex:predicate1');
                expect(result[0].object).withContext(`should be 'ex:object1'`).toBe('ex:object1');

                expect(result[1].subject).toBeDefined();
                expect(result[1].predicate).toBeDefined();
                expect(result[1].object).toBeDefined();
                expect(result[1].subject).withContext(`should be 'exs:subject2'`).toBe('exs:subject2');
                expect(result[1].predicate).withContext(`should be 'exs:predicate2'`).toBe('exs:predicate2');
                expect(result[1].object).withContext(`should be 'exs:object2'`).toBe('exs:object2');
            });
        });

        describe('should not abbreviate the given StoreTriples', () => {
            it('... if the IRI uses an unknown namespace', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {};

                const result = graphVisualizerService.abbreviateTriples(triples, namespaces);

                expect(result[0].subject).toBeDefined();
                expect(result[0].predicate).toBeDefined();
                expect(result[0].object).toBeDefined();
                expect(result[0].subject)
                    .withContext(`should be 'http://example.org/subject1'`)
                    .toBe('http://example.org/subject1');
                expect(result[0].predicate)
                    .withContext(`should be 'http://example.org/predicate1'`)
                    .toBe('http://example.org/predicate1');
                expect(result[0].object)
                    .withContext(`should be 'http://example.org/object1'`)
                    .toBe('http://example.org/object1');

                expect(result[1].subject).toBeDefined();
                expect(result[1].predicate).toBeDefined();
                expect(result[1].object).toBeDefined();
                expect(result[1].subject)
                    .withContext(`should be 'https://example.org/subject2'`)
                    .toBe('https://example.org/subject2');
                expect(result[1].predicate)
                    .withContext(`should be 'https://example.org/predicate2'`)
                    .toBe('https://example.org/predicate2');
                expect(result[1].object)
                    .withContext(`should be 'https://example.org/object2'`)
                    .toBe('https://example.org/object2');
            });

            it('... if a given mimetype is not `text/turtle`', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };
                const mimetypePlain = 'text/plain';

                const result = graphVisualizerService.abbreviateTriples(triples, namespaces, mimetypePlain);

                expect(result[0].subject).toBeDefined();
                expect(result[0].predicate).toBeDefined();
                expect(result[0].object).toBeDefined();
                expect(result[0].subject)
                    .withContext(`should be 'http://example.org/subject1'`)
                    .toBe('http://example.org/subject1');
                expect(result[0].predicate)
                    .withContext(`should be 'http://example.org/predicate1'`)
                    .toBe('http://example.org/predicate1');
                expect(result[0].object)
                    .withContext(`should be 'http://example.org/object1'`)
                    .toBe('http://example.org/object1');

                expect(result[1].subject).toBeDefined();
                expect(result[1].predicate).toBeDefined();
                expect(result[1].object).toBeDefined();
                expect(result[1].subject)
                    .withContext(`should be 'https://example.org/subject2'`)
                    .toBe('https://example.org/subject2');
                expect(result[1].predicate)
                    .withContext(`should be 'https://example.org/predicate2'`)
                    .toBe('https://example.org/predicate2');
                expect(result[1].object)
                    .withContext(`should be 'https://example.org/object2'`)
                    .toBe('https://example.org/object2');
            });
        });
    });

    describe('#getQuerytype()', () => {
        it('should have a method getQuerytype()', () => {
            expect(graphVisualizerService.getQuerytype).toBeDefined();
        });

        describe('should return correct querytpe', () => {
            it('... if the query is a SELECT query (= `select`)', () => {
                const query = 'SELECT * WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expect(result).toBeDefined();
                expect(result).withContext('should be `select`').toBe('select');
            });

            it('... if the query is a CONSTRUCT query (= `construct`)', () => {
                const query = 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expect(result).toBeDefined();
                expect(result).withContext('should be `construct`').toBe('construct');
            });

            it('... if the query is an ASK query (= `ask`)', () => {
                const query = 'ASK WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expect(result).toBeDefined();
                expect(result).withContext('should be `ask`').toBe('ask');
            });

            it('... if the query is a DESCRIBE query (= `describe`)', () => {
                const query = 'DESCRIBE ?s WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expect(result).toBeDefined();
                expect(result).withContext('should be `describe`').toBe('describe');
            });

            it('... if the query is a COUNT query (= `count`)', () => {
                const query = 'COUNT ?s WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expect(result).toBeDefined();
                expect(result).withContext('should be `count`').toBe('count');
            });

            it('... if the query is a DELETE query (= `update`)', () => {
                const query = 'DELETE  {?s ?p ?o } WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expect(result).toBeDefined();
                expect(result).withContext('should be `update`').toBe('update');
            });

            it('... if the query is an INSERT query (= `update`)', () => {
                const query = 'INSERT { ?s ?p ?o } WHERE { ?s ?p ?o} ';

                const result = graphVisualizerService.getQuerytype(query);

                expect(result).toBeDefined();
                expect(result).withContext('should be `update`').toBe('update');
            });

            it('... if the query starts with prefixes', () => {
                const query = 'PREFIX ex: <http://example.org/> SELECT * WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expect(result).toBeDefined();
                expect(result).withContext('should be `select`').toBe('select');
            });
        });

        it('should return the first query type if the query uses multiple query types', () => {
            const query = 'CONSTRUCT { ?s ?p ?y } WHERE { SELECT ?s ?p ( bnode() AS ?y ) WHERE { ?s ?p ?o } }';

            const result = graphVisualizerService.getQuerytype(query);

            expect(result).toBeDefined();
            expect(result).withContext('should be `construct`').toBe('construct');
        });

        it('should return `null` if the query is not a SELECT, CONSTRUCT, ASK, COUNT, DESCRIBE, INSERT or DELETE query', () => {
            const query = 'LOAD <http://example.org/graph>';

            const result = graphVisualizerService.getQuerytype(query);

            expect(result).toBe(null);
        });
    });

    describe('#checkNamespacesInQuery()', () => {
        it('should have a method checkNamespacesInQuery()', () => {
            expect(graphVisualizerService.checkNamespacesInQuery).toBeDefined();
        });

        describe('should return `undefined`', () => {
            it('... if no queryString is given', () => {
                const tripleStr =
                    '@prefix ex: <http://example.org/> <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>';
                const result = graphVisualizerService.checkNamespacesInQuery(undefined, tripleStr);

                expect(result).toBe(undefined);
            });

            it('... if no tripleString is given', () => {
                const queryStr = 'PREFIX ex: <http://example.org/> SELECT * WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.checkNamespacesInQuery(queryStr, undefined);

                expect(result).toBe(undefined);
            });

            it('... if no queryString and tripleString is given', () => {
                const result = graphVisualizerService.checkNamespacesInQuery(undefined, undefined);

                expect(result).toBe(undefined);
            });
        });

        it('should add missing namespaces from the tripleString to the queryString', () => {
            const tripleStr =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
            const queryStr = 'SELECT * WHERE { ?s ?p ?o }';
            const expectedResult = 'PREFIX ex: <http://example.org/>\nSELECT * WHERE { ?s ?p ?o }';

            const result = graphVisualizerService.checkNamespacesInQuery(queryStr, tripleStr);

            expect(result).toBeDefined();
            expect(result).withContext(`should be ${expectedResult}`).toBe(expectedResult);
        });

        describe('should check qNames from the query if a qName is not referenced in the list of namespaces and ...', () => {
            describe('if the qName is not in the list of default namespaces', () => {
                it('... warn in the console ', () => {
                    const tripleStr =
                        '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>';
                    const queryStr = 'SELECT * WHERE { ?s xyz:composer ?o }';
                    const expectedFirstWarning = `Prefix 'xyz:' not declared in SPARQL and/or Turtle header. Searching in default namespaces...`;
                    const expectedSecondWarning = `'xyz:' is unknown. Please provide a declaration.`;

                    graphVisualizerService.checkNamespacesInQuery(queryStr, tripleStr);

                    expectSpyCall(consoleSpy, 2);

                    expect(consoleSpy.calls.argsFor(0)).toBeDefined();
                    expect(consoleSpy.calls.argsFor(0))
                        .withContext(`should equal ${expectedFirstWarning}`)
                        .toEqual([expectedFirstWarning]);

                    expect(consoleSpy.calls.argsFor(1)).toBeDefined();
                    expect(consoleSpy.calls.argsFor(1))
                        .withContext(`should equal ${expectedSecondWarning}`)
                        .toEqual([expectedSecondWarning]);
                });
            });

            describe('if the qName is in the list of default namespaces', () => {
                it('... prepend missing namespaces to the queryString prefixes', () => {
                    const tripleStr =
                        '@prefix ex: <http://example.org/> .\n<http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
                    const queryStr = 'PREFIX ex: <http://example.org/>\nSELECT * WHERE { ?s foaf:age ?o }';
                    const expectedResult = `PREFIX foaf: <http://xmlns.com/foaf/0.1/>\nPREFIX ex: <http://example.org/>\nSELECT * WHERE { ?s foaf:age ?o }`;

                    const result = graphVisualizerService.checkNamespacesInQuery(queryStr, tripleStr);

                    expect(result).toBeDefined();
                    expect(result.trim()).withContext(`should be ${expectedResult}`).toBe(expectedResult);
                });

                it('... warn in the console ', () => {
                    const tripleStr =
                        '@prefix ex: <http://example.org/> .\n<http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
                    const queryStr = 'PREFIX ex: <http://example.org/>\nSELECT * WHERE { ?s foaf:age ?o }';
                    const expectedFirstWarning = `Prefix 'foaf:' not declared in SPARQL and/or Turtle header. Searching in default namespaces...`;
                    const expectedSecondWarning = `Added 'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n' to SPARQL prefixes from list of default namespaces.`;

                    graphVisualizerService.checkNamespacesInQuery(queryStr, tripleStr);

                    expectSpyCall(consoleSpy, 2);

                    expect(consoleSpy.calls.argsFor(0)).toBeDefined();
                    expect(consoleSpy.calls.argsFor(0))
                        .withContext(`should equal ${expectedFirstWarning}`)
                        .toEqual([expectedFirstWarning]);

                    expect(consoleSpy.calls.argsFor(1)).toBeDefined();
                    expect(consoleSpy.calls.argsFor(1))
                        .withContext(`should equal ${expectedSecondWarning}`)
                        .toEqual([expectedSecondWarning]);
                });
            });
        });

        it('should throw an error if extractNamespacesFromString() is called with another type than TURTLE or SPARQL', () => {
            const tripleStr =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>';
            const expectedError = 'The type must be TURTLE or SPARQL, but was: undefined.';

            expect(() => (graphVisualizerService as any)._extractNamespacesFromString(undefined, tripleStr))
                .withContext('should throw an error')
                .toThrowError(expectedError);
        });
    });

    describe('#doQuery()', () => {
        it('should have a `doQuery` method', () => {
            expect(graphVisualizerService.doQuery).toBeDefined();
        });

        it('should create an instance of rdfstore', async () => {
            const queryStr = 'CONSTRUCT WHERE { ?s ?p ?o }';
            const tripleStr =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
            const queryType = 'construct';

            await graphVisualizerService.doQuery(queryType, queryStr, tripleStr);

            expect((graphVisualizerService as any)._store).toBeDefined();
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

                expect(result).toBeDefined();
                expect(result).withContext(`should equal ${expectedConstructResult}`).toEqual(expectedConstructResult);
            });

            it('... and return QueryResult with SELECT query', async () => {
                const queryStr = 'PREFIX ex: <http://example.org/> SELECT * WHERE { ?s ?p ?o . }';
                const tripleStr =
                    '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
                const queryType = 'select';
                const expectedSelectResult: QueryResult = {
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

                expect(result).toBeDefined();
                expect(result).withContext(`should equal ${expectedSelectResult}`).toEqual(expectedSelectResult);
            });

            it('... and transform integer literals to number labels in a SELECT response', async () => {
                const queryStr = 'PREFIX ex: <http://example.org/> SELECT * WHERE { ?s ?p ?o . }';
                const tripleStr =
                    '@prefix ex: <http://example.org/>. ' +
                    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> . ' +
                    '<http://example.org/subject> <http://example.org/predicate> "1"^^xsd:nonNegativeInteger . ' +
                    '<http://example.org/subject2> <http://example.org/predicate2> "2"^^xsd:integer . ';
                const queryType = 'select';
                const expectedSelectResult: QueryResult = {
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

                expect(result).toBeDefined();
                expect(result).withContext(`should equal ${expectedSelectResult}`).toEqual(expectedSelectResult);
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

                    spyOn(graphVisualizerService as any, '_executeQuery').and.resolveTo('');

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

                spyOn(graphVisualizerService as any, '_executeQuery').and.resolveTo([]);

                const result = await graphVisualizerService.doQuery(queryType, queryStr, tripleStr);

                expect(result).toBeDefined();
                expect(result).withContext(`should equal ${expectedResponse}`).toEqual(expectedResponse);
            });
        });
    });

    describe('#parseTripleString()', () => {
        it('should have a `parseTripleString` method', () => {
            expect(graphVisualizerService.parseTripleString).toBeDefined();
        });

        it('should return a Promise of triples and namespaces', async () => {
            const triples =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';

            const result = graphVisualizerService.parseTripleString(triples);

            expect(result).toBeDefined();
            await expectAsync(result).toBeResolved();

            // TODO: check if the result is a Promise of Triple[] and Namespace[]
        });
    });
});
