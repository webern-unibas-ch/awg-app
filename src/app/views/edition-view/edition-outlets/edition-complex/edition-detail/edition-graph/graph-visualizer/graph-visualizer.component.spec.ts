import { Component, DebugElement, EventEmitter, Input, isSignal, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EmptyError, lastValueFrom, Observable, take } from 'rxjs';

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

import { GraphRDFData, GraphSparqlQuery, GraphSparqlQueryType } from '@awg-views/edition-view/models/graph.model';
import { D3SimulationNode, D3SimulationNodeType, QueryResult, QuerySelectResult, Triple } from './models';
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
    queryResult$: Observable<QuerySelectResult | string | undefined>;
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
    @Input()
    triples: string;
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
    let expectedConstructResult: Triple[];
    let expectedSelectResult: QuerySelectResult | string | undefined;

    let consoleSpy: Spy;
    let serviceCheckNamespacesInQuerySpy: Spy;
    let serviceDoQuerySpy: Spy;
    let serviceGetQueryTypeSpy: Spy;
    let onTableNodeClickSpy: Spy;
    let performQuerySpy: Spy;
    let queryLocalStoreSpy: Spy;
    let resetQuerySpy: Spy;
    let resetTriplesSpy: Spy;
    let showToastMessageSpy: Spy;
    let toastServiceAddSpy: Spy;

    let lastQueryString = '';

    beforeEach(async () => {
        lastQueryString = '';

        // Mocked dataStreamerService
        mockGraphVisualizerService = {
            checkNamespacesInQuery: (queryString: string): string => {
                lastQueryString = queryString;
                return queryString;
            },
            getQuerytype: (): GraphSparqlQueryType =>
                lastQueryString.toLowerCase().includes('select') ? 'select' : 'construct',
            doQuery: (queryString: string): Promise<QueryResult> => {
                const isSelectQuery = queryString.toLowerCase().includes('select');
                return isSelectQuery ? Promise.resolve(expectedSelectResult) : Promise.resolve(expectedConstructResult);
            },
        };

        await TestBed.configureTestingModule({
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
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GraphVisualizerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject services
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
        expectedGraphRDFData.queryList.push({
            queryType: 'select',
            queryLabel: 'Test Query 3',
            queryString: 'PREFIX example: <https://example.com/onto#> \n\n SELECT * WHERE { ?test3 ?has ?success3 . }',
        });
        expectedGraphRDFData.triples =
            '@prefix example: <https://example.com/onto#> .\n\n example:Test example:has example:Success .';

        expectedConstructResult = [
            {
                subject: 'Test',
                predicate: 'has',
                object: 'Success',
            },
        ];
        expectedSelectResult = {
            head: { vars: ['test', 'has', 'success'] },
            body: {
                bindings: [
                    {
                        test: { type: 'uri', value: 'Test' },
                        has: { type: 'uri', value: 'has' },
                        success: { type: 'uri', value: 'Success' },
                    },
                ],
            },
        };

        // Spies
        serviceDoQuerySpy = vi.spyOn(mockGraphVisualizerService, 'doQuery');
        serviceGetQueryTypeSpy = vi.spyOn(mockGraphVisualizerService, 'getQuerytype');
        serviceCheckNamespacesInQuerySpy = vi.spyOn(mockGraphVisualizerService, 'checkNamespacesInQuery');
        onTableNodeClickSpy = vi.spyOn(component, 'onTableNodeClick');
        performQuerySpy = vi.spyOn(component, 'performQuery');
        queryLocalStoreSpy = vi.spyOn(component as any, '_queryLocalStore');
        resetQuerySpy = vi.spyOn(component, 'resetQuery');
        resetTriplesSpy = vi.spyOn(component, 'resetTriples');
        showToastMessageSpy = vi.spyOn(component, 'showToastMessage');
        toastServiceAddSpy = vi.spyOn(toastService, 'add');
    });

    afterEach(() => {
        // Clear storages and mock objects after each test
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have input `graphRDFInputData`', () => {
            expect(component.graphRDFInputData).toBeUndefined();
        });

        it('... should have input signal `isFullscreenMode` to hold the default value', () => {
            expectToBe(isSignal(component.isFullscreenMode), true);

            expectToBe(component.isFullscreenMode(), false);
        });

        it('... should not have `query`', () => {
            expect(component.query).toBeUndefined();
        });

        it('... should not have `queryList`', () => {
            expect(component.queryList).toBeUndefined();
        });

        it('... should not have `queryResult`', () => {
            expect(component.queryResult$).toBeUndefined();
        });

        it('... should not have `queryTime`', () => {
            expect(component.queryTime).toBeUndefined();
        });

        it('... should not have `triples`', () => {
            expect(component.triples).toBeUndefined();
        });

        it('... should have `defaultForceGraphHeight` ', () => {
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
            fixture.componentRef.setInput('isFullscreenMode', false);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input `graphRDFInputData`', () => {
            expectToEqual(component.graphRDFInputData, expectedGraphRDFData);
        });

        it('... should have input signal `isFullScreenMode` to hold false', () => {
            expectToBe(component.isFullscreenMode(), false);
        });

        it('... should have `triples`', () => {
            expectToEqual(component.triples, expectedGraphRDFData.triples);
        });

        it('... should have `queryList`', () => {
            expectToEqual(component.queryList, expectedGraphRDFData.queryList);
        });

        it('... should have `query`', () => {
            expectToEqual(component.query, expectedGraphRDFData.queryList[0]);
        });

        it('... should have `queryResult`', () => {
            expect(component.queryResult$).toBeDefined();

            component.queryResult$.pipe(take(1)).subscribe(result => {
                expectToEqual(result, expectedConstructResult);
            });
        });

        it('... should have `queryTime`', async () => {
            const expectedCallback = [
                'construct',
                expectedGraphRDFData.queryList[0].queryString,
                expectedGraphRDFData.triples,
            ];

            await expect(
                graphVisualizerService.doQuery(expectedCallback[0], expectedCallback[1], expectedCallback[2])
            ).resolves.toEqual(expectedConstructResult);

            expect(component.queryTime).toBeDefined();
            // Value is not predictable
        });

        it('... should have triggered `resetTriples()`', () => {
            expectSpyCall(resetTriplesSpy, 1, undefined);
        });

        it('... should have triggered `resetQuery()`', () => {
            expectSpyCall(resetQuerySpy, 1, undefined);
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

                it('... should contain one ConstructResults component (stubbed) in second child div (queryType === construct)', async () => {
                    component.query.queryType = 'construct';
                    await detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], ConstructResultsStubComponent, 1, 1);
                });

                it('... should contain one SelectResults component (stubbed) in third sub div (queryType === select)', async () => {
                    component.query.queryType = 'select';
                    await detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], SelectResultsStubComponent, 1, 1);
                });

                it('... should contain one UnsupportedTypeResults component (stubbed) in third sub div (queryType === other)', async () => {
                    component.query.queryType = 'other' as any;
                    await detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], UnsupportedTypeResultsStubComponent, 1, 1);
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(async () => {
                    // Set fullscreen mode
                    fixture.componentRef.setInput('isFullscreenMode', true);

                    await detectChangesOnPush(fixture);
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

                it('... should contain one ConstructResults component (stubbed) in second child div (queryType === construct)', async () => {
                    component.query.queryType = 'construct';
                    await detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], ConstructResultsStubComponent, 1, 1);
                });

                it('... should contain one SelectResults component (stubbed) in second sub div (queryType === select)', async () => {
                    component.query.queryType = 'select';
                    await detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], SelectResultsStubComponent, 1, 1);
                });

                it('... should contain one UnsupportedTypeResults component (stubbed) in second sub div (queryType === other)', async () => {
                    component.query.queryType = 'other' as any;
                    await detectChangesOnPush(fixture);

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
                beforeEach(async () => {
                    // Set select mode
                    component.query.queryType = 'construct';
                    await detectChangesOnPush(fixture);
                });

                it('... should have `queryResult` passed down from main component', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        ConstructResultsStubComponent
                    ) as ConstructResultsStubComponent;

                    expect(resultsCmp.queryResult$).toBeDefined();
                    resultsCmp.queryResult$.pipe(take(1)).subscribe(result => {
                        expectToEqual(result, expectedConstructResult);
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
                    consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);
                    const onGraphNodeClickSpy = vi.spyOn(component, 'onGraphNodeClick');

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
                beforeEach(async () => {
                    // Set select query type
                    component.query.queryType = expectedGraphRDFData.queryList[2].queryType;
                    component.query.queryString = expectedGraphRDFData.queryList[2].queryString;

                    // Perform query to set SELECT queryResult
                    component.performQuery();
                    await detectChangesOnPush(fixture);
                });

                it('... should have `queryResult` passed down from main component', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(compDe, SelectResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        SelectResultsStubComponent
                    ) as SelectResultsStubComponent;

                    expect(resultsCmp.queryResult$).toBeDefined();
                    resultsCmp.queryResult$.pipe(take(1)).subscribe(result => {
                        expectToEqual(result, expectedSelectResult);
                    });
                });

                it('... should re-trigger `onTableNodeClick()` with clickedTableRequest event', () => {
                    consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);

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
                beforeEach(async () => {
                    // Set select mode
                    component.query.queryType = 'other' as any;
                    await detectChangesOnPush(fixture);
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

        describe('METHODS', () => {
            describe('#resetTriples()', () => {
                it('... should have a method `resetTriples`', () => {
                    expect(component.resetTriples).toBeDefined();
                });

                it('... should trigger on resetTriplesRequest event from TriplesEditorComponent', () => {
                    expectSpyCall(resetTriplesSpy, 1, undefined);

                    const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(
                        TriplesEditorStubComponent
                    ) as TriplesEditorStubComponent;

                    editorCmp.resetTriplesRequest.emit();

                    expectSpyCall(resetTriplesSpy, 2, undefined);
                });

                it('... should set initial triples', () => {
                    expectSpyCall(resetTriplesSpy, 1, undefined);

                    expectToEqual(component.triples, expectedGraphRDFData.triples);
                });

                it('... should reset changed triples to initial triples', async () => {
                    expectSpyCall(resetTriplesSpy, 1, undefined);

                    // Set changed triples
                    const changedTriples =
                        '@prefix example: <https://example.com/onto#> .\n\n example:Test2 example:has example:Success2 .';
                    component.triples = changedTriples;
                    // Wait for fixture to be stable
                    await detectChangesOnPush(fixture);

                    expectToEqual(component.triples, changedTriples);

                    // Reset triples
                    component.resetTriples();
                    await detectChangesOnPush(fixture);

                    expectSpyCall(resetTriplesSpy, 2, undefined);
                    expect(component.triples).toBeDefined();
                    expectToEqual(component.triples, expectedGraphRDFData.triples);
                });

                it('... should not do anything if no triples are provided from rdf data', async () => {
                    expectSpyCall(resetTriplesSpy, 1);

                    // Set undefined triples
                    component.triples = undefined;
                    component.graphRDFInputData.triples = undefined;
                    await detectChangesOnPush(fixture);

                    // Reset triples
                    component.resetTriples();
                    await detectChangesOnPush(fixture);

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

                it('... should find and reset a query from queryList if queryLabel and queryType is known', async () => {
                    expectSpyCall(resetQuerySpy, 1, undefined);

                    // Request for query with known queryLabel and queryType
                    const changedQuery = { ...expectedGraphRDFData.queryList[1] };

                    component.resetQuery(changedQuery);
                    await detectChangesOnPush(fixture);

                    // Matches queryList queries by label
                    expectSpyCall(resetQuerySpy, 2, undefined);

                    expectToEqual(component.query, changedQuery);
                    expectToBe(component.query.queryLabel, changedQuery.queryLabel);
                    expectToBe(component.query.queryType, changedQuery.queryType);
                });

                describe('... should set query as is, and not find from queryList, if', () => {
                    it('... only queryLabel is known but not queryType', async () => {
                        expectSpyCall(resetQuerySpy, 1, undefined);

                        // Request for query with known queryLabel but unknown queryType
                        const changedQuery = { ...expectedGraphRDFData.queryList[1] };
                        changedQuery.queryType = 'select';

                        // Set correct return value of service
                        serviceGetQueryTypeSpy.mockReturnValue(changedQuery.queryType);

                        component.resetQuery(changedQuery);
                        await detectChangesOnPush(fixture);

                        // Matches queryList queries only by label
                        expectSpyCall(resetQuerySpy, 2, undefined);

                        expectToEqual(component.query, changedQuery);
                        expectToBe(component.query.queryLabel, changedQuery.queryLabel);
                        expectToBe(component.query.queryType, changedQuery.queryType);
                    });

                    it('... only queryType is known but not queryLabel', async () => {
                        expectSpyCall(resetQuerySpy, 1, undefined);

                        // Request for query with known queryType but unknown label
                        const changedQuery = { ...expectedGraphRDFData.queryList[1] };
                        changedQuery.queryLabel = 'select all tests';

                        component.resetQuery(changedQuery);
                        await detectChangesOnPush(fixture);

                        // Matches queryList queries only by type
                        expectSpyCall(resetQuerySpy, 2, undefined);

                        expectToEqual(component.query, changedQuery);
                        expectToBe(component.query.queryLabel, changedQuery.queryLabel);
                        expectToBe(component.query.queryType, changedQuery.queryType);
                    });

                    it('... given query is not in queryList', async () => {
                        expectSpyCall(resetQuerySpy, 1, undefined);

                        // Request for unknown query
                        const changedQuery: GraphSparqlQuery = {
                            queryType: 'select',
                            queryLabel: 'Test Query 3',
                            queryString:
                                'PREFIX example: <https://example.com/onto#> \n\n SELECT * WHERE { ?test3 ?has ?success3 . }',
                        };
                        // Set correct return value of service
                        serviceGetQueryTypeSpy.mockReturnValue(changedQuery.queryType);
                        component.resetQuery(changedQuery);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(resetQuerySpy, 2, undefined);

                        expectToEqual(component.query, changedQuery);
                        expectToBe(component.query.queryLabel, changedQuery.queryLabel);
                        expectToBe(component.query.queryType, changedQuery.queryType);
                    });
                });

                it('... should set initial query (queryList[0]) if no query is provided', async () => {
                    expectSpyCall(resetQuerySpy, 1, undefined);

                    // Set changed query
                    const changedQuery = { ...expectedGraphRDFData.queryList[1] };
                    component.query = changedQuery;
                    await detectChangesOnPush(fixture);

                    expectToEqual(component.query, changedQuery);

                    // Reset triples
                    component.resetQuery();
                    await detectChangesOnPush(fixture);

                    expectSpyCall(resetQuerySpy, 2, undefined);

                    expectToEqual(component.query, expectedGraphRDFData.queryList[0]);
                });

                it('... should not do anything if no queryList is provided from RDF data', async () => {
                    expectSpyCall(resetQuerySpy, 1, undefined);

                    // Set undefined triples
                    component.queryList = undefined;
                    component.graphRDFInputData.queryList = undefined;
                    await detectChangesOnPush(fixture);

                    // Reset query
                    const changedQuery: GraphSparqlQuery = {
                        queryType: 'construct',
                        queryLabel: 'Test Query 3',
                        queryString:
                            'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test3 ?has ?success3 . }',
                    };
                    component.resetQuery(changedQuery);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(resetQuerySpy, 2, changedQuery);
                    expect(component.queryList).toBeUndefined();
                });

                it('... should trigger `performQuery()`', async () => {
                    expectSpyCall(performQuerySpy, 1, undefined);

                    // Reset query
                    component.resetQuery(expectedGraphRDFData.queryList[1]);
                    await detectChangesOnPush(fixture);

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
                    const editorCmp = editorDes[0].injector.get(
                        TriplesEditorStubComponent
                    ) as TriplesEditorStubComponent;

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

                it('... should append namespaces to query if no prefixes given', async () => {
                    expectSpyCall(performQuerySpy, 1, undefined);

                    const queryStringWithoutPrefixes = 'CONSTRUCT WHERE { ?test ?has ?success . }';
                    const queryWithoutPrefixes: GraphSparqlQuery = {
                        queryType: 'construct',
                        queryLabel: 'Test Query 1',
                        queryString: queryStringWithoutPrefixes,
                    };
                    serviceCheckNamespacesInQuerySpy.mockReturnValue(
                        'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test ?has ?success . }'
                    );

                    // Perform query without prefixes
                    component.query = queryWithoutPrefixes;
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 2, undefined);
                    expectSpyCall(serviceCheckNamespacesInQuerySpy, 2, [
                        queryStringWithoutPrefixes,
                        expectedGraphRDFData.triples,
                    ]);

                    expectToEqual(component.query, expectedGraphRDFData.queryList[0]);
                });

                it('... should get queryType from service', async () => {
                    expectSpyCall(performQuerySpy, 1, undefined);
                    expectSpyCall(serviceGetQueryTypeSpy, 1, expectedGraphRDFData.queryList[0].queryString);

                    // Perform query
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 2, undefined);
                    expectSpyCall(serviceGetQueryTypeSpy, 2, expectedGraphRDFData.queryList[0].queryString);

                    expectToBe(component.query.queryType, 'construct');
                });

                it('... should trigger `_queryLocalStore` for construct queries', async () => {
                    // Set construct query type
                    serviceGetQueryTypeSpy.mockReturnValue('construct');

                    // Perform query
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    // First spy call already triggered by ChangeDetection in beforeEach
                    expectSpyCall(performQuerySpy, 2, undefined);
                    expectSpyCall(queryLocalStoreSpy, 2, [
                        'construct',
                        expectedGraphRDFData.queryList[0].queryString,
                        expectedGraphRDFData.triples,
                    ]);
                });

                it('... should trigger `_queryLocalStore` for select queries', async () => {
                    // Set select query type
                    component.query.queryType = expectedGraphRDFData.queryList[2].queryType;
                    component.query.queryString = expectedGraphRDFData.queryList[2].queryString;

                    // Perform query
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    // First spy call already triggered by ChangeDetection in beforeEach
                    expectSpyCall(performQuerySpy, 2, undefined);
                    expectSpyCall(queryLocalStoreSpy, 2, [
                        'select',
                        expectedGraphRDFData.queryList[2].queryString,
                        expectedGraphRDFData.triples,
                    ]);
                });

                it('... should get queryResult for construct queries', async () => {
                    // Set construct query type
                    serviceGetQueryTypeSpy.mockReturnValue('construct');

                    // Perform query
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    expectToBe(component.query.queryType, 'construct');
                    await expect(lastValueFrom(component.queryResult$)).resolves.not.toThrow();
                    await expect(lastValueFrom(component.queryResult$)).resolves.toEqual(expectedConstructResult);
                });

                it('... should get queryResult for select queries', async () => {
                    // Set select query type
                    component.query.queryType = expectedGraphRDFData.queryList[2].queryType;
                    component.query.queryString = expectedGraphRDFData.queryList[2].queryString;

                    // Perform query
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    expectToBe(component.query.queryType, 'select');
                    await expect(lastValueFrom(component.queryResult$)).resolves.not.toThrow();
                    await expect(lastValueFrom(component.queryResult$)).resolves.toEqual(expectedSelectResult);
                });

                it('... should set empty observable for update query types', async () => {
                    serviceGetQueryTypeSpy.mockReturnValue('update');

                    // Perform query
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    expectToBe(component.query.queryType, 'update');
                    await expect(lastValueFrom(component.queryResult$)).rejects.toThrow(EmptyError);
                });

                it('... should set empty observable for other query types', async () => {
                    serviceGetQueryTypeSpy.mockReturnValue('other');

                    // Perform query
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    expectToBe(component.query.queryType, 'other');
                    await expect(lastValueFrom(component.queryResult$)).rejects.toThrow(EmptyError);
                });
            });

            describe('#_queryLocalStore()', () => {
                beforeEach(async () => {
                    // Set construct mode
                    component.query.queryType = 'construct';
                    await detectChangesOnPush(fixture);
                });

                it('... should have a method `_queryLocalStore`', () => {
                    expect((component as any)._queryLocalStore).toBeDefined();
                });

                it('... should trigger `graphVisualizerService.doQuery`', async () => {
                    const expectedCallback = [
                        'construct',
                        expectedGraphRDFData.queryList[0].queryString,
                        expectedGraphRDFData.triples,
                    ];

                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 2, undefined);
                    expectSpyCall(queryLocalStoreSpy, 2, expectedCallback);
                    expectSpyCall(serviceDoQuerySpy, 2, expectedCallback);
                });

                it('... should return query result on success (construct)', async () => {
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    await expect(lastValueFrom(component.queryResult$)).resolves.not.toThrow();
                    await expect(lastValueFrom(component.queryResult$)).resolves.toEqual(expectedConstructResult);
                });

                it('... should return query result on success (select)', async () => {
                    // Set select query type
                    component.query.queryType = expectedGraphRDFData.queryList[2].queryType;
                    component.query.queryString = expectedGraphRDFData.queryList[2].queryString;

                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    await expect(lastValueFrom(component.queryResult$)).resolves.not.toThrow();
                    await expect(lastValueFrom(component.queryResult$)).resolves.toEqual(expectedSelectResult);
                });

                it('... should return string message on successful select query with no results', async () => {
                    const expectedNoResults = 'Query returned no results';
                    const expectedCallback = [
                        'select',
                        expectedGraphRDFData.queryList[0].queryString,
                        expectedGraphRDFData.triples,
                    ];

                    serviceDoQuerySpy.mockResolvedValue(expectedNoResults);

                    const result = await (component as any)._queryLocalStore(
                        expectedCallback[0],
                        expectedCallback[1],
                        expectedCallback[2]
                    );

                    expectToBe(result, expectedNoResults);
                });

                describe('... on error', () => {
                    it('... should return empty array', async () => {
                        const expectedError = { status: 404, statusText: 'error' };

                        vi.spyOn(console, 'error').mockImplementation(mockConsole.log); // Catch console output
                        serviceDoQuerySpy.mockImplementation(() => Promise.reject(expectedError));

                        component.performQuery();
                        await detectChangesOnPush(fixture);

                        await expect(lastValueFrom(component.queryResult$)).resolves.not.toThrow();
                        await expect(lastValueFrom(component.queryResult$)).resolves.toEqual([]);
                    });

                    it('... should log an error', async () => {
                        const expectedError = { status: 404, statusText: 'error' };

                        const errorSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                        serviceDoQuerySpy.mockImplementation(() => Promise.reject(expectedError));
                        errorSpy.mockClear();

                        component.performQuery();
                        await detectChangesOnPush(fixture);

                        expectSpyCall(errorSpy, 2);
                        expectToEqual(errorSpy.mock.calls[0], ['#queryLocalstore got error:', expectedError]);
                        // Error logged by `showToastMessage` method
                        expectToEqual(errorSpy.mock.calls[1], ['Query Error', ':', String(expectedError.statusText)]);
                    });

                    describe('... should trigger `showToastMessage` correctly on', () => {
                        it.each([
                            {
                                desc: 'a structured error object (Error)',
                                error: (() => {
                                    const err = new Error('error message');
                                    err.name = 'Error';
                                    return err;
                                })(),
                                expectedCalls: [[new ToastMessage('Error', 'error message', 5000), 'error']],
                            },
                            {
                                desc: 'a structured error object (Error) with message containing `undefined`',
                                error: (() => {
                                    const err = new Error('error message undefined');
                                    err.name = 'Error';
                                    return err;
                                })(),
                                expectedCalls: [
                                    [new ToastMessage('Error', 'The query did not return any results.', 5000), 'error'],
                                    [new ToastMessage('Error', 'error message undefined', 5000), 'error'],
                                ],
                            },
                            {
                                desc: 'a plain object with a `message` property',
                                error: { status: 400, message: 'Custom API error message' },
                                expectedCalls: [
                                    [new ToastMessage('Query Error', 'Custom API error message', 5000), 'error'],
                                ],
                            },
                            {
                                desc: 'a plain object with a `statusText` property (like HTTP errors)',
                                error: { status: 404, statusText: 'Not Found' },
                                expectedCalls: [[new ToastMessage('Query Error', 'Not Found', 5000), 'error']],
                            },
                            {
                                desc: 'a plain object without a `message` or `statusText` property (forces JSON.stringify)',
                                error: { errorCode: 999, fatal: true },
                                expectedCalls: [
                                    [new ToastMessage('Query Error', '{"errorCode":999,"fatal":true}', 5000), 'error'],
                                ],
                            },
                            {
                                desc: 'a primitive string error',
                                error: 'Fatal Store Crash',
                                expectedCalls: [[new ToastMessage('Query Error', 'Fatal Store Crash', 5000), 'error']],
                            },
                        ])('... $desc', async ({ error, expectedCalls }) => {
                            vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                            serviceDoQuerySpy.mockImplementation(() => Promise.reject(error));

                            component.performQuery();
                            await detectChangesOnPush(fixture);

                            expectSpyCall(showToastMessageSpy, expectedCalls.length);
                            expectedCalls.forEach((expectedCall, index) => {
                                expectToEqual(showToastMessageSpy.mock.calls[index], expectedCall);
                            });
                        });
                    });
                });
            });

            describe('#showToastMessage()', () => {
                beforeEach(async () => {
                    // Set construct mode
                    component.query.queryType = 'construct';
                    await detectChangesOnPush(fixture);

                    consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                });

                it('... should have a method `showToastMessage`', () => {
                    expect(component.showToastMessage).toBeDefined();
                });

                it('... should trigger on event from TriplesEditorComponent', () => {
                    const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(
                        TriplesEditorStubComponent
                    ) as TriplesEditorStubComponent;

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
                        const toastMessage: ToastMessage = undefined;
                        consoleSpy.mockClear();

                        component.showToastMessage(toastMessage, 'error');

                        expectSpyCall(showToastMessageSpy, 1, [undefined]);
                        expectSpyCall(toastServiceAddSpy, 0);
                        expectSpyCall(consoleSpy, 0);
                    });

                    it('... if no toastMessage.message is provided', () => {
                        const toastMessage = new ToastMessage('Error1', '', 500);
                        consoleSpy.mockClear();

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
                    consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);

                    component.showToastMessage(toastMessage);

                    expectSpyCall(toastServiceAddSpy, 1, expectedToast);
                    expectSpyCall(consoleSpy, 1, ['DefaultInfo', ':', 'Default info message']);
                });

                describe('... on error message', () => {
                    it('... should log the provided name and error message to console', () => {
                        const toastMessage = new ToastMessage('Error1', 'error message', 500);
                        consoleSpy.mockClear();

                        component.showToastMessage(toastMessage, 'error');

                        expectSpyCall(showToastMessageSpy, 1, toastMessage);
                        expectSpyCall(consoleSpy, 1, [toastMessage.name, ':', toastMessage.message]);
                    });

                    it('... should trigger toast service and add an error toast message', async () => {
                        const toastMessage = new ToastMessage('Error1', 'error message', 500);
                        const expectedToast = new Toast(toastMessage.message, {
                            header: toastMessage.name,
                            classname: 'bg-danger text-light',
                            delay: toastMessage.duration,
                        });

                        // Trigger error message
                        component.showToastMessage(toastMessage, 'error');
                        await detectChangesOnPush(fixture);

                        expectSpyCall(toastServiceAddSpy, 1, expectedToast);

                        expect(toastService.toasts).toBeDefined();
                        expectToBe(toastService.toasts.length, 1);
                        expectToEqual(toastService.toasts[0], expectedToast);
                    });

                    it('... should set durationvValue = 3000 for the errortoast message if delay not given ', async () => {
                        const toastMessage = new ToastMessage('Error1', 'error message');
                        const expectedDuration = 3000;
                        const expectedToast = new Toast(toastMessage.message, {
                            header: toastMessage.name,
                            classname: 'bg-danger text-light',
                            delay: expectedDuration,
                        });

                        // Trigger error message without delay value
                        component.showToastMessage(toastMessage, 'error');
                        await detectChangesOnPush(fixture);

                        expectSpyCall(toastServiceAddSpy, 1, expectedToast);

                        expect(toastService.toasts).toBeDefined();
                        expectToBe(toastService.toasts.length, 1);
                        expectToEqual(toastService.toasts[0], expectedToast);
                    });
                });

                describe('... on info message', () => {
                    it('... should log the provided name and info message to console', () => {
                        const toastMessage = new ToastMessage('Info1', 'info message', 500);
                        consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);
                        consoleSpy.mockClear();

                        component.showToastMessage(toastMessage, 'info');

                        expectSpyCall(showToastMessageSpy, 1, toastMessage);
                        expectSpyCall(consoleSpy, 1, [toastMessage.name, ':', toastMessage.message]);
                    });

                    it('... should trigger toast service and add an info toast message', async () => {
                        const toastMessage = new ToastMessage('Info1', 'info message', 500);
                        const expectedToast = new Toast(toastMessage.message, {
                            header: toastMessage.name,
                            classname: 'bg-info text-light',
                            delay: toastMessage.duration,
                        });
                        vi.spyOn(console, 'info').mockImplementation(mockConsole.log); // Catch console output

                        // Trigger info message
                        component.showToastMessage(toastMessage, 'info');
                        await detectChangesOnPush(fixture);

                        expectSpyCall(toastServiceAddSpy, 1, expectedToast);

                        expect(toastService.toasts).toBeDefined();
                        expectToBe(toastService.toasts.length, 1);
                        expectToEqual(toastService.toasts[0], expectedToast);
                    });

                    it('... should set durationValue = 3000 for the info toast message if delay not given ', async () => {
                        const toastMessage = new ToastMessage('Info1', 'info message');
                        const expectedDuration = 3000;
                        const expectedToast = new Toast(toastMessage.message, {
                            header: toastMessage.name,
                            classname: 'bg-info text-light',
                            delay: expectedDuration,
                        });
                        vi.spyOn(console, 'info').mockImplementation(mockConsole.log); // Catch console output

                        // Trigger info message without delay value
                        component.showToastMessage(toastMessage, 'info');
                        await detectChangesOnPush(fixture);

                        expectSpyCall(toastServiceAddSpy, 1, expectedToast);

                        expect(toastService.toasts).toBeDefined();
                        expectToBe(toastService.toasts.length, 1);
                        expectToEqual(toastService.toasts[0], expectedToast);
                    });
                });
            });

            describe('#onGraphNodeClick()', () => {
                let onGraphNodeClickSpy: Spy;

                beforeEach(async () => {
                    // Set construct mode
                    component.query.queryType = 'construct';
                    await detectChangesOnPush(fixture);

                    onGraphNodeClickSpy = vi.spyOn(component, 'onGraphNodeClick');
                    consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);
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
                    consoleSpy.mockClear();

                    const resultsDes = getAndExpectDebugElementByDirective(compDe, ConstructResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        ConstructResultsStubComponent
                    ) as ConstructResultsStubComponent;

                    const expectedNode = new D3SimulationNode('Test', D3SimulationNodeType.node);
                    resultsCmp.clickedNodeRequest.emit(expectedNode);

                    // Check ToastMessage
                    const expectedMessage = `GraphVisualizerComponent# graphClick on node ${expectedNode.id}\n\n Label: ${expectedNode.label}`;
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
            });

            describe('#onTableNodeClick()', () => {
                beforeEach(async () => {
                    // Set select mode
                    component.query = expectedGraphRDFData.queryList[0];
                    component.query.queryType = 'select';
                    await detectChangesOnPush(fixture);

                    consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);
                });

                it('... should have a method `onTableNodeClick`', () => {
                    expect(component.onTableNodeClick).toBeDefined();
                });

                it('... should trigger on event from SelectResultsComponent', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(compDe, SelectResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        SelectResultsStubComponent
                    ) as SelectResultsStubComponent;

                    const expectedUri = 'example:Test';
                    resultsCmp.clickedTableRequest.emit(expectedUri);

                    expectSpyCall(onTableNodeClickSpy, 1, expectedUri);
                });

                it('... should not do anything if no URI is provided', () => {
                    // Check initial state
                    expectSpyCall(performQuerySpy, 1, undefined);
                    expectToBe(component.query.queryString, component.graphRDFInputData.queryList[0].queryString);

                    const resultsDes = getAndExpectDebugElementByDirective(compDe, SelectResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        SelectResultsStubComponent
                    ) as SelectResultsStubComponent;

                    // Emit undefined value
                    resultsCmp.clickedTableRequest.emit('');

                    expectSpyCall(onTableNodeClickSpy, 1, '');
                    expectToBe(component.query.queryString, component.graphRDFInputData.queryList[0].queryString);
                    expectSpyCall(performQuerySpy, 1, undefined);
                });

                it('... should log the provided URI to console', () => {
                    consoleSpy.mockClear();

                    const resultsDes = getAndExpectDebugElementByDirective(compDe, SelectResultsStubComponent, 1, 1);
                    const resultsCmp = resultsDes[0].injector.get(
                        SelectResultsStubComponent
                    ) as SelectResultsStubComponent;

                    const expectedUri = 'example:Test';
                    resultsCmp.clickedTableRequest.emit(expectedUri);

                    expectSpyCall(onTableNodeClickSpy, 1, expectedUri);
                    expectSpyCall(consoleSpy, 1, ['GraphVisualizerComponent# tableClick on URI', expectedUri]);
                });
            });
        });
    });
});
