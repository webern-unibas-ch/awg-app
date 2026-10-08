import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { AlertErrorComponent } from '@awg-shared/alert-error/alert-error.component';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
import { Graph, GraphList } from '@awg-views/edition-view/models/graph.model';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionGraphDescriptionComponent } from './edition-graph-description/edition-graph-description.component';
import { EditionGraphDynamicComponent } from './edition-graph-dynamic/edition-graph-dynamic.component';
import { EditionGraphStaticComponent } from './edition-graph-static/edition-graph-static.component';
import { EditionGraphComponent } from './edition-graph.component';

describe('EditionGraphComponent (DONE)', () => {
    let component: EditionGraphComponent;
    let fixture: ComponentFixture<EditionGraphComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let mockViewDataSignal: WritableSignal<EditionViewData<'graph'>>;
    let expectedViewDataContent: EditionViewDataContent<'graph'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'graph'>;
    let expectedGraphDataOp25: GraphList;
    let expectedComplex: EditionComplex;

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewDataContent = { graphData: new GraphList() };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        await TestBed.configureTestingModule({
            imports: [EditionGraphComponent],
            providers: [{ provide: EditionViewService, useValue: { graphViewData: mockViewDataSignal.asReadonly() } }],
        })
            .overrideComponent(AlertErrorComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionGraphDescriptionComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionGraphDynamicComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionGraphStaticComponent, { set: { template: '', imports: [] } })
            .overrideComponent(TwelveToneSpinnerComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedComplex = EditionStateHelper.getComplex('op25');

        expectedGraphDataOp25 = new GraphList();
        expectedGraphDataOp25.graph = [new Graph(), new Graph()];
        expectedGraphDataOp25.graph[0].id = 'test-graph-id-op25-1';
        expectedGraphDataOp25.graph[0].description = ['Description for test-graph-id-op25-1'];
        expectedGraphDataOp25.graph[0].staticImage = 'OP25';
        expectedGraphDataOp25.graph[1].id = 'test-graph-id-op25-2';
        expectedGraphDataOp25.graph[1].rdfData.triples = 'example:test example:has example:Success';
        expectedGraphDataOp25.graph[1].staticImage = 'OP12';

        // Create component fixture
        fixture = TestBed.createComponent(EditionGraphComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `viewData` to hold the default fallback data', () => {
            expectToBe(isSignal(component.viewData), true);

            expectToEqual(component.viewData(), createMockViewData(expectedDefaultViewDataContent));
        });

        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        describe('VIEW', () => {
            it('... should contain one outer `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain no AlertErrorComponent (hollow)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent (hollow)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerComponent, 0, 0);
            });

            it('... should contain no div.awg-edition-graph-view yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-graph-view', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            expectedViewDataContent = { graphData: expectedGraphDataOp25 };
            mockViewDataSignal.set(
                createMockViewData(expectedViewDataContent, {
                    isLoading: false,
                    error: null,
                })
            );
            editionStateService.updateSelectedEditionComplex(expectedComplex);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `viewData` to hold the expected data', () => {
            expectToEqual(component.viewData(), createMockViewData(expectedViewDataContent));
        });

        describe('VIEW', () => {
            it('... should render nothing if viewData is not available', async () => {
                mockViewDataSignal.set(null as any);

                await detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], AlertErrorComponent, 0, 0);
                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerComponent, 0, 0);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-graph-view', 0, 0);
            });

            describe('on error', () => {
                const expectedErrorObject: EditionDataAssetsError = {
                    key: 'graph',
                    error: { status: 404, statusText: 'Data not found' },
                };

                beforeEach(async () => {
                    // Mock error state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: expectedErrorObject,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain graph view or spinner, but one AlertErrorComponent (hollow)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                    getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-graph-view', 0, 0);
                    getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerComponent, 0, 0);

                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(AlertErrorComponent);

                    expectToEqual(alertErrorCmp.errorObject(), expectedErrorObject);
                });
            });

            describe('on loading', () => {
                beforeEach(async () => {
                    // Mock loading state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, { isLoading: true, error: null })
                    );

                    await detectChangesOnPush(fixture);
                });
                it('... should not contain graph view or alert, but one TwelveToneSpinnerComponent (hollow)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-graph-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 1, 1);
                });

                it('... should have default spinnerText on TwelveToneSpinnerComponent', () => {
                    const spinnerDes = getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 1, 1);
                    const spinnerCmp = spinnerDes[0].injector.get(TwelveToneSpinnerComponent);

                    expectToBe(spinnerCmp.spinnerText(), 'loading');
                });
            });

            describe('on view data available', () => {
                beforeEach(async () => {
                    // Mock data state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: null,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.awg-edition-graph-view', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-graph-view', 1, 1);
                });

                it('... should not contain a div in div.awg-edition-graph-view if graph data is not provided', async () => {
                    const noGraphData = new GraphList();
                    noGraphData.graph = [];

                    mockViewDataSignal.set(
                        createMockViewData(
                            { graphData: noGraphData },
                            {
                                isLoading: false,
                                error: null,
                            }
                        )
                    );

                    await detectChangesOnPush(fixture);

                    const viewDivDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-graph-view', 1, 1);
                    getAndExpectDebugElementByCss(viewDivDes[0], 'div', 0, 0);
                });

                it('... should contain the graph intro paragraph exactly once', () => {
                    const pDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-graph-view > p.awg-graph-intro',
                        1,
                        1
                    );
                    const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                    expectToContain(pEl.textContent, 'So weit vorhanden');
                    getAndExpectDebugElementByCss(pDes[0], 'span.text-danger', 1, 1);
                });

                it('... should contain one div per graph in div.awg-edition-graph-view', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-graph-view > div', 2, 2);
                });

                describe('EditionGraphDescriptionComponent (hollow)', () => {
                    it('... should contain one EditionGraphDescriptionComponent per graph', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionGraphDescriptionComponent, 2, 2);
                    });

                    it('... should pass down `graph` and `editionComplex` to each EditionGraphDescriptionComponent', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionGraphDescriptionComponent,
                            2,
                            2
                        );

                        descriptionDes.forEach((de, index) => {
                            const descriptionCmp = de.injector.get(EditionGraphDescriptionComponent);

                            expectToEqual(descriptionCmp.graph(), expectedGraphDataOp25.graph[index]);
                            expectToEqual(descriptionCmp.editionComplex(), expectedComplex);
                        });
                    });
                });

                describe('EditionGraphDynamicComponent (hollow)', () => {
                    it('... should contain one EditionGraphDynamicComponent per graph', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionGraphDynamicComponent, 2, 2);
                    });

                    it('... should pass down `rdfData` to each EditionGraphDynamicComponent', () => {
                        const dynamicDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionGraphDynamicComponent,
                            2,
                            2
                        );

                        dynamicDes.forEach((de, index) => {
                            const dynamicCmp = de.injector.get(EditionGraphDynamicComponent);

                            expectToEqual(dynamicCmp.rdfData(), expectedGraphDataOp25.graph[index].rdfData);
                        });
                    });
                });

                describe('EditionGraphStaticComponent (hollow)', () => {
                    it('... should contain one EditionGraphStaticComponent per graph', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionGraphStaticComponent, 2, 2);
                    });

                    it('... should pass down `imageKey` to each EditionGraphStaticComponent', () => {
                        const staticDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionGraphStaticComponent,
                            2,
                            2
                        );

                        staticDes.forEach((de, index) => {
                            const staticCmp = de.injector.get(EditionGraphStaticComponent);

                            expectToBe(staticCmp.imageKey(), expectedGraphDataOp25.graph[index].staticImage);
                        });
                    });
                });
            });
        });
    });
});
