import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';

import Spy = jasmine.Spy;
import { NgbAccordion, NgbAccordionModule, NgbConfig, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
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
    let expectedIsFullscreen: boolean;

    let onEditorInputChangeSpy: Spy;
    let performQuerySpy: Spy;
    let preventPanelCollapseOnFullscreenSpy: Spy;
    let resetTriplesSpy: Spy;
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

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [NgbAccordionWithConfigModule],
                declarations: [TriplesEditorComponent, CodeMirrorStubComponent, NgbAccordion],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(TriplesEditorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedIsFullscreen = false;

        expectedTriples = 'example:Test example:has example:Success';
        expectedCmTriplesConfig = {
            lineNumbers: true,
            firstLineNumber: 1,
            lineWrapping: true,
            matchBrackets: true,
            mode: 'turtle',
        };

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        onEditorInputChangeSpy = spyOn(component, 'onEditorInputChange').and.callThrough();
        performQuerySpy = spyOn(component, 'performQuery').and.callThrough();
        preventPanelCollapseOnFullscreenSpy = spyOn(component, 'preventPanelCollapseOnFullscreen').and.callThrough();
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
        it('... should not have isFullscreen', () => {
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
            component.triples = expectedTriples;
            component.isFullscreen = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `triples` input', () => {
            expect(component.triples).toBeDefined('should be defined');
            expect(component.triples).toEqual(expectedTriples, `should equal ${expectedTriples}`);
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

                        // Click header button
                        click(btnEl as HTMLElement);
                        // Fixture.detectChanges();
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(
                            // Panel body is closed again
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

                        // Panel body is open
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-triples > div.card-body',
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
                            'div#awg-graph-visualizer-triples > div.card-body',
                            0,
                            0,
                            'collapsed'
                        );

                        // Click header button
                        click(btnEl as HTMLElement);
                        // Fixture.detectChanges();
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(
                            // Panel body is open again
                            compDe,
                            'div#awg-graph-visualizer-triples > div.card-body',
                            1,
                            1,
                            'open'
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

            describe('in fullscreen mode', () => {
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
                        'div#awg-graph-visualizer-triples-header.card-header',
                        1,
                        1
                    ); // Panel (div.card)

                    // Body opened
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-triples > div.card-body',
                        1,
                        1
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

                it('... should not toggle panel body on click', () => {
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

                    // Panel body does not close
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-triples > div.card-body',
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
                        'div#awg-graph-visualizer-triples > div.card-body',
                        1,
                        1,
                        'open'
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
            beforeEach(async () => {
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
                await detectChangesOnPush(fixture);
            });

            it('... should trigger on event from CodeMirrorComponent', () => {
                const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorStubComponent) as CodeMirrorStubComponent;

                const changedTriples = 'example:Success example:is example:Testing';
                codeMirrorCmp.ngModelChange.emit(changedTriples);

                expectSpyCall(onEditorInputChangeSpy, 1, changedTriples);
            });

            it('... should not emit anything if no triples are provided', () => {
                const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorStubComponent) as CodeMirrorStubComponent;

                // Triples are undefined
                codeMirrorCmp.ngModelChange.emit('');

                expectSpyCall(onEditorInputChangeSpy, 1, '');
                expectSpyCall(emitUpdateTriplesRequestSpy, 0);
            });

            it('... should emit provided triples on editor change', () => {
                const codeMirrorDes = getAndExpectDebugElementByDirective(compDe, CodeMirrorStubComponent, 1, 1);
                const codeMirrorCmp = codeMirrorDes[0].injector.get(CodeMirrorStubComponent) as CodeMirrorStubComponent;

                const changedTriples = 'example:Success example:is example:Testing';
                codeMirrorCmp.ngModelChange.emit(changedTriples);

                expectSpyCall(onEditorInputChangeSpy, 1, changedTriples);
                expectSpyCall(emitUpdateTriplesRequestSpy, 1, changedTriples);
            });
        });

        describe('#performQuery', () => {
            beforeEach(async () => {
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
                await detectChangesOnPush(fixture);
            });

            it('... should trigger on click on Query button', async () => {
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
                await detectChangesOnPush(fixture);

                expectSpyCall(performQuerySpy, 1);
            });

            it('... should emit request on click', async () => {
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
                await detectChangesOnPush(fixture);

                expectSpyCall(performQuerySpy, 1);
                expectSpyCall(emitPerformQueryRequestSpy, 1);
            });
        });

        describe('#resetTriples', () => {
            beforeEach(async () => {
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
                await detectChangesOnPush(fixture);
            });

            it('... should trigger on click on Reset button', async () => {
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
                await detectChangesOnPush(fixture);

                expectSpyCall(resetTriplesSpy, 1);
            });

            it('... should emit request on click', async () => {
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
                await detectChangesOnPush(fixture);

                expectSpyCall(resetTriplesSpy, 1);
                expectSpyCall(emitResetTriplesRequestSpy, 1);
            });
        });

        describe('#togglePanel', () => {
            it('... should return empty string if isFullscreen = false', () => {
                expect(component.togglePanel()).not.toBeTruthy();
            });

            it('... should return panel id if isFullscreen = true', () => {
                const expectedId = 'awg-graph-visualizer-triples';

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
                    preventDefault: () => {},
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
                    preventDefault: () => {},
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
                    preventDefault: () => {},
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
                    preventDefault: () => {},
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
