import { Component, DebugElement, EventEmitter, Input, NgModule, Output, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import {
    NgbAccordion,
    NgbAccordionModule,
    NgbConfig,
    NgbDropdown,
    NgbDropdownModule,
    NgbPanelChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';
import { EditorView } from 'codemirror';
import Spy = jasmine.Spy;

import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { CmMode } from '@awg-shared/codemirror/codemirror.component';
import { ToastMessage } from '@awg-shared/toast/toast.service';
import { ViewHandle, ViewHandleTypes } from '@awg-shared/view-handle-button-group/view-handle.model';
import { GraphSparqlQuery } from '@awg-views/edition-view/models';

import { SparqlEditorComponent } from './sparql-editor.component';

@Component({ selector: 'awg-codemirror', template: '' })
class CodeMirrorStubComponent {
    @Input() mode: CmMode;
    @Input() content: string;
    @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() editor: EditorView;
}

@Component({ selector: 'awg-view-handle-button-group', template: '' })
class ViewHandleButtongGroupStubComponent {
    @Input()
    viewHandles: ViewHandle[];
    @Input()
    selectedViewType: ViewHandleTypes;
    @Output()
    viewChangeRequest: EventEmitter<ViewHandleTypes> = new EventEmitter();
}

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
    let onQueryListChangeSpy: Spy;
    let onViewChangeSpy: Spy;
    let performQuerySpy: Spy;
    let preventPanelCollapseOnFullscreenSpy: Spy;
    let resetQuerySpy: Spy;
    let setViewTypeSpy: Spy;
    let switchQueryTypeSpy: Spy;
    let emitErrorMessageRequestSpy: Spy;
    let emitPerformQueryRequestSpy: Spy;
    let emitResestQueryRequestSpy: Spy;
    let emitUpdateQueryStringRequestSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule, NgbDropdownModule], exports: [NgbAccordionModule, NgbDropdownModule] })
    class NgbAnimationConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgbAnimationConfigModule, NgbAccordion, NgbDropdown],
            declarations: [SparqlEditorComponent, CodeMirrorStubComponent, ViewHandleButtongGroupStubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SparqlEditorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
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

        expectedIsFullscreen = false;

        expectedCmSparqlMode = sparql;

        expectedViewHandles = [
            new ViewHandle('Graph view', ViewHandleTypes.GRAPH, component.faDiagramProject),
            new ViewHandle('Table view', ViewHandleTypes.TABLE, component.faTable),
        ];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        isExampleQueriesEnabledSpy = spyOn(component, 'isExampleQueriesEnabled').and.callThrough();
        onEditorInputChangeSpy = spyOn(component, 'onEditorInputChange').and.callThrough();
        onQueryListChangeSpy = spyOn(component, 'onQueryListChange').and.callThrough();
        onViewChangeSpy = spyOn(component, 'onViewChange').and.callThrough();
        performQuerySpy = spyOn(component, 'performQuery').and.callThrough();
        preventPanelCollapseOnFullscreenSpy = spyOn(component, 'preventPanelCollapseOnFullscreen').and.callThrough();
        resetQuerySpy = spyOn(component, 'resetQuery').and.callThrough();
        setViewTypeSpy = spyOn(component, 'setViewType').and.callThrough();
        switchQueryTypeSpy = spyOn(component, 'switchQueryType').and.callThrough();
        emitErrorMessageRequestSpy = spyOn(component.errorMessageRequest, 'emit').and.callThrough();
        emitPerformQueryRequestSpy = spyOn(component.performQueryRequest, 'emit').and.callThrough();
        emitResestQueryRequestSpy = spyOn(component.resetQueryRequest, 'emit').and.callThrough();
        emitUpdateQueryStringRequestSpy = spyOn(component.updateQueryStringRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have queryList', () => {
            expect(component.queryList).toBeUndefined();
        });

        it('... should not have query', () => {
            expect(component.query).toBeUndefined();
        });

        it('... should not have isFullscreen', () => {
            expect(component.isFullscreen).toBeUndefined();
        });

        it('... should have cmSparqlMode', () => {
            expect(component.cmSparqlMode).toBeDefined();
            expect(component.cmSparqlMode)
                .withContext(`should equal ${expectedCmSparqlMode}`)
                .toEqual(expectedCmSparqlMode);
        });

        it('... should have selectedViewType', () => {
            expect(component.selectedViewType).toBeDefined();
            expect(component.selectedViewType)
                .withContext(`should equal ${ViewHandleTypes.GRAPH}`)
                .toEqual(ViewHandleTypes.GRAPH);
        });

        it('... should have viewHandles', () => {
            expect(component.viewHandles).toBeDefined();
            expect(component.viewHandles)
                .withContext(`should equal ${expectedViewHandles}`)
                .toEqual(expectedViewHandles);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.accordion-item) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 0, 0, 'yet');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.query = expectedConstructQuery1;
            component.queryList = expectedQueryList;
            component.isFullscreen = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `queryList` input', () => {
            expect(component.queryList).toBeDefined();
            expect(component.queryList).withContext(`should equal ${expectedQueryList}`).toEqual(expectedQueryList);
        });

        it('... should have `query` input', () => {
            expect(component.query).toBeDefined();
            expect(component.query)
                .withContext(`should equal ${expectedConstructQuery1}`)
                .toEqual(expectedConstructQuery1);
        });

        it('... should have `isFullScreen` input', () => {
            expect(component.isFullscreen).toBeDefined();
            expect(component.isFullscreen)
                .withContext(`should equal ${expectedIsFullscreen}`)
                .toBe(expectedIsFullscreen);
        });

        describe('VIEW', () => {
            describe('not in fullscreen mode', () => {
                describe('with closed panel', () => {
                    it('... should contain one ngb-accordion with panel (div.accordion-item) header and collapsed body', () => {
                        // Ngb-accordion debug element
                        const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                        // Panel (div.card)
                        const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1); // Panel (div.card)
                        // Header
                        getAndExpectDebugElementByCss(
                            panelDes[0],
                            'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                            1,
                            1
                        ); // Panel (div.card)
                        // No body
                        getAndExpectDebugElementByCss(
                            panelDes[0],
                            'div#awg-graph-visualizer-sparql-query > div.accordion-body',
                            0,
                            0
                        );
                    });

                    it('... should display panel header button', () => {
                        // Panel header button
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query-header > div.accordion-button > button.btn-link',
                            1,
                            1
                        );

                        const btnEl = btnDes[0].nativeElement;

                        // Check button content
                        expect(btnEl.textContent).toBeTruthy();
                        expect(btnEl.textContent).withContext('should be SPARQL').toContain('SPARQL');
                    });

                    it('... should toggle panel body by click on panel header button', async () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                            1,
                            1
                        );

                        // Button debug elements
                        const btnDes = getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'div.accordion-button > button.btn-link',
                            1,
                            1
                        );
                        // Button native elements to click on
                        const btnEl = btnDes[0].nativeElement;

                        // Panel body is closed
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-body',
                            0,
                            0,
                            'collapsed'
                        );

                        // Click header button
                        click(btnEl as HTMLElement);
                        await detectChangesOnPush(fixture);

                        // Panel is open
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-body',
                            1,
                            1,
                            'open'
                        );

                        // Click header button
                        click(btnEl as HTMLElement);
                        await detectChangesOnPush(fixture);

                        // Panel body is closed again
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-body',
                            0,
                            0,
                            'collapsed'
                        );
                    });

                    describe('View handle button group', () => {
                        it('... should contain ViewHandleButtongGroupComponent (stubbed) in panel header', () => {
                            // Header debug elements
                            const panelHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                                1,
                                1
                            );

                            getAndExpectDebugElementByDirective(
                                panelHeaderDes[0],
                                ViewHandleButtongGroupStubComponent,
                                1,
                                1
                            );
                        });

                        it('... should have selectedViewType===graph (according to querytype)', () => {
                            // Header debug elements
                            const panelHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                                1,
                                1
                            );
                            // ViewHandleButtongGroupComponent debug elements
                            const viewHandleButtongGroupDes = getAndExpectDebugElementByDirective(
                                panelHeaderDes[0],
                                ViewHandleButtongGroupStubComponent,
                                1,
                                1
                            );
                            const viewHandleButtongGroupCmp = viewHandleButtongGroupDes[0].injector.get(
                                ViewHandleButtongGroupStubComponent
                            ) as ViewHandleButtongGroupStubComponent;

                            expect(viewHandleButtongGroupCmp.selectedViewType).toBeTruthy();
                            expect(viewHandleButtongGroupCmp.selectedViewType).toBe(ViewHandleTypes.GRAPH);
                        });
                    });

                    describe('Example query button group', () => {
                        it('... should contain an example query btn-group in panel header if isExampleQueriesEnabled = true', async () => {
                            isExampleQueriesEnabledSpy.and.returnValue(true);

                            await detectChangesOnPush(fixture);

                            // Header debug elements
                            const panelHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                                1,
                                1
                            );

                            // Panel header div.awg-example-query-btn-group
                            getAndExpectDebugElementByCss(
                                panelHeaderDes[0],
                                'div.accordion-button > div.awg-example-query-btn-group',
                                1,
                                1
                            );
                        });

                        it('... should not contain an example query btn-group in panel header if isExampleQueriesEnabled = false', async () => {
                            isExampleQueriesEnabledSpy.and.returnValue(false);

                            await detectChangesOnPush(fixture);

                            // Header debug elements
                            const panelHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                                1,
                                1
                            );

                            // Panel header div.awg-example-query-btn-group
                            getAndExpectDebugElementByCss(
                                panelHeaderDes[0],
                                'div.accordion-button > div.awg-example-query-btn-group',
                                0,
                                0
                            );
                        });

                        it('... should display a disabled button label in example query btn-group', () => {
                            // Header debug elements
                            const panelHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                                1,
                                1
                            );

                            const btnDes = getAndExpectDebugElementByCss(
                                panelHeaderDes[0],
                                'div.accordion-button > div.awg-example-query-btn-group > button.btn',
                                1,
                                1
                            );
                            const btnEl = btnDes[0].nativeElement;

                            expect(btnEl.disabled).toBeTruthy();
                            expect(btnEl.getAttribute('aria-disabled')).toBe('true');

                            expect(btnEl.textContent).toBeTruthy();
                            expect(btnEl.textContent).toContain('Beispielabfragen');
                        });

                        it('... should contain another btn-group dropdown in example query btn-group', () => {
                            // Header debug elements
                            const panelHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                                1,
                                1
                            );

                            const outerButtonGroupDes = getAndExpectDebugElementByCss(
                                panelHeaderDes[0],
                                'div.accordion-button > div.awg-example-query-btn-group',
                                1,
                                1
                            );

                            getAndExpectDebugElementByCss(outerButtonGroupDes[0], 'div.btn-group.dropdown', 1, 1);
                        });

                        it('... should contain toggle button in example query btn-group dropdown', () => {
                            // Header debug elements
                            const panelHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                                1,
                                1
                            );

                            const dropdownButtonGroupDes = getAndExpectDebugElementByCss(
                                panelHeaderDes[0],
                                'div.accordion-button > div.awg-example-query-btn-group > div.btn-group.dropdown',
                                1,
                                1
                            );

                            getAndExpectDebugElementByCss(
                                dropdownButtonGroupDes[0],
                                'button.btn.dropdown-toggle',
                                1,
                                1
                            );
                        });

                        it('... should contain dropdown menu div with dropdown item links in example query btn-group dropdown', fakeAsync(() => {
                            tick();
                            // Header debug elements
                            const panelHeaderDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                                1,
                                1
                            );

                            const dropdownButtonGroupDes = getAndExpectDebugElementByCss(
                                panelHeaderDes[0],
                                'div.accordion-button > div.awg-example-query-btn-group > div.btn-group.dropdown',
                                1,
                                1
                            );

                            const menuDes = getAndExpectDebugElementByCss(
                                dropdownButtonGroupDes[0],
                                'div.dropdown-menu',
                                1,
                                1
                            );

                            getAndExpectDebugElementByCss(
                                menuDes[0],
                                'a.dropdown-item',
                                expectedQueryList.length,
                                expectedQueryList.length
                            );
                        }));

                        it('... should display label on dropdown items in example query btn-group', () => {
                            const dropdownButtonGroupDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.accordion-button > div.awg-example-query-btn-group > div.btn-group.dropdown',
                                1,
                                1
                            );

                            const itemDes = getAndExpectDebugElementByCss(
                                dropdownButtonGroupDes[0],
                                'div.dropdown-menu > a.dropdown-item',
                                expectedQueryList.length,
                                expectedQueryList.length
                            );

                            expect(itemDes.length)
                                .withContext(`should be ${expectedQueryList.length}`)
                                .toBe(expectedQueryList.length);

                            const itemEl0 = itemDes[0].nativeElement;
                            const itemEl1 = itemDes[1].nativeElement;

                            expect(itemEl0.textContent).toBeTruthy();
                            expect(itemEl0.textContent)
                                .withContext(`should contain ${expectedQueryList[0].queryLabel}`)
                                .toContain(expectedQueryList[0].queryLabel);

                            expect(itemEl1.textContent).toBeTruthy();
                            expect(itemEl1.textContent)
                                .withContext(`should contain ${expectedQueryList[1].queryLabel}`)
                                .toContain(expectedQueryList[1].queryLabel);
                        });

                        it('... should disable current query in dropdown items', async () => {
                            const itemDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.dropdown-menu > a.dropdown-item',
                                expectedQueryList.length,
                                expectedQueryList.length
                            );

                            expect(itemDes.length)
                                .withContext(`should be ${expectedQueryList.length}`)
                                .toBe(expectedQueryList.length);

                            const itemEl0 = itemDes[0].nativeElement;
                            const itemEl1 = itemDes[1].nativeElement;

                            expect(itemEl0).toHaveClass('disabled');
                            expect(itemEl1).not.toHaveClass('disabled');

                            component.query = expectedConstructQuery2;
                            await detectChangesOnPush(fixture);

                            expect(itemEl0).not.toHaveClass('disabled');
                            expect(itemEl1).toHaveClass('disabled');
                        });

                        it('... should trigger `onQueryListChange()` by click on dropdown item', async () => {
                            const itemDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.dropdown-menu > a.dropdown-item',
                                expectedQueryList.length,
                                expectedQueryList.length
                            );

                            expect(itemDes.length)
                                .withContext(`should be ${expectedQueryList.length}`)
                                .toBe(expectedQueryList.length);

                            const itemEl0 = itemDes[0].nativeElement;
                            const itemEl1 = itemDes[1].nativeElement;

                            expect(itemEl1).not.toHaveClass('disabled');

                            // Click on second item (first disabled)
                            click(itemEl1 as HTMLElement);
                            await detectChangesOnPush(fixture);

                            // Spy call with second query
                            expectSpyCall(onQueryListChangeSpy, 1, expectedConstructQuery2);

                            component.query = expectedConstructQuery2;
                            await detectChangesOnPush(fixture);

                            expect(itemEl0).not.toHaveClass('disabled');

                            // Click on first item (second disabled)
                            click(itemEl0 as HTMLElement);
                            await detectChangesOnPush(fixture);

                            // Spy call with first query
                            expectSpyCall(onQueryListChangeSpy, 2, expectedConstructQuery1);
                        });
                    });
                });

                describe('with open panel', () => {
                    let bodyDes: DebugElement[];

                    beforeEach(async () => {
                        // Open panel by click on header button
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query-header.accordion-header > div.accordion-button > button.btn-link',
                            1,
                            1
                        );
                        const btnEl = btnDes[0].nativeElement;

                        // Click header button
                        click(btnEl as HTMLElement);
                        await detectChangesOnPush(fixture);

                        // Panel body
                        bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query > div.accordion-body',
                            1,
                            1
                        );
                    });

                    it('... should contain CodeMirrorComponent (stubbed) in panel body', () => {
                        // CodeMirrorComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorStubComponent, 1, 1);
                    });

                    it('... should contain div with 3 buttons (Query, Reset, Clear) in panel body', () => {
                        const divDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-sparql-query-handle-buttons',
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(divDes[0], 'button.btn', 3, 3);
                        const btnEl0 = btnDes[0].nativeElement;
                        const btnEl1 = btnDes[1].nativeElement;
                        const btnEl2 = btnDes[2].nativeElement;

                        expect(btnEl0.textContent).toBeTruthy();
                        expect(btnEl0.textContent).withContext(`should contain 'Query'`).toContain('Query');

                        expect(btnEl1.textContent).toBeTruthy();
                        expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                        expect(btnEl2.textContent).toBeTruthy();
                        expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');
                    });

                    it('... should trigger `performQuery()` by click on Query button', async () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                            3,
                            3
                        );
                        const btnEl0 = btnDes[0].nativeElement;

                        expect(btnEl0.textContent).toBeTruthy();
                        expect(btnEl0.textContent).withContext(`should contain 'Query'`).toContain('Query');

                        // Click query button
                        click(btnEl0 as HTMLElement);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(performQuerySpy, 1);
                        expectSpyCall(resetQuerySpy, 0);
                    });

                    it('... should trigger `resetQuery()` by click on Reset button', async () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                            3,
                            3
                        );
                        const btnEl1 = btnDes[1].nativeElement;

                        expect(btnEl1.textContent).toBeTruthy();
                        expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                        // Click reset button
                        click(btnEl1 as HTMLElement);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(performQuerySpy, 0);
                        expectSpyCall(resetQuerySpy, 1);
                    });

                    it('... should trigger `onEditorInputChange()` with empty string by click on Clear button', async () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                            3,
                            3
                        );
                        const btnEl2 = btnDes[2].nativeElement;

                        expect(btnEl2.textContent).toBeTruthy();
                        expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');

                        // Click clear button
                        click(btnEl2 as HTMLElement);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(onEditorInputChangeSpy, 1, '');
                    });
                });
            });

            describe('in fullscreen mode', () => {
                let bodyDes: DebugElement[];

                beforeEach(() => {
                    // Open panel by click on header button
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-sparql-query-header.accordion-header > div.accordion-button > button.btn-link',
                        1,
                        1
                    );
                    const btnEl = btnDes[0].nativeElement;

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Panel body
                    bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-sparql-query > div.accordion-body',
                        1,
                        1
                    );

                    // Set fullscreen mode
                    component.isFullscreen = true;
                });

                it('... should contain one ngb-accordion with panel (div.accordion-item) header and open body', () => {
                    // Ngb-accordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                    // Panel (div.card)
                    const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1); // Panel (div.card)
                    // Header
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                        1,
                        1
                    ); // Panel (div.card)
                    // Body open
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-sparql-query > div.accordion-body',
                        1,
                        1
                    );
                });

                it('... should display panel header button', () => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                        1,
                        1
                    );

                    // Panel header button
                    const btnDes = getAndExpectDebugElementByCss(
                        panelHeaderDes[0],
                        'div.accordion-button > button.btn-link',
                        1,
                        1
                    );

                    // Button native element
                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expect(btnEl.textContent).toBeTruthy();
                    expect(btnEl.textContent).withContext(`should be 'SPARQL'`).toContain('SPARQL');
                });

                it('... should not toggle panel body by click on panel header button', async () => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                        1,
                        1
                    );

                    // Button debug element
                    const btnDes = getAndExpectDebugElementByCss(
                        panelHeaderDes[0],
                        'div.accordion-button > button.btn-link',
                        1,
                        1
                    );
                    // Button native element to click on
                    const btnEl = btnDes[0].nativeElement;

                    // Panel body is open
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-sparql-query > div.accordion-body',
                        1,
                        1,
                        'open'
                    );

                    // Click header button
                    click(btnEl as HTMLElement);
                    await detectChangesOnPush(fixture);

                    // Panel is open again
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-sparql-query > div.accordion-body',
                        1,
                        1,
                        'open'
                    );
                });

                describe('View handle button group', () => {
                    it('... should contain ViewHandleButtongGroupComponent (stubbed) in panel header', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            panelHeaderDes[0],
                            ViewHandleButtongGroupStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should have selectedViewType===graph (according to querytype)', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                            1,
                            1
                        );
                        // ViewHandleButtongGroupComponent debug elements
                        const viewHandleButtongGroupDes = getAndExpectDebugElementByDirective(
                            panelHeaderDes[0],
                            ViewHandleButtongGroupStubComponent,
                            1,
                            1
                        );
                        const viewHandleButtongGroupCmp = viewHandleButtongGroupDes[0].injector.get(
                            ViewHandleButtongGroupStubComponent
                        ) as ViewHandleButtongGroupStubComponent;

                        expect(viewHandleButtongGroupCmp.selectedViewType).toBeTruthy();
                        expect(viewHandleButtongGroupCmp.selectedViewType).toBe(ViewHandleTypes.GRAPH);
                    });
                });

                describe('Example query button group', () => {
                    it('... should contain an example query btn-group in panel header if isExampleQueriesEnabled = true', async () => {
                        isExampleQueriesEnabledSpy.and.returnValue(true);

                        await detectChangesOnPush(fixture);

                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                            1,
                            1
                        );

                        // Panel header div.btn-group
                        getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'div.accordion-button > div.awg-example-query-btn-group',
                            1,
                            1
                        );
                    });

                    it('... should not contain an example query btn-group in panel header if isExampleQueriesEnabled = false', async () => {
                        isExampleQueriesEnabledSpy.and.returnValue(false);

                        await detectChangesOnPush(fixture);

                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                            1,
                            1
                        );

                        // Panel header div.btn-group
                        getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'div.accordion-button > div.awg-example-query-btn-group',
                            0,
                            0
                        );
                    });

                    it('... should display a disabled button label in example query btn-group', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'div.accordion-button > div.awg-example-query-btn-group > button.btn',
                            1,
                            1
                        );
                        const btnEl = btnDes[0].nativeElement;

                        expect(btnEl.disabled).toBeTruthy();
                        expect(btnEl.getAttribute('aria-disabled')).toBe('true');

                        expect(btnEl.textContent).toBeTruthy();
                        expect(btnEl.textContent).toContain('Beispielabfragen');
                    });

                    it('... should contain another btn-group dropdown in example query btn-group', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                            1,
                            1
                        );

                        const outerButtonGroupDes = getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'div.accordion-button > div.awg-example-query-btn-group',
                            1,
                            1
                        );

                        getAndExpectDebugElementByCss(outerButtonGroupDes[0], 'div.btn-group.dropdown', 1, 1);
                    });

                    it('... should contain toggle button in example query btn-group dropdown', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                            1,
                            1
                        );

                        const dropdownButtonGroupDes = getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'div.accordion-button > div.awg-example-query-btn-group > div.btn-group.dropdown',
                            1,
                            1
                        );

                        getAndExpectDebugElementByCss(dropdownButtonGroupDes[0], 'button.btn.dropdown-toggle', 1, 1);
                    });

                    it('... should contain exmapleydropdown menu div with dropdown items in example query btn-group', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                            1,
                            1
                        );

                        const dropdownButtonGroupDes = getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'div.accordion-button > div.awg-example-query-btn-group > div.btn-group.dropdown',
                            1,
                            1
                        );

                        const menuDes = getAndExpectDebugElementByCss(
                            dropdownButtonGroupDes[0],
                            'div.dropdown-menu',
                            1,
                            1
                        );

                        getAndExpectDebugElementByCss(
                            menuDes[0],
                            'a.dropdown-item',
                            expectedQueryList.length,
                            expectedQueryList.length
                        );
                    });

                    it('... should display label on dropdown items in example query btn-group', () => {
                        const dropdownButtonGroupDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.accordion-button > div.awg-example-query-btn-group > div.btn-group.dropdown',
                            1,
                            1
                        );

                        const itemDes = getAndExpectDebugElementByCss(
                            dropdownButtonGroupDes[0],
                            'div.dropdown-menu > a.dropdown-item',
                            expectedQueryList.length,
                            expectedQueryList.length
                        );

                        expect(itemDes.length)
                            .withContext(`should be ${expectedQueryList.length}`)
                            .toBe(expectedQueryList.length);

                        const itemEl0 = itemDes[0].nativeElement;
                        const itemEl1 = itemDes[1].nativeElement;

                        expect(itemEl0.textContent).toBeTruthy();
                        expect(itemEl0.textContent)
                            .withContext(`should contain ${expectedQueryList[0].queryLabel}`)
                            .toContain(expectedQueryList[0].queryLabel);

                        expect(itemEl1.textContent).toBeTruthy();
                        expect(itemEl1.textContent)
                            .withContext(`should contain ${expectedQueryList[1].queryLabel}`)
                            .toContain(expectedQueryList[1].queryLabel);
                    });

                    it('... should disable current query in dropdown items in example query btn-group', async () => {
                        const itemDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.dropdown-menu > a.dropdown-item',
                            expectedQueryList.length,
                            expectedQueryList.length
                        );

                        expect(itemDes.length)
                            .withContext(`should be ${expectedQueryList.length}`)
                            .toBe(expectedQueryList.length);

                        const itemEl0 = itemDes[0].nativeElement;
                        const itemEl1 = itemDes[1].nativeElement;

                        expect(itemEl0).toHaveClass('disabled');
                        expect(itemEl1).not.toHaveClass('disabled');

                        component.query = expectedConstructQuery2;
                        await detectChangesOnPush(fixture);

                        expect(itemEl0).not.toHaveClass('disabled');
                        expect(itemEl1).toHaveClass('disabled');
                    });

                    it('... should trigger `onQueryListChange()` by click on dropdown item', async () => {
                        const itemDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.dropdown-menu > a.dropdown-item',
                            expectedQueryList.length,
                            expectedQueryList.length
                        );

                        expect(itemDes.length)
                            .withContext(`should be ${expectedQueryList.length}`)
                            .toBe(expectedQueryList.length);

                        const itemEl0 = itemDes[0].nativeElement;
                        const itemEl1 = itemDes[1].nativeElement;

                        expect(itemEl1).not.toHaveClass('disabled');

                        // Click on second item (first disabled)
                        click(itemEl1 as HTMLElement);
                        await detectChangesOnPush(fixture);

                        // Spy call with second query
                        expectSpyCall(onQueryListChangeSpy, 1, expectedConstructQuery2);

                        component.query = expectedConstructQuery2;
                        await detectChangesOnPush(fixture);

                        expect(itemEl0).not.toHaveClass('disabled');

                        // Click on first item (second disabled)
                        click(itemEl0 as HTMLElement);
                        await detectChangesOnPush(fixture);

                        // Spy call with first query
                        expectSpyCall(onQueryListChangeSpy, 2, expectedConstructQuery1);
                    });
                });

                it('... should contain CodeMirrorComponent (stubbed) in panel body', () => {
                    // CodeMirrorComponent
                    getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorStubComponent, 1, 1);
                });

                it('... should contain div with 3 buttons (Query, Reset, Clear) in panel body', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        bodyDes[0],
                        'div.awg-graph-visualizer-sparql-query-handle-buttons',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(divDes[0], 'button.btn', 3, 3);
                    const btnEl0 = btnDes[0].nativeElement;
                    const btnEl1 = btnDes[1].nativeElement;
                    const btnEl2 = btnDes[2].nativeElement;

                    expect(btnEl0.textContent).toBeTruthy();
                    expect(btnEl0.textContent).withContext(`should contain 'Query'`).toContain('Query');

                    expect(btnEl1.textContent).toBeTruthy();
                    expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                    expect(btnEl2.textContent).toBeTruthy();
                    expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');
                });

                it('... should trigger `performQuery()` by click on Query button', async () => {
                    const btnDes = getAndExpectDebugElementByCss(
                        bodyDes[0],
                        'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                        3,
                        3
                    );
                    const btnEl0 = btnDes[0].nativeElement;

                    expect(btnEl0.textContent).toBeTruthy();
                    expect(btnEl0.textContent).withContext(`should contain 'Query'`).toContain('Query');

                    // Click query button
                    click(btnEl0 as HTMLElement);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 1);
                    expectSpyCall(resetQuerySpy, 0);
                });

                it('... should trigger `resetQuery()` by click on Reset button', async () => {
                    const btnDes = getAndExpectDebugElementByCss(
                        bodyDes[0],
                        'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                        3,
                        3
                    );
                    const btnEl1 = btnDes[1].nativeElement;

                    expect(btnEl1.textContent).toBeTruthy();
                    expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                    // Click reset button
                    click(btnEl1 as HTMLElement);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 0);
                    expectSpyCall(resetQuerySpy, 1);
                });

                it('... should trigger `onEditorInputChange()` with empty string by click on Clear button', async () => {
                    const btnDes = getAndExpectDebugElementByCss(
                        bodyDes[0],
                        'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                        3,
                        3
                    );
                    const btnEl2 = btnDes[2].nativeElement;

                    expect(btnEl2.textContent).toBeTruthy();
                    expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');

                    // Click clear button
                    click(btnEl2 as HTMLElement);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(onEditorInputChangeSpy, 1, '');
                });
            });
        });

        describe('#isExampleQueriesEnabled()', () => {
            it('... should have a method `isExampleQueriesEnabled`', () => {
                expect(component.isExampleQueriesEnabled).toBeDefined();
            });

            it('... should return true if queryList = true and query is a valid query (has queryType, queryLabel, queryString)', () => {
                expect(component.isExampleQueriesEnabled()).toBeTrue();
            });

            it('... should return false if query is falsy', async () => {
                component.query = undefined;

                // Change detection
                await detectChangesOnPush(fixture);

                expect(component.isExampleQueriesEnabled()).toBeFalse();
            });

            it('... should return false if query.queryType is falsy', async () => {
                component.query.queryType = undefined;

                // Change detection
                await detectChangesOnPush(fixture);

                expect(component.isExampleQueriesEnabled()).toBeFalse();
            });

            it('... should return false if query.queryLabel is falsy', async () => {
                component.query.queryLabel = undefined;

                // Change detection
                await detectChangesOnPush(fixture);

                expect(component.isExampleQueriesEnabled()).toBeFalse();
            });

            it('... should return false if query.queryString is falsy', async () => {
                component.query.queryString = undefined;

                // Change detection
                await detectChangesOnPush(fixture);

                expect(component.isExampleQueriesEnabled()).toBeFalse();
            });

            it('... should return false if queryList is falsy', async () => {
                component.queryList = undefined;

                // Change detection
                await detectChangesOnPush(fixture);

                expect(component.isExampleQueriesEnabled()).toBeFalse();
            });

            it('... should return false if query (incl. type, label & string) and queryList not exist', async () => {
                component.query = undefined;
                component.queryList = undefined;

                // Change detection
                await detectChangesOnPush(fixture);

                expect(component.isExampleQueriesEnabled()).toBeFalse();
            });
        });

        describe('#onEditorInputChange()', () => {
            beforeEach(async () => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-sparql-query-header.accordion-header > div.accordion-button > button.btn-link',
                    1,
                    1
                );
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                await detectChangesOnPush(fixture);
            });

            it('... should have a method `onEditorInputChange`', () => {
                expect(component.onEditorInputChange).toBeDefined();
            });

            it('... should trigger on event from CodeMirrorComponent', () => {
                const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorStubComponent) as CodeMirrorStubComponent;

                const changedQueryString = expectedConstructQuery2.queryString;
                codeMirrorCmp.contentChange.emit(changedQueryString);

                expectSpyCall(onEditorInputChangeSpy, 1, changedQueryString);
            });

            it('... should trigger with empty string from click on Clear button', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl2 = btnDes[2].nativeElement;

                expect(btnEl2.textContent).toBeTruthy();
                expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');

                // Click clear button
                click(btnEl2 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(onEditorInputChangeSpy, 1, '');
            });

            it('... should emit updateQueryStringRequest on click', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl2 = btnDes[2].nativeElement;

                expect(btnEl2.textContent).toBeTruthy();
                expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');

                // Click clear button
                click(btnEl2 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(onEditorInputChangeSpy, 1, '');
                expectSpyCall(emitUpdateQueryStringRequestSpy, 1);
            });

            describe('... should emit provided query string on editor change', () => {
                it('... if string is thruthy', () => {
                    const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                    const codeMirrorCmp = codeMirrorDes[0].injector.get(
                        CodeMirrorStubComponent
                    ) as CodeMirrorStubComponent;

                    const changedQueryString = expectedConstructQuery2.queryString;
                    codeMirrorCmp.contentChange.emit(changedQueryString);

                    expectSpyCall(onEditorInputChangeSpy, 1, changedQueryString);
                    expectSpyCall(emitUpdateQueryStringRequestSpy, 1, changedQueryString);
                });

                it('... if string is empty', () => {
                    const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                    const codeMirrorCmp = codeMirrorDes[0].injector.get(
                        CodeMirrorStubComponent
                    ) as CodeMirrorStubComponent;

                    // Query is undefined
                    codeMirrorCmp.contentChange.emit('');

                    expectSpyCall(onEditorInputChangeSpy, 1, '');
                    expectSpyCall(emitUpdateQueryStringRequestSpy, 1, '');
                });
            });
        });

        describe('#onQueryListChange()', () => {
            it('... should have a method `onQueryListChange()`', () => {
                expect(component.onQueryListChange).toBeDefined();
            });

            it('... should trigger from click on dropdown item', async () => {
                const itemDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.dropdown-menu > a.dropdown-item',
                    expectedQueryList.length,
                    expectedQueryList.length
                );
                const itemEl0 = itemDes[0].nativeElement;
                const itemEl1 = itemDes[1].nativeElement;

                // Click on second item (first disabled)
                click(itemEl1 as HTMLElement);
                await detectChangesOnPush(fixture);

                // Spy call with second query
                expectSpyCall(onQueryListChangeSpy, 1, expectedConstructQuery2);

                component.query = expectedConstructQuery2;
                await detectChangesOnPush(fixture);

                expect(itemEl0).not.toHaveClass('disabled');

                // Click on first item (second disabled)
                click(itemEl0 as HTMLElement);
                await detectChangesOnPush(fixture);

                // Spy call with first query
                expectSpyCall(onQueryListChangeSpy, 2, expectedConstructQuery1);
            });

            it('... should trigger resetQuery on queryList change', async () => {
                const itemDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.dropdown-menu > a.dropdown-item',
                    expectedQueryList.length,
                    expectedQueryList.length
                );
                // Get second item (first disabled)
                const itemEl1 = itemDes[1].nativeElement;

                // Click on second item (first disabled)
                click(itemEl1 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 1, expectedConstructQuery2);
                expectSpyCall(resetQuerySpy, 1, expectedConstructQuery2);
            });

            it('... should not trigger resetQuery if no query is provided', async () => {
                component.onQueryListChange(undefined);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 1, undefined);
                expectSpyCall(resetQuerySpy, 0, 0);
            });

            it('... should not trigger resetQuery if no queryList is provided', async () => {
                component.queryList = undefined;
                component.onQueryListChange(expectedConstructQuery2);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 1, expectedConstructQuery2);
                expectSpyCall(resetQuerySpy, 0, 0);
            });

            it('... should find query in queryList and trigger resetQuery with correct query', async () => {
                // First query
                component.onQueryListChange(expectedConstructQuery1);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 1, expectedConstructQuery1);
                expectSpyCall(resetQuerySpy, 1, expectedConstructQuery1);

                // Second query
                component.onQueryListChange(expectedConstructQuery2);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 2, expectedConstructQuery2);
                expectSpyCall(resetQuerySpy, 2, expectedConstructQuery2);

                // Unknown query
                const otherQuery = new GraphSparqlQuery();
                otherQuery.queryLabel = 'Other Test Query';
                otherQuery.queryString = 'SELECT * WHERE { ?other rdfs:label ?query }';

                component.onQueryListChange(otherQuery);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 3, otherQuery);
                expectSpyCall(resetQuerySpy, 3, expectedConstructQuery1);
            });
        });

        describe('#onViewChange()', () => {
            it('... should have a method `onViewChange`', () => {
                expect(component.onViewChange).toBeDefined();
            });

            it('... should trigger on event from view handle button group', fakeAsync(() => {
                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-sparql-query-header.accordion-header',
                    1,
                    1
                );

                // ViewHandleButtongGroupComponent debug elements
                const viewHandleButtongGroupDes = getAndExpectDebugElementByDirective(
                    panelHeaderDes[0],
                    ViewHandleButtongGroupStubComponent,
                    1,
                    1
                );
                const viewHandleButtongGroupCmp = viewHandleButtongGroupDes[0].injector.get(
                    ViewHandleButtongGroupStubComponent
                ) as ViewHandleButtongGroupStubComponent;

                viewHandleButtongGroupCmp.viewChangeRequest.emit(ViewHandleTypes.GRAPH);

                expectSpyCall(onViewChangeSpy, 1, ViewHandleTypes.GRAPH);
            }));

            it('... should trigger switchQueryType(), onEditorInputChange() with queryString and performQuery()', () => {
                component.onViewChange(ViewHandleTypes.GRAPH);

                expectSpyCall(switchQueryTypeSpy, 1, ViewHandleTypes.GRAPH);
                expectSpyCall(onEditorInputChangeSpy, 1, expectedConstructQuery1.queryString);
                expectSpyCall(performQuerySpy, 1);
            });
        });

        describe('#performQuery()', () => {
            beforeEach(async () => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-sparql-query-header.accordion-header > div.accordion-button > button.btn-link',
                    1,
                    1
                );
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                await detectChangesOnPush(fixture);
            });

            it('... should have a method `performQuery`', () => {
                expect(component.performQuery).toBeDefined();
            });

            it('... should trigger from click on Query button', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl0 = btnDes[0].nativeElement;

                expect(btnEl0.textContent).toBeTruthy();
                expect(btnEl0.textContent).withContext(`should contain 'Query'`).toContain('Query');

                // Click query button
                click(btnEl0 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(performQuerySpy, 1);
            });

            describe('... should emit on click:', async () => {
                it('`performQueryRequest` if querystring is given', async () => {
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                        3,
                        3
                    );
                    const btnEl0 = btnDes[0].nativeElement;

                    expect(btnEl0.textContent).toBeTruthy();
                    expect(btnEl0.textContent).withContext(`should contain 'Query'`).toContain('Query');

                    // Click query button
                    click(btnEl0 as HTMLElement);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 1);
                    expectSpyCall(emitPerformQueryRequestSpy, 1);
                    expectSpyCall(emitErrorMessageRequestSpy, 0);
                });

                it('`errorMessageRequest` with errorMessage if querystring is not given', async () => {
                    const expectedErrorMessage = new ToastMessage('Empty query', 'Please enter a SPARQL query.');

                    component.query.queryString = '';
                    await detectChangesOnPush(fixture);

                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                        3,
                        3
                    );
                    const btnEl0 = btnDes[0].nativeElement;

                    expect(btnEl0.textContent).toBeTruthy();
                    expect(btnEl0.textContent).withContext(`should contain 'Query'`).toContain('Query');

                    // Click query button
                    click(btnEl0 as HTMLElement);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 1);
                    expectSpyCall(emitPerformQueryRequestSpy, 0);
                    expectSpyCall(emitErrorMessageRequestSpy, 1, expectedErrorMessage);
                });
            });
        });

        describe('#resetQuery()', () => {
            beforeEach(async () => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-sparql-query-header.accordion-header > div.accordion-button > button.btn-link',
                    1,
                    1
                );
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                await detectChangesOnPush(fixture);
            });

            it('... should have a method `resetQuery`', () => {
                expect(component.resetQuery).toBeDefined();
            });

            it('... should trigger from click on Reset button', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl1 = btnDes[1].nativeElement;

                expect(btnEl1.textContent).toBeTruthy();
                expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                // Click query button
                click(btnEl1 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(resetQuerySpy, 1);
            });

            it('... should not emit anything if no query is provided', async () => {
                // Query is undefined
                component.resetQuery(undefined);
                await detectChangesOnPush(fixture);

                expectSpyCall(resetQuerySpy, 1, undefined);
                expectSpyCall(emitResestQueryRequestSpy, 0);
            });

            it('... should emit request on click', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-sparql-query-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl1 = btnDes[1].nativeElement;

                expect(btnEl1.textContent).toBeTruthy();
                expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                // Click reset button
                click(btnEl1 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(resetQuerySpy, 1);
                expectSpyCall(emitResestQueryRequestSpy, 1);
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
                    query: new SimpleChange(component.query, [expectedSelectQuery1], false),
                });

                expectSpyCall(setViewTypeSpy, 2);
            });

            it('... should only trigger on changes of query if not first change', () => {
                expectSpyCall(setViewTypeSpy, 1);

                // Directly trigger ngOnChanges
                component.ngOnChanges({
                    query: new SimpleChange(component.query, [expectedSelectQuery1], true),
                });

                expectSpyCall(setViewTypeSpy, 1);
            });

            it('... should return ViewHandleTypes.GRAPH if querytype is `construct`', () => {
                component.query = expectedConstructQuery1;
                component.setViewType();

                expect(component.selectedViewType).toBe(ViewHandleTypes.GRAPH);

                component.query = expectedConstructQuery2;
                component.setViewType();

                expect(component.selectedViewType).toBe(ViewHandleTypes.GRAPH);
            });

            it('... should return ViewHandleTypes.TABLE if querytype is `select`', () => {
                component.query = expectedSelectQuery1;
                component.setViewType();

                expect(component.selectedViewType).toBe(ViewHandleTypes.TABLE);

                component.query = expectedSelectQuery2;
                component.setViewType();

                expect(component.selectedViewType).toBe(ViewHandleTypes.TABLE);
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

                expect(component.query.queryType).toBeTruthy();
                expect(component.query.queryType)
                    .withContext(`should be ${expectedSelectQuery1.queryType}`)
                    .toBe(expectedSelectQuery1.queryType);
                expect(component.query.queryString).toBeTruthy();
                expect(component.query.queryString)
                    .withContext(`should be ${expectedSelectQuery1.queryString}`)
                    .toBe(expectedSelectQuery1.queryString);
            });

            it('... should switch querytype and string to `construct` if requested view is `graph`', () => {
                // Switch to TABLE view
                component.switchQueryType(ViewHandleTypes.TABLE);

                component.query.queryType = expectedSelectQuery1.queryType;
                component.query.queryString = expectedSelectQuery1.queryString;

                // Switch back to GRAPH view
                component.switchQueryType(ViewHandleTypes.GRAPH);

                expect(component.query.queryType).toBeTruthy();
                expect(component.query.queryType)
                    .withContext(`should be ${expectedConstructQuery1.queryType}`)
                    .toBe(expectedConstructQuery1.queryType);
                expect(component.query.queryString).toBeTruthy();
                expect(component.query.queryString)
                    .withContext(`should be ${expectedConstructQuery1.queryString}`)
                    .toBe(expectedConstructQuery1.queryString);
            });

            it('... should do nothing if requested view is `grid`', () => {
                component.query.queryType = expectedConstructQuery1.queryType;
                component.query.queryString = expectedConstructQuery1.queryString;

                component.switchQueryType(ViewHandleTypes.GRID);

                expect(component.query.queryType).toBeTruthy();
                expect(component.query.queryType)
                    .withContext(`should be ${expectedConstructQuery1.queryType}`)
                    .toBe(expectedConstructQuery1.queryType);
                expect(component.query.queryString).toBeTruthy();
                expect(component.query.queryString)
                    .withContext(`should be ${expectedConstructQuery1.queryString}`)
                    .toBe(expectedConstructQuery1.queryString);
            });

            it('... should throw error if requested view is not `table`, `graph` or `grid`', () => {
                component.query.queryType = expectedConstructQuery1.queryType;
                component.query.queryString = expectedConstructQuery1.queryString;

                expect(() => component.switchQueryType(undefined)).toThrowError(
                    `The view must be ${ViewHandleTypes.GRAPH} or ${ViewHandleTypes.TABLE}, but was: undefined.`
                );
            });
        });

        describe('#togglePanel()', () => {
            it('... should have a method `togglePanel()`', () => {
                expect(component.togglePanel).toBeDefined();
            });

            it('... should return empty string if isFullscreen = false', () => {
                expect(component.togglePanel()).not.toBeTruthy();
            });

            it('... should return panel id if isFullscreen = true', () => {
                const expectedId = 'awg-graph-visualizer-sparql-query';

                // Set fullscreen flag to true
                component.isFullscreen = true;
                expect(component.togglePanel()).withContext(`should be ${expectedId}`).toBe(expectedId);
            });
        });

        describe('#preventPanelCollapseOnFullscreen()', () => {
            it('... should have a method `preventPanelCollapseOnFullscreen`', () => {
                expect(component.preventPanelCollapseOnFullscreen).toBeDefined();
            });

            it('... should trigger on event from ngb-accordion', () => {
                const accordionDes = getAndExpectDebugElementByDirective(compDe, NgbAccordion, 1, 1);
                const accordionCmp = accordionDes[0].injector.get(NgbAccordion) as NgbAccordion;

                const panelChangeEvent: NgbPanelChangeEvent = {
                    panelId: 'panelChangeId',
                    nextState: true,
                    preventDefault: () => {
                        // Intentional empty test override
                    },
                };

                // Emit change event from accordion
                accordionCmp.panelChange.emit(panelChangeEvent);

                expectSpyCall(preventPanelCollapseOnFullscreenSpy, 1, panelChangeEvent);
            });

            it('... should not do anything if no $event is provided', () => {
                const accordionDes = getAndExpectDebugElementByDirective(compDe, NgbAccordion, 1, 1);
                const accordionCmp = accordionDes[0].injector.get(NgbAccordion) as NgbAccordion;

                // Emit undefined change event from accordion
                accordionCmp.panelChange.emit(undefined);

                expectSpyCall(preventPanelCollapseOnFullscreenSpy, 1, undefined);
            });

            it('... should trigger $event.preventDefault() if isFullscreen == true && $event.nextState == false', () => {
                const accordionDes = getAndExpectDebugElementByDirective(compDe, NgbAccordion, 1, 1);
                const accordionCmp = accordionDes[0].injector.get(NgbAccordion) as NgbAccordion;

                const panelChangeEvent: NgbPanelChangeEvent = {
                    panelId: 'panelChangeId',
                    nextState: false,
                    preventDefault: () => {
                        // Intentional empty test override
                    },
                };
                const preventDefaultSpy: Spy = spyOn(panelChangeEvent, 'preventDefault').and.callThrough();

                // Set fullscreen mode
                component.isFullscreen = true;

                // Emit change event from accordion
                accordionCmp.panelChange.emit(panelChangeEvent);

                expectSpyCall(preventPanelCollapseOnFullscreenSpy, 1, panelChangeEvent);
                expectSpyCall(preventDefaultSpy, 1, undefined);
            });

            it('... should not trigger $event.preventDefault() if $event.nextState == true', () => {
                const accordionDes = getAndExpectDebugElementByDirective(compDe, NgbAccordion, 1, 1);
                const accordionCmp = accordionDes[0].injector.get(NgbAccordion) as NgbAccordion;

                const panelChangeEvent: NgbPanelChangeEvent = {
                    panelId: 'panelChangeId',
                    nextState: true,
                    preventDefault: () => {
                        // Intentional empty test override
                    },
                };
                const preventDefaultSpy: Spy = spyOn(panelChangeEvent, 'preventDefault').and.callThrough();

                // Set fullscreen mode
                component.isFullscreen = true;

                // Emit change event from accordion
                accordionCmp.panelChange.emit(panelChangeEvent);

                expectSpyCall(preventPanelCollapseOnFullscreenSpy, 1, panelChangeEvent);
                expectSpyCall(preventDefaultSpy, 0, undefined);
            });

            it('... should not trigger $event.preventDefault() if isFullscreen == false', () => {
                const accordionDes = getAndExpectDebugElementByDirective(compDe, NgbAccordion, 1, 1);
                const accordionCmp = accordionDes[0].injector.get(NgbAccordion) as NgbAccordion;

                const panelChangeEvent: NgbPanelChangeEvent = {
                    panelId: 'panelChangeId',
                    nextState: false,
                    preventDefault: () => {
                        // Intentional empty test override
                    },
                };
                const preventDefaultSpy: Spy = spyOn(panelChangeEvent, 'preventDefault').and.callThrough();

                // Unset fullscreen mode
                component.isFullscreen = false;

                // Emit change event from accordion
                accordionCmp.panelChange.emit(panelChangeEvent);

                expectSpyCall(preventPanelCollapseOnFullscreenSpy, 1, panelChangeEvent);
                expectSpyCall(preventDefaultSpy, 0, undefined);
            });
        });
    });
});
