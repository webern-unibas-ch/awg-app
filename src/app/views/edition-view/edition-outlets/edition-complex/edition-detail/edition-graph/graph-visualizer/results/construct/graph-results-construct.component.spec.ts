import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EMPTY, lastValueFrom, Observable, of as observableOf } from 'rxjs';

import type { Quad } from '@rdfjs/types';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { DataFactory } from 'n3';

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

import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { GraphData, GraphNode } from '../../models/graph-data.model';
import { SparqlConstructResult, SparqlResult } from '../../models/sparql-result.model';
import { GRAPH_DATA_UTILS } from '../../utils/graph-data.utils';
import { DEFAULT_PREFIXES } from '../../utils/prefix.utils';
import { GraphResultsEmptyComponent } from '../empty/graph-results-empty.component';
import { ForceGraphComponent } from './force-graph/force-graph.component';

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

describe('GraphResultsConstructComponent (DONE)', () => {
    let component: GraphResultsConstructComponent;
    let fixture: ComponentFixture<GraphResultsConstructComponent>;
    let compDe: DebugElement;

    let expectedHeight: number;
    let expectedQueryResult: SparqlConstructResult;
    let expectedQueryResult$: Observable<SparqlResult>;
    let expectedGraphData: GraphData;
    let expectedIsFullscreen: boolean;
    let expectedNode: GraphNode;

    let emitClickedNodeRequestSpy: Spy;
    let isValidGraphDataSpy: Spy;
    let nodeClickSpy: Spy;

    const getItemHeaderButtonDe = (): DebugElement =>
        getAndExpectDebugElementByCss(
            compDe,
            'div#awg-graph-results-construct > div.accordion-header > button.accordion-button',
            1,
            1
        )[0];
    const getItemCollapseEl = (status?: string): HTMLDivElement =>
        getAndExpectDebugElementByCss(
            compDe,
            'div#awg-graph-results-construct > div.accordion-collapse',
            1,
            1,
            status
        )[0].nativeElement;
    const getItemBodyDe = (): DebugElement =>
        getAndExpectDebugElementByCss(compDe, 'div#awg-graph-results-construct-collapse > div.accordion-body', 1, 1)[0];
    const getForceGraphCmp = (): ForceGraphComponent =>
        getAndExpectDebugElementByDirective(compDe, ForceGraphComponent, 1, 1)[0].injector.get(ForceGraphComponent);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbAccordionModule, GraphResultsConstructComponent],
        })
            .overrideComponent(ForceGraphComponent, { set: { template: '', imports: [] } })
            .overrideComponent(GraphResultsEmptyComponent, { set: { template: '', imports: [] } })
            .overrideComponent(TwelveToneSpinnerComponent, { set: { template: '', imports: [] } })
            .compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
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
        expectedNode = { id: 'Test', shortName: 'awg:Test', label: 'Test', kind: 'resource' };

        // Spies
        emitClickedNodeRequestSpy = vi.spyOn(component.clickedNodeRequest, 'emit');
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
        it('... should throw due to missing required input signal `queryResult$`', () => {
            expectToBe(isSignal(component.queryResult$), true);

            expect(() => component.queryResult$()).toThrow();
        });

        it('... should have input signal `defaultForceGraphHeight` to hold 0 initially', () => {
            expectToBe(isSignal(component.defaultForceGraphHeight), true);
            expectToBe(component.defaultForceGraphHeight(), 0);
        });

        it('... should have input signal `isFullscreenMode` to hold false initially', () => {
            expectToBe(isSignal(component.isFullscreenMode), true);
            expectToBe(component.isFullscreenMode(), false);
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
            fixture.componentRef.setInput('queryResult$', expectedQueryResult$);
            fixture.componentRef.setInput('defaultForceGraphHeight', expectedHeight);
            fixture.componentRef.setInput('isFullscreenMode', expectedIsFullscreen);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `queryResult$` to hold the provided query result observable', () => {
            expectToBe(component.queryResult$(), expectedQueryResult$);
        });

        it('... should have input signal `defaultForceGraphHeight` to hold the provided height', () => {
            expectToBe(component.defaultForceGraphHeight(), expectedHeight);
        });

        it('... should have input signal `isFullscreenMode` to hold the provided fullscreen flag', () => {
            expectToBe(component.isFullscreenMode(), expectedIsFullscreen);
        });

        describe('... computed signal `graphData$`', () => {
            it('... should hold the graph data of a construct result', async () => {
                await expect(lastValueFrom(component.graphData$())).resolves.toEqual(expectedGraphData);
            });

            it('... should hold empty graph data for other results', async () => {
                fixture.componentRef.setInput(
                    'queryResult$',
                    observableOf<SparqlResult>({ kind: 'unsupported', queryType: 'ask' })
                );

                await expect(lastValueFrom(component.graphData$())).resolves.toEqual({
                    nodes: [],
                    edges: [],
                    tripleCount: 0,
                });
            });

            it('... should hold the same observable for the same query result observable', () => {
                expectToBe(component.graphData$(), component.graphData$());
            });
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

                    expectToContain(getItemCollapseEl().classList, 'show');
                });

                it('... should display an enabled item header button', () => {
                    const btnEl: HTMLButtonElement = getItemHeaderButtonDe().nativeElement;

                    expectToBe(btnEl.disabled, false);
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should toggle item body on click', async () => {
                    expectToContain(getItemCollapseEl('open').classList, 'show');

                    await clickAndAwaitChanges(getItemHeaderButtonDe(), fixture);

                    expectToContain(getItemCollapseEl('collapsed').classList, 'collapse');

                    await clickAndAwaitChanges(getItemHeaderButtonDe(), fixture);

                    expectToContain(getItemCollapseEl('open').classList, 'show');
                });

                it('... should contain TwelveToneSpinnerComponent (hollow) in item body while loading (queryResult$ is EMPTY)', async () => {
                    fixture.componentRef.setInput('queryResult$', EMPTY);
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByDirective(getItemBodyDe(), TwelveToneSpinnerComponent, 1, 1);
                    getAndExpectDebugElementByDirective(getItemBodyDe(), ForceGraphComponent, 0, 0);
                });

                it('... should contain GraphResultsEmptyComponent (hollow) in item body if the graph data is not valid', async () => {
                    fixture.componentRef.setInput('queryResult$', observableOf(createConstructResult([])));
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByDirective(getItemBodyDe(), GraphResultsEmptyComponent, 1, 1);
                    getAndExpectDebugElementByDirective(getItemBodyDe(), ForceGraphComponent, 0, 0);
                });

                it('... should contain ForceGraphComponent (hollow) in item body if results are available', () => {
                    getAndExpectDebugElementByDirective(getItemBodyDe(), ForceGraphComponent, 1, 1);
                    getAndExpectDebugElementByDirective(getItemBodyDe(), GraphResultsEmptyComponent, 0, 0);
                });

                it('... should pass down the graph data and `defaultForceGraphHeight` to ForceGraphComponent (hollow)', () => {
                    const forceGraphCmp = getForceGraphCmp();

                    expectToEqual(forceGraphCmp.graphData(), expectedGraphData);
                    expectToBe(forceGraphCmp.height(), expectedHeight);
                });

                it('... should trigger `onGraphNodeClick` on a clicked node request of ForceGraphComponent (hollow)', () => {
                    getForceGraphCmp().clickedNodeRequest.emit(expectedNode);

                    expectSpyCall(nodeClickSpy, 1, expectedNode);
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(async () => {
                    fixture.componentRef.setInput('isFullscreenMode', true);
                    await detectChangesOnPush(fixture);
                });

                it('... should display a disabled item header button', () => {
                    const btnEl: HTMLButtonElement = getItemHeaderButtonDe().nativeElement;

                    expectToBe(btnEl.disabled, true);
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should not toggle item body on click', async () => {
                    expectToContain(getItemCollapseEl('open').classList, 'show');

                    await clickAndAwaitChanges(getItemHeaderButtonDe(), fixture);

                    expectToContain(getItemCollapseEl('open').classList, 'show');
                });

                it('... should contain ForceGraphComponent (hollow) in item body if results are available', () => {
                    getAndExpectDebugElementByDirective(getItemBodyDe(), ForceGraphComponent, 1, 1);
                });
            });
        });

        describe('METHODS', () => {
            describe('#isValidGraphData()', () => {
                it('... should have a method `isValidGraphData`', () => {
                    expect(component.isValidGraphData).toBeDefined();
                });

                it('... should be triggered with the graph data from the template', () => {
                    expect(isValidGraphDataSpy).toHaveBeenCalledWith(expectedGraphData);
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

                it('... should emit the provided node', () => {
                    component.onGraphNodeClick(expectedNode);

                    expectSpyCall(emitClickedNodeRequestSpy, 1, expectedNode);
                });

                it('... should not emit anything if no node is provided', () => {
                    component.onGraphNodeClick(undefined as unknown as GraphNode);

                    expectSpyCall(emitClickedNodeRequestSpy, 0);
                });
            });
        });
    });
});
