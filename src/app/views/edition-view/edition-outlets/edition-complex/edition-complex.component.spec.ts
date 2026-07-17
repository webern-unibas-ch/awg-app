import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { ActivatedRouteStub, RouterOutletStubComponent } from '@testing/router-stubs';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionComplexComponent } from './edition-complex.component';

describe('EditionComplexComponent (DONE)', () => {
    let component: EditionComplexComponent;
    let fixture: ComponentFixture<EditionComplexComponent>;
    let compDe: DebugElement;

    let mockActivatedRoute: ActivatedRouteStub;
    let editionStateService: EditionStateService;

    let updateEditionComplexFromRouteSpy: Spy;
    let editionStateServiceUpdateSelectedEditionComplexSpy: Spy;
    let editionStateServiceUpdateSelectedEditionSeriesSpy: Spy;
    let editionStateServiceUpdateSelectedEditionSectionSpy: Spy;

    let expectedSelectedEditionComplex: EditionComplex;
    let expectedSelectedEditionComplexId: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        // Mocked activated route
        mockActivatedRoute = new ActivatedRouteStub();

        await TestBed.configureTestingModule({
            declarations: [EditionComplexComponent, RouterOutletStubComponent],
            providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }, EditionStateService],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        editionStateServiceUpdateSelectedEditionComplexSpy = vi.spyOn(
            editionStateService,
            'updateSelectedEditionComplex'
        );
        editionStateServiceUpdateSelectedEditionSectionSpy = vi.spyOn(
            editionStateService,
            'updateSelectedEditionSection'
        );
        editionStateServiceUpdateSelectedEditionSeriesSpy = vi.spyOn(
            editionStateService,
            'updateSelectedEditionSeries'
        );

        // Test data
        expectedSelectedEditionComplexId = 'op12';
        expectedSelectedEditionComplex = EditionComplexesService.getEditionComplexById(
            expectedSelectedEditionComplexId
        );

        // Create component fixture
        fixture = TestBed.createComponent(EditionComplexComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        updateEditionComplexFromRouteSpy = vi.spyOn(component, 'updateEditionComplexFromRoute');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });
        });

        describe('#updateEditionComplexFromRoute()', () => {
            it('... should have a method `updateEditionComplexFromRoute`', () => {
                expect(component.updateEditionComplexFromRoute).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(updateEditionComplexFromRouteSpy, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set route params via ActivatedRoute mock
            expectedSelectedEditionComplexId = 'op12';
            mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId }; // Op. 12

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedEditionComplex` to hold expectedComplex', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), expectedSelectedEditionComplex);
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });
        });

        describe('#updateEditionComplexFromRoute()', () => {
            it('... should have been called', () => {
                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
            });

            it('... should get id from router', () => {
                expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                expectToEqual(editionStateService.selectedEditionComplex(), expectedSelectedEditionComplex);
            });

            it('... should get correct complex when router id changes', () => {
                // Call with op. 12 (default)
                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectToEqual(editionStateService.selectedEditionComplex(), expectedSelectedEditionComplex);

                // ----------------
                // Change to op. 25
                mockActivatedRoute.testParamMap = { complexId: 'op25' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectToEqual(
                    editionStateService.selectedEditionComplex(),
                    EditionComplexesService.getEditionComplexById('op25')
                );
            });

            it('... should only get complex from valid router id changes', () => {
                expectToEqual(editionStateService.selectedEditionComplex(), expectedSelectedEditionComplex);

                // Change to non-existing id
                mockActivatedRoute.testParamMap = { complexId: 'fail' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectToEqual(editionStateService.selectedEditionComplex(), null);

                // ------------------
                // Change to empty id
                mockActivatedRoute.testParamMap = { complexId: '' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectToEqual(editionStateService.selectedEditionComplex(), null);

                // ----------------------
                // Change to another key
                mockActivatedRoute.testParamMap = { anotherId: 'op12' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectToEqual(editionStateService.selectedEditionComplex(), null);
            });

            it('... should trigger `EditionComplexesService.getEditionComplexById`', () => {
                const getEditionComplexByIdSpy = vi.spyOn(EditionComplexesService, 'getEditionComplexById');

                component.updateEditionComplexFromRoute();
                fixture.detectChanges();

                expectSpyCall(getEditionComplexByIdSpy, 1);
            });

            describe('... if edition complex can be found', () => {
                it('... should trigger `EditionOutlineService.getEditionSeriesById` (twice via getEditionSectionById)', () => {
                    const getEditionSeriesByIdSpy = vi.spyOn(EditionOutlineService, 'getEditionSeriesById');

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(getEditionSeriesByIdSpy, 2);
                });

                it('... should trigger `EditionOutlineService.getEditionSectionById`', () => {
                    const getEditionSectionByIdSpy = vi.spyOn(EditionOutlineService, 'getEditionSectionById');

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(getEditionSectionByIdSpy, 1);
                });

                it('... should have updated selectedEditionComplex$ (via EditionStateService; 3x per complex)', () => {
                    const complex = EditionComplexesService.getEditionComplexById(expectedSelectedEditionComplexId);

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionComplexSpy, 3, complex);
                });

                it('... should have updated selectedEditionSection (via EditionStateService; 2x per section)', () => {
                    const section = EditionOutlineService.getEditionSectionById(
                        expectedSelectedEditionComplex.pubStatement.series.route,
                        expectedSelectedEditionComplex.pubStatement.section.route
                    );

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 2, section);
                });

                it('... should have updated selectedEditionSeries (via EditionStateService; 1x per series)', () => {
                    const series = EditionOutlineService.getEditionSeriesById(
                        expectedSelectedEditionComplex.pubStatement.series.route
                    );

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSeriesSpy, 1, series);
                });

                it('... should get edition complex from EditionStateService and update selectedEditionComplex', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    expectToEqual(editionStateService.selectedEditionComplex(), expectedSelectedEditionComplex);
                    expectToEqual(component.selectedEditionComplex(), expectedSelectedEditionComplex);
                });

                it('... should get correct edition complex from EditionStateService when complex id changes', () => {
                    // ----------------
                    // Check for op. 12
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), expectedSelectedEditionComplex);
                    expectToEqual(component.selectedEditionComplex(), expectedSelectedEditionComplex);

                    // ----------------
                    // Change to op. 25
                    const newComplexId = 'op25';
                    const newComplex = EditionComplexesService.getEditionComplexById(newComplexId);
                    mockActivatedRoute.testParamMap = { complexId: newComplexId };

                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    expectToEqual(editionStateService.selectedEditionComplex(), newComplex);
                    expectToEqual(component.selectedEditionComplex(), newComplex);
                });

                it('... should get an edition complex with opus number from EditionStateService', () => {
                    const opusComplex = new EditionComplex(
                        {
                            title: 'Test Opus Complex',
                            catalogueType: 'OPUS',
                            catalogueNumber: '100',
                        },
                        {
                            editors: [],
                            lastModified: '---',
                        },
                        { series: '1', section: '5' }
                    );
                    expectedSelectedEditionComplexId = 'op100';

                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockImplementation((id: string) => {
                        if (id.toLowerCase() === expectedSelectedEditionComplexId.toLowerCase()) {
                            return opusComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), opusComplex);
                    expectToEqual(component.selectedEditionComplex(), opusComplex);
                });

                it('... should get an edition complex with M number from EditionStateService', () => {
                    const mnrComplex = new EditionComplex(
                        {
                            title: 'Test M Complex',
                            catalogueType: 'MNR',
                            catalogueNumber: '100',
                        },
                        {
                            editors: [],
                            lastModified: '---',
                        },
                        { series: '1', section: '5' }
                    );
                    expectedSelectedEditionComplexId = 'm100';

                    // Spy on the static method and provide a custom implementation
                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockImplementation((id: string) => {
                        if (id.toLowerCase() === expectedSelectedEditionComplexId.toLowerCase()) {
                            return mnrComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), mnrComplex);
                    expectToEqual(component.selectedEditionComplex(), mnrComplex);
                });

                it('... should get an edition complex with M* number from EditionStateService', () => {
                    const mnrXComplex = new EditionComplex(
                        {
                            title: 'Test M* Complex',
                            catalogueType: 'MNR_X',
                            catalogueNumber: '100',
                        },
                        {
                            editors: [],
                            lastModified: '---',
                        },
                        { series: '1', section: '5' }
                    );
                    expectedSelectedEditionComplexId = 'mx100';

                    // Spy on the static method and provide a custom implementation
                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockImplementation((id: string) => {
                        if (id.toLowerCase() === expectedSelectedEditionComplexId.toLowerCase()) {
                            return mnrXComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), mnrXComplex);
                    expectToEqual(component.selectedEditionComplex(), mnrXComplex);
                });

                it('... should get an edition complex with missing resp statement from EditionStateService', () => {
                    const missingRespComplex = new EditionComplex(
                        {
                            title: 'Test Missing Resp Complex',
                            catalogueType: 'OPUS',
                            catalogueNumber: '100',
                        },
                        null,
                        { series: '1', section: '5' }
                    );
                    expectedSelectedEditionComplexId = 'op100';

                    // Spy on the static method and provide a custom implementation
                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockImplementation((id: string) => {
                        if (id.toLowerCase() === expectedSelectedEditionComplexId.toLowerCase()) {
                            return missingRespComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), missingRespComplex);
                    expectToEqual(component.selectedEditionComplex(), missingRespComplex);
                });
            });

            describe('... if edition complex cannot be found', () => {
                it('... should not trigger `EditionOutlineService.getEditionSeriesById`', () => {
                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockReturnValue(null);

                    const getEditionSeriesByIdSpy = vi.spyOn(EditionOutlineService, 'getEditionSeriesById');
                    const initialGetEditionSeriesByIdCalls = getEditionSeriesByIdSpy.mock.calls.length;

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(getEditionSeriesByIdSpy, initialGetEditionSeriesByIdCalls);
                });

                it('... should not trigger `EditionOutlineService.getEditionSectionById`', () => {
                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockReturnValue(null);

                    const getEditionSectionByIdSpy = vi.spyOn(EditionOutlineService, 'getEditionSectionById');
                    const initialGetEditionSectionByIdCalls = getEditionSectionByIdSpy.mock.calls.length;

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(getEditionSectionByIdSpy, initialGetEditionSectionByIdCalls);
                });

                it('... should have set selectedEditionComplex to hold null (via EditionStateService)', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockReturnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);
                    expectToEqual(editionStateService.selectedEditionComplex(), null);
                });

                it('... should have set selectedEditionSeries to hold null (via EditionStateService)', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockReturnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);
                    expectToEqual(editionStateService.selectedEditionSeries(), null);
                });

                it('... should have set selectedEditionSection to hold null (via EditionStateService)', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockReturnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);
                    expectToEqual(editionStateService.selectedEditionSection(), null);
                });

                it('... should set selectedEditionComplex to null', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockReturnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);

                    expectToEqual(component.selectedEditionComplex(), null);
                });

                it('... should not get an edition complex with missing title statement from EditionStateService', () => {
                    const missingTitleComplex = new EditionComplex(
                        null,
                        {
                            editors: [],
                            lastModified: '---',
                        },
                        { series: '1', section: '5' }
                    );
                    expectedSelectedEditionComplexId = 'op100';
                    mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };

                    // Spy on the static method and provide a custom implementation
                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockImplementation((id: string) => {
                        if (id.toLowerCase() === expectedSelectedEditionComplexId.toLowerCase()) {
                            return missingTitleComplex;
                        }
                        return null;
                    });

                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), null);
                    expectToEqual(component.selectedEditionComplex(), null);
                });

                it('... should not get an edition complex with missing pub statement from EditionStateService', () => {
                    const missingPubComplex = new EditionComplex(
                        {
                            title: 'Test Missing Pub Complex',
                            catalogueType: 'OPUS',
                            catalogueNumber: '100',
                        },
                        {
                            editors: [],
                            lastModified: '---',
                        },
                        null
                    );
                    expectedSelectedEditionComplexId = 'op100';
                    mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };

                    // Spy on the static method and provide a custom implementation
                    vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockImplementation((id: string) => {
                        if (id.toLowerCase() === expectedSelectedEditionComplexId.toLowerCase()) {
                            return missingPubComplex;
                        }
                        return null;
                    });

                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), null);
                    expectToEqual(component.selectedEditionComplex(), null);
                });
            });
        });

        describe('#ngOnDestroy()', () => {
            it('... should have cleared selected edition series on destroy (via EditionStateService)', () => {
                component.ngOnDestroy();

                expectToEqual(editionStateService.selectedEditionSeries(), null);
            });

            it('... should have cleared selected edition complex on destroy (via EditionStateService)', () => {
                component.ngOnDestroy();

                expectToEqual(editionStateService.selectedEditionSection(), null);
            });

            it('... should have cleared selected edition section on destroy (via EditionStateService)', () => {
                component.ngOnDestroy();

                expectToEqual(editionStateService.selectedEditionComplex(), null);
            });
        });
    });
});
