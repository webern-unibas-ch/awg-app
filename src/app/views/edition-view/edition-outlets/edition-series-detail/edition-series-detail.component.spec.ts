import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
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
    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let updateSeriesFromRouteSpy: Spy;
    let editionOutlineServiceGetEditionSeriesByIdSpy: Spy;
    let editionStateServiceUpdateSelectedEditionSeriesSpy: Spy;

    let expectedSeries: EditionOutlineSeries;
    let expectedSeriesId: string;

    beforeEach(async () => {
        // Mocked activated route
        mockActivatedRoute = new ActivatedRouteStub();

        await TestBed.configureTestingModule({
            declarations: [EditionSeriesDetailComponent, RouterOutletStubComponent],
            providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        editionOutlineServiceGetEditionSeriesByIdSpy = vi
            .spyOn(editionOutlineService, 'getEditionSeriesById')
            .mockImplementation((seriesId: string) => {
                try {
                    return EditionStateHelper.getSeries(seriesId);
                } catch {
                    return null;
                }
            });
        editionStateServiceUpdateSelectedEditionSeriesSpy = vi.spyOn(
            editionStateService,
            'updateSelectedEditionSeries'
        );

        // Prototype spies (to catch calls in constructor)
        updateSeriesFromRouteSpy = vi.spyOn(EditionSeriesDetailComponent.prototype, 'updateSeriesFromRoute');

        // Test data
        expectedSeries = EditionStateHelper.getSeries('1');
        expectedSeriesId = expectedSeries.series.route;

        // Create component fixture
        fixture = TestBed.createComponent(EditionSeriesDetailComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have triggered method `updateSeriesFromRoute`', () => {
            expectSpyCall(updateSeriesFromRouteSpy, 1);
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('seriesId', expectedSeriesId);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });
        });

        describe('#updateSeriesFromRoute()', () => {
            beforeEach(() => {
                // Reset spy calls
                editionOutlineServiceGetEditionSeriesByIdSpy.mockClear();
                editionStateServiceUpdateSelectedEditionSeriesSpy.mockClear();
            });

            it('... should have a method `updateSeriesFromRoute`', () => {
                expect(component.updateSeriesFromRoute).toBeDefined();
            });

            it('... should call EditionOutlineService.getEditionSeriesById', () => {
                const newSeriesId = 'another-series-id';
                fixture.componentRef.setInput('seriesId', newSeriesId);

                fixture.detectChanges();

                expectSpyCall(editionOutlineServiceGetEditionSeriesByIdSpy, 1, newSeriesId);
            });

            it('... should update the selected edition series in the state service', () => {
                const newSeries = EditionStateHelper.getSeries('2');
                const newSeriesId = newSeries.series.route;
                fixture.componentRef.setInput('seriesId', newSeriesId);

                fixture.detectChanges();

                // 2 calls because of onCleanup
                expectSpyCall(editionStateServiceUpdateSelectedEditionSeriesSpy, 2, newSeries);
            });

            describe('... should update selected series to null', () => {
                it('... if param `id` is missing', () => {
                    fixture.componentRef.setInput('seriesId', null);

                    fixture.detectChanges();

                    expectSpyCall(editionOutlineServiceGetEditionSeriesByIdSpy, 0);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSeriesSpy, 2, null);
                });

                it('... if series is missing (undefined)', () => {
                    fixture.componentRef.setInput('seriesId', 'invalid-id');

                    fixture.detectChanges();

                    expectSpyCall(editionOutlineServiceGetEditionSeriesByIdSpy, 1, 'invalid-id');
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSeriesSpy, 2, null);
                });

                it('... on cleanup', () => {
                    fixture.destroy();

                    expectSpyCall(editionStateServiceUpdateSelectedEditionSeriesSpy, 1, null);
                });
            });
        });
    });
});
