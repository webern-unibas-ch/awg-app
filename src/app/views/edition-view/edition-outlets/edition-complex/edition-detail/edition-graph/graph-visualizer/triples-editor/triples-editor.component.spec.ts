import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { turtle } from '@codemirror/legacy-modes/mode/turtle';
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
import { CmMode } from '@awg-shared/codemirror/codemirror.utils';
import { ToastMessage } from '@awg-shared/toast/toast.service';

import { EditorActionButtonsComponent } from '../editor-action-buttons/editor-action-buttons.component';
import { TriplesEditorComponent } from './triples-editor.component';

describe('TriplesEditorComponent (DONE)', () => {
    let component: TriplesEditorComponent;
    let fixture: ComponentFixture<TriplesEditorComponent>;
    let compDe: DebugElement;

    let expectedTriples: string;
    let expectedCmTurtleMode: CmMode;
    let expectedIsFullscreen: boolean;

    let clearTriplesSpy: Spy;
    let performQuerySpy: Spy;
    let resetTriplesSpy: Spy;
    let emitErrorMessageSpy: Spy;
    let emitPerformQueryRequestSpy: Spy;
    let emitResetTriplesRequestSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TriplesEditorComponent],
        })
            .overrideComponent(CodeMirrorComponent, {
                set: { template: '<div #codemirrorhost></div>', imports: [] },
            })
            .overrideComponent(EditorActionButtonsComponent, { set: { template: '', imports: [] } })
            .compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
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
        clearTriplesSpy = vi.spyOn(component, 'clearTriples');
        performQuerySpy = vi.spyOn(component, 'performQuery');
        resetTriplesSpy = vi.spyOn(component, 'resetTriples');
        emitErrorMessageSpy = vi.spyOn(component.errorMessageRequest, 'emit');
        emitPerformQueryRequestSpy = vi.spyOn(component.performQueryRequest, 'emit');
        emitResetTriplesRequestSpy = vi.spyOn(component.resetTriplesRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have model signal `triples` to hold an empty string initially', () => {
            expectToBe(isSignal(component.triples), true);
            expectToBe(component.triples(), '');
        });

        it('... should have input signal `isFullscreenMode` to hold false initially', () => {
            expectToBe(isSignal(component.isFullscreenMode), true);
            expectToBe(component.isFullscreenMode(), false);
        });

        it('... should have `cmTurtleMode` to hold the turtle mode', () => {
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
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('triples', expectedTriples);
            fixture.componentRef.setInput('isFullscreenMode', expectedIsFullscreen);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have model signal `triples` to hold the provided triples', () => {
            expectToBe(component.triples(), expectedTriples);
        });

        it('... should have input signal `isFullscreenMode` to hold the provided fullscreen flag', () => {
            expectToBe(component.isFullscreenMode(), expectedIsFullscreen);
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

                    it('... should display enabled item header button', () => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-header',
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                        const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                        expectToBe(btnEl.disabled, false);
                        expectToBe(btnEl.textContent, 'RDF Triples');
                    });

                    it('... should have auto height on item body', () => {
                        const itemBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.accordion-collapse',
                            1,
                            1
                        );
                        const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                        expectToBe(itemBodyEl.style.height, 'auto');
                    });

                    it('... should toggle item body on click', async () => {
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
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

                        // Item body is open
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

                        // Item body is closed again
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

                        await clickAndAwaitChanges(btnDes[0], fixture);

                        bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples-collapse > div.accordion-body',
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

                        expectToEqual(codeMirrorCmp.mode(), expectedCmTurtleMode);
                        expectToBe(codeMirrorCmp.content(), expectedTriples);
                    });

                    it('... should pass down changed triples to CodeMirrorComponent (hollow)', async () => {
                        const codeMirrorDes = getAndExpectDebugElementByDirective(
                            bodyDes[0],
                            CodeMirrorComponent,
                            1,
                            1
                        );
                        const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorComponent);

                        const changedTriples = 'example:Success example:is example:Testing';
                        fixture.componentRef.setInput('triples', changedTriples);
                        await detectChangesOnPush(fixture);

                        expectToBe(codeMirrorCmp.content(), changedTriples);
                    });

                    it('... should update `triples` on content change of CodeMirrorComponent (hollow)', () => {
                        const codeMirrorDes = getAndExpectDebugElementByDirective(
                            bodyDes[0],
                            CodeMirrorComponent,
                            1,
                            1
                        );
                        const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorComponent);

                        const changedTriples = 'example:Success example:is example:Testing';
                        codeMirrorCmp.content.set(changedTriples);

                        expectToBe(component.triples(), changedTriples);
                    });

                    it('... should contain EditorActionButtonsComponent (hollow) in item body', () => {
                        getAndExpectDebugElementByDirective(bodyDes[0], EditorActionButtonsComponent, 1, 1);
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

                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-triples > div.accordion-collapse',
                        1,
                        1
                    );
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display disabled item header button', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.disabled, true);
                    expectToBe(btnEl.textContent, 'RDF Triples');
                });

                it('... should have 50vh height on item body', () => {
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-collapse',
                        1,
                        1
                    );
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToBe(itemBodyEl.style.height, '50vh');
                });

                it('... should not toggle item body on click', async () => {
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.accordion-header > button.accordion-button',
                        1,
                        1
                    );

                    // Item body is open
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

                    // Item body does not close
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

                it('... should contain CodeMirrorComponent (hollow) and EditorActionButtonsComponent (hollow) in item body', () => {
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples-collapse > div.accordion-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(bodyDes[0], CodeMirrorComponent, 1, 1);
                    getAndExpectDebugElementByDirective(bodyDes[0], EditorActionButtonsComponent, 1, 1);
                });
            });
        });

        describe('METHODS', () => {
            describe('#clearTriples()', () => {
                beforeEach(async () => {
                    // Open item by click on header button
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'button#awg-graph-visualizer-triples-toggle',
                        1,
                        1
                    );

                    await clickAndAwaitChanges(btnDes[0], fixture);
                });

                it('... should have a method `clearTriples`', () => {
                    expect(component.clearTriples).toBeDefined();
                });

                it('... should trigger on clearRequest event from EditorActionButtonsComponent (hollow)', () => {
                    const actionButtonsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditorActionButtonsComponent,
                        1,
                        1
                    );
                    const actionButtonsCmp = actionButtonsDes[0].injector.get(EditorActionButtonsComponent);

                    actionButtonsCmp.clearRequest.emit();

                    expectSpyCall(clearTriplesSpy, 1);
                });

                it('... should set `triples` to an empty string', () => {
                    component.clearTriples();

                    expectToBe(component.triples(), '');
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
                    it('`performQueryRequest` if triples are given', () => {
                        component.performQuery();

                        expectSpyCall(emitPerformQueryRequestSpy, 1);
                        expectSpyCall(emitErrorMessageSpy, 0);
                    });

                    it('`errorMessageRequest` with errorMessage if triples are not given', () => {
                        const expectedErrorMessage = new ToastMessage('Empty triples', 'Please enter triple content.');

                        component.triples.set('');
                        component.performQuery();

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

                    await clickAndAwaitChanges(btnDes[0], fixture);
                });

                it('... should have a method `resetTriples`', () => {
                    expect(component.resetTriples).toBeDefined();
                });

                it('... should trigger on resetRequest event from EditorActionButtonsComponent (hollow)', () => {
                    const actionButtonsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditorActionButtonsComponent,
                        1,
                        1
                    );
                    const actionButtonsCmp = actionButtonsDes[0].injector.get(EditorActionButtonsComponent);

                    actionButtonsCmp.resetRequest.emit();

                    expectSpyCall(resetTriplesSpy, 1);
                });

                it('... should emit resetTriplesRequest', () => {
                    component.resetTriples();

                    expectSpyCall(emitResetTriplesRequestSpy, 1);
                });
            });
        });
    });
});
