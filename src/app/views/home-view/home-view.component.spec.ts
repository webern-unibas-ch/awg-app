import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { META_DATA } from '@awg-core/core-data';
import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineSection } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService } from '@awg-views/edition-view/services';
import { HOME_VIEW_CARD_DATA } from '@awg-views/home-view/data';
import { HomeViewCard } from '@awg-views/home-view/models';

import { HomeViewComponent } from './home-view.component';

// Mock components
@Component({
    selector: 'awg-alert-info',
    template: '',
    standalone: false,
})
class AlertInfoStubComponent {
    @Input()
    infoMessage: string;
}

@Component({
    selector: 'awg-heading',
    template: '',
    standalone: false,
})
class HeadingStubComponent {
    @Input()
    title: string;
    @Input()
    id: string;
}

@Component({
    selector: 'awg-home-view-card',
    template: '',
    standalone: false,
})
class HomeViewCardStubComponent {
    @Input()
    cardData: HomeViewCard;
}

/** Helper function */
function getRouterlinks(sections: EditionOutlineSection[]): string[][] {
    const { EDITION, SERIES, SECTION, ROWTABLES } = EDITION_ROUTE_CONSTANTS;

    const sectionLinks = sections.map(section => [
        EDITION.route,
        SERIES.route,
        section?.seriesParent?.route,
        SECTION.route,
        section?.section?.route,
    ]);
    const rowTablesLink = [[EDITION.route, ROWTABLES.route]];
    const contactLink = [['/contact']];

    return [...sectionLinks, ...rowTablesLink, ...contactLink];
}

describe('HomeViewComponent (DONE)', () => {
    let component: HomeViewComponent;
    let fixture: ComponentFixture<HomeViewComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let provideMetaDataSpy: Spy;

    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;
    let expectedTitle: string;
    let expectedId: string;
    let expectedDisclaimerInfoMessage: string;
    let expectedHomeViewCardData: HomeViewCard[];
    let expectedPageMetaData: MetaPage;
    let expectedSections: EditionOutlineSection[];

    let expectedRouterlinks: string[][];

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeViewComponent,
                AlertInfoStubComponent,
                HeadingStubComponent,
                HomeViewCardStubComponent,
                RouterLinkStubDirective,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedTitle = 'Anton Webern Gesamtausgabe: Online-Edition';
        expectedId = 'awg-home-view';
        expectedDisclaimerInfoMessage =
            'Die Online-Edition wird in Bezug auf Umfang und Funktionalität kontinuierlich erweitert.';
        expectedHomeViewCardData = HOME_VIEW_CARD_DATA;
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];
        expectedSections = [
            EditionOutlineService.getEditionSectionById('1', '5'),
            EditionOutlineService.getEditionSectionById('2', '2a'),
        ];
        expectedRouterlinks = getRouterlinks(expectedSections);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        provideMetaDataSpy = spyOn(component, 'provideMetaData').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have title and id', () => {
            expectToBe(component.homeViewTitle, expectedTitle);
            expectToBe(component.homeViewId, expectedId);
        });

        it('... should have `DISPLAYED_SECTIONS`', () => {
            expectToEqual(component.DISPLAYED_SECTIONS, expectedSections);
        });

        it('... should have as many `DISPLAYED_SECTIONS` as there are sections in the array', () => {
            expectToEqual(component.DISPLAYED_SECTIONS.length, expectedSections.length);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToBe(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        it('... should have `disclaimerInfoMessage`', () => {
            expectToBe(component.disclaimerInfoMessage, expectedDisclaimerInfoMessage);
        });

        it('... should have `homeViewCardData`', () => {
            expectToEqual(component.homeViewCardData, expectedHomeViewCardData);
        });

        it('... should not have pageMetaData', () => {
            expect(component.pageMetaData).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-home-view`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
            });

            it('... should contain one `awg-heading` component in `div.awg-home-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
            });

            it('... should not pass down `title` and `id` to heading component', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeUndefined();
                expect(headingCmp.id).toBeUndefined();
            });

            it('... should contain one `div.awg-home-view-content` in `div.awg-home-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-home-view-content', 1, 1);
            });

            it('... should contain an AlertInfoComponent (stubbed) in `div.awg-home-view-content`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], AlertInfoStubComponent, 1, 1);
            });

            it('... should not pass down infoMessage to AlertInfoComponent yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                const alertInfoDes = getAndExpectDebugElementByDirective(divDes[0], AlertInfoStubComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoStubComponent) as AlertInfoStubComponent;

                expect(alertInfoCmp.infoMessage).toBeUndefined();
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

            describe('... should not render links in `div.awg-home-view-text` yet to', () => {
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

        describe('#provideMetaData()', () => {
            it('... should have a method `provideMetaData`', () => {
                expect(component.provideMetaData).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(provideMetaDataSpy, 0);
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

            it('... should pass down `title` and `id` to heading component', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expectToBe(headingCmp.title, expectedTitle);

                expectToBe(headingCmp.id, expectedId);
            });

            it('... should contain one `div.awg-home-view-content` in `div.awg-home-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-home-view-content', 1, 1);
            });

            it('... should contain an AlertInfoComponent (stubbed) in `div.awg-home-view-content`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], AlertInfoStubComponent, 1, 1);
            });

            it('... should pass down infoMessage to AlertInfoComponent', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-content', 1, 1);
                const alertInfoDes = getAndExpectDebugElementByDirective(divDes[0], AlertInfoStubComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoStubComponent) as AlertInfoStubComponent;

                expectToBe(alertInfoCmp.infoMessage, expectedDisclaimerInfoMessage);
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

                    expectToEqual(cardCmp.cardData, expectedHomeViewCardData[index]);
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

                    const dspRoute = 'dsp-app';

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

                    const missionRoute = 'mission';

                    expect(daschMissionEl).toBeDefined();
                    expectToBe(daschMissionEl.href, expectedPageMetaData.daschUrl + missionRoute);
                    expectToBe(daschMissionEl.textContent, 'Mission Statement DaSCH');
                });

                it('... GitHub', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const githubDes = getAndExpectDebugElementByCss(divDes[0], 'a#github-link', 1, 1);
                    const githubEl: HTMLAnchorElement = githubDes[0].nativeElement;

                    expect(githubEl).toBeDefined();
                    expectToBe(githubEl.href, expectedPageMetaData.githubUrl);
                    expectToBe(githubEl.textContent, 'GitHub');
                });

                it('... Zenodo', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-text', 1, 1);
                    const zenodoDes = getAndExpectDebugElementByCss(divDes[0], 'a#zenodo-link', 1, 1);
                    const zenodoEl: HTMLAnchorElement = zenodoDes[0].nativeElement;

                    expect(zenodoEl).toBeDefined();
                    expectToBe(zenodoEl.href, expectedPageMetaData.zenodoUrl);
                    expectToBe(zenodoEl.textContent, 'Zenodo');
                });
            });
        });

        describe('#provideMetaData()', () => {
            it('... should have been called', () => {
                expectSpyCall(provideMetaDataSpy, 1);
            });

            it('... should return pageMetaData', () => {
                expectToEqual(component.pageMetaData, expectedPageMetaData);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLinkStubDirective,
                    expectedRouterlinks.length,
                    expectedRouterlinks.length
                );

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedRouterlinks.length);
            });

            it('... can get correct linkParams from template', () => {
                routerLinks.forEach((routerLink, index) => {
                    expectToEqual(routerLink.linkParams, expectedRouterlinks[index]);
                });
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink, index) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedRouterlinks[index];

                    expectToBe(routerLink.navigatedTo, null);

                    click(linkDe);
                    fixture.detectChanges();

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                });
            });
        });
    });
});
