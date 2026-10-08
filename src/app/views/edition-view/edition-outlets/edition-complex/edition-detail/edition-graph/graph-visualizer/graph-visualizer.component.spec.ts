import { DebugElement, isSignal, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

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

import { GraphEditorSparqlComponent } from './editor/sparql/graph-editor-sparql.component';
import { GraphEditorTriplesComponent } from './editor/triples/graph-editor-triples.component';
import { GraphNode } from './models/graph-data.model';
import {
    SparqlConstructResult,
    SparqlQueryRequest,
    SparqlQueryRun,
    SparqlSelectResult,
} from './models/sparql-result.model';
import { GraphResultsConstructComponent } from './results/construct/graph-results-construct.component';
import { GraphResultsSelectComponent } from './results/select/graph-results-select.component';
import { GraphResultsUnsupportedComponent } from './results/unsupported/graph-results-unsupported.component';
import { SparqlQueryService } from './services/sparql-query.service';
import { DEFAULT_PREFIXES } from './utils/prefix.utils';
import { SPARQL_UTILS } from './utils/sparql.utils';

import { GraphVisualizerComponent } from './graph-visualizer.component';

const { literal, namedNode, quad } = DataFactory;

const EXAMPLE = 'https://example.com/onto#';

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
    let expectedChangedTriples: string;

    let consoleSpy: Spy;
    let serviceRunSpy: Spy;
    let onTableNodeClickSpy: Spy;
    let performQuerySpy: Spy;
    let runQuerySpy: Spy;
    let resetQuerySpy: Spy;
    let resetTriplesSpy: Spy;
    let showToastMessageSpy: Spy;
    let toastServiceAddSpy: Spy;

    /**
     * Helper function: getChildCmp.
     *
     * It gets the instance of the single (hollow) child component of a given type.
     */
    const getChildCmp = <T>(childType: Type<T>): T =>
        getAndExpectDebugElementByDirective(compDe, childType, 1, 1)[0].injector.get(childType);

    /**
     * Helper function: setQueryType.
     *
     * It sets the query type of the current query (without running it) and awaits the changes.
     */
    const setQueryType = async (queryType: GraphSparqlQuery['queryType']): Promise<void> => {
        component.query.set({ ...component.query(), queryType });
        await detectChangesOnPush(fixture);
    };

    /**
     * Helper function: createDeferredRun.
     *
     * It creates a query run promise that resolves only when triggered.
     */
    const createDeferredRun = (): { promise: Promise<SparqlQueryRun>; resolve: (run: SparqlQueryRun) => void } => {
        let resolve!: (run: SparqlQueryRun) => void;
        const promise = new Promise<SparqlQueryRun>(res => (resolve = res));
        return { promise, resolve };
    };

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
            imports: [GraphVisualizerComponent],
            providers: [{ provide: SparqlQueryService, useValue: mockSparqlQueryService }, ToastService],
        })
            .overrideComponent(GraphEditorSparqlComponent, { set: { template: '', imports: [] } })
            .overrideComponent(GraphEditorTriplesComponent, { set: { template: '', imports: [] } })
            .overrideComponent(GraphResultsConstructComponent, { set: { template: '', imports: [] } })
            .overrideComponent(GraphResultsSelectComponent, { set: { template: '', imports: [] } })
            .overrideComponent(GraphResultsUnsupportedComponent, { set: { template: '', imports: [] } })
            .overrideComponent(ToastComponent, { set: { template: '', imports: [] } })
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
        expectedGraphRDFData.queryList = [
            {
                queryType: 'construct',
                queryLabel: 'Test Query 1',
                queryString:
                    'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test ?has ?success . }',
            },
            {
                queryType: 'construct',
                queryLabel: 'Test Query 2',
                queryString:
                    'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test2 ?has ?success2 . }',
            },
            {
                queryType: 'select',
                queryLabel: 'Test Query 3',
                queryString:
                    'PREFIX example: <https://example.com/onto#> \n\n SELECT * WHERE { ?test3 ?has ?success3 . }',
            },
        ];
        expectedGraphRDFData.triples =
            '@prefix example: <https://example.com/onto#> .\n\n example:Test example:has example:Success .';
        expectedChangedTriples =
            '@prefix example: <https://example.com/onto#> .\n\n example:Test2 example:has example:Success2 .';

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
        it('... should throw due to missing required input signal `graphRDFInputData`', () => {
            expectToBe(isSignal(component.graphRDFInputData), true);

            expect(() => component.graphRDFInputData()).toThrow();
        });

        it('... should have input signal `isFullscreenMode` to hold false initially', () => {
            expectToBe(isSignal(component.isFullscreenMode), true);
            expectToBe(component.isFullscreenMode(), false);
        });

        it('... should have `defaultForceGraphHeight` to hold 500', () => {
            expectToBe(component.defaultForceGraphHeight, 500);
        });

        it('... should throw when accessing computed signal `queryList` due to missing input', () => {
            expectToBe(isSignal(component.queryList), true);

            expect(() => component.queryList()).toThrow();
        });

        it('... should throw when accessing linked signal `triples` due to missing input', () => {
            expectToBe(isSignal(component.triples), true);

            expect(() => component.triples()).toThrow();
        });

        it('... should throw when accessing linked signal `query` due to missing input', () => {
            expectToBe(isSignal(component.query), true);

            expect(() => component.query()).toThrow();
        });

        it('... should have computed signals `queryResult` and `queryTime`', () => {
            expectToBe(isSignal(component.queryResult), true);
            expectToBe(isSignal(component.queryTime), true);
        });

        it('... should not have run any query', () => {
            expectSpyCall(serviceRunSpy, 0);
        });

        describe('VIEW', () => {
            it('... should contain a main div with 2 child divs', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer', 1, 1);
                getAndExpectDebugElementByCss(rowDes[0], 'div.awg-graph-visualizer > div', 2, 2);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('graphRDFInputData', expectedGraphRDFData);
            fixture.componentRef.setInput('isFullscreenMode', false);

            // Trigger initial data binding and await the initial query run
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('... should have input signal `graphRDFInputData` to hold the provided data', () => {
            expectToEqual(component.graphRDFInputData(), expectedGraphRDFData);
        });

        it('... should have computed signal `queryList` to hold the provided query list', () => {
            expectToEqual(component.queryList(), expectedGraphRDFData.queryList);
        });

        it('... should have linked signal `triples` to hold the provided triples', () => {
            expectToBe(component.triples(), expectedGraphRDFData.triples);
        });

        it('... should have linked signal `query` to hold the initial query', () => {
            expectToEqual(component.query(), expectedGraphRDFData.queryList[0]);
        });

        it('... should have resource `queryRun` to hold the initial query run', () => {
            expectToEqual(component.queryRun.value(), {
                query: expectedGraphRDFData.queryList[0].queryString,
                result: expectedConstructResult,
                durationMs: expectedDurationMs,
            });
            expectSpyCall(serviceRunSpy, 1, [
                expectedGraphRDFData.queryList[0].queryString,
                expectedGraphRDFData.triples,
            ]);
        });

        it('... should have computed signal `queryResult` to hold the expected result', () => {
            expectToEqual(component.queryResult(), expectedConstructResult);
        });

        it('... should have computed signal `queryTime` to hold the expected duration', () => {
            expectToBe(component.queryTime(), expectedDurationMs);
        });

        describe('... computed signal `queryResult`', () => {
            it('... should hold undefined while the query is running', async () => {
                const deferredRun = createDeferredRun();
                serviceRunSpy.mockReturnValueOnce(deferredRun.promise);

                component.performQuery();
                TestBed.tick();

                expect(component.queryResult()).toBeUndefined();

                deferredRun.resolve({ query: '', result: expectedSelectResult, durationMs: 1 });
                await fixture.whenStable();

                expectToEqual(component.queryResult(), expectedSelectResult);
            });

            it('... should hold undefined without running unsupported queries', async () => {
                component.query.set({ ...component.query(), queryString: 'WHERE { ?s ?p ?o }' });
                component.performQuery();
                await fixture.whenStable();

                expectSpyCall(serviceRunSpy, 1);
                expect(component.queryResult()).toBeUndefined();
                expectToBe(component.queryTime(), 0);
            });
        });

        describe('... on input change', () => {
            let changedGraphRDFData: GraphRDFData;

            beforeEach(async () => {
                // Edit triples and query locally
                component.triples.set(expectedChangedTriples);
                component.query.set({ ...expectedGraphRDFData.queryList[2] });
                await detectChangesOnPush(fixture);

                changedGraphRDFData = {
                    queryList: [expectedGraphRDFData.queryList[1]],
                    triples: '@prefix example: <https://example.com/onto#> .\n\n example:A example:b example:C .',
                };
                fixture.componentRef.setInput('graphRDFInputData', changedGraphRDFData);
                await detectChangesOnPush(fixture);
            });

            it('... should have linked signal `triples` to hold the changed triples', () => {
                expectToBe(component.triples(), changedGraphRDFData.triples);
            });

            it('... should have linked signal `query` to hold the changed initial query', () => {
                expectToEqual(component.query(), changedGraphRDFData.queryList[0]);
            });

            it('... should have resource `queryRun` to hold the run of the changed initial query', () => {
                expectSpyCall(serviceRunSpy, 2, [
                    changedGraphRDFData.queryList[0].queryString,
                    changedGraphRDFData.triples,
                ]);
            });
        });

        it('... should not run a query on local edits of `triples` or `query`', async () => {
            component.triples.set(expectedChangedTriples);
            component.query.set({ ...expectedGraphRDFData.queryList[2] });
            await detectChangesOnPush(fixture);

            expectSpyCall(serviceRunSpy, 1);
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

                it('... should contain one GraphEditorTriplesComponent (hollow) in first inner sub div', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer > div > div.row > div',
                        2,
                        2
                    );

                    getAndExpectDebugElementByDirective(divDes[0], GraphEditorTriplesComponent, 1, 1);
                });

                it('... should contain one GraphEditorSparqlComponent (hollow) in second inner sub div', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer > div > div.row > div',
                        2,
                        2
                    );

                    getAndExpectDebugElementByDirective(divDes[1], GraphEditorSparqlComponent, 1, 1);
                });

                it('... should contain one GraphResultsConstructComponent (hollow) in second child div (queryType === construct)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], GraphResultsConstructComponent, 1, 1);
                });

                it('... should contain one GraphResultsSelectComponent (hollow) in second child div (queryType === select)', async () => {
                    await setQueryType('select');

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], GraphResultsSelectComponent, 1, 1);
                });

                it('... should contain one GraphResultsUnsupportedComponent (hollow) in second child div (queryType === other)', async () => {
                    await setQueryType('ask');

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], GraphResultsUnsupportedComponent, 1, 1);
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(async () => {
                    fixture.componentRef.setInput('isFullscreenMode', true);
                    await detectChangesOnPush(fixture);
                });

                it('... should contain a main div with 2 child divs', () => {
                    const rowDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer', 1, 1);
                    getAndExpectDebugElementByCss(rowDes[0], 'div.awg-graph-visualizer > div', 2, 2);
                });

                it('... should contain one GraphEditorTriplesComponent (hollow) in first inner sub div', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer > div > div > div',
                        2,
                        2
                    );

                    getAndExpectDebugElementByDirective(divDes[0], GraphEditorTriplesComponent, 1, 1);
                });

                it('... should contain one GraphEditorSparqlComponent (hollow) in second inner sub div', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer > div > div > div',
                        2,
                        2
                    );

                    getAndExpectDebugElementByDirective(divDes[1], GraphEditorSparqlComponent, 1, 1);
                });

                it('... should contain one GraphResultsConstructComponent (hollow) in second child div (queryType === construct)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], GraphResultsConstructComponent, 1, 1);
                });

                it('... should contain one GraphResultsSelectComponent (hollow) in second child div (queryType === select)', async () => {
                    await setQueryType('select');

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], GraphResultsSelectComponent, 1, 1);
                });

                it('... should contain one GraphResultsUnsupportedComponent (hollow) in second child div (queryType === other)', async () => {
                    await setQueryType('ask');

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-visualizer > div', 2, 2);

                    getAndExpectDebugElementByDirective(divDes[1], GraphResultsUnsupportedComponent, 1, 1);
                });

                it('... should pass down a force graph height of 1000 to GraphResultsConstructComponent (hollow)', () => {
                    expectToBe(getChildCmp(GraphResultsConstructComponent).defaultForceGraphHeight(), 1000);
                });

                it('... should pass down `isFullscreenMode` to all children (hollow)', () => {
                    expectToBe(getChildCmp(GraphEditorTriplesComponent).isFullscreenMode(), true);
                    expectToBe(getChildCmp(GraphEditorSparqlComponent).isFullscreenMode(), true);
                    expectToBe(getChildCmp(GraphResultsConstructComponent).isFullscreenMode(), true);
                });
            });

            describe('GraphEditorTriplesComponent (hollow)', () => {
                it('... should have `triples` passed down from main component', () => {
                    expectToBe(getChildCmp(GraphEditorTriplesComponent).triples(), expectedGraphRDFData.triples);
                });

                it('... should have `isFullscreenMode` passed down from main component', () => {
                    expectToBe(getChildCmp(GraphEditorTriplesComponent).isFullscreenMode(), false);
                });

                it('... should have linked signal `triples` to hold the two-way bound triples', () => {
                    getChildCmp(GraphEditorTriplesComponent).triples.set(expectedChangedTriples);

                    expectToBe(component.triples(), expectedChangedTriples);
                });

                it('... should trigger `resetTriples()` on resetTriplesRequest event', () => {
                    getChildCmp(GraphEditorTriplesComponent).resetTriplesRequest.emit();

                    expectSpyCall(resetTriplesSpy, 1);
                });

                it('... should trigger `performQuery()` on performQueryRequest event', () => {
                    getChildCmp(GraphEditorTriplesComponent).performQueryRequest.emit();

                    expectSpyCall(performQuerySpy, 1);
                });

                it('... should trigger `showToastMessage()` on errorMessageRequest event', () => {
                    consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                    const toastMessage = new ToastMessage('Test', 'test message');

                    getChildCmp(GraphEditorTriplesComponent).errorMessageRequest.emit(toastMessage);

                    expectSpyCall(showToastMessageSpy, 1, [toastMessage, 'error']);
                });
            });

            describe('GraphEditorSparqlComponent (hollow)', () => {
                it('... should have `queryList` and `query` passed down from main component', () => {
                    const editorCmp = getChildCmp(GraphEditorSparqlComponent);

                    expectToEqual(editorCmp.queryList(), expectedGraphRDFData.queryList);
                    expectToEqual(editorCmp.query(), expectedGraphRDFData.queryList[0]);
                });

                it('... should have `isFullscreenMode` passed down from main component', () => {
                    expectToBe(getChildCmp(GraphEditorSparqlComponent).isFullscreenMode(), false);
                });

                it('... should have linked signal `query` to hold the two-way bound query', () => {
                    const changedQuery: GraphSparqlQuery = {
                        ...expectedGraphRDFData.queryList[0],
                        queryString:
                            'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test3 ?has ?success3 . }',
                    };
                    getChildCmp(GraphEditorSparqlComponent).query.set(changedQuery);

                    expectToEqual(component.query(), changedQuery);
                });

                it('... should trigger `resetQuery()` on resetQueryRequest event', () => {
                    getChildCmp(GraphEditorSparqlComponent).resetQueryRequest.emit(expectedGraphRDFData.queryList[1]);

                    expectSpyCall(resetQuerySpy, 1, expectedGraphRDFData.queryList[1]);
                });

                it('... should trigger `performQuery()` on performQueryRequest event', () => {
                    getChildCmp(GraphEditorSparqlComponent).performQueryRequest.emit();

                    expectSpyCall(performQuerySpy, 1);
                });

                it('... should trigger `showToastMessage()` on errorMessageRequest event', () => {
                    consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                    const toastMessage = new ToastMessage('Test', 'test message');

                    getChildCmp(GraphEditorSparqlComponent).errorMessageRequest.emit(toastMessage);

                    expectSpyCall(showToastMessageSpy, 1, [toastMessage, 'error']);
                });
            });

            describe('GraphResultsConstructComponent (hollow)', () => {
                it('... should have `queryResult` passed down from main component', () => {
                    expectToEqual(getChildCmp(GraphResultsConstructComponent).queryResult(), expectedConstructResult);
                });

                it('... should have `defaultForceGraphHeight` passed down from main component', () => {
                    expectToBe(getChildCmp(GraphResultsConstructComponent).defaultForceGraphHeight(), 500);
                });

                it('... should have `isFullscreenMode` passed down from main component', () => {
                    expectToBe(getChildCmp(GraphResultsConstructComponent).isFullscreenMode(), false);
                });

                it('... should trigger `onGraphNodeClick()` on clickedNodeRequest event', () => {
                    consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);
                    const onGraphNodeClickSpy = vi.spyOn(component, 'onGraphNodeClick');

                    getChildCmp(GraphResultsConstructComponent).clickedNodeRequest.emit(expectedNode);

                    expectSpyCall(onGraphNodeClickSpy, 1, expectedNode);
                });
            });

            describe('GraphResultsSelectComponent (hollow)', () => {
                beforeEach(async () => {
                    // Perform select query
                    component.query.set({ ...expectedGraphRDFData.queryList[2] });
                    component.performQuery();
                    await fixture.whenStable();
                });

                it('... should have `queryResult` passed down from main component', () => {
                    expectToEqual(getChildCmp(GraphResultsSelectComponent).queryResult(), expectedSelectResult);
                });

                it('... should have `queryTime` passed down from main component', () => {
                    expectToBe(getChildCmp(GraphResultsSelectComponent).queryTime(), expectedDurationMs);
                });

                it('... should have `isFullscreenMode` passed down from main component', () => {
                    expectToBe(getChildCmp(GraphResultsSelectComponent).isFullscreenMode(), false);
                });

                it('... should trigger `onTableNodeClick()` on clickedTableRequest event', () => {
                    consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);
                    const expectedUri = 'example:Test';

                    getChildCmp(GraphResultsSelectComponent).clickedTableRequest.emit(expectedUri);

                    expectSpyCall(onTableNodeClickSpy, 1, expectedUri);
                });
            });

            describe('GraphResultsUnsupportedComponent (hollow)', () => {
                beforeEach(async () => {
                    await setQueryType('ask');
                });

                it('... should have `queryType` passed down from main component', () => {
                    expectToBe(getChildCmp(GraphResultsUnsupportedComponent).queryType(), 'ask');
                });

                it('... should pass down an empty string if queryType is missing', async () => {
                    await setQueryType(null);

                    expectToBe(getChildCmp(GraphResultsUnsupportedComponent).queryType(), '');
                });

                it('... should have `isFullscreenMode` passed down from main component', () => {
                    expectToBe(getChildCmp(GraphResultsUnsupportedComponent).isFullscreenMode(), false);
                });
            });
        });

        describe('METHODS', () => {
            describe('#resetTriples()', () => {
                it('... should have a method `resetTriples`', () => {
                    expect(component.resetTriples).toBeDefined();
                });

                it('... should have linked signal `triples` to hold the initial triples after reset', () => {
                    component.triples.set(expectedChangedTriples);

                    component.resetTriples();

                    expectToBe(component.triples(), expectedGraphRDFData.triples);
                });

                it('... should do nothing if no triples are provided from RDF data', async () => {
                    fixture.componentRef.setInput('graphRDFInputData', { ...expectedGraphRDFData, triples: '' });
                    await detectChangesOnPush(fixture);
                    component.triples.set(expectedChangedTriples);

                    component.resetTriples();

                    expectToBe(component.triples(), expectedChangedTriples);
                });
            });

            describe('#resetQuery()', () => {
                it('... should have a method `resetQuery`', () => {
                    expect(component.resetQuery).toBeDefined();
                });

                it('... should find and reset a query from queryList if queryLabel and queryType are known', () => {
                    const changedQuery = { ...expectedGraphRDFData.queryList[1], queryString: 'CONSTRUCT {}' };

                    component.resetQuery(changedQuery);

                    expectToEqual(component.query(), expectedGraphRDFData.queryList[1]);
                });

                describe('... should set query as is, and not find from queryList, if', () => {
                    it('... only queryLabel is known but not queryType', () => {
                        const changedQuery: GraphSparqlQuery = {
                            ...expectedGraphRDFData.queryList[1],
                            queryType: 'select',
                            queryString: expectedGraphRDFData.queryList[2].queryString,
                        };

                        component.resetQuery(changedQuery);

                        expectToEqual(component.query(), changedQuery);
                    });

                    it('... only queryType is known but not queryLabel', () => {
                        const changedQuery: GraphSparqlQuery = {
                            ...expectedGraphRDFData.queryList[1],
                            queryLabel: 'select all tests',
                        };

                        component.resetQuery(changedQuery);

                        expectToEqual(component.query(), changedQuery);
                    });

                    it('... given query is not in queryList', () => {
                        const changedQuery: GraphSparqlQuery = {
                            queryType: 'select',
                            queryLabel: 'Test Query 4',
                            queryString:
                                'PREFIX example: <https://example.com/onto#> \n\n SELECT * WHERE { ?test4 ?has ?success4 . }',
                        };

                        component.resetQuery(changedQuery);

                        expectToEqual(component.query(), changedQuery);
                    });
                });

                it('... should set initial query (queryList[0]) if no query is provided', () => {
                    component.query.set({ ...expectedGraphRDFData.queryList[1] });

                    component.resetQuery();

                    expectToEqual(component.query(), expectedGraphRDFData.queryList[0]);
                });

                it('... should set a copy of the query from queryList', () => {
                    component.resetQuery(expectedGraphRDFData.queryList[1]);

                    expect(component.query()).not.toBe(expectedGraphRDFData.queryList[1]);
                });

                it('... should trigger `performQuery()`', () => {
                    component.resetQuery(expectedGraphRDFData.queryList[1]);

                    expectSpyCall(performQuerySpy, 1);
                });

                it('... should do nothing if no queryList is provided from RDF data', async () => {
                    fixture.componentRef.setInput('graphRDFInputData', { ...expectedGraphRDFData, queryList: [] });
                    await detectChangesOnPush(fixture);
                    const query = component.query();

                    component.resetQuery(expectedGraphRDFData.queryList[1]);

                    expectToBe(component.query(), query);
                    expectSpyCall(performQuerySpy, 0);
                });
            });

            describe('#performQuery()', () => {
                it('... should have a method `performQuery`', () => {
                    expect(component.performQuery).toBeDefined();
                });

                it('... should have linked signal `query` to hold a new query with the query type from the query string', () => {
                    const previousQuery: GraphSparqlQuery = {
                        ...expectedGraphRDFData.queryList[0],
                        queryString: expectedGraphRDFData.queryList[2].queryString,
                    };
                    component.query.set(previousQuery);

                    component.performQuery();

                    expectToBe(component.query().queryType, 'select');
                    expect(component.query()).not.toBe(previousQuery);
                    expectToBe(previousQuery.queryType, 'construct');
                });

                it('... should run the current query against the current triples', async () => {
                    component.triples.set(expectedChangedTriples);
                    component.query.set({ ...expectedGraphRDFData.queryList[2] });

                    component.performQuery();
                    await fixture.whenStable();

                    expectSpyCall(serviceRunSpy, 2, [
                        expectedGraphRDFData.queryList[2].queryString,
                        expectedChangedTriples,
                    ]);
                    expectToEqual(component.queryResult(), expectedSelectResult);
                });

                it('... should run an unchanged query again', async () => {
                    component.performQuery();
                    await fixture.whenStable();

                    expectSpyCall(serviceRunSpy, 2, [
                        expectedGraphRDFData.queryList[0].queryString,
                        expectedGraphRDFData.triples,
                    ]);
                });

                it('... should not run update queries', async () => {
                    component.query.set({
                        ...component.query(),
                        queryString: `PREFIX example: <${EXAMPLE}>\nINSERT DATA { example:a example:b example:c }`,
                    });

                    component.performQuery();
                    await fixture.whenStable();

                    expectToBe(component.query().queryType, 'update');
                    expectSpyCall(serviceRunSpy, 1);
                });

                it('... should not run queries of unknown type', async () => {
                    component.query.set({ ...component.query(), queryString: 'WHERE { ?s ?p ?o }' });

                    component.performQuery();
                    await fixture.whenStable();

                    expectToBe(component.query().queryType, null);
                    expectSpyCall(serviceRunSpy, 1);
                });
            });

            describe('#showToastMessage()', () => {
                beforeEach(() => {
                    consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                });

                it('... should have a method `showToastMessage`', () => {
                    expect(component.showToastMessage).toBeDefined();
                });

                it('... should do nothing if no toastMessage.message is provided', () => {
                    const toastMessage = new ToastMessage('Error1', '', 500);

                    component.showToastMessage(toastMessage, 'error');

                    expectSpyCall(toastServiceAddSpy, 0);
                    expectSpyCall(consoleSpy, 0);
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

                        component.showToastMessage(toastMessage, 'error');

                        expectSpyCall(consoleSpy, 1, [toastMessage.name, ':', toastMessage.message]);
                    });

                    it('... should trigger toast service and add an error toast message', () => {
                        const toastMessage = new ToastMessage('Error1', 'error message', 500);
                        const expectedToast = new Toast(toastMessage.message, {
                            header: toastMessage.name,
                            classname: 'bg-danger text-light',
                            delay: toastMessage.duration,
                        });

                        component.showToastMessage(toastMessage, 'error');

                        expectSpyCall(toastServiceAddSpy, 1, expectedToast);
                        expectToEqual(toastService.toasts(), [expectedToast]);
                    });

                    it('... should set a duration of 3000 for the error toast message if delay is not given', () => {
                        const toastMessage = new ToastMessage('Error1', 'error message');
                        const expectedToast = new Toast(toastMessage.message, {
                            header: toastMessage.name,
                            classname: 'bg-danger text-light',
                            delay: 3000,
                        });

                        component.showToastMessage(toastMessage, 'error');

                        expectSpyCall(toastServiceAddSpy, 1, expectedToast);
                        expectToEqual(toastService.toasts(), [expectedToast]);
                    });
                });

                describe('... on info message', () => {
                    beforeEach(() => {
                        consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);
                    });

                    it('... should log the provided name and info message to console', () => {
                        const toastMessage = new ToastMessage('Info1', 'info message', 500);

                        component.showToastMessage(toastMessage, 'info');

                        expectSpyCall(consoleSpy, 1, [toastMessage.name, ':', toastMessage.message]);
                    });

                    it('... should trigger toast service and add an info toast message', () => {
                        const toastMessage = new ToastMessage('Info1', 'info message', 500);
                        const expectedToast = new Toast(toastMessage.message, {
                            header: toastMessage.name,
                            classname: 'bg-info text-light',
                            delay: toastMessage.duration,
                        });

                        component.showToastMessage(toastMessage, 'info');

                        expectSpyCall(toastServiceAddSpy, 1, expectedToast);
                        expectToEqual(toastService.toasts(), [expectedToast]);
                    });

                    it('... should set a duration of 3000 for the info toast message if delay is not given', () => {
                        const toastMessage = new ToastMessage('Info1', 'info message');
                        const expectedToast = new Toast(toastMessage.message, {
                            header: toastMessage.name,
                            classname: 'bg-info text-light',
                            delay: 3000,
                        });

                        component.showToastMessage(toastMessage, 'info');

                        expectSpyCall(toastServiceAddSpy, 1, expectedToast);
                        expectToEqual(toastService.toasts(), [expectedToast]);
                    });
                });
            });

            describe('#onGraphNodeClick()', () => {
                beforeEach(() => {
                    consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);
                });

                it('... should have a method `onGraphNodeClick`', () => {
                    expect(component.onGraphNodeClick).toBeDefined();
                });

                it('... should do nothing if no node is provided', () => {
                    component.onGraphNodeClick(undefined as unknown as GraphNode);

                    expectSpyCall(showToastMessageSpy, 0);
                });

                it('... should show the provided node in a ToastMessage', () => {
                    const expectedMessage = `GraphVisualizerComponent# graphClick on node ${expectedNode.shortName}\n\n Label: ${expectedNode.label}`;
                    const toastMessage = new ToastMessage(expectedNode.shortName, expectedMessage, 5000);
                    const expectedToast = new Toast(toastMessage.message, {
                        header: toastMessage.name,
                        classname: 'bg-info text-light',
                        delay: toastMessage.duration,
                    });

                    component.onGraphNodeClick(expectedNode);

                    expectSpyCall(showToastMessageSpy, 1, [toastMessage, 'info']);
                    expectSpyCall(toastServiceAddSpy, 1, expectedToast);
                    expectSpyCall(consoleSpy, 1, [expectedNode.shortName, ':', expectedMessage]);
                });
            });

            describe('#onTableNodeClick()', () => {
                beforeEach(() => {
                    consoleSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);
                });

                it('... should have a method `onTableNodeClick`', () => {
                    expect(component.onTableNodeClick).toBeDefined();
                });

                it('... should do nothing if no URI is provided', () => {
                    component.onTableNodeClick('');

                    expectSpyCall(consoleSpy, 0);
                    expectSpyCall(performQuerySpy, 0);
                });

                it('... should log the provided URI to console', () => {
                    const expectedUri = 'example:Test';

                    component.onTableNodeClick(expectedUri);

                    expectSpyCall(consoleSpy, 1, ['GraphVisualizerComponent# tableClick on URI', expectedUri]);
                });
            });

            describe('#_runQuery()', () => {
                let expectedRequest: SparqlQueryRequest;

                beforeEach(() => {
                    expectedRequest = {
                        queryType: 'construct',
                        queryString: expectedGraphRDFData.queryList[0].queryString,
                        triples: expectedGraphRDFData.triples,
                    };
                });

                it('... should have a method `_runQuery`', () => {
                    expect(component['_runQuery']).toBeDefined();
                });

                it('... should be triggered by resource `queryRun` with the requested query', () => {
                    expectSpyCall(runQuerySpy, 1);
                    expectToEqual(runQuerySpy.mock.calls[0][0], expectedRequest);
                    expect(runQuerySpy.mock.calls[0][1]).toBeInstanceOf(AbortSignal);
                });

                it('... should trigger `sparqlQueryService.run` with the query string and the triples', async () => {
                    serviceRunSpy.mockClear();

                    await component['_runQuery'](expectedRequest, new AbortController().signal);

                    expectSpyCall(serviceRunSpy, 1, [expectedRequest.queryString, expectedRequest.triples]);
                });

                it('... should hold the run of the query service on success', async () => {
                    const run = await component['_runQuery'](expectedRequest, new AbortController().signal);

                    expectToEqual(run, {
                        query: expectedRequest.queryString,
                        result: expectedConstructResult,
                        durationMs: expectedDurationMs,
                    });
                });

                it('... should set the performed query (completed with prefixes) on success', async () => {
                    const performedQuery = `PREFIX rdf: <${DEFAULT_PREFIXES['rdf']}>\n${expectedRequest.queryString}`;
                    serviceRunSpy.mockResolvedValueOnce({
                        query: performedQuery,
                        result: expectedConstructResult,
                        durationMs: 7,
                    });

                    await component['_runQuery'](expectedRequest, new AbortController().signal);

                    expectToBe(component.query().queryString, performedQuery);
                });

                it('... should not set the performed query if the run has been aborted', async () => {
                    const abortController = new AbortController();
                    const deferredRun = createDeferredRun();
                    serviceRunSpy.mockReturnValueOnce(deferredRun.promise);
                    const query = component.query();

                    const pendingRun = component['_runQuery'](expectedRequest, abortController.signal);
                    abortController.abort();
                    deferredRun.resolve({ query: 'PREFIX stale', result: expectedConstructResult, durationMs: 1 });
                    await pendingRun;

                    expectToBe(component.query(), query);
                });

                it('... should not set the performed query of a stale run in the editor', async () => {
                    const deferredRun = createDeferredRun();
                    serviceRunSpy.mockReturnValueOnce(deferredRun.promise);

                    // Start a run that is outdated by the next query request
                    component.performQuery();
                    TestBed.tick();
                    component.query.set({ ...expectedGraphRDFData.queryList[2] });
                    component.performQuery();
                    await fixture.whenStable();

                    deferredRun.resolve({ query: 'PREFIX stale', result: expectedConstructResult, durationMs: 1 });
                    await fixture.whenStable();

                    expectToBe(component.query().queryString, expectedGraphRDFData.queryList[2].queryString);
                    expectToEqual(component.queryResult(), expectedSelectResult);
                });

                describe('... on error', () => {
                    beforeEach(() => {
                        consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                    });

                    it('... should hold a run with an empty result of the query type', async () => {
                        serviceRunSpy.mockRejectedValue({ status: 404, statusText: 'error' });

                        const run = await component['_runQuery'](expectedRequest, new AbortController().signal);

                        expectToBe(run.query, expectedRequest.queryString);
                        expectToEqual(run.result, { kind: 'construct', quads: [], prefixes: DEFAULT_PREFIXES });
                        expectToBe(typeof run.durationMs, 'number');
                    });

                    it('... should keep the query unchanged', async () => {
                        serviceRunSpy.mockRejectedValue(new Error('error'));
                        const query = component.query();

                        await component['_runQuery'](expectedRequest, new AbortController().signal);

                        expectToBe(component.query(), query);
                    });

                    it('... should log an error', async () => {
                        const expectedError = { status: 404, statusText: 'error' };
                        serviceRunSpy.mockRejectedValue(expectedError);

                        await component['_runQuery'](expectedRequest, new AbortController().signal);

                        expectSpyCall(consoleSpy, 2);
                        expectToEqual(consoleSpy.mock.calls[0], ['#runQuery got error:', expectedError]);
                        // Error logged by `showToastMessage` method
                        expectToEqual(consoleSpy.mock.calls[1], ['Query Error', ':', expectedError.statusText]);
                    });

                    it('... should delegate error parsing to _getErrorMessage and trigger showToastMessage', async () => {
                        const error = new Error('some error');
                        const expectedParsedMessage = 'Parsed Error Message Via Helper';
                        const getErrorMessageSpy = vi
                            .spyOn(component, '_getErrorMessage' as any)
                            .mockReturnValue(expectedParsedMessage);
                        serviceRunSpy.mockRejectedValue(error);

                        await component['_runQuery'](expectedRequest, new AbortController().signal);

                        expectSpyCall(getErrorMessageSpy, 1, error);
                        expectSpyCall(showToastMessageSpy, 1, [
                            new ToastMessage('Error', expectedParsedMessage, 5000),
                            'error',
                        ]);
                    });

                    it('... should trigger a special toast message if the error message contains `undefined`', async () => {
                        const specialError = new Error('The query returned an undefined result.');
                        specialError.name = 'Query Error';
                        serviceRunSpy.mockRejectedValue(specialError);

                        await component['_runQuery'](expectedRequest, new AbortController().signal);

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

                    it('... should have computed signal `queryResult` to hold the empty result', async () => {
                        serviceRunSpy.mockRejectedValue(new Error('error'));

                        component.performQuery();
                        await fixture.whenStable();

                        expectToEqual(component.queryResult(), {
                            kind: 'construct',
                            quads: [],
                            prefixes: DEFAULT_PREFIXES,
                        });
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

            describe('#_initialQuery()', () => {
                it('... should have a method `_initialQuery`', () => {
                    expect(component['_initialQuery']).toBeDefined();
                });

                it('... should hold the first query of the given query list with its derived query type', () => {
                    const queryList: GraphSparqlQuery[] = [
                        { ...expectedGraphRDFData.queryList[2], queryType: null },
                        expectedGraphRDFData.queryList[0],
                    ];

                    expectToEqual(component['_initialQuery'](queryList), expectedGraphRDFData.queryList[2]);
                });

                it('... should hold an empty query for an empty query list', () => {
                    expectToEqual(component['_initialQuery']([]), new GraphSparqlQuery());
                });
            });

            describe('#_toQueryRequest()', () => {
                it('... should have a method `_toQueryRequest`', () => {
                    expect(component['_toQueryRequest']).toBeDefined();
                });

                it('... should hold the query request of the given query and triples', () => {
                    const query = expectedGraphRDFData.queryList[2];

                    expectToEqual(component['_toQueryRequest'](query, expectedChangedTriples), {
                        queryType: query.queryType,
                        queryString: query.queryString,
                        triples: expectedChangedTriples,
                    });
                });
            });

            describe('#_withQueryType()', () => {
                it('... should have a method `_withQueryType`', () => {
                    expect(component['_withQueryType']).toBeDefined();
                });

                it('... should hold a copy of the given query with the query type from its query string', () => {
                    const query: GraphSparqlQuery = { ...expectedGraphRDFData.queryList[2], queryType: 'construct' };

                    const queryWithType = component['_withQueryType'](query);

                    expectToEqual(queryWithType, { ...query, queryType: 'select' });
                    expect(queryWithType).not.toBe(query);
                    expectToBe(query.queryType, 'construct');
                });
            });
        });
    });
});
