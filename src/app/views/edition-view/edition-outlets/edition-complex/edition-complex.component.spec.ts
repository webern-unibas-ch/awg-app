import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Observable, ReplaySubject } from 'rxjs';
import Spy = jasmine.Spy;

import { expectSpyCall, expectToEqual } from '@testing/expect-helper';
import { ActivatedRouteStub } from '@testing/router-stubs';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
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

    let updateEditionComplexFromRouteSpy: Spy;
    let editionServiceGetSelectedEditionComplexSpy: Spy;
    let editionServiceUpdateSelectedEditionComplexSpy: Spy;
    let editionServiceClearSelectedEditionComplexSpy: Spy;

    let expectedEditionComplexes: typeof EDITION_COMPLEXES;
    let expectedSelectedEditionComplex: EditionComplex;
    let expectedSelectedEditionComplexId: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeEach(async () => {
        mockEditionComplexSubject = new ReplaySubject<EditionComplex>(1);

        // Mock edition service
        mockEditionService = {
            getSelectedEditionComplex: (): Observable<EditionComplex> => mockEditionComplexSubject.asObservable(),
            updateSelectedEditionComplex: (editionComplex: EditionComplex): void =>
                mockEditionComplexSubject.next(editionComplex),
            clearSelectedEditionComplex: (): void => mockEditionComplexSubject.next(null),
        };

        // Mocked activated route
        mockActivatedRoute = new ActivatedRouteStub();

        await TestBed.configureTestingModule({
            imports: [RouterModule],
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
        updateEditionComplexFromRouteSpy = spyOn(component, 'updateEditionComplexFromRoute').and.callThrough();
        editionServiceGetSelectedEditionComplexSpy = spyOn(
            mockEditionService,
            'getSelectedEditionComplex'
        ).and.callThrough();
        editionServiceUpdateSelectedEditionComplexSpy = spyOn(
            mockEditionService,
            'updateSelectedEditionComplex'
        ).and.callThrough();
        editionServiceClearSelectedEditionComplexSpy = spyOn(
            mockEditionService,
            'clearSelectedEditionComplex'
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

        describe('#updateEditionComplexFromRoute()', () => {
            it('... should have been called', () => {
                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
            });

            it('... should get id from router', () => {
                expectSpyCall(updateEditionComplexFromRouteSpy, 1);

                expectSpyCall(
                    editionServiceUpdateSelectedEditionComplexSpy,
                    1,
                    expectedEditionComplexes[expectedSelectedEditionComplexId]
                );
            });

            it('... should get correct id from router', () => {
                // Call with op. 12 (default)
                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateSelectedEditionComplexSpy, 1, expectedEditionComplexes.OP12);

                // ----------------
                // Change to op. 25
                mockActivatedRoute.testParamMap = { complexId: 'OP25' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateSelectedEditionComplexSpy, 2, expectedEditionComplexes.OP25);

                // ------------------
                // Change to non-existing id
                mockActivatedRoute.testParamMap = { complexId: 'fail' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateSelectedEditionComplexSpy, 3, expectedEditionComplexes['fail']);

                // ------------------
                // Change to empty id
                mockActivatedRoute.testParamMap = { complexId: '' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateSelectedEditionComplexSpy, 4, expectedEditionComplexes['']);

                // ----------------------
                // Change to another key
                mockActivatedRoute.testParamMap = { anotherId: 'OP12' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateSelectedEditionComplexSpy, 5, expectedEditionComplexes['']);
            });

            it('... should have updated selectedEditionComplex$ (via EditionService)', () => {
                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionServiceUpdateSelectedEditionComplexSpy,
                    1,
                    expectedEditionComplexes[expectedSelectedEditionComplexId]
                );
            });

            it('... should get edition complex from EditionService and set selectedEditionComplex$', () => {
                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionServiceUpdateSelectedEditionComplexSpy,
                    1,
                    expectedEditionComplexes[expectedSelectedEditionComplexId]
                );
                expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 1);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get correct edition complex from EditionService when complex id changes', () => {
                // ----------------
                // Check for op. 12
                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionServiceUpdateSelectedEditionComplexSpy,
                    1,
                    expectedEditionComplexes[expectedSelectedEditionComplexId]
                );
                expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 1);

                // ----------------
                // Change to op. 25
                expectedSelectedEditionComplexId = 'op25';
                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(
                    editionServiceUpdateSelectedEditionComplexSpy,
                    2,
                    expectedEditionComplexes[expectedSelectedEditionComplexId]
                );
                expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get an edition complex with opus number from EditionService', () => {
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
                expectedEditionComplexes[expectedSelectedEditionComplexId.toUpperCase()] = opusComplex;

                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                editionServiceUpdateSelectedEditionComplexSpy.and.callThrough();

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateSelectedEditionComplexSpy, 2, opusComplex);
                expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get an edition complex with M number from EditionService', () => {
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
                expectedEditionComplexes[expectedSelectedEditionComplexId.toUpperCase()] = mnrComplex;

                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                editionServiceUpdateSelectedEditionComplexSpy.and.callThrough();

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateSelectedEditionComplexSpy, 2, mnrComplex);
                expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get an edition complex with M* number from EditionService', () => {
                const mnrPlusComplex = new EditionComplex(
                    {
                        title: 'Test M* Complex',
                        catalogueType: 'MNR_PLUS',
                        catalogueNumber: '100',
                    },
                    {
                        editors: [],
                        lastModified: '---',
                    },
                    { series: '1', section: '5' }
                );
                expectedSelectedEditionComplexId = 'mPlus100';
                expectedEditionComplexes[expectedSelectedEditionComplexId.toUpperCase()] = mnrPlusComplex;

                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                editionServiceUpdateSelectedEditionComplexSpy.and.callThrough();

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateSelectedEditionComplexSpy, 2, mnrPlusComplex);
                expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get an edition complex with missing values from EditionService', () => {
                const incompleteComplex = new EditionComplex(
                    {
                        title: 'Test Incomplete Complex',
                        catalogueType: 'OPUS',
                        catalogueNumber: '100',
                    },
                    null,
                    null
                );
                expectedSelectedEditionComplexId = 'op100';
                expectedEditionComplexes[expectedSelectedEditionComplexId.toUpperCase()] = incompleteComplex;

                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                editionServiceUpdateSelectedEditionComplexSpy.and.callThrough();

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateSelectedEditionComplexSpy, 2, incompleteComplex);
                expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get an edition complex with missing titleStatement from EditionService', () => {
                const incompleteComplex = new EditionComplex(
                    null,
                    {
                        editors: [],
                        lastModified: '---',
                    },
                    { series: '1', section: '5' }
                );
                expectedSelectedEditionComplexId = 'op100';
                expectedEditionComplexes[expectedSelectedEditionComplexId.toUpperCase()] = incompleteComplex;

                mockActivatedRoute.testParamMap = { complexId: expectedSelectedEditionComplexId };
                editionServiceUpdateSelectedEditionComplexSpy.and.callThrough();

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateSelectedEditionComplexSpy, 2, incompleteComplex);
                expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });
        });

        describe('#ngOnDestroy()', () => {
            it('... should have cleared selectedEditionComplex$ on destroy (via EditionService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionServiceClearSelectedEditionComplexSpy, 1);
            });
        });
    });
});
