import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { ActivatedRouteStub, RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionService } from '@awg-views/edition-view/services';

import { EditionSectionDetailComponent } from './edition-section-detail.component';

describe('EditionSectionDetailComponent (DONE)', () => {
    let component: EditionSectionDetailComponent;
    let fixture: ComponentFixture<EditionSectionDetailComponent>;
    let compDe: DebugElement;

    let mockActivatedRoute: ActivatedRouteStub;
    let mockEditionService: Partial<EditionService>;

    let updateSectionFromRouteSpy: Spy;
    let editionServiceGetSelectedEditionSeriesSpy: Spy;
    let editionOutlineServiceGetEditionSectionByIdSpy: Spy;
    let editionServiceUpdateSelectedEditionSectionSpy: Spy;

    let expectedSelectedSeries: EditionOutlineSeries;
    let expectedSelectedSection: EditionOutlineSection;
    let expectedSeriesId: string;
    let expectedSectionId: string;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        // Mock edition service
        mockEditionService = {
            getSelectedEditionSeries: (): Observable<EditionOutlineSeries> => observableOf(expectedSelectedSeries),
            updateSelectedEditionSection: (editionSection: EditionOutlineSection): void => {},
        };

        // Mocked activated route
        mockActivatedRoute = new ActivatedRouteStub();

        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailComponent, RouterOutletStubComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: EditionService, useValue: mockEditionService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSectionDetailComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // TestData
        expectedSelectedSeries = EditionOutlineService.getEditionOutline()[0];
        expectedSelectedSection = expectedSelectedSeries.sections[4];
        expectedSeriesId = expectedSelectedSeries.series.route;
        expectedSectionId = expectedSelectedSection.section.route;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        updateSectionFromRouteSpy = spyOn(component, 'updateSectionFromRoute').and.callThrough();
        editionServiceGetSelectedEditionSeriesSpy = spyOn(
            mockEditionService,
            'getSelectedEditionSeries'
        ).and.callThrough();
        editionServiceUpdateSelectedEditionSectionSpy = spyOn(
            mockEditionService,
            'updateSelectedEditionSection'
        ).and.callThrough();
        editionOutlineServiceGetEditionSectionByIdSpy = spyOn(
            EditionOutlineService,
            'getEditionSectionById'
        ).and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        describe('#updateSectionFromRoute()', () => {
            it('... should have a method `updateSectionFromRoute`', () => {
                expect(component.updateSectionFromRoute).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(updateSectionFromRouteSpy, 0);
            });
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

        describe('#updateSectionFromRoute()', () => {
            it('... should have been called', () => {
                expectSpyCall(updateSectionFromRouteSpy, 1);
            });

            it('... should have called editionService.getSelectedEditionSeries', () => {
                expectSpyCall(editionServiceGetSelectedEditionSeriesSpy, 1);
            });

            it('... should have called EditionOutlineService.getEditionSectionById', () => {
                expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 1, [expectedSeriesId, expectedSectionId]);
            });

            it('... should have called editionService.updateSelectedEditionSection with selectedSection', () => {
                expectSpyCall(editionServiceUpdateSelectedEditionSectionSpy, 1, expectedSelectedSection);
            });
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });
        });
    });
});
