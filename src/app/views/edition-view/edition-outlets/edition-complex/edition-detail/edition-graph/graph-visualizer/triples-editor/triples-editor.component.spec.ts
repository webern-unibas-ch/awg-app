import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { turtle } from '@codemirror/legacy-modes/mode/turtle';
import { NgbAccordion, NgbAccordionModule, NgbConfig, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
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
    let preventPanelCollapseOnFullscreenSpy: Spy;
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
            imports: [NgbAccordionWithConfigModule, NgbAccordion],
            declarations: [TriplesEditorComponent, CodeMirrorStubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TriplesEditorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedIsFullscreen = false;

        expectedTriples = 'example:Test example:has example:Success';
        expectedCmTurtleMode = turtle;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        onEditorInputChangeSpy = spyOn(component, 'onEditorInputChange').and.callThrough();
        performQuerySpy = spyOn(component, 'performQuery').and.callThrough();
        preventPanelCollapseOnFullscreenSpy = spyOn(component, 'preventPanelCollapseOnFullscreen').and.callThrough();
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
            expect(component.cmTurtleMode).toBeDefined();
            expect(component.cmTurtleMode)
                .withContext(`should equal ${expectedCmTurtleMode}`)
                .toEqual(expectedCmTurtleMode);
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
            component.triples = expectedTriples;
            component.isFullscreen = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `triples` input', () => {
            expect(component.triples).toBeDefined();
            expect(component.triples).withContext(`should equal ${expectedTriples}`).toEqual(expectedTriples);
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

                        // Panel (div.accordion-item)
                        const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);

                        // Header
                        getAndExpectDebugElementByCss(
                            panelDes[0],
                            'div#awg-graph-visualizer-triples-header.accordion-header',
                            1,
                            1
                        );

                        // No body
                        getAndExpectDebugElementByCss(
                            panelDes[0],
                            'div#awg-graph-visualizer-triples > div.accordion-body',
                            0,
                            0
                        );
                    });

                    it('... should display panel header button', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples-header.accordion-header',
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
                        expect(btnEl.textContent).toBeTruthy();
                        expect(btnEl.textContent).withContext('should be RDF Triples').toContain('RDF Triples');
                    });

                    it('... should toggle panel body on click', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples-header.accordion-header',
                            1,
                            1
                        );

                        // Button debug elements
                        const btnDes = getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'button.accordion-button',
                            1,
                            1
                        );
                        // Button native elements to click on
                        const btnEl = btnDes[0].nativeElement;

                        // Panel body is closed
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-body',
                            0,
                            0,
                            'collapsed'
                        );

                        // Click header button
                        click(btnEl as HTMLElement);
                        detectChangesOnPush(fixture);

                        // Panel is open
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-body',
                            1,
                            1,
                            'open'
                        );

                        // Click header button
                        click(btnEl as HTMLElement);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(
                            // Panel body is closed again
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-body',
                            0,
                            0,
                            'collapsed'
                        );
                    });
                });

                describe('with open panel', () => {
                    let bodyDes: DebugElement[];

                    beforeEach(() => {
                        // Open panel by click on header button
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples-header.accordion-header > button.accordion-button',
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
                            'div#awg-graph-visualizer-triples > div.accordion-body',
                            1,
                            1
                        );
                    });

                    it('... should toggle panel body on click', () => {
                        // Header debug elements
                        const panelHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples-header.accordion-header',
                            1,
                            1
                        );

                        // Button debug elements
                        const btnDes = getAndExpectDebugElementByCss(
                            panelHeaderDes[0],
                            'button.accordion-button',
                            1,
                            1
                        );
                        // Button native elements to click on
                        const btnEl = btnDes[0].nativeElement;

                        // Panel body is open
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-body',
                            1,
                            1,
                            'open'
                        );

                        // Click header button
                        click(btnEl as HTMLElement);
                        detectChangesOnPush(fixture);

                        // Panel is closed
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-body',
                            0,
                            0,
                            'collapsed'
                        );

                        // Click header button
                        click(btnEl as HTMLElement);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(
                            // Panel body is open again
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-body',
                            1,
                            1,
                            'open'
                        );
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

                        expect(btnEl0.textContent).toBeTruthy();
                        expect(btnEl0.textContent).withContext(`should contain 'Query'`).toContain('Query');

                        expect(btnEl1.textContent).toBeTruthy();
                        expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                        expect(btnEl2.textContent).toBeTruthy();
                        expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');
                    });

                    it('... should trigger `performQuery()` by click on Query button', () => {
                        const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                        const btnEl0 = btnDes[0].nativeElement;

                        expect(btnEl0.textContent).toBeTruthy();
                        expect(btnEl0.textContent).withContext(`should contain 'Query'`).toContain('Query');

                        // Click query button
                        click(btnEl0 as HTMLElement);
                        detectChangesOnPush(fixture);

                        expectSpyCall(performQuerySpy, 1);
                        expectSpyCall(resetTriplesSpy, 0);
                    });

                    it('... should trigger `resetTriples()` by click on Reset button', () => {
                        const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                        const btnEl1 = btnDes[1].nativeElement;

                        expect(btnEl1.textContent).toBeTruthy();
                        expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                        // Click reset button
                        click(btnEl1 as HTMLElement);
                        detectChangesOnPush(fixture);

                        expectSpyCall(performQuerySpy, 0);
                        expectSpyCall(resetTriplesSpy, 1);
                    });

                    it('... should trigger `onEditorInputChange()` with empty string by click on Clear button', () => {
                        const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                        const btnEl2 = btnDes[2].nativeElement;

                        expect(btnEl2.textContent).toBeTruthy();
                        expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');

                        // Click clear button
                        click(btnEl2 as HTMLElement);
                        detectChangesOnPush(fixture);

                        expectSpyCall(onEditorInputChangeSpy, 1);
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
                        'div#awg-graph-visualizer-triples-header.accordion-header > button.accordion-button',
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
                        'div#awg-graph-visualizer-triples > div.accordion-body',
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
                        'div#awg-graph-visualizer-triples-header.accordion-header',
                        1,
                        1
                    ); // Panel (div.card)

                    // Body opened
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-triples > div.accordion-body',
                        1,
                        1
                    );
                });

                it('... should display panel header button', () => {
                    // Panel header button
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples-header.accordion-header > button.accordion-button',
                        1,
                        1
                    );

                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expect(btnEl.textContent).toBeTruthy();
                    expect(btnEl.textContent).withContext('should be RDF Triples').toContain('RDF Triples');
                });

                it('... should not toggle panel body on click', () => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples-header.accordion-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    // Panel body does not close
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-body',
                        1,
                        1,
                        'open'
                    );

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Panel body does not close again
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-body',
                        1,
                        1,
                        'open'
                    );
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

                    expect(btnEl0.textContent).toBeTruthy();
                    expect(btnEl0.textContent).withContext(`should contain 'Query'`).toContain('Query');

                    expect(btnEl1.textContent).toBeTruthy();
                    expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                    expect(btnEl2.textContent).toBeTruthy();
                    expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');
                });

                it('... should trigger `performQuery()` by click on Query button', () => {
                    const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                    const btnEl0 = btnDes[0].nativeElement;

                    expect(btnEl0.textContent).toBeTruthy();
                    expect(btnEl0.textContent).withContext(`should contain 'Query'`).toContain('Query');

                    // Click query button
                    click(btnEl0 as HTMLElement);
                    detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 1);
                    expectSpyCall(resetTriplesSpy, 0);
                });

                it('... should trigger `resetTriples()` by click on Reset button', () => {
                    const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                    const btnEl1 = btnDes[1].nativeElement;

                    expect(btnEl1.textContent).toBeTruthy();
                    expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                    // Click reset button
                    click(btnEl1 as HTMLElement);
                    detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 0);
                    expectSpyCall(resetTriplesSpy, 1);
                });

                it('... should trigger `onEditorInputChange()` with empty string by click on Clear button', () => {
                    const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                    const btnEl2 = btnDes[2].nativeElement;

                    expect(btnEl2.textContent).toBeTruthy();
                    expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');

                    // Click clear button
                    click(btnEl2 as HTMLElement);
                    detectChangesOnPush(fixture);

                    expectSpyCall(onEditorInputChangeSpy, 1);
                    expectSpyCall(onEditorInputChangeSpy, 1, '');
                });
            });
        });

        describe('#onEditorInputChange()', () => {
            beforeEach(async () => {
                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-triples-header.accordion-header',
                    1,
                    1
                );

                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
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

            it('... should trigger with empty string from click on Clear button', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl2 = btnDes[2].nativeElement;

                expect(btnEl2.textContent).toBeTruthy();
                expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');

                // Click clear button
                click(btnEl2 as HTMLElement);
                detectChangesOnPush(fixture);

                expectSpyCall(onEditorInputChangeSpy, 1, '');
            });

            it('... should emit updateTriplesRequest on click', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl2 = btnDes[2].nativeElement;

                expect(btnEl2.textContent).toBeTruthy();
                expect(btnEl2.textContent).withContext(`should contain 'Clear'`).toContain('Clear');

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
                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-triples-header.accordion-header',
                    1,
                    1
                );

                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                await detectChangesOnPush(fixture);
            });

            it('... should have a method `performQuery`', () => {
                expect(component.performQuery).toBeDefined();
            });

            it('... should trigger on click on Query button', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
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

            describe('... should emit on click', () => {
                it('`performQueryRequest` if querystring is given', async () => {
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
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
                    expectSpyCall(emitErrorMessageSpy, 0);
                });

                it('`errorMessageRequest` with errorMessage if querystring is not given', async () => {
                    const expectedErrorMessage = new ToastMessage('Empty triples', 'Please enter triple content.');

                    component.triples = '';
                    await detectChangesOnPush(fixture);

                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
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
                    expectSpyCall(emitErrorMessageSpy, 1, expectedErrorMessage);
                });
            });
        });

        describe('#resetTriples()', () => {
            beforeEach(async () => {
                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-triples-header.accordion-header',
                    1,
                    1
                );

                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                await detectChangesOnPush(fixture);
            });

            it('... should have a method `resetTriples`', () => {
                expect(component.resetTriples).toBeDefined();
            });

            it('... should trigger on click on Reset button', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl1 = btnDes[1].nativeElement;

                expect(btnEl1.textContent).toBeTruthy();
                expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                // Click query button
                click(btnEl1 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(resetTriplesSpy, 1);
            });

            it('... should emit request on click', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl1 = btnDes[1].nativeElement;

                expect(btnEl1.textContent).toBeTruthy();
                expect(btnEl1.textContent).withContext(`should contain 'Reset'`).toContain('Reset');

                // Click reset button
                click(btnEl1 as HTMLElement);
                await detectChangesOnPush(fixture);

                expectSpyCall(resetTriplesSpy, 1);
                expectSpyCall(emitResetTriplesRequestSpy, 1);
            });
        });

        describe('#togglePanel()', () => {
            it('... should have a method `togglePanel`', () => {
                expect(component.togglePanel).toBeDefined();
            });

            it('... should return empty string if isFullscreen = false', () => {
                expect(component.togglePanel()).not.toBeTruthy();
            });

            it('... should return panel id if isFullscreen = true', () => {
                const expectedId = 'awg-graph-visualizer-triples';

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
