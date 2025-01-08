import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { ActivatedRouteStub, RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionSectionDetailComponent } from './edition-section-detail.component';

describe('EditionSectionDetailComponent (DONE)', () => {
    let component: EditionSectionDetailComponent;
    let fixture: ComponentFixture<EditionSectionDetailComponent>;
    let compDe: DebugElement;

    let mockActivatedRoute: ActivatedRouteStub;
    let mockEditionStateService: Partial<EditionStateService>;

    let updateSectionFromRouteSpy: Spy;
    let editionOutlineServiceGetEditionSectionByIdSpy: Spy;
    let editionStateServiceGetSelectedEditionSeriesSpy: Spy;
    let editionStateServiceUpdateSelectedEditionSectionSpy: Spy;

    let expectedSelectedSeries: EditionOutlineSeries;
    let expectedSelectedSection: EditionOutlineSection;
    let expectedSeriesId: string;
    let expectedSectionId: string;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        // Mock edition state service
        mockEditionStateService = {
            getSelectedEditionSeries: (): Observable<EditionOutlineSeries> => observableOf(expectedSelectedSeries),
            updateSelectedEditionSection: (): void => {},
        };

        // Mocked activated route
        mockActivatedRoute = new ActivatedRouteStub();

        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailComponent, RouterOutletStubComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: EditionStateService, useValue: mockEditionStateService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSectionDetailComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSelectedSeries = EditionOutlineService.getEditionOutline()[0];
        expectedSelectedSection = expectedSelectedSeries.sections[4];
        expectedSeriesId = expectedSelectedSeries.series.route;
        expectedSectionId = expectedSelectedSection.section.route;

        // Spies
        updateSectionFromRouteSpy = spyOn(component, 'updateSectionFromRoute').and.callThrough();
        editionOutlineServiceGetEditionSectionByIdSpy = spyOn(
            EditionOutlineService,
            'getEditionSectionById'
        ).and.callThrough();
        editionStateServiceGetSelectedEditionSeriesSpy = spyOn(
            mockEditionStateService,
            'getSelectedEditionSeries'
        ).and.callThrough();
        editionStateServiceUpdateSelectedEditionSectionSpy = spyOn(
            mockEditionStateService,
            'updateSelectedEditionSection'
        ).and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have called `updateSectionFromRoute` method', () => {
            expectSpyCall(updateSectionFromRouteSpy, 0);
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set route params via ActivatedRoute mock
            mockActivatedRoute.testParamMap = { id: expectedSectionId };

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `updateSectionFromRoute` method', () => {
            expectSpyCall(updateSectionFromRouteSpy, 1);
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });
        });

        describe('#updateSectionFromRoute()', () => {
            it('... should have a method `updateSectionFromRoute`', () => {
                expect(component.updateSectionFromRoute).toBeDefined();
            });

            it('... should call editionStateService.getSelectedEditionSeries', () => {
                expectSpyCall(editionStateServiceGetSelectedEditionSeriesSpy, 1);

                component.updateSectionFromRoute();

                expectSpyCall(editionStateServiceGetSelectedEditionSeriesSpy, 2);
            });

            it('... should call EditionOutlineService.getEditionSectionById', () => {
                expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 1, [expectedSeriesId, expectedSectionId]);

                component.updateSectionFromRoute();

                expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 2, [expectedSeriesId, expectedSectionId]);
            });

            it('... should call editionStateService.updateSelectedEditionSection with selectedSection', () => {
                expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 1, expectedSelectedSection);

                component.updateSectionFromRoute();

                expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 2, expectedSelectedSection);
            });
        });
    });
});
