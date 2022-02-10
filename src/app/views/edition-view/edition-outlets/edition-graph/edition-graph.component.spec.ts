import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { JsonPipe } from '@angular/common';

import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import {
    EditionConstants,
    EditionWork,
    EditionWorks,
    Graph,
    GraphList,
    GraphRDFData,
    GraphSparqlQuery,
} from '@awg-views/edition-view/models';
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
    let editionServiceGetEditionWorkSpy: Spy;

    const jsonPipe = new JsonPipe();

    let expectedEditionWork: EditionWork;
    let expectedEditionGraphDataOp12: GraphList;
    let expectedEditionGraphDataOp25: GraphList;

    let expectedIsFullscreen: boolean;

    beforeEach(
        waitForAsync(() => {
            // Mocked editionDataService
            mockEditionDataService = {
                getEditionGraphData: (editionWork: EditionWork): Observable<GraphList> => observableOf(),
            };
            // Mocked editionService
            mockEditionService = {
                getEditionWork: (): Observable<EditionWork> => observableOf(),
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
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionGraphComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject services from root
        editionDataService = TestBed.inject(EditionDataService);
        editionService = TestBed.inject(EditionService);

        // TestData (default)
        expectedIsFullscreen = false;

        expectedEditionWork = EditionWorks.OP12;

        expectedEditionGraphDataOp12 = new GraphList();
        expectedEditionGraphDataOp12.graph = [];
        expectedEditionGraphDataOp12.graph.push(new Graph());
        expectedEditionGraphDataOp12.graph[0].id = 'test-graph-id-op12';
        expectedEditionGraphDataOp12.graph[0].description = ['Description of test-graph-id-op12'];

        expectedEditionGraphDataOp25 = new GraphList();
        expectedEditionGraphDataOp25.graph = [];
        expectedEditionGraphDataOp25.graph.push(new Graph());
        expectedEditionGraphDataOp25.graph[0].id = 'test-graph-id-op25';
        expectedEditionGraphDataOp25.graph[0].description = ['Description for test-graph-id-op25'];

        // Spies on component methods
        compGetEditonGraphDataSpy = spyOn(component, 'getEditionGraphData').and.callThrough();

        editionServiceGetEditionWorkSpy = spyOn(editionService, 'getEditionWork').and.callThrough();
        editionDataServiceGetEditionGraphDataSpy = spyOn(editionDataService, 'getEditionGraphData').and.callFake(
            (editionWork: EditionWork) => {
                switch (editionWork) {
                    case EditionWorks.OP12: {
                        return observableOf(expectedEditionGraphDataOp12);
                    }
                    case EditionWorks.OP25: {
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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('injected editionService should use provided mockValue', () => {
        expect(mockEditionService === editionService).toBe(true);
    });

    it('injected editionDataService should use provided mockValue', () => {
        expect(mockEditionDataService === editionDataService).toBe(true);
    });

    describe('BEFORE initial data binding', () => {
        it('should have correct static `GRAPH_IMAGES`', () => {
            expect(component.GRAPH_IMAGES).toBeTruthy();

            expect(component.GRAPH_IMAGES.OP12).toBeDefined();
            expect(component.GRAPH_IMAGES.OP12).not.toBeTruthy('should be empty string');

            expect(component.GRAPH_IMAGES.OP25).toBeTruthy();
            expect(component.GRAPH_IMAGES.OP25).toBe(EditionConstants.GRAPH_IMAGE_OP25.route);
        });

        it('should have `errorObject` = null', () => {
            expect(component.errorObject).toBeNull('should be null');
        });

        it('should have `isFullscreen`', () => {
            expect(component.isFullscreen).toBeDefined('should be defined');
            expect(component.isFullscreen).toBe(expectedIsFullscreen, `should be ${expectedIsFullscreen}`);
        });

        it('should not have `editionWork`', () => {
            expect(component.editionWork).toBeUndefined('should be undefined');
        });

        it('should not have `editionGraphData$`', () => {
            expect(component.editionGraphData$).toBeUndefined('should be undefined');
        });

        it('should not have called `getEditionGraphData()`', () => {
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
            editionServiceGetEditionWorkSpy.and.returnValue(observableOf(EditionWorks.OP12));

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have called `getEditionGraphData()`', () => {
            expectSpyCall(compGetEditonGraphDataSpy, 1);
        });

        describe('#getEditionGraphData', () => {
            it('... should trigger editionService.getEditionWork', () => {
                expectSpyCall(editionServiceGetEditionWorkSpy, 1);
            });

            it('... should get current editionWork from editionService', () => {
                expectSpyCall(editionServiceGetEditionWorkSpy, 1);

                expect(component.editionWork).toBeTruthy();
                expect(component.editionWork).toEqual(expectedEditionWork, `should be ${expectedEditionWork}`);
            });

            it(
                '... should update editionWork when editionService emits changed value',
                waitForAsync(async () => {
                    // ----------------
                    // Change to op. 25
                    editionServiceGetEditionWorkSpy.and.returnValue(observableOf(EditionWorks.OP25));

                    // Init new switchMap
                    component.getEditionGraphData();
                    // Apply changes
                    await detectChangesOnPush(fixture);

                    expectSpyCall(editionServiceGetEditionWorkSpy, 2);

                    expect(component.editionWork).toBeTruthy();
                    expect(component.editionWork).toEqual(EditionWorks.OP25, `should be ${expectedEditionWork}`);
                })
            );

            it('... should trigger editionDataService.getEditionGraph', () => {
                expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1);
            });

            it('... should trigger editionDataService.getEditionGraph with current editionWork', () => {
                expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1, expectedEditionWork);
            });

            it(
                '... should re-trigger editionDataService.getEditionGraph with updated editionWork',
                waitForAsync(async () => {
                    // ----------------
                    // Change to op. 25
                    // ExpectedEditionWork = EditionWorks.op25;
                    editionServiceGetEditionWorkSpy.and.returnValue(observableOf(EditionWorks.OP25));

                    // Init new switchMap
                    component.getEditionGraphData();
                    // Apply changes
                    await detectChangesOnPush(fixture);

                    expectSpyCall(editionServiceGetEditionWorkSpy, 2);
                    expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 2, EditionWorks.OP25);
                })
            );

            it(
                '... should get editionGraphData from editionDataService and set editionGraphData$',
                waitForAsync(() => {
                    expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1, expectedEditionWork);

                    expect(component.editionGraphData$).toBeTruthy();
                    component.editionGraphData$.subscribe((data: GraphList) => {
                        expect(data).toEqual(
                            expectedEditionGraphDataOp12,
                            `should equal ${expectedEditionGraphDataOp12}`
                        );
                    });
                })
            );

            it(
                '... should update editionGraphData$ when editionService emits changed value',
                waitForAsync(async () => {
                    expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 1, expectedEditionWork);

                    // ----------------
                    // Change to op. 25
                    // ExpectedEditionWork = EditionWorks.op25;
                    editionServiceGetEditionWorkSpy.and.returnValue(observableOf(EditionWorks.OP25));

                    // Init new switchMap
                    component.getEditionGraphData();
                    // Apply changes
                    await detectChangesOnPush(fixture);

                    expectSpyCall(editionServiceGetEditionWorkSpy, 2);
                    expectSpyCall(editionDataServiceGetEditionGraphDataSpy, 2, EditionWorks.OP25);

                    expect(component.editionGraphData$).toBeTruthy();

                    component.editionGraphData$.subscribe((data: GraphList) => {
                        expect(component.editionWork).toBe(EditionWorks.OP25);
                        expect(data).toEqual(
                            expectedEditionGraphDataOp25,
                            `should equal ${expectedEditionGraphDataOp25}`
                        );
                    });
                })
            );

            it(
                '... should return empty GraphList and set errorObject if switchMap fails',
                waitForAsync(async () => {
                    const expectedError = { status: 404, statusText: 'fail' };
                    // Spy on editionDataService to return an error
                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableThrowError(expectedError));

                    // Init new switchMap
                    component.getEditionGraphData();
                    // Apply changes
                    await detectChangesOnPush(fixture);

                    component.editionGraphData$.subscribe(
                        data => {
                            fail('should not have next');
                        },
                        error => {
                            fail('should not error');
                        },
                        () => {
                            expect(component.errorObject).toEqual(expectedError, `should equal ${expectedError}`);
                        }
                    );
                })
            );
        });

        describe('VIEW', () => {
            it('... should have one div.awg-graph-view', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 1, 1);
            });

            it(
                '... should not contain a graph div if graph data is not provided',
                waitForAsync(async () => {
                    const noGraphData = new GraphList();
                    noGraphData.graph = undefined;

                    // Provide data
                    editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noGraphData));

                    // Init new switchMap
                    component.getEditionGraphData();
                    // Apply changes
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div', 0, 0);
                })
            );

            it('... should contain a graph div if graph data is provided', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div', 1, 1);
            });

            describe('graph description', () => {
                it(
                    '... should have one div for graph description with one default paragraph if description data is not provided',
                    waitForAsync(async () => {
                        const noDescriptionData = new GraphList();
                        noDescriptionData.graph = [];
                        noDescriptionData.graph.push(new Graph());
                        noDescriptionData.graph[0].id = 'test-graph-id-no-description';
                        expectedEditionGraphDataOp25.graph[0].description = undefined;

                        // Provide data
                        editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noDescriptionData));
                        // Init new switchMap
                        component.getEditionGraphData();
                        // Apply changes
                        await detectChangesOnPush(fixture);
                        const divDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-graph-view > div > div.awg-graph-description',
                            1,
                            1
                        );

                        getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                    })
                );

                it(
                    '... should have one + x paragraphs for graph description if description data is provided',
                    waitForAsync(async () => {
                        const descriptionData = new GraphList();
                        descriptionData.graph = [];
                        descriptionData.graph.push(new Graph());
                        descriptionData.graph[0].id = 'test-graph-id-description';
                        descriptionData.graph[0].description = ['Description 1', 'Description 2', 'Description 3'];

                        // Provide data
                        editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(descriptionData));
                        // Init new switchMap
                        component.getEditionGraphData();
                        // Apply changes
                        await detectChangesOnPush(fixture);

                        const divDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-graph-view > div > div.awg-graph-description',
                            1,
                            1
                        );

                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1 + 3, 1 + 3);
                        const pEl1 = pDes[1].nativeElement;
                        const pEl2 = pDes[2].nativeElement;
                        const pEl3 = pDes[3].nativeElement;

                        expect(pEl1.textContent).toBeTruthy();
                        expect(pEl1.textContent).toContain('Description 1', 'should contain Description 1');

                        expect(pEl2.textContent).toBeTruthy();
                        expect(pEl2.textContent).toContain('Description 2', 'should contain Description 2');

                        expect(pEl3.textContent).toBeTruthy();
                        expect(pEl3.textContent).toContain('Description 3', 'should contain Description 3');
                    })
                );
            });

            describe('dynamic graph', () => {
                it(
                    '... should not contain a dynamic graph if rdf data is not provided',
                    waitForAsync(async () => {
                        const noRdfData = expectedEditionGraphDataOp12;

                        // Return data
                        editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noRdfData));

                        // Init new switchMap
                        component.getEditionGraphData();
                        // Apply changes
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-dynamic', 0, 0);

                        // No queryList
                        noRdfData.graph[0].rdfData = new GraphRDFData();
                        noRdfData.graph[0].rdfData.triples = 'example:test example:has example:Success';
                        noRdfData.graph[0].rdfData.queryList = undefined;

                        // Return data
                        editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noRdfData));

                        // Init new switchMap
                        component.getEditionGraphData();
                        // Apply changes
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-dynamic', 0, 0);

                        // No triples
                        noRdfData.graph[0].rdfData = new GraphRDFData();
                        noRdfData.graph[0].rdfData.triples = undefined;
                        noRdfData.graph[0].rdfData.queryList = [new GraphSparqlQuery()];

                        // Return data
                        editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noRdfData));

                        // Init new switchMap
                        component.getEditionGraphData();
                        // Apply changes
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-dynamic', 0, 0);
                    })
                );

                describe('with rdf data', () => {
                    let graphData: GraphList;

                    beforeEach(
                        waitForAsync(async () => {
                            graphData = expectedEditionGraphDataOp12;
                            graphData.graph[0].rdfData = new GraphRDFData();
                            graphData.graph[0].rdfData.triples = 'example:test example:has example:Success';
                            graphData.graph[0].rdfData.queryList = [new GraphSparqlQuery()];

                            // Return data
                            editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(graphData));

                            // Init new switchMap
                            component.getEditionGraphData();
                            // Apply changes
                            await detectChangesOnPush(fixture);
                        })
                    );

                    it('... should contain a div.awg-dynamic-graph', () => {
                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > div.awg-graph-dynamic', 1, 1);
                    });

                    it('... should contain a header with two buttons (help and fullscreen)', () => {
                        const hDes = getAndExpectDebugElementByCss(compDe, 'div.awg-graph-dynamic > h4', 1, 1);
                        const hEl = hDes[0].nativeElement;

                        const btnDes = getAndExpectDebugElementByCss(hDes[0], 'button.btn', 2, 2);
                        const btnEl0 = btnDes[0].nativeElement;
                        const btnEl1 = btnDes[1].nativeElement;

                        expect(hEl.textContent).toBeTruthy();
                        expect(hEl.textContent).toContain('Dynamischer Graph', 'should contain Dynamischer Graph');

                        expect(btnEl0.textContent).toBeTruthy();
                        expect(btnEl0.textContent).toContain(
                            'Hinweise zur Nutzung',
                            'should contain Hinweise zur Nutzung'
                        );
                        expect(btnEl1.title).toBeTruthy();
                        expect(btnEl1.title).toContain('Open fullscreen', 'should contain title Open fullscreen');
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
                        expect(modalCmp.modalContent).toBe('HINT_EDITION_GRAPH');
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

                        expect(graphVisCmp.graphRDFInputData).toBeTruthy();
                        expect(graphVisCmp.graphRDFInputData).toEqual(expectedData, `should equal ${expectedData}`);
                    });
                });
            });

            describe('static graph', () => {
                it(
                    '... should not contain a static graph if staticImage data is not provided',
                    waitForAsync(async () => {
                        const noStaticImageData = new GraphList();
                        noStaticImageData.graph = [];
                        noStaticImageData.graph.push(new Graph());
                        noStaticImageData.graph[0].id = 'test-graph-id-no-static-image';
                        noStaticImageData.graph[0].staticImage = undefined;

                        // Return data
                        editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noStaticImageData));

                        // Init new switchMap
                        component.getEditionGraphData();
                        // Apply changes
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-static', 0, 0);

                        // With empty string
                        noStaticImageData.graph[0].staticImage = '';

                        // Return data
                        editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(noStaticImageData));

                        // Init new switchMap
                        component.getEditionGraphData();
                        // Apply changes
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > awg-graph-static', 0, 0);
                    })
                );

                it(
                    '... should contain a static graph if staticImage data is provided',
                    waitForAsync(async () => {
                        const staticImageData = new GraphList();
                        staticImageData.graph = [];
                        staticImageData.graph.push(new Graph());
                        staticImageData.graph[0].id = 'test-graph-id-static-image';
                        staticImageData.graph[0].staticImage = component.GRAPH_IMAGES.OP25;

                        // Return data
                        editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(staticImageData));

                        // Init new switchMap
                        component.getEditionGraphData();
                        // Apply changes
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view > div > div.awg-graph-static', 1, 1);
                    })
                );

                it(
                    '... should display header and image of static graph if staticImage data is provided',
                    waitForAsync(async () => {
                        const staticImageData = new GraphList();
                        staticImageData.graph = [];
                        staticImageData.graph.push(new Graph());
                        staticImageData.graph[0].id = 'test-graph-id-static-image';
                        staticImageData.graph[0].staticImage = component.GRAPH_IMAGES.OP25;

                        // Return data
                        editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableOf(staticImageData));

                        // Init new switchMap
                        component.getEditionGraphData();
                        // Apply changes
                        await detectChangesOnPush(fixture);

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

                        expect(hEl.textContent).toBeTruthy();
                        expect(hEl.textContent).toContain('Statischer Graph', 'should contain Statischer Graph');

                        expect(divEl.textContent).toBeTruthy();
                        expect(divEl.textContent).toContain(
                            component.GRAPH_IMAGES.OP25,
                            `should contain ${component.GRAPH_IMAGES.OP25}`
                        );
                    })
                );
            });

            describe('on error', () => {
                const expectedError = { status: 404, statusText: 'got Error' };

                beforeEach(
                    waitForAsync(() => {
                        // Spy on editionDataService to return an error
                        editionDataServiceGetEditionGraphDataSpy.and.returnValue(observableThrowError(expectedError));

                        // Trigger new switch map
                        component.getEditionGraphData();
                        // Apply changes
                        detectChangesOnPush(fixture);
                    })
                );

                it(
                    '... should not have graph view, but one div.errorMessage with centered danger alert',
                    waitForAsync(() => {
                        getAndExpectDebugElementByCss(compDe, 'div.awg-graph-view', 0, 0);
                        const errorDes = getAndExpectDebugElementByCss(compDe, 'div.errorMessage', 1, 1);

                        getAndExpectDebugElementByCss(errorDes[0], 'div.text-center > div.alert-danger', 1, 1);
                    })
                );

                it(
                    '... should display errorMessage',
                    waitForAsync(() => {
                        const alertDes = getAndExpectDebugElementByCss(compDe, 'div.alert-danger', 1, 1);
                        const alertEl = alertDes[0].nativeElement;

                        expect(alertEl.textContent).toBeTruthy();
                        expect(alertEl.textContent).toContain(jsonPipe.transform(expectedError));
                    })
                );
            });
        });
    });
});
