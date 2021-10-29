import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';

import { NgbAccordion, NgbAccordionModule, NgbConfig, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

import { click } from '@testing/click-helper';
import { customJasmineMatchers } from '@testing/custom-matchers';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { GraphSparqlQuery } from '@awg-views/edition-view/models';

import { SparqlEditorComponent } from './sparql-editor.component';

// eslint-disable-next-line @angular-eslint/component-selector
@Component({ selector: 'ngx-codemirror', template: '' })
class CodeMirrorStubComponent {
    @Input() options: {
        [key: string]: any;
    };
    @Input() ngModel: string;
    @Output() ngModelChange: EventEmitter<string> = new EventEmitter<string>();
}

describe('SparqlEditorComponent (DONE)', () => {
    let component: SparqlEditorComponent;
    let fixture: ComponentFixture<SparqlEditorComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedQuery1: GraphSparqlQuery;
    let expectedQuery2: GraphSparqlQuery;
    let expectedQueryList: GraphSparqlQuery[];
    let expectedCmSparqlConfig: {
        [key: string]: any;
    };
    let expectedIsFullscreen: boolean;

    let isExampleQueriesEnabledSpy: Spy;
    let onEditorInputChangeSpy: Spy;
    let onQueryListChangeSpy: Spy;
    let performQuerySpy: Spy;
    let preventPanelCollapseOnFullscreenSpy: Spy;
    let resetQuerySpy: Spy;
    let emitPerformQueryRequestSpy: Spy;
    let emitResestQueryRequestSpy: Spy;
    let emitUpdateQueryStringRequestSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [NgbAccordionWithConfigModule],
                declarations: [SparqlEditorComponent, CodeMirrorStubComponent, NgbAccordion],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        // Add custom jasmine matchers (ToHaveCssClass)
        jasmine.addMatchers(customJasmineMatchers);

        fixture = TestBed.createComponent(SparqlEditorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedQuery1 = new GraphSparqlQuery();
        expectedQuery1.queryType = 'select';
        expectedQuery1.queryLabel = 'Test Query 1';
        expectedQuery1.queryString = 'SELECT * WHERE { ?test ?has ?success }';

        expectedQuery2 = new GraphSparqlQuery();
        expectedQuery2.queryType = 'select';
        expectedQuery2.queryLabel = 'Test Query 2';
        expectedQuery2.queryString = 'SELECT * WHERE { ?success a ?test }';

        expectedQueryList = [expectedQuery1, expectedQuery2];

        expectedIsFullscreen = false;

        expectedCmSparqlConfig = {
            lineNumbers: true,
            firstLineNumber: 1,
            lineWrapping: true,
            matchBrackets: true,
            mode: 'sparql',
        };

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        isExampleQueriesEnabledSpy = spyOn(component, 'isExampleQueriesEnabled').and.callThrough();
        onEditorInputChangeSpy = spyOn(component, 'onEditorInputChange').and.callThrough();
        onQueryListChangeSpy = spyOn(component, 'onQueryListChange').and.callThrough();
        performQuerySpy = spyOn(component, 'performQuery').and.callThrough();
        preventPanelCollapseOnFullscreenSpy = spyOn(component, 'preventPanelCollapseOnFullscreen').and.callThrough();
        resetQuerySpy = spyOn(component, 'resetQuery').and.callThrough();
        emitPerformQueryRequestSpy = spyOn(component.performQueryRequest, 'emit').and.callThrough();
        emitResestQueryRequestSpy = spyOn(component.resetQueryRequest, 'emit').and.callThrough();
        emitUpdateQueryStringRequestSpy = spyOn(component.updateQueryStringRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have queryList', () => {
            expect(component.queryList).toBeUndefined('should be undefined');
        });

        it('should not have query', () => {
            expect(component.query).toBeUndefined('should be undefined');
        });

        it('should not have isFullscreen', () => {
            expect(component.isFullscreen).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.card) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 0, 0, 'yet');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.query = expectedQuery1;
            component.queryList = expectedQueryList;
            component.isFullscreen = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `queryList` input', () => {
            expect(component.queryList).toBeDefined('should be defined');
            expect(component.queryList).toEqual(expectedQueryList, `should equal ${expectedQueryList}`);
        });

        it('should have `query` input', () => {
            expect(component.query).toBeDefined('should be defined');
            expect(component.query).toEqual(expectedQuery1, `should equal ${expectedQuery1}`);
        });

        it('should have `isFullScreen` input', () => {
            expect(component.isFullscreen).toBeDefined('should be defined');
            expect(component.isFullscreen).toBe(expectedIsFullscreen, `should equal ${expectedIsFullscreen}`);
        });

        describe('VIEW', () => {
            describe('not in fullscreen mode', () => {
                describe('with closed panel', () => {
                    it('... should contain one ngb-accordion with panel (div.card) header and collapsed body', () => {
                        // Ngb-accordion debug element
                        const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                        // Panel (div.card)
                        const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 1, 1); // Panel (div.card)
                        // Header
                        getAndExpectDebugElementByCss(
                            panelDes[0],
                            'div#awg-graph-visualizer-query-header.card-header',
                            1,
                            1
                        ); // Panel (div.card)
                        // No body
                        getAndExpectDebugElementByCss(
                            panelDes[0],
                            'div#awg-graph-visualizer-query > div.card-body',
                            0,
                            0
                        );
                    });

                    it('... should display panel header button', () => {
                        // Panel header button
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-query-header > div > button.btn-link.panel-btn',
                            1,
                            1
                        );

                        const btnEl = btnDes[0].nativeElement;

                        // Check button content
                        expect(btnEl.textContent).toBeDefined();
                        expect(btnEl.textContent).toContain('SPARQL Abfrage', 'should be SPARQL Abfrage');
                    });

                    it('... should toggle panel body on click', async () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-query-header.card-header',
                            1,
                            1
                        );

                        // Button debug elements
                        const btnDes = getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'button.btn-link.panel-btn',
                            1,
                            1
                        );
                        // Button native elements to click on
                        const btnEl = btnDes[0].nativeElement;

                        // Panel body is closed
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-query > div.card-body',
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
                            'div#awg-graph-visualizer-query > div.card-body',
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
                            'div#awg-graph-visualizer-query > div.card-body',
                            0,
                            0,
                            'collapsed'
                        );
                    });

                    it('... should contain an example query btn-group in panel header if isExampleQueriesEnabled = true', async () => {
                        isExampleQueriesEnabledSpy.and.returnValue(true);

                        await detectChangesOnPush(fixture);

                        // Panel header div.btn-group
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-query-header > div > div.btn-group',
                            1,
                            1
                        );
                    });

                    it('... should not contain an example query btn-group in panel header if isExampleQueriesEnabled = false', async () => {
                        isExampleQueriesEnabledSpy.and.returnValue(false);

                        await detectChangesOnPush(fixture);

                        // Panel header div.btn-group
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-query-header > div > div.btn-group',
                            0,
                            0
                        );
                    });

                    it('... should display an disabled label button in example query btn-group', () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-query-header > div > div.btn-group > button.btn',
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
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-query-header > div > div.btn-group > div.btn-group',
                            1,
                            1
                        );
                    });

                    it('... should contain toggle button in btn-group dropdown', () => {
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-query-header > div > div.btn-group > div.btn-group > button.btn.dropdown-toggle-split',
                            1,
                            1
                        );
                    });

                    it('... should contain dropdown menu div with dropdown items', () => {
                        const menuDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-query-header > div > div.btn-group > div.btn-group > div.dropdown-menu',
                            1,
                            1
                        );

                        getAndExpectDebugElementByCss(
                            menuDes[0],
                            'div.dropdown-menu > button.dropdown-item',
                            expectedQueryList.length,
                            expectedQueryList.length
                        );
                    });

                    it('... should display label on dropdown items', () => {
                        const itemDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.dropdown-menu > button.dropdown-item',
                            expectedQueryList.length,
                            expectedQueryList.length
                        );

                        expect(itemDes.length).toBe(expectedQueryList.length, `should be ${expectedQueryList.length}`);

                        const itemEl0 = itemDes[0].nativeElement;
                        const itemEl1 = itemDes[1].nativeElement;

                        expect(itemEl0.textContent).toBeTruthy();
                        expect(itemEl0.textContent).toContain(
                            expectedQueryList[0].queryLabel,
                            `should contain ${expectedQueryList[0].queryLabel}`
                        );

                        expect(itemEl1.textContent).toBeTruthy();
                        expect(itemEl1.textContent).toContain(
                            expectedQueryList[1].queryLabel,
                            `should contain ${expectedQueryList[1].queryLabel}`
                        );
                    });

                    it('... should disable current query in dropdown items', async () => {
                        const itemDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.dropdown-menu > button.dropdown-item',
                            expectedQueryList.length,
                            expectedQueryList.length
                        );

                        expect(itemDes.length).toBe(expectedQueryList.length, `should be ${expectedQueryList.length}`);

                        const itemEl0 = itemDes[0].nativeElement;
                        const itemEl1 = itemDes[1].nativeElement;

                        expect(itemEl0).toHaveCssClass('disabled');
                        expect(itemEl1).not.toHaveCssClass('disabled');

                        component.query = expectedQuery2;
                        await detectChangesOnPush(fixture);

                        expect(itemEl0).not.toHaveCssClass('disabled');
                        expect(itemEl1).toHaveCssClass('disabled');
                    });

                    it('... should trigger `onQueryListChange()` by click on dropdown item', async () => {
                        const itemDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.dropdown-menu > button.dropdown-item',
                            expectedQueryList.length,
                            expectedQueryList.length
                        );

                        expect(itemDes.length).toBe(expectedQueryList.length, `should be ${expectedQueryList.length}`);

                        const itemEl0 = itemDes[0].nativeElement;
                        const itemEl1 = itemDes[1].nativeElement;

                        expect(itemEl1).not.toHaveCssClass('disabled');

                        // Click on second item (first disabled)
                        click(itemEl1 as HTMLElement);
                        await detectChangesOnPush(fixture);

                        // Spy call with second query
                        expectSpyCall(onQueryListChangeSpy, 1, expectedQuery2);

                        component.query = expectedQuery2;
                        await detectChangesOnPush(fixture);

                        expect(itemEl0).not.toHaveCssClass('disabled');

                        // Click on first item (second disabled)
                        click(itemEl0 as HTMLElement);
                        await detectChangesOnPush(fixture);

                        // Spy call with first query
                        expectSpyCall(onQueryListChangeSpy, 2, expectedQuery1);
                    });
                });

                describe('with open panel', () => {
                    let bodyDes: DebugElement[];

                    beforeEach(async () => {
                        // Open panel by click on header button
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-query-header.card-header > div > button.btn-link.panel-btn',
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
                            'div#awg-graph-visualizer-query > div.card-body',
                            1,
                            1
                        );
                    });

                    it('... should contain CodeMirrorComponent (stubbed) in panel body', () => {
                        // CodeMirrorComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorStubComponent, 1, 1);
                    });

                    it('... should contain div with two buttons (Query, Reset) in panel body', () => {
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div', 1, 1);

                        const btnDes = getAndExpectDebugElementByCss(divDes[0], 'button.btn', 2, 2);
                        const btnEl0 = btnDes[0].nativeElement;
                        const btnEl1 = btnDes[1].nativeElement;

                        expect(btnEl0.textContent).toBeTruthy();
                        expect(btnEl0.textContent).toContain('Query', 'should contain Query');

                        expect(btnEl1.textContent).toBeTruthy();
                        expect(btnEl1.textContent).toContain('Reset', 'should contain Reset');
                    });

                    it('... should trigger `performQuery()` by click on Query button', async () => {
                        const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 2, 2);
                        const btnEl0 = btnDes[0].nativeElement;
                        expect(btnEl0.textContent).toContain('Query', 'should contain Query');

                        // Click query button
                        click(btnEl0 as HTMLElement);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(performQuerySpy, 1);
                        expectSpyCall(resetQuerySpy, 0);
                    });

                    it('... should trigger `resetQuery()` by click on Reset button', async () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.card-body > div > button.btn',
                            2,
                            2
                        );
                        const btnEl1 = btnDes[1].nativeElement;
                        expect(btnEl1.textContent).toContain('Reset', 'should contain Query');

                        // Click reset button
                        click(btnEl1 as HTMLElement);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(performQuerySpy, 0);
                        expectSpyCall(resetQuerySpy, 1);
                    });
                });
            });

            describe('in fullscreen mode', () => {
                let bodyDes: DebugElement[];

                beforeEach(() => {
                    // Open panel by click on header button
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-query-header.card-header > div > button.btn-link.panel-btn',
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
                        'div#awg-graph-visualizer-query > div.card-body',
                        1,
                        1
                    );

                    // Set fullscreen mode
                    component.isFullscreen = true;
                });

                it('... should contain one ngb-accordion with panel (div.card) header and open body', () => {
                    // Ngb-accordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                    // Panel (div.card)
                    const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 1, 1); // Panel (div.card)
                    // Header
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-query-header.card-header',
                        1,
                        1
                    ); // Panel (div.card)
                    // Body open
                    getAndExpectDebugElementByCss(panelDes[0], 'div#awg-graph-visualizer-query > div.card-body', 1, 1);
                });

                it('... should display panel header button', () => {
                    // Panel header button
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-query-header > div > button.btn-link.panel-btn',
                        1,
                        1
                    );

                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expect(btnEl.textContent).toBeDefined();
                    expect(btnEl.textContent).toContain('SPARQL Abfrage', 'should be SPARQL Abfrage');
                });

                it('... should not toggle panel body on click', async () => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-query-header.card-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.btn-link.panel-btn', 1, 1);
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    // Panel body is open
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-query > div.card-body',
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
                        'div#awg-graph-visualizer-query > div.card-body',
                        1,
                        1,
                        'open'
                    );
                });

                it('... should contain an example query btn-group in panel header if isExampleQueriesEnabled = true', async () => {
                    isExampleQueriesEnabledSpy.and.returnValue(true);

                    await detectChangesOnPush(fixture);

                    // Panel header div.btn-group
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-query-header > div > div.btn-group',
                        1,
                        1
                    );
                });

                it('... should not contain an example query btn-group in panel header if isExampleQueriesEnabled = false', async () => {
                    isExampleQueriesEnabledSpy.and.returnValue(false);

                    await detectChangesOnPush(fixture);

                    // Panel header div.btn-group
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-query-header > div > div.btn-group',
                        0,
                        0
                    );
                });

                it('... should display an disabled label button in example query btn-group', () => {
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-query-header > div > div.btn-group > button.btn',
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
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-query-header > div > div.btn-group > div.btn-group',
                        1,
                        1
                    );
                });

                it('... should contain toggle button in btn-group dropdown', () => {
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-query-header > div > div.btn-group > div.btn-group > button.btn.dropdown-toggle-split',
                        1,
                        1
                    );
                });

                it('... should contain dropdown menu div with dropdown items', () => {
                    const menuDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-query-header > div > div.btn-group > div.btn-group > div.dropdown-menu',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(
                        menuDes[0],
                        'div.dropdown-menu > button.dropdown-item',
                        expectedQueryList.length,
                        expectedQueryList.length
                    );
                });

                it('... should display label on dropdown items', () => {
                    const itemDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.dropdown-menu > button.dropdown-item',
                        expectedQueryList.length,
                        expectedQueryList.length
                    );

                    expect(itemDes.length).toBe(expectedQueryList.length, `should be ${expectedQueryList.length}`);

                    const itemEl0 = itemDes[0].nativeElement;
                    const itemEl1 = itemDes[1].nativeElement;

                    expect(itemEl0.textContent).toBeTruthy();
                    expect(itemEl0.textContent).toContain(
                        expectedQueryList[0].queryLabel,
                        `should contain ${expectedQueryList[0].queryLabel}`
                    );

                    expect(itemEl1.textContent).toBeTruthy();
                    expect(itemEl1.textContent).toContain(
                        expectedQueryList[1].queryLabel,
                        `should contain ${expectedQueryList[1].queryLabel}`
                    );
                });

                it('... should disable current query in dropdown items', async () => {
                    const itemDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.dropdown-menu > button.dropdown-item',
                        expectedQueryList.length,
                        expectedQueryList.length
                    );

                    expect(itemDes.length).toBe(expectedQueryList.length, `should be ${expectedQueryList.length}`);

                    const itemEl0 = itemDes[0].nativeElement;
                    const itemEl1 = itemDes[1].nativeElement;

                    expect(itemEl0).toHaveCssClass('disabled');
                    expect(itemEl1).not.toHaveCssClass('disabled');

                    component.query = expectedQuery2;
                    await detectChangesOnPush(fixture);

                    expect(itemEl0).not.toHaveCssClass('disabled');
                    expect(itemEl1).toHaveCssClass('disabled');
                });

                it('... should trigger `onQueryListChange()` by click on dropdown item', async () => {
                    const itemDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.dropdown-menu > button.dropdown-item',
                        expectedQueryList.length,
                        expectedQueryList.length
                    );

                    expect(itemDes.length).toBe(expectedQueryList.length, `should be ${expectedQueryList.length}`);

                    const itemEl0 = itemDes[0].nativeElement;
                    const itemEl1 = itemDes[1].nativeElement;

                    expect(itemEl1).not.toHaveCssClass('disabled');

                    // Click on second item (first disabled)
                    click(itemEl1 as HTMLElement);
                    await detectChangesOnPush(fixture);

                    // Spy call with second query
                    expectSpyCall(onQueryListChangeSpy, 1, expectedQuery2);

                    component.query = expectedQuery2;
                    await detectChangesOnPush(fixture);

                    expect(itemEl0).not.toHaveCssClass('disabled');

                    // Click on first item (second disabled)
                    click(itemEl0 as HTMLElement);
                    await detectChangesOnPush(fixture);

                    // Spy call with first query
                    expectSpyCall(onQueryListChangeSpy, 2, expectedQuery1);
                });

                it('... should contain CodeMirrorComponent (stubbed) in panel body', () => {
                    // CodeMirrorComponent
                    getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorStubComponent, 1, 1);
                });

                it('... should contain div with two buttons (Query, Reset) in panel body', () => {
                    const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div', 1, 1);

                    const btnDes = getAndExpectDebugElementByCss(divDes[0], 'button.btn', 2, 2);
                    const btnEl0 = btnDes[0].nativeElement;
                    const btnEl1 = btnDes[1].nativeElement;

                    expect(btnEl0.textContent).toBeTruthy();
                    expect(btnEl0.textContent).toContain('Query', 'should contain Query');

                    expect(btnEl1.textContent).toBeTruthy();
                    expect(btnEl1.textContent).toContain('Reset', 'should contain Reset');
                });

                it('... should trigger `performQuery()` by click on Query button', async () => {
                    const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 2, 2);
                    const btnEl0 = btnDes[0].nativeElement;
                    expect(btnEl0.textContent).toContain('Query', 'should contain Query');

                    // Click query button
                    click(btnEl0 as HTMLElement);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 1);
                    expectSpyCall(resetQuerySpy, 0);
                });

                it('... should trigger `resetQuery()` by click on Reset button', async () => {
                    const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div.card-body > div > button.btn', 2, 2);
                    const btnEl1 = btnDes[1].nativeElement;
                    expect(btnEl1.textContent).toContain('Reset', 'should contain Query');

                    // Click reset button
                    click(btnEl1 as HTMLElement);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 0);
                    expectSpyCall(resetQuerySpy, 1);
                });
            });
        });

        describe('#isExampleQueriesEnabled', () => {
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

        describe('#onEditorInputChange', () => {
            beforeEach(async () => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-query-header.card-header > div > button.btn-link.panel-btn',
                    1,
                    1
                );
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                await detectChangesOnPush(fixture);
            });

            it('... should trigger on event from CodeMirrorComponent', () => {
                const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorStubComponent) as CodeMirrorStubComponent;

                const changedQueryString = expectedQuery2.queryString;
                codeMirrorCmp.ngModelChange.emit(changedQueryString);

                expectSpyCall(onEditorInputChangeSpy, 1, changedQueryString);
            });

            it('... should not emit anything if no query string is provided', () => {
                const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorStubComponent) as CodeMirrorStubComponent;

                // Query is undefined
                codeMirrorCmp.ngModelChange.emit('');

                expectSpyCall(onEditorInputChangeSpy, 1, '');
                expectSpyCall(emitUpdateQueryStringRequestSpy, 0);
            });

            it('... should emit provided query string on editor change', () => {
                const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorStubComponent) as CodeMirrorStubComponent;

                const changedQueryString = expectedQuery2.queryString;
                codeMirrorCmp.ngModelChange.emit(changedQueryString);

                expectSpyCall(onEditorInputChangeSpy, 1, changedQueryString);
                expectSpyCall(emitUpdateQueryStringRequestSpy, 1, changedQueryString);
            });
        });

        describe('#onQueryListChange', () => {
            it('... should trigger from click on dropdown item', async () => {
                const itemDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.dropdown-menu > button.dropdown-item',
                    expectedQueryList.length,
                    expectedQueryList.length
                );
                const itemEl0 = itemDes[0].nativeElement;
                const itemEl1 = itemDes[1].nativeElement;

                // Click on second item (first disabled)
                click(itemEl1 as HTMLElement);
                await detectChangesOnPush(fixture);

                // Spy call with second query
                expectSpyCall(onQueryListChangeSpy, 1, expectedQuery2);

                component.query = expectedQuery2;
                await detectChangesOnPush(fixture);

                expect(itemEl0).not.toHaveCssClass('disabled');

                // Click on first item (second disabled)
                click(itemEl0 as HTMLElement);
                await detectChangesOnPush(fixture);

                // Spy call with first query
                expectSpyCall(onQueryListChangeSpy, 2, expectedQuery1);
            });

            it('... should trigger resetQuery on queryList change', async () => {
                const itemDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.dropdown-menu > button.dropdown-item',
                    expectedQueryList.length,
                    expectedQueryList.length
                );
                const itemEl0 = itemDes[0].nativeElement;
                const itemEl1 = itemDes[1].nativeElement;

                // Click on second item (first disabled)
                click(itemEl1 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 1, expectedQuery2);
                expectSpyCall(resetQuerySpy, 1, expectedQuery2);
            });

            it('... should not trigger resetQuery if no query is provided', async () => {
                component.onQueryListChange(undefined);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 1, undefined);
                expectSpyCall(resetQuerySpy, 0, 0);
            });

            it('... should not trigger resetQuery if no queryList is provided', async () => {
                component.queryList = undefined;
                component.onQueryListChange(expectedQuery2);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 1, expectedQuery2);
                expectSpyCall(resetQuerySpy, 0, 0);
            });

            it('... should find query in queryList and trigger resetQuery with correct query', async () => {
                // First query
                component.onQueryListChange(expectedQuery1);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 1, expectedQuery1);
                expectSpyCall(resetQuerySpy, 1, expectedQuery1);

                // Second query
                component.onQueryListChange(expectedQuery2);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 2, expectedQuery2);
                expectSpyCall(resetQuerySpy, 2, expectedQuery2);

                // Unknown query
                const otherQuery = new GraphSparqlQuery();
                otherQuery.queryLabel = 'Other Test Query';
                otherQuery.queryString = 'SELECT * WHERE { ?other rdfs:label ?query }';

                component.onQueryListChange(otherQuery);
                await detectChangesOnPush(fixture);

                expectSpyCall(onQueryListChangeSpy, 3, otherQuery);
                expectSpyCall(resetQuerySpy, 3, expectedQuery1);
            });
        });

        describe('#performQuery', () => {
            beforeEach(async () => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-query-header.card-header > div > button.btn-link.panel-btn',
                    1,
                    1
                );
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                await detectChangesOnPush(fixture);
            });

            it('... should trigger from click on Query button', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-query > div.card-body > div > button.btn',
                    2,
                    2
                );
                const btnEl0 = btnDes[0].nativeElement;
                expect(btnEl0.textContent).toContain('Query', 'should contain Query');

                // Click query button
                click(btnEl0 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(performQuerySpy, 1);
            });

            it('... should emit request on click', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-query > div.card-body > div > button.btn',
                    2,
                    2
                );
                const btnEl0 = btnDes[0].nativeElement;
                expect(btnEl0.textContent).toContain('Query', 'should contain Query');

                // Click query button
                click(btnEl0 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(performQuerySpy, 1);
                expectSpyCall(emitPerformQueryRequestSpy, 1);
            });
        });

        describe('#resetQuery', () => {
            beforeEach(async () => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-query-header.card-header > div > button.btn-link.panel-btn',
                    1,
                    1
                );
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                await detectChangesOnPush(fixture);
            });

            it('... should trigger from click on Reset button', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-query > div.card-body > div > button.btn',
                    2,
                    2
                );
                const btnEl1 = btnDes[1].nativeElement;
                expect(btnEl1.textContent).toContain('Reset', 'should contain Reset');

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
                    'div#awg-graph-visualizer-query > div.card-body > div > button.btn',
                    2,
                    2
                );
                const btnEl1 = btnDes[1].nativeElement;
                expect(btnEl1.textContent).toContain('Reset', 'should contain Reset');

                // Click reset button
                click(btnEl1 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(resetQuerySpy, 1);
                expectSpyCall(emitResestQueryRequestSpy, 1);
            });
        });

        describe('#togglePanel', () => {
            it('... should return empty string if isFullscreen = false', () => {
                expect(component.togglePanel()).not.toBeTruthy();
            });

            it('... should return panel id if isFullscreen = true', () => {
                const expectedId = 'awg-graph-visualizer-query';

                // Set fullscreen flag to true
                component.isFullscreen = true;
                expect(component.togglePanel()).toBe(expectedId, `should be ${expectedId}`);
            });
        });

        describe('#preventPanelCollapseOnFullscreen', () => {
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
