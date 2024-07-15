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
        consoleSpy = spyOn(console, 'error').and.callFake(mockConsole.log);
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
            expectToEqual((graphVisualizerService as any)._store.constructor.name, 'Store');
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

        describe('should return the original Triple array', () => {
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
            expectToBe(Array.isArray(result.quads), true);
            expectToBe(result.quads.length, 1);
            expectToBe(result.quads[0].subject.id, 'http://example.org/subject');
            expectToBe(result.quads[0].predicate.id, 'http://example.org/predicate');
            expectToBe(result.quads[0].object.id, 'http://example.org/object');
        });

        it('... should return a Promise of empty triples and namespaces for an empty triple string', async () => {
            const triples = '';

            await expectAsync(graphVisualizerService.parseTripleString(triples)).toBeResolved();

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

            it('... for missing prefix marker', async () => {
                const triplesWithSyntaxError =
                    '@prefix ex: <http://example.org/>. ex2: <http://example2.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';

                await expectAsync(
                    graphVisualizerService.parseTripleString(triplesWithSyntaxError)
                ).toBeRejectedWithError('Undefined prefix "ex2:" on line 1.');
            });
        });
    });

    describe('#_abbreviate()', () => {
        it('... should have a method `_abbreviate`', () => {
            expect((graphVisualizerService as any)._abbreviate).toBeDefined();
        });

        describe('... should return an abbreviated IRI if', () => {
            it('... the given IRI matches a given namespace', () => {
                const iri = 'http://example.org/subject';
                const namespaces = { ex: 'http://example.org/' };
                const expectedAbbreviation = 'ex:subject';

                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });

            it('... the given IRI matches one of the provided namespaces', () => {
                const iri = 'http://example2.org/subject';
                const namespaces = {
                    ex: 'http://example.org/',
                    ex2: 'http://example2.org/',
                    ex3: 'http://example3.org/',
                };
                const expectedAbbreviation = 'ex2:subject';

                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });

            it('... the given IRI matches multiple namespaces (using the first matching namespace)', () => {
                const iri = 'http://example.com/subject';
                const namespaces = {
                    other: 'http://other.org/subject',
                    ex1: 'http://example.com/',
                    ex2: 'http://example.com/',
                    ex3: 'http://example.com/',
                };
                const expectedAbbreviation = 'ex1:subject';

                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expect(result).toBe(expectedAbbreviation);
            });
        });

        describe('... should return a partially (incorrect) abbreviated IRI if', () => {
            it('... the namespace does not have a trailing slash', () => {
                const iri = 'http://example.org/subject';
                const namespaces = { ex: 'http://example.org' };
                const expectedAbbreviation = 'ex:/subject';

                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });

            it('... the namespace does not have a trailing hash', () => {
                const iri = 'http://example.org#subject';
                const namespaces = { ex: 'http://example.org' };
                const expectedAbbreviation = 'ex:#subject';

                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });

            it('... the namespace matches the IRI exactly', () => {
                const iri = 'http://example.org/';
                const namespaces = { ex: 'http://example.org/' };
                const expectedAbbreviation = 'ex:';

                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });
        });

        describe('... should return the original IRI if', () => {
            it('... the given IRI does not start with http', () => {
                const notFullIri = 'ex:subject';
                const namespaces = { ex: 'http://example.org/' };
                const expectedAbbreviation = 'ex:subject';

                const result = (graphVisualizerService as any)._abbreviate(notFullIri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });

            it('... no namespaces are provided', () => {
                const iri = 'http://example.org/subject';
                const namespaces = {};
                const expectedAbbreviation = 'http://example.org/subject';

                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });

            it('... the given namespaces are undefined or null', () => {
                const iri = 'http://example.org/subject';
                const namespaces = undefined;
                const expectedAbbreviation = 'http://example.org/subject';

                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, expectedAbbreviation);

                const namespaces2 = null;

                const result2 = (graphVisualizerService as any)._abbreviate(iri, namespaces2);

                expectToBe(result2, expectedAbbreviation);
            });

            it('... the given IRI does not match a given namespace', () => {
                const notMatchingIri = 'http://other.org/subject';
                const namespaces = { ex: 'http://example.org/' };
                const expectedAbbreviation = 'http://other.org/subject';

                const result = (graphVisualizerService as any)._abbreviate(notMatchingIri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });

            it('... the given IRI does not match any of the provided namespaces', () => {
                const notMatchingIri = 'http://other.org/subject';
                const namespaces = {
                    ex: 'http://example.org/',
                    ex2: 'http://example2.org/',
                    ex3: 'http://example3.org/',
                };
                const expectedAbbreviation = 'http://other.org/subject';

                const result = (graphVisualizerService as any)._abbreviate(notMatchingIri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });

            it('... the given IRI does not match a given namespace respecting case sensitivity', () => {
                const iri = 'http://example.org/subject';
                const namespaces = { ex: 'http://EXAMPLE.org/' };
                const expectedAbbreviation = 'http://example.org/subject';

                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });

            it('... the given IRI only partially matches a given namespace', () => {
                const iri = 'http://example.org#subject';
                const namespaces = { ex: 'http://example.org/' };
                const expectedAbbreviation = 'http://example.org#subject';

                const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

                expectToBe(result, expectedAbbreviation);
            });
        });

        it('... should return `undefined` if the given IRI is undefined', () => {
            const iri = undefined;
            const namespaces = { ex: 'http://example.org/' };

            const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

            expect(result).toBeUndefined();
        });

        it('... should return `null` if the given IRI is null', () => {
            const iri = null;
            const namespaces = { ex: 'http://example.org/' };

            const result = (graphVisualizerService as any)._abbreviate(iri, namespaces);

            expectToBe(result, null);
        });
    });

    describe('#_createStore()', () => {
        it('... should have a method `_createStore`', () => {
            expect((graphVisualizerService as any)._createStore).toBeDefined();
        });

        it('... should return a Promise of an rdfstore instance', async () => {
            await expectAsync((graphVisualizerService as any)._createStore(global.rdfstore)).toBeResolved();
        });

        it('... should return a Promise of an rdfstore instance with load and execute methods', async () => {
            const result = await (graphVisualizerService as any)._createStore(global.rdfstore);

            expect(result).toBeDefined();
            expectToBe(result.constructor.name, 'Store');
            expect(result.load).toBeDefined();
            expect(result.execute).toBeDefined();
        });

        it('... should reject if store.create encounters an error', async () => {
            const expectedError = new Error('Test error');
            const mockStore = {
                create: callback => {
                    callback(expectedError, null);
                },
            };

            const storeSpy = spyOn(mockStore, 'create').and.callThrough();

            await expectAsync((graphVisualizerService as any)._createStore(mockStore)).toBeRejectedWith(expectedError);

            expectSpyCall(storeSpy, 1, [jasmine.any(Function)]);
        });
    });

    describe('#_executeQuery()', () => {
        let store;

        beforeEach(async () => {
            store = await (graphVisualizerService as any)._createStore(global.rdfstore);

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

            const result = await (graphVisualizerService as any)._executeQuery(store, query);

            expectToBe(result.triples.length, 2);
            result.triples.forEach((triple, index: number) => {
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

            const result = await (graphVisualizerService as any)._executeQuery(store, query);

            expectToBe(result.length, 2);
            result.forEach((triple, index: number) => {
                expectToEqual(triple, expectedQueryResult[index]);
            });
        });

        it('... should reject if query is empty', async () => {
            const emptyQuery = '';

            await expectAsync((graphVisualizerService as any)._executeQuery(store, emptyQuery)).toBeRejected();
        });

        it('... should reject and throw/log an error if store.execute encounters an error', async () => {
            const expectedError = new Error('Test error');
            const mockStore = {
                execute: (query, callback) => {
                    callback(expectedError, null);
                },
            };

            const storeSpy = spyOn(mockStore, 'execute').and.callThrough();

            const testQuery = 'SELECT * WHERE { ?s ?p ?o }';

            await expectAsync((graphVisualizerService as any)._executeQuery(mockStore, testQuery)).toBeRejectedWith(
                expectedError
            );

            expectSpyCall(storeSpy, 1, [testQuery, jasmine.any(Function)]);
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

            expect(() => (graphVisualizerService as any)._extractNamespacesFromString('OTHER', tripleStr)).toThrowError(
                expectedError
            );
        });
    });

    describe('#_extractQNamePrefixesFromSPARQLWhereClause()', () => {
        it('... should have a method `_extractQNamePrefixesFromSPARQLWhereClause`', () => {
            expect((graphVisualizerService as any)._extractQNamePrefixesFromSPARQLWhereClause).toBeDefined();
        });

        it('... should return an empty array if no prefixes are in the where clause', () => {
            const query = 'SELECT * WHERE { ?s ?p ?o . }';
            const expectedPrefixes = [];

            const result = (graphVisualizerService as any)._extractQNamePrefixesFromSPARQLWhereClause(query);

            expectToEqual(result, expectedPrefixes);
        });

        it('... should return an array of prefixes from the where clause', () => {
            const query = 'SELECT * WHERE { ex:s ex1:p ex2:o .}';
            const expectedPrefixes = ['ex', 'ex1', 'ex2'];

            const result = (graphVisualizerService as any)._extractQNamePrefixesFromSPARQLWhereClause(query);

            expectToEqual(result, expectedPrefixes);
        });

        it('... should return an array of unique prefixes from the where clause', () => {
            const query = 'SELECT * WHERE { ex:s ex1:p ex2:o . ex:s1 ex1:p1 ex2:o1 .}';
            const expectedPrefixes = ['ex', 'ex1', 'ex2'];

            const result = (graphVisualizerService as any)._extractQNamePrefixesFromSPARQLWhereClause(query);

            expectToEqual(result, expectedPrefixes);
        });

        it('... should return an array of unique prefixes from the where clause respecting case sensitivity', () => {
            const query =
                'SELECT * WHERE { ex:s ex1:p ex2:o . Ex:s1 Ex1:p1 Ex2:o1 . EX:s2 EX1:p2 EX2:o2 . eX:s3 eX1:p3 eX2:o3 .}';
            const expectedPrefixes = ['ex', 'ex1', 'ex2', 'Ex', 'Ex1', 'Ex2', 'EX', 'EX1', 'EX2', 'eX', 'eX1', 'eX2'];

            const result = (graphVisualizerService as any)._extractQNamePrefixesFromSPARQLWhereClause(query);

            expectToEqual(result, expectedPrefixes);
        });

        it('... should find prefixes when no where keyword is given', () => {
            const query = 'SELECT * { ex:s ex1:p ex2:o . ex:s1 ex1:p1 ex2:o1 .}';
            const expectedPrefixes = ['ex', 'ex1', 'ex2'];

            const result = (graphVisualizerService as any)._extractQNamePrefixesFromSPARQLWhereClause(query);

            expectToEqual(result, expectedPrefixes);
        });

        it('... should find prefixes starting with underscore, small letter or capital letter', () => {
            const query = 'SELECT * WHERE { _:s Ex1:p EX2:o . ex:s1 ex1:p1 ex2:o1 .}';
            const expectedPrefixes = ['_', 'Ex1', 'EX2', 'ex', 'ex1', 'ex2'];

            const result = (graphVisualizerService as any)._extractQNamePrefixesFromSPARQLWhereClause(query);

            expectToEqual(result, expectedPrefixes);
        });
    });

    describe('#_loadTriplesInStore()', () => {
        let store;

        beforeEach(async () => {
            store = await (graphVisualizerService as any)._createStore(global.rdfstore);
        });

        it('... should have a method `_loadTriplesInStore`', () => {
            expect((graphVisualizerService as any)._loadTriplesInStore).toBeDefined();
        });

        it('... should load a single triple into the rdfstore', async () => {
            const tripleStr =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>.';
            const expectedSize = 1;

            const size = await (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr);

            expectToBe(size, expectedSize);
        });

        it('... should load multiple triples into the rdfstore', async () => {
            const tripleStr =
                '@prefix ex: <http://example.org/>. <http://example.org/subject> <http://example.org/predicate> <http://example.org/object>. ' +
                '<http://example.org/subject2> <http://example.org/predicate2> <http://example.org/object2>;' +
                '<http://example.org/subject3> <http://example.org/predicate3> <http://example.org/object3>.';
            const expectedSize = 3;

            const size = await (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr);

            expectToBe(size, expectedSize);
        });

        it('... should load a huge number of triples into the rdfstore', async () => {
            let tripleStr = '@prefix ex: <http://example.org/>. ';
            const expectedSize = 1000;

            for (let i = 0; i < expectedSize; i++) {
                tripleStr += `<http://example.org/subject${i}> <http://example.org/predicate${i}> <http://example.org/object${i}>. `;
            }

            const size = await (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr);

            expectToBe(size, expectedSize);
        });

        it('... should load prefixed triples into the rdfstore', async () => {
            const tripleStr =
                '@prefix ex: <http://example.org/>. ' +
                'ex:subject ex:predicate ex:object. ' +
                'ex:subject2 ex:predicate2 ex:object2.';
            const expectedSize = 2;

            const size = await (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr);

            expectToBe(size, expectedSize);
        });

        it('... should load triples without prefixes or URIs into the rdfstore', async () => {
            const tripleStr = '<subject> <predicate> <object>.';
            const expectedSize = 1;

            const size = await (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr);

            expectToBe(size, expectedSize);
        });

        it('... should load triples with mimetype `text/turtle` by default (no mimetype given)', async () => {
            const tripleStr = '@prefix ex: <http://example.org/>. ex:subject ex:predicate ex:object.';
            const expectedSize = 1;

            const size = await (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr);

            expectToBe(size, expectedSize);
        });

        it('... should load triples with mimetype `text/turtle` if given', async () => {
            const tripleStr = '@prefix ex: <http://example.org/>. ex:subject ex:predicate ex:object.';
            const mimeType = 'text/turtle';
            const expectedSize = 1;

            const size = await (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr, mimeType);

            expectToBe(size, expectedSize);
        });

        it('... should load triples with mimetype `application/ld+json` if given', async () => {
            const tripleStr =
                '[{"@id":"http://example.org/object"},{"@id":"http://example.org/subject","http://example.org/predicate":[{"@id":"http://example.org/object"}]}]';
            const mimeType = 'application/ld+json';
            const expectedSize = 1;

            const size = await (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr, mimeType);

            expectToBe(size, expectedSize);
        });

        it('... should reject and throw/log an error if no parser is found for the provided mimeType', async () => {
            const tripleStr = '@prefix ex: <http://example.org/>. ex:subject ex:predicate ex:object.';
            const mimeType = 'application/rdf+xml';
            const expectedErrorMessage = `Cannot find parser for the provided media type:${mimeType}`;
            const expectedError = new Error(expectedErrorMessage);

            await expectAsync(
                (graphVisualizerService as any)._loadTriplesInStore(store, tripleStr, mimeType)
            ).toBeRejectedWithError(expectedErrorMessage);

            expectSpyCall(consoleSpy, 1, ['_loadTriplesInStore# got ERROR', expectedError]);
        });
    });

    describe('_mapKeys', () => {
        it('... should have a method `_mapKeys`', () => {
            expect((graphVisualizerService as any)._mapKeys).toBeDefined();
        });

        describe('... should return an empty object if', () => {
            it('... the input object is empty', () => {
                const inputObj = {};
                const keyMap = {
                    token: 'type',
                    type: 'datatype',
                    lang: 'xml:lang',
                };

                const result = (graphVisualizerService as any)._mapKeys(inputObj, keyMap);

                expectToEqual(result, {});
            });

            it('... the input object is null', () => {
                const inputObj = null;
                const keyMap = {
                    token: 'type',
                    type: 'datatype',
                    lang: 'xml:lang',
                };

                const result = (graphVisualizerService as any)._mapKeys(inputObj, keyMap);

                expectToEqual(result, {});
            });

            it('... the input object is undefined', () => {
                const inputObj = undefined;
                const keyMap = {
                    token: 'type',
                    type: 'datatype',
                    lang: 'xml:lang',
                };

                const result = (graphVisualizerService as any)._mapKeys(inputObj, keyMap);

                expectToEqual(result, {});
            });
        });

        describe('... should return the original object if', () => {
            it('... the new keys object is empty', () => {
                const inputObj = {
                    key1: 'value1',
                    key2: 'value2',
                };
                const keyMap = {};

                const result = (graphVisualizerService as any)._mapKeys(inputObj, keyMap);

                expectToEqual(result, inputObj);
            });

            it('... the new keys object is null', () => {
                const inputObj = {
                    key1: 'value1',
                    key2: 'value2',
                };
                const keyMap = null;

                const result = (graphVisualizerService as any)._mapKeys(inputObj, keyMap);

                expectToEqual(result, inputObj);
            });

            it('... the new keys object is undefined', () => {
                const inputObj = {
                    key1: 'value1',
                    key2: 'value2',
                };
                const keyMap = undefined;

                const result = (graphVisualizerService as any)._mapKeys(inputObj, keyMap);

                expectToEqual(result, inputObj);
            });
        });

        it('... should return an object with mapped keys', () => {
            const inputObj = {
                key1: 'value1',
                key2: 'value2',
            };
            const keyMap = {
                key1: 'key1Mapped',
                key2: 'key2Mapped',
            };
            const outputObj = {
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
            };
            outputObj['xml:lang'] = 'en';

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
            const mapKeysSpy = spyOn(graphVisualizerService as any, '_mapKeys').and.callThrough();

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
                const abbreviateSpy = spyOn(graphVisualizerService as any, '_abbreviate').and.callThrough();

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

        it('... should return a QueryResult object with mapped bindings and vars', () => {
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
            const expectedQueryResult = {
                status: 200,
                data: {
                    head: {
                        vars: ['key1', 'key2'],
                    },
                    body: {
                        bindings: [
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
                        ],
                    },
                },
            };

            const result = (graphVisualizerService as any)._prepareSelectResponse(selectResponse);

            expectToEqual(result, expectedQueryResult);
        });

        it('... should return status=400 and `Query returned no results` if selectRespone is empty', () => {
            const selectResponse = [];
            const expectedResponse = {
                status: 400,
                data: 'Query returned no results',
            };

            const result = (graphVisualizerService as any)._prepareSelectResponse(selectResponse);

            expectToEqual(result, expectedResponse);
        });

        it('... should return status=404 and undefined if selectRespone is undefined or null', () => {
            const selectResponse = undefined;
            const expectedResponse = {
                status: 404,
                data: undefined,
            };

            const result = (graphVisualizerService as any)._prepareSelectResponse(selectResponse);

            expectToEqual(result, expectedResponse);

            const selectResponse2 = null;

            const result2 = (graphVisualizerService as any)._prepareSelectResponse(selectResponse2);

            expectToEqual(result2, expectedResponse);
        });

        it('... should trigger `_prepareMappedBindings` method', () => {
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

            const prepareMappedBindingsSpy = spyOn(
                graphVisualizerService as any,
                '_prepareMappedBindings'
            ).and.callThrough();

            (graphVisualizerService as any)._prepareSelectResponse(selectResponse);

            expectSpyCall(prepareMappedBindingsSpy, 1, [selectResponse]);
        });
    });
});
