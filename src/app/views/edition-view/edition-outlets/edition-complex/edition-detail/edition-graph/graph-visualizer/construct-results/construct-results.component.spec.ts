import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EMPTY, Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbAccordionDirective, NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

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

import { D3SimulationNode, D3SimulationNodeType, Triple } from '../models';
import { ConstructResultsComponent } from './construct-results.component';

// Mock components
@Component({ selector: 'awg-force-graph', template: '' })
class ForceGraphStubComponent {
    @Input() queryResultTriples: Triple[];
    @Input() height: number;
    @Output() clickedNodeRequest: EventEmitter<D3SimulationNode> = new EventEmitter<D3SimulationNode>();
}

@Component({ selector: 'awg-sparql-no-results', template: '' })
class SparqlNoResultsStubComponent {}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('ConstructResultsComponent (DONE)', () => {
    let component: ConstructResultsComponent;
    let fixture: ComponentFixture<ConstructResultsComponent>;
    let compDe: DebugElement;

    let expectedHeight: number;
    let expectedQueryResult: Triple;
    let expectedQueryResult$: Observable<Triple[]>;
    let expectedIsFullscreen: boolean;

    let emitClickedNodeRequestSpy: Spy;
    let isAccordionItemDisabledSpy: Spy;
    let isQueryResultNotEmptySpy: Spy;
    let nodeClickSpy: Spy;

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
            declarations: [
                ConstructResultsComponent,
                ForceGraphStubComponent,
                SparqlNoResultsStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConstructResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedHeight = 500;
        expectedIsFullscreen = false;
        expectedQueryResult = {
            subject: 'example:Test',
            predicate: 'example:has',
            object: 'example:Success',
        };
        expectedQueryResult$ = observableOf([expectedQueryResult]);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        emitClickedNodeRequestSpy = spyOn(component.clickedNodeRequest, 'emit').and.callThrough();
        isAccordionItemDisabledSpy = spyOn(component, 'isAccordionItemDisabled').and.callThrough();
        isQueryResultNotEmptySpy = spyOn(component, 'isQueryResultNotEmpty').and.callThrough();
        nodeClickSpy = spyOn(component, 'onGraphNodeClick').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have queryResult', () => {
            expect(component.queryResult$).toBeUndefined();
        });

        it('... should not have defaultForceGraphHeight', () => {
            expect(component.defaultForceGraphHeight).toBeUndefined();
        });

        it('... should not have isFullscreen', () => {
            expect(component.isFullscreen).toBeUndefined();
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
            component.queryResult$ = expectedQueryResult$;
            component.defaultForceGraphHeight = expectedHeight;
            component.isFullscreen = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `queryResult` input', () => {
            expectToEqual(component.queryResult$, expectedQueryResult$);
        });

        it('... should have `defaultForceGraphHeight` input', () => {
            expectToBe(component.defaultForceGraphHeight, expectedHeight);
        });

        it('... should have `isFullscreen` input', () => {
            expectToBe(component.isFullscreen, expectedIsFullscreen);
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                // NgbAccordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            describe('not in fullscreen mode', () => {
                it('... should contain div.accordion-item with header and open body in div.accordion', () => {
                    // NgbAccordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    // Div.accordion-item
                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-construct-results.accordion-item',
                        1,
                        1
                    );
                    // Header (div.accordion-header)
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-construct-results > div.accordion-header',
                        1,
                        1
                    );

                    // Body open (div.accordion-collapse)
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-construct-results-collapse',
                        1,
                        1
                    );
                    const itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-header',
                        1,
                        1
                    );

                    // Item header button
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should toggle item body on click', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Item body is collapsed
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-collapse',
                        1,
                        1,
                        'collapsed'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'collapse');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Item body is open again
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                describe('... should contain TwelveToneSpinnerComponent (stubbed) in item body while loading if ... ', () => {
                    it('... queryResult$ is EMPTY', () => {
                        // Mock empty observable
                        component.queryResult$ = EMPTY;
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is undefined', () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf(undefined);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is null', () => {
                        // Mock null response
                        component.queryResult$ = observableOf(null);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });
                });

                describe('... should contain item body with SparqlNoResultsStubComponent (stubbed) if ... ', () => {
                    it('... queryResult is empty array', () => {
                        // Mock empty array
                        component.queryResult$ = observableOf([]);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult is undefined or empty string', () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            { subject: undefined, predicate: undefined, object: undefined },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);

                        // Mock empty response
                        component.queryResult$ = observableOf([{ subject: '', predicate: '', object: '' }]);
                        detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.subject is undefined or empty string', () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: undefined,
                                predicate: 'example:has',
                                object: 'example:Success',
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);

                        // Mock empty response
                        component.queryResult$ = observableOf([
                            {
                                subject: '',
                                predicate: 'example:has',
                                object: 'example:Success',
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.predicate is undefined or empty string', () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: undefined,
                                object: 'example:Success',
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);

                        // Mock empty response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: '',
                                object: 'example:Success',
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.object is undefined or empty string', () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: 'example:has',
                                object: undefined,
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);

                        // Mock empty response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: 'example:has',
                                object: '',
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });
                });

                it('... should contain item body with ForceGraphComponent (stubbed) if results are available', () => {
                    // Item body
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                        1,
                        1
                    );

                    // ForceGraph
                    getAndExpectDebugElementByDirective(bodyDes[0], ForceGraphStubComponent, 1, 1);
                });

                it('... should pass down `queryResult` and `defaultForceGraphHeight` to forceGraph component', () => {
                    const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                    const forceGraphCmp = forceGraphDes[0].injector.get(
                        ForceGraphStubComponent
                    ) as ForceGraphStubComponent;

                    expectToEqual(forceGraphCmp.queryResultTriples, [expectedQueryResult]);
                    expectToBe(forceGraphCmp.height, expectedHeight);
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(() => {
                    // Set fullscreen mode
                    component.isFullscreen = true;
                    detectChangesOnPush(fixture);
                });

                it('... should contain div.accordion-item with header and open body in div.accordion', () => {
                    // NgbAccordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    // Panel (div.accordion-item)
                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-construct-results.accordion-item',
                        1,
                        1
                    );
                    // Header (div.accordion-header)
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-construct-results > div.accordion-header',
                        1,
                        1
                    );

                    // Body open (div.accordion-collapse)
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-construct-results-collapse',
                        1,
                        1
                    );
                    const itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-header',
                        1,
                        1
                    );

                    // Panel header button
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should not toggle item body on click', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    expect(btnEl.disabled).toBeTruthy();

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Item body does not close again
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                describe('... should contain TwelveToneSpinnerComponent (stubbed) in item body while loading if ... ', () => {
                    it('... queryResult$ is EMPTY', () => {
                        // Mock empty observable
                        component.queryResult$ = EMPTY;
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is undefined', () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf(undefined);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is null', () => {
                        // Mock null response
                        component.queryResult$ = observableOf(null);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });
                });

                describe('... should contain item body with SparqlNoResultsStubComponent (stubbed) if ... ', () => {
                    it('... queryResult is empty array', () => {
                        // Mock empty array
                        component.queryResult$ = observableOf([]);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult is undefined or empty string', () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            { subject: undefined, predicate: undefined, object: undefined },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);

                        // Mock empty response
                        component.queryResult$ = observableOf([{ subject: '', predicate: '', object: '' }]);
                        detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.subject is undefined or empty string', () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: undefined,
                                predicate: 'example:has',
                                object: 'example:Success',
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);

                        // Mock empty response
                        component.queryResult$ = observableOf([
                            {
                                subject: '',
                                predicate: 'example:has',
                                object: 'example:Success',
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.predicate is undefined or empty string', () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: undefined,
                                object: 'example:Success',
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);

                        // Mock empty response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: '',
                                object: 'example:Success',
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.object is undefined or empty string', () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: 'example:has',
                                object: undefined,
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);

                        // Mock empty response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: 'example:has',
                                object: '',
                            },
                        ]);
                        detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });
                });

                it('... should contain item body with ForceGraphComponent (stubbed) if results are available', () => {
                    // Item body
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                        1,
                        1
                    );

                    // ForceGraph
                    getAndExpectDebugElementByDirective(bodyDes[0], ForceGraphStubComponent, 1, 1);
                });

                it('... should pass down `queryResult` and `defaultForceGraphHeight` to forceGraph component', () => {
                    const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                    const forceGraphCmp = forceGraphDes[0].injector.get(
                        ForceGraphStubComponent
                    ) as ForceGraphStubComponent;

                    expectToEqual(forceGraphCmp.queryResultTriples, [expectedQueryResult]);
                    expectToBe(forceGraphCmp.height, expectedHeight);
                });
            });
        });

        describe('#isAccordionItemDisabled()', () => {
            it('... should have a method `isAccordionItemDisabled`', () => {
                expect(component.isAccordionItemDisabled).toBeDefined();
            });

            it('... should be triggered from ngbAccordionItem', () => {
                expectSpyCall(isAccordionItemDisabledSpy, 2);
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

        describe('#isQueryResultNotEmpty()', () => {
            it('... should have a method `isQueryResultNotEmpty`', () => {
                expect(component.isQueryResultNotEmpty).toBeDefined();
            });

            it('... should be triggered from ngbAccordionBody', () => {
                expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult[0]);
            });

            it('... should be triggered by change of queryResult', () => {
                expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult[0]);

                // Mock another queryResult
                const anotherQueryResult = {
                    subject: 'example:AnotherTest',
                    predicate: 'example:has',
                    object: 'example:AnotherSuccess',
                };
                component.queryResult$ = observableOf([anotherQueryResult]);
                detectChangesOnPush(fixture);

                expectSpyCall(isQueryResultNotEmptySpy, 3, anotherQueryResult[0]);
            });

            describe('... should return false if ...', () => {
                it('... queryResult is empty array', () => {
                    expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult[0]);

                    // Mock empty response
                    const emptyQueryResult = [];
                    component.queryResult$ = observableOf(emptyQueryResult);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 3, emptyQueryResult);
                    expectToBe(component.isQueryResultNotEmpty(emptyQueryResult), false);
                });

                it('... queryResult.subject is undefined or empty string', () => {
                    expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult[0]);

                    // Mock undefined response
                    const undefinedQueryResult = {
                        subject: undefined,
                        predicate: 'example:has',
                        object: 'example:Success',
                    };
                    component.queryResult$ = observableOf([undefinedQueryResult]);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 3, undefinedQueryResult[0]);
                    expectToBe(component.isQueryResultNotEmpty([undefinedQueryResult]), false);

                    // Mock empty response
                    const emptyQueryResult = {
                        subject: '',
                        predicate: 'example:has',
                        object: 'example:Success',
                    };
                    component.queryResult$ = observableOf([emptyQueryResult]);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 5, emptyQueryResult[0]);
                    expectToBe(component.isQueryResultNotEmpty([emptyQueryResult]), false);
                });

                it('... queryResult.predicate is undefined or empty string', () => {
                    expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult[0]);

                    // Mock undefined response
                    const undefinedQueryResult = {
                        subject: 'example:Test',
                        predicate: undefined,
                        object: 'example:Success',
                    };
                    component.queryResult$ = observableOf([undefinedQueryResult]);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 3, undefinedQueryResult[0]);
                    expectToBe(component.isQueryResultNotEmpty([undefinedQueryResult]), false);

                    // Mock empty response
                    const emptyQueryResult = {
                        subject: 'example:Test',
                        predicate: '',
                        object: 'example:Success',
                    };
                    component.queryResult$ = observableOf([emptyQueryResult]);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 5, emptyQueryResult[0]);
                    expectToBe(component.isQueryResultNotEmpty([emptyQueryResult]), false);
                });

                it('... queryResult.object is undefined or empty string', () => {
                    expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult[0]);

                    // Mock undefined response
                    const undefinedQueryResult = {
                        subject: 'example:Test',
                        predicate: 'example:has',
                        object: undefined,
                    };
                    component.queryResult$ = observableOf([undefinedQueryResult]);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 3, undefinedQueryResult[0]);
                    expectToBe(component.isQueryResultNotEmpty([undefinedQueryResult]), false);

                    // Mock empty response
                    const emptyQueryResult = {
                        subject: 'example:Test',
                        predicate: 'example:has',
                        object: '',
                    };
                    component.queryResult$ = observableOf([emptyQueryResult]);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 5, emptyQueryResult[0]);
                    expectToBe(component.isQueryResultNotEmpty([emptyQueryResult]), false);
                });

                it('... queryResult.subject, queryResult.predicate and queryResult.object are undefined or empty string', () => {
                    expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult[0]);

                    // Mock undefined response
                    const undefinedQueryResult = { subject: undefined, predicate: undefined, object: undefined };
                    component.queryResult$ = observableOf([undefinedQueryResult]);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 3, undefinedQueryResult[0]);
                    expectToBe(component.isQueryResultNotEmpty([undefinedQueryResult]), false);

                    // Mock empty response
                    const emptyQueryResult = { subject: '', predicate: '', object: '' };
                    component.queryResult$ = observableOf([emptyQueryResult]);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 5, emptyQueryResult[0]);
                    expectToBe(component.isQueryResultNotEmpty([emptyQueryResult]), false);
                });
            });

            it('... should return true if queryResult is not empty', () => {
                expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult[0]);

                // Mock non-empty response
                const nonEmptyQueryResult = {
                    subject: 'example:Test',
                    predicate: 'example:has',
                    object: 'example:Success',
                };
                component.queryResult$ = observableOf([nonEmptyQueryResult]);
                detectChangesOnPush(fixture);

                expectSpyCall(isQueryResultNotEmptySpy, 3, nonEmptyQueryResult[0]);
                expectToBe(component.isQueryResultNotEmpty([nonEmptyQueryResult]), true);
            });
        });

        describe('#onGraphNodeClick()', () => {
            it('... should have a method `onGraphNodeClick`', () => {
                expect(component.onGraphNodeClick).toBeDefined();
            });

            it('... should trigger on event from ForceGraphCompnent', () => {
                const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                const forceGraphCmp = forceGraphDes[0].injector.get(ForceGraphStubComponent) as ForceGraphStubComponent;

                const node: D3SimulationNode = new D3SimulationNode('Test', D3SimulationNodeType.node);
                forceGraphCmp.clickedNodeRequest.emit(node);

                expectSpyCall(nodeClickSpy, 1, node);
            });

            it('... should not emit anything if no node is provided', () => {
                const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                const forceGraphCmp = forceGraphDes[0].injector.get(ForceGraphStubComponent) as ForceGraphStubComponent;

                // Node is undefined
                forceGraphCmp.clickedNodeRequest.emit(undefined);

                expectSpyCall(nodeClickSpy, 1, undefined);
                expectSpyCall(emitClickedNodeRequestSpy, 0);
            });

            it('... should emit provided node on click', () => {
                const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                const forceGraphCmp = forceGraphDes[0].injector.get(ForceGraphStubComponent) as ForceGraphStubComponent;

                const node: D3SimulationNode = new D3SimulationNode('Test', D3SimulationNodeType.node);
                forceGraphCmp.clickedNodeRequest.emit(node);

                expectSpyCall(nodeClickSpy, 1, node);
                expectSpyCall(emitClickedNodeRequestSpy, 1, node);
            });
        });
    });
});
