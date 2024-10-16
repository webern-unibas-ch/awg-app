import { DOCUMENT } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService } from '@awg-views/edition-view/services';

import { EditionIntroPartialDisclaimerComponent } from './edition-intro-partial-disclaimer.component';

describe('EditionIntroPartialDisclaimerComponent', () => {
    let component: EditionIntroPartialDisclaimerComponent;
    let fixture: ComponentFixture<EditionIntroPartialDisclaimerComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let mockDocument: Document;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionLabel: string;
    let expectedEditionRoute: string;
    let expectedSeriesRoute: string;
    let expectedSectionRoute: string;
    let expectedIntroRoute: string;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionIntroPartialDisclaimerComponent, RouterLinkStubDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionIntroPartialDisclaimerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP12');
        expectedEditionLabel = EDITION_ROUTE_CONSTANTS.EDITION.short;
        expectedEditionRoute = EDITION_ROUTE_CONSTANTS.EDITION.route;
        expectedSeriesRoute = EDITION_ROUTE_CONSTANTS.SERIES.route;
        expectedSectionRoute = EDITION_ROUTE_CONSTANTS.SECTION.route;
        expectedIntroRoute = EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route;
    });

    afterAll(() => {
        cleanStylesFromDOM();
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

            it('... should contain a text-muted paragraph (no-para) in div', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-partial-disclaimer', 1, 1);
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const pEl = pDes[0].nativeElement;

                expect(pEl).toHaveClass('text-muted');
                expect(pEl).toHaveClass('no-para');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.editionComplex = expectedEditionComplex;
            component.editionLabel = expectedEditionLabel;
            component.editionRoute = expectedEditionRoute;
            component.seriesRoute = expectedSeriesRoute;
            component.sectionRoute = expectedSectionRoute;
            component.introRoute = expectedIntroRoute;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `editionComplex`', () => {
            expectToEqual(component.editionComplex, expectedEditionComplex);
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
                const pEl = pDes[0].nativeElement;

                expect(pEl).toHaveClass('text-muted');
                expect(pEl).toHaveClass('no-para');

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
                routerLinks.forEach((routerLink: RouterLinkStubDirective, _index: number) => {
                    const expectedRouterLink = [
                        expectedEditionRoute,
                        expectedSeriesRoute,
                        expectedEditionComplex.pubStatement.series.route,
                        expectedSectionRoute,
                        expectedEditionComplex.pubStatement.section.route,
                        expectedIntroRoute,
                    ];
                    expectToEqual(routerLink.linkParams, expectedRouterLink);
                });
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink: RouterLinkStubDirective, index: number) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = [
                        expectedEditionRoute,
                        expectedSeriesRoute,
                        expectedEditionComplex.pubStatement.series.route,
                        expectedSectionRoute,
                        expectedEditionComplex.pubStatement.section.route,
                        expectedIntroRoute,
                    ];

                    expectToBe(routerLink.navigatedTo, null);

                    click(linkDe);
                    fixture.detectChanges();

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                });
            });
        });
    });
});
