import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmptyError, lastValueFrom, Observable } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';

import { Toast, ToastMessage, ToastService } from '@awg-shared/toast/toast.service';

import { GraphRDFData, GraphSparqlQuery } from '@awg-views/edition-view/models';
import { D3SimulationNode, D3SimulationNodeType, Triple } from './models';
import { GraphVisualizerService } from './services/graph-visualizer.service';

import { GraphVisualizerComponent } from './graph-visualizer.component';

// Mock components
@Component({
    selector: 'awg-construct-results',
    template: '',
    standalone: false,
})
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

@Component({
    selector: 'awg-select-results',
    template: '',
    standalone: false,
})
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

@Component({
    selector: 'awg-sparql-editor',
    template: '',
    standalone: false,
})
class SparqlEditorStubComponent {
    @Input()
    queryList: GraphSparqlQuery[];
    @Input()
    query: GraphSparqlQuery;
    @Input()
    isFullscreen: boolean;
    @Output()
    errorMessageRequest: EventEmitter<ToastMessage> = new EventEmitter();
    @Output()
    performQueryRequest: EventEmitter<void> = new EventEmitter();
    @Output()
    resetQueryRequest: EventEmitter<GraphSparqlQuery> = new EventEmitter();
    @Output()
    updateQueryStringRequest: EventEmitter<string> = new EventEmitter();
}

@Component({
    selector: 'awg-toast',
    template: '',
    standalone: false,
})
class ToastStubComponent {}

@Component({
    selector: 'awg-triples-editor',
    template: '',
    standalone: false,
})
class TriplesEditorStubComponent {
    @Input() triples: string;
    @Input()
    isFullscreen: boolean;
    @Output()
    errorMessageRequest: EventEmitter<ToastMessage> = new EventEmitter();
    @Output()
    performQueryRequest: EventEmitter<void> = new EventEmitter();
    @Output()
    resetTriplesRequest: EventEmitter<void> = new EventEmitter();
    @Output()
    updateTriplesRequest: EventEmitter<string> = new EventEmitter();
}

@Component({
    selector: 'awg-unsupported-type-results',
    template: '',
    standalone: false,
})
class UnsupportedTypeResultsStubComponent {
    @Input()
    queryType: string; // Query.queryType ?
    @Input()
    isFullscreen: boolean;
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

    let consoleSpy: Spy;
    let serviceCheckNamespacesInQuerySpy: Spy;
    let serviceGetQueryTypeSpy: Spy;
    let onTableNodeClickSpy: Spy;
    let performQuerySpy: Spy;
    let queryLocalStoreSpy: Spy;
    let resetQuerySpy: Spy;
    let resetTriplesSpy: Spy;
    let showToastMessageSpy: Spy;
    let toastServiceAddSpy: Spy;

    beforeEach(waitForAsync(() => {
        // Mocked dataStreamerService
        mockGraphVisualizerService = {
            checkNamespacesInQuery: (queryString: string): string => queryString,
            getQuerytype: (): string => 'construct',
            doQuery: (): Promise<Triple[]> =>
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
                subject: 'Test',
                predicate: 'has',
                object: 'Success',
            },
        ];

        expectedIsFullscreen = false;

        // Spies
        serviceGetQueryTypeSpy = spyOn(mockGraphVisualizerService, 'getQuerytype').and.callThrough();
        serviceCheckNamespacesInQuerySpy = spyOn(
            mockGraphVisualizerService,
            'checkNamespacesInQuery'
        ).and.callThrough();
        onTableNodeClickSpy = spyOn(component, 'onTableNodeClick').and.callThrough();
        performQuerySpy = spyOn(component, 'performQuery').and.callThrough();
        queryLocalStoreSpy = spyOn<any>(component, '_queryLocalStore').and.callThrough();
        resetQuerySpy = spyOn(component, 'resetQuery').and.callThrough();
        resetTriplesSpy = spyOn(component, 'resetTriples').and.callThrough();
        showToastMessageSpy = spyOn(component, 'showToastMessage').and.callThrough();
        toastServiceAddSpy = spyOn(toastService, 'add').and.callThrough();
    });

    afterEach(() => {
        // Clear storages and mock objects after each test
        mockConsole.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have graphRDFInputData', () => {
            expect(component.graphRDFInputData).toBeUndefined();
        });

        it('... should not have isFullscreen', () => {
            expect(component.isFullscreen).toBeUndefined();
        });

        it('... should not have query', () => {
            expect(component.query).toBeUndefined();
        });

        it('... should not have queryList', () => {
            expect(component.queryList).toBeUndefined();
        });

        it('... should not have queryResult', () => {
            expect(component.queryResult$).toBeUndefined();
        });

        it('... should not have queryTime', () => {
            expect(component.queryTime).toBeUndefined();
        });

        it('... should not have triples', () => {
            expect(component.triples).toBeUndefined();
        });

        it('... should have defaultForceGraphHeight ', () => {
            expectToBe(component.defaultForceGraphHeight, 500);
        });

        it('... should not have triggered `resetTriples()`', () => {
            expectSpyCall(resetTriplesSpy, 0);
        });

        it('... should not have triggered `resetQuery()`', () => {
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

        it('... should have triggered `resetTriples()`', () => {
            expectSpyCall(resetTriplesSpy, 1, undefined);
        });

        it('... should have triggered `resetQuery()`', () => {
            expectSpyCall(resetQuerySpy, 1, undefined);
        });

        it('... should have graphRDFInputData', () => {
            expectToEqual(component.graphRDFInputData, expectedGraphRDFData);
        });

        it('... should have `isFullScreen` input', () => {
            expectToBe(component.isFullscreen, expectedIsFullscreen);
        });

        it('... should have triples', () => {
            expectToEqual(component.triples, expectedGraphRDFData.triples);
        });

        it('... should have queryList', () => {
            expectToEqual(component.queryList, expectedGraphRDFData.queryList);
        });

        it('... should have query', () => {
            expectToEqual(component.query, expectedGraphRDFData.queryList[0]);
        });

        it('... should have queryResult', () => {
            expect(component.queryResult$).toBeDefined();

            component.queryResult$.subscribe(result => {
                expectToEqual(result, expectedResult);
            });
        });

        it('... should have queryTime', async () => {
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

        describe('#resetTriples()', () => {
            it('... should have a method `resetTriples`', () => {
                expect(component.resetTriples).toBeDefined();
            });

            it('... should trigger on resetTriplesRequest event from TriplesEditorComponent', () => {
                expectSpyCall(resetTriplesSpy, 1, undefined);

                const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                const editorCmp = editorDes[0].injector.get(TriplesEditorStubComponent) as TriplesEditorStubComponent;

                editorCmp.resetTriplesRequest.emit();

                expectSpyCall(resetTriplesSpy, 2, undefined);
            });

            it('... should set initial triples', () => {
                expectSpyCall(resetTriplesSpy, 1, undefined);

                expectToEqual(component.triples, expectedGraphRDFData.triples);
            });

            it('... should reset changed triples to initial triples', () => {
                expectSpyCall(resetTriplesSpy, 1, undefined);

                // Set changed triples
                const changedTriples =
                    '@prefix example: <https://example.com/onto#> .\n\n example:Test2 example:has example:Success2 .';
                component.triples = changedTriples;
                // Wait for fixture to be stable
                detectChangesOnPush(fixture);

                expectToEqual(component.triples, changedTriples);

                // Reset triples
                component.resetTriples();
                detectChangesOnPush(fixture);

                expectSpyCall(resetTriplesSpy, 2, undefined);
                expect(component.triples).toBeDefined();
                expectToEqual(component.triples, expectedGraphRDFData.triples);
            });

            it('... should not do anything if no triples are provided from rdf data', () => {
                expectSpyCall(resetTriplesSpy, 1);

                // Set undefined triples
                component.triples = undefined;
                component.graphRDFInputData.triples = undefined;
                detectChangesOnPush(fixture);

                // Reset triples
                component.resetTriples();
                detectChangesOnPush(fixture);

                expectSpyCall(resetTriplesSpy, 2);
                expect(component.triples).toBeUndefined();
            });
        });

        describe('#resetQuery()', () => {
            it('... should have a method `resetQuery`', () => {
                expect(component.resetQuery).toBeDefined();
            });

            it('... should trigger on resetQueryRequest event from SparqlEditorComponent', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                const editorDes = getAndExpectDebugElementByDirective(compDe, SparqlEditorStubComponent, 1, 1);
                const editorCmp = editorDes[0].injector.get(SparqlEditorStubComponent) as SparqlEditorStubComponent;

                // Set changed query
                editorCmp.resetQueryRequest.emit(expectedGraphRDFData.queryList[1]);

                expectSpyCall(resetQuerySpy, 2, expectedGraphRDFData.queryList[1]);
            });

            it('... should set initial queryList', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                expectToEqual(component.queryList, expectedGraphRDFData.queryList);
            });

            it('... should set initial query', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                expectToEqual(component.query, expectedGraphRDFData.queryList[0]);
            });

            it('... should find and reset a query from queryList if queryLabel and queryType is known', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                // Request for query with known queryLabel and queryType
                const changedQuery = { ...expectedGraphRDFData.queryList[1] };

                component.resetQuery(changedQuery);
                detectChangesOnPush(fixture);

                // Matches queryList queries by label
                expectSpyCall(resetQuerySpy, 2, undefined);

                expectToEqual(component.query, changedQuery);
                expectToBe(component.query.queryLabel, changedQuery.queryLabel);
                expectToBe(component.query.queryType, changedQuery.queryType);
            });

            describe('... should set query as is, and not find from queryList, if', () => {
                it('... only queryLabel is known but not queryType', () => {
                    expectSpyCall(resetQuerySpy, 1, undefined);

                    // Request for query with known queryLabel but unknown queryType
                    const changedQuery = { ...expectedGraphRDFData.queryList[1] };
                    changedQuery.queryType = 'select';

                    // Set correct return value of service
                    serviceGetQueryTypeSpy.and.returnValue(changedQuery.queryType);

                    component.resetQuery(changedQuery);
                    detectChangesOnPush(fixture);

                    // Matches queryList queries only by label
                    expectSpyCall(resetQuerySpy, 2, undefined);

                    expectToEqual(component.query, changedQuery);
                    expectToBe(component.query.queryLabel, changedQuery.queryLabel);
                    expectToBe(component.query.queryType, changedQuery.queryType);
                });

                it('... only queryType is known but not queryLabel', () => {
                    expectSpyCall(resetQuerySpy, 1, undefined);

                    // Request for query with known queryType but unknown label
                    const changedQuery = { ...expectedGraphRDFData.queryList[1] };
                    changedQuery.queryLabel = 'select all tests';

                    component.resetQuery(changedQuery);
                    detectChangesOnPush(fixture);

                    // Matches queryList queries only by type
                    expectSpyCall(resetQuerySpy, 2, undefined);

                    expectToEqual(component.query, changedQuery);
                    expectToBe(component.query.queryLabel, changedQuery.queryLabel);
                    expectToBe(component.query.queryType, changedQuery.queryType);
                });

                it('... given query is not in queryList', () => {
                    expectSpyCall(resetQuerySpy, 1, undefined);

                    // Request for unknown query
                    const changedQuery = {
                        queryType: 'select',
                        queryLabel: 'Test Query 3',
                        queryString:
                            'PREFIX example: <https://example.com/onto#> \n\n SELECT * WHERE { ?test3 ?has ?success3 . }',
                    };
                    // Set correct return value of service
                    serviceGetQueryTypeSpy.and.returnValue(changedQuery.queryType);
                    component.resetQuery(changedQuery);
                    detectChangesOnPush(fixture);

                    expectSpyCall(resetQuerySpy, 2, undefined);

                    expectToEqual(component.query, changedQuery);
                    expectToBe(component.query.queryLabel, changedQuery.queryLabel);
                    expectToBe(component.query.queryType, changedQuery.queryType);
                });
            });

            it('... should set initial query (queryList[0]) if no query is provided', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                // Set changed query
                const changedQuery = { ...expectedGraphRDFData.queryList[1] };
                component.query = changedQuery;
                detectChangesOnPush(fixture);

                expectToEqual(component.query, changedQuery);

                // Reset triples
                component.resetQuery();
                detectChangesOnPush(fixture);

                expectSpyCall(resetQuerySpy, 2, undefined);

                expectToEqual(component.query, expectedGraphRDFData.queryList[0]);
            });

            it('... should not do anything if no queryList is provided from RDF data', () => {
                expectSpyCall(resetQuerySpy, 1, undefined);

                // Set undefined triples
                component.queryList = undefined;
                component.graphRDFInputData.queryList = undefined;
                detectChangesOnPush(fixture);

                // Reset query
                const changedQuery = {
                    queryType: 'construct',
                    queryLabel: 'Test Query 3',
                    queryString:
                        'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test3 ?has ?success3 . }',
                };
                component.resetQuery(changedQuery);
                detectChangesOnPush(fixture);

                expectSpyCall(resetQuerySpy, 2, changedQuery);
                expect(component.queryList).toBeUndefined();
            });

            it('... should trigger `performQuery()`', () => {
                expectSpyCall(performQuerySpy, 1, undefined);

                // Reset query
                component.resetQuery(expectedGraphRDFData.queryList[1]);
                detectChangesOnPush(fixture);

                expectSpyCall(resetQuerySpy, 2, expectedGraphRDFData.queryList[1]);
                expectSpyCall(performQuerySpy, 2, undefined);
            });
        });

        describe('#performQuery()', () => {
            it('... should have a method `performQuery`', () => {
                expect(component.performQuery).toBeDefined();
            });

            it('... should trigger on event from TriplesEditorComponent', () => {
                // First time called on ngOnInit
                expectSpyCall(performQuerySpy, 1, undefined);

                const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                const editorCmp = editorDes[0].injector.get(TriplesEditorStubComponent) as TriplesEditorStubComponent;

                // Set changed query
                editorCmp.performQueryRequest.emit();

                expectSpyCall(performQuerySpy, 2);
            });

            it('... should trigger on event from SparqlEditorComponent', () => {
                // First time called on ngOnInit
                expectSpyCall(performQuerySpy, 1, undefined);

                const editorDes = getAndExpectDebugElementByDirective(compDe, SparqlEditorStubComponent, 1, 1);
                const editorCmp = editorDes[0].injector.get(SparqlEditorStubComponent) as SparqlEditorStubComponent;

                // Set changed query
                editorCmp.performQueryRequest.emit();

                expectSpyCall(performQuerySpy, 2);
            });

            it('... should append namespaces to query if no prefixes given', () => {
                expectSpyCall(performQuerySpy, 1, undefined);

                const queryStringWithoutPrefixes = 'CONSTRUCT WHERE { ?test ?has ?success . }';
                const queryWithoutPrefixes: GraphSparqlQuery = {
                    queryType: 'construct',
                    queryLabel: 'Test Query 1',
                    queryString: queryStringWithoutPrefixes,
                };
                serviceCheckNamespacesInQuerySpy.and.returnValue(
                    'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test ?has ?success . }'
                );

                // Perform query without prefixes
                component.query = queryWithoutPrefixes;
                component.performQuery();
                detectChangesOnPush(fixture);

                expectSpyCall(performQuerySpy, 2, undefined);
                expectSpyCall(serviceCheckNamespacesInQuerySpy, 2, [
                    queryStringWithoutPrefixes,
                    expectedGraphRDFData.triples,
                ]);

                expectToEqual(component.query, expectedGraphRDFData.queryList[0]);
            });

            it('... should get queryType from service', () => {
                expectSpyCall(performQuerySpy, 1, undefined);
                expectSpyCall(serviceGetQueryTypeSpy, 1, expectedGraphRDFData.queryList[0].queryString);

                // Perform query
                component.performQuery();
                detectChangesOnPush(fixture);

                expectSpyCall(performQuerySpy, 2, undefined);
                expectSpyCall(serviceGetQueryTypeSpy, 2, expectedGraphRDFData.queryList[0].queryString);

                expectToBe(component.query.queryType, 'construct');
            });

            it('... should trigger `_queryLocalStore` for construct queries', () => {
                // Set construct query type
                serviceGetQueryTypeSpy.and.returnValue('construct');

                // Perform query
                component.performQuery();
                detectChangesOnPush(fixture);

                // First spy call already triggered by ChangeDetection in beforeEach
                expectSpyCall(performQuerySpy, 2, undefined);
                expectSpyCall(queryLocalStoreSpy, 2, [
                    'construct',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ]);
            });

            it('... should trigger `_queryLocalStore` for select queries', () => {
                // Set select query type
                serviceGetQueryTypeSpy.and.returnValue('select');

                // Perform query
                component.performQuery();
                detectChangesOnPush(fixture);

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
                serviceGetQueryTypeSpy.and.returnValue('construct');

                // Perform query
                component.performQuery();
                detectChangesOnPush(fixture);

                expectToBe(component.query.queryType, 'construct');
                expectAsync(lastValueFrom(component.queryResult$)).toBeResolved();
                expectAsync(lastValueFrom(component.queryResult$)).toBeResolvedTo(expectedResult);
            }));

            it('... should get queryResult for select queries', waitForAsync(() => {
                // Set select query type
                serviceGetQueryTypeSpy.and.returnValue('select');

                // Perform query
                component.performQuery();
                detectChangesOnPush(fixture);

                expectToBe(component.query.queryType, 'select');
                expectAsync(lastValueFrom(component.queryResult$)).toBeResolved();
                expectAsync(lastValueFrom(component.queryResult$)).toBeResolvedTo(expectedResult);
            }));

            it('... should set empty observable for update query types', waitForAsync(() => {
                serviceGetQueryTypeSpy.and.returnValue('update');

                // Perform query
                component.performQuery();
                detectChangesOnPush(fixture);

                expectToBe(component.query.queryType, 'update');
                expectAsync(lastValueFrom(component.queryResult$)).toBeRejected();
                expectAsync(lastValueFrom(component.queryResult$)).toBeRejectedWithError(EmptyError);
            }));

            it('... should set empty observable for other query types', waitForAsync(() => {
                serviceGetQueryTypeSpy.and.returnValue('other');

                // Perform query
                component.performQuery();
                detectChangesOnPush(fixture);

                expectToBe(component.query.queryType, 'other');
                expectAsync(lastValueFrom(component.queryResult$)).toBeRejected();
                expectAsync(lastValueFrom(component.queryResult$)).toBeRejectedWithError(EmptyError);
            }));
        });

        describe('#_queryLocalStore()', () => {
            beforeEach(() => {
                // Set construct mode
                component.query.queryType = 'construct';
                detectChangesOnPush(fixture);
            });

            it('... should have a method `_queryLocalStore`', () => {
                expect((component as any)._queryLocalStore).toBeDefined();
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
                detectChangesOnPush(fixture);

                expectSpyCall(performQuerySpy, 2, undefined);
                expectSpyCall(queryLocalStoreSpy, 2, expectedCallback);
                expectSpyCall(serviceSpy, 1, expectedCallback);
            });

            it('... should return query result on success', waitForAsync(() => {
                const expectedCallback = [
                    'construct',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ];

                // Perform query
                component.performQuery();
                detectChangesOnPush(fixture);

                expectAsync(
                    graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
                ).toBeResolvedTo(expectedResult);

                expectAsync(lastValueFrom(component.queryResult$)).toBeResolved();
                expectAsync(lastValueFrom(component.queryResult$)).toBeResolvedTo(expectedResult);
            }));

            it('... should return empty array on error', waitForAsync(() => {
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
                detectChangesOnPush(fixture);

                expectAsync(
                    graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
                ).toBeRejectedWith(expectedError);

                expectAsync(lastValueFrom(component.queryResult$)).toBeResolved();
                expectAsync(lastValueFrom(component.queryResult$)).toBeResolvedTo([]);
            }));

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
                detectChangesOnPush(fixture);

                await expectAsync(
                    graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
                ).toBeRejectedWith(expectedError);

                expectSpyCall(errorSpy, 1, ['#queryLocalstore got error:', expectedError]);
            });

            it('... should trigger `showToastMessage` on error', async () => {
                const expectedCallback = [
                    'construct',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ];
                const expectedError = { name: 'Error', message: 'error message' };
                const expectedToastMessage = new ToastMessage(expectedError.name, expectedError.message, 5000);

                spyOn(console, 'error').and.callFake(mockConsole.log); // Catch console output
                spyOn(graphVisualizerService, 'doQuery').and.callFake(() => Promise.reject(expectedError));

                // Perform query
                component.performQuery();
                detectChangesOnPush(fixture);

                await expectAsync(
                    graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
                ).toBeRejectedWith(expectedError);

                expectSpyCall(showToastMessageSpy, 1);
                expect(showToastMessageSpy.calls.any()).toBeTruthy();
                expectToBe(showToastMessageSpy.calls.count(), 1);
                expectToEqual(showToastMessageSpy.calls.first().args, [expectedToastMessage, 'error']);
                expectToEqual(showToastMessageSpy.calls.allArgs()[0], [expectedToastMessage, 'error']);
            });

            it('... should trigger `showToastMessage` 2x if error message contains `undefined`', async () => {
                const expectedCallback = [
                    'construct',
                    expectedGraphRDFData.queryList[0].queryString,
                    expectedGraphRDFData.triples,
                ];
                const expectedError = { name: 'Error', message: 'error message undefined' };

                const expectedToastMessage1 = new ToastMessage('Error', 'The query did not return any results.', 5000);
                const expectedToastMessage2 = new ToastMessage(expectedError.name, expectedError.message, 5000);

                spyOn(console, 'error').and.callFake(mockConsole.log); // Catch console output
                spyOn(graphVisualizerService, 'doQuery').and.callFake(() => Promise.reject(expectedError));

                // Perform query
                component.performQuery();
                detectChangesOnPush(fixture);

                await expectAsync(
                    graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
                ).toBeRejectedWith(expectedError);

                expectSpyCall(showToastMessageSpy, 2);
                expect(showToastMessageSpy.calls.any()).toBeTruthy();
                expectToBe(showToastMessageSpy.calls.count(), 2);
                expectToEqual(showToastMessageSpy.calls.first().args, [expectedToastMessage1, 'error']);
                expectToEqual(showToastMessageSpy.calls.allArgs()[0], [expectedToastMessage1, 'error']);
                expectToEqual(showToastMessageSpy.calls.allArgs()[1], [expectedToastMessage2, 'error']);
                expectToEqual(showToastMessageSpy.calls.mostRecent().args, [expectedToastMessage2, 'error']);
            });
        });

        describe('#showToastMessage()', () => {
            beforeEach(() => {
                // Set construct mode
                component.query.queryType = 'construct';
                detectChangesOnPush(fixture);

                consoleSpy = spyOn(console, 'error').and.callFake(mockConsole.log);
            });

            it('... should have a method `showToastMessage`', () => {
                expect(component.showToastMessage).toBeDefined();
            });

            it('... should trigger on event from TriplesEditorComponent', () => {
                const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                const editorCmp = editorDes[0].injector.get(TriplesEditorStubComponent) as TriplesEditorStubComponent;

                // Set changed query
                editorCmp.errorMessageRequest.emit(new ToastMessage('Test', 'test message'));

                expectSpyCall(showToastMessageSpy, 1);
            });

            it('... should trigger on event from SparqlEditorComponent', () => {
                const editorDes = getAndExpectDebugElementByDirective(compDe, SparqlEditorStubComponent, 1, 1);
                const editorCmp = editorDes[0].injector.get(SparqlEditorStubComponent) as SparqlEditorStubComponent;

                // Set changed query
                editorCmp.errorMessageRequest.emit(new ToastMessage('Test', 'test message'));

                expectSpyCall(showToastMessageSpy, 1);
            });

            describe('... should not do anything', () => {
                it('... if no toastMessage is provided', () => {
                    const toastMessage = undefined;

                    component.showToastMessage(toastMessage, 'error');

                    expectSpyCall(showToastMessageSpy, 1, [undefined]);
                    expectSpyCall(toastServiceAddSpy, 0);
                    expectSpyCall(consoleSpy, 0);
                });

                it('... if no toastMessage.message is provided', () => {
                    const toastMessage = new ToastMessage('Error1', '', 500);

                    component.showToastMessage(toastMessage, 'error');

                    expectSpyCall(showToastMessageSpy, 1, toastMessage);
                    expectSpyCall(toastServiceAddSpy, 0);
                    expectSpyCall(consoleSpy, 0);
                });
            });

            it('... should use "info" as default type if not provided', () => {
                const toastMessage = new ToastMessage('DefaultInfo', 'Default info message', 2000);
                const expectedToast = new Toast(toastMessage.message, {
                    header: toastMessage.name,
                    classname: 'bg-info text-light',
                    delay: toastMessage.duration,
                });
                consoleSpy = spyOn(console, 'info').and.callFake(mockConsole.log);

                component.showToastMessage(toastMessage);

                expectSpyCall(toastServiceAddSpy, 1, expectedToast);
                expectSpyCall(consoleSpy, 1, ['DefaultInfo', ':', 'Default info message']);
            });

            describe('... on error message', () => {
                it('... should log the provided name and error message to console', () => {
                    const toastMessage = new ToastMessage('Error1', 'error message', 500);

                    component.showToastMessage(toastMessage, 'error');

                    expectSpyCall(showToastMessageSpy, 1, toastMessage);
                    expectSpyCall(consoleSpy, 1, [toastMessage.name, ':', toastMessage.message]);
                });

                it('... should trigger toast service and add an error toast message', () => {
                    const toastMessage = new ToastMessage('Error1', 'error message', 500);
                    const expectedToast = new Toast(toastMessage.message, {
                        header: toastMessage.name,
                        classname: 'bg-danger text-light',
                        delay: toastMessage.duration,
                    });

                    // Trigger error message
                    component.showToastMessage(toastMessage, 'error');
                    detectChangesOnPush(fixture);

                    expectSpyCall(toastServiceAddSpy, 1, expectedToast);

                    expect(toastService.toasts).toBeDefined();
                    expectToBe(toastService.toasts.length, 1);
                    expectToEqual(toastService.toasts[0], expectedToast);
                });

                it('... should set durationvValue = 3000 for the errortoast message if delay not given ', () => {
                    const toastMessage = new ToastMessage('Error1', 'error message');
                    const expectedDuration = 3000;
                    const expectedToast = new Toast(toastMessage.message, {
                        header: toastMessage.name,
                        classname: 'bg-danger text-light',
                        delay: expectedDuration,
                    });

                    // Trigger error message without delay value
                    component.showToastMessage(toastMessage, 'error');
                    detectChangesOnPush(fixture);

                    expectSpyCall(toastServiceAddSpy, 1, expectedToast);

                    expect(toastService.toasts).toBeDefined();
                    expectToBe(toastService.toasts.length, 1);
                    expectToEqual(toastService.toasts[0], expectedToast);
                });
            });

            describe('... on info message', () => {
                it('... should log the provided name and info message to console', () => {
                    const toastMessage = new ToastMessage('Info1', 'info message', 500);
                    consoleSpy = spyOn(console, 'info').and.callFake(mockConsole.log);

                    component.showToastMessage(toastMessage, 'info');

                    expectSpyCall(showToastMessageSpy, 1, toastMessage);
                    expectSpyCall(consoleSpy, 1, [toastMessage.name, ':', toastMessage.message]);
                });

                it('... should trigger toast service and add an info toast message', () => {
                    const toastMessage = new ToastMessage('Info1', 'info message', 500);
                    const expectedToast = new Toast(toastMessage.message, {
                        header: toastMessage.name,
                        classname: 'bg-info text-light',
                        delay: toastMessage.duration,
                    });
                    spyOn(console, 'info').and.callFake(mockConsole.log); // Catch console output

                    // Trigger info message
                    component.showToastMessage(toastMessage, 'info');
                    detectChangesOnPush(fixture);

                    expectSpyCall(toastServiceAddSpy, 1, expectedToast);

                    expect(toastService.toasts).toBeDefined();
                    expectToBe(toastService.toasts.length, 1);
                    expectToEqual(toastService.toasts[0], expectedToast);
                });

                it('... should set durationValue = 3000 for the info toast message if delay not given ', () => {
                    const toastMessage = new ToastMessage('Info1', 'info message');
                    const expectedDuration = 3000;
                    const expectedToast = new Toast(toastMessage.message, {
                        header: toastMessage.name,
                        classname: 'bg-info text-light',
                        delay: expectedDuration,
                    });
                    spyOn(console, 'info').and.callFake(mockConsole.log); // Catch console output

                    // Trigger info message without delay value
                    component.showToastMessage(toastMessage, 'info');
                    detectChangesOnPush(fixture);

                    expectSpyCall(toastServiceAddSpy, 1, expectedToast);

                    expect(toastService.toasts).toBeDefined();
                    expectToBe(toastService.toasts.length, 1);
                    expectToEqual(toastService.toasts[0], expectedToast);
                });
            });
        });

        describe('#onGraphNodeClick()', () => {
            let onGraphNodeClickSpy: Spy;

            beforeEach(() => {
                // Set construct mode
                component.query.queryType = 'construct';
                detectChangesOnPush(fixture);

                onGraphNodeClickSpy = spyOn(component, 'onGraphNodeClick').and.callThrough();
                consoleSpy = spyOn(console, 'info').and.callFake(mockConsole.log);
            });

            it('... should have a method `onGraphNodeClick`', () => {
                expect(component.onGraphNodeClick).toBeDefined();
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
                expectToBe(component.query.queryString, component.graphRDFInputData.queryList[0].queryString);

                const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(
                    ConstructResultsStubComponent
                ) as ConstructResultsStubComponent;

                // Emit undefined value
                resultsCmp.clickedNodeRequest.emit(undefined);

                expectSpyCall(onGraphNodeClickSpy, 1, undefined);
                expectToBe(component.query.queryString, component.graphRDFInputData.queryList[0].queryString);
                expectSpyCall(performQuerySpy, 1, undefined);
            });

            it('... should show the provided node in a ToastMessage', () => {
                const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(
                    ConstructResultsStubComponent
                ) as ConstructResultsStubComponent;

                const expectedNode = new D3SimulationNode('Test', D3SimulationNodeType.node);
                resultsCmp.clickedNodeRequest.emit(expectedNode);

                // Check ToastMessage
                const expectedMessage = `GraphVisualizerComponent# graphClick on node ${expectedNode.id}\n\nLabel: ${expectedNode.label}`;
                const toastMessage = new ToastMessage(expectedNode.id, expectedMessage, 5000);
                const expectedToast = new Toast(toastMessage.message, {
                    header: toastMessage.name,
                    classname: 'bg-info text-light',
                    delay: toastMessage.duration,
                });

                expectSpyCall(onGraphNodeClickSpy, 1, expectedNode);
                expectSpyCall(showToastMessageSpy, 1, [toastMessage, 'info']);
                expectSpyCall(toastServiceAddSpy, 1, expectedToast);
                expectSpyCall(consoleSpy, 1, ['Test', ':', expectedMessage]);
            });

            it('... should include source type and location in the ToastMessage if source details are available', () => {
                const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(
                    ConstructResultsStubComponent
                ) as ConstructResultsStubComponent;

                const expectedNode = new D3SimulationNode('awg:M312_Sk1', D3SimulationNodeType.node);
                expectedNode.label = 'M 312 Sk1 [A]';
                expectedNode.sourceDetails = [
                    {
                        id: 'awg:source_A',
                        label: 'A',
                        type: 'Skizzen (in: Skizzenbuch 3).',
                        location: 'CH-Bps, Sammlung Anton Webern.',
                    },
                ];

                resultsCmp.clickedNodeRequest.emit(expectedNode);

                const expectedMessage =
                    'GraphVisualizerComponent# graphClick on node awg:M312_Sk1\n\n' +
                    'Label: M 312 Sk1 [A]\n\n' +
                    'Source: A\n' +
                    'Type: Skizzen (in: Skizzenbuch 3).\n' +
                    'Location: CH-Bps, Sammlung Anton Webern.';
                const toastMessage = new ToastMessage(expectedNode.id, expectedMessage, 5000);
                const expectedToast = new Toast(toastMessage.message, {
                    header: toastMessage.name,
                    classname: 'bg-info text-light',
                    delay: toastMessage.duration,
                });

                expectSpyCall(onGraphNodeClickSpy, 1, expectedNode);
                expectSpyCall(showToastMessageSpy, 1, [toastMessage, 'info']);
                expectSpyCall(toastServiceAddSpy, 1, expectedToast);
                expectSpyCall(consoleSpy, 1, ['awg:M312_Sk1', ':', expectedMessage]);
            });

            it('... should persist selected node details in a side panel', () => {
                const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(
                    ConstructResultsStubComponent
                ) as ConstructResultsStubComponent;

                const expectedNode = new D3SimulationNode('awg:M312_Sk1', D3SimulationNodeType.node);
                expectedNode.label = 'M 312 Sk1 [A]';
                expectedNode.sourceDetails = [
                    {
                        id: 'awg:source_A',
                        label: 'A',
                        type: 'Skizzen (in: Skizzenbuch 3).',
                        location: 'CH-Bps, Sammlung Anton Webern.',
                    },
                ];

                resultsCmp.clickedNodeRequest.emit(expectedNode);
                detectChangesOnPush(fixture);

                const detailsPanel = fixture.nativeElement.querySelector('.awg-node-details') as HTMLElement;

                expect(component.nodeDetailsPanels.length).toBe(1);
                expect(component.nodeDetailsPanels[0].node.id).toBe('awg:M312_Sk1');
                expect(detailsPanel).toBeTruthy();
                expect(detailsPanel.textContent).toContain('Ausgewaehlter Knoten');
                expect(detailsPanel.textContent).toContain('M 312 Sk1 [A]');
                expect(detailsPanel.textContent).toContain('A');
                expect(detailsPanel.textContent).toContain('Typ: Skizzen (in: Skizzenbuch 3).');
                expect(detailsPanel.textContent).toContain('Standort: CH-Bps, Sammlung Anton Webern.');
            });

            it('... should show a hint before a node is selected', () => {
                const detailsHint = fixture.nativeElement.querySelector('.awg-node-details__hint') as HTMLElement;

                expect(detailsHint).toBeTruthy();
                expect(detailsHint.textContent).toContain(
                    'Klicken Sie im Graphen auf einen Knoten, um das Detailpanel zu öffnen.'
                );
            });

            it('... should pin and close the selected node details panel', () => {
                const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(
                    ConstructResultsStubComponent
                ) as ConstructResultsStubComponent;

                const expectedNode = new D3SimulationNode('awg:M312_Sk1', D3SimulationNodeType.node);
                expectedNode.label = 'M 312 Sk1 [A]';
                expectedNode.sourceDetails = [
                    {
                        id: 'awg:source_A',
                        label: 'A',
                        type: 'Skizzen (in: Skizzenbuch 3).',
                        location: 'CH-Bps, Sammlung Anton Webern.',
                    },
                ];

                resultsCmp.clickedNodeRequest.emit(expectedNode);
                detectChangesOnPush(fixture);

                const pinButton = fixture.nativeElement.querySelector('.awg-node-details__pin-button') as HTMLButtonElement;
                const closeButton = fixture.nativeElement.querySelector('.awg-node-details__close-button') as HTMLButtonElement;

                expect(pinButton).toBeTruthy();
                expect(closeButton).toBeTruthy();
                expect(component.nodeDetailsPanels[0].isPinned).toBeFalse();

                pinButton.click();
                detectChangesOnPush(fixture);

                const pinnedPanel = fixture.nativeElement.querySelector('.awg-node-details') as HTMLElement;
                const pinnedButton = fixture.nativeElement.querySelector('.awg-node-details__pin-button') as HTMLButtonElement;

                expect(component.nodeDetailsPanels[0].isPinned).toBeTrue();
                expect(pinnedPanel.classList.contains('awg-node-details--pinned')).toBeTrue();
                expect(pinnedButton.textContent).toContain('Lösen');

                closeButton.click();
                detectChangesOnPush(fixture);

                expect(component.nodeDetailsPanels.length).toBe(0);
                expect(fixture.nativeElement.querySelector('.awg-node-details')).toBeFalsy();
            });

            it('... should keep pinned panels and open a new unpinned panel for another node', () => {
                const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(
                    ConstructResultsStubComponent
                ) as ConstructResultsStubComponent;

                const firstNode = new D3SimulationNode('awg:M312_Sk1', D3SimulationNodeType.node);
                firstNode.label = 'M 312 Sk1 [A]';

                const secondNode = new D3SimulationNode('awg:M313_Sk2', D3SimulationNodeType.node);
                secondNode.label = 'M 313 Sk2 [B]';

                resultsCmp.clickedNodeRequest.emit(firstNode);
                detectChangesOnPush(fixture);

                let pinButtons = fixture.nativeElement.querySelectorAll('.awg-node-details__pin-button') as NodeListOf<HTMLButtonElement>;
                pinButtons[0].click();
                detectChangesOnPush(fixture);

                resultsCmp.clickedNodeRequest.emit(secondNode);
                detectChangesOnPush(fixture);

                const allPanels = fixture.nativeElement.querySelectorAll('.awg-node-details') as NodeListOf<HTMLElement>;

                expect(component.nodeDetailsPanels.length).toBe(2);
                expect(component.nodeDetailsPanels.filter(panel => panel.isPinned).length).toBe(1);
                expect(component.nodeDetailsPanels.some(panel => panel.node.id === 'awg:M312_Sk1' && panel.isPinned)).toBeTrue();
                expect(component.nodeDetailsPanels.some(panel => panel.node.id === 'awg:M313_Sk2' && !panel.isPinned)).toBeTrue();
                expect(allPanels.length).toBe(2);
                expect(allPanels[0].textContent).toContain('M 312 Sk1 [A]');
                expect(allPanels[1].textContent).toContain('M 313 Sk2 [B]');
            });
        });

        describe('#onTableNodeClick()', () => {
            beforeEach(() => {
                // Set select mode
                component.query = expectedGraphRDFData.queryList[0];
                component.query.queryType = 'select';
                detectChangesOnPush(fixture);

                consoleSpy = spyOn(console, 'info').and.callFake(mockConsole.log);
            });

            it('... should have a method `onTableNodeClick`', () => {
                expect(component.onTableNodeClick).toBeDefined();
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
                expectToBe(component.query.queryString, component.graphRDFInputData.queryList[0].queryString);

                const resultsDes = getAndExpectDebugElementByDirective(compDe, SelectResultsStubComponent, 1, 1);
                const resultsCmp = resultsDes[0].injector.get(SelectResultsStubComponent) as SelectResultsStubComponent;

                // Emit undefined value
                resultsCmp.clickedTableRequest.emit('');

                expectSpyCall(onTableNodeClickSpy, 1, '');
                expectToBe(component.query.queryString, component.graphRDFInputData.queryList[0].queryString);
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
                    detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], ConstructResultsStubComponent, 1, 1);
                });

                it('... should contain one SelectResults component (stubbed) in third sub div (queryType === select)', () => {
                    component.query.queryType = 'select';
                    detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], SelectResultsStubComponent, 1, 1);
                });

                it('... should contain one UnsupportedTypeResults component (stubbed) in third sub div (queryType === other)', () => {
                    component.query.queryType = 'other';
                    detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], UnsupportedTypeResultsStubComponent, 1, 1);
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(() => {
                    // Set fullscreen mode
                    component.isFullscreen = true;

                    detectChangesOnPush(fixture);
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
                    detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], ConstructResultsStubComponent, 1, 1);
                });

                it('... should contain one SelectResults component (stubbed) in second sub div (queryType === select)', () => {
                    component.query.queryType = 'select';
                    detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], SelectResultsStubComponent, 1, 1);
                });

                it('... should contain one UnsupportedTypeResults component (stubbed) in second sub div (queryType === other)', () => {
                    component.query.queryType = 'other';
                    detectChangesOnPush(fixture);

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

                    expectToEqual(editorCmp.triples, expectedGraphRDFData.triples);
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

                    expectToEqual(component.triples, changedTriples);
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

                    expectToEqual(editorCmp.queryList, expectedGraphRDFData.queryList);
                    expectToEqual(editorCmp.query, expectedGraphRDFData.queryList[0]);
                });

                it('... should update `query.string` with updateQueryStringRequest event', () => {
                    const editorDes = getAndExpectDebugElementByDirective(compDe, SparqlEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(SparqlEditorStubComponent) as SparqlEditorStubComponent;

                    // Set changed query string
                    const changedQueryString =
                        'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test3 ?has ?success3 . }';
                    editorCmp.updateQueryStringRequest.emit(changedQueryString);

                    expectToBe(component.query.queryString, changedQueryString);
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
                    detectChangesOnPush(fixture);
                });

                it('... should have `queryResult` passed down from main component', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        ConstructResultsStubComponent
                    ) as ConstructResultsStubComponent;

                    expect(resultsCmp.queryResult$).toBeDefined();
                    resultsCmp.queryResult$.subscribe(result => {
                        expectToEqual(result, expectedResult);
                    });
                });

                it('... should have `defaultForceGraphHeight` passed down from main component', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        ConstructResultsStubComponent
                    ) as ConstructResultsStubComponent;

                    expectToBe(resultsCmp.defaultForceGraphHeight, 500);
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
                    detectChangesOnPush(fixture);
                });

                it('... should have `queryResult` passed down from main component', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(compDe, SelectResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        SelectResultsStubComponent
                    ) as SelectResultsStubComponent;

                    expect(resultsCmp.queryResult$).toBeDefined();
                    resultsCmp.queryResult$.subscribe(result => {
                        expectToEqual(result, expectedResult);
                    });
                });

                it('... should re-trigger `onTableNodeClick()` with clickedTableRequest event', () => {
                    consoleSpy = spyOn(console, 'info').and.callFake(mockConsole.log);

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
                    detectChangesOnPush(fixture);
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

                    expectToBe(resultsCmp.queryType, 'other');
                });
            });
        });
    });
});
