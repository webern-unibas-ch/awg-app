import { Component, DebugElement, EventEmitter, Input, NgModule, Output, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EMPTY, lastValueFrom, Observable, of as observableOf } from 'rxjs';

import type { Quad } from '@rdfjs/types';
import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataFactory } from 'n3';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { TwelveToneSpinnerStubComponent } from '@testing/component-stubs';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { GraphData, GraphNode } from '../../models/graph-data.model';
import { SparqlConstructResult, SparqlResult } from '../../models/sparql-result.model';
import { GRAPH_DATA_UTILS } from '../../utils/graph-data.utils';
import { DEFAULT_PREFIXES } from '../../utils/prefix.utils';

import { GraphResultsConstructComponent } from './graph-results-construct.component';

const { namedNode, quad } = DataFactory;

/**
 * Helper function: createConstructResult.
 *
 * It creates a construct result with one quad per given subject (`awg:<subject> awg:has awg:Success`).
 */
const createConstructResult = (subjects: string[]): SparqlConstructResult => {
    const awg = (localName: string) => namedNode(`${DEFAULT_PREFIXES['awg']}${localName}`);
    return {
        kind: 'construct',
        quads: subjects.map(subject => quad(awg(subject), awg('has'), awg('Success')) as Quad),
        prefixes: DEFAULT_PREFIXES,
    };
};

// Mock components
@Component({
    selector: 'awg-force-graph',
    template: '',
    standalone: false,
})
class ForceGraphStubComponent {
    @Input()
    graphData?: GraphData;
    @Input()
    height = 0;
    @Output()
    clickedNodeRequest: EventEmitter<GraphNode> = new EventEmitter<GraphNode>();
}

@Component({
    selector: 'awg-graph-results-empty',
    template: '',
    standalone: false,
})
class GraphResultsEmptyStubComponent {}

describe('GraphResultsConstructComponent (DONE)', () => {
    let component: GraphResultsConstructComponent;
    let fixture: ComponentFixture<GraphResultsConstructComponent>;
    let compDe: DebugElement;

    let expectedHeight: number;
    let expectedQueryResult: SparqlConstructResult;
    let expectedQueryResult$: Observable<SparqlResult>;
    let expectedGraphData: GraphData;
    let expectedIsFullscreen: boolean;

    let emitClickedNodeRequestSpy: Spy;
    let isAccordionItemDisabledSpy: Spy;
    let isValidGraphDataSpy: Spy;
    let nodeClickSpy: Spy;

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
            imports: [NgbAccordionModule, NgbConfigModule, TwelveToneSpinnerStubComponent],
            declarations: [GraphResultsConstructComponent, ForceGraphStubComponent, GraphResultsEmptyStubComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GraphResultsConstructComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedHeight = 500;
        expectedIsFullscreen = false;
        expectedQueryResult = createConstructResult(['Test']);
        expectedQueryResult$ = observableOf(expectedQueryResult);
        expectedGraphData = GRAPH_DATA_UTILS.toGraphData(expectedQueryResult.quads, expectedQueryResult.prefixes);

        // Spies
        emitClickedNodeRequestSpy = vi.spyOn(component.clickedNodeRequest, 'emit');
        isAccordionItemDisabledSpy = vi.spyOn(component, 'isAccordionItemDisabled');
        isValidGraphDataSpy = vi.spyOn(component, 'isValidGraphData');
        nodeClickSpy = vi.spyOn(component, 'onGraphNodeClick');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have default `queryResult` input', () => {
            expectToEqual(component.queryResult$, EMPTY);
        });

        it('... should have default `graphData$`', () => {
            expectToEqual(component.graphData$, EMPTY);
        });

        it('... should have default `defaultForceGraphHeight` input', () => {
            expectToBe(component.defaultForceGraphHeight, 0);
        });

        it('... should have default `isFullscreenMode` input', () => {
            expectToBe(component.isFullscreenMode, false);
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
            component.queryResult$ = expectedQueryResult$;
            component.defaultForceGraphHeight = expectedHeight;
            component.isFullscreenMode = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `queryResult` input', () => {
            expectToEqual(component.queryResult$, expectedQueryResult$);
        });

        describe('... graphData$', () => {
            it('... should hold the graph data of a construct result', async () => {
                await expect(lastValueFrom(component.graphData$)).resolves.toEqual(expectedGraphData);
            });

            it('... should hold empty graph data for other results', async () => {
                component.queryResult$ = observableOf<SparqlResult>({ kind: 'unsupported', queryType: 'ask' });

                await expect(lastValueFrom(component.graphData$)).resolves.toEqual({
                    nodes: [],
                    edges: [],
                    tripleCount: 0,
                });
            });
        });

        it('... should have `defaultForceGraphHeight` input', () => {
            expectToBe(component.defaultForceGraphHeight, expectedHeight);
        });

        it('... should have `isFullscreenMode` input', () => {
            expectToBe(component.isFullscreenMode, expectedIsFullscreen);
        });

        describe('VIEW', () => {
            describe('not in fullscreen mode', () => {
                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-results-construct.accordion-item',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-results-construct > div.accordion-header',
                        1,
                        1
                    );

                    // Body open (div.accordion-collapse)
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-results-construct-collapse',
                        1,
                        1
                    );
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-construct > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should toggle item body on click', async () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-construct > div.accordion-header',
                        1,
                        1
                    );
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-construct > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item body is collapsed
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-construct > div.accordion-collapse',
                        1,
                        1,
                        'collapsed'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'collapse');

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item body is open again
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-construct > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                describe('... should contain TwelveToneSpinnerComponent (stubbed) in item body while loading if ... ', () => {
                    it('... queryResult$ is EMPTY', async () => {
                        component.queryResult$ = EMPTY;
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-results-construct-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });
                });

                describe('... should contain item body with GraphResultsEmptyStubComponent (stubbed) if ... ', () => {
                    it('... isValidGraphData returns false', async () => {
                        isValidGraphDataSpy.mockReturnValue(false);

                        component.queryResult$ = observableOf(createConstructResult([]));
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-results-construct-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], GraphResultsEmptyStubComponent, 1, 1);
                    });
                });

                it('... should contain item body with ForceGraphComponent (stubbed) if results are available', () => {
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-construct-collapse > div.accordion-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(bodyDes[0], ForceGraphStubComponent, 1, 1);
                });

                it('... should pass down `queryResult` and `defaultForceGraphHeight` to forceGraph component', () => {
                    const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                    const forceGraphCmp = forceGraphDes[0].injector.get(
                        ForceGraphStubComponent
                    ) as ForceGraphStubComponent;

                    expectToEqual(forceGraphCmp.graphData, expectedGraphData);
                    expectToBe(forceGraphCmp.height, expectedHeight);
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(async () => {
                    component.isFullscreenMode = true;
                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-results-construct.accordion-item',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-results-construct > div.accordion-header',
                        1,
                        1
                    );

                    // Body open (div.accordion-collapse)
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-results-construct-collapse',
                        1,
                        1
                    );
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-construct > div.accordion-header',
                        1,
                        1
                    );

                    // Item header button
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should not toggle item body on click', async () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-construct > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expect(btnEl.disabled).toBeTruthy();

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-construct > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item body does not close again
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-construct > div.accordion-collapse',
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
                            'div#awg-graph-results-construct-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });
                });

                describe('... should contain item body with GraphResultsEmptyStubComponent (stubbed) if ... ', () => {
                    it('... isValidGraphData returns false', async () => {
                        isValidGraphDataSpy.mockReturnValue(false);

                        component.queryResult$ = observableOf(createConstructResult([]));
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-results-construct-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], GraphResultsEmptyStubComponent, 1, 1);
                    });
                });

                it('... should contain item body with ForceGraphComponent (stubbed) if results are available', () => {
                    // Item body
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-construct-collapse > div.accordion-body',
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

                    expectToEqual(forceGraphCmp.graphData, expectedGraphData);
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

            it('... should return false if isFullscreenMode is false', () => {
                expectToBe(component.isAccordionItemDisabled(), false);
            });

            it('... should return true if isFullscreenMode is true', () => {
                component.isFullscreenMode = true;

                expectToBe(component.isAccordionItemDisabled(), true);
            });
        });

        describe('#isValidGraphData()', () => {
            it('... should have a method `isValidGraphData`', () => {
                expect(component.isValidGraphData).toBeDefined();
            });

            it('... should be triggered from ngbAccordionBody', () => {
                expectSpyCall(isValidGraphDataSpy, 3, [expectedGraphData]);
            });

            it('... should be triggered by change of queryResult', async () => {
                expectSpyCall(isValidGraphDataSpy, 3, [expectedGraphData]);

                const anotherQueryResult = createConstructResult(['AnotherTest']);
                component.queryResult$ = observableOf(anotherQueryResult);
                await detectChangesOnPush(fixture);

                expectSpyCall(isValidGraphDataSpy, 4, [
                    GRAPH_DATA_UTILS.toGraphData(anotherQueryResult.quads, anotherQueryResult.prefixes),
                ]);
            });

            describe('... should be false if', () => {
                it.each<{ desc: string; graphData: GraphData | null | undefined }>([
                    { desc: 'graphData is undefined', graphData: undefined },
                    { desc: 'graphData is null', graphData: null },
                    { desc: 'graphData has no edges', graphData: { nodes: [], edges: [], tripleCount: 0 } },
                ])('... $desc', ({ graphData }) => {
                    expectToBe(component.isValidGraphData(graphData), false);
                });
            });

            describe('... should be true if', () => {
                it('... graphData has edges', () => {
                    expectToBe(component.isValidGraphData(expectedGraphData), true);
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

                const node: GraphNode = { id: 'Test', shortName: 'awg:Test', label: 'Test', kind: 'resource' };
                forceGraphCmp.clickedNodeRequest.emit(node);

                expectSpyCall(nodeClickSpy, 1, node);
            });

            it('... should not emit anything if no node is provided', () => {
                const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                const forceGraphCmp = forceGraphDes[0].injector.get(ForceGraphStubComponent) as ForceGraphStubComponent;

                // Node is undefined
                forceGraphCmp.clickedNodeRequest.emit(undefined as unknown as GraphNode);

                expectSpyCall(nodeClickSpy, 1, undefined);
                expectSpyCall(emitClickedNodeRequestSpy, 0);
            });

            it('... should emit provided node on click', () => {
                const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                const forceGraphCmp = forceGraphDes[0].injector.get(ForceGraphStubComponent) as ForceGraphStubComponent;

                const node: GraphNode = { id: 'Test', shortName: 'awg:Test', label: 'Test', kind: 'resource' };
                forceGraphCmp.clickedNodeRequest.emit(node);

                expectSpyCall(nodeClickSpy, 1, node);
                expectSpyCall(emitClickedNodeRequestSpy, 1, node);
            });
        });
    });
});
