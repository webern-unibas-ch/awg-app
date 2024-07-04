import { TestBed } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
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

    it('... should create', () => {
        expect(graphVisualizerService).toBeTruthy();
    });

    it('... should have not _store property yet', () => {
        expect((graphVisualizerService as any)._store).toBeUndefined();
    });

    describe('#limitTriples()', () => {
        it('... should have a method `limitTriples`', () => {
            expect(graphVisualizerService.limitTriples).toBeDefined();
        });

        describe('should return an empty array', () => {
            it('... if triples are undefined', () => {
                const limit = 3;

                const result = graphVisualizerService.limitTriples(undefined, limit);

                expectToEqual(result, []);
            });

            it('... if triples are null', () => {
                const limit = 3;

                const result = graphVisualizerService.limitTriples(null, limit);

                expectToEqual(result, []);
            });

            it('... if triples are empty array', () => {
                const limit = 3;

                const result = graphVisualizerService.limitTriples([], limit);

                expectToEqual(result, []);
            });
        });

        describe('should return the same Triple array', () => {
            it('... if the Triple array length is smaller than the given limit', () => {
                const inputWithTwoTriples: Triple[] = expectedTriples.slice(0, 2);
                const limit = 3;

                const result = graphVisualizerService.limitTriples(inputWithTwoTriples, limit);

                expectToEqual(result, inputWithTwoTriples);
            });

            it('... if the Triple array length is equal with the given limit', () => {
                const inputWithThreeTriples: Triple[] = expectedTriples.splice(0, 3);
                const limit = 3;

                const result = graphVisualizerService.limitTriples(inputWithThreeTriples, limit);

                expectToEqual(result, inputWithThreeTriples);
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

    describe('#abbreviateTriples()', () => {
        it('... should have a method `abbreviateTriples`', () => {
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

                expectToBe(result[0].subject, 'ex:subject1');
                expectToBe(result[0].predicate, 'ex:predicate1');
                expectToBe(result[0].object, 'ex:object1');

                expectToBe(result[1].subject, 'exs:subject2');
                expectToBe(result[1].predicate, 'exs:predicate2');
                expectToBe(result[1].object, 'exs:object2');
            });

            it('... if mimetype `text/turtle` is given', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };
                const mimetypeTurtle = 'text/turtle';

                const result = graphVisualizerService.abbreviateTriples(triples, namespaces, mimetypeTurtle);

                expectToBe(result[0].subject, 'ex:subject1');
                expectToBe(result[0].predicate, 'ex:predicate1');
                expectToBe(result[0].object, 'ex:object1');

                expectToBe(result[1].subject, 'exs:subject2');
                expectToBe(result[1].predicate, 'exs:predicate2');
                expectToBe(result[1].object, 'exs:object2');
            });

            it('... if no mimetype is given (`text/turtle` applied by default)', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };
                const mimetypeEmpty = '';

                const result = graphVisualizerService.abbreviateTriples(triples, namespaces, mimetypeEmpty);

                expectToBe(result[0].subject, 'ex:subject1');
                expectToBe(result[0].predicate, 'ex:predicate1');
                expectToBe(result[0].object, 'ex:object1');

                expectToBe(result[1].subject, 'exs:subject2');
                expectToBe(result[1].predicate, 'exs:predicate2');
                expectToBe(result[1].object, 'exs:object2');
            });
        });

        describe('should not abbreviate the given StoreTriples', () => {
            it('... if the IRI uses an unknown namespace', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {};

                const result = graphVisualizerService.abbreviateTriples(triples, namespaces);

                expectToBe(result[0].subject, 'http://example.org/subject1');
                expectToBe(result[0].predicate, 'http://example.org/predicate1');
                expectToBe(result[0].object, 'http://example.org/object1');

                expectToBe(result[1].subject, 'https://example.org/subject2');
                expectToBe(result[1].predicate, 'https://example.org/predicate2');
                expectToBe(result[1].object, 'https://example.org/object2');
            });

            it('... if a given mimetype is not `text/turtle`', () => {
                const triples: RDFStoreConstructResponseTriple[] = expectedConstructResponseTriples;
                const namespaces = {
                    ex: 'http://example.org/',
                    exs: 'https://example.org/',
                };
                const mimetypePlain = 'text/plain';

                const result = graphVisualizerService.abbreviateTriples(triples, namespaces, mimetypePlain);

                expectToBe(result[0].subject, 'http://example.org/subject1');
                expectToBe(result[0].predicate, 'http://example.org/predicate1');
                expectToBe(result[0].object, 'http://example.org/object1');

                expectToBe(result[1].subject, 'https://example.org/subject2');
                expectToBe(result[1].predicate, 'https://example.org/predicate2');
                expectToBe(result[1].object, 'https://example.org/object2');
            });
        });
    });

    describe('#getQuerytype()', () => {
        it('... should have a method `getQuerytype`', () => {
            expect(graphVisualizerService.getQuerytype).toBeDefined();
        });

        describe('should return correct querytpe', () => {
            it('... if the query is a SELECT query (= `select`)', () => {
                const query = 'SELECT * WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expectToBe(result, 'select');
            });

            it('... if the query is a CONSTRUCT query (= `construct`)', () => {
                const query = 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expectToBe(result, 'construct');
            });

            it('... if the query is an ASK query (= `ask`)', () => {
                const query = 'ASK WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expectToBe(result, 'ask');
            });

            it('... if the query is a DESCRIBE query (= `describe`)', () => {
                const query = 'DESCRIBE ?s WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expectToBe(result, 'describe');
            });

            it('... if the query is a COUNT query (= `count`)', () => {
                const query = 'COUNT ?s WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expectToBe(result, 'count');
            });

            it('... if the query is a DELETE query (= `update`)', () => {
                const query = 'DELETE  {?s ?p ?o } WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expectToBe(result, 'update');
            });

            it('... if the query is an INSERT query (= `update`)', () => {
                const query = 'INSERT { ?s ?p ?o } WHERE { ?s ?p ?o} ';

                const result = graphVisualizerService.getQuerytype(query);

                expectToBe(result, 'update');
            });

            it('... if the query starts with prefixes', () => {
                const query = 'PREFIX ex: <http://example.org/> SELECT * WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.getQuerytype(query);

                expectToBe(result, 'select');
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

    describe('#checkNamespacesInQuery()', () => {
        it('... should have a method `checkNamespacesInQuery`', () => {
            expect(graphVisualizerService.checkNamespacesInQuery).toBeDefined();
        });

        describe('should return `undefined`', () => {
            it('... if no queryString is given', () => {
                const tripleStr =
                    '@prefix ex: <http://example.org/> <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>';
                const result = graphVisualizerService.checkNamespacesInQuery(undefined, tripleStr);

                expect(result).toBeUndefined();
            });

            it('... if no tripleString is given', () => {
                const queryStr = 'PREFIX ex: <http://example.org/> SELECT * WHERE { ?s ?p ?o }';

                const result = graphVisualizerService.checkNamespacesInQuery(queryStr, undefined);

                expect(result).toBeUndefined();
            });

            it('... if no queryString and tripleString is given', () => {
                const result = graphVisualizerService.checkNamespacesInQuery(undefined, undefined);

                expect(result).toBeUndefined();
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

                    expectToEqual(consoleSpy.calls.argsFor(0), [expectedFirstWarning]);
                    expectToEqual(consoleSpy.calls.argsFor(1), [expectedSecondWarning]);
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

                it('... warn in the console ', () => {
                    const tripleStr =
                        '@prefix ex: <http://example.org/> .\n<http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
                    const queryStr = 'PREFIX ex: <http://example.org/>\nSELECT * WHERE { ?s foaf:age ?o }';
                    const expectedFirstWarning = `Prefix 'foaf:' not declared in SPARQL and/or Turtle header. Searching in default namespaces...`;
                    const expectedSecondWarning = `Added 'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n' to SPARQL prefixes from list of default namespaces.`;

                    graphVisualizerService.checkNamespacesInQuery(queryStr, tripleStr);

                    expectSpyCall(consoleSpy, 2);

                    expectToEqual(consoleSpy.calls.argsFor(0), [expectedFirstWarning]);
                    expectToEqual(consoleSpy.calls.argsFor(1), [expectedSecondWarning]);
                });
            });
        });

        it('... should throw an error if extractNamespacesFromString() is called with another type than TURTLE or SPARQL', () => {
            const tripleStr =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>';
            const expectedError = 'The type must be TURTLE or SPARQL, but was: undefined.';

            expect(() =>
                (graphVisualizerService as any)._extractNamespacesFromString(undefined, tripleStr)
            ).toThrowError(expectedError);
        });
    });

    describe('#doQuery()', () => {
        it('... should have a method `doQuery`', () => {
            expect(graphVisualizerService.doQuery).toBeDefined();
        });

        it('... should create an instance of rdfstore', async () => {
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

                expectToEqual(result, expectedConstructResult);
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

                expectToEqual(result, expectedResponse);
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

            await expectAsync(graphVisualizerService.parseTripleString(triples)).toBeResolved();

            const result = await graphVisualizerService.parseTripleString(triples);

            expect(result).toBeDefined();
            expectToEqual(result.namespaces, { ex: 'http://example.org/', ex2: 'http://example2.org/' });
            expectToBe(Array.isArray(result.triples), true);
            expectToBe(result.triples.length, 1);
            expectToBe(result.triples[0].subject.id, 'http://example.org/subject');
            expectToBe(result.triples[0].predicate.id, 'http://example.org/predicate');
            expectToBe(result.triples[0].object.id, 'http://example.org/object');
        });

        it('... should return a Promise of empty triples and namespaces for an empty triple string', async () => {
            const triples = '';

            await expectAsync(graphVisualizerService.parseTripleString(triples)).toBeResolved();

            const result = await graphVisualizerService.parseTripleString(triples);

            expect(result).toBeDefined();
            expectToEqual(result.namespaces, {});
            expectToBe(Array.isArray(result.triples), true);
            expectToBe(result.triples.length, 0);
        });

        describe('... should throw an error', () => {
            it('... for missing dots', async () => {
                const triplesWithSyntaxError =
                    '@prefix ex: <http://example.org/>  @prefix ex2: <http://example2.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';

                await expectAsync(
                    graphVisualizerService.parseTripleString(triplesWithSyntaxError)
                ).toBeRejectedWithError('Expected declaration to end with a dot on line 1.');
            });

            it('... for missing @', async () => {
                const triplesWithSyntaxError =
                    'prefix ex: <http://example.org/>. @prefix ex2: <http://example2.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';

                await expectAsync(
                    graphVisualizerService.parseTripleString(triplesWithSyntaxError)
                ).toBeRejectedWithError('Expected entity but got . on line 1.');
            });

            it('... for missing prefix', async () => {
                const triplesWithSyntaxError =
                    '@prefix ex: <http://example.org/>. ex2: <http://example2.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';

                await expectAsync(
                    graphVisualizerService.parseTripleString(triplesWithSyntaxError)
                ).toBeRejectedWithError('Undefined prefix "ex2:" on line 1.');
            });
        });
    });
});
