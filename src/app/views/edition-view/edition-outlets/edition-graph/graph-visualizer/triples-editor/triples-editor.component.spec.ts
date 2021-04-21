import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';

import Spy = jasmine.Spy;
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective
} from '@testing/expect-helper';

import { TriplesEditorComponent } from './triples-editor.component';

// eslint-disable-next-line @angular-eslint/component-selector
@Component({ selector: 'ngx-codemirror', template: '' })
class CodeMirrorStubComponent {
    @Input() options: {
        [key: string]: any;
    };
    @Input() ngModel: string;
    @Output() ngModelChange: EventEmitter<string> = new EventEmitter<string>();
}

describe('TriplesEditorComponent (DONE)', () => {
    let component: TriplesEditorComponent;
    let fixture: ComponentFixture<TriplesEditorComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedTriples: string;
    let expectedCmTriplesConfig: {
        [key: string]: any;
    };

    let onEditorInputChangeSpy: Spy;
    let performQuerySpy: Spy;
    let resetTriplesSpy: Spy;
    let emitPerformQueryRequestSpy: Spy;
    let emitResetTriplesRequestSpy: Spy;
    let emitUpdateTriplesRequestSpy: Spy;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [NgbAccordionModule],
                declarations: [TriplesEditorComponent, CodeMirrorStubComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(TriplesEditorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedTriples = 'example:Test example:has example:Success';
        expectedCmTriplesConfig = {
            lineNumbers: true,
            firstLineNumber: 1,
            lineWrapping: true,
            matchBrackets: true,
            mode: 'turtle'
        };

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        onEditorInputChangeSpy = spyOn(component, 'onEditorInputChange').and.callThrough();
        performQuerySpy = spyOn(component, 'performQuery').and.callThrough();
        resetTriplesSpy = spyOn(component, 'resetTriples').and.callThrough();
        emitPerformQueryRequestSpy = spyOn(component.performQueryRequest, 'emit').and.callThrough();
        emitResetTriplesRequestSpy = spyOn(component.resetTriplesRequest, 'emit').and.callThrough();
        emitUpdateTriplesRequestSpy = spyOn(component.updateTriplesRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have triples', () => {
            expect(component.triples).toBeUndefined('should be undefined');
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
            component.triples = expectedTriples;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `triples` input', () => {
            expect(component.triples).toBeDefined('should be defined');
            expect(component.triples).toEqual(expectedTriples, `should equal ${expectedTriples}`);
        });

        describe('VIEW', () => {
            describe('with closed panel', () => {
                it('... should contain one ngb-accordion with panel (div.card) header and collapsed body', () => {
                    // Ngb-accordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                    // Panel (div.card)
                    const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 1, 1); // Panel (div.card)
                    // Header
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-triples-header.card-header',
                        1,
                        1
                    ); // Panel (div.card)
                    // No body
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-triples > div.card-body',
                        0,
                        0
                    );
                });

                it('... should display panel header button', () => {
                    // Panel header button
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples-header > button',
                        1,
                        1
                    );

                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expect(btnEl.textContent).toBeDefined();
                    expect(btnEl.textContent).toContain('RDF Triples', 'should be RDF Triples');
                });

                it('... should toggle panel body on click', () => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples-header.card-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.btn-link', 1, 1);
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    // Panel body is closed
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.card-body',
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
                        'div#awg-graph-visualizer-triples > div.card-body',
                        1,
                        1,
                        'open'
                    );

                    // click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // panel body is closed again
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.card-body',
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
                        'div#awg-graph-visualizer-triples-header.card-header > button.btn-link',
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
                        'div#awg-graph-visualizer-triples > div.card-body',
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

                it('... should trigger `performQuery()` by click on Query button', () => {
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.card-body > div > button.btn',
                        2,
                        2
                    );
                    const btnEl0 = btnDes[0].nativeElement;
                    expect(btnEl0.textContent).toContain('Query', 'should contain Query');

                    // Click query button
                    click(btnEl0 as HTMLElement);
                    detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 1);
                    expectSpyCall(resetTriplesSpy, 0);
                });

                it('... should trigger `resetTriples()` by click on Reset button', () => {
                    const btnDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.card-body > div > button.btn',
                        2,
                        2
                    );
                    const btnEl1 = btnDes[1].nativeElement;
                    expect(btnEl1.textContent).toContain('Reset', 'should contain Query');

                    // Click reset button
                    click(btnEl1 as HTMLElement);
                    detectChangesOnPush(fixture);

                    expectSpyCall(performQuerySpy, 0);
                    expectSpyCall(resetTriplesSpy, 1);
                });
            });
        });

        describe('#onEditorInputChange', () => {
            beforeEach(() => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-triples-header.card-header > button.btn-link',
                    1,
                    1
                );
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);
            });

            it('... should trigger on event from CodeMirrorComponent', fakeAsync(() => {
                const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorStubComponent) as CodeMirrorStubComponent;

                const changedTriples = 'example:Success example:is example:Testing';
                codeMirrorCmp.ngModelChange.emit(changedTriples);

                expectSpyCall(onEditorInputChangeSpy, 1, changedTriples);
            }));

            it('... should not emit anything if no triples are provided', fakeAsync(() => {
                const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorStubComponent) as CodeMirrorStubComponent;

                // Triples are undefined
                codeMirrorCmp.ngModelChange.emit('');

                expectSpyCall(onEditorInputChangeSpy, 1, '');
                expectSpyCall(emitUpdateTriplesRequestSpy, 0);
            }));

            it('... should emit provided triples on editor change', fakeAsync(() => {
                const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorStubComponent) as CodeMirrorStubComponent;

                const changedTriples = 'example:Success example:is example:Testing';
                codeMirrorCmp.ngModelChange.emit(changedTriples);

                expectSpyCall(onEditorInputChangeSpy, 1, changedTriples);
                expectSpyCall(emitUpdateTriplesRequestSpy, 1, changedTriples);
            }));
        });

        describe('#performQuery', () => {
            beforeEach(() => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-triples-header.card-header > button.btn-link',
                    1,
                    1
                );
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);
            });

            it('... should trigger on click on Query button', () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-triples > div.card-body > div > button.btn',
                    2,
                    2
                );
                const btnEl0 = btnDes[0].nativeElement;
                expect(btnEl0.textContent).toContain('Query', 'should contain Query');

                // Click query button
                click(btnEl0 as HTMLElement);
                detectChangesOnPush(fixture);

                expectSpyCall(performQuerySpy, 1);
            });

            it('... should emit request on click', fakeAsync(() => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-triples > div.card-body > div > button.btn',
                    2,
                    2
                );
                const btnEl0 = btnDes[0].nativeElement;
                expect(btnEl0.textContent).toContain('Query', 'should contain Query');

                // Click query button
                click(btnEl0 as HTMLElement);
                detectChangesOnPush(fixture);

                expectSpyCall(performQuerySpy, 1);
                expectSpyCall(emitPerformQueryRequestSpy, 1);
            }));
        });

        describe('#resetTriples', () => {
            beforeEach(() => {
                // Open panel by click on header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-triples-header.card-header > button.btn-link',
                    1,
                    1
                );
                const btnEl = btnDes[0].nativeElement;

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);
            });

            it('... should trigger on click on Reset button', () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-triples > div.card-body > div > button.btn',
                    2,
                    2
                );
                const btnEl1 = btnDes[1].nativeElement;
                expect(btnEl1.textContent).toContain('Reset', 'should contain Reset');

                // Click query button
                click(btnEl1 as HTMLElement);
                detectChangesOnPush(fixture);

                expectSpyCall(resetTriplesSpy, 1);
            });

            it('... should emit request on click', fakeAsync(() => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-triples > div.card-body > div > button.btn',
                    2,
                    2
                );
                const btnEl1 = btnDes[1].nativeElement;
                expect(btnEl1.textContent).toContain('Reset', 'should contain Reset');

                // Click reset button
                click(btnEl1 as HTMLElement);
                detectChangesOnPush(fixture);

                expectSpyCall(resetTriplesSpy, 1);
                expectSpyCall(emitResetTriplesRequestSpy, 1);
            }));
        });
    });
});
