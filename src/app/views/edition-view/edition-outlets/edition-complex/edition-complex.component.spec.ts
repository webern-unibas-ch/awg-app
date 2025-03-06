import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EMPTY, Observable, ReplaySubject } from 'rxjs';
import Spy = jasmine.Spy;

import { expectSpyCall, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { ActivatedRouteStub, RouterOutletStubComponent } from '@testing/router-stubs';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionComplexComponent } from './edition-complex.component';

describe('EditionComplexComponent (DONE)', () => {
    let component: EditionComplexComponent;
    let fixture: ComponentFixture<EditionComplexComponent>;
    let compDe: DebugElement;

    let mockActivatedRoute: ActivatedRouteStub;
    let mockEditionStateService: Partial<EditionStateService>;

    let mockEditionComplexSubject: ReplaySubject<EditionComplex>;
    let mockEditionSeriesSubject: ReplaySubject<EditionOutlineSeries>;
    let mockEditionSectionSubject: ReplaySubject<EditionOutlineSection>;

    let updateEditionComplexFromRouteSpy: Spy;
    let editionStateServiceGetSelectedEditionComplexSpy: Spy;
    let editionStateServiceUpdateSelectedEditionComplexSpy: Spy;
    let editionStateServiceUpdateSelectedEditionSeriesSpy: Spy;
    let editionStateServiceUpdateSelectedEditionSectionSpy: Spy;
    let editionStateServiceClearSelectedEditionComplexSpy: Spy;
    let editionStateServiceClearSelectedEditionSeriesSpy: Spy;
    let editionStateServiceClearSelectedEditionSectionSpy: Spy;

    let expectedSelectedEditionComplex: EditionComplex;
    let expectedSelectedEditionComplexId: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        mockEditionComplexSubject = new ReplaySubject<EditionComplex>(1);
        mockEditionSeriesSubject = new ReplaySubject<EditionOutlineSeries>(1);
        mockEditionSectionSubject = new ReplaySubject<EditionOutlineSection>(1);

        // Mock edition state service
        mockEditionStateService = {
            getSelectedEditionComplex: (): Observable<EditionComplex> => mockEditionComplexSubject.asObservable(),
            updateSelectedEditionComplex: (editionComplex: EditionComplex): void =>
                mockEditionComplexSubject.next(editionComplex),
            clearSelectedEditionComplex: (): void => mockEditionComplexSubject.next(null),

            updateSelectedEditionSeries: (editionSeries: EditionOutlineSeries): void => {
                mockEditionSeriesSubject.next(editionSeries);
            },
            clearSelectedEditionSeries: (): void => mockEditionSeriesSubject.next(null),

            updateSelectedEditionSection: (editionSection: EditionOutlineSection): void => {
                mockEditionSectionSubject.next(editionSection);
            },
            clearSelectedEditionSection: (): void => mockEditionSectionSubject.next(null),
        };

        // Mocked activated route
        mockActivatedRoute = new ActivatedRouteStub();

        await TestBed.configureTestingModule({
            declarations: [EditionComplexComponent, RouterOutletStubComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: EditionStateService, useValue: mockEditionStateService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionComplexComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSelectedEditionComplex = EditionComplexesService.getEditionComplexById('OP12');
        expectedSelectedEditionComplexId = 'OP12';

        // Spies
        updateEditionComplexFromRouteSpy = spyOn(component, 'updateEditionComplexFromRoute').and.callThrough();
        editionStateServiceGetSelectedEditionComplexSpy = spyOn(
            mockEditionStateService,
            'getSelectedEditionComplex'
        ).and.callThrough();
        editionStateServiceUpdateSelectedEditionComplexSpy = spyOn(
            mockEditionStateService,
            'updateSelectedEditionComplex'
        ).and.callThrough();
        editionStateServiceUpdateSelectedEditionSeriesSpy = spyOn(
            mockEditionStateService,
            'updateSelectedEditionSeries'
        ).and.callThrough();
        editionStateServiceUpdateSelectedEditionSectionSpy = spyOn(
            mockEditionStateService,
            'updateSelectedEditionSection'
        ).and.callThrough();
        editionStateServiceClearSelectedEditionComplexSpy = spyOn(
            mockEditionStateService,
            'clearSelectedEditionComplex'
        ).and.callThrough();
        editionStateServiceClearSelectedEditionSeriesSpy = spyOn(
            mockEditionStateService,
            'clearSelectedEditionSeries'
        ).and.callThrough();
        editionStateServiceClearSelectedEditionSectionSpy = spyOn(
            mockEditionStateService,
            'clearSelectedEditionSection'
        ).and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `selectedEditionComplex$`', () => {
            expect(component.selectedEditionComplex$).toBeUndefined();
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
            expectedSelectedEditionComplexId = 'OP12';
            mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId }; // Op. 12

            // Trigger initial data binding
            fixture.detectChanges();
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
                expectSpyCall(
                    editionStateServiceUpdateSelectedEditionComplexSpy,
                    1,
                    EditionComplexesService.getEditionComplexById(expectedSelectedEditionComplexId)
                );
            });

            it('... should get correct complex from router id', () => {
                // Call with op. 12 (default)
                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionStateServiceUpdateSelectedEditionComplexSpy,
                    1,
                    EditionComplexesService.getEditionComplexById('OP12')
                );

                // ----------------
                // Change to op. 25
                mockActivatedRoute.testParamMap = { complexId: 'OP25' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionStateServiceUpdateSelectedEditionComplexSpy,
                    2,
                    EditionComplexesService.getEditionComplexById('OP25')
                );
            });

            it('... should only get complex from valid router id', () => {
                expectSpyCall(
                    editionStateServiceUpdateSelectedEditionComplexSpy,
                    1,
                    EditionComplexesService.getEditionComplexById('OP12')
                );

                // Change to non-existing id
                mockActivatedRoute.testParamMap = { complexId: 'fail' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionStateServiceUpdateSelectedEditionComplexSpy,
                    1,
                    EditionComplexesService.getEditionComplexById('OP12')
                );

                // ------------------
                // Change to empty id
                mockActivatedRoute.testParamMap = { complexId: '' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionStateServiceUpdateSelectedEditionComplexSpy,
                    1,
                    EditionComplexesService.getEditionComplexById('OP12')
                );

                // ----------------------
                // Change to another key
                mockActivatedRoute.testParamMap = { anotherId: 'OP12' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionStateServiceUpdateSelectedEditionComplexSpy,
                    1,
                    EditionComplexesService.getEditionComplexById('OP12')
                );
            });

            it('... should trigger `EditionComplexesService.getEditionComplexById`', () => {
                const getEditionComplexByIdSpy = spyOn(
                    EditionComplexesService,
                    'getEditionComplexById'
                ).and.callThrough();

                component.updateEditionComplexFromRoute();
                fixture.detectChanges();

                expectSpyCall(getEditionComplexByIdSpy, 1);
            });

            describe('... if edition complex can be found', () => {
                it('... should trigger `EditionOutlineService.getEditionSeriesById` (twice via getEditionSectionById)', () => {
                    const getEditionSeriesByIdSpy = spyOn(
                        EditionOutlineService,
                        'getEditionSeriesById'
                    ).and.callThrough();

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(getEditionSeriesByIdSpy, 2);
                });

                it('... should trigger `EditionOutlineService.getEditionSectionById`', () => {
                    const getEditionSectionByIdSpy = spyOn(
                        EditionOutlineService,
                        'getEditionSectionById'
                    ).and.callThrough();

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(getEditionSectionByIdSpy, 1);
                });

                it('... should have updated selectedEditionComplex$ (via EditionStateService)', () => {
                    const complex = EditionComplexesService.getEditionComplexById(expectedSelectedEditionComplexId);

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionComplexSpy, 1, complex);
                });

                it('... should have updated selectedEditionSeries (via EditionStateService)', () => {
                    const series = EditionOutlineService.getEditionSeriesById(
                        expectedSelectedEditionComplex.pubStatement.series.route
                    );

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSeriesSpy, 1, series);
                });

                it('... should have updated selectedEditionSection (via EditionStateService)', () => {
                    const section = EditionOutlineService.getEditionSectionById(
                        expectedSelectedEditionComplex.pubStatement.series.route,
                        expectedSelectedEditionComplex.pubStatement.section.route
                    );

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 1, section);
                });

                it('... should get edition complex from EditionStateService and set selectedEditionComplex$', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(
                        editionStateServiceUpdateSelectedEditionComplexSpy,
                        1,
                        EditionComplexesService.getEditionComplexById(expectedSelectedEditionComplexId)
                    );
                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 1);

                    expect(component.selectedEditionComplex$).toBeDefined();
                });

                it('... should get correct edition complex from EditionStateService when complex id changes', () => {
                    // ----------------
                    // Check for op. 12
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(
                        editionStateServiceUpdateSelectedEditionComplexSpy,
                        1,
                        EditionComplexesService.getEditionComplexById(expectedSelectedEditionComplexId)
                    );
                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 1);

                    // ----------------
                    // Change to op. 25
                    expectedSelectedEditionComplexId = 'op25';
                    mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };

                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(
                        editionStateServiceUpdateSelectedEditionComplexSpy,
                        2,
                        EditionComplexesService.getEditionComplexById(expectedSelectedEditionComplexId)
                    );
                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);

                    expect(component.selectedEditionComplex$).toBeDefined();
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

                    spyOn(EditionComplexesService, 'getEditionComplexById').and.callFake((id: string) => {
                        if (id.toUpperCase() === expectedSelectedEditionComplexId.toUpperCase()) {
                            return opusComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                    editionStateServiceUpdateSelectedEditionComplexSpy.and.callThrough();

                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionComplexSpy, 2, opusComplex);
                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);

                    expect(component.selectedEditionComplex$).toBeDefined();
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
                    spyOn(EditionComplexesService, 'getEditionComplexById').and.callFake((id: string) => {
                        if (id.toUpperCase() === expectedSelectedEditionComplexId.toUpperCase()) {
                            return mnrComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                    editionStateServiceUpdateSelectedEditionComplexSpy.and.callThrough();

                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionComplexSpy, 2, mnrComplex);
                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);

                    expect(component.selectedEditionComplex$).toBeDefined();
                });

                it('... should get an edition complex with M* number from EditionStateService', () => {
                    const mnrPlusComplex = new EditionComplex(
                        {
                            title: 'Test M* Complex',
                            catalogueType: 'MNR_STAR',
                            catalogueNumber: '100',
                        },
                        {
                            editors: [],
                            lastModified: '---',
                        },
                        { series: '1', section: '5' }
                    );
                    expectedSelectedEditionComplexId = 'm_star100';

                    // Spy on the static method and provide a custom implementation
                    spyOn(EditionComplexesService, 'getEditionComplexById').and.callFake((id: string) => {
                        if (id.toUpperCase() === expectedSelectedEditionComplexId.toUpperCase()) {
                            return mnrPlusComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                    editionStateServiceUpdateSelectedEditionComplexSpy.and.callThrough();

                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionComplexSpy, 2, mnrPlusComplex);
                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);

                    expect(component.selectedEditionComplex$).toBeDefined();
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
                    spyOn(EditionComplexesService, 'getEditionComplexById').and.callFake((id: string) => {
                        if (id.toUpperCase() === expectedSelectedEditionComplexId.toUpperCase()) {
                            return missingRespComplex;
                        }
                        return null;
                    });

                    mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                    editionStateServiceUpdateSelectedEditionComplexSpy.and.callThrough();

                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionComplexSpy, 2, missingRespComplex);
                    expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);

                    expect(component.selectedEditionComplex$).toBeDefined();
                });
            });

            describe('... if edition complex cannot be found', () => {
                it('... should not trigger `EditionOutlineService.getEditionSeriesById`', () => {
                    spyOn(EditionComplexesService, 'getEditionComplexById').and.returnValue(null);

                    const getEditionSeriesByIdSpy = spyOn(
                        EditionOutlineService,
                        'getEditionSeriesById'
                    ).and.callThrough();

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(getEditionSeriesByIdSpy, 0);
                });

                it('... should not trigger `EditionOutlineService.getEditionSectionById`', () => {
                    spyOn(EditionComplexesService, 'getEditionComplexById').and.returnValue(null);

                    const getEditionSectionByIdSpy = spyOn(
                        EditionOutlineService,
                        'getEditionSectionById'
                    ).and.callThrough();

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(getEditionSectionByIdSpy, 0);
                });

                it('... should not have updated selectedEditionComplex$ (via EditionStateService)', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionComplexSpy, 1);

                    spyOn(EditionComplexesService, 'getEditionComplexById').and.returnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionComplexSpy, 1);
                });

                it('... should not have updated selectedEditionSeries (via EditionStateService)', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSeriesSpy, 1);

                    spyOn(EditionComplexesService, 'getEditionComplexById').and.returnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSeriesSpy, 1);
                });

                it('... should not have updated selectedEditionSection (via EditionStateService)', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 1);

                    spyOn(EditionComplexesService, 'getEditionComplexById').and.returnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 1);
                });

                it('... should set selectedEditionComplex$ to EMPTY', () => {
                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                    spyOn(EditionComplexesService, 'getEditionComplexById').and.returnValue(null);

                    component.updateEditionComplexFromRoute();
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 2);

                    expect(component.selectedEditionComplex$).toBeDefined();
                    expectToEqual(component.selectedEditionComplex$, EMPTY);
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
                    spyOn(EditionComplexesService, 'getEditionComplexById').and.callFake((id: string) => {
                        if (id.toUpperCase() === expectedSelectedEditionComplexId.toUpperCase()) {
                            return missingTitleComplex;
                        }
                        return null;
                    });

                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(component.selectedEditionComplex$, EMPTY);
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
                    spyOn(EditionComplexesService, 'getEditionComplexById').and.callFake((id: string) => {
                        if (id.toUpperCase() === expectedSelectedEditionComplexId.toUpperCase()) {
                            return missingPubComplex;
                        }
                        return null;
                    });

                    // Apply changes
                    fixture.detectChanges();

                    expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                    expectToEqual(component.selectedEditionComplex$, EMPTY);
                });
            });
        });

        describe('#ngOnDestroy()', () => {
            it('... should have cleared selected edition complex on destroy (via EditionStateService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionStateServiceClearSelectedEditionComplexSpy, 1);
            });

            it('... should have cleared selected edition series on destroy (via EditionStateService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionStateServiceClearSelectedEditionSeriesSpy, 1);
            });

            it('... should have cleared selected edition section on destroy (via EditionStateService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionStateServiceClearSelectedEditionSectionSpy, 1);
            });
        });
    });
});
