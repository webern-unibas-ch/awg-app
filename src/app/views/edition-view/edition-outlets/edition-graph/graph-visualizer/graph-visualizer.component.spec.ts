import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';
import Spy = jasmine.Spy;

import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';

import { Toast, ToastService } from '@awg-core/services/toast-service';

import { GraphRDFData, GraphSparqlQuery } from '@awg-views/edition-view/models';
import { D3SimulationNode, D3SimulationNodeType, Triple } from './models';
import { GraphVisualizerService } from './services/graph-visualizer.service';

import { GraphVisualizerComponent } from './graph-visualizer.component';

// Mock components
@Component({ selector: 'awg-construct-results', template: '' })
class ConstructResultsStubComponent {
    @Input()
    queryResult$: Observable<Triple[]>;
    @Input()
    defaultForceGraphHeight: number;
    @Input()
    isFullscreen: boolean;
    @Output()
    clickedNodeRequest: EventEmitter<D3SimulationNode> = new EventEmitter();
}

@Component({ selector: 'awg-select-results', template: '' })
class SelectResultsStubComponent {
    @Input()
    queryResult$: Observable<Triple[]>;
    @Input()
    queryTime: number;
    @Input()
    isFullscreen: boolean;
    @Output()
    clickedTableRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-sparql-editor', template: '' })
class SparqlEditorStubComponent {
    @Input()
    queryList: GraphSparqlQuery[];
    @Input()
    query: GraphSparqlQuery;
    @Input()
    isFullscreen: boolean;
    @Output()
    performQueryRequest: EventEmitter<void> = new EventEmitter();
    @Output()
    resetQueryRequest: EventEmitter<GraphSparqlQuery> = new EventEmitter();
    @Output()
    updateQueryStringRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-toast', template: '' })
class ToastStubComponent {}

@Component({ selector: 'awg-triples-editor', template: '' })
class TriplesEditorStubComponent {
    @Input() triples: string;
    @Input()
    isFullscreen: boolean;
    @Output()
    performQueryRequest: EventEmitter<void> = new EventEmitter();
    @Output()
    resetTriplesRequest: EventEmitter<void> = new EventEmitter();
    @Output()
    updateTriplesRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-unsupported-type-results', template: '' })
class UnsupportedTypeResultsStubComponent {
    @Input()
    queryType: string; // Query.queryType ?
}

describe('GraphVisualizerComponent (DONE)', () => {
    let component: GraphVisualizerComponent;
    let fixture: ComponentFixture<GraphVisualizerComponent>;
    let compDe: DebugElement;

    let mockGraphVisualizerService: Partial<GraphVisualizerService>;
    let graphVisualizerService: Partial<GraphVisualizerService>;
    let toastService: ToastService;

    let expectedGraphRDFData: GraphRDFData;
    let expectedResult: Triple[];
    let expectedIsFullscreen: boolean;

    let consoleSpy;
    let queryLocalStoreSpy: Spy;
    let performQuerySpy: Spy;
    let resetQuerySpy: Spy;
    let resetTriplesSpy: Spy;

    beforeEach(waitForAsync(() => {
        // Mocked dataStreamerService
        mockGraphVisualizerService = {
            checkNamespacesInQuery: (queryString: string, triples: string): string => queryString,
            getQuerytype: (queryString: string): string => 'construct',
            doQuery: (queryType: string, query: string, triples: string): Promise<Triple[]> =>
                new Promise((resolve, reject) => {
                    resolve(expectedResult);
                    reject({ name: 'Error1', message: 'failed' });
                }),
        };

        TestBed.configureTestingModule({
            declarations: [
                GraphVisualizerComponent,
                ConstructResultsStubComponent,
                SparqlEditorStubComponent,
                SelectResultsStubComponent,
                ToastStubComponent,
                TriplesEditorStubComponent,
                UnsupportedTypeResultsStubComponent,
            ],
            providers: [{ provide: GraphVisualizerService, useValue: mockGraphVisualizerService }, ToastService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GraphVisualizerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject service from root
        graphVisualizerService = TestBed.inject(GraphVisualizerService);
        toastService = TestBed.inject(ToastService);

        // Test data
        expectedGraphRDFData = new GraphRDFData();
        expectedGraphRDFData.queryList = [];
        expectedGraphRDFData.queryList.push({
            queryType: 'construct',
            queryLabel: 'Test Query 1',
            queryString: 'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test ?has ?success . }',
        });
        expectedGraphRDFData.queryList.push({
            queryType: 'construct',
            queryLabel: 'Test Query 2',
            queryString: 'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test2 ?has ?success2 . }',
        });
        expectedGraphRDFData.triples =
            '@prefix example: <https://example.com/onto#> .\n\n example:Test example:has example:Success .';

        expectedResult = [
            {
                subject: { nominalValue: 'Test' },
                predicate: { nominalValue: 'has' },
                object: { nominalValue: 'Success' },
            },
        ];

        expectedIsFullscreen = false;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        queryLocalStoreSpy = spyOn<any>(component, '_queryLocalStore').and.callThrough();
        performQuerySpy = spyOn(component, 'performQuery').and.callThrough();
        resetQuerySpy = spyOn(component, 'resetQuery').and.callThrough();
        resetTriplesSpy = spyOn(component, 'resetTriples').and.callThrough();
    });

    afterEach(() => {
        // Clear storages and mock objects after each test
        mockConsole.clear();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have graphRDFInputData', () => {
            expect(component.graphRDFInputData).toBeUndefined();
        });

        it('should not have isFullscreen', () => {
            expect(component.isFullscreen).toBeUndefined();
        });

        it('should not have query', () => {
            expect(component.query).toBeUndefined();
        });

        it('should not have queryList', () => {
            expect(component.queryList).toBeUndefined();
        });

        it('should not have queryResult', () => {
            expect(component.queryResult$).toBeUndefined();
        });

        it('should not have queryTime', () => {
            expect(component.queryTime).toBeUndefined();
        });

        it('should not have triples', () => {
            expect(component.triples).toBeUndefined();
        });

        it('should have defaultForceGraphHeight ', () => {
            expect(component.defaultForceGraphHeight).toBeTruthy();
            expect(component.defaultForceGraphHeight).withContext('should be 500').toBe(500);
        });

        it('should not have triggered `resetTriples()`', () => {
            expectSpyCall(resetTriplesSpy, 0);
        });

        it('should not have triggered `resetQuery()`', () => {
            expectSpyCall(resetQuerySpy, 0);
        });

        describe('VIEW', () => {
            it('... should not contain any content (div.row)', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.graphRDFInputData = expectedGraphRDFData;
            component.isFullscreen = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have triggered `resetTriples()`', () => {
            expectSpyCall(resetTriplesSpy, 1, undefined);
        });

        it('should have triggered `resetQuery()`', () => {
            expectSpyCall(resetQuerySpy, 1, undefined);
        });

        it('should have graphRDFInputData', () => {
            expect(component.graphRDFInputData).toBeDefined();
            expect(component.graphRDFInputData)
                .withContext(`should equal ${expectedGraphRDFData}`)
                .toEqual(expectedGraphRDFData);
        });

        it('should have `isFullScreen` input', () => {
            expect(component.isFullscreen).toBeDefined();
            expect(component.isFullscreen).withContext(`should be ${expectedIsFullscreen}`).toBe(expectedIsFullscreen);
        });

        it('should have triples', () => {
            expect(component.triples).toBeDefined();
            expect(component.triples)
                .withContext(`should equal ${expectedGraphRDFData.triples}`)
                .toEqual(expectedGraphRDFData.triples);
        });

        it('should have queryList', () => {
            expect(component.queryList).toBeDefined();
            expect(component.queryList)
                .withContext(`should equal ${expectedGraphRDFData.triples}`)
                .toEqual(expectedGraphRDFData.queryList);
        });

        it('should have query', () => {
            expect(component.query).toBeDefined();
            expect(component.query)
                .withContext(`should equal ${expectedGraphRDFData.triples}`)
                .toEqual(expectedGraphRDFData.queryList[0]);
        });

        it('should have queryResult', () => {
            expect(component.queryResult$).toBeDefined();
            component.queryResult$.subscribe(result => {
                expect(result).toBeTruthy();
                expect(result).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
            });
        });

        it('should have queryTime', async () => {
            const expectedCallback = [
                'construct',
                expectedGraphRDFData.queryList[0].queryString,
                expectedGraphRDFData.triples,
            ];

            await expectAsync(
                graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
            ).toBeResolvedTo(expectedResult);

            expect(component.queryTime).toBeDefined();
            // Value is not predictable
        });

        describe('#resetTriples', () => {
            it('... should set initial triples', () => {
                expectSpyCall(resetTriplesSpy, 1, undefined);

                expect(component.triples).toBeDefined();
                expect(component.triples)
                    .withContext(`should equal ${expectedGraphRDFData.triples}`)
                    .toEqual(expectedGraphRDFData.triples);
            });

            it('... should reset changed triples to initial triples', () => {
                expectSpyCall(resetTriplesSpy, 1, undefined);

                // Set changed triples
                const changedTriples =
                    '@prefix example: <https://example.com/onto#> .\n\n example:Test2 example:has example:Success2 .';
                component.triples = changedTriples;
                fixture.detectChanges();

                expect(component.triples).toBeDefined();
                expect(component.triples).withContext(`should equal ${changedTriples}`).toEqual(changedTriples);

                // Reset triples
                component.resetTriples();
                fixture.detectChanges();

                expectSpyCall(resetTriplesSpy, 2, undefined);
                expect(component.triples).toBeDefined();
                expect(component.triples)
                    .withContext(`should equal ${expectedGraphRDFData.triples}`)
                    .toEqual(expectedGraphRDFData.triples);
            });

            it('... should not do anything if no triples are provided from rdf data', () => {
                expectSpyCall(resetTriplesSpy, 1);

                // Set undefined triples
                component.triples = undefined;
                component.graphRDFInputData.triples = undefined;
                fixture.detectChanges();

                // Reset triples
                component.resetTriples();
                fixture.detectChanges();

                expectSpyCall(resetTriplesSpy, 2);
                expect(component.triples).toBeUndefined();
            });

            it('... should trigger on resetTriplesRequest event from TriplesEditorComponent', () => {
                expectSpyCall(resetTriplesSpy, 1, undefined);

                const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                const editorCmp = editorDes[0].injector.get(TriplesEditorStubComponent) as TriplesEditorStubComponent;

                editorCmp.resetTriplesRequest.emit();

                expectSpyCall(resetTriplesSpy, 2, undefined);
            });
        });

        describe('#resetQuery', () => {
            it('... should set initial queryList', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                expect(component.queryList).toBeDefined();
                expect(component.queryList)
                    .withContext(`should equal ${expectedGraphRDFData.queryList}`)
                    .toEqual(expectedGraphRDFData.queryList);
            });

            it('... should set initial query', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                expect(component.query).toBeDefined();
                expect(component.query)
                    .withContext(`should equal ${expectedGraphRDFData.queryList[0]}`)
                    .toEqual(expectedGraphRDFData.queryList[0]);
            });

            it('... should find and reset a query from queryList if queryLabel and queryType is known', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                // Request for query with known queryLabel and queryType
                const changedQuery = { ...expectedGraphRDFData.queryList[1] };

                component.resetQuery(changedQuery);
                fixture.detectChanges();

                // Matches queryList queries by label
                expectSpyCall(resetQuerySpy, 2, undefined);

                expect(component.query).toBeDefined();
                expect(component.query).withContext(`should equal ${changedQuery}`).toEqual(changedQuery);

                expect(component.query.queryLabel).toBeDefined();
                expect(component.query.queryLabel)
                    .withContext(`should equal ${changedQuery.queryLabel}`)
                    .toEqual(changedQuery.queryLabel);

                expect(component.query.queryType).toBeDefined();
                expect(component.query.queryType)
                    .withContext(`should equal ${changedQuery.queryType}`)
                    .toEqual(changedQuery.queryType);
            });

            it('... should not find and reset a query from queryList if only queryLabel is known but not queryType', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                // Request for query with known queryLabel but unknown queryType
                const changedQuery = { ...expectedGraphRDFData.queryList[1] };
                changedQuery.queryType = 'select';

                component.resetQuery(changedQuery);
                fixture.detectChanges();

                // Matches queryList queries only by label
                expectSpyCall(resetQuerySpy, 2, undefined);

                expect(component.query).toBeDefined();
                expect(component.query).withContext(`should equal ${changedQuery}`).toEqual(changedQuery);

                expect(component.query.queryLabel).toBeDefined();
                expect(component.query.queryLabel)
                    .withContext(`should equal ${changedQuery.queryLabel}`)
                    .toBe(changedQuery.queryLabel);

                expect(component.query.queryType).toBeDefined();
                expect(component.query.queryType)
                    .withContext(`should equal ${changedQuery.queryType}`)
                    .toBe(changedQuery.queryType);
            });

            it('... should not find and reset a query from queryList if only queryType is known but not queryLabel', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                // Request for query with known queryType but unknown label
                const changedQuery = { ...expectedGraphRDFData.queryList[1] };
                changedQuery.queryLabel = 'select all bananas';

                component.resetQuery(changedQuery);
                fixture.detectChanges();

                // Matches queryList queries only by type
                expectSpyCall(resetQuerySpy, 2, undefined);

                expect(component.query).toBeDefined();
                expect(component.query).withContext(`should equal ${changedQuery}`).toEqual(changedQuery);

                expect(component.query.queryLabel).toBeDefined();
                expect(component.query.queryLabel)
                    .withContext(`should equal ${changedQuery.queryLabel}`)
                    .toBe(changedQuery.queryLabel);

                expect(component.query.queryType).toBeDefined();
                expect(component.query.queryType)
                    .withContext(`should equal ${changedQuery.queryType}`)
                    .toBe(changedQuery.queryType);
            });

            it('... should set an unkown query that is not in queryList as is', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                // Request for unknown query
                const changedQuery = {
                    queryType: 'SELECT',
                    queryLabel: 'Test Query 3',
                    queryString:
                        'PREFIX example: <https://example.com/onto#> \n\n SELECT * WHERE { ?test3 ?has ?success3 . }',
                };
                component.resetQuery(changedQuery);
                fixture.detectChanges();

                expectSpyCall(resetQuerySpy, 2, undefined);

                expect(component.query).toBeDefined();
                expect(component.query).withContext(`should equal ${changedQuery}`).toEqual(changedQuery);

                expect(component.query.queryLabel).toBeDefined();
                expect(component.query.queryLabel)
                    .withContext(`should equal ${changedQuery.queryLabel}`)
                    .toBe(changedQuery.queryLabel);

                expect(component.query.queryType).toBeDefined();
                expect(component.query.queryType)
                    .withContext(`should equal ${changedQuery.queryType}`)
                    .toBe(changedQuery.queryType);
            });

            it('... should set initial query (queryList[0]) if no query is provided', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                // Set changed query
                const changedQuery = { ...expectedGraphRDFData.queryList[1] };
                component.query = changedQuery;
                fixture.detectChanges();

                expect(component.query).toBeDefined();
                expect(component.query).withContext(`should equal ${changedQuery}`).toEqual(changedQuery);

                // Reset triples
                component.resetQuery();
                fixture.detectChanges();

                expectSpyCall(resetQuerySpy, 2, undefined);

                expect(component.query).toBeDefined();
                expect(component.query)
                    .withContext(`should equal ${expectedGraphRDFData.queryList[0]}`)
                    .toEqual(expectedGraphRDFData.queryList[0]);
            });

            it('... should not do anything if no queryList is provided from rdf data', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                // Set undefined triples
                component.queryList = undefined;
                component.graphRDFInputData.queryList = undefined;
                fixture.detectChanges();

                // Reset query
                const changedQuery = {
                    queryType: 'construct',
                    queryLabel: 'Test Query 3',
                    queryString:
                        'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test3 ?has ?success3 . }',
                };
                component.resetQuery(changedQuery);
                fixture.detectChanges();

                expectSpyCall(resetQuerySpy, 2, changedQuery);
                expect(component.queryList).toBeUndefined();
            });

            it('... should trigger on resetQueryRequest event from SparqlEditorComponent', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                const editorDes = getAndExpectDebugElementByDirective(compDe, SparqlEditorStubComponent, 1, 1);
                const editorCmp = editorDes[0].injector.get(SparqlEditorStubComponent) as SparqlEditorStubComponent;

                // Set changed query
                editorCmp.resetQueryRequest.emit(expectedGraphRDFData.queryList[1]);

                expectSpyCall(resetQuerySpy, 2, expectedGraphRDFData.queryList[1]);
            });

            it('... should trigger `performQuery()`', () => {
                expectSpyCall(performQuerySpy, 1, undefined);

                // Reset query
                component.resetQuery(expectedGraphRDFData.queryList[1]);
                fixture.detectChanges();

                expectSpyCall(resetQuerySpy, 2, expectedGraphRDFData.queryList[1]);
                expectSpyCall(performQuerySpy, 2, undefined);
            });
        });

        describe('#performQuery', () => {
            it('... should append namespaces to query if no prefixes given', () => {
                expectSpyCall(performQuerySpy, 1, undefined);

                const queryStringWithoutPrefixes = 'CONSTRUCT WHERE { ?test ?has ?success . }';
                const queryWithoutPrefixes: GraphSparqlQuery = {
                    queryType: 'construct',
                    queryLabel: 'Test Query 1',
                    queryString: queryStringWithoutPrefixes,
                };
                const namespaceSpy = spyOn(graphVisualizerService, 'checkNamespacesInQuery').and.returnValue(
                    'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test ?has ?success . }'
                );

                // Perform query without prefixes
                component.query = queryWithoutPrefixes;
                component.performQuery();
                fixture.detectChanges();

                expectSpyCall(performQuerySpy, 2, undefined);
                expectSpyCall(namespaceSpy, 1, [queryStringWithoutPrefixes, expectedGraphRDFData.triples]);

                expect(component.query).toBeDefined();
                expect(component.query)
                    .withContext(`should equal ${expectedGraphRDFData.queryList[0]}`)
                    .toEqual(expectedGraphRDFData.queryList[0]);
            });

            it('... should get queryType from service', () => {
                expectSpyCall(performQuerySpy, 1, undefined);

                const queryTypeSpy = spyOn(graphVisualizerService, 'getQuerytype').and.callThrough();

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                expectSpyCall(performQuerySpy, 2, undefined);
                expectSpyCall(queryTypeSpy, 1, expectedGraphRDFData.queryList[0].queryString);

                expect(component.query.queryType).toBeDefined();
                expect(component.query.queryType).withContext('should equal construct').toEqual('construct');
            });

            it('... should trigger `_queryLocalStore` for construct queries', () => {
                spyOn(graphVisualizerService, 'getQuerytype').and.returnValue('construct');

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                // First spy call already triggered by ChangeDetection in beforeEach
                expectSpyCall(performQuerySpy, 2, undefined);
                expectSpyCall(queryLocalStoreSpy, 2, [
                    'construct',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ]);
            });

            it('... should trigger `_queryLocalStore` for select queries', () => {
                spyOn(graphVisualizerService, 'getQuerytype').and.returnValue('select');

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                // First spy call already triggered by ChangeDetection in beforeEach
                expectSpyCall(performQuerySpy, 2, undefined);
                expectSpyCall(queryLocalStoreSpy, 2, [
                    'select',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ]);
            });

            it('... should get queryResult for construct queries', waitForAsync(() => {
                // Set construct query type
                spyOn(graphVisualizerService, 'getQuerytype').and.returnValue('construct');

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                component.queryResult$.subscribe(result => {
                    expect(result).toBeTruthy();
                    expect(result).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
                });
            }));

            it('... should get queryResult for select queries', waitForAsync(() => {
                // Set select query type
                spyOn(graphVisualizerService, 'getQuerytype').and.returnValue('select');

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                component.queryResult$.subscribe(result => {
                    expect(result).toBeTruthy();
                    expect(result).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
                });
            }));

            it('... should set empty observable for update query types', waitForAsync(() => {
                spyOn(graphVisualizerService, 'getQuerytype').and.returnValue('update');

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                component.queryResult$.subscribe(
                    result => fail('should have been failed'),
                    error => {
                        fail('should not error');
                    },
                    () => {
                        expect(component.query.queryType).withContext('should be update').toBe('update');
                    }
                );
            }));

            it('... should set empty observable for other query types', waitForAsync(() => {
                spyOn(graphVisualizerService, 'getQuerytype').and.returnValue('other');

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                component.queryResult$.subscribe(
                    result => fail('should not have called next'),
                    error => {
                        fail('should not error');
                    },
                    () => {
                        expect(component.query.queryType).withContext('should be other').toBe('other');
                    }
                );
            }));
        });

        describe('#_queryLocalStore', () => {
            let showErrorMessageSpy: Spy;

            beforeEach(() => {
                // Set construct mode
                component.query.queryType = 'construct';
                fixture.detectChanges();

                showErrorMessageSpy = spyOn(component, 'showErrorMessage').and.callThrough();
            });

            it('... should trigger `graphVisualizerService.doQuery`', () => {
                const serviceSpy = spyOn(graphVisualizerService, 'doQuery').and.callThrough();
                const expectedCallback = [
                    'construct',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ];

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                expectSpyCall(performQuerySpy, 2, undefined);
                expectSpyCall(queryLocalStoreSpy, 2, expectedCallback);
                expectSpyCall(serviceSpy, 1, expectedCallback);
            });

            it('... should return query result on success', async () => {
                const expectedCallback = [
                    'construct',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ];

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                await expectAsync(
                    graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
                ).toBeResolvedTo(expectedResult);

                component.queryResult$.subscribe(
                    result => {
                        expect(result).toBeTruthy();
                        expect(result).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
                    },
                    error => {
                        fail('should not error');
                    }
                );
            });

            it('... should return Empty on error', async () => {
                const expectedCallback = [
                    'construct',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ];
                const expectedError = { status: 404, statusText: 'error' };

                spyOn(console, 'error').and.callFake(mockConsole.log); // Catch console output
                spyOn(graphVisualizerService, 'doQuery').and.callFake(() => Promise.reject(expectedError));

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                await expectAsync(
                    graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
                ).toBeRejectedWith(expectedError);

                component.queryResult$.subscribe(
                    result => {
                        expect(result).toBeTruthy();
                        expect(result).withContext(`should equal []`).toEqual([]);
                    },
                    error => {
                        fail('should not error');
                    }
                );
            });

            it('... should log an error on error', async () => {
                const expectedCallback = [
                    'construct',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ];
                const expectedError = { status: 404, statusText: 'error' };

                const errorSpy = spyOn(console, 'error').and.callFake(mockConsole.log);
                spyOn(graphVisualizerService, 'doQuery').and.callFake(() => Promise.reject(expectedError));

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                await expectAsync(
                    graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
                ).toBeRejectedWith(expectedError);

                expectSpyCall(errorSpy, 1, ['#queryLocalstore got error:', expectedError]);
            });

            it('... should trigger `showErrorMessage` on error', async () => {
                const expectedCallback = [
                    'construct',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ];
                const expectedError = { name: 'Error', message: 'error message' };

                spyOn(console, 'error').and.callFake(mockConsole.log); // Catch console output
                spyOn(graphVisualizerService, 'doQuery').and.callFake(() => Promise.reject(expectedError));

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                await expectAsync(
                    graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
                ).toBeRejectedWith(expectedError);

                expectSpyCall(showErrorMessageSpy, 1);
            });

            it('... should trigger `showErrorMessage` 2x if error message contains `undefined`', async () => {
                const expectedCallback = [
                    'construct',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ];
                const expectedError = { name: 'Error', message: 'error message undefined' };

                spyOn(console, 'error').and.callFake(mockConsole.log); // Catch console output
                spyOn(graphVisualizerService, 'doQuery').and.callFake(() => Promise.reject(expectedError));

                // Perform query
                component.performQuery();
                fixture.detectChanges();

                await expectAsync(
                    graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
                ).toBeRejectedWith(expectedError);

                expectSpyCall(showErrorMessageSpy, 2);
                expect(showErrorMessageSpy.calls.any()).toBeTruthy();
                expect(showErrorMessageSpy.calls.count()).toBe(2);
                expect(showErrorMessageSpy.calls.first().args).toEqual([
                    'Error',
                    'The query did not return any results',
                    10000,
                ]);
                expect(showErrorMessageSpy.calls.allArgs()[0]).toEqual([
                    'Error',
                    'The query did not return any results',
                    10000,
                ]);
                expect(showErrorMessageSpy.calls.allArgs()[1]).toEqual(['Error', 'error message undefined', 10000]);
                expect(showErrorMessageSpy.calls.mostRecent().args).toEqual([
                    'Error',
                    'error message undefined',
                    10000,
                ]);
            });
        });

        describe('#showErrorMessage', () => {
            let showErrorMessageSpy: Spy;

            beforeEach(() => {
                // Set construct mode
                component.query.queryType = 'construct';
                fixture.detectChanges();

                showErrorMessageSpy = spyOn(component, 'showErrorMessage').and.callThrough();
                consoleSpy = spyOn(console, 'error').and.callFake(mockConsole.log);
            });

            it('... should not do anything if no message is provided', () => {
                component.showErrorMessage('Error', '', 500);

                expectSpyCall(showErrorMessageSpy, 1, ['Error', '', 500]);
                expectSpyCall(consoleSpy, 0);
            });

            it('... should set durationvValue = 7000 if not given', () => {
                component.showErrorMessage('Error', 'error message');

                expectSpyCall(showErrorMessageSpy, 1, ['Error', 'error message']);
                expectSpyCall(consoleSpy, 1, ['error message', 7000]);
            });

            it('... should log the provided message and durationValue to console', () => {
                component.showErrorMessage('Error1', 'error message', 500);

                expectSpyCall(showErrorMessageSpy, 1, ['Error1', 'error message', 500]);
                expectSpyCall(consoleSpy, 1, ['error message', 500]);
            });

            it('... should trigger toast service and add a toast message', () => {
                const name = 'Error1';
                const message = 'error message';
                const delay = 500;

                const toastSpy = spyOn(toastService, 'add').and.callThrough();
                const expectedToast = new Toast(message, {
                    header: name,
                    classname: 'bg-danger text-light',
                    delay: delay,
                });

                // Trigger error message
                component.showErrorMessage(name, message, delay);
                fixture.detectChanges();

                expectSpyCall(toastSpy, 1, expectedToast);

                expect(toastService.toasts).toBeDefined();
                expect(toastService.toasts.length).withContext(`should be 1`).toBe(1);
                expect(toastService.toasts[0]).withContext(`should equal ${expectedToast}`).toEqual(expectedToast);
            });

            it('... should set durationvValue = 7000 for the toast message if delay not given ', () => {
                const name = 'Error1';
                const message = 'error message';
                const delay = 7000;

                const toastSpy = spyOn(toastService, 'add').and.callThrough();
                const expectedToast = new Toast(message, {
                    header: name,
                    classname: 'bg-danger text-light',
                    delay: delay,
                });

                // Trigger error message without delay value
                component.showErrorMessage(name, message);
                fixture.detectChanges();

                expectSpyCall(toastSpy, 1, expectedToast);

                expect(toastService.toasts).toBeDefined();
                expect(toastService.toasts.length).withContext(`should be 1`).toBe(1);
                expect(toastService.toasts[0]).withContext(`should equal ${expectedToast}`).toEqual(expectedToast);
            });
        });

        describe('#onGraphNodeClick', () => {
            let onGraphNodeClickSpy: Spy;

            beforeEach(() => {
                // Set construct mode
                component.query.queryType = 'construct';
                fixture.detectChanges();

                onGraphNodeClickSpy = spyOn(component, 'onGraphNodeClick').and.callThrough();
                consoleSpy = spyOn(console, 'info').and.callFake(mockConsole.log);
            });

            it('... should trigger on event from ConstructResultsComponent', () => {
                const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(
                    ConstructResultsStubComponent
                ) as ConstructResultsStubComponent;

                const expectedNode = new D3SimulationNode('Test', D3SimulationNodeType.node);
                resultsCmp.clickedNodeRequest.emit(expectedNode);

                expectSpyCall(onGraphNodeClickSpy, 1, expectedNode);
            });

            it('... should not do anything if no node is provided', () => {
                // Check initial state
                expectSpyCall(performQuerySpy, 1, undefined);
                expect(component.query.queryString).toEqual(component.graphRDFInputData.queryList[0].queryString);

                const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(
                    ConstructResultsStubComponent
                ) as ConstructResultsStubComponent;

                // Emit undefined value
                resultsCmp.clickedNodeRequest.emit(undefined);

                expectSpyCall(onGraphNodeClickSpy, 1, undefined);
                expect(component.query.queryString)
                    .withContext(`should equal ${component.graphRDFInputData.queryList[0].queryString}`)
                    .toEqual(component.graphRDFInputData.queryList[0].queryString);
                expectSpyCall(performQuerySpy, 1, undefined);
            });

            it('... should log the provided node to console', () => {
                const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(
                    ConstructResultsStubComponent
                ) as ConstructResultsStubComponent;

                const expectedNode = new D3SimulationNode('Test', D3SimulationNodeType.node);
                resultsCmp.clickedNodeRequest.emit(expectedNode);

                expectSpyCall(consoleSpy, 1, ['GraphVisualizerComponent# graphClick on node', expectedNode]);
            });
        });

        describe('#onTableNodeClick', () => {
            let onTableNodeClickSpy: Spy;

            beforeEach(() => {
                // Set select mode
                component.query = expectedGraphRDFData.queryList[0];
                component.query.queryType = 'select';
                fixture.detectChanges();

                onTableNodeClickSpy = spyOn(component, 'onTableNodeClick').and.callThrough();
                consoleSpy = spyOn(console, 'info').and.callFake(mockConsole.log);
            });

            it('... should trigger on event from SelectResultsComponent', () => {
                const resultsDes = getAndExpectDebugElementByDirective(compDe, SelectResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(SelectResultsStubComponent) as SelectResultsStubComponent;

                const expectedUri = 'example:Test';
                resultsCmp.clickedTableRequest.emit(expectedUri);

                expectSpyCall(onTableNodeClickSpy, 1, expectedUri);
            });

            it('... should not do anything if no URI is provided', () => {
                // Check initial state
                expectSpyCall(performQuerySpy, 1, undefined);
                expect(component.query.queryString).toEqual(component.graphRDFInputData.queryList[0].queryString);

                const resultsDes = getAndExpectDebugElementByDirective(compDe, SelectResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(SelectResultsStubComponent) as SelectResultsStubComponent;

                // Emit undefined value
                resultsCmp.clickedTableRequest.emit('');

                expectSpyCall(onTableNodeClickSpy, 1, '');
                expect(component.query.queryString)
                    .withContext(`should equal ${component.graphRDFInputData.queryList[0].queryString}`)
                    .toEqual(component.graphRDFInputData.queryList[0].queryString);
                expectSpyCall(performQuerySpy, 1, undefined);
            });

            it('... should log the provided URI to console', () => {
                const resultsDes = getAndExpectDebugElementByDirective(compDe, SelectResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(SelectResultsStubComponent) as SelectResultsStubComponent;

                const expectedUri = 'example:Test';
                resultsCmp.clickedTableRequest.emit(expectedUri);

                expectSpyCall(onTableNodeClickSpy, 1, expectedUri);
                expectSpyCall(consoleSpy, 1, ['GraphVisualizerComponent# tableClick on URI', expectedUri]);
            });
        });

        describe('VIEW', () => {
            describe('not in fullscreen mode', () => {
                it('... should contain a main div with 2 child divs', () => {
                    const rowDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer', 1, 1);
                    getAndExpectDebugElementByCss(rowDes[0], 'div.awg-graph-visualizer > div', 2, 2);
                });

                it('... should contain one inner div.row with two sub divs in first child div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByCss(divDes[0], 'div.row > div', 2, 2);
                });

                it('... should contain one TriplesEditor component (stubbed) in first inner sub div', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer > div > div.row > div',
                        2,
                        2
                    );

                    getAndExpectDebugElementByDirective(divDes[0], TriplesEditorStubComponent, 1, 1);
                });

                it('... should contain one SparqlEditor component (stubbed) in second inner sub div', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer > div > div.row > div',
                        2,
                        2
                    );

                    getAndExpectDebugElementByDirective(divDes[1], SparqlEditorStubComponent, 1, 1);
                });

                it('... should contain one ConstructResults component (stubbed) in second child div (queryType === construct)', () => {
                    component.query.queryType = 'construct';
                    fixture.detectChanges();

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], ConstructResultsStubComponent, 1, 1);
                });

                it('... should contain one SelectResults component (stubbed) in third sub div (queryType === select)', () => {
                    component.query.queryType = 'select';
                    fixture.detectChanges();

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], SelectResultsStubComponent, 1, 1);
                });

                it('... should contain one UnsupportedTypeResults component (stubbed) in third sub div (queryType === other)', () => {
                    component.query.queryType = 'other';
                    fixture.detectChanges();

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], UnsupportedTypeResultsStubComponent, 1, 1);
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(() => {
                    // Set fullscreen mode
                    component.isFullscreen = true;

                    fixture.detectChanges();
                });

                it('... should contain a main div with 2 child divs', () => {
                    const rowDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer', 1, 1);
                    getAndExpectDebugElementByCss(rowDes[0], 'div.awg-graph-visualizer > div', 2, 2);
                });

                it('... should contain one TriplesEditor component (stubbed) in first inner sub div', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer > div > div > div',
                        2,
                        2
                    );

                    getAndExpectDebugElementByDirective(divDes[0], TriplesEditorStubComponent, 1, 1);
                });

                it('... should contain one SparqlEditor component (stubbed) in first inner sub div', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer > div > div > div',
                        2,
                        2
                    );

                    getAndExpectDebugElementByDirective(divDes[1], SparqlEditorStubComponent, 1, 1);
                });

                it('... should contain one ConstructResults component (stubbed) in second child div (queryType === construct)', () => {
                    component.query.queryType = 'construct';
                    fixture.detectChanges();

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], ConstructResultsStubComponent, 1, 1);
                });

                it('... should contain one SelectResults component (stubbed) in second sub div (queryType === select)', () => {
                    component.query.queryType = 'select';
                    fixture.detectChanges();

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], SelectResultsStubComponent, 1, 1);
                });

                it('... should contain one UnsupportedTypeResults component (stubbed) in second sub div (queryType === other)', () => {
                    component.query.queryType = 'other';
                    fixture.detectChanges();

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], UnsupportedTypeResultsStubComponent, 1, 1);
                });
            });

            describe('TriplesEditorComponent', () => {
                it('... should have `triples` passed down from main component', () => {
                    const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(
                        TriplesEditorStubComponent
                    ) as TriplesEditorStubComponent;

                    expect(editorCmp.triples).toBeDefined();
                    expect(editorCmp.triples)
                        .withContext(`should equal ${expectedGraphRDFData.triples}`)
                        .toEqual(expectedGraphRDFData.triples);
                });

                it('... should update `triples` with updateTriplesRequest event', () => {
                    const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(
                        TriplesEditorStubComponent
                    ) as TriplesEditorStubComponent;

                    // Set changed triples
                    const changedTriples =
                        '@prefix example: <https://example.com/onto#> .\n\n example:Test2 example:has example:Success2 .';
                    editorCmp.updateTriplesRequest.emit(changedTriples);

                    expect(component.triples).toBeDefined();
                    expect(component.triples).withContext(`should equal ${changedTriples}`).toEqual(changedTriples);
                });

                it('... should re-trigger `resetTriples()` with resetTriplesRequest event', () => {
                    expectSpyCall(resetTriplesSpy, 1);

                    const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(
                        TriplesEditorStubComponent
                    ) as TriplesEditorStubComponent;

                    editorCmp.resetTriplesRequest.emit();

                    expectSpyCall(resetTriplesSpy, 2);
                });

                it('... should re-trigger `performQuery()` with performQueryRequest event', () => {
                    expectSpyCall(performQuerySpy, 1);

                    const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(
                        TriplesEditorStubComponent
                    ) as TriplesEditorStubComponent;

                    editorCmp.performQueryRequest.emit();

                    expectSpyCall(performQuerySpy, 2);
                });
            });

            describe('SparqlEditorComponent', () => {
                it('... should have `queryList` and `query` passed down from main component', () => {
                    const editorDes = getAndExpectDebugElementByDirective(compDe, SparqlEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(SparqlEditorStubComponent) as SparqlEditorStubComponent;

                    expect(editorCmp.queryList).toBeDefined();
                    expect(editorCmp.queryList)
                        .withContext(`should equal ${expectedGraphRDFData.queryList}`)
                        .toEqual(expectedGraphRDFData.queryList);

                    expect(editorCmp.query).toBeDefined();
                    expect(editorCmp.query)
                        .withContext(`should equal ${expectedGraphRDFData.queryList[0]}`)
                        .toEqual(expectedGraphRDFData.queryList[0]);
                });

                it('... should update `query.string` with updateQueryStringRequest event', () => {
                    const editorDes = getAndExpectDebugElementByDirective(compDe, SparqlEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(SparqlEditorStubComponent) as SparqlEditorStubComponent;

                    // Set changed query string
                    const changedQueryString =
                        'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test3 ?has ?success3 . }';
                    editorCmp.updateQueryStringRequest.emit(changedQueryString);

                    expect(component.query.queryString).toBeDefined();
                    expect(component.query.queryString)
                        .withContext(`should equal ${changedQueryString}`)
                        .toEqual(changedQueryString);
                });

                it('... should re-trigger `resetQuery()` with resetQueryRequest event', () => {
                    expectSpyCall(resetQuerySpy, 1, undefined);

                    const editorDes = getAndExpectDebugElementByDirective(compDe, SparqlEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(SparqlEditorStubComponent) as SparqlEditorStubComponent;

                    // Set changed query
                    editorCmp.resetQueryRequest.emit(expectedGraphRDFData.queryList[1]);

                    expectSpyCall(resetQuerySpy, 2, expectedGraphRDFData.queryList[1]);
                });

                it('... should re-trigger `performQuery()` with performQueryRequest event', () => {
                    expectSpyCall(performQuerySpy, 1);

                    const editorDes = getAndExpectDebugElementByDirective(compDe, SparqlEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(SparqlEditorStubComponent) as SparqlEditorStubComponent;

                    editorCmp.performQueryRequest.emit();

                    expectSpyCall(performQuerySpy, 2);
                });
            });

            describe('ConstructResultsComponent', () => {
                beforeEach(() => {
                    // Set select mode
                    component.query.queryType = 'construct';
                    fixture.detectChanges();
                });

                it('... should have `queryResult` passed down from main component', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        ConstructResultsStubComponent
                    ) as ConstructResultsStubComponent;

                    expect(resultsCmp.queryResult$).toBeDefined();
                    resultsCmp.queryResult$.subscribe(result => {
                        expect(result).toBeTruthy();
                        expect(result).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
                    });
                });

                it('... should have `defaultForceGraphHeight` passed down from main component', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        ConstructResultsStubComponent
                    ) as ConstructResultsStubComponent;

                    expect(resultsCmp.defaultForceGraphHeight).toBeDefined();
                    expect(resultsCmp.defaultForceGraphHeight).withContext('should be 500').toBe(500);
                });

                it('... should re-trigger `onGraphNodeClick()` with clickedTableRequest event', () => {
                    consoleSpy = spyOn(console, 'info').and.callFake(mockConsole.log);
                    const onGraphNodeClickSpy = spyOn(component, 'onGraphNodeClick').and.callThrough();

                    const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        ConstructResultsStubComponent
                    ) as ConstructResultsStubComponent;

                    // Emit node
                    const expectedNode = new D3SimulationNode('Test', D3SimulationNodeType.node);
                    resultsCmp.clickedNodeRequest.emit(expectedNode);

                    expectSpyCall(onGraphNodeClickSpy, 1, expectedNode);
                });
            });

            describe('SelectResultsComponent', () => {
                beforeEach(() => {
                    // Set select mode
                    component.query.queryType = 'select';
                    fixture.detectChanges();
                });

                it('... should have `queryResult` passed down from main component', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(compDe, SelectResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        SelectResultsStubComponent
                    ) as SelectResultsStubComponent;

                    expect(resultsCmp.queryResult$).toBeDefined();
                    resultsCmp.queryResult$.subscribe(result => {
                        expect(result).toBeTruthy();
                        expect(result).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
                    });
                });

                it('... should re-trigger `onTableNodeClick()` with clickedTableRequest event', () => {
                    consoleSpy = spyOn(console, 'info').and.callFake(mockConsole.log);
                    const onTableNodeClickSpy = spyOn(component, 'onTableNodeClick').and.callThrough();

                    const resultsDes = getAndExpectDebugElementByDirective(compDe, SelectResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        SelectResultsStubComponent
                    ) as SelectResultsStubComponent;

                    // Emit IRI
                    const expectedUri = 'example:Test';
                    resultsCmp.clickedTableRequest.emit(expectedUri);

                    expectSpyCall(onTableNodeClickSpy, 1, expectedUri);
                });
            });

            describe('UnsupportedTypeResultsComponent', () => {
                beforeEach(() => {
                    // Set select mode
                    component.query.queryType = 'other';
                    fixture.detectChanges();
                });

                it('... should have `queryType` passed down from main component', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        UnsupportedTypeResultsStubComponent,
                        1,
                        1
                    );
                    const resultsCmp = resultsDes[0].injector.get(
                        UnsupportedTypeResultsStubComponent
                    ) as UnsupportedTypeResultsStubComponent;

                    expect(resultsCmp.queryType).toBeDefined();
                    expect(resultsCmp.queryType).withContext('should be other').toBe('other');
                });
            });
        });
    });
});
