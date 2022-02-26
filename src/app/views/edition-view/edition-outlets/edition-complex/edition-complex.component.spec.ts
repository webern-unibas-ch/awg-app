import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import Spy = jasmine.Spy;

import { expectSpyCall } from '@testing/expect-helper';
import { ActivatedRouteStub } from '@testing/router-stubs';

import { EditionWork, EditionWorks } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

import { EditionComplexComponent } from './edition-complex.component';

describe('EditionComplexComponent (DONE)', () => {
    let component: EditionComplexComponent;
    let fixture: ComponentFixture<EditionComplexComponent>;
    let compDe: DebugElement;

    let mockActivatedRoute: ActivatedRouteStub;
    let mockEditionService: Partial<EditionService>;

    let mockEditionComplexSubject: ReplaySubject<EditionWork>;

    let getEditionComplexFromRouteSpy: Spy;
    let editionServiceGetEditionWorkSpy: Spy;
    let editionServiceUpdateEditionWorkSpy: Spy;
    let editionServiceClearEditionWorkSpy: Spy;

    let expectedSelectedEditionComplex: EditionWork;
    let expectedSelectedEditionComplexId = 'OP12';

    beforeEach(async () => {
        mockEditionComplexSubject = new ReplaySubject<EditionWork>(1);

        // Mock edition service
        mockEditionService = {
            getEditionWork: (): Observable<EditionWork> => mockEditionComplexSubject.asObservable(),
            updateEditionWork: (editionWork: EditionWork): void => mockEditionComplexSubject.next(editionWork),
            clearEditionWork: (): void => mockEditionComplexSubject.next(null),
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

        expectedSelectedEditionComplex = EditionWorks.OP12;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getEditionComplexFromRouteSpy = spyOn(component, 'getEditionComplexFromRoute').and.callThrough();
        editionServiceGetEditionWorkSpy = spyOn(mockEditionService, 'getEditionWork').and.callThrough();
        editionServiceUpdateEditionWorkSpy = spyOn(mockEditionService, 'updateEditionWork').and.callThrough();
        editionServiceClearEditionWorkSpy = spyOn(mockEditionService, 'clearEditionWork').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have selectedEditionComplex$', () => {
            expect(component.selectedEditionComplex$).toBeUndefined();
        });

        describe('#getEditionComplexFromRoute', () => {
            it('... should not have been called', () => {
                expectSpyCall(getEditionComplexFromRouteSpy, 0);
            });

            it('... should not have called EditionService', () => {
                expectSpyCall(editionServiceGetEditionWorkSpy, 0);
                expectSpyCall(editionServiceUpdateEditionWorkSpy, 0);
            });

            it('... should not have set selectedEditionComplex$', () => {
                expect(component.selectedEditionComplex$).toBeUndefined();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set route params via ActivatedRoute mock
            expectedSelectedEditionComplexId = 'OP12';
            mockActivatedRoute.testParamMap = { compositionId: expectedSelectedEditionComplexId }; // Op. 12

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#getEditionComplexFromRoute', () => {
            it('... should have been called', () => {
                expectSpyCall(getEditionComplexFromRouteSpy, 1);
            });

            it('... should get id from router', () => {
                expectSpyCall(getEditionComplexFromRouteSpy, 1);

                expectSpyCall(editionServiceUpdateEditionWorkSpy, 1, EditionWorks[expectedSelectedEditionComplexId]);
            });

            it('... should get correct id from router', () => {
                // Call with op. 12 (default)
                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionWorkSpy, 1, EditionWorks.OP12);

                // ----------------
                // Change to op. 25
                mockActivatedRoute.testParamMap = { compositionId: 'OP25' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionWorkSpy, 2, EditionWorks.OP25);

                // ------------------
                // Change to non-existing id
                mockActivatedRoute.testParamMap = { compositionId: 'fail' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionWorkSpy, 3, EditionWorks['fail']);

                // ------------------
                // Change to empty id
                mockActivatedRoute.testParamMap = { compositionId: '' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionWorkSpy, 4, EditionWorks['']);

                // ----------------------
                // Change to another key
                mockActivatedRoute.testParamMap = { anotherId: 'OP12' };

                // Trigger initial data binding
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionWorkSpy, 5, EditionWorks['']);
            });

            it('... should have updated selectedEditionComplex$ (via EditionService)', () => {
                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionWorkSpy, 1, EditionWorks[expectedSelectedEditionComplexId]);
            });

            it('... should get edition complex from EditionService and set selectedEditionComplex$', () => {
                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionWorkSpy, 1, EditionWorks[expectedSelectedEditionComplexId]);
                expectSpyCall(editionServiceGetEditionWorkSpy, 1);

                expect(component.selectedEditionComplex$).toBeDefined();
            });

            it('... should get correct edition complex from EditionService when complex id changes', () => {
                // ----------------
                // Check for op. 12
                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionWorkSpy, 1, EditionWorks[expectedSelectedEditionComplexId]);
                expectSpyCall(editionServiceGetEditionWorkSpy, 1);

                // ----------------
                // Change to op. 25
                expectedSelectedEditionComplexId = 'OP25';
                mockActivatedRoute.testParamMap = { compositionId: expectedSelectedEditionComplexId };

                // Apply changes
                fixture.detectChanges();

                expectSpyCall(getEditionComplexFromRouteSpy, 1);
                expectSpyCall(editionServiceUpdateEditionWorkSpy, 2, EditionWorks[expectedSelectedEditionComplexId]);
                expectSpyCall(editionServiceGetEditionWorkSpy, 2);

                expect(component.selectedEditionComplex$).toBeDefined();
            });
        });

        describe('#ngOnDestroy', () => {
            it('... should have cleared selectedEditionComplex$ on destroy (via EditionService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionServiceClearEditionWorkSpy, 1);
            });
        });
    });
});
