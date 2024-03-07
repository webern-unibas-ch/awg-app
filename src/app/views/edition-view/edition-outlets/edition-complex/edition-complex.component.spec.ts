import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, ReplaySubject } from 'rxjs';
import Spy = jasmine.Spy;

import { expectSpyCall } from '@testing/expect-helper';
import { ActivatedRouteStub } from '@testing/router-stubs';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import {
    EDITION_CATALOGUE_TYPE_CONSTANTS,
    EDITION_ROUTE_CONSTANTS,
    EDITION_TYPE_CONSTANTS,
} from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

import { EditionComplexComponent } from './edition-complex.component';

describe('EditionComplexComponent (DONE)', () => {
    let component: EditionComplexComponent;
    let fixture: ComponentFixture<EditionComplexComponent>;
    let compDe: DebugElement;

    let mockActivatedRoute: ActivatedRouteStub;
    let mockEditionService: Partial<EditionService>;

    let mockEditionComplexSubject: ReplaySubject<EditionComplex>;

    let getEditionComplexFromRouteSpy: Spy;
    let editionServiceGetEditionComplexSpy: Spy;
    let editionServiceUpdateEditionComplexSpy: Spy;
    let editionServiceClearEditionComplexSpy: Spy;

    let expectedEditionComplexes: typeof EDITION_COMPLEXES;
    let expectedSelectedEditionComplex: EditionComplex;
    let expectedSelectedEditionComplexId: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeEach(async () => {
        mockEditionComplexSubject = new ReplaySubject<EditionComplex>(1);

        // Mock edition service
        mockEditionService = {
            getEditionComplex: (): Observable<EditionComplex> => mockEditionComplexSubject.asObservable(),
            updateEditionComplex: (editionComplex: EditionComplex): void =>
                mockEditionComplexSubject.next(editionComplex),
            clearEditionComplex: (): void => mockEditionComplexSubject.next(null),
        };

        // Mocked activated route
        mockActivatedRoute = new ActivatedRouteStub();

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [EditionComplexComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: EditionService, useValue: mockEditionService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionComplexComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // TestData
        expectedEditionComplexes = EDITION_COMPLEXES;
        expectedSelectedEditionComplex = expectedEditionComplexes.OP12;
        expectedSelectedEditionComplexId = 'OP12';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getEditionComplexFromRouteSpy = spyOn(component, 'getEditionComplexFromRoute').and.callThrough();
        editionServiceGetEditionComplexSpy = spyOn(mockEditionService, 'getEditionComplex').and.callThrough();
        editionServiceUpdateEditionComplexSpy = spyOn(mockEditionService, 'updateEditionComplex').and.callThrough();
        editionServiceClearEditionComplexSpy = spyOn(mockEditionService, 'clearEditionComplex').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `selectedEditionComplex$`', () => {
            expect(component.selectedEditionComplex$).toBeUndefined();
        });

        it('... should have `editionRouteConstants`', () => {
            expect(component.editionRouteConstants).toBeDefined();
            expect(component.editionRouteConstants)
                .withContext(`should be ${expectedEditionRouteConstants}`)
                .toBe(expectedEditionRouteConstants);
        });

        describe('#getEditionComplexFromRoute()', () => {
            it('... should have a method `getEditionComplexFromRoute`', () => {
                expect(component.getEditionComplexFromRoute).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(getEditionComplexFromRouteSpy, 0);
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

        describe('#getEditionComplexFromRoute()', () => {
            it('... should have been called', () => {
                expectSpyCall(getEditionComplexFromRouteSpy, 1);
            });

            it('... should get id from router', () => {
                expectSpyCall(getEditionComplexFromRouteSpy, 1);

                expectSpyCall(
                    editionServiceUpdateEditionComplexSpy,
                    1,
                    expectedEditionComplexes[expectedSelectedEditionComplexId]
                );
            });

            it('... should get correct id from router', () => {
                // Call with op. 12 (default)
                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionComplexSpy, 1, expectedEditionComplexes.OP12);

                // ----------------
                // Change to op. 25
                mockActivatedRoute.testParamMap = { complexId: 'OP25' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionComplexSpy, 2, expectedEditionComplexes.OP25);

                // ------------------
                // Change to non-existing id
                mockActivatedRoute.testParamMap = { complexId: 'fail' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionComplexSpy, 3, expectedEditionComplexes['fail']);

                // ------------------
                // Change to empty id
                mockActivatedRoute.testParamMap = { complexId: '' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionComplexSpy, 4, expectedEditionComplexes['']);

                // ----------------------
                // Change to another key
                mockActivatedRoute.testParamMap = { anotherId: 'OP12' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionComplexSpy, 5, expectedEditionComplexes['']);
            });

            it('... should have updated selectedEditionComplex$ (via EditionService)', () => {
                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionServiceUpdateEditionComplexSpy,
                    1,
                    expectedEditionComplexes[expectedSelectedEditionComplexId]
                );
            });

            it('... should get edition complex from EditionService and set selectedEditionComplex$', () => {
                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionServiceUpdateEditionComplexSpy,
                    1,
                    expectedEditionComplexes[expectedSelectedEditionComplexId]
                );
                expectSpyCall(editionServiceGetEditionComplexSpy, 1);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get correct edition complex from EditionService when complex id changes', () => {
                // ----------------
                // Check for op. 12
                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionServiceUpdateEditionComplexSpy,
                    1,
                    expectedEditionComplexes[expectedSelectedEditionComplexId]
                );
                expectSpyCall(editionServiceGetEditionComplexSpy, 1);

                // ----------------
                // Change to op. 25
                expectedSelectedEditionComplexId = 'op25';
                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionServiceUpdateEditionComplexSpy,
                    2,
                    expectedEditionComplexes[expectedSelectedEditionComplexId]
                );
                expectSpyCall(editionServiceGetEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get an edition complex with opus number from EditionService', () => {
                const opusComplex = new EditionComplex(
                    {
                        title: 'Test Opus Complex',
                        catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
                        catalogueNumber: '100',
                    },
                    {
                        editors: [],
                        lastModified: '---',
                    },
                    EDITION_ROUTE_CONSTANTS.SERIES_1,
                    EDITION_ROUTE_CONSTANTS.SECTION_5,
                    EDITION_TYPE_CONSTANTS.SKETCH_EDITION
                );
                expectedSelectedEditionComplexId = 'op100';
                expectedEditionComplexes[expectedSelectedEditionComplexId.toUpperCase()] = opusComplex;

                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                editionServiceUpdateEditionComplexSpy.and.callThrough();

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionComplexSpy, 2, opusComplex);
                expectSpyCall(editionServiceGetEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get an edition complex with M number from EditionService', () => {
                const mnrComplex = new EditionComplex(
                    {
                        title: 'Test M Complex',
                        catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR,
                        catalogueNumber: '100',
                    },
                    {
                        editors: [],
                        lastModified: '---',
                    },
                    EDITION_ROUTE_CONSTANTS.SERIES_1,
                    EDITION_ROUTE_CONSTANTS.SECTION_5,
                    EDITION_TYPE_CONSTANTS.SKETCH_EDITION
                );
                expectedSelectedEditionComplexId = 'm100';
                expectedEditionComplexes[expectedSelectedEditionComplexId.toUpperCase()] = mnrComplex;

                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                editionServiceUpdateEditionComplexSpy.and.callThrough();

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionComplexSpy, 2, mnrComplex);
                expectSpyCall(editionServiceGetEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get an edition complex with M* number from EditionService', () => {
                const mnrPlusComplex = new EditionComplex(
                    {
                        title: 'Test M* Complex',
                        catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR_PLUS,
                        catalogueNumber: '100',
                    },
                    {
                        editors: [],
                        lastModified: '---',
                    },
                    EDITION_ROUTE_CONSTANTS.SERIES_1,
                    EDITION_ROUTE_CONSTANTS.SECTION_5,
                    EDITION_TYPE_CONSTANTS.SKETCH_EDITION
                );
                expectedSelectedEditionComplexId = 'mPlus100';
                expectedEditionComplexes[expectedSelectedEditionComplexId.toUpperCase()] = mnrPlusComplex;

                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                editionServiceUpdateEditionComplexSpy.and.callThrough();

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionComplexSpy, 2, mnrPlusComplex);
                expectSpyCall(editionServiceGetEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get an edition complex with missing values from EditionService', () => {
                const incompleteComplex = new EditionComplex(
                    {
                        title: 'Test Incomplete Complex',
                        catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
                        catalogueNumber: '100',
                    },
                    null,
                    null,
                    null,
                    null
                );
                expectedSelectedEditionComplexId = 'op100';
                expectedEditionComplexes[expectedSelectedEditionComplexId.toUpperCase()] = incompleteComplex;

                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                editionServiceUpdateEditionComplexSpy.and.callThrough();

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionComplexSpy, 2, incompleteComplex);
                expectSpyCall(editionServiceGetEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get an edition complex with missing titleStatement from EditionService', () => {
                const incompleteComplex = new EditionComplex(
                    null,
                    {
                        editors: [],
                        lastModified: '---',
                    },
                    EDITION_ROUTE_CONSTANTS.SERIES_1,
                    EDITION_ROUTE_CONSTANTS.SECTION_5,
                    EDITION_TYPE_CONSTANTS.SKETCH_EDITION
                );
                expectedSelectedEditionComplexId = 'op100';
                expectedEditionComplexes[expectedSelectedEditionComplexId.toUpperCase()] = incompleteComplex;

                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                editionServiceUpdateEditionComplexSpy.and.callThrough();

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionComplexSpy, 2, incompleteComplex);
                expectSpyCall(editionServiceGetEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });
        });

        describe('#ngOnDestroy()', () => {
            it('... should have cleared selectedEditionComplex$ on destroy (via EditionService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionServiceClearEditionComplexSpy, 1);
            });
        });
    });
});
