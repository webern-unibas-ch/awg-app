import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionSectionDetailComponent } from './edition-section-detail.component';

describe('EditionSectionDetailComponent (DONE)', () => {
    let component: EditionSectionDetailComponent;
    let fixture: ComponentFixture<EditionSectionDetailComponent>;
    let compDe: DebugElement;

    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let updateSectionFromRouteSpy: Spy;
    let editionOutlineServiceGetEditionSectionByIdSpy: Spy;
    let editionStateServiceUpdateSelectedEditionSectionSpy: Spy;

    let expectedSeries: EditionOutlineSeries;
    let expectedSection: EditionOutlineSection;
    let expectedSeriesId: string;
    let expectedSectionId: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailComponent, RouterOutletStubComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        editionOutlineServiceGetEditionSectionByIdSpy = vi
            .spyOn(editionOutlineService, 'getEditionSectionById')
            .mockImplementation((seriesId: string, sectionId: string) => {
                try {
                    return EditionStateHelper.getSection(seriesId, sectionId);
                } catch {
                    return null;
                }
            });
        editionStateServiceUpdateSelectedEditionSectionSpy = vi.spyOn(
            editionStateService,
            'updateSelectedEditionSection'
        );

        // Prototype spies (to catch calls in constructor)
        updateSectionFromRouteSpy = vi.spyOn(EditionSectionDetailComponent.prototype, 'updateSectionFromRoute');

        // Test data
        expectedSeries = EditionStateHelper.getSeries('1');
        expectedSection = EditionStateHelper.getSection('1', '5');
        expectedSeriesId = expectedSeries.series.route;
        expectedSectionId = expectedSection.section.route;

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionDetailComponent);
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
        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.sectionId), true);

            expectToBe(component.sectionId(), null);
        });

        it('... should have called `updateSectionFromRoute` method', () => {
            expectSpyCall(updateSectionFromRouteSpy, 1);
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
            fixture.componentRef.setInput('sectionId', expectedSectionId);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedEditionComplex` to hold the expected id', () => {
            expectToBe(isSignal(component.sectionId), true);

            expectToBe(component.sectionId(), expectedSectionId);
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
            beforeEach(() => {
                // Reset spy calls
                editionOutlineServiceGetEditionSectionByIdSpy.mockClear();
                editionStateServiceUpdateSelectedEditionSectionSpy.mockClear();
            });

            it('... should have a method `updateSectionFromRoute`', () => {
                expect(component.updateSectionFromRoute).toBeDefined();
            });

            it('... should do nothing if no series is selected', () => {
                expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 0);
                expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 0);

                editionStateService.updateSelectedEditionSeries(null); // Triggers one call to section update with null

                fixture.detectChanges();

                expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 0);
                expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 1, null);
            });

            it('... should call EditionOutlineService.getEditionSectionById', () => {
                editionStateService.updateSelectedEditionSeries(expectedSeries);

                fixture.detectChanges();

                expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 1, [expectedSeriesId, expectedSectionId]);
            });

            it('... should update the selected edition section in the state service', () => {
                editionStateService.updateSelectedEditionSeries(expectedSeries);

                fixture.detectChanges();

                expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 2, expectedSection);
            });

            describe('... should update selected section to null', () => {
                it('... if `series.series.route` is missing', () => {
                    const mockSeriesWithRoute = {
                        series: {
                            short: 'series-1',
                            route: undefined,
                        },
                        sections: [],
                    } as EditionOutlineSeries;

                    editionStateService.updateSelectedEditionSeries(mockSeriesWithRoute);

                    fixture.detectChanges();

                    expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 0);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 2, null);
                });

                it('... if section is missing (undefined)', () => {
                    const mockSeries = { series: { route: 'series-1' }, sections: [] } as EditionOutlineSeries;
                    editionStateService.updateSelectedEditionSeries(mockSeries);
                    fixture.componentRef.setInput('sectionId', 'sec-999');

                    fixture.detectChanges();

                    expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 1, ['series-1', 'sec-999']);
                    expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 2, null);
                });

                it('... on cleanup', () => {
                    editionStateService.updateSelectedEditionSeries(expectedSeries);

                    fixture.destroy();

                    expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 1, null);
                });
            });
        });
    });
});
