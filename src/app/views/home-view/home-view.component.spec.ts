import { Component, DebugElement, input, isSignal, model } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { AlertInfoComponent } from '@awg-shared/alert-info/alert-info.component';
import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { META_DATA } from '@awg-shared/meta/meta.data';
import { MetaPage, MetaSectionTypes } from '@awg-shared/meta/meta.model';
import { ScrollToTopButtonComponent } from '@awg-shared/scroll-to-top-button/scroll-to-top-button.component';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionOutlineSection, EditionSectionLink } from '@awg-views/edition-view/models';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { HomeViewCardComponent } from './home-view-card/home-view-card.component';
import { HOME_VIEW_CARD_DATA } from './home-view-card/home-view-card.data';
import { HomeViewCard } from './home-view-card/home-view-card.model';

import { HomeViewComponent } from './home-view.component';

// Mock components
@Component({
    selector: 'awg-alert-info',
    template: '',
})
class AlertInfoStubComponent {
    infoMessage = input.required<string>();
    isOpen = model<boolean>(true);
}

@Component({
    selector: 'awg-heading',
    template: '',
})
class HeadingStubComponent {
    title = input.required<string>();
    id = input.required<string>();
}

@Component({
    selector: 'awg-home-view-card',
    template: '',
})
class HomeViewCardStubComponent {
    cardData = input.required<HomeViewCard>();
}

@Component({
    selector: 'awg-scroll-to-top-button',
    template: '',
})
class ScrollToTopButtonStubComponent {}

/** Helper function */
function getRouterlinks(sections: EditionOutlineSection[]): string[][] {
    const { EDITION, ROWTABLES } = EDITION_ROUTE_CONSTANTS;

    return [
        ...sections.map(sec => sec.labeledRoute.route),
        [EDITION.route, ROWTABLES.route],
        ['/contact#awg-documentation'],
    ];
}

describe('HomeViewComponent (DONE)', () => {
    let component: HomeViewComponent;
    let fixture: ComponentFixture<HomeViewComponent>;
    let compDe: DebugElement;

    let editionOutlineService: EditionOutlineService;
    let router: Router;

    let outlineServiceGetEditionSectionByIdSpy: Spy;

    let expectedHomeViewId: string;
    let expectedHomeViewTitle: string;
    let expectedDisclaimerMessage: string;
    let expectedHomeViewCardData: HomeViewCard[];
    let expectedPageMetaData: MetaPage;
    let expectedSections: EditionOutlineSection[];
    let expectedSectionLinksData: EditionSectionLink[];

    let expectedRouterLinks: string[][];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeViewComponent],
            providers: [provideRouter([])],
        })
            .overrideComponent(HomeViewComponent, {
                remove: {
                    imports: [AlertInfoComponent, HeadingComponent, HomeViewCardComponent, ScrollToTopButtonComponent],
                },
                add: {
                    imports: [
                        AlertInfoStubComponent,
                        HeadingStubComponent,
                        HomeViewCardStubComponent,
                        ScrollToTopButtonStubComponent,
                    ],
                },
            })
            .compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionOutlineService = TestBed.inject(EditionOutlineService);
        router = TestBed.inject(Router);

        // Service spies
        outlineServiceGetEditionSectionByIdSpy = vi
            .spyOn(editionOutlineService, 'getEditionSectionById')
            .mockImplementation((seriesId: string, sectionId: string) => {
                try {
                    return EditionStateHelper.getSection(seriesId, sectionId);
                } catch {
                    return null;
                }
            });

        // Test data
        expectedHomeViewId = 'awg-home-view-heading';
        expectedHomeViewTitle = 'Anton Webern Gesamtausgabe: Online-Edition';
        expectedDisclaimerMessage =
            'Die Online-Edition wird in Bezug auf Umfang und Funktionalität kontinuierlich erweitert.';

        expectedHomeViewCardData = HOME_VIEW_CARD_DATA;
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];

        expectedSections = [EditionStateHelper.getSection('1', '5'), EditionStateHelper.getSection('2', '2a')];
        expectedSectionLinksData = [
            {
                route: expectedSections[0].labeledRoute.route,
                shortTitle: expectedSections[0].labeledRoute.label,
                fullTitle: expectedSections[0].section.full,
                separator: ' und ',
            },
            {
                route: expectedSections[1].labeledRoute.route,
                shortTitle: expectedSections[1].labeledRoute.label,
                fullTitle: expectedSections[1].section.full,
                separator: '',
            },
        ];
        expectedRouterLinks = getRouterlinks(expectedSections);

        // Create component fixture
        fixture = TestBed.createComponent(HomeViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have home view `id` and `title`', () => {
            expectToBe(component.HOME_VIEW_ID, expectedHomeViewId);
            expectToBe(component.HOME_VIEW_TITLE, expectedHomeViewTitle);
        });

        it('... should have `DISCLAIMER_MESSAGE`', () => {
            expectToBe(component.DISCLAIMER_MESSAGE, expectedDisclaimerMessage);
        });

        it('... should have `homeViewCardData`', () => {
            expectToEqual(component.homeViewCardData, expectedHomeViewCardData);
        });

        it('... should have `pageMetaData`', () => {
            expectToEqual(component.pageMetaData, expectedPageMetaData);
        });

        it('... should have signal `sectionLinksData` to hold the provided data (via service)', () => {
            expectToBe(isSignal(component.sectionLinksData), true);

            expectToEqual(component.sectionLinksData(), expectedSectionLinksData);
        });

        it('... should filter out undefined sections in signal `sectionLinksData`', () => {
            outlineServiceGetEditionSectionByIdSpy
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(expectedSections[1]);

            const freshFixture = TestBed.createComponent(HomeViewComponent);
            const freshComponent = freshFixture.componentInstance;

            const result = freshComponent.sectionLinksData();

            expectToNotContain(result, undefined);
            expectToBe(result.length, expectedSectionLinksData.length - 1);
            expectToEqual(result[0], expectedSectionLinksData[1]);
        });

        it('... should have signal `rowtablesRoute` to hold the provided route', () => {
            expectToBe(isSignal(component.rowtablesRoute), true);

            expectToEqual(component.rowtablesRoute(), expectedRouterLinks.at(-2));
        });

        describe('VIEW', () => {
            const getHomeViewDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
            const getHomeViewContentDes = () =>
                getAndExpectDebugElementByCss(getHomeViewDes()[0], 'div.awg-home-view-content', 1, 1);

            it('... should contain one `div.awg-home-view`', () => {
                getHomeViewDes();
            });

            it('... should contain one ScrollToTop component (stubbed) in `div.awg-home-view`', () => {
                getAndExpectDebugElementByDirective(getHomeViewDes()[0], ScrollToTopButtonStubComponent, 1, 1);
            });

            it('... should contain one `awg-heading` component in `div.awg-home-view`', () => {
                getAndExpectDebugElementByDirective(getHomeViewDes()[0], HeadingStubComponent, 1, 1);
            });

            it('... should throw when accessing heading component inputs (`id` and `title`) due to missing initial data binding', () => {
                const headingDes = getAndExpectDebugElementByDirective(getHomeViewDes()[0], HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(() => headingCmp.title()).toThrow();
                expect(() => headingCmp.id()).toThrow();
            });

            it('... should contain one `div.awg-home-view-content` in `div.awg-home-view`', () => {
                getHomeViewContentDes();
            });

            it('... should contain an AlertInfoComponent (stubbed) in `div.awg-home-view-content`', () => {
                getAndExpectDebugElementByDirective(getHomeViewContentDes()[0], AlertInfoStubComponent, 1, 1);
            });

            it('... should throw when accessing AlertInfoComponent inputs (`infoMessage`) due to missing initial data binding', () => {
                const alertInfoDes = getAndExpectDebugElementByDirective(
                    getHomeViewContentDes()[0],
                    AlertInfoStubComponent,
                    1,
                    1
                );
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoStubComponent) as AlertInfoStubComponent;

                expect(() => alertInfoCmp.infoMessage()).toThrow();
            });

            it('... should contain one `div.awg-home-view-grid` in `div.awg-home-view-content`', () => {
                getAndExpectDebugElementByCss(getHomeViewContentDes()[0], 'div.awg-home-view-grid', 1, 1);
            });

            it('... should not contain any HomeViewCardComponent in `div.awg-home-view-grid` yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-grid', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HomeViewCardStubComponent, 0, 0);
            });

            it('... should contain one `div.awg-home-view-text` in `div.awg-home-view-content`', () => {
                getAndExpectDebugElementByCss(getHomeViewContentDes()[0], 'div.awg-home-view-text', 1, 1);
            });

            describe('... should not render links in `div.awg-home-view-text` yet for', () => {
                it.each([
                    { name: 'DSP', id: 'a#dsp-link' },
                    { name: 'DaSCH', id: 'a#dasch-link' },
                    { name: 'DaSCH mission', id: 'a#dasch-mission-link' },
                    { name: 'GitHub', id: 'a#github-link' },
                    { name: 'Zenodo', id: 'a#zenodo-link' },
                ])('... $name', ({ id }) => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const linkDes = getAndExpectDebugElementByCss(divDes[0], id, 1, 1);
                    const linkEl: HTMLAnchorElement = linkDes[0].nativeElement;

                    expect(linkEl).toBeDefined();
                    expectToBe(linkEl.href, '');
                });
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            const getHomeViewDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
            const getHomeViewContentDes = () =>
                getAndExpectDebugElementByCss(getHomeViewDes()[0], 'div.awg-home-view-content', 1, 1);
            const getHomeViewGridDes = () =>
                getAndExpectDebugElementByCss(getHomeViewContentDes()[0], 'div.awg-home-view-grid', 1, 1);

            it('... should contain one `awg-heading` component in `div.awg-home-view`', () => {
                getAndExpectDebugElementByDirective(getHomeViewDes()[0], HeadingStubComponent, 1, 1);
            });

            it('... should pass down correct values to heading component (`id` and `title`)', () => {
                const headingDes = getAndExpectDebugElementByDirective(getHomeViewDes()[0], HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expectToBe(headingCmp.id(), expectedHomeViewId);
                expectToBe(headingCmp.title(), expectedHomeViewTitle);
            });

            it('... should contain one `div.awg-home-view-content` in `div.awg-home-view`', () => {
                getHomeViewContentDes();
            });

            it('... should contain an AlertInfoComponent (stubbed) in `div.awg-home-view-content`', () => {
                getAndExpectDebugElementByDirective(getHomeViewContentDes()[0], AlertInfoStubComponent, 1, 1);
            });

            it('... should pass down correct values to AlertInfoComponent (`infoMessage `)', () => {
                const alertInfoDes = getAndExpectDebugElementByDirective(
                    getHomeViewContentDes()[0],
                    AlertInfoStubComponent,
                    1,
                    1
                );
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoStubComponent) as AlertInfoStubComponent;

                expectToBe(alertInfoCmp.infoMessage(), expectedDisclaimerMessage);
            });

            it('... should contain one `div.awg-home-view-grid` in `div.awg-home-view-content`', () => {
                getHomeViewGridDes();
            });

            it('... should contain as many `div.col` in `div.awg-home-view-grid` as entries in `homeViewCardData`', () => {
                getAndExpectDebugElementByCss(
                    getHomeViewGridDes()[0],
                    'div.col',
                    expectedHomeViewCardData.length,
                    expectedHomeViewCardData.length
                );
            });

            it('... should contain as many HomeViewCardComponents in `div.awg-home-view-grid > div.col` as entries in `homeViewCardData`', () => {
                const colDes = getAndExpectDebugElementByCss(
                    getHomeViewGridDes()[0],
                    'div.col',
                    expectedHomeViewCardData.length,
                    expectedHomeViewCardData.length
                );

                colDes.forEach(colDe => {
                    getAndExpectDebugElementByDirective(colDe, HomeViewCardStubComponent, 1, 1);
                });
            });

            it('... should pass down `cardData` to HomeViewCardComponents', () => {
                const colDes = getAndExpectDebugElementByCss(
                    getHomeViewGridDes()[0],
                    'div.col',
                    expectedHomeViewCardData.length,
                    expectedHomeViewCardData.length
                );

                colDes.forEach((colDe, index) => {
                    const cardDes = getAndExpectDebugElementByDirective(colDe, HomeViewCardStubComponent, 1, 1);
                    const cardCmp = cardDes[0].injector.get(HomeViewCardStubComponent) as HomeViewCardStubComponent;

                    expectToEqual(cardCmp.cardData(), expectedHomeViewCardData[index]);
                });
            });

            it('... should contain one `div.awg-home-view-text` in `div.awg-home-view-content`', () => {
                getAndExpectDebugElementByCss(getHomeViewContentDes()[0], 'div.awg-home-view-text', 1, 1);
            });

            describe('... should render links to', () => {
                it.each([
                    {
                        name: 'DSP',
                        id: 'a#dsp-link',
                        url: () => expectedPageMetaData.daschUrl + 'services/data-deposit/dsp',
                        text: 'DaSCH Service Platform (DSP)',
                    },
                    {
                        name: 'DaSCH',
                        id: 'a#dasch-link',
                        url: () => expectedPageMetaData.daschUrl,
                        text: 'Swiss National Data & Service Center for the Humanities (DaSCH)',
                    },
                    {
                        name: 'DaSCH mission',
                        id: 'a#dasch-mission-link',
                        url: () => expectedPageMetaData.daschUrl + 'about-us/mission',
                        text: 'Mission Statement DaSCH',
                    },
                    {
                        name: 'GitHub',
                        id: 'a#github-link',
                        url: () => expectedPageMetaData.awgAppGithubUrl,
                        text: 'GitHub',
                    },
                    {
                        name: 'Zenodo',
                        id: 'a#zenodo-link',
                        url: () => expectedPageMetaData.awgAppZenodoUrl,
                        text: 'Zenodo',
                    },
                ])('... $name', ({ id, url, text }) => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const linkDes = getAndExpectDebugElementByCss(divDes[0], id, 1, 1);
                    const linkEl: HTMLAnchorElement = linkDes[0].nativeElement;

                    expect(linkEl).toBeDefined();
                    expectToBe(linkEl.href, url());
                    expectToBe(linkEl.textContent, text);
                });
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];

            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLink,
                    expectedRouterLinks.length,
                    expectedRouterLinks.length
                );

                routerLinks = linkDes.map(de => de.injector.get(RouterLink) as RouterLink);
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedRouterLinks.length);
            });

            it('... can get correct linkParams from template', () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const urlTree = routerLink.urlTree;

                    expectToBe(urlTree.toString(), expectedRouterLinks[index].join('/'));
                }
            });

            it('... can click all links in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                for (const [index] of routerLinks.entries()) {
                    navigateSpy.mockClear();

                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedRouterLinks[index];

                    await clickAndAwaitChanges(linkDe, fixture);

                    expect(navigateSpy).toHaveBeenCalled();
                    const firstCallArg = navigateSpy.mock.calls[0][0];
                    const actualUrl = firstCallArg.toString();

                    expectToBe(actualUrl, expectedRouterLink.join('/'));
                }

                navigateSpy.mockRestore();
            });
        });
    });
});
