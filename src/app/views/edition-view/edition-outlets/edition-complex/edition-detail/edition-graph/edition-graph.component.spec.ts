import { DOCUMENT } from '@angular/common';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';

import {
    EMPTY,
    EmptyError,
    lastValueFrom,
    Observable,
    of as observableOf,
    throwError as observableThrowError,
} from 'rxjs';
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

import { FullscreenService } from '@awg-app/core/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EDITION_GRAPH_IMAGES_DATA } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, Graph, GraphList, GraphRDFData, GraphSparqlQuery } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionGraphComponent } from './edition-graph.component';
import { GraphVisualizerComponent } from './graph-visualizer';

// Mock components
@Component({ selector: 'awg-alert-error', template: '' })
class AlertErrorStubComponent {
    @Input()
    errorObject: any;
}

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

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
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
    let compGetEditonGraphDataSpy: Spy;
    let editionDataServiceGetEditionGraphDataSpy: Spy;
    let editionStateServiceGetSelectedEditionComplexSpy: Spy;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionGraphDataEmpty: GraphList;
    let expectedEditionGraphDataOp25: GraphList;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    let expectedIsFullscreen: boolean;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
    });

    beforeEach(waitForAsync(() => {
        // Mocked editionDataService
        mockEditionDataService = {
            getEditionGraphData: (editionComplex: EditionComplex): Observable<GraphList> =>
                observableOf(new GraphList()),
        };
        // Mocked editionStateService
        mockEditionStateService = {
            getSelectedEditionComplex: (): Observable<EditionComplex> => observableOf(expectedEditionComplex),
        };
        // Mocked fullscreenService
        mockFullscreenService = {
            isFullscreen: (): boolean => false,
            openFullscreen: (el: HTMLElement): void => {},
            closeFullscreen: (): void => {},
        };

        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [
                EditionGraphComponent,
                AlertErrorStubComponent,
                GraphVisualizerStubComponent,
                ModalStubComponent,
                CompileHtmlComponent,
                TwelveToneSpinnerStubComponent,
            ],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionStateService, useValue: mockEditionStateService },
                { provide: FullscreenService, useValue: mockFullscreenService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionGraphComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // TestData (default)
        expectedIsFullscreen = false;

        expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP12');

        expectedEditionGraphDataEmpty = JSON.parse(JSON.stringify(mockEditionData.mockGraphEmptyData));

        expectedEditionGraphDataOp25 = new GraphList();
        expectedEditionGraphDataOp25.graph = [];
        expectedEditionGraphDataOp25.graph.push(new Graph());
        expectedEditionGraphDataOp25.graph[0].id = 'test-graph-id-op25';
        expectedEditionGraphDataOp25.graph[0].description = ['Description for test-graph-id-op25'];

        // Spies on component methods
        compGetEditonGraphDataSpy = spyOn(component, 'getEditionGraphData').and.callThrough();

        editionStateServiceGetSelectedEditionComplexSpy = spyOn(
            mockEditionStateService,
            'getSelectedEditionComplex'
        ).and.callThrough();
        editionDataServiceGetEditionGraphDataSpy = spyOn(mockEditionDataService, 'getEditionGraphData').and.callFake(
            (editionComplex: EditionComplex) => {
                switch (editionComplex) {
                    case EditionComplexesService.getEditionComplexById('OP12'): {
                        return observableOf(expectedEditionGraphDataEmpty);
                    }
                    case EditionComplexesService.getEditionComplexById('OP25'): {
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

            it('... should not contain a loading spinner component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            editionStateServiceGetSelectedEditionComplexSpy.and.returnValue(
                observableOf(EditionComplexesService.getEditionComplexById('OP12'))
            );

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `getEditionGraphData()`', () => {
            expectSpyCall(compGetEditonGraphDataSpy, 1);
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-graph-view', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 1, 1);
            });

            it('... should not contain a div in div.awg-graph-view if graph data is not provided', waitForAsync(() => {
                const noGraphData = new GraphList();
                noGraphData.graph = undefined;

                editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noGraphData));

                component.getEditionGraphData();
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div', 0, 0);
            }));

            it('... should contain a div in div.awg-graph-view if graph data is provided', () => {
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

                it('... should not contain graph view, but one AlertErrorComponent (stubbed)', waitForAsync(() => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 1, 1);
                }));

                it('... should pass down error object to AlertErrorComponent', waitForAsync(() => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

                    expectToEqual(alertErrorCmp.errorObject, expectedError);
                }));
            });

            describe('on loading', () => {
                describe('... should contain only TwelveToneSpinnerComponent (stubbed) if ... ', () => {
                    it('... editionGraphData$ is EMPTY', () => {
                        // Mock empty observable
                        component.editionGraphData$ = EMPTY;
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... editionGraphData$ is undefined', () => {
                        // Mock undefined response
                        component.editionGraphData$ = observableOf(undefined);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... editionGraphData$ is null', () => {
                        // Mock null response
                        component.editionGraphData$ = observableOf(null);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });
                });
            });
        });

        describe('#Hostlistener onFullscreenChange()', () => {
            it('... should have a hostlistener `onFullscreenChange`', () => {
                expect(component.onFullscreenChange).toBeDefined();
            });

            it('... should trigger `fullscreenService.isFullscreen`', () => {
                const isFullscreenSpy = spyOn(mockFullscreenService, 'isFullscreen').and.callThrough();

                // Simulate fullscreenchange event
                const event = new Event('fullscreenchange');
                mockDocument.dispatchEvent(event);

                expectSpyCall(isFullscreenSpy, 1);
            });

            it('... should update `isFullscreen`', () => {
                const isFullscreenSpy = spyOn(mockFullscreenService, 'isFullscreen').and.returnValue(true);

                // Simulate fullscreenchange event
                const event = new Event('fullscreenchange');
                mockDocument.dispatchEvent(event);

                expectToBe(component.isFullscreen, true);
            });
        });

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

            it('... should update editionComplex when editionStateService emits changed value', waitForAsync(() => {
                // ----------------
                // Change to op. 25
                editionStateServiceGetSelectedEditionComplexSpy.and.returnValue(
                    observableOf(EditionComplexesService.getEditionComplexById('OP25'))
                );

                component.getEditionGraphData();
                detectChangesOnPush(fixture);

                expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);

                expectToEqual(component.editionComplex, EditionComplexesService.getEditionComplexById('OP25'));
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
                editionStateServiceGetSelectedEditionComplexSpy.and.returnValue(
                    observableOf(EditionComplexesService.getEditionComplexById('OP25'))
                );

                component.getEditionGraphData();
                detectChangesOnPush(fixture);

                expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);
                expectSpyCall(
                    editionDataServiceGetEditionGraphDataSpy,
                    2,
                    EditionComplexesService.getEditionComplexById('OP25')
                );
            }));

            it('... should get editionGraphData from editionDataService and set editionGraphData$', waitForAsync(() => {
                expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1, expectedEditionComplex);

                // Wait for fixture to be stable
                detectChangesOnPush(fixture);

                expectAsync(lastValueFrom(component.editionGraphData$)).toBeResolved();
                expectAsync(lastValueFrom(component.editionGraphData$)).toBeResolvedTo(expectedEditionGraphDataEmpty);
            }));

            it('... should update editionGraphData$ when editionStateService emits changed value', waitForAsync(() => {
                expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1, expectedEditionComplex);

                // ----------------
                // Change to op. 25
                editionStateServiceGetSelectedEditionComplexSpy.and.returnValue(
                    observableOf(EditionComplexesService.getEditionComplexById('OP25'))
                );

                component.getEditionGraphData();
                detectChangesOnPush(fixture);

                expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);
                expectSpyCall(
                    editionDataServiceGetEditionGraphDataSpy,
                    2,
                    EditionComplexesService.getEditionComplexById('OP25')
                );

                expectAsync(lastValueFrom(component.editionGraphData$)).toBeResolved();
                expectAsync(lastValueFrom(component.editionGraphData$)).toBeResolvedTo(expectedEditionGraphDataOp25);
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

        describe('#openFullscreen()', () => {
            beforeEach(() => {
                // Mock the graphVisualizer child component
                component.graphVisualizer = {
                    fs: {
                        nativeElement: mockDocument.createElement('div'),
                    },
                } as GraphVisualizerComponent;
            });

            it('... should have a method `openFullscreen`', () => {
                expect(component.openFullscreen).toBeDefined();
            });

            it('... should trigger `fullscreenService.openFullscreen`', () => {
                const openFullscreenSpy = spyOn(mockFullscreenService, 'openFullscreen').and.callThrough();
                expectSpyCall(openFullscreenSpy, 0);

                component.openFullscreen();

                expectSpyCall(openFullscreenSpy, 1);
            });

            it('... should set isFullscreen to true', () => {
                component.isFullscreen = false;

                component.openFullscreen();

                expectToBe(component.isFullscreen, true);
            });
        });

        describe('#closeFullscreen()', () => {
            it('... should have a method `closeFullscreen`', () => {
                expect(component.closeFullscreen).toBeDefined();
            });

            it('... should trigger `fullscreenService.closeFullscreen`', () => {
                const closeFullscreenSpy = spyOn(mockFullscreenService, 'closeFullscreen').and.callThrough();
                expectSpyCall(closeFullscreenSpy, 0);

                component.closeFullscreen();

                expectSpyCall(closeFullscreenSpy, 1);
            });

            it('... should set isFullscreen to false', () => {
                component.isFullscreen = true;

                component.closeFullscreen();

                expectToBe(component.isFullscreen, false);
            });
        });
    });
});
