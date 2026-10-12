import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { EditionComplexComponent } from './edition-complex.component';

describe('EditionComplexComponent (DONE)', () => {
    let component: EditionComplexComponent;
    let fixture: ComponentFixture<EditionComplexComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let expectedComplex: EditionComplex;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionComplexComponent, RouterOutlet],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedComplex = EditionStateHelper.getComplex('op12');

        // Create component fixture
        fixture = TestBed.createComponent(EditionComplexComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        describe('VIEW', () => {
            it('... should contain one router outlet', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutlet, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the edition complex set by the editionComplexResolver
            editionStateService.updateSelectedEditionComplex(expectedComplex);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
            expectToEqual(component.selectedEditionComplex(), expectedComplex);
        });
    });
});
