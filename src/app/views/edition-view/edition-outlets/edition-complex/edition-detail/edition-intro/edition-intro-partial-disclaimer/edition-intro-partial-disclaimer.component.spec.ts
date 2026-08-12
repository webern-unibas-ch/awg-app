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
    let expectedEditionLabel: string;
    let expectedEditionRoute: string;
    let expectedSeriesRoute: string;
    let expectedSectionRoute: string;
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
        expectedEditionLabel = EDITION_ROUTE_CONSTANTS.EDITION.short;
        expectedEditionRoute = EDITION_ROUTE_CONSTANTS.EDITION.route;
        expectedSeriesRoute = EDITION_ROUTE_CONSTANTS.SERIES.route;
        expectedSectionRoute = EDITION_ROUTE_CONSTANTS.SECTION.route;
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
        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        it('... should not have `editionLabel`', () => {
            expect(component.editionLabel).toBeUndefined();
        });

        it('... should not have `editionRoute`', () => {
            expect(component.editionRoute).toBeUndefined();
        });

        it('... should not have `seriesRoute`', () => {
            expect(component.seriesRoute).toBeUndefined();
        });

        it('... should not have `sectionRoute`', () => {
            expect(component.sectionRoute).toBeUndefined();
        });

        it('... should not have `introRoute`', () => {
            expect(component.introRoute).toBeUndefined();
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
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.editionComplex = expectedComplex;
            component.editionLabel = expectedEditionLabel;
            component.editionRoute = expectedEditionRoute;
            component.seriesRoute = expectedSeriesRoute;
            component.sectionRoute = expectedSectionRoute;
            component.introRoute = expectedIntroRoute;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `editionComplex`', () => {
            expectToEqual(component.editionComplex, expectedComplex);
        });

        it('... should have `editionLabel`', () => {
            expectToBe(component.editionLabel, expectedEditionLabel);
        });

        it('... should have `editionRoute`', () => {
            expectToBe(component.editionRoute, expectedEditionRoute);
        });

        it('... should have `seriesRoute`', () => {
            expectToBe(component.seriesRoute, expectedSeriesRoute);
        });

        it('... should have `sectionRoute`', () => {
            expectToBe(component.sectionRoute, expectedSectionRoute);
        });

        it('... should have `introRoute`', () => {
            expectToBe(component.introRoute, expectedIntroRoute);
        });

        describe('VIEW', () => {
            it('... should display text-muted disclaimer in paragraph', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-partial-disclaimer', 1, 1);
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToContain(pEl.classList, 'text-muted');
                expectToContain(pEl.classList, 'no-para-margin');

                const awg = component.editionLabel;
                const series = component.editionComplex?.pubStatement?.series?.short;
                const section = component.editionComplex?.pubStatement?.section?.short;

                const expectedText = `[Siehe auch die gesamte Einleitung zu ${awg} ${series}/${section}.]`;
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
                    const expectedRouterLink = [
                        expectedEditionRoute,
                        expectedSeriesRoute,
                        expectedComplex.pubStatement.series.route,
                        expectedSectionRoute,
                        expectedComplex.pubStatement.section.route,
                        expectedIntroRoute,
                    ];
                    expectToEqual(routerLink.linkParams, expectedRouterLink);
                }
            });

            it('... can click all links in template', async () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = [
                        expectedEditionRoute,
                        expectedSeriesRoute,
                        expectedComplex.pubStatement.series.route,
                        expectedSectionRoute,
                        expectedComplex.pubStatement.section.route,
                        expectedIntroRoute,
                    ];

                    expectToBe(routerLink.navigatedTo, null);

                    await clickAndAwaitChanges(linkDe, fixture);

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                }
            });
        });
    });
});
