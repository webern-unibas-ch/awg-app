import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { NavLinkGroupComponent } from '@awg-shared/nav-link-group/nav-link-group.component';
import { NavLink } from '@awg-shared/nav-link-group/nav-link.model';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { EditionDetailNavComponent } from './edition-detail-nav.component';

// Helper function
function getExpectedNavLinks(complex: EditionComplex): NavLink[] {
    return [
        EDITION_ROUTE_CONSTANTS.EDITION_INTRO,
        EDITION_ROUTE_CONSTANTS.EDITION_SHEETS,
        EDITION_ROUTE_CONSTANTS.EDITION_REPORT,
        EDITION_ROUTE_CONSTANTS.EDITION_GRAPH,
    ].map(routerLink => new NavLink(complex.baseRoute, routerLink.route, routerLink.short, false));
}

describe('EditionDetailNavComponent (DONE)', () => {
    let component: EditionDetailNavComponent;
    let fixture: ComponentFixture<EditionDetailNavComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let expectedNavLinks: NavLink[];
    let expectedComplex: EditionComplex;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionDetailNavComponent],
            providers: [provideRouter([])],
        })
            .overrideComponent(NavLinkGroupComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedComplex = EditionStateHelper.getComplex('op12');
        expectedNavLinks = getExpectedNavLinks(expectedComplex);

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

        it('... should have computed signal `editionDetailNavLinks` to hold null', () => {
            expectToBe(isSignal(component.editionDetailNavLinks), true);

            expectToBe(component.editionDetailNavLinks(), null);
        });

        describe('VIEW', () => {
            it('... should contain no NavLinkGroupComponent yet', () => {
                getAndExpectDebugElementByDirective(compDe, NavLinkGroupComponent, 0, 0);
            });

            it('... should contain one router outlet', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutlet, 1, 1);
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

        it('... should have computed signal `editionDetailNavLinks` to hold the expected nav links', () => {
            expectToEqual(component.editionDetailNavLinks(), expectedNavLinks);
        });

        it('... should have recomputed signal `editionDetailNavLinks` when complex changes', () => {
            const newComplex = EditionStateHelper.getComplex('op25');
            const newExpectedNavLinks = getExpectedNavLinks(newComplex);

            editionStateService.updateSelectedEditionComplex(newComplex);

            expectToEqual(component.editionDetailNavLinks(), newExpectedNavLinks);
        });

        describe('VIEW', () => {
            it('... should render no content if `editionDetailNavLinks` is not available', () => {
                editionStateService.updateSelectedEditionComplex(null);
                fixture.detectChanges();

                expectToBe(component.editionDetailNavLinks(), null);
                getAndExpectDebugElementByDirective(compDe, NavLinkGroupComponent, 0, 0);
            });

            it('... should contain one NavLinkGroupComponent (hollow)', () => {
                getAndExpectDebugElementByDirective(compDe, NavLinkGroupComponent, 1, 1);
            });

            it('... should pass down `editionDetailNavLinks` to NavLinkGroupComponent (hollow)', () => {
                const navLinkGroupDes = getAndExpectDebugElementByDirective(compDe, NavLinkGroupComponent, 1, 1);
                const navLinkGroupCmp = navLinkGroupDes[0].injector.get(NavLinkGroupComponent);

                expectToEqual(navLinkGroupCmp.navLinks(), expectedNavLinks);
            });

            it('... should pass down the updated nav links to NavLinkGroupComponent (hollow) when complex changes', () => {
                const newComplex = EditionStateHelper.getComplex('op25');
                editionStateService.updateSelectedEditionComplex(newComplex);
                fixture.detectChanges();

                const navLinkGroupDes = getAndExpectDebugElementByDirective(compDe, NavLinkGroupComponent, 1, 1);
                const navLinkGroupCmp = navLinkGroupDes[0].injector.get(NavLinkGroupComponent);

                expectToEqual(navLinkGroupCmp.navLinks(), getExpectedNavLinks(newComplex));
            });

            it('... should keep default `queryParamsHandling` in NavLinkGroupComponent (hollow)', () => {
                const navLinkGroupDes = getAndExpectDebugElementByDirective(compDe, NavLinkGroupComponent, 1, 1);
                const navLinkGroupCmp = navLinkGroupDes[0].injector.get(NavLinkGroupComponent);

                expectToBe(navLinkGroupCmp.queryParamsHandling(), '');
            });
        });
    });
});
