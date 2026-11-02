import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { LabeledRoute } from '@awg-shared/models/labeled-route.model';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models/edition-outline.model';

import { EDITION_ROUTE_CONSTANTS, EditionRouteConstant } from '../edition-routes.constants';

import { EditionBreadcrumbComponent } from './edition-breadcrumb.component';

describe('EditionBreadcrumbComponent (DONE)', () => {
    let component: EditionBreadcrumbComponent;
    let fixture: ComponentFixture<EditionBreadcrumbComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedComplex: EditionComplex;
    let expectedSeries: EditionOutlineSeries;
    let expectedSection: EditionOutlineSection;

    const { EDITION, SERIES, EDITION_INTRO, PREFACE, ROWTABLES } = EDITION_ROUTE_CONSTANTS;
    const expectedRootItem: LabeledRoute = {
        label: EDITION.short,
        route: [EDITION.route, SERIES.route],
    };
    const expectedRootUrl = expectedRootItem.route.join('/');

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionBreadcrumbComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        router = TestBed.inject(Router);

        // Test data
        const complexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(complexId);
        expectedSeries = EditionStateHelper.getSeries('1');
        expectedSection = EditionStateHelper.getSection('1', '5');

        // Create component fixture
        fixture = TestBed.createComponent(EditionBreadcrumbComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `items`', () => {
            expectToBe(isSignal(component.items), true);

            expect(() => component.items()).toThrow();
        });

        it('... should have `faChevronRight` icon', () => {
            expectToEqual(component.faChevronRight, faChevronRight);
        });

        describe('VIEW', () => {
            it('... should have a labelled breadcrumb navigation with an ordered list', () => {
                const navDes = getAndExpectDebugElementByCss(compDe, 'nav.awg-edition-info-breadcrumb', 1, 1);
                const navEl: HTMLElement = navDes[0].nativeElement;

                expect(navEl).toBeTruthy();
                expectToBe(navEl.getAttribute('aria-label'), 'Navigationspfad');
                getAndExpectDebugElementByCss(navDes[0], 'ol.breadcrumb', 1, 1);
            });

            it('... should have no list items yet', () => {
                getAndExpectDebugElementByCss(compDe, 'li.breadcrumb-item', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        const getItemDes = (expectedLength: number) =>
            getAndExpectDebugElementByCss(compDe, 'li.breadcrumb-item', expectedLength, expectedLength);
        const getItemEls = (expectedLength: number): HTMLLIElement[] =>
            getItemDes(expectedLength).map(de => de.nativeElement);
        const getItemTexts = (expectedLength: number): string[] =>
            getItemEls(expectedLength).map(el => el.textContent.trim());

        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('items', [expectedRootItem]);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `items` to hold the provided data', () => {
            expectToEqual(component.items(), [expectedRootItem]);
        });

        describe('VIEW', () => {
            it('... should render an anchor tag for items with a valid route', () => {
                const navDes = getAndExpectDebugElementByCss(compDe, 'nav.awg-edition-info-breadcrumb', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(navDes[0], 'a', 1, 1);
                const anchorEl: HTMLAnchorElement = anchorDes[0].nativeElement;

                expect(anchorEl).toBeTruthy();
                expectToBe(anchorEl.textContent.trim(), expectedRootItem.label);

                getAndExpectDebugElementByCss(navDes[0], 'span', 0, 0);
            });

            it('... should render the label of an anchor tag as innerHTML', () => {
                fixture.componentRef.setInput('items', [{ label: 'Op.&nbsp;12', route: ['/edition/complex/op12'] }]);

                fixture.detectChanges();

                const navDes = getAndExpectDebugElementByCss(compDe, 'nav.awg-edition-info-breadcrumb', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(navDes[0], 'a', 1, 1);
                const anchorEl: HTMLAnchorElement = anchorDes[0].nativeElement;

                expectToBe(anchorEl.textContent, 'Op. 12');
            });

            it('... should render a span with innerHTML for items without a route', () => {
                fixture.componentRef.setInput('items', [{ label: 'op. 27', route: [] }]);

                fixture.detectChanges();

                const navDes = getAndExpectDebugElementByCss(compDe, 'nav.awg-edition-info-breadcrumb', 1, 1);
                getAndExpectDebugElementByCss(navDes[0], 'a', 0, 0);

                const spanDes = getAndExpectDebugElementByCss(navDes[0], 'span', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expect(spanEl).toBeTruthy();
                expectToBe(spanEl.innerHTML, 'op. 27');
            });

            it('... should mark only the last item as active current page', () => {
                fixture.componentRef.setInput('items', [expectedRootItem, { label: 'Serie I', route: [] }]);

                fixture.detectChanges();

                const itemEls = getItemEls(2);
                const isActiveValues = itemEls.map(el => el.classList.contains('active'));
                const ariaCurrentValues = itemEls.map(el => el.getAttribute('aria-current'));

                expectToEqual(isActiveValues, [false, true]);
                expectToEqual(ariaCurrentValues, [null, 'page']);
            });

            it('... should display a chevron divider in every item but the first', () => {
                fixture.componentRef.setInput('items', [
                    expectedRootItem,
                    { label: 'Serie I', route: [] },
                    { label: 'op. 27', route: [] },
                ]);

                fixture.detectChanges();

                const itemDes = getItemDes(3);
                getAndExpectDebugElementByDirective(itemDes[0], FaIconComponent, 0, 0);

                const iconDes = itemDes
                    .slice(1)
                    .map(itemDe => getAndExpectDebugElementByDirective(itemDe, FaIconComponent, 1, 1)[0]);
                const icons = iconDes.map(iconDe => iconDe.injector.get(FaIconComponent).icon());

                expectToEqual(icons, [faChevronRight, faChevronRight]);
            });

            describe('... with specific input items', () => {
                describe('... if preface view is given', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('items', [expectedRootItem, { label: PREFACE.short, route: [] }]);
                        fixture.detectChanges();
                    });

                    it('... should display edition root and preface heading', () => {
                        const expectedItemTexts = [EDITION.short, PREFACE.short];

                        const itemTexts = getItemTexts(expectedItemTexts.length);

                        expectToEqual(itemTexts, expectedItemTexts);
                    });

                    it('... should have one router link (to series overview)', () => {
                        const expectedLinkLength = 1;

                        const navDes = getAndExpectDebugElementByCss(compDe, 'nav.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(navDes[0], 'a', expectedLinkLength, expectedLinkLength);

                        const linkDes = getAndExpectDebugElementByDirective(
                            navDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));
                        const urlTreeString = routerLinks[0].urlTree?.toString() ?? '';

                        expectToBe(routerLinks.length, expectedLinkLength);
                        expectToEqual(urlTreeString, expectedRootUrl);
                    });
                });

                describe('... if rowtables view is given', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('items', [
                            expectedRootItem,
                            { label: ROWTABLES.full, route: [] },
                        ]);
                        fixture.detectChanges();
                    });

                    it('... should display edition root and rowtables heading', () => {
                        const expectedItemTexts = [EDITION.short, ROWTABLES.full];

                        const itemTexts = getItemTexts(expectedItemTexts.length);

                        expectToEqual(itemTexts, expectedItemTexts);
                    });

                    it('... should have one router link (back to series overview)', () => {
                        const expectedLinkLength = 1;

                        const navDes = getAndExpectDebugElementByCss(compDe, 'nav.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(navDes[0], 'a', expectedLinkLength, expectedLinkLength);

                        const linkDes = getAndExpectDebugElementByDirective(
                            navDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));
                        const urlTreeString = routerLinks[0].urlTree?.toString() ?? '';

                        expectToBe(routerLinks.length, expectedLinkLength);
                        expectToEqual(urlTreeString, expectedRootUrl);
                    });
                });

                describe('... if no series and section is given (root)', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('items', [
                            { ...expectedRootItem, route: [] },
                            { label: SERIES.full, route: [] },
                        ]);
                        fixture.detectChanges();
                    });

                    it('... should display edition root and series overview heading', () => {
                        const expectedItemTexts = [EDITION.short, SERIES.full];

                        const itemTexts = getItemTexts(expectedItemTexts.length);

                        expectToEqual(itemTexts, expectedItemTexts);
                    });

                    it('... should have no router link, but only spans', () => {
                        const navDes = getAndExpectDebugElementByCss(compDe, 'nav.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(navDes[0], 'a', 0, 0);
                        getAndExpectDebugElementByCss(navDes[0], 'span', 2, 2);
                    });
                });

                describe('... if series, but no section is given', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('items', [
                            expectedRootItem,
                            { label: expectedSeries.series.full, route: [] },
                        ]);
                        fixture.detectChanges();
                    });

                    it('... should display edition root and series', () => {
                        const expectedItemTexts = [EDITION.short, expectedSeries.series.full];

                        const itemTexts = getItemTexts(expectedItemTexts.length);

                        expectToEqual(itemTexts, expectedItemTexts);
                    });

                    it('... should have one router link (to edition series overview)', () => {
                        const expectedLinkLength = 1;

                        const navDes = getAndExpectDebugElementByCss(compDe, 'nav.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(navDes[0], 'a', expectedLinkLength, expectedLinkLength);
                        const linkDes = getAndExpectDebugElementByDirective(
                            navDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));
                        const urlTreeString = routerLinks[0].urlTree?.toString() ?? '';

                        expectToBe(routerLinks.length, expectedLinkLength);
                        expectToEqual(urlTreeString, expectedRootUrl);
                    });
                });

                describe('... if series and section are given', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('items', [
                            expectedRootItem,
                            {
                                label: expectedSeries.series.full,
                                route: [...expectedRootItem.route, expectedSeries.series.route],
                            },
                            { label: expectedSection.section.full, route: [] },
                        ]);
                        fixture.detectChanges();
                    });

                    it('... should display edition root, series and section', () => {
                        const expectedItemTexts = [
                            EDITION.short,
                            expectedSeries.series.full,
                            expectedSection.section.full,
                        ];

                        const itemTexts = getItemTexts(expectedItemTexts.length);

                        expectToEqual(itemTexts, expectedItemTexts);
                    });

                    it('... should have two router links (to series overview and current edition series)', () => {
                        const expectedSeriesUrl = [...expectedRootItem.route, expectedSeries.series.route].join('/');

                        const expectedLinkLength = 2;
                        const navDes = getAndExpectDebugElementByCss(compDe, 'nav.awg-edition-info-breadcrumb', 1, 1);

                        const linkDes = getAndExpectDebugElementByDirective(
                            navDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));
                        const urlTreeString1 = routerLinks[0].urlTree?.toString() ?? '';
                        const urlTreeString2 = routerLinks[1].urlTree?.toString() ?? '';

                        expectToEqual(urlTreeString1, expectedRootUrl);
                        expectToEqual(urlTreeString2, expectedSeriesUrl);
                    });
                });

                describe('... if series, section, and intro view is given', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('items', [
                            expectedRootItem,
                            {
                                label: expectedSeries.series.full,
                                route: [...expectedRootItem.route, expectedSeries.series.route],
                            },
                            { label: expectedSection.section.full, route: expectedSection.labeledRoute.route },
                            { label: EDITION_INTRO.full, route: [] },
                        ]);
                        fixture.detectChanges();
                    });

                    it('... should display edition series, section and intro heading', () => {
                        const expectedItemTexts = [
                            EDITION.short,
                            expectedSeries.series.full,
                            expectedSection.section.full,
                            EDITION_INTRO.full,
                        ];

                        const itemTexts = getItemTexts(expectedItemTexts.length);

                        expectToEqual(itemTexts, expectedItemTexts);
                    });

                    it('... should have three router links (to series overview, current edition series and section overview)', () => {
                        const expectedSeriesUrl = [...expectedRootItem.route, expectedSeries.series.route].join('/');
                        const expectedSectionUrl = expectedSection.labeledRoute.route.join('/');

                        const expectedLinkLength = 3;

                        const navDes = getAndExpectDebugElementByCss(compDe, 'nav.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(navDes[0], 'a', expectedLinkLength, expectedLinkLength);

                        const linkDes = getAndExpectDebugElementByDirective(
                            navDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));
                        const urlTreeString1 = routerLinks[0].urlTree?.toString() ?? '';
                        const urlTreeString2 = routerLinks[1].urlTree?.toString() ?? '';
                        const urlTreeString3 = routerLinks[2].urlTree?.toString() ?? '';

                        expectToBe(routerLinks.length, expectedLinkLength);
                        expectToEqual(urlTreeString1, expectedRootUrl);
                        expectToEqual(urlTreeString2, expectedSeriesUrl);
                        expectToEqual(urlTreeString3, expectedSectionUrl);
                    });
                });

                describe('... if an edition complex is given', () => {
                    let series: EditionRouteConstant;
                    let section: EditionRouteConstant;
                    let labeledSectionRoute: LabeledRoute;

                    beforeEach(() => {
                        ({ series, section, labeledSectionRoute } = expectedComplex.pubStatement);

                        fixture.componentRef.setInput('items', [
                            expectedRootItem,
                            {
                                label: series.full,
                                route: [...expectedRootItem.route, series.route],
                            },
                            {
                                label: section.full,
                                route: labeledSectionRoute.route,
                            },
                            {
                                label: expectedComplex.complexId.short,
                                route: [],
                            },
                        ]);
                        fixture.detectChanges();
                    });

                    it('... should display edition root, series, section and complex', () => {
                        const complexShortWithSpace = expectedComplex.complexId.short.replace(/&nbsp;/g, '\u00A0');
                        const expectedItemTexts = [EDITION.short, series.full, section.full, complexShortWithSpace];

                        const itemTexts = getItemTexts(expectedItemTexts.length);

                        expectToEqual(itemTexts, expectedItemTexts);
                    });

                    it('... should have three router links (to series overview, current series, and current section)', () => {
                        const expectedSeriesUrl = [...expectedRootItem.route, series.route].join('/');
                        const expectedSectionUrl = labeledSectionRoute.route.join('/');

                        const expectedLinkLength = 3;

                        const navDes = getAndExpectDebugElementByCss(compDe, 'nav.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(navDes[0], 'a', expectedLinkLength, expectedLinkLength);

                        const linkDes = getAndExpectDebugElementByDirective(
                            navDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));
                        const urlTreeString1 = routerLinks[0].urlTree?.toString() ?? '';
                        const urlTreeString2 = routerLinks[1].urlTree?.toString() ?? '';
                        const urlTreeString3 = routerLinks[2].urlTree?.toString() ?? '';

                        expectToBe(routerLinks.length, expectedLinkLength);
                        expectToEqual(urlTreeString1, expectedRootUrl);
                        expectToEqual(urlTreeString2, expectedSeriesUrl);
                        expectToEqual(urlTreeString3, expectedSectionUrl);
                    });
                });

                describe('... if a part of a composite complex is given', () => {
                    let part: EditionComplex;
                    let opus: EditionComplex;

                    beforeEach(() => {
                        part = EditionStateHelper.getComplex('m217');
                        opus = EditionStateHelper.getComplex('op12');
                        const { series, section, labeledSectionRoute } = part.pubStatement;

                        fixture.componentRef.setInput('items', [
                            expectedRootItem,
                            { label: series.full, route: [...expectedRootItem.route, series.route] },
                            { label: section.full, route: labeledSectionRoute.route },
                            { label: opus.complexId.short, route: [opus.baseRoute] },
                            { label: part.complexId.short, route: [] },
                        ]);
                        fixture.detectChanges();
                    });

                    it('... should display the composite complex before the part', () => {
                        const itemTexts = getItemTexts(5);

                        const toText = (label: string): string => label.replace(/&nbsp;/g, ' ');
                        const expectedTexts = [toText(opus.complexId.short), toText(part.complexId.short)];

                        expectToEqual(itemTexts.slice(3), expectedTexts);
                    });

                    it('... should have a router link to the composite complex as fourth link', () => {
                        const linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 4, 4);
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));
                        const urlTreeString = routerLinks[3].urlTree?.toString() ?? '';

                        expectToBe(urlTreeString, opus.baseRoute);
                    });
                });
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];

            let series: EditionRouteConstant;
            let section: EditionRouteConstant;
            let labeledSectionRoute: LabeledRoute;

            beforeEach(() => {
                ({ series, section, labeledSectionRoute } = expectedComplex.pubStatement);

                fixture.componentRef.setInput('items', [
                    expectedRootItem,
                    {
                        label: series.full,
                        route: [...expectedRootItem.route, series.route],
                    },
                    {
                        label: section.full,
                        route: labeledSectionRoute.route,
                    },
                    {
                        label: expectedComplex.complexId.short,
                        route: [],
                    },
                ]);
                fixture.detectChanges();

                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 3, 3);
                routerLinks = linkDes.map(de => de.injector.get(RouterLink));
            });

            it('... can get correct number of routerLinks from template (complex given)', () => {
                expectToBe(routerLinks.length, 3);
            });

            it('... can get correct linkParams from template', () => {
                const expectedSeriesUrl = [...expectedRootItem.route, series.route].join('/');
                const expectedSectionUrl = labeledSectionRoute.route.join('/');

                const urlTreeString1 = routerLinks[0].urlTree?.toString() ?? '';
                const urlTreeString2 = routerLinks[1].urlTree?.toString() ?? '';
                const urlTreeString3 = routerLinks[2].urlTree?.toString() ?? '';

                expectToBe(urlTreeString1, expectedRootUrl);
                expectToBe(urlTreeString2, expectedSeriesUrl);
                expectToBe(urlTreeString3, expectedSectionUrl);
            });

            const clickTestCases = [
                { index: 0, name: 'edition root', expectedRouterLink: () => expectedRootUrl },
                {
                    index: 1,
                    name: 'series',
                    expectedRouterLink: () => [...expectedRootItem.route, series.route].join('/'),
                },
                { index: 2, name: 'section', expectedRouterLink: () => labeledSectionRoute.route.join('/') },
            ];

            it.each(clickTestCases)('... can click $name link in template', async ({ index, expectedRouterLink }) => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
                navigateSpy.mockClear();

                const targetLinkDe = linkDes[index];

                await clickAndAwaitChanges(targetLinkDe, fixture);

                expectSpyCall(navigateSpy, 1);
                const actualUrl = navigateSpy.mock.calls[0][0].toString();

                expectToBe(actualUrl, expectedRouterLink());

                navigateSpy.mockRestore();
            });
        });
    });
});
