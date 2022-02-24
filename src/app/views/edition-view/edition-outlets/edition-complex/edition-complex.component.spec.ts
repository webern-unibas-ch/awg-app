import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of as observableOf } from 'rxjs';

import { ActivatedRouteStub } from '@testing/router-stubs';

import { EditionWork, EditionWorks } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

import { EditionComplexComponent } from './edition-complex.component';

describe('EditionComplexComponent', () => {
    let component: EditionComplexComponent;
    let fixture: ComponentFixture<EditionComplexComponent>;
    let compDe: DebugElement;

    let mockEditionService: Partial<EditionService>;

    let expectedSelectedEditionComplex: EditionWork;

    beforeEach(async () => {
        // Mock edition service
        mockEditionService = {
            getEditionWork: (): Observable<EditionWork> => observableOf(expectedSelectedEditionComplex),
            updateEditionWork: (editionWork: EditionWork): void => {},
            clearEditionWork: (): void => {},
        };

        // Mocked activated route
        const mockActivatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

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

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
