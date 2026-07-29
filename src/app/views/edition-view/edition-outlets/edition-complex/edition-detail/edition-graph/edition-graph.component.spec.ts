import {
    Component,
    DebugElement,
    DOCUMENT,
    input,
    Input,
    isSignal,
    output,
    signal,
    WritableSignal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';
import { EDITION_GRAPH_IMAGES_DATA } from '@awg-views/edition-view/data';
import { EditionComplex, Graph, GraphList, GraphRDFData, GraphSparqlQuery } from '@awg-views/edition-view/models';
import { EditionViewData, EditionViewDataContent } from '@awg-views/edition-view/models/edition-data.model';
import { EditionComplexesService, EditionStateService } from '@awg-views/edition-view/services';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { mockEditionData } from '@testing/mock-data';
import { EditionGraphComponent } from './edition-graph.component';

// Mock components
@Component({
    selector: 'awg-modal',
    template: '',
    standalone: false,
})
class ModalStubComponent {
    modalContent: string;
    open(modalContentSnippetKey: string): void {
        this.modalContent = modalContentSnippetKey;
    }
}

@Component({
    selector: 'awg-alert-error',
    template: '',
    standalone: false,
})
class AlertErrorStubComponent {
    @Input()
    errorObject: any;
}

@Component({
    selector: 'awg-twelve-tone-spinner',
    template: '',
    standalone: false,
})
class TwelveToneSpinnerStubComponent {}

@Component({
    selector: 'awg-fullscreen-toggle',
    template: '',
    standalone: false,
})
class FullscreenToggleStubComponent {
    readonly fsElement = input.required<HTMLElement>();
    readonly toggleFullscreenRequest = output<boolean>();
}

@Component({
    selector: 'awg-graph-visualizer',
    template: '',
    standalone: false,
})
class GraphVisualizerStubComponent {
    @Input()
    graphRDFInputData: GraphRDFData;
    readonly isFullscreenMode = input<boolean>(false);
}

describe('EditionGraphComponent (DONE)', () => {
    let component: EditionGraphComponent;
    let fixture: ComponentFixture<EditionGraphComponent>;
    let compDe: DebugElement;

    let editionComplexesService: EditionComplexesService;
    let editionStateService: EditionStateService;
    let mockDocument: Document;
    let mockFullscreenService: Partial<FullscreenService>;

    let modalOpenSpy: Spy;

    let mockViewDataSignal: WritableSignal<EditionViewData<'graph'>>;
    let expectedViewDataContent: EditionViewDataContent<'graph'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'graph'>;
    let expectedEditionGraphEmptyData: GraphList;
    let expectedEditionGraphDataOp25: GraphList;
    let expectedEditionComplex: EditionComplex;

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewDataContent = { graphData: new GraphList() };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        mockFullscreenService = {
            isFullscreen: signal<boolean>(false),
            openFullscreen: (): void => {},
            closeFullscreen: (): void => {},
        };

        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [
                EditionGraphComponent,
                AlertErrorStubComponent,
                CompileHtmlComponent,
                FullscreenToggleStubComponent,
                GraphVisualizerStubComponent,
                ModalStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
            providers: [
                { provide: EditionViewService, useValue: { graphViewData: mockViewDataSignal.asReadonly() } },
                { provide: FullscreenService, useValue: mockFullscreenService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);
        editionComplexesService = TestBed.inject(EditionComplexesService);
        editionStateService = TestBed.inject(EditionStateService);

        // Init edition data
        editionComplexesService.initializeEditionComplexesList();

        // Test data
        expectedEditionComplex = editionComplexesService.getEditionComplexById('op25');

        expectedEditionGraphEmptyData = structuredClone(mockEditionData.mockGraphEmptyData);
        expectedEditionGraphDataOp25 = new GraphList();
        expectedEditionGraphDataOp25.graph = [];
        expectedEditionGraphDataOp25.graph.push(new Graph());
        expectedEditionGraphDataOp25.graph[0].id = 'test-graph-id-op25';
        expectedEditionGraphDataOp25.graph[0].description = ['Description for test-graph-id-op25'];

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

            it('... should contain one modal component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], ModalStubComponent, 1, 1);
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
            expectedViewDataContent = { graphData: expectedEditionGraphDataOp25 };
            mockViewDataSignal.set(
                createMockViewData(expectedViewDataContent, {
                    isLoading: false,
                    error: null,
                })
            );
            editionStateService.updateSelectedEditionComplex(expectedEditionComplex);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `viewData` to hold the expected data', () => {
            expectToEqual(component.viewData(), createMockViewData(expectedViewDataContent));
        });

        describe('VIEW', () => {
            describe('on error', () => {
                const expectedErrorObject = { status: 404, statusText: 'error' };

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

                    expectToEqual(alertErrorCmp.errorObject, expectedErrorObject);
                });
            });

            describe('on loading', () => {
                it('... should not contain graph view or alert, but one TwelveToneSpinnerComponent (stubbed)', async () => {
                    // Mock loading state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, { isLoading: true, error: null })
                    );

                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-graph-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
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
                    noGraphData.graph = undefined;

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
                                    { graphData: expectedEditionGraphEmptyData },
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
                            const complex = expectedEditionComplex;
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

                        beforeEach(async () => {
                            descriptionData.graph = [];
                            descriptionData.graph.push(new Graph());
                            descriptionData.graph[0].id = 'test-graph-id-description';
                            descriptionData.graph[0].description = ['Description 1', 'Description 2', 'Description 3'];

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
                        });

                        it('... should have one + x paragraphs for graph description if description data is provided', async () => {
                            const pDes = getAndExpectDebugElementByCss(
                                getDescriptionDes()[0],
                                'p',
                                1 + descriptionData.graph[0].description.length,
                                1 + descriptionData.graph[0].description.length
                            );

                            pDes.forEach((pDe, index) => {
                                if (index === 0) {
                                    return;
                                }
                                const pEl: HTMLParagraphElement = pDe.nativeElement;
                                expectToBe(pEl.textContent, `Description ${index}`);
                            });
                        });
                    });
                });

                describe('dynamic graph', () => {
                    it('... should not contain a dynamic graph if rdf data is not provided', async () => {
                        const graphWithoutRdfData = expectedEditionGraphEmptyData;

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
                        graphWithoutRdfData.graph[0].rdfData.queryList = undefined;

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
                        graphWithoutRdfData.graph[0].rdfData.triples = undefined;
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
                            graphWithRdfData = expectedEditionGraphEmptyData;
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

                        it('... should trigger modal from click on help button', async () => {
                            const modalDes = getAndExpectDebugElementByDirective(compDe, ModalStubComponent, 1, 1);
                            const modalCmp = modalDes[0].injector.get(ModalStubComponent) as ModalStubComponent;
                            // Spy on modal
                            modalOpenSpy = vi.spyOn(modalCmp, 'open');

                            // Get button
                            const btnDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-graph-dynamic > h4 button.btn',
                                1,
                                1
                            );

                            // Click button
                            await clickAndAwaitChanges(btnDes[0], fixture);

                            expectSpyCall(modalOpenSpy, 1, 'HINT_EDITION_GRAPH');
                            expectToBe(modalCmp.modalContent, 'HINT_EDITION_GRAPH');
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
                        beforeEach(async () => {
                            const staticImageData = new GraphList();
                            staticImageData.graph = [];
                            staticImageData.graph.push(new Graph());
                            staticImageData.graph[0].id = 'test-graph-id-static-image';
                            staticImageData.graph[0].staticImage = component.GRAPH_IMAGES.OP25;

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
                            const imgDes = getAndExpectDebugElementByCss(
                                compDe,
                                'div.awg-edition-graph-view > div > div.awg-graph-static',
                                1,
                                1
                            );
                            const hDes = getAndExpectDebugElementByCss(imgDes[0], 'h4', 1, 1);
                            const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                            const divDes = getAndExpectDebugElementByCss(imgDes[0], 'div', 1, 1);
                            const divEl: HTMLDivElement = divDes[0].nativeElement;

                            expectToContain(hEl.textContent, 'Statischer Graph');

                            expectToContain(divEl.textContent, component.GRAPH_IMAGES.OP25);
                        });
                    });
                });
            });
        });
    });
});
