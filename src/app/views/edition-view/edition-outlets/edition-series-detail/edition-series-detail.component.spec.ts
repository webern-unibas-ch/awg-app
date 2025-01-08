import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { ActivatedRouteStub, RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionSeriesDetailComponent } from './edition-series-detail.component';

describe('EditionSeriesDetailComponent (DONE)', () => {
    let component: EditionSeriesDetailComponent;
    let fixture: ComponentFixture<EditionSeriesDetailComponent>;
    let compDe: DebugElement;

    let mockActivatedRoute: ActivatedRouteStub;
    let mockEditionStateService: Partial<EditionStateService>;

    let updateSeriesFromRouteSpy: Spy;
    let editionOutlineServiceGetEditionSeriesByIdSpy: Spy;
    let editionStateServiceUpdateSelectedEditionSeriesSpy: Spy;

    let expectedSelectedSeries: EditionOutlineSeries;
    let expectedSeriesId: string;

    beforeAll(() => {
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        // Mock edition state service
        mockEditionStateService = {
            updateSelectedEditionSeries: (): void => {},
        };

        // Mocked activated route
        mockActivatedRoute = new ActivatedRouteStub();

        await TestBed.configureTestingModule({
            declarations: [EditionSeriesDetailComponent, RouterOutletStubComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: EditionStateService, useValue: mockEditionStateService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSeriesDetailComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSelectedSeries = EditionOutlineService.getEditionOutline()[0];
        expectedSeriesId = expectedSelectedSeries.series.route;

        // Spies
        updateSeriesFromRouteSpy = spyOn(component, 'updateSeriesFromRoute').and.callThrough();
        editionOutlineServiceGetEditionSeriesByIdSpy = spyOn(
            EditionOutlineService,
            'getEditionSeriesById'
        ).and.callThrough();
        editionStateServiceUpdateSelectedEditionSeriesSpy = spyOn(
            mockEditionStateService,
            'updateSelectedEditionSeries'
        ).and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have called `updateSeriesFromRoute` method', () => {
            expectSpyCall(updateSeriesFromRouteSpy, 0);
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
            mockActivatedRoute.testParamMap = { id: expectedSeriesId };

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `updateSeriesFromRoute` method', () => {
            expectSpyCall(updateSeriesFromRouteSpy, 1);
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });
        });

        describe('#updateSeriesFromRoute()', () => {
            it('... should have a method `updateSeriesFromRoute`', () => {
                expect(component.updateSeriesFromRoute).toBeDefined();
            });

            it('... should call EditionOutlineService.getEditionSeriesById', () => {
                expectSpyCall(editionOutlineServiceGetEditionSeriesByIdSpy, 1, expectedSeriesId);

                component.updateSeriesFromRoute();

                expectSpyCall(editionOutlineServiceGetEditionSeriesByIdSpy, 2, expectedSeriesId);
            });

            it('... should call editionStateService.updateSelectedEditionSeries with selectedSeries', () => {
                expectSpyCall(editionStateServiceUpdateSelectedEditionSeriesSpy, 1, expectedSelectedSeries);

                component.updateSeriesFromRoute();

                expectSpyCall(editionStateServiceUpdateSelectedEditionSeriesSpy, 2, expectedSelectedSeries);
            });
        });
    });
});
