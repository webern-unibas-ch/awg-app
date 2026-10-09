import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import { faDiagramProject, faTable } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordionItem } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { CodeMirrorComponent } from '@awg-shared/codemirror/codemirror.component';
import { ToastMessage } from '@awg-shared/toast/toast.service';
import { ViewHandleButtonGroupComponent } from '@awg-shared/view-handle-button-group/view-handle-button-group.component';
import { ViewHandle, ViewHandleTypes } from '@awg-shared/view-handle-button-group/view-handle.model';

import { GraphQuery } from '@awg-views/edition-view/models/graph.model';

import { GRAPH_QUERY_UTILS } from '@awg-graph/graph-visualizer/utils/graph-query.utils';

import { GraphEditorActionButtonsComponent } from '../action-buttons/graph-editor-action-buttons.component';
import { ExampleQueriesComponent } from './example-queries/example-queries.component';
import { GraphEditorSparqlComponent } from './graph-editor-sparql.component';

describe('GraphEditorSparqlComponent (DONE)', () => {
    let component: GraphEditorSparqlComponent;
    let fixture: ComponentFixture<GraphEditorSparqlComponent>;
    let compDe: DebugElement;

    let expectedConstructQuery1: GraphQuery;
    let expectedConstructQuery2: GraphQuery;
    let expectedSelectQuery1: GraphQuery;
    let expectedQueryList: GraphQuery[];
    let expectedIsFullscreen: boolean;
    let expectedViewHandles: ViewHandle[];

    let clearQuerySpy: Spy;
    let onQueryStringChangeSpy: Spy;
    let onViewChangeSpy: Spy;
    let performQuerySpy: Spy;
    let resetQuerySpy: Spy;
    let switchQueryTypeSpy: Spy;
    let emitErrorMessageRequestSpy: Spy;
    let emitPerformQueryRequestSpy: Spy;
    let emitResetQueryRequestSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GraphEditorSparqlComponent],
        })
            .overrideComponent(CodeMirrorComponent, {
                set: { template: '<div #codemirrorhost></div>', imports: [] },
            })
            .overrideComponent(GraphEditorActionButtonsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(ExampleQueriesComponent, { set: { template: '', imports: [] } })
            .overrideComponent(ViewHandleButtonGroupComponent, { set: { template: '', imports: [] } })
            .compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GraphEditorSparqlComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedIsFullscreen = false;

        expectedConstructQuery1 = {
            queryType: 'construct',
            queryLabel: 'Test Query 1',
            queryString: 'CONSTRUCT\nWHERE { ?test ?has ?success }',
        };
        expectedConstructQuery2 = {
            queryType: 'construct',
            queryLabel: 'Test Query 2',
            queryString: 'CONSTRUCT\nWHERE { ?success a ?test }',
        };
        expectedSelectQuery1 = {
            queryType: 'select',
            queryLabel: 'Test Query 3',
            queryString: 'SELECT ?test ?success\nWHERE { ?test ?has ?success }',
        };
        expectedQueryList = [expectedConstructQuery1, expectedConstructQuery2, expectedSelectQuery1];

        expectedViewHandles = [
            new ViewHandle('Graph view', ViewHandleTypes.GRAPH, faDiagramProject),
            new ViewHandle('Table view', ViewHandleTypes.TABLE, faTable),
        ];

        // Spies
        clearQuerySpy = vi.spyOn(component, 'clearQuery');
        onQueryStringChangeSpy = vi.spyOn(component, 'onQueryStringChange');
        onViewChangeSpy = vi.spyOn(component, 'onViewChange');
        performQuerySpy = vi.spyOn(component, 'performQuery');
        resetQuerySpy = vi.spyOn(component, 'resetQuery');
        switchQueryTypeSpy = vi.spyOn(GRAPH_QUERY_UTILS, 'switchQueryType');
        emitErrorMessageRequestSpy = vi.spyOn(component.errorMessageRequest, 'emit');
        emitPerformQueryRequestSpy = vi.spyOn(component.performQueryRequest, 'emit');
        emitResetQueryRequestSpy = vi.spyOn(component.resetQueryRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `queryList` to hold an empty list initially', () => {
            expectToBe(isSignal(component.queryList), true);
            expectToEqual(component.queryList(), []);
        });

        it('... should have model signal `query` to hold an empty query initially', () => {
            expectToBe(isSignal(component.query), true);
            expectToEqual(component.query(), new GraphQuery());
        });

        it('... should have input signal `isFullscreenMode` to hold false initially', () => {
            expectToBe(isSignal(component.isFullscreenMode), true);
            expectToBe(component.isFullscreenMode(), false);
        });

        it('... should have `cmSparqlMode` to hold the sparql mode', () => {
            expectToEqual(component.cmSparqlMode, sparql);
        });

        it('... should have `viewHandles` to hold the graph and table view handles', () => {
            expectToEqual(component.viewHandles, expectedViewHandles);
        });

        it('... should have computed signal `selectedViewType` to hold the graph view initially', () => {
            expectToBe(component.selectedViewType(), ViewHandleTypes.GRAPH);
        });

        it('... should have computed signal `isExampleQueriesEnabled` to hold false initially', () => {
            expectToBe(component.isExampleQueriesEnabled(), false);
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain one div.accordion-item with header and non-collapsible body yet in div.accordion', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                const itemDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);
                getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-header', 1, 1);

                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1);
                const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'accordion-collapse');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('queryList', expectedQueryList);
            fixture.componentRef.setInput('query', expectedConstructQuery1);
            fixture.componentRef.setInput('isFullscreenMode', expectedIsFullscreen);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `queryList` to hold the provided query list', () => {
            expectToEqual(component.queryList(), expectedQueryList);
        });

        it('... should have model signal `query` to hold the provided query', () => {
            expectToEqual(component.query(), expectedConstructQuery1);
        });

        it('... should have input signal `isFullscreenMode` to hold the provided fullscreen flag', () => {
            expectToBe(component.isFullscreenMode(), expectedIsFullscreen);
        });

        describe('... computed signal `selectedViewType`', () => {
            it('... should hold the graph view for a construct query', () => {
                expectToBe(component.selectedViewType(), ViewHandleTypes.GRAPH);
            });

            it('... should hold the table view for a select query', () => {
                fixture.componentRef.setInput('query', expectedSelectQuery1);

                expectToBe(component.selectedViewType(), ViewHandleTypes.TABLE);
            });
        });

        describe('... computed signal `isExampleQueriesEnabled`', () => {
            it('... should hold true if queryList is given and query has type, label and string', () => {
                expectToBe(component.isExampleQueriesEnabled(), true);
            });

            describe('... should hold false if', () => {
                it.each([
                    { desc: 'query.queryType is null', query: { queryType: null }, list: undefined },
                    { desc: 'query.queryLabel is an empty string', query: { queryLabel: '' }, list: undefined },
                    { desc: 'query.queryString is an empty string', query: { queryString: '' }, list: undefined },
                    { desc: 'queryList is empty', query: {}, list: [] },
                ])('... $desc', ({ query, list }) => {
                    fixture.componentRef.setInput('query', { ...expectedConstructQuery1, ...query });
                    if (list) {
                        fixture.componentRef.setInput('queryList', list);
                    }

                    expectToBe(component.isExampleQueriesEnabled(), false);
                });
            });
        });

        describe('VIEW', () => {
            describe('not in fullscreen mode', () => {
                describe('with closed item', () => {
                    it('... should contain one div.accordion-item with header and collapsed body in div.accordion', () => {
                        const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                        const itemDes = getAndExpectDebugElementByCss(
                            accordionDes[0],
                            'div#awg-graph-editor-sparql.accordion-item',
                            1,
                            1
                        );
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            itemDes[0],
                            'div#awg-graph-editor-sparql > div.accordion-header',
                            1,
                            1
                        );
                        const itemHeaderEl: HTMLDivElement = itemHeaderDes[0].nativeElement;

                        expectToContain(itemHeaderEl.classList, 'collapsed');

                        const itemBodyDes = getAndExpectDebugElementByCss(
                            itemDes[0],
                            'div#awg-graph-editor-sparql > div.accordion-collapse',
                            1,
                            1
                        );
                        const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                        expectToNotContain(itemBodyEl.classList, 'show');
                    });

                    it('... should display item header button', () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-editor-sparql > div.accordion-header > button#awg-graph-editor-sparql-toggle',
                            1,
                            1
                        );
                        const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                        expectToBe(btnEl.textContent, 'SPARQL');
                    });

                    it('... should have an enabled accordion item', () => {
                        const itemDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-editor-sparql.accordion-item',
                            1,
                            1
                        );

                        expectToBe(itemDes[0].injector.get(NgbAccordionItem).disabled, false);
                    });

                    it('... should have auto height on item body', () => {
                        const itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-editor-sparql > div.accordion-collapse',
                            1,
                            1
                        );
                        const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                        expectToBe(itemBodyEl.style.height, 'auto');
                    });

                    it('... should toggle item body on click', async () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'button#awg-graph-editor-sparql-toggle',
                            1,
                            1
                        );

                        // Item body is closed
                        let itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-editor-sparql > div.accordion-collapse',
                            1,
                            1
                        );
                        let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                        expectToNotContain(itemBodyEl.classList, 'show');

                        // Click header button
                        await clickAndAwaitChanges(btnDes[0], fixture);

                        // Item body is open
                        itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-editor-sparql > div.accordion-collapse',
                            1,
                            1
                        );
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToContain(itemBodyEl.classList, 'show');

                        // Click header button
                        await clickAndAwaitChanges(btnDes[0], fixture);

                        // Item body is closed again
                        itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-editor-sparql > div.accordion-collapse',
                            1,
                            1
                        );
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToNotContain(itemBodyEl.classList, 'show');
                    });

                    it('... should contain ViewHandleButtonGroupComponent (hollow) in item header', () => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-editor-sparql > div.accordion-header',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(itemHeaderDes[0], ViewHandleButtonGroupComponent, 1, 1);
                    });

                    it('... should pass down `viewHandles` and `selectedViewType` to ViewHandleButtonGroupComponent (hollow)', () => {
                        const viewHandleButtonGroupDes = getAndExpectDebugElementByDirective(
                            compDe,
                            ViewHandleButtonGroupComponent,
                            1,
                            1
                        );
                        const viewHandleButtonGroupCmp =
                            viewHandleButtonGroupDes[0].injector.get(ViewHandleButtonGroupComponent);

                        expectToEqual(viewHandleButtonGroupCmp.viewHandles(), expectedViewHandles);
                        expectToBe(viewHandleButtonGroupCmp.selectedViewType(), ViewHandleTypes.GRAPH);
                    });

                    it('... should pass down a changed `selectedViewType` to ViewHandleButtonGroupComponent (hollow)', async () => {
                        fixture.componentRef.setInput('query', expectedSelectQuery1);
                        await detectChangesOnPush(fixture);

                        const viewHandleButtonGroupDes = getAndExpectDebugElementByDirective(
                            compDe,
                            ViewHandleButtonGroupComponent,
                            1,
                            1
                        );
                        const viewHandleButtonGroupCmp =
                            viewHandleButtonGroupDes[0].injector.get(ViewHandleButtonGroupComponent);

                        expectToBe(viewHandleButtonGroupCmp.selectedViewType(), ViewHandleTypes.TABLE);
                    });

                    it('... should contain ExampleQueriesComponent (hollow) in item header if example queries are enabled', () => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-editor-sparql > div.accordion-header',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(itemHeaderDes[0], ExampleQueriesComponent, 1, 1);
                    });

                    it('... should not contain ExampleQueriesComponent (hollow) in item header if example queries are not enabled', async () => {
                        fixture.componentRef.setInput('queryList', []);
                        await detectChangesOnPush(fixture);

                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-editor-sparql > div.accordion-header',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(itemHeaderDes[0], ExampleQueriesComponent, 0, 0);
                    });

                    it('... should pass down `queryList` and `activeQuery` to ExampleQueriesComponent (hollow)', () => {
                        const exampleQueriesDes = getAndExpectDebugElementByDirective(
                            compDe,
                            ExampleQueriesComponent,
                            1,
                            1
                        );
                        const exampleQueriesCmp = exampleQueriesDes[0].injector.get(ExampleQueriesComponent);

                        expectToEqual(exampleQueriesCmp.queryList(), expectedQueryList);
                        expectToEqual(exampleQueriesCmp.activeQuery(), expectedConstructQuery1);
                    });
                });

                describe('with open item', () => {
                    let bodyDes: DebugElement[];

                    beforeEach(async () => {
                        // Open item by click on header button
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'button#awg-graph-editor-sparql-toggle',
                            1,
                            1
                        );

                        await clickAndAwaitChanges(btnDes[0], fixture);

                        bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-editor-sparql-collapse > div.accordion-body',
                            1,
                            1
                        );
                    });

                    it('... should contain CodeMirrorComponent (hollow) in item body', () => {
                        getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorComponent, 1, 1);
                    });

                    it('... should pass down `mode` and `content` to CodeMirrorComponent (hollow)', () => {
                        const codeMirrorDes = getAndExpectDebugElementByDirective(
                            bodyDes[0],
                            CodeMirrorComponent,
                            1,
                            1
                        );
                        const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorComponent);

                        expectToEqual(codeMirrorCmp.mode(), sparql);
                        expectToBe(codeMirrorCmp.content(), expectedConstructQuery1.queryString);
                    });

                    it('... should pass down the query string of a changed query to CodeMirrorComponent (hollow)', async () => {
                        const codeMirrorDes = getAndExpectDebugElementByDirective(
                            bodyDes[0],
                            CodeMirrorComponent,
                            1,
                            1
                        );
                        const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorComponent);

                        fixture.componentRef.setInput('query', expectedConstructQuery2);
                        await detectChangesOnPush(fixture);

                        expectToBe(codeMirrorCmp.content(), expectedConstructQuery2.queryString);
                    });

                    it('... should contain GraphEditorActionButtonsComponent (hollow) in item body', () => {
                        getAndExpectDebugElementByDirective(bodyDes[0], GraphEditorActionButtonsComponent, 1, 1);
                    });
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(async () => {
                    fixture.componentRef.setInput('isFullscreenMode', true);
                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-editor-sparql.accordion-item',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-editor-sparql > div.accordion-header',
                        1,
                        1
                    );

                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-editor-sparql > div.accordion-collapse',
                        1,
                        1
                    );
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should have a disabled accordion item', () => {
                    const itemDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-editor-sparql.accordion-item',
                        1,
                        1
                    );

                    expectToBe(itemDes[0].injector.get(NgbAccordionItem).disabled, true);
                });

                it('... should have 50vh height on item body', () => {
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-editor-sparql > div.accordion-collapse',
                        1,
                        1
                    );
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToBe(itemBodyEl.style.height, '50vh');
                });

                it('... should not toggle item body on click', async () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button#awg-graph-editor-sparql-toggle', 1, 1);

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-editor-sparql > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    // Click header button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item body does not close
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-editor-sparql > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should not contain ViewHandleButtonGroupComponent (hollow) in item header', () => {
                    getAndExpectDebugElementByDirective(compDe, ViewHandleButtonGroupComponent, 0, 0);
                });

                it('... should contain ExampleQueriesComponent (hollow) in item header', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-editor-sparql > div.accordion-header',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(itemHeaderDes[0], ExampleQueriesComponent, 1, 1);
                });

                it('... should contain CodeMirrorComponent (hollow) and GraphEditorActionButtonsComponent (hollow) in item body', () => {
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-editor-sparql-collapse > div.accordion-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorComponent, 1, 1);
                    getAndExpectDebugElementByDirective(bodyDes[0], GraphEditorActionButtonsComponent, 1, 1);
                });
            });
        });

        describe('METHODS', () => {
            describe('#clearQuery()', () => {
                beforeEach(async () => {
                    // Open item by click on header button
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button#awg-graph-editor-sparql-toggle', 1, 1);

                    await clickAndAwaitChanges(btnDes[0], fixture);
                });

                it('... should have a method `clearQuery`', () => {
                    expect(component.clearQuery).toBeDefined();
                });

                it('... should trigger on clearRequest event from GraphEditorActionButtonsComponent (hollow)', () => {
                    const actionButtonsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        GraphEditorActionButtonsComponent,
                        1,
                        1
                    );
                    const actionButtonsCmp = actionButtonsDes[0].injector.get(GraphEditorActionButtonsComponent);

                    actionButtonsCmp.clearRequest.emit();

                    expectSpyCall(clearQuerySpy, 1);
                });

                it('... should set the query string of `query` to an empty string', () => {
                    component.clearQuery();

                    expectSpyCall(onQueryStringChangeSpy, 1, '');
                    expectToEqual(component.query(), { ...expectedConstructQuery1, queryString: '' });
                });
            });

            describe('#onQueryStringChange()', () => {
                beforeEach(async () => {
                    // Open item by click on header button
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button#awg-graph-editor-sparql-toggle', 1, 1);

                    await clickAndAwaitChanges(btnDes[0], fixture);
                });

                it('... should have a method `onQueryStringChange`', () => {
                    expect(component.onQueryStringChange).toBeDefined();
                });

                it('... should trigger on content change of CodeMirrorComponent (hollow)', () => {
                    const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorComponent, 1, 1);
                    const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorComponent);

                    codeMirrorCmp.content.set(expectedConstructQuery2.queryString);

                    expectSpyCall(onQueryStringChangeSpy, 1, expectedConstructQuery2.queryString);
                });

                it('... should set `query` to a new query with the given query string', () => {
                    component.onQueryStringChange(expectedConstructQuery2.queryString);

                    expect(component.query()).not.toBe(expectedConstructQuery1);
                    expectToEqual(component.query(), {
                        ...expectedConstructQuery1,
                        queryString: expectedConstructQuery2.queryString,
                    });
                });

                it('... should not mutate the provided query', () => {
                    const originalQueryString = expectedConstructQuery1.queryString;

                    component.onQueryStringChange(expectedConstructQuery2.queryString);

                    expectToBe(expectedConstructQuery1.queryString, originalQueryString);
                });
            });

            describe('#onViewChange()', () => {
                it('... should have a method `onViewChange`', () => {
                    expect(component.onViewChange).toBeDefined();
                });

                it('... should trigger on viewChangeRequest event from ViewHandleButtonGroupComponent (hollow)', () => {
                    const viewHandleButtonGroupDes = getAndExpectDebugElementByDirective(
                        compDe,
                        ViewHandleButtonGroupComponent,
                        1,
                        1
                    );
                    const viewHandleButtonGroupCmp =
                        viewHandleButtonGroupDes[0].injector.get(ViewHandleButtonGroupComponent);

                    viewHandleButtonGroupCmp.viewChangeRequest.emit(ViewHandleTypes.TABLE);

                    expectSpyCall(onViewChangeSpy, 1, ViewHandleTypes.TABLE);
                });

                it('... should set `query` to the query switched by `GRAPH_QUERY_UTILS.switchQueryType` and trigger `performQuery()`', () => {
                    component.onViewChange(ViewHandleTypes.TABLE);

                    expectSpyCall(switchQueryTypeSpy, 1, [expectedConstructQuery1, ViewHandleTypes.TABLE]);
                    expectToEqual(component.query(), {
                        ...expectedConstructQuery1,
                        queryType: 'select',
                        queryString: 'SELECT *\nWHERE { ?test ?has ?success }',
                    });
                    expectSpyCall(performQuerySpy, 1);
                });
            });

            describe('#performQuery()', () => {
                beforeEach(async () => {
                    // Open item by click on header button
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button#awg-graph-editor-sparql-toggle', 1, 1);

                    await clickAndAwaitChanges(btnDes[0], fixture);
                });

                it('... should have a method `performQuery`', () => {
                    expect(component.performQuery).toBeDefined();
                });

                it('... should trigger on queryRequest event from GraphEditorActionButtonsComponent (hollow)', () => {
                    const actionButtonsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        GraphEditorActionButtonsComponent,
                        1,
                        1
                    );
                    const actionButtonsCmp = actionButtonsDes[0].injector.get(GraphEditorActionButtonsComponent);

                    actionButtonsCmp.queryRequest.emit();

                    expectSpyCall(performQuerySpy, 1);
                });

                describe('... should emit', () => {
                    it('`performQueryRequest` if a query string is given', () => {
                        component.performQuery();

                        expectSpyCall(emitPerformQueryRequestSpy, 1);
                        expectSpyCall(emitErrorMessageRequestSpy, 0);
                    });

                    it('`errorMessageRequest` with errorMessage if no query string is given', () => {
                        const expectedErrorMessage = new ToastMessage('Empty query', 'Please enter a SPARQL query.');

                        component.clearQuery();
                        component.performQuery();

                        expectSpyCall(emitPerformQueryRequestSpy, 0);
                        expectSpyCall(emitErrorMessageRequestSpy, 1, expectedErrorMessage);
                    });
                });
            });

            describe('#resetQuery()', () => {
                beforeEach(async () => {
                    // Open item by click on header button
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button#awg-graph-editor-sparql-toggle', 1, 1);

                    await clickAndAwaitChanges(btnDes[0], fixture);
                });

                it('... should have a method `resetQuery`', () => {
                    expect(component.resetQuery).toBeDefined();
                });

                it('... should trigger with the current query on resetRequest event from GraphEditorActionButtonsComponent (hollow)', () => {
                    const actionButtonsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        GraphEditorActionButtonsComponent,
                        1,
                        1
                    );
                    const actionButtonsCmp = actionButtonsDes[0].injector.get(GraphEditorActionButtonsComponent);

                    actionButtonsCmp.resetRequest.emit();

                    expectSpyCall(resetQuerySpy, 1, expectedConstructQuery1);
                });

                it('... should trigger with the selected query on querySelectRequest event from ExampleQueriesComponent (hollow)', () => {
                    const exampleQueriesDes = getAndExpectDebugElementByDirective(
                        compDe,
                        ExampleQueriesComponent,
                        1,
                        1
                    );
                    const exampleQueriesCmp = exampleQueriesDes[0].injector.get(ExampleQueriesComponent);

                    exampleQueriesCmp.querySelectRequest.emit(expectedSelectQuery1);

                    expectSpyCall(resetQuerySpy, 1, expectedSelectQuery1);
                });

                it('... should emit resetQueryRequest with the given query', () => {
                    component.resetQuery(expectedConstructQuery2);

                    expectSpyCall(emitResetQueryRequestSpy, 1, expectedConstructQuery2);
                });
            });
        });
    });
});
