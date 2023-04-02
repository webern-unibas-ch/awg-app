import { JsonPipe } from '@angular/common';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';

import { EmptyError, lastValueFrom, Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
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
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EDITION_COMPLEXES, EDITION_GRAPH_IMAGES_DATA } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, Graph, GraphList, GraphRDFData, GraphSparqlQuery } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { EditionGraphComponent } from './edition-graph.component';

// Mock components
@Component({ selector: 'awg-graph-visualizer', template: '' })
class GraphVisualizerStubComponent {
    @Input()
    graphRDFInputData: GraphRDFData;

    @Input()
    isFullscreen: boolean;
}

@Component({ selector: 'awg-modal', template: '' })
class ModalStubComponent {
    modalContent: string;
    open(modalContentSnippetKey: string): void {
        this.modalContent = modalContentSnippetKey;
    }
}

describe('EditionGraphComponent (DONE)', () => {
    let component: EditionGraphComponent;
    let fixture: ComponentFixture<EditionGraphComponent>;
    let compDe: DebugElement;

    let mockEditionService: Partial<EditionService>;
    let mockEditionDataService: Partial<EditionDataService>;

    let editionService: Partial<EditionService>;
    let editionDataService: Partial<EditionDataService>;

    let modalOpenSpy: Spy;
    let compGetEditonGraphDataSpy: Spy;
    let editionDataServiceGetEditionGraphDataSpy: Spy;
    let editionServiceGetEditionComplexSpy: Spy;

    const jsonPipe = new JsonPipe();

    let expectedEditionComplex: EditionComplex;
    let expectedEditionGraphDataEmpty: GraphList;
    let expectedEditionGraphDataOp25: GraphList;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    let expectedIsFullscreen: boolean;

    beforeEach(waitForAsync(() => {
        // Mocked editionDataService
        mockEditionDataService = {
            getEditionGraphData: (editionComplex: EditionComplex): Observable<GraphList> =>
                observableOf(new GraphList()),
        };
        // Mocked editionService
        mockEditionService = {
            getEditionComplex: (): Observable<EditionComplex> => observableOf(expectedEditionComplex),
        };

        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [
                EditionGraphComponent,
                GraphVisualizerStubComponent,
                ModalStubComponent,
                CompileHtmlComponent,
            ],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionService, useValue: mockEditionService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionGraphComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject services from root
        editionDataService = TestBed.inject(EditionDataService);
        editionService = TestBed.inject(EditionService);

        // TestData (default)
        expectedIsFullscreen = false;

        expectedEditionComplex = EDITION_COMPLEXES.OP12;

        expectedEditionGraphDataEmpty = mockEditionData.mockGraphEmptyData;

        expectedEditionGraphDataOp25 = new GraphList();
        expectedEditionGraphDataOp25.graph = [];
        expectedEditionGraphDataOp25.graph.push(new Graph());
        expectedEditionGraphDataOp25.graph[0].id = 'test-graph-id-op25';
        expectedEditionGraphDataOp25.graph[0].description = ['Description for test-graph-id-op25'];

        // Spies on component methods
        compGetEditonGraphDataSpy = spyOn(component, 'getEditionGraphData').and.callThrough();

        editionServiceGetEditionComplexSpy = spyOn(editionService, 'getEditionComplex').and.callThrough();
        editionDataServiceGetEditionGraphDataSpy = spyOn(editionDataService, 'getEditionGraphData').and.callFake(
            (editionComplex: EditionComplex) => {
                switch (editionComplex) {
                    case EDITION_COMPLEXES.OP12: {
                        return observableOf(expectedEditionGraphDataEmpty);
                    }
                    case EDITION_COMPLEXES.OP25: {
                        return observableOf(expectedEditionGraphDataOp25);
                    }
                    default: {
                        return observableOf(new GraphList());
                    }
                }
            }
        );
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected editionService should use provided mockValue', () => {
        expect(mockEditionService === editionService).toBe(true);
    });

    it('... injected editionDataService should use provided mockValue', () => {
        expect(mockEditionDataService === editionDataService).toBe(true);
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
            expect(component.errorObject).toBeNull();
        });

        it('... should have `isFullscreen`', () => {
            expectToBe(component.isFullscreen, expectedIsFullscreen);
        });

        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        it('... should not have `editionGraphData$`', () => {
            expect(component.editionGraphData$).toBeUndefined();
        });

        it('... should not have called `getEditionGraphData()`', () => {
            expectSpyCall(compGetEditonGraphDataSpy, 0);
        });

        describe('VIEW', () => {
            it('... should have a `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain one modal component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], ModalStubComponent, 1, 1);
            });

            it('... should not have a nested div.awg-graph-view', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);
            });

            it('... should not have a nested div.errorMessage', () => {
                getAndExpectDebugElementByCss(compDe, 'div.errorMessage', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            editionServiceGetEditionComplexSpy.and.returnValue(observableOf(EDITION_COMPLEXES.OP12));

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `getEditionGraphData()`', () => {
            expectSpyCall(compGetEditonGraphDataSpy, 1);
        });

        describe('#getEditionGraphData()', () => {
            it('... should have a method `getEditionGraphData`', () => {
                expect(component.getEditionGraphData).toBeDefined();
            });

            it('... should trigger editionService.getEditionComplex', () => {
                expectSpyCall(editionServiceGetEditionComplexSpy, 1);
            });

            it('... should get current editionComplex from editionService', () => {
                expectSpyCall(editionServiceGetEditionComplexSpy, 1);

                expectToEqual(component.editionComplex, expectedEditionComplex);
            });

            it('... should update editionComplex when editionService emits changed value', waitForAsync(() => {
                // ----------------
                // Change to op. 25
                editionServiceGetEditionComplexSpy.and.returnValue(observableOf(EDITION_COMPLEXES.OP25));

                component.getEditionGraphData();
                detectChangesOnPush(fixture);

                expectSpyCall(editionServiceGetEditionComplexSpy, 2);

                expectToEqual(component.editionComplex, EDITION_COMPLEXES.OP25);
            }));

            it('... should trigger editionDataService.getEditionGraph', () => {
                expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1);
            });

            it('... should trigger editionDataService.getEditionGraph with current editionComplex', () => {
                expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1, expectedEditionComplex);
            });

            it('... should re-trigger editionDataService.getEditionGraph with updated editionComplex', waitForAsync(() => {
                // ----------------
                // Change to op. 25
                // ExpectedEditionComplex = EDITION_COMPLEXES.op25;
                editionServiceGetEditionComplexSpy.and.returnValue(observableOf(EDITION_COMPLEXES.OP25));

                component.getEditionGraphData();
                detectChangesOnPush(fixture);

                expectSpyCall(editionServiceGetEditionComplexSpy, 2);
                expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 2, EDITION_COMPLEXES.OP25);
            }));

            it('... should get editionGraphData from editionDataService and set editionGraphData$', waitForAsync(() => {
                expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1, expectedEditionComplex);

                // Wait for fixture to be stable
                detectChangesOnPush(fixture);

                expectAsync(lastValueFrom(component.editionGraphData$)).toBeResolved();
                expectAsync(lastValueFrom(component.editionGraphData$))
                    .withContext(`should be resolved to ${expectedEditionGraphDataEmpty}`)
                    .toBeResolvedTo(expectedEditionGraphDataEmpty);
            }));

            it('... should update editionGraphData$ when editionService emits changed value', waitForAsync(() => {
                expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1, expectedEditionComplex);

                // ----------------
                // Change to op. 25
                // ExpectedEditionComplex = EDITION_COMPLEXES.op25;
                editionServiceGetEditionComplexSpy.and.returnValue(observableOf(EDITION_COMPLEXES.OP25));

                component.getEditionGraphData();
                detectChangesOnPush(fixture);

                expectSpyCall(editionServiceGetEditionComplexSpy, 2);
                expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 2, EDITION_COMPLEXES.OP25);

                expectAsync(lastValueFrom(component.editionGraphData$)).toBeResolved();
                expectAsync(lastValueFrom(component.editionGraphData$))
                    .withContext(`should be resolved to ${expectedEditionGraphDataOp25}`)
                    .toBeResolvedTo(expectedEditionGraphDataOp25);
            }));

            it('... should return empty observable and set errorObject if switchMap fails', waitForAsync(() => {
                const expectedError = { status: 404, statusText: 'fail' };
                // Spy on editionDataService to return an error
                editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableThrowError(() => expectedError));

                component.getEditionGraphData();
                detectChangesOnPush(fixture);

                expectAsync(lastValueFrom(component.editionGraphData$)).toBeRejected();
                expectAsync(lastValueFrom(component.editionGraphData$)).toBeRejectedWithError(EmptyError);

                expectToEqual(component.errorObject, expectedError);
            }));
        });

        describe('VIEW', () => {
            it('... should have one div.awg-graph-view', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 1, 1);
            });

            it('... should not contain a div.awg-graph-view if graph data is not provided', waitForAsync(() => {
                const noGraphData = new GraphList();
                noGraphData.graph = undefined;

                editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noGraphData));

                component.getEditionGraphData();
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div', 0, 0);
            }));

            it('... should contain a div.awg-graph-view if graph data is provided', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div', 1, 1);
            });

            describe('graph description', () => {
                it('... should have one div for graph description with two default paragraphs if description data and triples are not provided', waitForAsync(() => {
                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(
                        observableOf(expectedEditionGraphDataEmpty)
                    );

                    component.getEditionGraphData();
                    detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-view > div > div.awg-graph-description',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(divDes[0], 'p', 2, 2);
                }));

                it('... should contain a placeholder if content of graph data and triples are empty', waitForAsync(() => {
                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(
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
                }));

                it('... should display placeholder in paragraph', waitForAsync(() => {
                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(
                        observableOf(expectedEditionGraphDataEmpty)
                    );

                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-view > div > div.awg-graph-description',
                        1,
                        1
                    );
                    const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-graph-description-empty', 1, 1);
                    const pEl = pDes[0].nativeElement;

                    // Create intro placeholder
                    const graphPlaceholder = `[Die Graph-Visualisierungen zum Editionskomplex ${expectedEditionComplex.complexId.full} erscheinen im Zusammenhang der vollständigen Edition von ${expectedEditionComplex.complexId.short} in ${expectedEditionRouteConstants.EDITION.short} ${expectedEditionComplex.series.short}/${expectedEditionComplex.section.short}.]`;
                    const strippedGraphPlaceholder = graphPlaceholder.replace(/<em>/g, '').replace(/<\/em>/g, '');

                    expectToBe(pEl.textContent.trim(), strippedGraphPlaceholder);
                }));

                it('... should have one + x paragraphs for graph description if description data is provided', waitForAsync(() => {
                    const descriptionData = new GraphList();
                    descriptionData.graph = [];
                    descriptionData.graph.push(new Graph());
                    descriptionData.graph[0].id = 'test-graph-id-description';
                    descriptionData.graph[0].description = ['Description 1', 'Description 2', 'Description 3'];

                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(descriptionData));

                    component.getEditionGraphData();
                    detectChangesOnPush(fixture);

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
                        const pEl = pDe.nativeElement;
                        expectToBe(pEl.textContent, `Description ${index}`);
                    });
                }));
            });

            describe('dynamic graph', () => {
                it('... should not contain a dynamic graph if rdf data is not provided', waitForAsync(() => {
                    const noRdfData = expectedEditionGraphDataEmpty;

                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noRdfData));

                    component.getEditionGraphData();
                    detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-dynamic', 0, 0);

                    // No queryList
                    noRdfData.graph[0].rdfData = new GraphRDFData();
                    noRdfData.graph[0].rdfData.triples = 'example:test example:has example:Success';
                    noRdfData.graph[0].rdfData.queryList = undefined;

                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noRdfData));

                    component.getEditionGraphData();
                    detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-dynamic', 0, 0);

                    // No triples
                    noRdfData.graph[0].rdfData = new GraphRDFData();
                    noRdfData.graph[0].rdfData.triples = undefined;
                    noRdfData.graph[0].rdfData.queryList = [new GraphSparqlQuery()];

                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noRdfData));

                    component.getEditionGraphData();
                    detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-dynamic', 0, 0);
                }));

                describe('with rdf data', () => {
                    let graphData: GraphList;

                    beforeEach(waitForAsync(() => {
                        graphData = expectedEditionGraphDataEmpty;
                        graphData.graph[0].rdfData = new GraphRDFData();
                        graphData.graph[0].rdfData.triples = 'example:test example:has example:Success';
                        graphData.graph[0].rdfData.queryList = [new GraphSparqlQuery()];

                        editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(graphData));

                        component.getEditionGraphData();
                        detectChangesOnPush(fixture);
                    }));

                    it('... should contain a div.awg-dynamic-graph', () => {
                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > div.awg-graph-dynamic', 1, 1);
                    });

                    it('... should contain a header with two buttons (help and fullscreen)', () => {
                        const hDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-dynamic > h4', 1, 1);
                        const hEl = hDes[0].nativeElement;

                        const btnDes = getAndExpectDebugElementByCss(hDes[0], 'button.btn', 2, 2);
                        const btnEl0 = btnDes[0].nativeElement;
                        const btnEl1 = btnDes[1].nativeElement;

                        expectToContain(hEl.textContent, 'Dynamischer Graph');

                        expectToContain(btnEl0.textContent, 'Hinweise zur Nutzung');
                        expectToContain(btnEl1.title, 'Open fullscreen');
                    });

                    it('... should trigger modal from click on help button', fakeAsync(() => {
                        const modalDes = getAndExpectDebugElementByDirective(compDe, ModalStubComponent, 1, 1);
                        const modalCmp = modalDes[0].injector.get(ModalStubComponent) as ModalStubComponent;
                        // Spy on modal
                        modalOpenSpy = spyOn(modalCmp, 'open').and.callThrough();

                        // Get button
                        const btnDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-graph-dynamic > h4 button.btn',
                            2,
                            2
                        );
                        const btnEl0 = btnDes[0].nativeElement;

                        // Click button
                        click(btnEl0 as HTMLElement);
                        detectChangesOnPush(fixture);

                        expectSpyCall(modalOpenSpy, 1, 'HINT_EDITION_GRAPH');
                        expectToBe(modalCmp.modalContent, 'HINT_EDITION_GRAPH');
                    }));

                    it('... should contain a paragraph', () => {
                        const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-dynamic > p', 1, 1);
                        const pEl = pDes[0].nativeElement;

                        expect(pEl.textContent).toBeTruthy();
                    });

                    it('... should contain one graph visualizer component (stubbed)', () => {
                        getAndExpectDebugElementByDirective(compDe, GraphVisualizerStubComponent, 1, 1);
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
                });
            });

            describe('static graph', () => {
                it('... should not contain a static graph if staticImage data is not provided', waitForAsync(() => {
                    const noStaticImageData = new GraphList();
                    noStaticImageData.graph = [];
                    noStaticImageData.graph.push(new Graph());
                    noStaticImageData.graph[0].id = 'test-graph-id-no-static-image';
                    noStaticImageData.graph[0].staticImage = undefined;

                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noStaticImageData));

                    component.getEditionGraphData();
                    detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-static', 0, 0);

                    // With empty string
                    noStaticImageData.graph[0].staticImage = '';

                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noStaticImageData));

                    component.getEditionGraphData();
                    detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-static', 0, 0);
                }));

                it('... should contain a static graph if staticImage data is provided', waitForAsync(() => {
                    const staticImageData = new GraphList();
                    staticImageData.graph = [];
                    staticImageData.graph.push(new Graph());
                    staticImageData.graph[0].id = 'test-graph-id-static-image';
                    staticImageData.graph[0].staticImage = component.GRAPH_IMAGES.OP25;

                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(staticImageData));

                    component.getEditionGraphData();
                    detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > div.awg-graph-static', 1, 1);
                }));

                it('... should display header and image of static graph if staticImage data is provided', waitForAsync(() => {
                    const staticImageData = new GraphList();
                    staticImageData.graph = [];
                    staticImageData.graph.push(new Graph());
                    staticImageData.graph[0].id = 'test-graph-id-static-image';
                    staticImageData.graph[0].staticImage = component.GRAPH_IMAGES.OP25;

                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(staticImageData));

                    component.getEditionGraphData();
                    detectChangesOnPush(fixture);

                    const imgDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-view > div > div.awg-graph-static',
                        1,
                        1
                    );
                    const hDes = getAndExpectDebugElementByCss(imgDes[0], 'h4', 1, 1);
                    const hEl = hDes[0].nativeElement;

                    const divDes = getAndExpectDebugElementByCss(imgDes[0], 'div', 1, 1);
                    const divEl = divDes[0].nativeElement;

                    expectToContain(hEl.textContent, 'Statischer Graph');

                    expectToContain(divEl.textContent, component.GRAPH_IMAGES.OP25);
                }));
            });

            describe('on error', () => {
                const expectedError = { status: 404, statusText: 'got Error' };

                beforeEach(waitForAsync(() => {
                    // Spy on editionDataService to return an error
                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableThrowError(() => expectedError));

                    component.getEditionGraphData();
                    detectChangesOnPush(fixture);
                }));

                it('... should not have graph view, but one div.errorMessage with centered danger alert', waitForAsync(() => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);
                    const errorDes = getAndExpectDebugElementByCss(compDe, 'div.errorMessage', 1, 1);

                    getAndExpectDebugElementByCss(errorDes[0], 'div.text-center > div.alert-danger', 1, 1);
                }));

                it('... should display errorMessage', waitForAsync(() => {
                    const alertDes = getAndExpectDebugElementByCss(compDe, 'div.alert-danger', 1, 1);
                    const alertEl = alertDes[0].nativeElement;

                    expectToContain(alertEl.textContent, jsonPipe.transform(expectedError));
                }));
            });
        });
    });
});
