import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { LabeledRoute } from '@awg-shared/models/labeled-route.model';
import { EDITION_ROUTE_CONSTANTS } from '../edition-routes.constants';
import { EditionComplex, EditionOutlineSection, EditionOutlineSeries, EditionRouteConstant } from '../models';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { EditionBreadcrumbComponent } from './edition-breadcrumb.component';

describe('EditionBreadcrumbComponent', () => {
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

        describe('VIEW', () => {
            it('... should have a breadcrumb header', () => {
                getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
            });

            it('... should have no anchor or span in breadcrumb header yet', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);

                getAndExpectDebugElementByCss(hDes[0], 'h6.awg-edition-info-breadcrumb a', 0, 0);
                getAndExpectDebugElementByCss(hDes[0], 'h6.awg-edition-info-breadcrumb span', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
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
                const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(hDes[0], 'a', 1, 1);
                const anchorEl: HTMLAnchorElement = anchorDes[0].nativeElement;

                expect(anchorEl).toBeTruthy();
                expectToBe(anchorEl.textContent.trim(), expectedRootItem.label);

                getAndExpectDebugElementByCss(hDes[0], 'span:not(.mx-1)', 0, 0);
            });

            it('... should render a span with innerHTML for items without a route', () => {
                fixture.componentRef.setInput('items', [{ label: 'op. 27', route: [] }]);

                fixture.detectChanges();

                const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                getAndExpectDebugElementByCss(hDes[0], 'a', 0, 0);

                const spanDes = getAndExpectDebugElementByCss(hDes[0], 'span:not(.mx-1)', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expect(spanEl).toBeTruthy();
                expectToBe(spanEl.innerHTML, 'op. 27');
            });

            it('... should manage separators correctly between items and omit the last one', () => {
                fixture.componentRef.setInput('items', [
                    expectedRootItem,
                    { label: 'Serie I', route: [] },
                    { label: '', route: [] },
                ]);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, '.mx-1', 2, 2);
            });

            describe('... with specific input items', () => {
                describe('... if preface view is given', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('items', [expectedRootItem, { label: PREFACE.short, route: [] }]);
                        fixture.detectChanges();
                    });

                    it('... should display edition root and preface heading (without final slash)', () => {
                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const expectedBreadcrumb = `${EDITION.short}/${PREFACE.short}`;

                        expectToBe(hEl.textContent?.trim(), expectedBreadcrumb);
                    });

                    it('... should have one router link (to series overview)', () => {
                        const expectedLinkLength = 1;

                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(hDes[0], 'a', expectedLinkLength, expectedLinkLength);

                        const linkDes = getAndExpectDebugElementByDirective(
                            hDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));

                        expectToBe(routerLinks.length, expectedLinkLength);
                        expectToEqual(routerLinks[0].urlTree.toString(), expectedRootItem.route.join('/'));
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

                    it('... should display edition root and rowtables heading (without final slash)', () => {
                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const expectedBreadcrumb = `${EDITION.short}/${ROWTABLES.full}`;

                        expectToBe(hEl.textContent?.trim(), expectedBreadcrumb);
                    });

                    it('... should have one router link (back to series overview)', () => {
                        const expectedLinkLength = 1;

                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(hDes[0], 'a', expectedLinkLength, expectedLinkLength);

                        const linkDes = getAndExpectDebugElementByDirective(
                            hDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));

                        expectToBe(routerLinks.length, expectedLinkLength);
                        expectToEqual(routerLinks[0].urlTree.toString(), expectedRootItem.route.join('/'));
                    });
                });

                describe('... if no series and section is given (root)', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('items', [
                            { ...expectedRootItem, route: [] },
                            { label: '', route: [] },
                        ]);
                        fixture.detectChanges();
                    });

                    it('... should display edition root (with final slash)', () => {
                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const expectedBreadcrumb = `${EDITION.short}/`;

                        expectToBe(hEl.textContent?.trim(), expectedBreadcrumb);
                    });

                    it('... should have no router link, but only span', () => {
                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(hDes[0], 'a', 0, 0);
                        getAndExpectDebugElementByCss(hDes[0], 'span:not(.mx-1)', 1, 1);
                    });
                });

                describe('... if series, but no section is given', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('items', [
                            expectedRootItem,
                            { label: expectedSeries.series.full, route: [] },
                            { label: '', route: [] },
                        ]);
                        fixture.detectChanges();
                    });

                    it('... should display edition root and series (with final slash)', () => {
                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const expectedBreadcrumb = `${EDITION.short}/${expectedSeries.series.full}/`;

                        expectToBe(hEl.textContent?.trim(), expectedBreadcrumb);
                    });

                    it('... should have one router link (to edition series overview)', () => {
                        const expectedLinkLength = 1;

                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(hDes[0], 'a', expectedLinkLength, expectedLinkLength);
                        const linkDes = getAndExpectDebugElementByDirective(
                            hDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));

                        expectToBe(routerLinks.length, expectedLinkLength);
                        expectToEqual(routerLinks[0].urlTree.toString(), expectedRootItem.route.join('/'));
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
                            { label: '', route: [] },
                        ]);
                        fixture.detectChanges();
                    });

                    it('... should display edition root, series and section (with final slash)', () => {
                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const expectedBreadcrumb = `${EDITION.short}/${expectedSeries.series.full}/${expectedSection.section.full}/`;

                        expectToBe(hEl.textContent?.trim(), expectedBreadcrumb);
                    });

                    it('... should have two router links (to series overview and current edition series)', () => {
                        const expectedLinkLength = 2;
                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);

                        const linkDes = getAndExpectDebugElementByDirective(
                            hDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));

                        expectToEqual(routerLinks[0].urlTree.toString(), expectedRootItem.route.join('/'));
                        expectToEqual(
                            routerLinks[1].urlTree.toString(),
                            [...expectedRootItem.route, expectedSeries.series.route].join('/')
                        );
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
                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const expectedBreadcrumb = `${EDITION.short}/${expectedSeries.series.full}/${expectedSection.section.full}/${EDITION_INTRO.full}`;

                        expectToBe(hEl.textContent?.trim(), expectedBreadcrumb);
                    });

                    it('... should have three router links (to series overview, current edition series and section overview)', async () => {
                        const expectedLinkLength = 3;

                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(hDes[0], 'a', expectedLinkLength, expectedLinkLength);

                        const linkDes = getAndExpectDebugElementByDirective(
                            hDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));

                        expectToBe(routerLinks.length, expectedLinkLength);
                        expectToEqual(routerLinks[0].urlTree.toString(), expectedRootItem.route.join('/'));
                        expectToEqual(
                            routerLinks[1].urlTree.toString(),
                            [...expectedRootItem.route, expectedSeries.series.route].join('/')
                        );
                        expectToEqual(routerLinks[2].urlTree.toString(), expectedSection.labeledRoute.route.join('/'));
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

                    it('... should display edition root, series, section and complex (without final slash)', () => {
                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const complexShortWithSpace = expectedComplex.complexId.short.replace(/&nbsp;/g, '\u00A0');
                        const expectedBreadcrumb = `${EDITION.short}/${series.full}/${section.full}/${complexShortWithSpace}`;

                        expectToBe(hEl.textContent?.trim(), expectedBreadcrumb);
                    });

                    it('... should have three router links (to series overview, current series, and current section)', () => {
                        const expectedLinkLength = 3;

                        const hDes = getAndExpectDebugElementByCss(compDe, 'h6.awg-edition-info-breadcrumb', 1, 1);
                        getAndExpectDebugElementByCss(hDes[0], 'a', expectedLinkLength, expectedLinkLength);

                        const linkDes = getAndExpectDebugElementByDirective(
                            hDes[0],
                            RouterLink,
                            expectedLinkLength,
                            expectedLinkLength
                        );
                        const routerLinks = linkDes.map(de => de.injector.get(RouterLink));

                        expectToBe(routerLinks.length, expectedLinkLength);
                        expectToEqual(routerLinks[0].urlTree.toString(), expectedRootItem.route.join('/'));
                        expectToEqual(
                            routerLinks[1].urlTree.toString(),
                            [...expectedRootItem.route, series.route].join('/')
                        );
                        expectToEqual(routerLinks[2].urlTree.toString(), labeledSectionRoute.route.join('/'));
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
                const urlTree0 = routerLinks[0].urlTree;
                const urlTree1 = routerLinks[1].urlTree;
                const urlTree2 = routerLinks[2].urlTree;

                expectToBe(urlTree0.toString(), expectedRootItem.route.join('/'));
                expectToBe(urlTree1.toString(), [...expectedRootItem.route, series.route].join('/'));
                expectToBe(urlTree2.toString(), labeledSectionRoute.route.join('/'));
            });

            const clickTestCases = [
                { index: 0, name: 'edition root', expectedRouterLink: () => expectedRootItem.route.join('/') },
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

                expect(navigateSpy).toHaveBeenCalledOnce();
                const actualUrl = navigateSpy.mock.calls[0][0].toString();

                expectToBe(actualUrl, expectedRouterLink());

                navigateSpy.mockRestore();
            });
        });
    });
});
