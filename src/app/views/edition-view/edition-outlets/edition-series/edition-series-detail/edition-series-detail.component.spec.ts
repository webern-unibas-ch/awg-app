import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ActivatedRouteStub } from '@testing/router-stubs';

import { EditionSeriesRoutes } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

import { EditionSeriesDetailComponent } from './edition-series-detail.component';

describe('EditionSeriesDetailComponent', () => {
    let component: EditionSeriesDetailComponent;
    let fixture: ComponentFixture<EditionSeriesDetailComponent>;
    let compDe: DebugElement;

    let mockEditionService: Partial<EditionService>;

    let expectedEditionSeries: EditionSeriesRoutes;

    beforeEach(async () => {
        // Mock edition service
        mockEditionService = {
            getEditionSeriesById: (seriesId: string): EditionSeriesRoutes => expectedEditionSeries,
            updateSelectedEditionSeries: (editionSeries: EditionSeriesRoutes): void => {},
        };

        // Mocked activated route
        const mockActivatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [EditionSeriesDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: EditionService, useValue: mockEditionService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSeriesDetailComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
