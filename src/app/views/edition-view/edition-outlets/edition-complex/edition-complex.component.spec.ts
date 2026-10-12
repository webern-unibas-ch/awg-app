import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { EditionComplexComponent } from './edition-complex.component';

describe('EditionComplexComponent (DONE)', () => {
    let component: EditionComplexComponent;
    let fixture: ComponentFixture<EditionComplexComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let resetEditionComplexOnDestroySpy: Spy;
    let stateServiceUpdateSelectedEditionComplexSpy: Spy;

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

        // Service spies
        stateServiceUpdateSelectedEditionComplexSpy = vi.spyOn(editionStateService, 'updateSelectedEditionComplex');

        // Prototype spies (to catch calls in constructor)
        resetEditionComplexOnDestroySpy = vi.spyOn(
            EditionComplexComponent.prototype,
            '_resetEditionComplexOnDestroy' as any
        );

        // Test data
        expectedComplex = EditionStateHelper.getComplex('op12');

        // Create component fixture
        fixture = TestBed.createComponent(EditionComplexComponent);
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
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        it('... should have triggered method `_resetEditionComplexOnDestroy`', () => {
            expectSpyCall(resetEditionComplexOnDestroySpy, 1);
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
            stateServiceUpdateSelectedEditionComplexSpy.mockClear();

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
            expectToEqual(component.selectedEditionComplex(), expectedComplex);
        });

        describe('METHODS', () => {
            describe('#_resetEditionComplexOnDestroy()', () => {
                it('... should have a method `_resetEditionComplexOnDestroy`', () => {
                    expect(component['_resetEditionComplexOnDestroy']).toBeDefined();
                });

                it('... should not reset the selected edition complex while the component is alive', () => {
                    expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 0);
                    expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);
                });

                it('... should have signal `selectedEditionComplex` to hold null after destroy', () => {
                    fixture.destroy();

                    expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 1, null);
                    expectToBe(editionStateService.selectedEditionComplex(), null);
                });
            });
        });
    });
});
