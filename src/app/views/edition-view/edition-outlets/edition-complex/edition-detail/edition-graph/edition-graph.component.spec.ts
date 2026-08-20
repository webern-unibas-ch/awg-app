import { Component, DebugElement, DOCUMENT, input, Input, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    AlertErrorStubComponent,
    FullscreenToggleStubComponent,
    TwelveToneSpinnerStubComponent,
} from '@testing/component-stubs';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';
import { ModalService } from '@awg-shared/modal/modal.service';

import { EDITION_GRAPH_IMAGES_DATA } from '@awg-views/edition-view/data';
import { EditionComplex, Graph, GraphList, GraphRDFData, GraphSparqlQuery } from '@awg-views/edition-view/models';
import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionGraphComponent } from './edition-graph.component';

// Mock components
@Component({
    selector: 'awg-graph-visualizer',
    template: '',
    standalone: false,
})
class GraphVisualizerStubComponent {
    @Input()
    graphRDFInputData: GraphRDFData = new GraphRDFData();
    readonly isFullscreenMode = input<boolean>(false);
}

describe('EditionGraphComponent (DONE)', () => {
    let component: EditionGraphComponent;
    let fixture: ComponentFixture<EditionGraphComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;
    let mockDocument: Document;
    let mockFullscreenService: Partial<FullscreenService>;
    let mockModalService: Partial<ModalService>;

    let openModalSpy: Spy;
    let serviceOpenModalSpy: Spy;

    let mockViewDataSignal: WritableSignal<EditionViewData<'graph'>>;
    let expectedViewDataContent: EditionViewDataContent<'graph'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'graph'>;
    let expectedGraphEmptyData: GraphList;
    let expectedGraphDataOp25: GraphList;
    let expectedComplex: EditionComplex;

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewDataContent = { graphData: new GraphList() };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        mockFullscreenService = {
            isFullscreen: signal<boolean>(false),
            openFullscreen: (): void => {},
            closeFullscreen: (): void => {},
        };

        mockModalService = {
            openTextModal: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [
                AlertErrorStubComponent,
                CompileHtmlDirective,
                FullscreenToggleStubComponent,
                TwelveToneSpinnerStubComponent,
                FontAwesomeTestingModule,
            ],
            declarations: [EditionGraphComponent, GraphVisualizerStubComponent],
            providers: [
                { provide: EditionViewService, useValue: { graphViewData: mockViewDataSignal.asReadonly() } },
                { provide: FullscreenService, useValue: mockFullscreenService },
                { provide: ModalService, useValue: mockModalService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        serviceOpenModalSpy = vi.spyOn(mockModalService, 'openTextModal');

        // Test data
        expectedComplex = EditionStateHelper.getComplex('op25');

        expectedGraphEmptyData = structuredClone(mockEditionData.mockGraphEmptyData);
        expectedGraphDataOp25 = new GraphList();
        expectedGraphDataOp25.graph = [];
        expectedGraphDataOp25.graph.push(new Graph());
        expectedGraphDataOp25.graph[0].id = 'test-graph-id-op25';
        expectedGraphDataOp25.graph[0].description = ['Description for test-graph-id-op25'];

        // Create component fixture
        fixture = TestBed.createComponent(EditionGraphComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        openModalSpy = vi.spyOn(component, 'openModal');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `isFullscreen` to hold false', () => {
            expectToBe(isSignal(component.isFullscreen), true);

            expectToBe(component.isFullscreen(), false);
        });

        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        it('... should have signal `viewData` to hold the default fallback data', () => {
            expectToBe(isSignal(component.viewData), true);

            expectToEqual(component.viewData(), createMockViewData(expectedDefaultViewDataContent));
        });

        it('... should have static `GRAPH_IMAGES`', () => {
            expect(component.GRAPH_IMAGES).toBeTruthy();

            expectToBe(component.GRAPH_IMAGES.OP12, '');
            expectToBe(component.GRAPH_IMAGES.OP25, EDITION_GRAPH_IMAGES_DATA.GRAPH_IMAGE_OP25.route);
        });

        describe('VIEW', () => {
            it('... should contain one outer `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain no AlertErrorComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
            });

            it('... should contain no div.awg-edition-graph-view yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-graph-view', 0, 0);
            });

            it('... should contain no FullscreenToggleComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], FullscreenToggleStubComponent, 0, 0);
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

                it('... should not contain graph view or spinner, but one AlertErrorComponent (stubbed)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                    getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-graph-view', 0, 0);
                    getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

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
                it('... should not contain graph view or alert, but one TwelveToneSpinnerComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-graph-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                });

                it('... should have default spinnerText on TwelveToneSpinnerComponent', () => {
                    const spinnerDes = getAndExpectDebugElementByDirective(
                        compDe,
                        TwelveToneSpinnerStubComponent,
                        1,
                        1
                    );
                    const spinnerCmp = spinnerDes[0].injector.get(
                        TwelveToneSpinnerStubComponent
                    ) as TwelveToneSpinnerStubComponent;

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

                it('... should contain a div in div.awg-edition-graph-view if graph data is provided', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-graph-view > div', 1, 1);
                });

                describe('graph description', () => {
                    const getDescriptionDes = () =>
                        getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-graph-view > div > div.awg-graph-description',
                            1,
                            1
                        );

                    describe('... if description data and triples are not provided', () => {
                        beforeEach(async () => {
                            mockViewDataSignal.set(
                                createMockViewData(
                                    { graphData: expectedGraphEmptyData },
                                    {
                                        isLoading: false,
                                        error: null,
                                    }
                                )
                            );

                            await detectChangesOnPush(fixture);
                        });

                        it('... should have one div for graph description with two paragraphs', async () => {
                            getAndExpectDebugElementByCss(getDescriptionDes()[0], 'p', 2, 2);
                        });

                        it('... should contain a placeholder paragraph with a muted small element in second paragraph', async () => {
                            const pDes = getAndExpectDebugElementByCss(getDescriptionDes()[0], 'p', 2, 2);
                            const pEl: HTMLParagraphElement = pDes[1].nativeElement;

                            expectToContain(pEl.className, 'awg-graph-description-placeholder');
                            getAndExpectDebugElementByCss(pDes[1], 'small.text-muted', 1, 1);
                        });

                        it('... should display placeholder text in small element', async () => {
                            const pDes = getAndExpectDebugElementByCss(
                                getDescriptionDes()[0],
                                'p.awg-graph-description-placeholder',
                                1,
                                1
                            );
                            const smallDes = getAndExpectDebugElementByCss(pDes[0], 'small.text-muted', 1, 1);
                            const smallEl: HTMLElement = smallDes[0].nativeElement;

                            // Create graph placeholder
                            const complex = expectedComplex;
                            const fullComplexSpan = mockDocument.createElement('span');
                            fullComplexSpan.innerHTML = complex.complexId.full;

                            const shortComplexSpan = mockDocument.createElement('span');
                            shortComplexSpan.innerHTML = complex.complexId.short;

                            const sectionLabel = complex.pubStatement.labeledSectionRoute.label;

                            const graphPlaceholder = `[Die Graph-Visualisierungen zum Editionskomplex ${fullComplexSpan.textContent} erscheinen im Zusammenhang der vollständigen Edition von ${shortComplexSpan.textContent} in ${sectionLabel}.]`;

                            expectToBe(smallEl.textContent.trim(), graphPlaceholder);
                        });
                    });

                    describe('... if description data is provided', () => {
                        const descriptionData = new GraphList();
                        let descriptions: string[];
                        let expectedLength: number;
                        let paragraphDes: DebugElement[];

                        beforeEach(async () => {
                            descriptions = ['Description 1', 'Description 2', 'Description 3'];
                            expectedLength = 1 + descriptions.length;

                            descriptionData.graph = [];
                            descriptionData.graph.push(new Graph());
                            descriptionData.graph[0].id = 'test-graph-id-description';
                            descriptionData.graph[0].description = descriptions;

                            mockViewDataSignal.set(
                                createMockViewData(
                                    { graphData: descriptionData },
                                    {
                                        isLoading: false,
                                        error: null,
                                    }
                                )
                            );

                            await detectChangesOnPush(fixture);

                            paragraphDes = getAndExpectDebugElementByCss(
                                getDescriptionDes()[0],
                                'p',
                                expectedLength,
                                expectedLength
                            );
                        });

                        it('... should have one + x paragraphs for graph descriptions', async () => {
                            expectToBe(paragraphDes.length, expectedLength);
                        });

                        it('... should have one CompileHtmlDirective in each paragraph', async () => {
                            paragraphDes.slice(1).forEach(pDe => {
                                const directiveIns = pDe.injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                                expect(directiveIns).toBeTruthy();
                            });
                        });

                        it('... should pass down descriptions to CompileHtmlDirective in each paragraph', async () => {
                            paragraphDes.slice(1).forEach((pDe, index) => {
                                const directiveIns = pDe.injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                                expectToBe(directiveIns.htmlContent(), descriptions[index]);
                            });
                        });

                        it('... should display descriptions in paragraphs', async () => {
                            paragraphDes.slice(1).forEach((pDe, index) => {
                                const pEl: HTMLParagraphElement = pDe.nativeElement;
                                expectToBe(pEl.textContent, descriptions[index]);
                            });
                        });
                    });
                });

                describe('dynamic graph', () => {
                    it('... should not contain a dynamic graph if rdf data is not provided', async () => {
                        const graphWithoutRdfData = expectedGraphEmptyData;

                        mockViewDataSignal.set(
                            createMockViewData(
                                { graphData: graphWithoutRdfData },
                                {
                                    isLoading: false,
                                    error: null,
                                }
                            )
                        );

                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-graph-view > div > awg-graph-dynamic',
                            0,
                            0
                        );

                        // No queryList
                        graphWithoutRdfData.graph[0].rdfData = new GraphRDFData();
                        graphWithoutRdfData.graph[0].rdfData.triples = 'example:test example:has example:Success';
                        graphWithoutRdfData.graph[0].rdfData.queryList = [];

                        mockViewDataSignal.set(
                            createMockViewData(
                                { graphData: graphWithoutRdfData },
                                {
                                    isLoading: false,
                                    error: null,
                                }
                            )
                        );

                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-graph-view > div > awg-graph-dynamic',
                            0,
                            0
                        );

                        // No triples
                        graphWithoutRdfData.graph[0].rdfData = new GraphRDFData();
                        graphWithoutRdfData.graph[0].rdfData.triples = '';
                        graphWithoutRdfData.graph[0].rdfData.queryList = [new GraphSparqlQuery()];

                        mockViewDataSignal.set(
                            createMockViewData(
                                { graphData: graphWithoutRdfData },
                                {
                                    isLoading: false,
                                    error: null,
                                }
                            )
                        );

                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-graph-view > div > awg-graph-dynamic',
                            0,
                            0
                        );
                    });

                    describe('with rdf data', () => {
                        let graphWithRdfData: GraphList;

                        beforeEach(async () => {
                            graphWithRdfData = expectedGraphEmptyData;
                            graphWithRdfData.graph[0].rdfData = new GraphRDFData();
                            graphWithRdfData.graph[0].rdfData.triples = 'example:test example:has example:Success';
                            graphWithRdfData.graph[0].rdfData.queryList = [new GraphSparqlQuery()];

                            mockViewDataSignal.set(
                                createMockViewData(
                                    { graphData: graphWithRdfData },
                                    {
                                        isLoading: false,
                                        error: null,
                                    }
                                )
                            );

                            await detectChangesOnPush(fixture);
                        });

                        it('... should contain a div.awg-dynamic-graph', () => {
                            getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-graph-view > div > div.awg-graph-dynamic',
                                1,
                                1
                            );
                        });

                        it('... should contain a header with help button and FullscreenToggleComponent (stubbed)', () => {
                            const hDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-dynamic > h4', 1, 1);
                            const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                            expectToContain(hEl.textContent, 'Dynamischer Graph');

                            // Help button
                            const btnDes = getAndExpectDebugElementByCss(hDes[0], 'button.btn', 1, 1);
                            const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                            expectToContain(btnEl.textContent, 'Hinweise zur Nutzung');

                            // FullscreenToggle
                            getAndExpectDebugElementByDirective(hDes[0], FullscreenToggleStubComponent, 1, 1);
                        });

                        it('... should trigger `#openModal()` from click on help button', async () => {
                            const btnDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-graph-dynamic > h4 button.btn',
                                1,
                                1
                            );

                            await clickAndAwaitChanges(btnDes[0], fixture);

                            expectSpyCall(openModalSpy, 1, 'HINT_EDITION_GRAPH');
                        });

                        it('... should contain a paragraph', () => {
                            const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-dynamic > p', 1, 1);
                            const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                            expect(pEl.textContent).toBeTruthy();
                        });

                        it('... should contain one graph visualizer component (stubbed) in a fullscreen wrapper', () => {
                            const wrapperDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-fullscreen-wrapper',
                                1,
                                1
                            );
                            getAndExpectDebugElementByDirective(wrapperDes[0], GraphVisualizerStubComponent, 1, 1);
                        });

                        it('... should pass down `graph.RDFData` to graph visualizer component', () => {
                            const graphVisDes = getAndExpectDebugElementByDirective(
                                compDe,
                                GraphVisualizerStubComponent,
                                1,
                                1
                            );
                            const graphVisCmp = graphVisDes[0].injector.get(
                                GraphVisualizerStubComponent
                            ) as GraphVisualizerStubComponent;

                            const expectedData = graphWithRdfData.graph[0].rdfData;

                            expectToEqual(graphVisCmp.graphRDFInputData, expectedData);
                        });

                        it('... should pass down graphvisualizer reference to the FullscreenToggleComponent', () => {
                            // Get FullscreenToggleComponent
                            const fsToggleDes = getAndExpectDebugElementByDirective(
                                compDe,
                                FullscreenToggleStubComponent,
                                1,
                                1
                            );
                            const fsToggleCmp = fsToggleDes[0].injector.get(
                                FullscreenToggleStubComponent
                            ) as FullscreenToggleStubComponent;

                            // Get GraphVisualizerComponent wrapper
                            const wrapperDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-fullscreen-wrapper',
                                1,
                                1
                            );
                            const wrapperEl = wrapperDes[0].nativeElement;

                            expect(wrapperEl).toBeTruthy();
                            expectToEqual(fsToggleCmp.fsElement(), wrapperEl);
                        });
                    });
                });

                describe('static graph', () => {
                    it('... should not contain a static graph if staticImage data is not provided', async () => {
                        const noStaticImageData = new GraphList();
                        noStaticImageData.graph = [];
                        noStaticImageData.graph.push(new Graph());
                        noStaticImageData.graph[0].id = 'test-graph-id-no-static-image';
                        noStaticImageData.graph[0].staticImage = undefined;

                        mockViewDataSignal.set(
                            createMockViewData(
                                { graphData: noStaticImageData },
                                {
                                    isLoading: false,
                                    error: null,
                                }
                            )
                        );

                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-graph-view > div > awg-graph-static',
                            0,
                            0
                        );

                        // With empty string
                        noStaticImageData.graph[0].staticImage = '';

                        mockViewDataSignal.set(
                            createMockViewData(
                                { graphData: noStaticImageData },
                                {
                                    isLoading: false,
                                    error: null,
                                }
                            )
                        );

                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-graph-view > div > awg-graph-static',
                            0,
                            0
                        );
                    });

                    describe('... if staticImage data is provided', () => {
                        const staticImageData = new GraphList();

                        beforeEach(async () => {
                            staticImageData.graph = [];
                            staticImageData.graph.push(new Graph());
                            staticImageData.graph[0].id = 'test-graph-id-static-image';
                            staticImageData.graph[0].staticImage = 'OP25';

                            mockViewDataSignal.set(
                                createMockViewData(
                                    { graphData: staticImageData },
                                    {
                                        isLoading: false,
                                        error: null,
                                    }
                                )
                            );

                            await detectChangesOnPush(fixture);
                        });

                        it('... should contain a static graph', () => {
                            getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-graph-view > div > div.awg-graph-static',
                                1,
                                1
                            );
                        });

                        it('... should display header and image of static graph', () => {
                            const imageKey = staticImageData.graph[0].staticImage;

                            const divDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-graph-view > div > div.awg-graph-static',
                                1,
                                1
                            );
                            const hDes = getAndExpectDebugElementByCss(divDes[0], 'h4', 1, 1);
                            const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                            const imgDes = getAndExpectDebugElementByCss(divDes[0], 'img', 1, 1);
                            const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                            expectToContain(hEl.textContent, 'Statischer Graph');

                            expectToContain(
                                imgEl.src,
                                component.GRAPH_IMAGES[imageKey as keyof typeof component.GRAPH_IMAGES]
                            );
                            expectToContain(imgEl.alt, 'Static network representation of data for ' + imageKey);
                        });
                    });
                });
            });
        });

        describe('METHODS', () => {
            describe('#getStaticImage()', () => {
                it('... should have a method `getStaticImage()`', () => {
                    expect(component.getStaticImage).toBeDefined();
                });

                describe('... should return null if', () => {
                    it.each([
                        { desc: 'no imageKey is provided', imageKey: undefined },
                        { desc: 'an empty imageKey is provided', imageKey: '' },
                        { desc: 'the imageKey does not exist in data', imageKey: 'NON_EXISTENT_KEY' },
                        { desc: 'the imageKey exists but the mapped value is an empty string', imageKey: 'OP12' },
                        { desc: 'the imageKey includes prototype properties like `toString`', imageKey: 'toString' },
                    ])('... should return null if $desc', ({ imageKey }) => {
                        const result = component.getStaticImage(imageKey);

                        expectToBe(result, null);
                    });
                });

                it('... should return the static image path for a given imageKey with non-empty mapped value', () => {
                    const imageKey = 'OP25';
                    const expectedImagePath = component.GRAPH_IMAGES[imageKey as keyof typeof component.GRAPH_IMAGES];

                    const result = component.getStaticImage(imageKey);

                    expectToBe(result, expectedImagePath);
                });
            });

            describe('#openModal()', () => {
                it('... should have a method `openModal()`', () => {
                    expect(component.openModal).toBeDefined();
                });

                it('... should trigger from click on help button', async () => {
                    const graphWithRdfData = expectedGraphEmptyData;
                    graphWithRdfData.graph[0].rdfData = new GraphRDFData();
                    graphWithRdfData.graph[0].rdfData.triples = 'example:test example:has example:Success';
                    graphWithRdfData.graph[0].rdfData.queryList = [new GraphSparqlQuery()];

                    mockViewDataSignal.set(
                        createMockViewData(
                            { graphData: graphWithRdfData },
                            {
                                isLoading: false,
                                error: null,
                            }
                        )
                    );

                    await detectChangesOnPush(fixture);

                    const btnDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-dynamic > h4 button.btn', 1, 1);

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(openModalSpy, 1, 'HINT_EDITION_GRAPH');
                });

                describe('... should do nothing if ', () => {
                    it('... id is empty string', () => {
                        component.openModal('');

                        expectSpyCall(serviceOpenModalSpy, 0);
                    });
                });

                it('... should trigger ModalService with id of given modal snippet', () => {
                    const expectedModalId = 'HINT_EDITION_GRAPH';

                    component.openModal(expectedModalId);

                    expectSpyCall(serviceOpenModalSpy, 1, expectedModalId);
                });
            });
        });
    });
});
