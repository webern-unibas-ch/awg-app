import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { RouterLinkButtonGroupComponent } from '@awg-shared/router-link-button-group/router-link-button-group.component';
import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { EditionDetailNavComponent } from './edition-detail-nav.component';

// Helper function
function getExpectedRouterLinkButtons(complex: EditionComplex): RouterLinkButton[] {
    return [
        EDITION_ROUTE_CONSTANTS.EDITION_INTRO,
        EDITION_ROUTE_CONSTANTS.EDITION_SHEETS,
        EDITION_ROUTE_CONSTANTS.EDITION_REPORT,
        EDITION_ROUTE_CONSTANTS.EDITION_GRAPH,
    ].map(routerLink => new RouterLinkButton(complex.baseRoute, routerLink.route, routerLink.short, false));
}

describe('EditionDetailNavComponent (DONE)', () => {
    let component: EditionDetailNavComponent;
    let fixture: ComponentFixture<EditionDetailNavComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let expectedRouterLinkButtons: RouterLinkButton[];
    let expectedComplex: EditionComplex;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionDetailNavComponent],
            providers: [provideRouter([])],
        })
            .overrideComponent(RouterLinkButtonGroupComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedComplex = EditionStateHelper.getComplex('op12');
        expectedRouterLinkButtons = getExpectedRouterLinkButtons(expectedComplex);

        // Create component fixture
        fixture = TestBed.createComponent(EditionDetailNavComponent);
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

        it('... should have computed signal `editionRouterLinkButtons` to hold null', () => {
            expectToBe(isSignal(component.editionRouterLinkButtons), true);

            expectToBe(component.editionRouterLinkButtons(), null);
        });

        describe('VIEW', () => {
            it('... should contain one router outlet', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutlet, 1, 1);
            });

            it('... should contain no RouterLinkButtonGroupComponent yet', () => {
                getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            editionStateService.updateSelectedEditionComplex(expectedComplex);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
            expectToEqual(component.selectedEditionComplex(), expectedComplex);
        });

        it('... should have computed signal `editionRouterLinkButtons` to hold the expected buttons', () => {
            expectToEqual(component.editionRouterLinkButtons(), expectedRouterLinkButtons);
        });

        it('... should have recomputed signal `editionRouterLinkButtons` when complex changes', () => {
            const newComplex = EditionStateHelper.getComplex('op25');
            const newExpectedButtons = getExpectedRouterLinkButtons(newComplex);

            editionStateService.updateSelectedEditionComplex(newComplex);

            expectToEqual(component.editionRouterLinkButtons(), newExpectedButtons);
        });

        describe('VIEW', () => {
            it('... should contain one RouterLinkButtonGroupComponent (hollow)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupComponent, 1, 1);
            });

            it('... should pass down `editionRouterLinkButtons` to RouterLinkButtonGroupComponent (hollow)', () => {
                const btnDes = getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupComponent, 1, 1);
                const btnCmp = btnDes[0].injector.get(RouterLinkButtonGroupComponent);

                expectToEqual(btnCmp.routerLinkButtons(), expectedRouterLinkButtons);
            });

            it('... should pass down the updated buttons to RouterLinkButtonGroupComponent (hollow) when complex changes', () => {
                const newComplex = EditionStateHelper.getComplex('op25');
                editionStateService.updateSelectedEditionComplex(newComplex);
                fixture.detectChanges();

                const btnDes = getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupComponent, 1, 1);
                const btnCmp = btnDes[0].injector.get(RouterLinkButtonGroupComponent);

                expectToEqual(btnCmp.routerLinkButtons(), getExpectedRouterLinkButtons(newComplex));
            });

            it('... should keep default `queryParamsHandling` in RouterLinkButtonGroupComponent (hollow)', () => {
                const btnDes = getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupComponent, 1, 1);
                const btnCmp = btnDes[0].injector.get(RouterLinkButtonGroupComponent);

                expectToBe(btnCmp.queryParamsHandling(), '');
            });
        });
    });
});
