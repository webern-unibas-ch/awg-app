import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { ActivatedRouteStub, RouterOutletStubComponent } from '@testing/router-stubs';

import { EDITION_ROUTE_CONSTANTS, EditionRouteConstant } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionComplexComponent } from './edition-complex.component';

describe('EditionComplexComponent (DONE)', () => {
    let component: EditionComplexComponent;
    let fixture: ComponentFixture<EditionComplexComponent>;
    let compDe: DebugElement;

    let mockActivatedRoute: ActivatedRouteStub;
    let editionComplexesService: EditionComplexesService;
    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let updateEditionComplexFromRouteSpy: Spy;
    let complexesServiceGetEditionComplexByIdSpy: Spy;
    let outlineServiceGetEditionSectionByIdSpy: Spy;
    let outlineServiceGetEditionSeriesByIdSpy: Spy;
    let stateServiceUpdateSelectedEditionComplexSpy: Spy;
    let stateServiceUpdateSelectedEditionSeriesSpy: Spy;
    let stateServiceUpdateSelectedEditionSectionSpy: Spy;

    let expectedComplex: EditionComplex;
    let expectedComplexId: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeEach(async () => {
        // Mocked activated route
        mockActivatedRoute = new ActivatedRouteStub();

        await TestBed.configureTestingModule({
            declarations: [EditionComplexComponent, RouterOutletStubComponent],
            providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionComplexesService = TestBed.inject(EditionComplexesService);
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        complexesServiceGetEditionComplexByIdSpy = vi
            .spyOn(editionComplexesService, 'getEditionComplexById')
            .mockImplementation((complexId: string) => {
                try {
                    return EditionStateHelper.getComplex(complexId);
                } catch {
                    return undefined;
                }
            });
        outlineServiceGetEditionSeriesByIdSpy = vi
            .spyOn(editionOutlineService, 'getEditionSeriesById')
            .mockImplementation((seriesId: string) => {
                try {
                    return EditionStateHelper.getSeries(seriesId);
                } catch {
                    return undefined;
                }
            });
        outlineServiceGetEditionSectionByIdSpy = vi
            .spyOn(editionOutlineService, 'getEditionSectionById')
            .mockImplementation((seriesId: string, sectionId: string) => {
                try {
                    return EditionStateHelper.getSection(seriesId, sectionId);
                } catch {
                    return undefined;
                }
            });
        stateServiceUpdateSelectedEditionComplexSpy = vi.spyOn(editionStateService, 'updateSelectedEditionComplex');
        stateServiceUpdateSelectedEditionSectionSpy = vi.spyOn(editionStateService, 'updateSelectedEditionSection');
        stateServiceUpdateSelectedEditionSeriesSpy = vi.spyOn(editionStateService, 'updateSelectedEditionSeries');

        // Test data
        expectedComplexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(expectedComplexId);

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
            expectedComplexId = 'op12';
            mockActivatedRoute.testParamMap = { complexId: expectedComplexId }; // Op. 12

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToEqual(component.selectedEditionComplex(), expectedComplex);
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

                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);
            });

            it('... should get correct complex when router id changes', () => {
                // Call with op. 12 (default)
                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);

                // ----------------
                // Change to op. 25
                mockActivatedRoute.testParamMap = { complexId: 'op25' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectToEqual(editionStateService.selectedEditionComplex(), EditionStateHelper.getComplex('op25'));
            });

            it('... should only get complex from valid router id changes', () => {
                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);

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
                expectSpyCall(complexesServiceGetEditionComplexByIdSpy, 1);

                component.updateEditionComplexFromRoute();
                fixture.detectChanges();

                expectSpyCall(complexesServiceGetEditionComplexByIdSpy, 2);
            });

            describe('... if edition complex can be found', () => {
                it('... should trigger `EditionOutlineService.getEditionSeriesById`', () => {
                    outlineServiceGetEditionSeriesByIdSpy.mockClear();

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(outlineServiceGetEditionSeriesByIdSpy, 1);
                });

                it('... should trigger `EditionOutlineService.getEditionSectionById`', () => {
                    outlineServiceGetEditionSectionByIdSpy.mockClear();

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(outlineServiceGetEditionSectionByIdSpy, 1);
                });

                it('... should have updated selectedEditionComplex$ (via EditionStateService; 3x per complex)', () => {
                    const complex = EditionStateHelper.getComplex(expectedComplexId);

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 3, complex);
                });

                it('... should have updated selectedEditionSection (via EditionStateService; 2x per section)', () => {
                    const section = EditionStateHelper.getSection(
                        expectedComplex.pubStatement.series.route,
                        expectedComplex.pubStatement.section.route
                    );

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(stateServiceUpdateSelectedEditionSectionSpy, 2, section);
                });

                it('... should have updated selectedEditionSeries (via EditionStateService; 1x per series)', () => {
                    const series = EditionStateHelper.getSeries(expectedComplex.pubStatement.series.route);

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 1, series);
                });

                it('... should get edition complex from EditionStateService and update selectedEditionComplex', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);
                    expectToEqual(component.selectedEditionComplex(), expectedComplex);
                });

                it('... should get correct edition complex from EditionStateService when complex id changes', () => {
                    // ----------------
                    // Check for op. 12
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);
                    expectToEqual(component.selectedEditionComplex(), expectedComplex);

                    // ----------------
                    // Change to op. 25
                    const newComplexId = 'op25';
                    const newComplex = EditionStateHelper.getComplex(newComplexId);
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
                    expectedComplexId = 'op100';

                    complexesServiceGetEditionComplexByIdSpy.mockImplementationOnce((id: string) => {
                        if (id.toLowerCase() === expectedComplexId.toLowerCase()) {
                            return opusComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedComplexId };
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
                    expectedComplexId = 'm100';

                    // Spy on the static method and provide a custom implementation
                    complexesServiceGetEditionComplexByIdSpy.mockImplementationOnce((id: string) => {
                        if (id.toLowerCase() === expectedComplexId.toLowerCase()) {
                            return mnrComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedComplexId };
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
                    expectedComplexId = 'mx100';

                    // Spy on the static method and provide a custom implementation
                    complexesServiceGetEditionComplexByIdSpy.mockImplementationOnce((id: string) => {
                        if (id.toLowerCase() === expectedComplexId.toLowerCase()) {
                            return mnrXComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedComplexId };
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), mnrXComplex);
                    expectToEqual(component.selectedEditionComplex(), mnrXComplex);
                });

                it('... should get an edition complex with unknown catalogue type from EditionStateService', () => {
                    const unknownCatTypeComplex = new EditionComplex(
                        {
                            title: 'Test BWV Complex',
                            catalogueType: 'BWV',
                            catalogueNumber: '100',
                        },
                        {
                            editors: [],
                            lastModified: '---',
                        },
                        { series: '1', section: '5' }
                    );
                    expectedComplexId = 'bwv100';

                    // Spy on the static method and provide a custom implementation
                    complexesServiceGetEditionComplexByIdSpy.mockImplementationOnce((id: string) => {
                        if (id.toLowerCase() === expectedComplexId.toLowerCase()) {
                            return unknownCatTypeComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedComplexId };
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), unknownCatTypeComplex);
                    expectToEqual(component.selectedEditionComplex(), unknownCatTypeComplex);

                    expectToEqual(
                        component.selectedEditionComplex()?.titleStatement.catalogueType,
                        new EditionRouteConstant()
                    );
                });

                it('... should get an edition complex with missing resp statement from EditionStateService', () => {
                    const missingRespComplex = new EditionComplex(
                        {
                            title: 'Test Missing Resp Complex',
                            catalogueType: 'OPUS',
                            catalogueNumber: '100',
                        },
                        null as any,
                        { series: '1', section: '5' }
                    );
                    expectedComplexId = 'op100';

                    // Spy on the static method and provide a custom implementation
                    complexesServiceGetEditionComplexByIdSpy.mockImplementationOnce((id: string) => {
                        if (id.toLowerCase() === expectedComplexId.toLowerCase()) {
                            return missingRespComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedComplexId };
                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), missingRespComplex);
                    expectToEqual(component.selectedEditionComplex(), missingRespComplex);
                });

                it('... should get an edition complex with editor $ref not found in PERSONS_DATA from EditionStateService', () => {
                    const unknownEditorComplex = new EditionComplex(
                        {
                            title: 'Test Complex',
                            catalogueType: 'OPUS',
                            catalogueNumber: '12',
                        },
                        {
                            editors: [{ $ref: 'PERSON_UNKNOWN' }],
                            lastModified: '2026-08-12',
                        },
                        { series: '1', section: '5' }
                    );

                    expectedComplexId = 'op12';
                    complexesServiceGetEditionComplexByIdSpy.mockImplementationOnce((id: string) => {
                        if (id.toLowerCase() === expectedComplexId.toLowerCase()) {
                            return unknownEditorComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedComplexId };
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(editionStateService.selectedEditionComplex(), unknownEditorComplex);
                    expectToEqual(component.selectedEditionComplex(), unknownEditorComplex);

                    const mappedEditors = component.selectedEditionComplex()?.respStatement?.editors;
                    expect(mappedEditors).toBeDefined();
                    expectToBe(mappedEditors?.length, 1);
                    expectToEqual(mappedEditors?.[0], {
                        name: 'PERSON_UNKNOWN',
                        homepage: '',
                        identifiers: {},
                    });
                });

                describe('... if edition complex is found but series or section are missing', () => {
                    beforeEach(() => {
                        stateServiceUpdateSelectedEditionSeriesSpy.mockClear();
                        stateServiceUpdateSelectedEditionSectionSpy.mockClear();
                        stateServiceUpdateSelectedEditionComplexSpy.mockClear();
                    });

                    it('... should have updated selectedEditionSeries to hold null if series is missing (undefined)', () => {
                        outlineServiceGetEditionSeriesByIdSpy.mockReturnValue(undefined);

                        const expectedSection = EditionStateHelper.getSection(
                            expectedComplex.pubStatement.series.route,
                            expectedComplex.pubStatement.section.route
                        );
                        outlineServiceGetEditionSectionByIdSpy.mockReturnValue(expectedSection);

                        mockActivatedRoute.testParamMap = { complexId: expectedComplexId };
                        fixture.detectChanges();

                        expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 1, null);
                        expectSpyCall(stateServiceUpdateSelectedEditionSectionSpy, 2, expectedSection);
                        expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 3, expectedComplex);
                    });

                    it('... should have updated selectedEditionSection to hold null if section is missing (undefined)', () => {
                        const expectedSeries = EditionStateHelper.getSeries(expectedComplex.pubStatement.series.route);
                        outlineServiceGetEditionSeriesByIdSpy.mockReturnValue(expectedSeries);
                        outlineServiceGetEditionSectionByIdSpy.mockReturnValue(undefined);

                        mockActivatedRoute.testParamMap = { complexId: expectedComplexId };
                        fixture.detectChanges();

                        expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 1, expectedSeries);
                        expectSpyCall(stateServiceUpdateSelectedEditionSectionSpy, 2, null);
                        expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 3, expectedComplex);
                    });

                    it('... should have updated selectedEditionSeries and selectedEditionSection to hold null if series and section are missing (undefined)', () => {
                        outlineServiceGetEditionSeriesByIdSpy.mockReturnValue(undefined);
                        outlineServiceGetEditionSectionByIdSpy.mockReturnValue(undefined);

                        mockActivatedRoute.testParamMap = { complexId: expectedComplexId };
                        fixture.detectChanges();

                        expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 1, null);
                        expectSpyCall(stateServiceUpdateSelectedEditionSectionSpy, 2, null);
                        expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 3, expectedComplex);
                    });
                });
            });

            describe('... if edition complex cannot be found', () => {
                it('... should not trigger `EditionOutlineService.getEditionSeriesById`', () => {
                    complexesServiceGetEditionComplexByIdSpy.mockReturnValue(null);

                    const initialGetEditionSeriesByIdCalls = outlineServiceGetEditionSeriesByIdSpy.mock.calls.length;

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(outlineServiceGetEditionSeriesByIdSpy, initialGetEditionSeriesByIdCalls);
                });

                it('... should not trigger `EditionOutlineService.getEditionSectionById`', () => {
                    complexesServiceGetEditionComplexByIdSpy.mockReturnValue(null);

                    const initialGetEditionSectionByIdCalls = outlineServiceGetEditionSectionByIdSpy.mock.calls.length;

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(outlineServiceGetEditionSectionByIdSpy, initialGetEditionSectionByIdCalls);
                });

                it('... should have set selectedEditionComplex to hold null (via EditionStateService)', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    complexesServiceGetEditionComplexByIdSpy.mockReturnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);
                    expectToEqual(editionStateService.selectedEditionComplex(), null);
                });

                it('... should have set selectedEditionSeries to hold null (via EditionStateService)', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    complexesServiceGetEditionComplexByIdSpy.mockReturnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);
                    expectToEqual(editionStateService.selectedEditionSeries(), null);
                });

                it('... should have set selectedEditionSection to hold null (via EditionStateService)', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    complexesServiceGetEditionComplexByIdSpy.mockReturnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);
                    expectToEqual(editionStateService.selectedEditionSection(), null);
                });

                it('... should set selectedEditionComplex to null', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    complexesServiceGetEditionComplexByIdSpy.mockReturnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);

                    expectToEqual(component.selectedEditionComplex(), null);
                });

                it('... should not get an edition complex with missing title statement from EditionStateService', () => {
                    const missingTitleComplex = new EditionComplex(
                        null as any,
                        {
                            editors: [],
                            lastModified: '---',
                        },
                        { series: '1', section: '5' }
                    );
                    expectedComplexId = 'op100';
                    mockActivatedRoute.testParamMap = { complexId: expectedComplexId };

                    // Spy on the static method and provide a custom implementation
                    complexesServiceGetEditionComplexByIdSpy.mockImplementationOnce((id: string) => {
                        if (id.toLowerCase() === expectedComplexId.toLowerCase()) {
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
                        null as any
                    );
                    expectedComplexId = 'op100';
                    mockActivatedRoute.testParamMap = { complexId: expectedComplexId };

                    // Spy on the static method and provide a custom implementation
                    complexesServiceGetEditionComplexByIdSpy.mockImplementationOnce((id: string) => {
                        if (id.toLowerCase() === expectedComplexId.toLowerCase()) {
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
