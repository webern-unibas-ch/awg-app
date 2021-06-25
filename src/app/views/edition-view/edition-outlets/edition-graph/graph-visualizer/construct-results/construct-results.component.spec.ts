import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';

import { EMPTY, Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
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
    let compEl: any;

    let expectedHeight: number;
    let expectedTriples: Triple[];
    let expectedQueryResult$: Observable<Triple[]>;

    let nodeClickSpy: Spy;
    let emitSpy: Spy;

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
                declarations: [
                    ConstructResultsComponent,
                    ForceGraphStubComponent,
                    SparqlNoResultsStubComponent,
                    TwelveToneSpinnerStubComponent,
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ConstructResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedHeight = 500;
        expectedTriples = [
            {
                subject: { nominalValue: 'example:Test' },
                predicate: { nominalValue: 'example:has' },
                object: { nominalValue: 'example:Success' },
            },
        ];
        expectedQueryResult$ = observableOf(expectedTriples);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        nodeClickSpy = spyOn(component, 'onGraphNodeClick').and.callThrough();
        emitSpy = spyOn(component.clickedNodeRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have queryResult', () => {
            expect(component.queryResult$).toBeUndefined('should be undefined');
        });

        it('... should not have defaultForceGraphHeight', () => {
            expect(component.defaultForceGraphHeight).toBeUndefined('should be undefined');
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
            component.queryResult$ = expectedQueryResult$;
            component.defaultForceGraphHeight = expectedHeight;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `queryResult` input', () => {
            expect(component.queryResult$).toBeDefined('should be defined');
            expect(component.queryResult$).toEqual(expectedQueryResult$, `should equal ${expectedQueryResult$}`);
        });

        it('should have `defaultForceGraphHeight` input', () => {
            expect(component.defaultForceGraphHeight).toBeDefined('should be defined');
            expect(component.defaultForceGraphHeight).toBe(expectedHeight, `should be ${expectedHeight}`);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion with panel (div.card) header and body', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel (div.card)
                const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 1, 1); // Panel (div.card)
                // Header
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-graph-visualizer-construct-result-header.card-header',
                    1,
                    1
                ); // Panel (div.card)
                // Body
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-graph-visualizer-construct-result > div.card-body',
                    1,
                    1
                );
            });

            it('... should display panel header button', () => {
                // Panel header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-result-header > button',
                    1,
                    1
                );

                const btnEl = btnDes[0].nativeElement;

                // Check button content
                expect(btnEl.textContent).toBeTruthy();
                expect(btnEl.textContent).toContain('Resultat', 'should be Resultat');
            });

            it('... should contain panel body with TwelveToneSpinnerComponent (stubbed) while loading', () => {
                // Mock empty observable
                component.queryResult$ = EMPTY;
                detectChangesOnPush(fixture);

                // Panel body
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-result > div.card-body',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
            });

            it('... should contain panel body with SparqlNoResultsStubComponent (stubbed) if no results are available', () => {
                // Mock empty response
                component.queryResult$ = observableOf([]);
                detectChangesOnPush(fixture);

                // Panel body
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-result > div.card-body',
                    1,
                    1
                );

                // SparqlNoResultsStubComponent
                getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
            });

            it('... should contain panel body with ForceGraphComponent (stubbed) if results are available', () => {
                // Panel body
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-result > div.card-body',
                    1,
                    1
                );

                // ForceGraph
                getAndExpectDebugElementByDirective(bodyDes[0], ForceGraphStubComponent, 1, 1);
            });

            it('... should pass down `queryResult` and `defaultForceGraphHeight` to forceGraph component', () => {
                const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                const forceGraphCmp = forceGraphDes[0].injector.get(ForceGraphStubComponent) as ForceGraphStubComponent;

                expect(forceGraphCmp.queryResultTriples).toBeDefined();
                expect(forceGraphCmp.queryResultTriples).toEqual(expectedTriples, `should equal ${expectedTriples}`);

                expect(forceGraphCmp.height).toBeDefined();
                expect(forceGraphCmp.height).toEqual(expectedHeight, `should have data: ${expectedHeight}`);
            });
        });

        describe('#onGraphNodeClick', () => {
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
                expectSpyCall(emitSpy, 0);
            });

            it('... should emit provided node on click', () => {
                const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                const forceGraphCmp = forceGraphDes[0].injector.get(ForceGraphStubComponent) as ForceGraphStubComponent;

                const node: D3SimulationNode = new D3SimulationNode('Test', D3SimulationNodeType.node);
                forceGraphCmp.clickedNodeRequest.emit(node);

                expectSpyCall(nodeClickSpy, 1, node);
                expectSpyCall(emitSpy, 1, node);
            });
        });
    });
});
