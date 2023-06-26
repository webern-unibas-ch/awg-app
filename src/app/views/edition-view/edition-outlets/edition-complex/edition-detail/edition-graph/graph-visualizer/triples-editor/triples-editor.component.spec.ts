import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { turtle } from '@codemirror/legacy-modes/mode/turtle';
import { NgbAccordionDirective, NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditorView } from 'codemirror';
import Spy = jasmine.Spy;

import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { CmMode } from '@awg-shared/codemirror/codemirror.component';
import { ToastMessage } from '@awg-shared/toast/toast.service';

import { TriplesEditorComponent } from './triples-editor.component';

@Component({ selector: 'awg-codemirror', template: '' })
class CodeMirrorStubComponent {
    @Input() mode: CmMode;
    @Input() content: string;
    @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() editor: EditorView;
}

describe('TriplesEditorComponent (DONE)', () => {
    let component: TriplesEditorComponent;
    let fixture: ComponentFixture<TriplesEditorComponent>;
    let compDe: DebugElement;

    let expectedTriples: string;
    let expectedCmTurtleMode: CmMode;
    let expectedIsFullscreen: boolean;

    let onEditorInputChangeSpy: Spy;
    let performQuerySpy: Spy;
    let isAccordionItemDisabledSpy: Spy;
    let isAccordionItemCollapsedSpy: Spy;
    let resetTriplesSpy: Spy;
    let emitErrorMessageSpy: Spy;
    let emitPerformQueryRequestSpy: Spy;
    let emitResetTriplesRequestSpy: Spy;
    let emitUpdateTriplesRequestSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgbAccordionWithConfigModule, NgbAccordionDirective],
            declarations: [TriplesEditorComponent, CodeMirrorStubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TriplesEditorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedIsFullscreen = false;
        expectedCmTurtleMode = turtle;

        expectedTriples = 'example:Test example:has example:Success';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        onEditorInputChangeSpy = spyOn(component, 'onEditorInputChange').and.callThrough();
        performQuerySpy = spyOn(component, 'performQuery').and.callThrough();
        isAccordionItemCollapsedSpy = spyOn(component, 'isAccordionItemCollapsed').and.callThrough();
        isAccordionItemDisabledSpy = spyOn(component, 'isAccordionItemDisabled').and.callThrough();
        resetTriplesSpy = spyOn(component, 'resetTriples').and.callThrough();
        emitErrorMessageSpy = spyOn(component.errorMessageRequest, 'emit').and.callThrough();
        emitPerformQueryRequestSpy = spyOn(component.performQueryRequest, 'emit').and.callThrough();
        emitResetTriplesRequestSpy = spyOn(component.resetTriplesRequest, 'emit').and.callThrough();
        emitUpdateTriplesRequestSpy = spyOn(component.updateTriplesRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have triples', () => {
            expect(component.triples).toBeUndefined();
        });

        it('... should not have isFullscreen', () => {
            expect(component.isFullscreen).toBeUndefined();
        });

        it('... should have cmTurtleMode', () => {
            expectToEqual(component.cmTurtleMode, expectedCmTurtleMode);
        });

        describe('VIEW', () => {
            it('... should contain no div.accordion yet', () => {
                // Div.accordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.triples = expectedTriples;
            component.isFullscreen = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `triples` input', () => {
            expectToEqual(component.triples, expectedTriples);
        });

        it('... should have `isFullScreen` input', () => {
            expectToBe(component.isFullscreen, expectedIsFullscreen);
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                // Ngb-accordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            describe('not in fullscreen mode', () => {
                describe('with closed panel', () => {
                    it('... should contain one div.accordion with panel (div.accordion-item) header and collapsed body', () => {
                        // Ngb-accordion debug element
                        const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                        // Panel (div.accordion-item)
                        const panelDes = getAndExpectDebugElementByCss(
                            accordionDes[0],
                            'div#awg-graph-visualizer-triples.accordion-item',
                            1,
                            1
                        );
                        // Header (div.accordion-header)
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            panelDes[0],
                            'div#awg-graph-visualizer-triples > div.accordion-header',
                            1,
                            1
                        );
                        const panelHeaderEl = panelHeaderDes[0].nativeElement;

                        expectToContain(panelHeaderEl.classList, 'collapsed');

                        // Body (div.accordion-collapse)
                        const panelBodyDes = getAndExpectDebugElementByCss(
                            panelDes[0],
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        const panelBodyEl = panelBodyDes[0].nativeElement;

                        expect(panelBodyEl.classList).not.toContain('show');
                    });

                    it('... should display panel header button', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-header',
                            1,
                            1
                        );

                        // Panel header button
                        const btnDes = getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'button.accordion-button',
                            1,
                            1
                        );

                        const btnEl = btnDes[0].nativeElement;

                        // Check button content
                        expectToBe(btnEl.textContent, 'RDF Triples');
                    });

                    it('... should toggle panel body on click', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-header',
                            1,
                            1
                        );

                        // Button debug elements
                        const btnDes = getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'button#awg-graph-visualizer-triples-toggle',
                            1,
                            1
                        );
                        // Button native elements to click on
                        const btnEl = btnDes[0].nativeElement;

                        // Panel body is closed
                        let panelBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        let panelBodyEl = panelBodyDes[0].nativeElement;

                        expect(panelBodyEl.classList).not.toContain('show');

                        // Click header button
                        click(btnEl as HTMLElement);
                        detectChangesOnPush(fixture);

                        // Panel is open
                        panelBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        panelBodyEl = panelBodyDes[0].nativeElement;

                        expect(panelBodyEl.classList).toContain('show');

                        // Click header button
                        click(btnEl as HTMLElement);
                        detectChangesOnPush(fixture);

                        panelBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        panelBodyEl = panelBodyDes[0].nativeElement;

                        expect(panelBodyEl.classList).not.toContain('show');
                    });
                });

                describe('with open panel', () => {
                    let bodyDes: DebugElement[];

                    beforeEach(() => {
                        // Open panel by click on header button
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'button#awg-graph-visualizer-triples-toggle',
                            1,
                            1
                        );
                        const btnEl = btnDes[0].nativeElement;

                        // Click header button
                        click(btnEl as HTMLElement);
                        detectChangesOnPush(fixture);

                        // Panel body is open
                        const collapseDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        const collapseEl = collapseDes[0].nativeElement;

                        expect(collapseEl.classList).toContain('show');

                        // Panel body
                        bodyDes = getAndExpectDebugElementByCss(collapseDes[0], 'div.accordion-body', 1, 1);
                    });

                    it('... should toggle panel body on click', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-header',
                            1,
                            1
                        );

                        // Button debug elements
                        const btnDes = getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'button#awg-graph-visualizer-triples-toggle',
                            1,
                            1
                        );
                        // Button native elements to click on
                        const btnEl = btnDes[0].nativeElement;

                        // Panel body is open
                        let panelBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        let panelBodyEl = panelBodyDes[0].nativeElement;

                        expect(panelBodyEl.classList).toContain('show');

                        // Click header button
                        click(btnEl as HTMLElement);
                        detectChangesOnPush(fixture);

                        // Panel is closed
                        panelBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        panelBodyEl = panelBodyDes[0].nativeElement;

                        expect(panelBodyEl.classList).not.toContain('show');

                        // Click header button
                        click(btnEl as HTMLElement);
                        detectChangesOnPush(fixture);

                        // Panel body is open again
                        panelBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        panelBodyEl = panelBodyDes[0].nativeElement;

                        expect(panelBodyEl.classList).toContain('show');
                    });

                    it('... should contain CodeMirrorComponent (stubbed) in panel body', () => {
                        // CodeMirrorComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorStubComponent, 1, 1);
                    });

                    it('... should contain div with 3 buttons (Query, Reset, Clear) in panel body', () => {
                        const divDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-triples-handle-buttons',
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(divDes[0], 'button.btn', 3, 3);
                        const btnEl0 = btnDes[0].nativeElement;
                        const btnEl1 = btnDes[1].nativeElement;
                        const btnEl2 = btnDes[2].nativeElement;

                        expectToBe(btnEl0.textContent, 'Query');
                        expectToBe(btnEl1.textContent, 'Reset');
                        expectToBe(btnEl2.textContent, 'Clear');
                    });

                    it('... should trigger `performQuery()` by click on Query button', () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                            3,
                            3
                        );
                        const btnEl0 = btnDes[0].nativeElement;

                        expectToBe(btnEl0.textContent, 'Query');

                        // Click query button
                        click(btnEl0 as HTMLElement);
                        detectChangesOnPush(fixture);

                        expectSpyCall(performQuerySpy, 1);
                        expectSpyCall(resetTriplesSpy, 0);
                    });

                    it('... should trigger `resetTriples()` by click on Reset button', () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                            3,
                            3
                        );
                        const btnEl1 = btnDes[1].nativeElement;

                        expectToBe(btnEl1.textContent, 'Reset');

                        // Click reset button
                        click(btnEl1 as HTMLElement);
                        detectChangesOnPush(fixture);

                        expectSpyCall(performQuerySpy, 0);
                        expectSpyCall(resetTriplesSpy, 1);
                    });

                    it('... should trigger `onEditorInputChange()` with empty string by click on Clear button', () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                            3,
                            3
                        );
                        const btnEl2 = btnDes[2].nativeElement;

                        expectToBe(btnEl2.textContent, 'Clear');

                        // Click clear button
                        click(btnEl2 as HTMLElement);
                        detectChangesOnPush(fixture);

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
                        'button#awg-graph-visualizer-triples-toggle',
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
                        'div#awg-graph-visualizer-triples-collapse > div.accordion-body',
                        1,
                        1
                    );

                    // Set fullscreen mode
                    component.isFullscreen = true;
                });

                it('... should contain one div.accordion with panel (div.accordion-item) header and open body', () => {
                    // Ngb-accordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    // Panel (div.accordion-item)
                    const panelDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-triples.accordion-item',
                        1,
                        1
                    );
                    // Header (div.accordion-header)
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-triples > div.accordion-header',
                        1,
                        1
                    );

                    // Body open (div.accordion-body)
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-triples-collapse > div.accordion-body',
                        1,
                        1
                    );
                });

                it('... should display panel header button', () => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-header',
                        1,
                        1
                    );

                    // Panel header button
                    const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'RDF Triples');
                });

                it('... should not toggle panel body on click', () => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    // Panel body does not close
                    let panelBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let panelBodyEl = panelBodyDes[0].nativeElement;

                    expect(panelBodyEl.classList).toContain('show');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Panel body does not close again
                    panelBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    panelBodyEl = panelBodyDes[0].nativeElement;

                    expect(panelBodyEl.classList).toContain('show');
                });

                it('... should contain CodeMirrorComponent (stubbed) in panel body', () => {
                    // CodeMirrorComponent
                    getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorStubComponent, 1, 1);
                });

                it('... should contain div with 3 buttons (Query, Reset, Clear) in panel body', () => {
                    const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div', 1, 1);

                    const btnDes = getAndExpectDebugElementByCss(divDes[0], 'button.btn', 3, 3);
                    const btnEl0 = btnDes[0].nativeElement;
                    const btnEl1 = btnDes[1].nativeElement;
                    const btnEl2 = btnDes[2].nativeElement;

                    expectToBe(btnEl0.textContent, 'Query');
                    expectToBe(btnEl1.textContent, 'Reset');
                    expectToBe(btnEl2.textContent, 'Clear');
                });

                it('... should trigger `performQuery()` by click on Query button', () => {
                    const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                    const btnEl0 = btnDes[0].nativeElement;

                    expectToBe(btnEl0.textContent, 'Query');

                    // Click query button
                    click(btnEl0 as HTMLElement);
                    detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 1);
                    expectSpyCall(resetTriplesSpy, 0);
                });

                it('... should trigger `resetTriples()` by click on Reset button', () => {
                    const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                    const btnEl1 = btnDes[1].nativeElement;

                    expectToBe(btnEl1.textContent, 'Reset');

                    // Click reset button
                    click(btnEl1 as HTMLElement);
                    detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 0);
                    expectSpyCall(resetTriplesSpy, 1);
                });

                it('... should trigger `onEditorInputChange()` with empty string by click on Clear button', () => {
                    const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                    const btnEl2 = btnDes[2].nativeElement;

                    expectToBe(btnEl2.textContent, 'Clear');

                    // Click clear button
                    click(btnEl2 as HTMLElement);
                    detectChangesOnPush(fixture);

                    expectSpyCall(onEditorInputChangeSpy, 1, '');
                });
            });
        });

        describe('#onEditorInputChange()', () => {
            beforeEach(async () => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'button#awg-graph-visualizer-triples-toggle',
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

                const changedTriples = 'example:Success example:is example:Testing';
                codeMirrorCmp.contentChange.emit(changedTriples);

                expectSpyCall(onEditorInputChangeSpy, 1, changedTriples);
            });

            it('... should trigger with empty string from click on Clear button', () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl2 = btnDes[2].nativeElement;

                expectToBe(btnEl2.textContent, 'Clear');

                // Click clear button
                click(btnEl2 as HTMLElement);
                detectChangesOnPush(fixture);

                expectSpyCall(onEditorInputChangeSpy, 1, '');
            });

            it('... should emit updateTriplesRequest on click', () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl2 = btnDes[2].nativeElement;

                expectToBe(btnEl2.textContent, 'Clear');

                // Click clear button
                click(btnEl2 as HTMLElement);
                detectChangesOnPush(fixture);

                expectSpyCall(onEditorInputChangeSpy, 1, '');
                expectSpyCall(emitUpdateTriplesRequestSpy, 1);
            });

            describe('... should emit provided triples on editor change', () => {
                it('... if string is truthy', () => {
                    const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                    const codeMirrorCmp = codeMirrorDes[0].injector.get(
                        CodeMirrorStubComponent
                    ) as CodeMirrorStubComponent;

                    const changedTriples = 'example:Success example:is example:Testing';
                    codeMirrorCmp.contentChange.emit(changedTriples);

                    expectSpyCall(onEditorInputChangeSpy, 1, changedTriples);
                    expectSpyCall(emitUpdateTriplesRequestSpy, 1, changedTriples);
                });

                it('... if string is empty', () => {
                    const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                    const codeMirrorCmp = codeMirrorDes[0].injector.get(
                        CodeMirrorStubComponent
                    ) as CodeMirrorStubComponent;

                    codeMirrorCmp.contentChange.emit('');

                    expectSpyCall(onEditorInputChangeSpy, 1, '');
                    expectSpyCall(emitUpdateTriplesRequestSpy, 1, '');
                });
            });
        });

        describe('#performQuery()', () => {
            beforeEach(async () => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'button#awg-graph-visualizer-triples-toggle',
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

            it('... should trigger on click on Query button', () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl0 = btnDes[0].nativeElement;

                expectToBe(btnEl0.textContent, 'Query');

                // Click query button
                click(btnEl0 as HTMLElement);
                detectChangesOnPush(fixture);

                expectSpyCall(performQuerySpy, 1);
            });

            describe('... should emit on click', () => {
                it('`performQueryRequest` if querystring is given', () => {
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                        3,
                        3
                    );
                    const btnEl0 = btnDes[0].nativeElement;

                    expectToBe(btnEl0.textContent, 'Query');

                    // Click query button
                    click(btnEl0 as HTMLElement);
                    detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 1);
                    expectSpyCall(emitPerformQueryRequestSpy, 1);
                    expectSpyCall(emitErrorMessageSpy, 0);
                });

                it('`errorMessageRequest` with errorMessage if querystring is not given', () => {
                    const expectedErrorMessage = new ToastMessage('Empty triples', 'Please enter triple content.');

                    component.triples = '';
                    detectChangesOnPush(fixture);

                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                        3,
                        3
                    );
                    const btnEl0 = btnDes[0].nativeElement;

                    expectToBe(btnEl0.textContent, 'Query');

                    // Click query button
                    click(btnEl0 as HTMLElement);
                    detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 1);
                    expectSpyCall(emitPerformQueryRequestSpy, 0);
                    expectSpyCall(emitErrorMessageSpy, 1, expectedErrorMessage);
                });
            });
        });

        describe('#resetTriples()', () => {
            beforeEach(async () => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'button#awg-graph-visualizer-triples-toggle',
                    1,
                    1
                );
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                await detectChangesOnPush(fixture);
            });

            it('... should have a method `resetTriples`', () => {
                expect(component.resetTriples).toBeDefined();
            });

            it('... should trigger on click on Reset button', () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl1 = btnDes[1].nativeElement;

                expectToBe(btnEl1.textContent, 'Reset');

                // Click query button
                click(btnEl1 as HTMLElement);
                detectChangesOnPush(fixture);

                expectSpyCall(resetTriplesSpy, 1);
            });

            it('... should emit request on click', () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl1 = btnDes[1].nativeElement;

                expectToBe(btnEl1.textContent, 'Reset');

                // Click reset button
                click(btnEl1 as HTMLElement);
                detectChangesOnPush(fixture);

                expectSpyCall(resetTriplesSpy, 1);
                expectSpyCall(emitResetTriplesRequestSpy, 1);
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
