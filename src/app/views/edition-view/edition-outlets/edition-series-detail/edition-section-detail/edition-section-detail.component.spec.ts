import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';

import { ActivatedRouteStub } from '@testing/router-stubs';

import { EditionRoute, EditionSeriesRoute } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

import { EditionSectionDetailComponent } from './edition-section-detail.component';

describe('EditionSectionDetailComponent', () => {
    let component: EditionSectionDetailComponent;
    let fixture: ComponentFixture<EditionSectionDetailComponent>;
    let compDe: DebugElement;

    let mockEditionService: Partial<EditionService>;

    let expectedEditionSeries: EditionSeriesRoute;

    beforeEach(async () => {
        // Mock edition service
        mockEditionService = {
            getSelectedEditionSeries: (): Observable<EditionSeriesRoute> => observableOf(expectedEditionSeries),

            getEditionSectionById: (seriesId: string, sectionId: string): EditionRoute =>
                expectedEditionSeries.sections[0].section,
            updateSelectedEditionSection: (editionSection: EditionRoute): void => {},
        };

        // Mocked activated route
        const mockActivatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailComponent],
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

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
