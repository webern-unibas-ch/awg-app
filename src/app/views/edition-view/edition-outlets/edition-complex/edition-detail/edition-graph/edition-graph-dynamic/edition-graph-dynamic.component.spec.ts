import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { FullscreenToggleComponent } from '@awg-shared/fullscreen/fullscreen-toggle.component';
import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';

import { GraphQuery, GraphRdfData } from '@awg-views/edition-view/models/graph.model';
import { UsageHintsComponent } from '@awg-views/edition-view/shared/usage-hints/usage-hints.component';

import { GraphVisualizerComponent } from '../graph-visualizer/graph-visualizer.component';
import { EditionGraphDynamicComponent } from './edition-graph-dynamic.component';

describe('EditionGraphDynamicComponent (DONE)', () => {
    let component: EditionGraphDynamicComponent;
    let fixture: ComponentFixture<EditionGraphDynamicComponent>;
    let compDe: DebugElement;

    let mockIsFullscreen: WritableSignal<boolean>;

    let expectedRdfData: GraphRdfData;

    beforeEach(async () => {
        mockIsFullscreen = signal(false);

        await TestBed.configureTestingModule({
            imports: [EditionGraphDynamicComponent],
            providers: [{ provide: FullscreenService, useValue: { isFullscreen: mockIsFullscreen.asReadonly() } }],
        })
            .overrideComponent(UsageHintsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(FullscreenToggleComponent, { set: { template: '', imports: [] } })
            .overrideComponent(GraphVisualizerComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedRdfData = new GraphRdfData();
        expectedRdfData.triples = 'example:test example:has example:Success';
        expectedRdfData.queryList = [new GraphQuery()];

        // Create component fixture
        fixture = TestBed.createComponent(EditionGraphDynamicComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `isFullscreen` to hold false', () => {
            expectToBe(isSignal(component.isFullscreen), true);

            expectToBe(component.isFullscreen(), false);
        });

        it('... should throw due to missing required input signal `rdfData`', () => {
            expectToBe(isSignal(component.rdfData), true);

            expect(() => component.rdfData()).toThrow();
        });

        it('... should throw when accessing computed signal `hasRdfData` due to missing input', () => {
            expectToBe(isSignal(component.hasRdfData), true);

            expect(() => component.hasRdfData()).toThrow();
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('rdfData', expectedRdfData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `rdfData` to hold the provided rdf data', () => {
            expectToEqual(component.rdfData(), expectedRdfData);
        });

        describe('... computed signal `hasRdfData`', () => {
            it('... should hold true if triples and a query list are given', () => {
                expectToBe(component.hasRdfData(), true);
            });

            it.each([
                { desc: 'no triples are given', triples: '', queryList: [new GraphQuery()] },
                {
                    desc: 'no query list is given',
                    triples: 'example:test example:has example:Success',
                    queryList: null,
                },
            ])('... should hold false if $desc', async ({ triples, queryList }) => {
                fixture.componentRef.setInput('rdfData', { triples, queryList } as GraphRdfData);
                await detectChangesOnPush(fixture);

                expectToBe(component.hasRdfData(), false);
            });
        });

        describe('VIEW', () => {
            it('... should contain no div.awg-graph-dynamic if no rdf data is given', async () => {
                fixture.componentRef.setInput('rdfData', new GraphRdfData());
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-dynamic', 0, 0);
            });

            it('... should contain one div.awg-graph-dynamic', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-dynamic', 1, 1);
            });

            it('... should contain a header with UsageHintsComponent (hollow) and FullscreenToggleComponent (hollow)', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-dynamic > h4', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToContain(hEl.textContent, 'Dynamischer Graph');

                const buttonDes = getAndExpectDebugElementByDirective(hDes[0], UsageHintsComponent, 1, 1);
                const buttonEl: HTMLElement = buttonDes[0].nativeElement;

                expectToContain(buttonEl.classList, 'ms-2');

                getAndExpectDebugElementByDirective(hDes[0], FullscreenToggleComponent, 1, 1);
            });

            it('... should pass down `snippetKey` to the UsageHintsComponent', () => {
                const buttonDes = getAndExpectDebugElementByDirective(compDe, UsageHintsComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(UsageHintsComponent);

                expectToBe(buttonCmp.snippetKey(), 'HINT_EDITION_GRAPH');
            });

            it('... should contain a paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-dynamic > p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expect(pEl.textContent).toBeTruthy();
            });

            it('... should contain one GraphVisualizerComponent (hollow) in a fullscreen wrapper', () => {
                const wrapperDes = getAndExpectDebugElementByCss(compDe, 'div.awg-fullscreen-wrapper', 1, 1);

                getAndExpectDebugElementByDirective(wrapperDes[0], GraphVisualizerComponent, 1, 1);
            });

            it('... should pass down `rdfData` and `isFullscreen` to the GraphVisualizerComponent', async () => {
                const graphVisDes = getAndExpectDebugElementByDirective(compDe, GraphVisualizerComponent, 1, 1);
                const graphVisCmp = graphVisDes[0].injector.get(GraphVisualizerComponent);

                expectToEqual(graphVisCmp.rdfData(), expectedRdfData);
                expectToBe(graphVisCmp.isFullscreenMode(), false);

                mockIsFullscreen.set(true);
                await detectChangesOnPush(fixture);

                expectToBe(graphVisCmp.isFullscreenMode(), true);
            });

            it('... should pass down the fullscreen wrapper to the FullscreenToggleComponent', () => {
                const fsToggleDes = getAndExpectDebugElementByDirective(compDe, FullscreenToggleComponent, 1, 1);
                const fsToggleCmp = fsToggleDes[0].injector.get(FullscreenToggleComponent);

                const wrapperDes = getAndExpectDebugElementByCss(compDe, 'div.awg-fullscreen-wrapper', 1, 1);

                expectToBe(fsToggleCmp.fsElement(), wrapperDes[0].nativeElement);
            });
        });
    });
});
