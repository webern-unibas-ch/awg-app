import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '@awg-views/edition-view/models';

import { EditionIntroPartialDisclaimerComponent } from './edition-intro-partial-disclaimer.component';

describe('EditionIntroPartialDisclaimerComponent (DONE)', () => {
    let component: EditionIntroPartialDisclaimerComponent;
    let fixture: ComponentFixture<EditionIntroPartialDisclaimerComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks: RouterLinkStubDirective[];

    let expectedComplex: EditionComplex;
    let expectedIntroRoute: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionIntroPartialDisclaimerComponent, RouterLinkStubDirective],
        }).compileComponents();
    });

    beforeEach(() => {
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
        it('... should have default `editionComplex` input', () => {
            expectToBe(component.editionComplex, null);
        });

        it('... should have `introRoute`', () => {
            expectToBe(component.introRoute, expectedIntroRoute);
        });

        describe('VIEW', () => {
            it('... should contain no `div.awg-edition-intro-placeholder` yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-partial-disclaimer', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.editionComplex = expectedComplex;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `editionComplex`', () => {
            expectToEqual(component.editionComplex, expectedComplex);
        });

        describe('VIEW', () => {
            it('... should contain a `div.awg-edition-intro-placeholder`', () => {
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

                const sectionRoute = component.editionComplex?.pubStatement?.labeledSectionRoute;
                const expectedText = `[Siehe auch die gesamte Einleitung zu ${sectionRoute?.label}.]`;

                expectToBe(pEl.textContent.trim(), expectedText);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 1, 1);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                for (const routerLink of routerLinks) {
                    const sectionRoute = component.editionComplex?.pubStatement?.labeledSectionRoute;
                    const expectedRouterLink = [sectionRoute?.route.join('/'), expectedIntroRoute];
                    expectToEqual(routerLink.linkParams, expectedRouterLink);
                }
            });

            it('... can click all links in template', async () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const linkDe = linkDes[index];
                    const sectionRoute = component.editionComplex?.pubStatement?.labeledSectionRoute;
                    const expectedRouterLink = [sectionRoute?.route.join('/'), expectedIntroRoute];

                    expectToBe(routerLink.navigatedTo, null);

                    await clickAndAwaitChanges(linkDe, fixture);

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                }
            });
        });
    });
});
