import { Component, DebugElement, EventEmitter, Input, NgModule, Output, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { turtle } from '@codemirror/legacy-modes/mode/turtle';
import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditorView } from 'codemirror';

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

import { CmMode } from '@awg-shared/codemirror/codemirror.component';
import { ToastMessage } from '@awg-shared/toast/toast.service';

import { TriplesEditorComponent } from './triples-editor.component';

@Component({
    selector: 'awg-codemirror',
    template: '',
    standalone: false,
})
class CodeMirrorStubComponent {
    @Input()
    mode: CmMode;
    @Input()
    content: string;
    @Output()
    contentChange: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    editor: EditorView;
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
    class NgbConfigModule {
        constructor() {
            const config = inject(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbAccordionModule, NgbConfigModule],
            declarations: [TriplesEditorComponent, CodeMirrorStubComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TriplesEditorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedIsFullscreen = false;
        expectedCmTurtleMode = turtle;

        expectedTriples = 'example:Test example:has example:Success';

        // Spies
        onEditorInputChangeSpy = vi.spyOn(component, 'onEditorInputChange');
        performQuerySpy = vi.spyOn(component, 'performQuery');
        isAccordionItemCollapsedSpy = vi.spyOn(component, 'isAccordionItemCollapsed');
        isAccordionItemDisabledSpy = vi.spyOn(component, 'isAccordionItemDisabled');
        resetTriplesSpy = vi.spyOn(component, 'resetTriples');
        emitErrorMessageSpy = vi.spyOn(component.errorMessageRequest, 'emit');
        emitPerformQueryRequestSpy = vi.spyOn(component.performQueryRequest, 'emit');
        emitResetTriplesRequestSpy = vi.spyOn(component.resetTriplesRequest, 'emit');
        emitUpdateTriplesRequestSpy = vi.spyOn(component.updateTriplesRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
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
            describe('not in fullscreen mode', () => {
                describe('with closed item', () => {
                    it('... should contain one div.accordion-item with header and collapsed body in div.accordion', () => {
                        const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                        const itemDes = getAndExpectDebugElementByCss(
                            accordionDes[0],
                            'div#awg-graph-visualizer-triples.accordion-item',
                            1,
                            1
                        );
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            itemDes[0],
                            'div#awg-graph-visualizer-triples > div.accordion-header',
                            1,
                            1
                        );
                        const itemHeaderEl: HTMLDivElement = itemHeaderDes[0].nativeElement;

                        expectToContain(itemHeaderEl.classList, 'collapsed');

                        const itemBodyDes = getAndExpectDebugElementByCss(
                            itemDes[0],
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                        expectToNotContain(itemBodyEl.classList, 'show');
                    });

                    it('... should display item header button', () => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-header',
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                        const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                        expectToBe(btnEl.textContent, 'RDF Triples');
                    });

                    it('... should toggle item body on click', async () => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-header',
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(
                            itemHeaderDes[0],
                            'button#awg-graph-visualizer-triples-toggle',
                            1,
                            1
                        );

                        // Item body is closed
                        let itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
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
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToContain(itemBodyEl.classList, 'show');

                        // Click header button
                        await clickAndAwaitChanges(btnDes[0], fixture);

                        itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToNotContain(itemBodyEl.classList, 'show');
                    });
                });

                describe('with open item', () => {
                    let bodyDes: DebugElement[];

                    beforeEach(async () => {
                        // Open item by click on header button
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'button#awg-graph-visualizer-triples-toggle',
                            1,
                            1
                        );

                        // Click header button
                        await clickAndAwaitChanges(btnDes[0], fixture);

                        // Item body is open
                        const collapseDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        const collapseEl: HTMLDivElement = collapseDes[0].nativeElement;

                        expectToContain(collapseEl.classList, 'show');

                        bodyDes = getAndExpectDebugElementByCss(collapseDes[0], 'div.accordion-body', 1, 1);
                    });

                    it('... should toggle item body on click', async () => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-header',
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(
                            itemHeaderDes[0],
                            'button#awg-graph-visualizer-triples-toggle',
                            1,
                            1
                        );

                        // Item body is open
                        let itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
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
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
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
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToContain(itemBodyEl.classList, 'show');
                    });

                    it('... should contain CodeMirrorComponent (stubbed) in item body', () => {
                        getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorStubComponent, 1, 1);
                    });

                    it('... should contain div with 3 buttons (Query, Reset, Clear) in item body', () => {
                        const divDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-triples-handle-buttons',
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(divDes[0], 'button.btn', 3, 3);
                        const btnEl0: HTMLButtonElement = btnDes[0].nativeElement;
                        const btnEl1: HTMLButtonElement = btnDes[1].nativeElement;
                        const btnEl2: HTMLButtonElement = btnDes[2].nativeElement;

                        expectToBe(btnEl0.textContent, 'Query');
                        expectToBe(btnEl1.textContent, 'Reset');
                        expectToBe(btnEl2.textContent, 'Clear');
                    });

                    it('... should trigger `performQuery()` by click on Query button', async () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                            3,
                            3
                        );
                        const btnEl0: HTMLButtonElement = btnDes[0].nativeElement;

                        expectToBe(btnEl0.textContent, 'Query');

                        // Click query button
                        await clickAndAwaitChanges(btnDes[0], fixture);

                        expectSpyCall(performQuerySpy, 1);
                        expectSpyCall(resetTriplesSpy, 0);
                    });

                    it('... should trigger `resetTriples()` by click on Reset button', async () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                            3,
                            3
                        );
                        const btnEl1: HTMLButtonElement = btnDes[1].nativeElement;

                        expectToBe(btnEl1.textContent, 'Reset');

                        // Click reset button
                        await clickAndAwaitChanges(btnDes[1], fixture);

                        expectSpyCall(performQuerySpy, 0);
                        expectSpyCall(resetTriplesSpy, 1);
                    });

                    it('... should trigger `onEditorInputChange()` with empty string by click on Clear button', async () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            bodyDes[0],
                            'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                            3,
                            3
                        );
                        const btnEl2: HTMLButtonElement = btnDes[2].nativeElement;

                        expectToBe(btnEl2.textContent, 'Clear');

                        // Click clear button
                        await clickAndAwaitChanges(btnDes[2], fixture);

                        expectSpyCall(onEditorInputChangeSpy, 1, '');
                    });
                });
            });

            describe('in fullscreen mode', () => {
                let bodyDes: DebugElement[];

                beforeEach(async () => {
                    // Open item by click on header button
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'button#awg-graph-visualizer-triples-toggle',
                        1,
                        1
                    );

                    // Click header button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item body
                    bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples-collapse > div.accordion-body',
                        1,
                        1
                    );

                    // Set fullscreen mode
                    component.isFullscreen = true;
                });

                it('... should contain one div.accordion with item (div.accordion-item) header and open body', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-triples.accordion-item',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-triples > div.accordion-header',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-triples-collapse > div.accordion-body',
                        1,
                        1
                    );
                });

                it('... should display item header button', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.textContent, 'RDF Triples');
                });

                it('... should not toggle item body on click', async () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);

                    // Item body does not close
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    // Click header button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item body does not close again
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should contain CodeMirrorComponent (stubbed) in item body', () => {
                    getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorStubComponent, 1, 1);
                });

                it('... should contain div with 3 buttons (Query, Reset, Clear) in item body', () => {
                    const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div', 1, 1);

                    const btnDes = getAndExpectDebugElementByCss(divDes[0], 'button.btn', 3, 3);
                    const btnEl0: HTMLButtonElement = btnDes[0].nativeElement;
                    const btnEl1: HTMLButtonElement = btnDes[1].nativeElement;
                    const btnEl2: HTMLButtonElement = btnDes[2].nativeElement;

                    expectToBe(btnEl0.textContent, 'Query');
                    expectToBe(btnEl1.textContent, 'Reset');
                    expectToBe(btnEl2.textContent, 'Clear');
                });

                it('... should trigger `performQuery()` by click on Query button', async () => {
                    const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                    const btnEl0: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl0.textContent, 'Query');

                    // Click query button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(performQuerySpy, 1);
                    expectSpyCall(resetTriplesSpy, 0);
                });

                it('... should trigger `resetTriples()` by click on Reset button', async () => {
                    const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                    const btnEl1: HTMLButtonElement = btnDes[1].nativeElement;

                    expectToBe(btnEl1.textContent, 'Reset');

                    // Click reset button
                    await clickAndAwaitChanges(btnDes[1], fixture);

                    expectSpyCall(performQuerySpy, 0);
                    expectSpyCall(resetTriplesSpy, 1);
                });

                it('... should trigger `onEditorInputChange()` with empty string by click on Clear button', async () => {
                    const btnDes = getAndExpectDebugElementByCss(bodyDes[0], 'div > button.btn', 3, 3);
                    const btnEl2: HTMLButtonElement = btnDes[2].nativeElement;

                    expectToBe(btnEl2.textContent, 'Clear');

                    // Click clear button
                    await clickAndAwaitChanges(btnDes[2], fixture);

                    expectSpyCall(onEditorInputChangeSpy, 1, '');
                });
            });
        });

        describe('#onEditorInputChange()', () => {
            beforeEach(async () => {
                // Open item by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'button#awg-graph-visualizer-triples-toggle',
                    1,
                    1
                );

                // Click header button
                await clickAndAwaitChanges(btnDes[0], fixture);
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
                const btnEl2: HTMLButtonElement = btnDes[2].nativeElement;

                expectToBe(btnEl2.textContent, 'Clear');

                // Click clear button
                await clickAndAwaitChanges(btnDes[2], fixture);

                expectSpyCall(onEditorInputChangeSpy, 1, '');
            });

            it('... should emit updateTriplesRequest on click', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl2: HTMLButtonElement = btnDes[2].nativeElement;

                expectToBe(btnEl2.textContent, 'Clear');

                // Click clear button
                await clickAndAwaitChanges(btnDes[2], fixture);

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
                // Open item by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'button#awg-graph-visualizer-triples-toggle',
                    1,
                    1
                );

                // Click header button
                await clickAndAwaitChanges(btnDes[0], fixture);
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
                const btnEl0: HTMLButtonElement = btnDes[0].nativeElement;

                expectToBe(btnEl0.textContent, 'Query');

                // Click query button
                await clickAndAwaitChanges(btnDes[0], fixture);

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
                    const btnEl0: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl0.textContent, 'Query');

                    // Click query button
                    await clickAndAwaitChanges(btnDes[0], fixture);

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
                    const btnEl0: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl0.textContent, 'Query');

                    // Click query button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(performQuerySpy, 1);
                    expectSpyCall(emitPerformQueryRequestSpy, 0);
                    expectSpyCall(emitErrorMessageSpy, 1, expectedErrorMessage);
                });
            });
        });

        describe('#resetTriples()', () => {
            beforeEach(async () => {
                // Open item by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'button#awg-graph-visualizer-triples-toggle',
                    1,
                    1
                );

                // Click header button
                await clickAndAwaitChanges(btnDes[0], fixture);
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
                const btnEl1: HTMLButtonElement = btnDes[1].nativeElement;

                expectToBe(btnEl1.textContent, 'Reset');

                // Click reset button
                await clickAndAwaitChanges(btnDes[1], fixture);

                expectSpyCall(resetTriplesSpy, 1);
            });

            it('... should emit request on click', async () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-triples-handle-buttons > button.btn',
                    3,
                    3
                );
                const btnEl1: HTMLButtonElement = btnDes[1].nativeElement;

                expectToBe(btnEl1.textContent, 'Reset');

                // Click reset button
                await clickAndAwaitChanges(btnDes[1], fixture);

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
                component.isFullscreen = true;

                expectToBe(component.isAccordionItemDisabled(), true);
            });
        });
    });
});
