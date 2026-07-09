import { Component, DebugElement, input, isSignal, model } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { AlertInfoComponent } from '@awg-shared/alert-info/alert-info.component';
import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { META_DATA } from '@awg-shared/meta/meta.data';
import { MetaPage, MetaSectionTypes } from '@awg-shared/meta/meta.model';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineSection, EditionSectionLink } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService } from '@awg-views/edition-view/services';

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

/** Helper function */
function getRouterlinks(sections: EditionOutlineSection[]): string[][] {
    const { EDITION, SERIES, SECTION, ROWTABLES } = EDITION_ROUTE_CONSTANTS;

    return [
        ...sections.map(sec => [
            EDITION.route,
            SERIES.route,
            sec?.seriesParent?.route,
            SECTION.route,
            sec?.section?.route,
        ]),
        [EDITION.route, ROWTABLES.route],
        ['/contact#awg-documentation'],
    ];
}

describe('HomeViewComponent (DONE)', () => {
    let component: HomeViewComponent;
    let fixture: ComponentFixture<HomeViewComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedHomeViewId: string;
    let expectedHomeViewTitle: string;
    let expectedDisclaimerMessage: string;
    let expectedHomeViewCardData: HomeViewCard[];
    let expectedPageMetaData: MetaPage;
    let expectedSectionLinksData: EditionSectionLink[];

    let expectedRouterlinks: string[][];

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeViewComponent],
            providers: [provideRouter([])],
        })
            .overrideComponent(HomeViewComponent, {
                remove: { imports: [AlertInfoComponent, HeadingComponent, HomeViewCardComponent] },
                add: { imports: [AlertInfoStubComponent, HeadingStubComponent, HomeViewCardStubComponent] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        // Inject services
        router = TestBed.inject(Router);

        // Test data
        expectedHomeViewId = 'awg-home-view-heading';
        expectedHomeViewTitle = 'Anton Webern Gesamtausgabe: Online-Edition';
        expectedDisclaimerMessage =
            'Die Online-Edition wird in Bezug auf Umfang und Funktionalität kontinuierlich erweitert.';

        expectedHomeViewCardData = HOME_VIEW_CARD_DATA;
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];

        const routes = EDITION_ROUTE_CONSTANTS;
        const expectedSections = [
            EditionOutlineService.getEditionSectionById('1', '5'),
            EditionOutlineService.getEditionSectionById('2', '2a'),
        ];
        expectedSectionLinksData = [
            {
                route: [routes.EDITION.route, routes.SERIES.route, '1', routes.SECTION.route, '5'],
                shortTitle: `${routes.EDITION.short} I/5`,
                fullTitle: expectedSections[0].section.full,
                separator: ' und ',
            },
            {
                route: [routes.EDITION.route, routes.SERIES.route, '2', routes.SECTION.route, '2a'],
                shortTitle: `${routes.EDITION.short} II/2a`,
                fullTitle: expectedSections[1].section.full,
                separator: '',
            },
        ];
        expectedRouterlinks = getRouterlinks(expectedSections);

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

        it('... should have signal `rowtablesRoute` to hold the provided route', () => {
            expectToBe(isSignal(component.rowtablesRoute), true);

            expectToEqual(component.rowtablesRoute(), expectedRouterlinks.at(-2));
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-home-view`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
            });

            it('... should contain one `awg-heading` component in `div.awg-home-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
            });

            it('... should throw when accessing heading component inputs (`id` and `title`) due to missing initial data binding', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(() => headingCmp.title()).toThrow();
                expect(() => headingCmp.id()).toThrow();
            });

            it('... should contain one `div.awg-home-view-content` in `div.awg-home-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-home-view-content', 1, 1);
            });

            it('... should contain an AlertInfoComponent (stubbed) in `div.awg-home-view-content`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], AlertInfoStubComponent, 1, 1);
            });

            it('... should throw when accessing AlertInfoComponent inputs (`infoMessage`) due to missing initial data binding', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                const alertInfoDes = getAndExpectDebugElementByDirective(divDes[0], AlertInfoStubComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoStubComponent) as AlertInfoStubComponent;

                expect(() => alertInfoCmp.infoMessage()).toThrow();
            });

            it('... should contain one `div.awg-home-view-grid` in `div.awg-home-view-content`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-home-view-grid', 1, 1);
            });

            it('... should not contain any HomeViewCardComponent in `div.awg-home-view-grid` yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-grid', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HomeViewCardStubComponent, 0, 0);
            });

            it('... should contain one `div.awg-home-view-text` in `div.awg-home-view-content`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-home-view-text', 1, 1);
            });

            describe('... should not render links in `div.awg-home-view-text` yet for ...', () => {
                it('... DSP', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const dspDes = getAndExpectDebugElementByCss(divDes[0], 'a#dsp-link', 1, 1);
                    const dspEl: HTMLAnchorElement = dspDes[0].nativeElement;

                    expect(dspEl).toBeDefined();
                    expectToBe(dspEl.href, '');
                });

                it('... DaSCH', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const daschDes = getAndExpectDebugElementByCss(divDes[0], 'a#dasch-link', 1, 1);
                    const daschEl: HTMLAnchorElement = daschDes[0].nativeElement;

                    expect(daschEl).toBeDefined();
                    expectToBe(daschEl.href, '');
                });

                it('... DaSCH mission', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const daschMissionDes = getAndExpectDebugElementByCss(divDes[0], 'a#dasch-mission-link', 1, 1);
                    const daschMissionEl: HTMLAnchorElement = daschMissionDes[0].nativeElement;

                    expect(daschMissionEl).toBeDefined();
                    expectToBe(daschMissionEl.href, '');
                });

                it('... GitHub', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const githubDes = getAndExpectDebugElementByCss(divDes[0], 'a#github-link', 1, 1);
                    const githubEl: HTMLAnchorElement = githubDes[0].nativeElement;

                    expect(githubEl).toBeDefined();
                    expectToBe(githubEl.href, '');
                });

                it('... Zenodo', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const zenodoDes = getAndExpectDebugElementByCss(divDes[0], 'a#zenodo-link', 1, 1);
                    const zenodoEl: HTMLAnchorElement = zenodoDes[0].nativeElement;

                    expect(zenodoEl).toBeDefined();
                    expectToBe(zenodoEl.href, '');
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
            it('... should contain one `awg-heading` component in `div.awg-home-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
            });

            it('... should pass down correct values to heading component (`id` and `title`)', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expectToBe(headingCmp.id(), expectedHomeViewId);
                expectToBe(headingCmp.title(), expectedHomeViewTitle);
            });

            it('... should contain one `div.awg-home-view-content` in `div.awg-home-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-home-view-content', 1, 1);
            });

            it('... should contain an AlertInfoComponent (stubbed) in `div.awg-home-view-content`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], AlertInfoStubComponent, 1, 1);
            });

            it('... should pass down correct values to AlertInfoComponent (`infoMessage `)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                const alertInfoDes = getAndExpectDebugElementByDirective(divDes[0], AlertInfoStubComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoStubComponent) as AlertInfoStubComponent;

                expectToBe(alertInfoCmp.infoMessage(), expectedDisclaimerMessage);
            });

            it('... should contain one `div.awg-home-view-grid` in `div.awg-home-view-content`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-home-view-grid', 1, 1);
            });

            it('... should contain as many `div.col` in `div.awg-home-view-grid` as entries in `homeViewCardData`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-grid', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'div.col',
                    expectedHomeViewCardData.length,
                    expectedHomeViewCardData.length
                );
            });

            it('... should contain as many HomeViewCardComponents in `div.awg-home-view-grid > div.col` as entries in `homeViewCardData`', () => {
                const colDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-home-view-grid > div.col',
                    expectedHomeViewCardData.length,
                    expectedHomeViewCardData.length
                );

                colDes.forEach(colDe => {
                    getAndExpectDebugElementByDirective(colDe, HomeViewCardStubComponent, 1, 1);
                });
            });

            it('... should pass down `cardData` to HomeViewCardComponents', () => {
                const colDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-home-view-grid > div.col',
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
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-home-view-text', 1, 1);
            });

            describe('... should render links to', () => {
                it('... DSP', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const dspDes = getAndExpectDebugElementByCss(divDes[0], 'a#dsp-link', 1, 1);
                    const dspEl: HTMLAnchorElement = dspDes[0].nativeElement;

                    const dspRoute = 'services/data-deposit/dsp';

                    expect(dspEl).toBeDefined();
                    expectToBe(dspEl.href, expectedPageMetaData.daschUrl + dspRoute);
                    expectToBe(dspEl.textContent, 'DaSCH Service Platform (DSP)');
                });

                it('... DaSCH', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const daschDes = getAndExpectDebugElementByCss(divDes[0], 'a#dasch-link', 1, 1);
                    const daschEl: HTMLAnchorElement = daschDes[0].nativeElement;

                    expect(daschEl).toBeDefined();
                    expectToBe(daschEl.href, expectedPageMetaData.daschUrl);
                    expectToBe(daschEl.textContent, 'Swiss National Data & Service Center for the Humanities (DaSCH)');
                });

                it('... DaSCH mission', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const daschMissionDes = getAndExpectDebugElementByCss(divDes[0], 'a#dasch-mission-link', 1, 1);
                    const daschMissionEl: HTMLAnchorElement = daschMissionDes[0].nativeElement;

                    const missionRoute = 'about-us/mission';

                    expect(daschMissionEl).toBeDefined();
                    expectToBe(daschMissionEl.href, expectedPageMetaData.daschUrl + missionRoute);
                    expectToBe(daschMissionEl.textContent, 'Mission Statement DaSCH');
                });

                it('... GitHub', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const githubDes = getAndExpectDebugElementByCss(divDes[0], 'a#github-link', 1, 1);
                    const githubEl: HTMLAnchorElement = githubDes[0].nativeElement;

                    expect(githubEl).toBeDefined();
                    expectToBe(githubEl.href, expectedPageMetaData.awgAppGithubUrl);
                    expectToBe(githubEl.textContent, 'GitHub');
                });

                it('... Zenodo', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const zenodoDes = getAndExpectDebugElementByCss(divDes[0], 'a#zenodo-link', 1, 1);
                    const zenodoEl: HTMLAnchorElement = zenodoDes[0].nativeElement;

                    expect(zenodoEl).toBeDefined();
                    expectToBe(zenodoEl.href, expectedPageMetaData.awgAppZenodoUrl);
                    expectToBe(zenodoEl.textContent, 'Zenodo');
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
                    expectedRouterlinks.length,
                    expectedRouterlinks.length
                );

                routerLinks = linkDes.map(de => de.injector.get(RouterLink) as RouterLink);
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedRouterlinks.length);
            });

            it('... can get correct linkParams from template', () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const urlTree = routerLink.urlTree;

                    expectToBe(urlTree.toString(), expectedRouterlinks[index].join('/'));
                }
            });

            it('... can click all links in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                for (const [index] of routerLinks.entries()) {
                    navigateSpy.mockClear();

                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedRouterlinks[index];

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
