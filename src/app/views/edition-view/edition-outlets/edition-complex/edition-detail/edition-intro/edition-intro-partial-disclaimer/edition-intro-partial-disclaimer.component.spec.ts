import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';

import { EditionIntroPartialDisclaimerComponent } from './edition-intro-partial-disclaimer.component';

describe('EditionIntroPartialDisclaimerComponent (DONE)', () => {
    let component: EditionIntroPartialDisclaimerComponent;
    let fixture: ComponentFixture<EditionIntroPartialDisclaimerComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedComplex: EditionComplex;
    let expectedIntroRoute: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionIntroPartialDisclaimerComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        router = TestBed.inject(Router);

        // Test data
        const complexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(complexId);
        expectedIntroRoute = EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route;

        // Create component fixture
        fixture = TestBed.createComponent(EditionIntroPartialDisclaimerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `editionComplex`', () => {
            expectToBe(isSignal(component.editionComplex), true);

            expect(() => component.editionComplex()).toThrow();
        });

        it('... should have `introRoute`', () => {
            expectToBe(component.introRoute, expectedIntroRoute);
        });

        describe('VIEW', () => {
            it('... should contain no `div.awg-edition-intro-partial-disclaimer` yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-partial-disclaimer', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('editionComplex', expectedComplex);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `editionComplex` to hold the expected complex', () => {
            expectToEqual(component.editionComplex(), expectedComplex);
        });

        describe('VIEW', () => {
            it('... should render no content if editionComplex is not available', () => {
                fixture.componentRef.setInput('editionComplex', null);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-partial-disclaimer', 0, 0);
            });

            it('... should contain one `div.awg-edition-intro-partial-disclaimer`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-partial-disclaimer', 1, 1);
            });

            it('... should contain a text-muted paragraph (no-para-margin) in div', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-partial-disclaimer', 1, 1);
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToContain(pEl.classList, 'text-muted');
                expectToContain(pEl.classList, 'no-para-margin');
            });

            it('... should display text-muted disclaimer in paragraph', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-partial-disclaimer', 1, 1);
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToContain(pEl.classList, 'text-muted');
                expectToContain(pEl.classList, 'no-para-margin');

                const sectionRoute = expectedComplex.pubStatement.labeledSectionRoute;
                const expectedText = `[Siehe auch die gesamte Einleitung zu ${sectionRoute?.label}.]`;

                expectToBe(pEl.textContent.trim(), expectedText);
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];
            let expectedRouterLink: string;

            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 1, 1);

                routerLinks = linkDes.map(de => de.injector.get(RouterLink));

                const sectionRoute = expectedComplex.pubStatement.labeledSectionRoute.route.join('/');
                expectedRouterLink = [sectionRoute, expectedIntroRoute].filter(Boolean).join('/');
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                const urlTreeString = routerLinks[0].urlTree?.toString() ?? '';

                expectToBe(urlTreeString, expectedRouterLink);
            });

            it('... can click all links in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                const linkDe = linkDes[0];

                await clickAndAwaitChanges(linkDe, fixture);

                expect(navigateSpy).toHaveBeenCalled();
                const actualUrl = navigateSpy.mock.calls[0][0].toString();

                expectToBe(actualUrl, expectedRouterLink);

                navigateSpy.mockRestore();
            });
        });
    });
});
