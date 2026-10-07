import { Component, DebugElement, EventEmitter, Input, isSignal, model, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EMPTY, EmptyError, firstValueFrom, lastValueFrom, Observable, take } from 'rxjs';

import type { Quad } from '@rdfjs/types';
import { DataFactory } from 'n3';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';

import { ToastComponent } from '@awg-shared/toast/toast.component';
import { Toast, ToastMessage, ToastService } from '@awg-shared/toast/toast.service';

import { GraphRDFData, GraphSparqlQuery } from '@awg-views/edition-view/models/graph.model';

import { GraphNode } from './models/graph-data.model';
import { SparqlConstructResult, SparqlQueryRun, SparqlResult, SparqlSelectResult } from './models/sparql-result.model';
import { SparqlQueryService } from './services/sparql-query.service';
import { DEFAULT_PREFIXES } from './utils/prefix.utils';
import { SPARQL_UTILS } from './utils/sparql.utils';

import { GraphVisualizerComponent } from './graph-visualizer.component';
import { UnsupportedTypeResultsComponent } from './unsupported-type-results/unsupported-type-results.component';

const { literal, namedNode, quad } = DataFactory;

const EXAMPLE = 'https://example.com/onto#';

// Mock components
@Component({
    selector: 'awg-construct-results',
    template: '',
    standalone: false,
})
class ConstructResultsStubComponent {
    @Input()
    queryResult$: Observable<SparqlResult> = EMPTY;
    @Input()
    defaultForceGraphHeight = 0;
    @Input()
    isFullscreen = false;
    @Output()
    clickedNodeRequest: EventEmitter<GraphNode> = new EventEmitter();
}

@Component({
    selector: 'awg-select-results',
    template: '',
    standalone: false,
})
class SelectResultsStubComponent {
    @Input()
    queryResult$: Observable<SparqlResult> = EMPTY;
    @Input()
    queryTime = 0;
    @Input()
    isFullscreen = false;
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
    queryList: GraphSparqlQuery[] = [];
    @Input()
    query: GraphSparqlQuery = new GraphSparqlQuery();
    @Input()
    isFullscreen = false;
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
    selector: 'awg-triples-editor',
    template: '',
    standalone: false,
})
class TriplesEditorStubComponent {
    readonly triples = model<string>('');
    @Input()
    isFullscreen = false;
    @Output()
    errorMessageRequest: EventEmitter<ToastMessage> = new EventEmitter();
    @Output()
    performQueryRequest: EventEmitter<void> = new EventEmitter();
    @Output()
    resetTriplesRequest: EventEmitter<void> = new EventEmitter();
}

describe('GraphVisualizerComponent (DONE)', () => {
    let component: GraphVisualizerComponent;
    let fixture: ComponentFixture<GraphVisualizerComponent>;
    let compDe: DebugElement;

    let mockSparqlQueryService: { run: Spy };
    let toastService: ToastService;

    let expectedGraphRDFData: GraphRDFData;
    let expectedConstructResult: SparqlConstructResult;
    let expectedSelectResult: SparqlSelectResult;
    let expectedDurationMs: number;
    let expectedNode: GraphNode;

    let consoleSpy: Spy;
    let serviceRunSpy: Spy;
    let onTableNodeClickSpy: Spy;
    let performQuerySpy: Spy;
    let runQuerySpy: Spy;
    let resetQuerySpy: Spy;
    let resetTriplesSpy: Spy;
    let showToastMessageSpy: Spy;
    let toastServiceAddSpy: Spy;

    beforeEach(async () => {
        // Mocked SparqlQueryService: it performs the query unchanged and resolves the expected result of its type
        mockSparqlQueryService = {
            run: vi.fn((queryString: string): Promise<SparqlQueryRun> =>
                Promise.resolve({
                    query: queryString,
                    result:
                        SPARQL_UTILS.getQueryType(queryString) === 'select'
                            ? expectedSelectResult
                            : expectedConstructResult,
                    durationMs: expectedDurationMs,
                })
            ),
        };

        await TestBed.configureTestingModule({
            declarations: [
                GraphVisualizerComponent,
                ConstructResultsStubComponent,
                SparqlEditorStubComponent,
                SelectResultsStubComponent,
                TriplesEditorStubComponent,
            ],
            imports: [ToastComponent, UnsupportedTypeResultsComponent],
            providers: [{ provide: SparqlQueryService, useValue: mockSparqlQueryService }, ToastService],
        })
            .overrideComponent(ToastComponent, { set: { template: '', imports: [] } })
            .overrideComponent(UnsupportedTypeResultsComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GraphVisualizerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject services
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

        const prefixes = { ...DEFAULT_PREFIXES, example: EXAMPLE };
        expectedConstructResult = {
            kind: 'construct',
            quads: [
                quad(namedNode(`${EXAMPLE}Test`), namedNode(`${EXAMPLE}has`), namedNode(`${EXAMPLE}Success`)) as Quad,
            ],
            prefixes,
        };
        expectedSelectResult = {
            kind: 'select',
            variables: ['test', 'has', 'success'],
            bindings: [
                {
                    test: namedNode(`${EXAMPLE}Test`),
                    has: namedNode(`${EXAMPLE}has`),
                    success: literal('Success'),
                },
            ],
            prefixes,
        };
        expectedDurationMs = 42;
        expectedNode = { id: `${EXAMPLE}Test`, shortName: 'example:Test', label: 'Test', kind: 'resource' };

        // Spies
        serviceRunSpy = mockSparqlQueryService.run;
        onTableNodeClickSpy = vi.spyOn(component, 'onTableNodeClick');
        performQuerySpy = vi.spyOn(component, 'performQuery');
        runQuerySpy = vi.spyOn(component, '_runQuery' as any);
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
        it('... should have default input `graphRDFInputData`', () => {
            expectToEqual(component.graphRDFInputData, new GraphRDFData());
        });

        it('... should have input signal `isFullscreenMode` to hold the default value', () => {
            expectToBe(isSignal(component.isFullscreenMode), true);

            expectToBe(component.isFullscreenMode(), false);
        });

        it('... should have default `defaultForceGraphHeight` ', () => {
            expectToBe(component.defaultForceGraphHeight, 500);
        });

        it('... should have default `query`', () => {
            expectToEqual(component.query, new GraphSparqlQuery());
        });

        it('... should have default `queryList`', () => {
            expectToEqual(component.queryList, []);
        });

        it('... should have default `queryResult`', () => {
            expectToEqual(component.queryResult$, EMPTY);
        });

        it('... should have default `queryTime`', () => {
            expectToBe(component.queryTime, 0);
        });

        it('... should have default `triples`', () => {
            expectToBe(component.triples, '');
        });

        it('... should not have triggered `resetTriples()`', () => {
            expectSpyCall(resetTriplesSpy, 0);
        });

        it('... should not have triggered `resetQuery()`', () => {
            expectSpyCall(resetQuerySpy, 0);
        });

        describe('VIEW', () => {
            it('... should contain a main div with 2 child divs', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer', 1, 1);
                getAndExpectDebugElementByCss(rowDes[0], 'div.awg-graph-visualizer > div', 2, 2);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
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

        it('... should have `queryTime` from the duration of the run', async () => {
            await lastValueFrom(component.queryResult$);

            expectToBe(component.queryTime, expectedDurationMs);
        });

        it('... should have triggered `resetTriples()`', () => {
            expectSpyCall(resetTriplesSpy, 1, undefined);
        });

        it('... should have triggered `resetQuery()`', () => {
            expectSpyCall(resetQuerySpy, 1, undefined);
        });

        describe('VIEW', () => {
            it('... should contain one ToastComponent (hollow) after the main div', () => {
                const toastDes = getAndExpectDebugElementByDirective(compDe, ToastComponent, 1, 1);
                const toastEl: HTMLElement = toastDes[0].nativeElement;

                expectToBe(toastEl.getAttribute('aria-live'), 'polite');
                expectToBe(toastEl.getAttribute('aria-atomic'), 'true');
            });

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

                it('... should contain one UnsupportedTypeResultsComponent (hollow) in third sub div (queryType === other)', async () => {
                    component.query.queryType = 'other' as any;
                    await detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], UnsupportedTypeResultsComponent, 1, 1);
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

                it('... should contain one UnsupportedTypeResultsComponent (hollow) in second sub div (queryType === other)', async () => {
                    component.query.queryType = 'other' as any;
                    await detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], UnsupportedTypeResultsComponent, 1, 1);
                });
            });

            describe('TriplesEditorComponent', () => {
                it('... should have `triples` passed down from main component', () => {
                    const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(
                        TriplesEditorStubComponent
                    ) as TriplesEditorStubComponent;

                    expectToEqual(editorCmp.triples(), expectedGraphRDFData.triples);
                });

                it('... should update `triples` with two-way bound triples from TriplesEditorComponent', () => {
                    const editorDes = getAndExpectDebugElementByDirective(compDe, TriplesEditorStubComponent, 1, 1);
                    const editorCmp = editorDes[0].injector.get(
                        TriplesEditorStubComponent
                    ) as TriplesEditorStubComponent;

                    // Set changed triples
                    const changedTriples =
                        '@prefix example: <https://example.com/onto#> .\n\n example:Test2 example:has example:Success2 .';
                    editorCmp.triples.set(changedTriples);

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

            describe('UnsupportedTypeResultsComponent (hollow)', () => {
                beforeEach(async () => {
                    // Set select mode
                    component.query.queryType = 'other' as any;
                    await detectChangesOnPush(fixture);
                });

                it('... should have `queryType` passed down from main component', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        UnsupportedTypeResultsComponent,
                        1,
                        1
                    );
                    const resultsCmp = resultsDes[0].injector.get(UnsupportedTypeResultsComponent);

                    expectToBe(resultsCmp.queryType(), 'other');
                });

                it('... should pass down empty string to UnsupportedTypeResultsComponent (hollow) if queryType is missing', async () => {
                    component.query.queryType = null;
                    await detectChangesOnPush(fixture);

                    const resultsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        UnsupportedTypeResultsComponent,
                        1,
                        1
                    );
                    const resultsCmp = resultsDes[0].injector.get(UnsupportedTypeResultsComponent);

                    expectToBe(resultsCmp.queryType(), '');
                });

                it('... should have `isFullscreen` passed down from main component', () => {
                    const resultsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        UnsupportedTypeResultsComponent,
                        1,
                        1
                    );
                    const resultsCmp = resultsDes[0].injector.get(UnsupportedTypeResultsComponent);

                    expectToBe(resultsCmp.isFullscreen(), false);
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

                it('... should do nothing if no triples are provided from rdf data', async () => {
                    expectSpyCall(resetTriplesSpy, 1);

                    // Set undefined triples
                    component.triples = '';
                    component.graphRDFInputData.triples = '';
                    await detectChangesOnPush(fixture);

                    // Reset triples
                    component.resetTriples();
                    await detectChangesOnPush(fixture);

                    expectSpyCall(resetTriplesSpy, 2);
                    expectToBe(component.triples, '');
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
                        // The query type is taken from the query string
                        changedQuery.queryString = expectedGraphRDFData.queryList[2].queryString;

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

                it('... should do nothing if no queryList is provided from RDF data', async () => {
                    expectSpyCall(resetQuerySpy, 1, undefined);

                    // Set undefined triples
                    component.queryList = [];
                    component.graphRDFInputData.queryList = [];
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
                    expectToEqual(component.queryList, []);
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
                    serviceRunSpy.mockResolvedValueOnce({
                        query: expectedGraphRDFData.queryList[0].queryString,
                        result: expectedConstructResult,
                        durationMs: expectedDurationMs,
                    });

                    // Perform query without prefixes
                    component.query = queryWithoutPrefixes;
                    component.performQuery();
                    await lastValueFrom(component.queryResult$);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 2, undefined);
                    expectSpyCall(serviceRunSpy, 2, [queryStringWithoutPrefixes, expectedGraphRDFData.triples]);

                    // The performed query is set as a new object (for the OnPush editor)
                    expectToEqual(component.query, expectedGraphRDFData.queryList[0]);
                    expect(component.query).not.toBe(queryWithoutPrefixes);
                });

                it('... should set the queryType synchronously from the query string', () => {
                    component.query.queryType = 'construct';
                    component.query.queryString = expectedGraphRDFData.queryList[2].queryString;

                    // Perform query
                    component.performQuery();

                    expectToBe(component.query.queryType, 'select');
                });

                it('... should trigger `_runQuery` for construct queries', async () => {
                    // Perform query
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    // First spy call already triggered by ChangeDetection in beforeEach
                    expectSpyCall(performQuerySpy, 2, undefined);
                    expectSpyCall(runQuerySpy, 2, [
                        'construct',
                        expectedGraphRDFData.queryList[0].queryString,
                        expectedGraphRDFData.triples,
                    ]);
                });

                it('... should trigger `_runQuery` for select queries', async () => {
                    // Set select query type
                    component.query.queryType = expectedGraphRDFData.queryList[2].queryType;
                    component.query.queryString = expectedGraphRDFData.queryList[2].queryString;

                    // Perform query
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    // First spy call already triggered by ChangeDetection in beforeEach
                    expectSpyCall(performQuerySpy, 2, undefined);
                    expectSpyCall(runQuerySpy, 2, [
                        'select',
                        expectedGraphRDFData.queryList[2].queryString,
                        expectedGraphRDFData.triples,
                    ]);
                });

                it('... should get queryResult for construct queries', async () => {
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

                it('... should set empty observable without running update queries', async () => {
                    component.query.queryString = `PREFIX example: <${EXAMPLE}>\nINSERT DATA { example:a example:b example:c }`;

                    // Perform query
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    expectToBe(component.query.queryType, 'update');
                    expectSpyCall(serviceRunSpy, 1);
                    await expect(lastValueFrom(component.queryResult$)).rejects.toThrow(EmptyError);
                });

                it('... should set empty observable without running queries of unknown type', async () => {
                    component.query.queryString = 'WHERE { ?s ?p ?o }';

                    // Perform query
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    expectToBe(component.query.queryType, null);
                    expectSpyCall(serviceRunSpy, 1);
                    await expect(lastValueFrom(component.queryResult$)).rejects.toThrow(EmptyError);
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

                describe('... should do nothing', () => {
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

                        expectToEqual(toastService.toasts(), [expectedToast]);
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

                        expectToEqual(toastService.toasts(), [expectedToast]);
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

                        expectToEqual(toastService.toasts(), [expectedToast]);
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

                        expectToEqual(toastService.toasts(), [expectedToast]);
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
                    resultsCmp.clickedNodeRequest.emit(undefined as unknown as GraphNode);

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

                    resultsCmp.clickedNodeRequest.emit(expectedNode);

                    // Check ToastMessage
                    const expectedMessage = `GraphVisualizerComponent# graphClick on node ${expectedNode.shortName}\n\n Label: ${expectedNode.label}`;
                    const toastMessage = new ToastMessage(expectedNode.shortName, expectedMessage, 5000);
                    const expectedToast = new Toast(toastMessage.message, {
                        header: toastMessage.name,
                        classname: 'bg-info text-light',
                        delay: toastMessage.duration,
                    });

                    expectSpyCall(onGraphNodeClickSpy, 1, expectedNode);
                    expectSpyCall(showToastMessageSpy, 1, [toastMessage, 'info']);
                    expectSpyCall(toastServiceAddSpy, 1, expectedToast);
                    expectSpyCall(consoleSpy, 1, [expectedNode.shortName, ':', expectedMessage]);
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

            describe('#_runQuery()', () => {
                beforeEach(async () => {
                    // Set construct mode
                    component.query.queryType = 'construct';
                    await detectChangesOnPush(fixture);
                });

                it('... should have a method `_runQuery`', () => {
                    expect(component['_runQuery']).toBeDefined();
                });

                it('... should trigger `sparqlQueryService.run` with the query string and the triples', async () => {
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 2, undefined);
                    expectSpyCall(runQuerySpy, 2, [
                        'construct',
                        expectedGraphRDFData.queryList[0].queryString,
                        expectedGraphRDFData.triples,
                    ]);
                    expectSpyCall(serviceRunSpy, 2, [
                        expectedGraphRDFData.queryList[0].queryString,
                        expectedGraphRDFData.triples,
                    ]);
                });

                it('... should return the query result on success (construct)', async () => {
                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    await expect(lastValueFrom(component.queryResult$)).resolves.toEqual(expectedConstructResult);
                });

                it('... should return the query result on success (select)', async () => {
                    component.query.queryString = expectedGraphRDFData.queryList[2].queryString;

                    component.performQuery();
                    await detectChangesOnPush(fixture);

                    await expect(lastValueFrom(component.queryResult$)).resolves.toEqual(expectedSelectResult);
                });

                it('... should set the performed query and the query time on success', async () => {
                    const performedQuery = `PREFIX rdf: <${DEFAULT_PREFIXES['rdf']}>\n${component.query.queryString}`;
                    serviceRunSpy.mockResolvedValueOnce({
                        query: performedQuery,
                        result: expectedConstructResult,
                        durationMs: 7,
                    });

                    await component['_runQuery']('construct', component.query.queryString, component.triples);

                    expectToBe(component.query.queryString, performedQuery);
                    expectToBe(component.queryTime, 7);
                });

                describe('... on error', () => {
                    it('... should return an empty result of the query type', async () => {
                        vi.spyOn(console, 'error').mockImplementation(mockConsole.log); // Catch console output
                        serviceRunSpy.mockRejectedValue({ status: 404, statusText: 'error' });

                        component.performQuery();
                        await detectChangesOnPush(fixture);

                        const queryResult = await firstValueFrom(component.queryResult$);

                        expectToEqual(queryResult, { kind: 'construct', quads: [], prefixes: DEFAULT_PREFIXES });
                    });

                    it('... should keep the query unchanged', async () => {
                        vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                        serviceRunSpy.mockRejectedValue(new Error('error'));
                        const query = component.query;

                        await component['_runQuery']('construct', query.queryString, component.triples);

                        expectToBe(component.query, query);
                    });

                    it('... should log an error', async () => {
                        const expectedError = { status: 404, statusText: 'error' };

                        const errorSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                        serviceRunSpy.mockRejectedValue(expectedError);
                        errorSpy.mockClear();

                        component.performQuery();
                        await detectChangesOnPush(fixture);

                        expectSpyCall(errorSpy, 2);
                        expectToEqual(errorSpy.mock.calls[0], ['#runQuery got error:', expectedError]);
                        // Error logged by `showToastMessage` method
                        expectToEqual(errorSpy.mock.calls[1], ['Query Error', ':', String(expectedError.statusText)]);
                    });

                    it('... should delegate error parsing to _getErrorMessage and trigger showToastMessage', async () => {
                        const error = new Error('some error');
                        const expectedParsedMessage = 'Parsed Error Message Via Helper';

                        vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                        const getErrorMessageSpy = vi
                            .spyOn(component, '_getErrorMessage' as any)
                            .mockReturnValue(expectedParsedMessage);

                        serviceRunSpy.mockRejectedValue(error);

                        component.performQuery();
                        await detectChangesOnPush(fixture);

                        expect(getErrorMessageSpy).toHaveBeenCalledWith(error);

                        expectSpyCall(showToastMessageSpy, 1);
                        expectToEqual(showToastMessageSpy.mock.calls[0], [
                            new ToastMessage('Error', expectedParsedMessage, 5000),
                            'error',
                        ]);
                    });

                    it('... should trigger a special toast message if the error message contains `undefined`', async () => {
                        const specialError = new Error('The query returned an undefined result.');
                        specialError.name = 'Query Error';

                        vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                        serviceRunSpy.mockRejectedValue(specialError);
                        showToastMessageSpy.mockClear();

                        component.performQuery();
                        await detectChangesOnPush(fixture);

                        expectSpyCall(showToastMessageSpy, 2);

                        expectToEqual(showToastMessageSpy.mock.calls[0], [
                            new ToastMessage('Query Error', 'The query did not return any results.', 5000),
                            'error',
                        ]);
                        expectToEqual(showToastMessageSpy.mock.calls[1], [
                            new ToastMessage('Query Error', 'The query returned an undefined result.', 5000),
                            'error',
                        ]);
                    });
                });
            });

            describe('#_emptyResult()', () => {
                it('... should have a method `_emptyResult`', () => {
                    expect(component['_emptyResult']).toBeDefined();
                });

                it('... should hold an empty construct result for construct queries', () => {
                    expectToEqual(component['_emptyResult']('construct'), {
                        kind: 'construct',
                        quads: [],
                        prefixes: DEFAULT_PREFIXES,
                    });
                });

                it('... should hold an empty select result for select queries', () => {
                    expectToEqual(component['_emptyResult']('select'), {
                        kind: 'select',
                        variables: [],
                        bindings: [],
                        prefixes: DEFAULT_PREFIXES,
                    });
                });

                it('... should hold an unsupported result for other query types', () => {
                    expectToEqual(component['_emptyResult']('ask'), { kind: 'unsupported', queryType: 'ask' });
                    expectToEqual(component['_emptyResult'](null), { kind: 'unsupported', queryType: null });
                });
            });

            describe('#_getErrorMessage()', () => {
                it('... should have a method `_getErrorMessage`', () => {
                    expect(component['_getErrorMessage']).toBeDefined();
                });

                describe('... should parse error messages correctly for various error types', () => {
                    it.each([
                        {
                            desc: 'a structured error object (Error)',
                            error: (() => {
                                const err = new Error('error message');
                                err.name = 'Error';
                                return err;
                            })(),
                            expectedMessage: 'error message',
                        },
                        {
                            desc: 'a structured error object (Error) with specific message',
                            error: (() => {
                                const err = new Error('error message undefined');
                                err.name = 'Error';
                                return err;
                            })(),
                            expectedMessage: 'error message undefined',
                        },
                        {
                            desc: 'a plain object with a `message` property',
                            error: { status: 400, message: 'Custom API error message' },
                            expectedMessage: 'Custom API error message',
                        },
                        {
                            desc: 'a plain object with a `statusText` property (like HTTP errors)',
                            error: { status: 404, statusText: 'Not Found' },
                            expectedMessage: 'Not Found',
                        },
                        {
                            desc: 'a plain object without a `message` or `statusText` property (forces `JSON.stringify`)',
                            error: { errorCode: 999, fatal: true },
                            expectedMessage: '{"errorCode":999,"fatal":true}',
                        },
                        {
                            desc: 'an object where `JSON.stringify` returns undefined',
                            error: {
                                toJSON: (): undefined => undefined,
                            },
                            expectedMessage: undefined,
                        },
                        {
                            desc: 'a circular object that causes `JSON.stringify` to throw (forces catch)',
                            error: (() => {
                                const circularObj: any = { foo: 'bar' };
                                circularObj.self = circularObj;
                                return circularObj;
                            })(),
                            expectedMessage: '[Complex Error Object with keys: foo, self]',
                        },
                        {
                            desc: 'a primitive string error',
                            error: 'Fatal Store Crash',
                            expectedMessage: 'Fatal Store Crash',
                        },
                        {
                            desc: 'a primitive number error',
                            error: 500,
                            expectedMessage: '500',
                        },
                        {
                            desc: 'a primitive boolean error',
                            error: false,
                            expectedMessage: 'false',
                        },
                        {
                            desc: 'an unknown format (like null)',
                            error: null as any,
                            expectedMessage: 'Unknown error format',
                        },
                        {
                            desc: 'an unknown format (like undefined)',
                            error: undefined as any,
                            expectedMessage: 'Unknown error format',
                        },
                    ])('... with $desc', ({ error, expectedMessage }) => {
                        const result = component['_getErrorMessage'](error);

                        if (expectedMessage === undefined) {
                            expect(result).toBeUndefined();
                        } else {
                            expectToBe(result, expectedMessage);
                        }
                    });
                });
            });
        });
    });
});
