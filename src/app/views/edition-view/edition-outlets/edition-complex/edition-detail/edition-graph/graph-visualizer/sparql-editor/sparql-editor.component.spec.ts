import { DebugElement, NgModule, SimpleChange, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import { NgbAccordionModule, NgbConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

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
import { CmMode } from '@awg-shared/codemirror/codemirror.utils';
import { ToastMessage } from '@awg-shared/toast/toast.service';
import { ViewHandleButtonGroupComponent } from '@awg-shared/view-handle-button-group/view-handle-button-group.component';
import { ViewHandle, ViewHandleTypes } from '@awg-shared/view-handle-button-group/view-handle.model';

import { GraphSparqlQuery, GraphSparqlQueryType } from '@awg-views/edition-view/models/graph.model';

import { EditorActionButtonsComponent } from '../editor-action-buttons/editor-action-buttons.component';
import { ExampleQueriesComponent } from './example-queries/example-queries.component';
import { SparqlEditorComponent } from './sparql-editor.component';

describe('SparqlEditorComponent (DONE)', () => {
    let component: SparqlEditorComponent;
    let fixture: ComponentFixture<SparqlEditorComponent>;
    let compDe: DebugElement;

    let expectedConstructQuery1: GraphSparqlQuery;
    let expectedConstructQuery2: GraphSparqlQuery;
    let expectedSelectQuery1: GraphSparqlQuery;
    let expectedSelectQuery2: GraphSparqlQuery;
    let expectedQueryList: GraphSparqlQuery[];
    let expectedCmSparqlMode: CmMode;
    let expectedIsFullscreen: boolean;
    let expectedViewHandles: ViewHandle[];

    let isExampleQueriesEnabledSpy: Spy;
    let onEditorInputChangeSpy: Spy;
    let onViewChangeSpy: Spy;
    let performQuerySpy: Spy;
    let isAccordionItemDisabledSpy: Spy;
    let isAccordionItemCollapsedSpy: Spy;
    let resetQuerySpy: Spy;
    let setViewTypeSpy: Spy;
    let switchQueryTypeSpy: Spy;
    let emitErrorMessageRequestSpy: Spy;
    let emitPerformQueryRequestSpy: Spy;
    let emitResestQueryRequestSpy: Spy;
    let emitUpdateQueryStringRequestSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule, NgbDropdownModule], exports: [NgbAccordionModule, NgbDropdownModule] })
    class NgbConfigModule {
        constructor() {
            const config = inject(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NgbAccordionModule,
                NgbConfigModule,
                NgbDropdownModule,
                CodeMirrorComponent,
                EditorActionButtonsComponent,
                ExampleQueriesComponent,
                ViewHandleButtonGroupComponent,
            ],
            declarations: [SparqlEditorComponent],
        })
            .overrideComponent(EditorActionButtonsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(ExampleQueriesComponent, { set: { template: '', imports: [] } })
            .overrideComponent(ViewHandleButtonGroupComponent, { set: { template: '', imports: [] } })
            .overrideComponent(CodeMirrorComponent, {
                set: { template: '<div #codemirrorhost></div>', imports: [] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SparqlEditorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedIsFullscreen = false;
        expectedCmSparqlMode = sparql;

        expectedConstructQuery1 = new GraphSparqlQuery();
        expectedConstructQuery1.queryType = 'construct';
        expectedConstructQuery1.queryLabel = 'Test Query 3';
        expectedConstructQuery1.queryString = 'CONSTRUCT WHERE { ?test ?has ?success }';

        expectedConstructQuery2 = new GraphSparqlQuery();
        expectedConstructQuery2.queryType = 'construct';
        expectedConstructQuery2.queryLabel = 'Test Query 4';
        expectedConstructQuery2.queryString = 'CONSTRUCT WHERE { ?success a ?test }';

        expectedSelectQuery1 = new GraphSparqlQuery();
        expectedSelectQuery1.queryType = 'select';
        expectedSelectQuery1.queryLabel = 'Test Query 1';
        expectedSelectQuery1.queryString = 'SELECT * WHERE { ?test ?has ?success }';

        expectedSelectQuery2 = new GraphSparqlQuery();
        expectedSelectQuery2.queryType = 'select';
        expectedSelectQuery2.queryLabel = 'Test Query 2';
        expectedSelectQuery2.queryString = 'SELECT * WHERE { ?success a ?test }';

        expectedQueryList = [
            expectedConstructQuery1,
            expectedConstructQuery2,
            expectedSelectQuery1,
            expectedSelectQuery2,
        ];

        expectedViewHandles = [
            new ViewHandle('Graph view', ViewHandleTypes.GRAPH, component.faDiagramProject),
            new ViewHandle('Table view', ViewHandleTypes.TABLE, component.faTable),
        ];

        // Spies
        isExampleQueriesEnabledSpy = vi.spyOn(component, 'isExampleQueriesEnabled');
        onEditorInputChangeSpy = vi.spyOn(component, 'onEditorInputChange');
        onViewChangeSpy = vi.spyOn(component, 'onViewChange');
        performQuerySpy = vi.spyOn(component, 'performQuery');
        isAccordionItemCollapsedSpy = vi.spyOn(component, 'isAccordionItemCollapsed');
        isAccordionItemDisabledSpy = vi.spyOn(component, 'isAccordionItemDisabled');
        resetQuerySpy = vi.spyOn(component, 'resetQuery');
        setViewTypeSpy = vi.spyOn(component, 'setViewType');
        switchQueryTypeSpy = vi.spyOn(component, 'switchQueryType');
        emitErrorMessageRequestSpy = vi.spyOn(component.errorMessageRequest, 'emit');
        emitPerformQueryRequestSpy = vi.spyOn(component.performQueryRequest, 'emit');
        emitResestQueryRequestSpy = vi.spyOn(component.resetQueryRequest, 'emit');
        emitUpdateQueryStringRequestSpy = vi.spyOn(component.updateQueryStringRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have default `queryList` input', () => {
            expectToEqual(component.queryList, []);
        });

        it('... should have default `query` input', () => {
            expectToEqual(component.query, new GraphSparqlQuery());
        });

        it('... should have default `isFullscreen` input', () => {
            expectToBe(component.isFullscreen, false);
        });

        it('... should have cmSparqlMode', () => {
            expectToEqual(component.cmSparqlMode, expectedCmSparqlMode);
        });

        it('... should have selectedViewType', () => {
            expectToEqual(component.selectedViewType, ViewHandleTypes.GRAPH);
        });

        it('... should have viewHandles', () => {
            expectToEqual(component.viewHandles, expectedViewHandles);
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
            component.query = expectedConstructQuery1;
            component.queryList = expectedQueryList;
            component.isFullscreen = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `queryList` input', () => {
            expectToEqual(component.queryList, expectedQueryList);
        });

        it('... should have `query` input', () => {
            expectToEqual(component.query, expectedConstructQuery1);
        });

        it('... should have `isFullScreen` input', () => {
            expectToBe(component.isFullscreen, expectedIsFullscreen);
        });

        describe('VIEW', () => {
            describe('not in fullscreen mode', () => {
                describe('with closed item', () => {
                    it('... should contain one div.accordion-item with header and collapsed body in div.accordion', () => {
                        const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                        const itemDes = getAndExpectDebugElementByCss(
                            accordionDes[0],
                            'div#awg-graph-visualizer-sparql-query.accordion-item',
                            1,
                            1
                        );
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            itemDes[0],
                            'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                            1,
                            1
                        );
                        const itemHeaderEl: HTMLDivElement = itemHeaderDes[0].nativeElement;

                        expectToContain(itemHeaderEl.classList, 'collapsed');

                        const itemBodyDes = getAndExpectDebugElementByCss(
                            itemDes[0],
                            'div#awg-graph-visualizer-sparql-query > div.accordion-collapse',
                            1,
                            1
                        );
                        const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                        expectToNotContain(itemBodyEl.classList, 'show');
                    });

                    it('... should display item header button', () => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(
                            itemHeaderDes[0],
                            'button#awg-graph-visualizer-sparql-query-toggle',
                            1,
                            1
                        );
                        const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                        expectToBe(btnEl.textContent, 'SPARQL');
                    });

                    it('... should toggle item body on click', async () => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(
                            itemHeaderDes[0],
                            'button#awg-graph-visualizer-sparql-query-toggle',
                            1,
                            1
                        );

                        // Item body is closed
                        let itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-collapse',
                            1,
                            1
                        );
                        let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                        expectToNotContain(itemBodyEl.classList, 'show');

                        // Click header button
                        await clickAndAwaitChanges(btnDes[0], fixture);

                        // Item is open
                        itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-collapse',
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
                            'div#awg-graph-visualizer-sparql-query > div.accordion-collapse',
                            1,
                            1
                        );
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToNotContain(itemBodyEl.classList, 'show');
                    });

                    describe('View handle button group', () => {
                        it('... should contain ViewHandleButtonGroupComponent (hollow) in item header', () => {
                            const itemHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                                1,
                                1
                            );

                            getAndExpectDebugElementByDirective(itemHeaderDes[0], ViewHandleButtonGroupComponent, 1, 1);
                        });

                        it('... should pass down `selectedViewType` (graph according to querytype) to ViewHandleButtonGroupComponent (hollow)', () => {
                            const itemHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                                1,
                                1
                            );
                            const viewHandleButtonGroupDes = getAndExpectDebugElementByDirective(
                                itemHeaderDes[0],
                                ViewHandleButtonGroupComponent,
                                1,
                                1
                            );
                            const viewHandleButtonGroupCmp =
                                viewHandleButtonGroupDes[0].injector.get(ViewHandleButtonGroupComponent);

                            expectToBe(viewHandleButtonGroupCmp.selectedViewType(), ViewHandleTypes.GRAPH);
                        });

                        it('... should pass down `viewHandles` to ViewHandleButtonGroupComponent (hollow)', () => {
                            const viewHandleButtonGroupDes = getAndExpectDebugElementByDirective(
                                compDe,
                                ViewHandleButtonGroupComponent,
                                1,
                                1
                            );
                            const viewHandleButtonGroupCmp =
                                viewHandleButtonGroupDes[0].injector.get(ViewHandleButtonGroupComponent);

                            expectToEqual(viewHandleButtonGroupCmp.viewHandles(), expectedViewHandles);
                        });
                    });

                    describe('Example queries', () => {
                        it('... should contain ExampleQueriesComponent (hollow) in item header if isExampleQueriesEnabled = true', () => {
                            const itemHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                                1,
                                1
                            );

                            getAndExpectDebugElementByDirective(itemHeaderDes[0], ExampleQueriesComponent, 1, 1);
                        });

                        it('... should not contain ExampleQueriesComponent (hollow) in item header if isExampleQueriesEnabled = false', async () => {
                            isExampleQueriesEnabledSpy.mockReturnValue(false);
                            await detectChangesOnPush(fixture);

                            const itemHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query > div.accordion-header',
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

                        it('... should trigger `resetQuery()` on querySelectRequest event from ExampleQueriesComponent (hollow)', () => {
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
                    });
                });

                describe('with open item', () => {
                    let bodyDes: DebugElement[];

                    beforeEach(async () => {
                        // Open item by click on header button
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'button#awg-graph-visualizer-sparql-query-toggle',
                            1,
                            1
                        );

                        // Click header button
                        await clickAndAwaitChanges(btnDes[0], fixture);

                        // Item body is open
                        const collapseDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-collapse',
                            1,
                            1
                        );
                        const collapseEl: HTMLDivElement = collapseDes[0].nativeElement;

                        expectToContain(collapseEl.classList, 'show');

                        // Item body
                        bodyDes = getAndExpectDebugElementByCss(collapseDes[0], 'div.accordion-body', 1, 1);
                    });

                    it('... should toggle item body on click', async () => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(
                            itemHeaderDes[0],
                            'button#awg-graph-visualizer-sparql-query-toggle',
                            1,
                            1
                        );

                        // Item body is open
                        let itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-collapse',
                            1,
                            1
                        );
                        let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                        expectToContain(itemBodyEl.classList, 'show');

                        // Click header button
                        await clickAndAwaitChanges(btnDes[0], fixture);

                        // Item is closed
                        itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-collapse',
                            1,
                            1
                        );
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToNotContain(itemBodyEl.classList, 'show');

                        // Click header button
                        await clickAndAwaitChanges(btnDes[0], fixture);

                        // Item body is open again
                        itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-collapse',
                            1,
                            1
                        );
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToContain(itemBodyEl.classList, 'show');
                    });

                    it('... should contain CodeMirrorComponent (hollow) in item body', () => {
                        getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorComponent, 1, 1);
                    });

                    it('... should contain EditorActionButtonsComponent (hollow) in item body', () => {
                        getAndExpectDebugElementByDirective(bodyDes[0], EditorActionButtonsComponent, 1, 1);
                    });
                });
            });

            describe('in fullscreen mode', () => {
                let bodyDes: DebugElement[];

                beforeEach(async () => {
                    // Open item by click on header button
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'button#awg-graph-visualizer-sparql-query-toggle',
                        1,
                        1
                    );

                    // Click header button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item body
                    bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-sparql-query-collapse > div.accordion-body',
                        1,
                        1
                    );

                    // Set fullscreen mode
                    component.isFullscreen = true;
                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-sparql-query.accordion-item',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                        1,
                        1
                    );

                    // Body open (div.accordion-body)
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-sparql-query-collapse > div.accordion-body',
                        1,
                        1
                    );
                });

                it('... should display item header button', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(
                        itemHeaderDes[0],
                        'button#awg-graph-visualizer-sparql-query-toggle',
                        1,
                        1
                    );
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.textContent, 'SPARQL');
                });

                it('... should not toggle item body on click', async () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(
                        itemHeaderDes[0],
                        'div.accordion-button > button#awg-graph-visualizer-sparql-query-toggle',
                        1,
                        1
                    );

                    // Item body does not close
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-sparql-query-collapse > div.accordion-body',
                        1,
                        1,
                        'open'
                    );

                    // Click header button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item is open again
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-sparql-query-collapse > div.accordion-body',
                        1,
                        1,
                        'open'
                    );
                });

                describe('View handle button group', () => {
                    it('... should contain no ViewHandleButtonGroupComponent (hollow) in item header', () => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(itemHeaderDes[0], ViewHandleButtonGroupComponent, 0, 0);
                    });
                });

                describe('Example queries', () => {
                    it('... should contain ExampleQueriesComponent (hollow) in item header if isExampleQueriesEnabled = true', () => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(itemHeaderDes[0], ExampleQueriesComponent, 1, 1);
                    });

                    it('... should not contain ExampleQueriesComponent (hollow) in item header if isExampleQueriesEnabled = false', async () => {
                        isExampleQueriesEnabledSpy.mockReturnValue(false);
                        await detectChangesOnPush(fixture);

                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(itemHeaderDes[0], ExampleQueriesComponent, 0, 0);
                    });
                });

                it('... should contain CodeMirrorComponent (hollow) in item body', () => {
                    getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorComponent, 1, 1);
                });

                it('... should contain EditorActionButtonsComponent (hollow) in item body', () => {
                    getAndExpectDebugElementByDirective(bodyDes[0], EditorActionButtonsComponent, 1, 1);
                });
            });
        });

        describe('#isExampleQueriesEnabled()', () => {
            it('... should have a method `isExampleQueriesEnabled`', () => {
                expect(component.isExampleQueriesEnabled).toBeDefined();
            });

            it('... should return true if queryList is given and query is a valid query (has queryType, queryLabel, queryString)', () => {
                expectToBe(component.isExampleQueriesEnabled(), true);
            });

            describe('... should return false if', () => {
                it.each([
                    {
                        desc: 'query.queryType is null',
                        query: { ...expectedConstructQuery1, queryType: null },
                        list: [expectedConstructQuery1],
                    },
                    {
                        desc: 'query.queryLabel is an empty string',
                        query: { ...expectedConstructQuery1, queryLabel: '' },
                        list: [expectedConstructQuery1],
                    },
                    {
                        desc: 'query.queryString is an empty string',
                        query: { ...expectedConstructQuery1, queryString: '' },
                        list: [expectedConstructQuery1],
                    },
                    {
                        desc: 'queryList is empty',
                        query: { ...expectedConstructQuery1 },
                        list: [],
                    },
                    {
                        desc: 'query fields are blank and queryList is empty',
                        query: { queryType: null, queryLabel: '', queryString: '' } as GraphSparqlQuery,
                        list: [],
                    },
                ])('... $desc', async ({ query, list }) => {
                    component.query = query;
                    component.queryList = list;

                    await detectChangesOnPush(fixture);

                    expectToBe(component.isExampleQueriesEnabled(), false);
                });
            });
        });

        describe('#onEditorInputChange()', () => {
            beforeEach(async () => {
                // Open item by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-sparql-query > div.accordion-header > button.btn-link',
                    1,
                    1
                );

                // Click header button
                await clickAndAwaitChanges(btnDes[0], fixture);
            });

            it('... should have a method `onEditorInputChange`', () => {
                expect(component.onEditorInputChange).toBeDefined();
            });

            it('... should trigger on event from CodeMirrorComponent (hollow)', () => {
                const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorComponent, 1, 1);
                const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorComponent);

                const changedQueryString = expectedConstructQuery2.queryString;
                codeMirrorCmp.content.set(changedQueryString);

                expectSpyCall(onEditorInputChangeSpy, 1, changedQueryString);
            });

            it('... should trigger with empty string on clearRequest event from EditorActionButtonsComponent (hollow)', () => {
                const actionButtonsDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditorActionButtonsComponent,
                    1,
                    1
                );
                const actionButtonsCmp = actionButtonsDes[0].injector.get(EditorActionButtonsComponent);

                actionButtonsCmp.clearRequest.emit();

                expectSpyCall(onEditorInputChangeSpy, 1, '');
                expectSpyCall(emitUpdateQueryStringRequestSpy, 1, '');
            });

            describe('... should emit provided query string on editor change', () => {
                it('... if string is thruthy', () => {
                    const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorComponent, 1, 1);
                    const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorComponent);

                    const changedQueryString = expectedConstructQuery2.queryString;
                    codeMirrorCmp.content.set(changedQueryString);

                    expectSpyCall(onEditorInputChangeSpy, 1, changedQueryString);
                    expectSpyCall(emitUpdateQueryStringRequestSpy, 1, changedQueryString);
                });

                it('... if string is empty', () => {
                    const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorComponent, 1, 1);
                    const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorComponent);

                    // Query is undefined
                    codeMirrorCmp.content.set('');

                    expectSpyCall(onEditorInputChangeSpy, 1, '');
                    expectSpyCall(emitUpdateQueryStringRequestSpy, 1, '');
                });
            });
        });

        describe('#onViewChange()', () => {
            it('... should have a method `onViewChange`', () => {
                expect(component.onViewChange).toBeDefined();
            });

            it('... should trigger on event from view handle button group', () => {
                // Header debug elements
                const itemHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-sparql-query > div.accordion-header',
                    1,
                    1
                );

                // ViewHandleButtonGroupComponent (hollow) debug elements
                const viewHandleButtonGroupDes = getAndExpectDebugElementByDirective(
                    itemHeaderDes[0],
                    ViewHandleButtonGroupComponent,
                    1,
                    1
                );
                const viewHandleButtonGroupCmp =
                    viewHandleButtonGroupDes[0].injector.get(ViewHandleButtonGroupComponent);

                viewHandleButtonGroupCmp.viewChangeRequest.emit(ViewHandleTypes.GRAPH);

                expectSpyCall(onViewChangeSpy, 1, ViewHandleTypes.GRAPH);
            });

            it('... should trigger switchQueryType(), onEditorInputChange() with queryString and performQuery()', () => {
                component.onViewChange(ViewHandleTypes.GRAPH);

                expectSpyCall(switchQueryTypeSpy, 1, ViewHandleTypes.GRAPH);
                expectSpyCall(onEditorInputChangeSpy, 1, expectedConstructQuery1.queryString);
                expectSpyCall(performQuerySpy, 1);
            });
        });

        describe('#performQuery()', () => {
            beforeEach(async () => {
                // Open item by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-sparql-query > div.accordion-header > button.btn-link',
                    1,
                    1
                );

                // Click header button
                await clickAndAwaitChanges(btnDes[0], fixture);
            });

            it('... should have a method `performQuery`', () => {
                expect(component.performQuery).toBeDefined();
            });

            it('... should trigger on queryRequest event from EditorActionButtonsComponent (hollow)', () => {
                const actionButtonsDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditorActionButtonsComponent,
                    1,
                    1
                );
                const actionButtonsCmp = actionButtonsDes[0].injector.get(EditorActionButtonsComponent);

                actionButtonsCmp.queryRequest.emit();

                expectSpyCall(performQuerySpy, 1);
            });

            describe('... should emit', () => {
                it('`performQueryRequest` if querystring is given', () => {
                    component.performQuery();

                    expectSpyCall(emitPerformQueryRequestSpy, 1);
                    expectSpyCall(emitErrorMessageRequestSpy, 0);
                });

                it('`errorMessageRequest` with errorMessage if querystring is not given', () => {
                    const expectedErrorMessage = new ToastMessage('Empty query', 'Please enter a SPARQL query.');

                    component.query.queryString = '';
                    component.performQuery();

                    expectSpyCall(emitPerformQueryRequestSpy, 0);
                    expectSpyCall(emitErrorMessageRequestSpy, 1, expectedErrorMessage);
                });
            });
        });

        describe('#resetQuery()', () => {
            beforeEach(async () => {
                // Open item by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-sparql-query > div.accordion-header > button.btn-link',
                    1,
                    1
                );

                // Click header button
                await clickAndAwaitChanges(btnDes[0], fixture);
            });

            it('... should have a method `resetQuery`', () => {
                expect(component.resetQuery).toBeDefined();
            });

            it('... should trigger with the current query on resetRequest event from EditorActionButtonsComponent (hollow)', () => {
                const actionButtonsDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditorActionButtonsComponent,
                    1,
                    1
                );
                const actionButtonsCmp = actionButtonsDes[0].injector.get(EditorActionButtonsComponent);

                actionButtonsCmp.resetRequest.emit();

                expectSpyCall(resetQuerySpy, 1, component.query);
            });

            it('... should emit resetQueryRequest with the given query', () => {
                component.resetQuery(component.query);

                expectSpyCall(emitResestQueryRequestSpy, 1, component.query);
            });
        });

        describe('#setViewType()', () => {
            it('... should have a method `setViewType`', () => {
                expect(component.setViewType).toBeDefined();
            });

            it('... should trigger on init', () => {
                expectSpyCall(setViewTypeSpy, 1);
            });

            it('... should trigger on changes of query', () => {
                expectSpyCall(setViewTypeSpy, 1);

                // Directly trigger ngOnChanges
                component.ngOnChanges({
                    query: new SimpleChange(component.query, expectedSelectQuery1, false),
                });

                expectSpyCall(setViewTypeSpy, 2);
            });

            it('... should only trigger on changes of query if not first change', () => {
                expectSpyCall(setViewTypeSpy, 1);

                // Directly trigger ngOnChanges
                component.ngOnChanges({
                    query: new SimpleChange(component.query, expectedSelectQuery1, true),
                });

                expectSpyCall(setViewTypeSpy, 1);
            });

            it('... should return ViewHandleTypes.TABLE if querytype is `select`', () => {
                component.query = expectedSelectQuery1;
                component.setViewType();

                expectToBe(component.selectedViewType, ViewHandleTypes.TABLE);

                component.query = expectedSelectQuery2;
                component.setViewType();

                expectToBe(component.selectedViewType, ViewHandleTypes.TABLE);
            });

            describe('... should return ViewHandleTypes.GRAPH for any queryType other than `select`', () => {
                it.each([
                    { desc: 'construct ', getQuery: () => expectedConstructQuery1 },
                    {
                        desc: 'ask',
                        getQuery: () => ({ ...expectedConstructQuery1, queryType: 'ask' as GraphSparqlQueryType }),
                    },
                    {
                        desc: 'count',
                        getQuery: () => ({ ...expectedConstructQuery1, queryType: 'count' as GraphSparqlQueryType }),
                    },
                    {
                        desc: 'describe',
                        getQuery: () => ({ ...expectedConstructQuery1, queryType: 'describe' as GraphSparqlQueryType }),
                    },
                    {
                        desc: 'update',
                        getQuery: () => ({ ...expectedConstructQuery1, queryType: 'udpate' as GraphSparqlQueryType }),
                    },
                    {
                        desc: 'null',
                        getQuery: () => ({ ...expectedConstructQuery1, queryType: null as GraphSparqlQueryType }),
                    },
                    {
                        desc: 'unknown',
                        getQuery: () => ({ ...expectedConstructQuery1, queryType: 'completely_unknown' }) as any,
                    },
                ])('... with queryType = $desc`', ({ getQuery }) => {
                    component.query = getQuery();

                    component.setViewType();

                    expectToBe(component.selectedViewType, ViewHandleTypes.GRAPH);
                });
            });
        });

        describe('#switchQueryType()', () => {
            it('... should have a method `switchQueryType`', () => {
                expect(component.switchQueryType).toBeDefined();
            });

            it('... should switch querytype and string to `select` if requested view is `table`', () => {
                component.query.queryType = expectedConstructQuery1.queryType;
                component.query.queryString = expectedConstructQuery1.queryString;

                component.switchQueryType(ViewHandleTypes.TABLE);

                expectToBe(component.query.queryType, expectedSelectQuery1.queryType);
                expectToBe(component.query.queryString, expectedSelectQuery1.queryString);
            });

            it('... should not switch to `select` if requested view is `table` but queryString has no `CONSTRUCT`', () => {
                component.query.queryType = 'construct';
                component.query.queryString = 'ASK WHERE { ?test ?has ?success }';

                component.switchQueryType(ViewHandleTypes.TABLE);

                expectToBe(component.query.queryType, 'construct');
                expectToBe(component.query.queryString, 'ASK WHERE { ?test ?has ?success }');
            });

            it('... should switch querytype and string to `construct` if requested view is `graph`', () => {
                // Switch to TABLE view
                component.switchQueryType(ViewHandleTypes.TABLE);

                component.query.queryType = expectedSelectQuery1.queryType;
                component.query.queryString = expectedSelectQuery1.queryString;

                // Switch back to GRAPH view
                component.switchQueryType(ViewHandleTypes.GRAPH);

                expectToBe(component.query.queryType, expectedConstructQuery1.queryType);
                expectToBe(component.query.queryString, expectedConstructQuery1.queryString);
            });

            it('... should not switch to `construct` if requested view is `graph` but queryString has no `SELECT`', () => {
                component.query.queryType = 'select';
                component.query.queryString = 'ASK WHERE { ?test ?has ?success }';

                component.switchQueryType(ViewHandleTypes.GRAPH);

                expectToBe(component.query.queryType, 'select');
                expectToBe(component.query.queryString, 'ASK WHERE { ?test ?has ?success }');
            });

            it('... should do nothing if requested view is `grid`', () => {
                component.query.queryType = expectedConstructQuery1.queryType;
                component.query.queryString = expectedConstructQuery1.queryString;

                component.switchQueryType(ViewHandleTypes.GRID);

                expectToBe(component.query.queryType, expectedConstructQuery1.queryType);
                expectToBe(component.query.queryString, expectedConstructQuery1.queryString);
            });

            it('... should throw error if requested view is not `table`, `graph` or `grid`', () => {
                component.query.queryType = expectedConstructQuery1.queryType;
                component.query.queryString = expectedConstructQuery1.queryString;

                expect(() => component.switchQueryType(undefined as any)).toThrow(
                    `The view must be ${ViewHandleTypes.GRAPH} or ${ViewHandleTypes.TABLE}, but was: undefined.`
                );
            });
        });

        describe('#isAccordionItemCollapsed()', () => {
            it('... should have a method `isAccordionItemCollapsed`', () => {
                expect(component.isAccordionItemCollapsed).toBeDefined();
            });

            it('... should be triggered from ngbAccordionItem', () => {
                expectSpyCall(isAccordionItemCollapsedSpy, 1);
            });

            it('... should return true if isFullscreen is false', () => {
                expectToBe(component.isAccordionItemCollapsed(), true);
            });

            it('... should return false if isFullscreen is true', () => {
                // Set fullscreen flag to true
                component.isFullscreen = true;

                expectToBe(component.isAccordionItemCollapsed(), false);
            });
        });

        describe('#isAccordionItemDisabled()', () => {
            it('... should have a method `isAccordionItemDisabled`', () => {
                expect(component.isAccordionItemDisabled).toBeDefined();
            });

            it('... should be triggered from ngbAccordionItem', () => {
                expectSpyCall(isAccordionItemDisabledSpy, 1);
            });

            it('... should return false if isFullscreen is false', () => {
                expectToBe(component.isAccordionItemDisabled(), false);
            });

            it('... should return true if isFullscreen is true', () => {
                // Set fullscreen flag to true
                component.isFullscreen = true;

                expectToBe(component.isAccordionItemDisabled(), true);
            });
        });
    });
});
