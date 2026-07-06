import { Component, DebugElement, EventEmitter, Input, NgModule, Output, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EMPTY, Observable, of as observableOf } from 'rxjs';

import { NgbAccordionDirective, NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { clickAndAwaitChanges } from '@testing/click-helper';
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
@Component({
    selector: 'awg-force-graph',
    template: '',
    standalone: false,
})
class ForceGraphStubComponent {
    @Input()
    currentQueryResultTriples: Triple[];
    @Input()
    height: number;
    @Output()
    clickedNodeRequest: EventEmitter<D3SimulationNode> = new EventEmitter<D3SimulationNode>();
}

@Component({
    selector: 'awg-sparql-no-results',
    template: '',
    standalone: false,
})
class SparqlNoResultsStubComponent {}

@Component({
    selector: 'awg-twelve-tone-spinner',
    template: '',
    standalone: false,
})
class TwelveToneSpinnerStubComponent {}

describe('ConstructResultsComponent (DONE)', () => {
    let component: ConstructResultsComponent;
    let fixture: ComponentFixture<ConstructResultsComponent>;
    let compDe: DebugElement;

    let expectedHeight: number;
    let expectedQueryResult: Triple[];
    let expectedQueryResult$: Observable<Triple[]>;
    let expectedIsFullscreen: boolean;

    let emitClickedNodeRequestSpy: Spy;
    let isAccordionItemDisabledSpy: Spy;
    let isValidConstructQueryResultSpy: Spy;
    let nodeClickSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor() {
            const config = inject(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbAccordionWithConfigModule, NgbAccordionDirective],
            declarations: [
                ConstructResultsComponent,
                ForceGraphStubComponent,
                SparqlNoResultsStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConstructResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedHeight = 500;
        expectedIsFullscreen = false;
        expectedQueryResult = [
            {
                subject: 'example:Test',
                predicate: 'example:has',
                object: 'example:Success',
            },
        ];
        expectedQueryResult$ = observableOf(expectedQueryResult);

        // Spies
        emitClickedNodeRequestSpy = vi.spyOn(component.clickedNodeRequest, 'emit');
        isAccordionItemDisabledSpy = vi.spyOn(component, 'isAccordionItemDisabled');
        isValidConstructQueryResultSpy = vi.spyOn(component, 'isValidConstructQueryResult');
        nodeClickSpy = vi.spyOn(component, 'onGraphNodeClick');
    });

    afterEach(() => {
        vi.restoreAllMocks();
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
            it('... should contain one div.accordion', () => {
                // Div.accordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain one div.accordion-item with header and non-collapsible body yet in div.accordion', () => {
                // Div.accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);
                // Header (div.accordion-header)
                getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-header', 1, 1);

                // Body (div.accordion-collapse)
                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1);
                const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'accordion-collapse');
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
            describe('not in fullscreen mode', () => {
                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
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
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

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
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should toggle item body on click', async () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    // Click header button
                    await clickAndAwaitChanges(btnDes[0], fixture);

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
                    await clickAndAwaitChanges(btnDes[0], fixture);

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
                    it('... queryResult$ is EMPTY', async () => {
                        // Mock empty observable
                        component.queryResult$ = EMPTY;
                        await detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is undefined', async () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf(undefined);
                        await detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is null', async () => {
                        // Mock null response
                        component.queryResult$ = observableOf(null);
                        await detectChangesOnPush(fixture);

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
                    it('... queryResult is empty array', async () => {
                        // Mock empty array
                        component.queryResult$ = observableOf([]);
                        await detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult is undefined or empty string', async () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            { subject: undefined, predicate: undefined, object: undefined },
                        ]);
                        await detectChangesOnPush(fixture);

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
                        await detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.subject is undefined or empty string', async () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: undefined,
                                predicate: 'example:has',
                                object: 'example:Success',
                            },
                        ]);
                        await detectChangesOnPush(fixture);

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
                        await detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.predicate is undefined or empty string', async () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: undefined,
                                object: 'example:Success',
                            },
                        ]);
                        await detectChangesOnPush(fixture);

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
                        await detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.object is undefined or empty string', async () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: 'example:has',
                                object: undefined,
                            },
                        ]);
                        await detectChangesOnPush(fixture);

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
                        await detectChangesOnPush(fixture);

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

                    expectToEqual(forceGraphCmp.currentQueryResultTriples, expectedQueryResult);
                    expectToBe(forceGraphCmp.height, expectedHeight);
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(async () => {
                    // Set fullscreen mode
                    component.isFullscreen = true;
                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    // NgbAccordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    // Item (div.accordion-item)
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
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

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
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should not toggle item body on click', async () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expect(btnEl.disabled).toBeTruthy();

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-construct-results > div.accordion-collapse',
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
                        'div#awg-graph-visualizer-construct-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                describe('... should contain TwelveToneSpinnerComponent (stubbed) in item body while loading if ... ', () => {
                    it('... queryResult$ is EMPTY', async () => {
                        // Mock empty observable
                        component.queryResult$ = EMPTY;
                        await detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is undefined', async () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf(undefined);
                        await detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is null', async () => {
                        // Mock null response
                        component.queryResult$ = observableOf(null);
                        await detectChangesOnPush(fixture);

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
                    it('... queryResult is empty array', async () => {
                        // Mock empty array
                        component.queryResult$ = observableOf([]);
                        await detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult is undefined or empty string', async () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            { subject: undefined, predicate: undefined, object: undefined },
                        ]);
                        await detectChangesOnPush(fixture);

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
                        await detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.subject is undefined or empty string', async () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: undefined,
                                predicate: 'example:has',
                                object: 'example:Success',
                            },
                        ]);
                        await detectChangesOnPush(fixture);

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
                        await detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.predicate is undefined or empty string', async () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: undefined,
                                object: 'example:Success',
                            },
                        ]);
                        await detectChangesOnPush(fixture);

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
                        await detectChangesOnPush(fixture);

                        // Item body
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-construct-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.object is undefined or empty string', async () => {
                        // Mock undefined response
                        component.queryResult$ = observableOf([
                            {
                                subject: 'example:Test',
                                predicate: 'example:has',
                                object: undefined,
                            },
                        ]);
                        await detectChangesOnPush(fixture);

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
                        await detectChangesOnPush(fixture);

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

                    expectToEqual(forceGraphCmp.currentQueryResultTriples, expectedQueryResult);
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

        describe('#isValidConstructQueryResult()', () => {
            it('... should have a method `isValidConstructQueryResult`', () => {
                expect(component.isValidConstructQueryResult).toBeDefined();
            });

            it('... should be triggered from ngbAccordionBody', () => {
                expectSpyCall(isValidConstructQueryResultSpy, 3, [expectedQueryResult]);
            });

            it('... should be triggered by change of queryResult', async () => {
                expectSpyCall(isValidConstructQueryResultSpy, 3, [expectedQueryResult]);

                // Mock another queryResult
                const anotherQueryResult = [
                    {
                        subject: 'example:AnotherTest',
                        predicate: 'example:has',
                        object: 'example:AnotherSuccess',
                    },
                ];
                component.queryResult$ = observableOf(anotherQueryResult);
                await detectChangesOnPush(fixture);

                expectSpyCall(isValidConstructQueryResultSpy, 4, [anotherQueryResult]);
            });

            describe('... should return false if', () => {
                it.each([
                    {
                        desc: 'queryResult is empty array',
                        query: [],
                    },
                    {
                        desc: 'subject is undefined',
                        query: [{ subject: undefined, predicate: 'example:has', object: 'example:Success' }],
                    },
                    {
                        desc: 'subject is an empty string',
                        query: [{ subject: '', predicate: 'example:has', object: 'example:Success' }],
                    },
                    {
                        desc: 'predicate is undefined',
                        query: [{ subject: 'example:Test', predicate: undefined, object: 'example:Success' }],
                    },
                    {
                        desc: 'predicate is an empty string',
                        query: [{ subject: 'example:Test', predicate: '', object: 'example:Success' }],
                    },
                    {
                        desc: 'object is undefined',
                        query: [{ subject: 'example:Test', predicate: 'example:has', object: undefined }],
                    },
                    {
                        desc: 'object is an empty string',
                        query: [{ subject: 'example:Test', predicate: 'example:has', object: '' }],
                    },
                    {
                        desc: 'all fields are undefined',
                        query: [{ subject: undefined, predicate: undefined, object: undefined }],
                    },
                    {
                        desc: 'all fields are empty strings',
                        query: [{ subject: '', predicate: '', object: '' }],
                    },
                ])('... $desc', async ({ query }) => {
                    isValidConstructQueryResultSpy.mockClear();

                    component.queryResult$ = observableOf(query);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(isValidConstructQueryResultSpy, 1, [query]);
                    expectToBe(component.isValidConstructQueryResult(query), false);
                });
            });

            describe('... should return true if', () => {
                it.each([
                    {
                        desc: 'queryResult is valid',
                        query: [{ subject: 'example:Test', predicate: 'example:has', object: 'example:Success' }],
                    },
                    {
                        desc: 'queryResult changes to another valid result',
                        query: [
                            {
                                subject: 'example:AnotherTest',
                                predicate: 'example:has',
                                object: 'example:AnotherSuccess',
                            },
                        ],
                    },
                ])('... $desc', async ({ query }) => {
                    isValidConstructQueryResultSpy.mockClear();

                    component.queryResult$ = observableOf(query);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(isValidConstructQueryResultSpy, 1, [query]);
                    expectToBe(component.isValidConstructQueryResult(query), true);
                });
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
