import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models/edition-outline.model';

import { EditionSeriesCardComponent } from './edition-series-card.component';

describe('EditionSeriesCardComponent (DONE)', () => {
    let component: EditionSeriesCardComponent;
    let fixture: ComponentFixture<EditionSeriesCardComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedSeries: EditionOutlineSeries;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSeriesCardComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        router = TestBed.inject(Router);

        // Test data
        expectedSeries = EditionStateHelper.getSeries('1');

        // Create component fixture
        fixture = TestBed.createComponent(EditionSeriesCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `displayedSeries`', () => {
            expectToBe(isSignal(component.displayedSeries), true);

            expect(() => component.displayedSeries()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no div.awg-edition-series-card yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series-card', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('displayedSeries', structuredClone(expectedSeries));

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `displayedSeries` to hold the expected series', () => {
            expectToEqual(component.displayedSeries(), expectedSeries);
        });

        describe('VIEW', () => {
            const getCardDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series-card', 1, 1);
            const getCardBodyDes = () => getAndExpectDebugElementByCss(getCardDes()[0], 'div.card-body', 1, 1);
            const getCardFooterDes = () => getAndExpectDebugElementByCss(getCardDes()[0], 'div.card-footer', 1, 1);
            const getListItemDes = () => {
                const ulDes = getAndExpectDebugElementByCss(getCardBodyDes()[0], 'ul.list-group', 1, 1);
                return getAndExpectDebugElementByCss(
                    ulDes[0],
                    'li.list-group-item',
                    expectedSeries.sections.length,
                    expectedSeries.sections.length
                );
            };

            it('... should render no content if displayed series is not available', () => {
                fixture.componentRef.setInput('displayedSeries', null as any);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series-card', 0, 0);
            });

            it('... should contain one div.awg-edition-series-card', () => {
                getCardDes();
            });

            describe('... should contain card layout elements', () => {
                it.each([
                    { desc: 'a h5.card-header', selector: 'h5.card-header' },
                    { desc: 'a div.card-body', selector: 'div.card-body' },
                    { desc: 'a div.card-footer', selector: 'div.card-footer' },
                ])('... should contain $desc in div.awg-edition-series-card', ({ selector }) => {
                    getAndExpectDebugElementByCss(getCardDes()[0], selector, 1, 1);
                });
            });

            it('... should display series name in h5.card-header', () => {
                const hDes = getAndExpectDebugElementByCss(getCardDes()[0], 'h5.card-header', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent.trim(), expectedSeries.series.full);
            });

            it('... should contain a ul.list-group in div.card-body', () => {
                getAndExpectDebugElementByCss(getCardBodyDes()[0], 'ul.list-group', 1, 1);
            });

            it('... should contain as many li.list-group-item in ul.list-group as there are sections in the series', () => {
                getListItemDes();
            });

            it('... should display section name in each li.list-group-item', () => {
                const liDes = getListItemDes();

                liDes.forEach((liDe, index) => {
                    const expectedSection = expectedSeries.sections[index];
                    const liEl: HTMLLIElement = liDe.nativeElement;

                    expectToBe(liEl.textContent.trim(), expectedSection.section.full);
                });
            });

            it('... should contain a routerLink and no span.text-muted in li.list-group-item if section is not disabled', () => {
                const liDes = getListItemDes();

                liDes.forEach((liDe, index) => {
                    const expectedSection = expectedSeries.sections[index];

                    if (!expectedSection.disabled) {
                        getAndExpectDebugElementByDirective(liDe, RouterLink, 1, 1);
                        getAndExpectDebugElementByCss(liDe, 'span.text-muted', 0, 0);
                    }
                });
            });

            it('... should contain no routerLink, but a span.text-muted in li.list-group-item if section is disabled', () => {
                const liDes = getListItemDes();

                liDes.forEach((liDe, index) => {
                    const expectedSection = expectedSeries.sections[index];

                    if (expectedSection.disabled) {
                        getAndExpectDebugElementByDirective(liDe, RouterLink, 0, 0);
                        getAndExpectDebugElementByCss(liDe, 'span.text-muted', 1, 1);
                    }
                });
            });

            it('... should have a routerLink in div.card-footer', () => {
                getAndExpectDebugElementByDirective(getCardFooterDes()[0], RouterLink, 1, 1);
            });

            it('... should display correct text in the routerLink in div.card-footer', () => {
                const footerLinkDes = getAndExpectDebugElementByDirective(getCardFooterDes()[0], RouterLink, 1, 1);
                const footerLinkEl: HTMLAnchorElement = footerLinkDes[0].nativeElement;

                expectToBe(footerLinkEl.textContent.trim(), 'Mehr ...');
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];

            let expectedEnabledSections: EditionOutlineSection[];

            beforeEach(() => {
                expectedEnabledSections = expectedSeries.sections.filter(section => !section.disabled);

                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLink,
                    expectedEnabledSections.length + 1,
                    expectedEnabledSections.length + 1
                );

                routerLinks = linkDes.map(de => de.injector.get(RouterLink) as RouterLink);
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedEnabledSections.length + 1);
            });

            it('... can get correct linkParams for the section links from template', () => {
                expectedEnabledSections.forEach((section, index) => {
                    const expectedRouterLink = `/${expectedSeries.series.route}/section/${section.section.route}`;

                    expectToBe(routerLinks[index].urlTree?.toString(), expectedRouterLink);
                });
            });

            it('... can get correct linkParams for the series link from template', () => {
                const seriesLink = routerLinks[routerLinks.length - 1];
                const expectedRouterLink = `/${expectedSeries.series.route}`;

                expectToBe(seriesLink.urlTree?.toString(), expectedRouterLink);
            });

            it('... can click a section link in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                const sectionLinkDe = linkDes[0];
                const expectedRouterLink = `/${expectedSeries.series.route}/section/${expectedEnabledSections[0].section.route}`;

                await clickAndAwaitChanges(sectionLinkDe, fixture);

                expect(navigateSpy).toHaveBeenCalled();
                expectToBe(navigateSpy.mock.calls[0][0].toString(), expectedRouterLink);

                navigateSpy.mockRestore();
            });

            it('... can click the series link in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                const seriesLinkDe = linkDes[linkDes.length - 1];
                const expectedRouterLink = `/${expectedSeries.series.route}`;

                await clickAndAwaitChanges(seriesLinkDe, fixture);

                expect(navigateSpy).toHaveBeenCalled();
                expectToBe(navigateSpy.mock.calls[0][0].toString(), expectedRouterLink);

                navigateSpy.mockRestore();
            });
        });
    });
});
