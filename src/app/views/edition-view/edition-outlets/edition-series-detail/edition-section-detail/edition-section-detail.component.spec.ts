import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionSectionDetailComponent } from './edition-section-detail.component';

describe('EditionSectionDetailComponent (DONE)', () => {
    let component: EditionSectionDetailComponent;
    let fixture: ComponentFixture<EditionSectionDetailComponent>;
    let compDe: DebugElement;

    let editionComplexesService: EditionComplexesService;
    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let updateSectionFromRouteSpy: Spy;
    let editionOutlineServiceGetEditionSectionByIdSpy: Spy;
    let editionStateServiceUpdateSelectedEditionSectionSpy: Spy;

    let expectedSelectedSeries: EditionOutlineSeries;
    let expectedSelectedSection: EditionOutlineSection;
    let expectedSeriesId: string;
    let expectedSectionId: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailComponent, RouterOutletStubComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionComplexesService = TestBed.inject(EditionComplexesService);
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);

        // Init edition data
        editionComplexesService.initializeEditionComplexesList();
        editionOutlineService.initializeEditionOutline();

        // Service spies
        editionOutlineServiceGetEditionSectionByIdSpy = vi.spyOn(editionOutlineService, 'getEditionSectionById');
        editionStateServiceUpdateSelectedEditionSectionSpy = vi.spyOn(
            editionStateService,
            'updateSelectedEditionSection'
        );

        // Prototype spies (to catch calls in constructor)
        updateSectionFromRouteSpy = vi.spyOn(EditionSectionDetailComponent.prototype, 'updateSectionFromRoute');

        // Test data
        expectedSelectedSeries = editionOutlineService.editionOutline()[0];
        expectedSelectedSection = expectedSelectedSeries.sections[4];
        expectedSeriesId = expectedSelectedSeries.series.route;
        expectedSectionId = expectedSelectedSection.section.route;

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionDetailComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        updateSectionFromRouteSpy = vi.spyOn(component, 'updateSectionFromRoute');
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
            it('... should have a method `updateSectionFromRoute`', () => {
                expect(component.updateSectionFromRoute).toBeDefined();
            });

            it('... should do nothing if no series is selected', async () => {
                expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 0);
                expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 0);

                editionStateService.updateSelectedEditionSeries(null); // Triggers one call to section update with null

                await fixture.whenStable();

                expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 0);
                expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 1, null);
            });

            it('... should call EditionOutlineService.getEditionSectionById via internal effect', async () => {
                editionStateService.updateSelectedEditionSeries(expectedSelectedSeries);

                await fixture.whenStable();

                expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 1, [expectedSeriesId, expectedSectionId]);
            });

            it('... should update the selected edition section in the state service via internal effect', async () => {
                editionStateService.updateSelectedEditionSeries(expectedSelectedSeries);

                await fixture.whenStable();

                expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 2, expectedSelectedSection);
            });
        });
    });
});
