import { Component, DebugElement, DOCUMENT, input, Input, output, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import {
    EMPTY,
    EmptyError,
    lastValueFrom,
    Observable,
    of as observableOf,
    throwError as observableThrowError,
} from 'rxjs';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

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
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';
import { EDITION_GRAPH_IMAGES_DATA } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, Graph, GraphList, GraphRDFData, GraphSparqlQuery } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionGraphComponent } from './edition-graph.component';

// Mock components
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
    selector: 'awg-twelve-tone-spinner',
    template: '',
    standalone: false,
})
class TwelveToneSpinnerStubComponent {}

describe('EditionGraphComponent (DONE)', () => {
    let component: EditionGraphComponent;
    let fixture: ComponentFixture<EditionGraphComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockEditionStateService: Partial<EditionStateService>;
    let mockEditionDataService: Partial<EditionDataService>;
    let mockFullscreenService: Partial<FullscreenService>;

    let modalOpenSpy: Spy;
    let getEditonGraphDataSpy: Spy;
    let editionDataServiceGetEditionGraphDataSpy: Spy;
    let editionStateServiceGetSelectedEditionComplexSpy: Spy;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionGraphDataEmpty: GraphList;
    let expectedEditionGraphDataOp25: GraphList;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
    });

    beforeEach(async () => {
        // Mocked editionDataService
        mockEditionDataService = {
            getEditionGraphData: (): Observable<GraphList> => observableOf(new GraphList()),
        };
        // Mocked editionStateService
        mockEditionStateService = {
            getSelectedEditionComplex: (): Observable<EditionComplex> => observableOf(expectedEditionComplex),
        };
        // Mocked fullscreenService
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
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionStateService, useValue: mockEditionStateService },
                { provide: FullscreenService, useValue: mockFullscreenService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionGraphComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data (default)
        expectedEditionComplex = EditionComplexesService.getEditionComplexById('op12');

        expectedEditionGraphDataEmpty = structuredClone(mockEditionData.mockGraphEmptyData);

        expectedEditionGraphDataOp25 = new GraphList();
        expectedEditionGraphDataOp25.graph = [];
        expectedEditionGraphDataOp25.graph.push(new Graph());
        expectedEditionGraphDataOp25.graph[0].id = 'test-graph-id-op25';
        expectedEditionGraphDataOp25.graph[0].description = ['Description for test-graph-id-op25'];

        // Spies
        getEditonGraphDataSpy = vi.spyOn(component, 'getEditionGraphData');

        editionStateServiceGetSelectedEditionComplexSpy = vi.spyOn(
            mockEditionStateService,
            'getSelectedEditionComplex'
        );
        editionDataServiceGetEditionGraphDataSpy = vi
            .spyOn(mockEditionDataService, 'getEditionGraphData')
            .mockImplementation((editionComplex: EditionComplex) => {
                switch (editionComplex) {
                    case EditionComplexesService.getEditionComplexById('op12'): {
                        return observableOf(expectedEditionGraphDataEmpty);
                    }
                    case EditionComplexesService.getEditionComplexById('op25'): {
                        return observableOf(expectedEditionGraphDataOp25);
                    }
                    default: {
                        return observableOf(new GraphList());
                    }
                }
            });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have correct static `GRAPH_IMAGES`', () => {
            expect(component.GRAPH_IMAGES).toBeTruthy();

            expectToBe(component.GRAPH_IMAGES.OP12, '');
            expectToBe(component.GRAPH_IMAGES.OP25, EDITION_GRAPH_IMAGES_DATA.GRAPH_IMAGE_OP25.route);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToBe(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        it('... should have `errorObject` = null', () => {
            expectToBe(component.errorObject, null);
        });

        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        it('... should not have `editionGraphData$`', () => {
            expect(component.editionGraphData$).toBeUndefined();
        });

        it('... should not have called `getEditionGraphData()`', () => {
            expectSpyCall(getEditonGraphDataSpy, 0);
        });

        describe('VIEW', () => {
            it('... should contain a `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain one modal component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], ModalStubComponent, 1, 1);
            });

            it('... should contain no div.awg-graph-view yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);
            });

            it('... should not contain an AlertErrorComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 0, 0);
            });

            it('... should not contain an FullscreenToggleComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], FullscreenToggleStubComponent, 0, 0);
            });

            it('... should not contain a loading spinner component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            editionStateServiceGetSelectedEditionComplexSpy.mockReturnValue(
                observableOf(EditionComplexesService.getEditionComplexById('op12'))
            );

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `getEditionGraphData()`', () => {
            expectSpyCall(getEditonGraphDataSpy, 1);
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-graph-view', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 1, 1);
            });

            it('... should not contain a div in div.awg-graph-view if graph data is not provided', async () => {
                const noGraphData = new GraphList();
                noGraphData.graph = undefined;

                editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableOf(noGraphData));

                component.getEditionGraphData();
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div', 0, 0);
            });

            it('... should contain a div in div.awg-graph-view if graph data is provided', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div', 1, 1);
            });

            describe('graph description', () => {
                it('... should have one div for graph description with two default paragraphs if description data and triples are not provided', async () => {
                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(
                        observableOf(expectedEditionGraphDataEmpty)
                    );

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-view > div > div.awg-graph-description',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(divDes[0], 'p', 2, 2);
                });

                it('... should contain a placeholder if content of graph data and triples are empty', () => {
                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(
                        observableOf(expectedEditionGraphDataEmpty)
                    );

                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-view > div > div.awg-graph-description',
                        1,
                        1
                    );
                    const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-graph-description-empty', 1, 1);

                    getAndExpectDebugElementByCss(pDes[0], 'small.text-muted', 1, 1);
                });

                it('... should display placeholder in paragraph', () => {
                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(
                        observableOf(expectedEditionGraphDataEmpty)
                    );

                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-view > div > div.awg-graph-description',
                        1,
                        1
                    );
                    const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-graph-description-empty', 1, 1);
                    const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                    // Create graph placeholder
                    const fullComplexSpan = mockDocument.createElement('span');
                    fullComplexSpan.innerHTML = expectedEditionComplex.complexId.full;

                    const shortComplexSpan = mockDocument.createElement('span');
                    shortComplexSpan.innerHTML = expectedEditionComplex.complexId.short;

                    const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                    const series = expectedEditionComplex.pubStatement.series.short;
                    const section = expectedEditionComplex.pubStatement.section.short;

                    const graphPlaceholder = `[Die Graph-Visualisierungen zum Editionskomplex ${fullComplexSpan.textContent} erscheinen im Zusammenhang der vollständigen Edition von ${shortComplexSpan.textContent} in ${awg} ${series}/${section}.]`;

                    expectToBe(pEl.textContent.trim(), graphPlaceholder);
                });

                it('... should have one + x paragraphs for graph description if description data is provided', async () => {
                    const descriptionData = new GraphList();
                    descriptionData.graph = [];
                    descriptionData.graph.push(new Graph());
                    descriptionData.graph[0].id = 'test-graph-id-description';
                    descriptionData.graph[0].description = ['Description 1', 'Description 2', 'Description 3'];

                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableOf(descriptionData));

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-view > div > div.awg-graph-description',
                        1,
                        1
                    );

                    const pDes = getAndExpectDebugElementByCss(
                        divDes[0],
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

            describe('dynamic graph', () => {
                it('... should not contain a dynamic graph if rdf data is not provided', async () => {
                    const noRdfData = expectedEditionGraphDataEmpty;

                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableOf(noRdfData));

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-dynamic', 0, 0);

                    // No queryList
                    noRdfData.graph[0].rdfData = new GraphRDFData();
                    noRdfData.graph[0].rdfData.triples = 'example:test example:has example:Success';
                    noRdfData.graph[0].rdfData.queryList = undefined;

                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableOf(noRdfData));

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-dynamic', 0, 0);

                    // No triples
                    noRdfData.graph[0].rdfData = new GraphRDFData();
                    noRdfData.graph[0].rdfData.triples = undefined;
                    noRdfData.graph[0].rdfData.queryList = [new GraphSparqlQuery()];

                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableOf(noRdfData));

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-dynamic', 0, 0);
                });

                describe('with rdf data', () => {
                    let graphData: GraphList;

                    beforeEach(async () => {
                        graphData = expectedEditionGraphDataEmpty;
                        graphData.graph[0].rdfData = new GraphRDFData();
                        graphData.graph[0].rdfData.triples = 'example:test example:has example:Success';
                        graphData.graph[0].rdfData.queryList = [new GraphSparqlQuery()];

                        editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableOf(graphData));

                        component.getEditionGraphData();
                        await detectChangesOnPush(fixture);
                    });

                    it('... should contain a div.awg-dynamic-graph', () => {
                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > div.awg-graph-dynamic', 1, 1);
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
                        const wrapperDes = getAndExpectDebugElementByCss(compDe, 'div.awg-fullscreen-wrapper', 1, 1);
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

                        const expectedData = graphData.graph[0].rdfData;

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
                        const wrapperDes = getAndExpectDebugElementByCss(compDe, 'div.awg-fullscreen-wrapper', 1, 1);
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

                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableOf(noStaticImageData));

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-static', 0, 0);

                    // With empty string
                    noStaticImageData.graph[0].staticImage = '';

                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableOf(noStaticImageData));

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-static', 0, 0);
                });

                it('... should contain a static graph if staticImage data is provided', async () => {
                    const staticImageData = new GraphList();
                    staticImageData.graph = [];
                    staticImageData.graph.push(new Graph());
                    staticImageData.graph[0].id = 'test-graph-id-static-image';
                    staticImageData.graph[0].staticImage = component.GRAPH_IMAGES.OP25;

                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableOf(staticImageData));

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > div.awg-graph-static', 1, 1);
                });

                it('... should display header and image of static graph if staticImage data is provided', async () => {
                    const staticImageData = new GraphList();
                    staticImageData.graph = [];
                    staticImageData.graph.push(new Graph());
                    staticImageData.graph[0].id = 'test-graph-id-static-image';
                    staticImageData.graph[0].staticImage = component.GRAPH_IMAGES.OP25;

                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableOf(staticImageData));

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    const imgDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-view > div > div.awg-graph-static',
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

            describe('on error', () => {
                const expectedError = { status: 404, statusText: 'got Error' };

                beforeEach(async () => {
                    // Spy on editionDataService to return an error
                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableThrowError(() => expectedError));

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);
                });

                it('... should not contain graph view, but one AlertErrorComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

                    expectToEqual(alertErrorCmp.errorObject, expectedError);
                });
            });

            describe('on loading', () => {
                describe('... should contain only TwelveToneSpinnerComponent (stubbed) if ... ', () => {
                    it('... editionGraphData$ is EMPTY', async () => {
                        // Mock empty observable
                        component.editionGraphData$ = EMPTY;
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... editionGraphData$ is undefined', async () => {
                        // Mock undefined response
                        component.editionGraphData$ = observableOf(undefined);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... editionGraphData$ is null', async () => {
                        // Mock null response
                        component.editionGraphData$ = observableOf(null);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });
                });
            });
        });

        describe('METHODS', () => {
            describe('#getEditionGraphData()', () => {
                it('... should have a method `getEditionGraphData`', () => {
                    expect(component.getEditionGraphData).toBeDefined();
                });

                it('... should trigger editionStateService.getSelectedEditionComplex', () => {
                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 1);
                });

                it('... should get current editionComplex from editionStateService', () => {
                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 1);

                    expectToEqual(component.editionComplex, expectedEditionComplex);
                });

                it('... should update editionComplex when editionStateService emits changed value', async () => {
                    // ----------------
                    // Change to op. 25
                    editionStateServiceGetSelectedEditionComplexSpy.mockReturnValue(
                        observableOf(EditionComplexesService.getEditionComplexById('op25'))
                    );

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);

                    expectToEqual(component.editionComplex, EditionComplexesService.getEditionComplexById('op25'));
                });

                it('... should trigger editionDataService.getEditionGraph', () => {
                    expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1);
                });

                it('... should trigger editionDataService.getEditionGraph with current editionComplex', () => {
                    expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1, expectedEditionComplex);
                });

                it('... should re-trigger editionDataService.getEditionGraph with updated editionComplex', async () => {
                    // ----------------
                    // Change to op. 25
                    editionStateServiceGetSelectedEditionComplexSpy.mockReturnValue(
                        observableOf(EditionComplexesService.getEditionComplexById('op25'))
                    );

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);
                    expectSpyCall(
                        editionDataServiceGetEditionGraphDataSpy,
                        2,
                        EditionComplexesService.getEditionComplexById('op25')
                    );
                });

                it('... should get editionGraphData from editionDataService and set editionGraphData$', async () => {
                    expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1, expectedEditionComplex);

                    // Wait for fixture to be stable
                    await detectChangesOnPush(fixture);

                    await expect(lastValueFrom(component.editionGraphData$)).resolves.not.toThrow();
                    await expect(lastValueFrom(component.editionGraphData$)).resolves.toEqual(
                        expectedEditionGraphDataEmpty
                    );
                });

                it('... should update editionGraphData$ when editionStateService emits changed value', async () => {
                    expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1, expectedEditionComplex);

                    // ----------------
                    // Change to op. 25
                    editionStateServiceGetSelectedEditionComplexSpy.mockReturnValue(
                        observableOf(EditionComplexesService.getEditionComplexById('op25'))
                    );

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);
                    expectSpyCall(
                        editionDataServiceGetEditionGraphDataSpy,
                        2,
                        EditionComplexesService.getEditionComplexById('op25')
                    );

                    await expect(lastValueFrom(component.editionGraphData$)).resolves.not.toThrow();
                    await expect(lastValueFrom(component.editionGraphData$)).resolves.toEqual(
                        expectedEditionGraphDataOp25
                    );
                });

                it('... should return empty observable and set errorObject if switchMap fails', async () => {
                    const expectedError = { status: 404, statusText: 'fail' };
                    // Spy on editionDataService to return an error
                    editionDataServiceGetEditionGraphDataSpy.mockReturnValue(observableThrowError(() => expectedError));

                    component.getEditionGraphData();
                    await detectChangesOnPush(fixture);

                    await expect(lastValueFrom(component.editionGraphData$)).rejects.toThrow(EmptyError);

                    expectToEqual(component.errorObject, expectedError);
                });
            });
        });
    });
});
