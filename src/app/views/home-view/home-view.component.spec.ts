/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { METADATA } from '@awg-app/core/core-data';
import { MetaPage, MetaSectionTypes } from '@awg-app/core/core-models';
import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS, EDITION_TYPE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';

import { HomeViewComponent } from './home-view.component';

// Mock heading component
@Component({ selector: 'awg-heading', template: '' })
class HeadingStubComponent {
    @Input()
    title: string;
    @Input()
    id: string;
}

/** Helper function */
function generateExpectedOrderOfRouterlinks(editionComplexes: EditionComplex[]): string[][] {
    const editionAndGraphLinks = editionComplexes.flatMap(complex => {
        const routes = [[complex.baseRoute, EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route]];
        if (complex === EDITION_COMPLEXES.OP25) {
            routes.push([complex.baseRoute, EDITION_ROUTE_CONSTANTS.EDITION_GRAPH.route]);
        }
        return routes;
    });

    const structureLinks = [['/structure']];

    const editionLinks = editionComplexes.map(complex => [
        complex.baseRoute,
        EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route,
    ]);

    const otherLinks = [
        ['/edition', 'row-tables'],
        ['/data/search', 'fulltext'],
        ['/data/search', 'extended'],
        ['/contact'],
    ];

    return [...editionAndGraphLinks, ...structureLinks, ...editionLinks, ...otherLinks];
}

describe('HomeViewComponent (DONE)', () => {
    let component: HomeViewComponent;
    let fixture: ComponentFixture<HomeViewComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let mockRouter: Partial<Router>;

    const expectedTitle = 'Beispieleditionen ausgewählter Skizzen';
    const expectedId = 'awg-home-view';

    let expectedPageMetaData: MetaPage;
    let expectedEditionComplexes: EditionComplex[];
    let expectedOrderOfRouterlinks: string[][];

    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;
    const expectedEditionTypeConstants: typeof EDITION_TYPE_CONSTANTS = EDITION_TYPE_CONSTANTS;

    beforeEach(waitForAsync(() => {
        // Router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [HomeViewComponent, HeadingStubComponent, RouterLinkStubDirective],
            providers: [{ provide: Router, useValue: mockRouter }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedPageMetaData = METADATA[MetaSectionTypes.page];

        expectedEditionComplexes = [
            EDITION_COMPLEXES.OP12,
            EDITION_COMPLEXES.OP25,
            EDITION_COMPLEXES.M30,
            EDITION_COMPLEXES.M31,
            EDITION_COMPLEXES.M34,
            EDITION_COMPLEXES.M37,
        ];
        expectedOrderOfRouterlinks = generateExpectedOrderOfRouterlinks(expectedEditionComplexes);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
        spyOn(component, 'routeToSidenav').and.callThrough();
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

        it('... should have `DISPLAYED_EDITION_COMPLEXES`', () => {
            expectToEqual(component.DISPLAYED_EDITION_COMPLEXES, expectedEditionComplexes);
        });

        it('... should have as many `DISPLAYED_EDITION_COMPLEXES` as there are complexes in the array', () => {
            expectToEqual(component.DISPLAYED_EDITION_COMPLEXES.length, expectedEditionComplexes.length);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToBe(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        it('... should have `editionTypeConstants`', () => {
            expectToBe(component.editionTypeConstants, expectedEditionTypeConstants);
        });

        it('... should not have pageMetaData', () => {
            expect(component.pageMetaData).toBeUndefined();
        });

        describe('#provideMetaData()', () => {
            it('... should have a method `provideMetaData`', () => {
                expect(component.provideMetaData).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });
        });

        describe('#routeToSidenav()', () => {
            it('... should have a method `routeToSidenav`', () => {
                expect(component.routeToSidenav).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.routeToSidenav).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should not pass down `title` and `id` to heading component', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeUndefined();
                expect(headingCmp.id).toBeUndefined();
            });

            it('... should contain three `div.para` elements', () => {
                getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
            });

            it('... should have one h6 breadcrumb but no h3 info headers in first div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'h3.awg-edition-info-header', 0, 0);
            });

            it('... should not render bread crumb header in first div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const headerDes = getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expectToBe(headerEl.textContent, '');
            });

            it('... should have one h6 breadcrumb but no h3 info headers in second div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                getAndExpectDebugElementByCss(divDes[1], 'h6.awg-breadcrumb', 1, 1);
                getAndExpectDebugElementByCss(divDes[1], 'h3.awg-edition-info-header', 0, 0);
            });

            it('... should not render bread crumb header in second div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const headerDes = getAndExpectDebugElementByCss(divDes[1], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expectToBe(headerEl.textContent, '');
            });

            describe('... should not render links in main text block yet to', () => {
                it('... DSP', () => {
                    const dspDes = getAndExpectDebugElementByCss(compDe, 'a#dsp-link', 1, 1);
                    const dspEl = dspDes[0].nativeElement;

                    expect(dspEl).toBeDefined();
                    expect(dspEl.href).not.toBeTruthy();
                });

                it('... SALSAH', () => {
                    const salsahDes = getAndExpectDebugElementByCss(compDe, 'a#salsah-link', 1, 1);
                    const salsahEl = salsahDes[0].nativeElement;

                    expect(salsahEl).toBeDefined();
                    expect(salsahEl.href).not.toBeTruthy();
                });

                it('... DHLAB', () => {
                    const dhlabDes = getAndExpectDebugElementByCss(compDe, 'a#dhlab-link', 1, 1);
                    const dhlabEl = dhlabDes[0].nativeElement;

                    expect(dhlabEl).toBeDefined();
                    expect(dhlabEl.href).not.toBeTruthy();
                });

                it('... DaSCH', () => {
                    const daschDes = getAndExpectDebugElementByCss(compDe, 'a#dasch-link', 1, 1);
                    const daschEl = daschDes[0].nativeElement;

                    expect(daschEl).toBeDefined();
                    expect(daschEl.href).not.toBeTruthy();
                });

                it('... DaSCH mission', () => {
                    const daschMissionDes = getAndExpectDebugElementByCss(compDe, 'a#dasch-mission-link', 1, 1);
                    const daschMissionEl = daschMissionDes[0].nativeElement;

                    const missionRoute = 'visionandmission';

                    expect(daschMissionEl).toBeDefined();
                    expect(daschMissionEl.href).not.toBeTruthy();
                });

                it('... GitHub', () => {
                    const githubDes = getAndExpectDebugElementByCss(compDe, 'a#github-link', 1, 1);
                    const githubEl = githubDes[0].nativeElement;

                    expect(githubEl).toBeDefined();
                    expect(githubEl.href).not.toBeTruthy();
                });

                it('... Compodoc', () => {
                    const compodocDes = getAndExpectDebugElementByCss(compDe, 'a#compodoc-link', 1, 1);
                    const compodocEl = compodocDes[0].nativeElement;

                    expect(compodocEl).toBeDefined();
                    expect(compodocEl.href).not.toBeTruthy();
                });
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData()', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return pageMetaData', () => {
                expectToEqual(component.pageMetaData, expectedPageMetaData);
            });
        });

        describe('#routeToSideNav()', () => {
            let navigationSpy: Spy;

            beforeEach(() => {
                // Create spy of mockrouter SpyObj
                navigationSpy = mockRouter.navigate as jasmine.Spy;
            });

            it('... should have been called', () => {
                // Router navigation triggerd by onInit
                expect(component.routeToSidenav).toHaveBeenCalled();
            });

            it('... should have triggered `router.navigate`', () => {
                expectSpyCall(navigationSpy, 1);
            });

            it('... should tell ROUTER to navigate to `editionInfo` outlet', () => {
                const expectedRoute = 'editionInfo';

                // Catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const outletRoute = navArgs[0][0].outlets.side;

                expect(navArgs).toBeDefined();
                expect(navArgs[0]).toBeDefined();
                expectToBe(outletRoute, expectedRoute);

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });

            it('... should tell ROUTER to navigate with `preserveFragment:true`', () => {
                // Catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const navExtras = navArgs[1];

                expect(navExtras).toBeDefined();
                expectToBe(navExtras.preserveFragment, true);

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading component', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expectToBe(headingCmp.title, expectedTitle);

                expectToBe(headingCmp.id, expectedId);
            });

            it('... should render bread crumb header in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const headerDes = getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                const expectedBreadCrumb = ` ${expectedEditionRouteConstants.EDITION.short} / ${expectedEditionRouteConstants.SERIES_1.full} / ${expectedEditionRouteConstants.SECTION_5.full} `;

                expectToBe(headerEl.textContent, expectedBreadCrumb);
            });

            it('... should render title of edition info headers in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const titleDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'h3.awg-edition-info-header .awg-edition-info-header-title',
                    2,
                    2
                );

                const title0El = titleDes[0].nativeElement;
                const title1El = titleDes[1].nativeElement;

                expectToBe(title0El.innerHTML, expectedEditionComplexes[0].titleStatement.title);
                expectToBe(title1El.innerHTML, expectedEditionComplexes[1].titleStatement.title);
            });

            it('... should render catalogue number of edition info headers in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const catalogueDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    '.awg-edition-info-header .awg-edition-info-header-catalogue',
                    2,
                    2
                );

                const catalogue0El = catalogueDes[0].nativeElement;
                const catalogue1El = catalogueDes[1].nativeElement;

                expectToBe(catalogue0El.innerHTML, expectedEditionComplexes[0].complexId.short);
                expectToBe(catalogue1El.innerHTML, expectedEditionComplexes[1].complexId.short);
            });

            it('... should render edition type links in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const aDes = getAndExpectDebugElementByCss(divDes[0], '.awg-edition-info-header a', 3, 3);

                const a0El = aDes[0].nativeElement;
                const a1El = aDes[1].nativeElement;
                const a2El = aDes[2].nativeElement;

                expect(a0El).toBeDefined();
                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();

                expectToBe(a0El.textContent, expectedEditionTypeConstants.SKETCH_EDITION.full);
                expectToBe(a1El.textContent, expectedEditionTypeConstants.SKETCH_EDITION.full);
                expectToBe(a2El.textContent, expectedEditionRouteConstants.EDITION_GRAPH.short);
            });

            it('... should render bread crumb header in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const headerDes = getAndExpectDebugElementByCss(divDes[1], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                const expectedBreadCrumb = ` ${expectedEditionRouteConstants.EDITION.short} / ${expectedEditionRouteConstants.SERIES_2.full} / ${expectedEditionRouteConstants.SECTION_2A.full} `;

                expectToBe(headerEl.textContent, expectedBreadCrumb);
            });

            it('... should render title of edition info headers in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const titleDes = getAndExpectDebugElementByCss(
                    divDes[1],
                    'h3.awg-edition-info-header .awg-edition-info-header-title',
                    3,
                    3
                );
                const title1El = titleDes[0].nativeElement;
                const title2El = titleDes[1].nativeElement;
                const title3El = titleDes[2].nativeElement;

                expectToBe(title1El.innerHTML, expectedEditionComplexes[2].titleStatement.title);
                expectToBe(title2El.innerHTML, expectedEditionComplexes[3].titleStatement.title);
                expectToBe(title3El.innerHTML, expectedEditionComplexes[4].titleStatement.title);
            });

            it('... should render catalogue number of edition info headers in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const catalogueDes = getAndExpectDebugElementByCss(
                    divDes[1],
                    '.awg-edition-info-header .awg-edition-info-header-catalogue',
                    3,
                    3
                );
                const catalogue1El = catalogueDes[0].nativeElement;
                const catalogue2El = catalogueDes[1].nativeElement;
                const catalogue3El = catalogueDes[2].nativeElement;

                expectToBe(catalogue1El.innerHTML, expectedEditionComplexes[2].complexId.short);
                expectToBe(catalogue2El.innerHTML, expectedEditionComplexes[3].complexId.short);
                expectToBe(catalogue3El.innerHTML, expectedEditionComplexes[4].complexId.short);
            });

            it('... should render edition type links in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const aDes = getAndExpectDebugElementByCss(divDes[1], '.awg-edition-info-header a', 3, 3);

                const a1El = aDes[0].nativeElement;
                const a2El = aDes[1].nativeElement;
                const a3El = aDes[2].nativeElement;

                expectToBe(a1El.textContent, expectedEditionTypeConstants.SKETCH_EDITION.full);
                expectToBe(a2El.textContent, expectedEditionTypeConstants.SKETCH_EDITION.full);
                expectToBe(a3El.textContent, expectedEditionTypeConstants.SKETCH_EDITION.full);
            });

            describe('... should render links to', () => {
                it('... DSP', () => {
                    const dspDes = getAndExpectDebugElementByCss(compDe, 'a#dsp-link', 1, 1);
                    const dspEl = dspDes[0].nativeElement;

                    const dspRoute = 'dsp-app';

                    expect(dspEl).toBeDefined();
                    expectToBe(dspEl.href, expectedPageMetaData.daschUrl + dspRoute);
                    expectToBe(dspEl.textContent, 'DaSCH Service Platform (DSP)');
                });

                it('... SALSAH', () => {
                    const salsahDes = getAndExpectDebugElementByCss(compDe, 'a#salsah-link', 1, 1);
                    const salsahEl = salsahDes[0].nativeElement;

                    expect(salsahEl).toBeDefined();
                    expectToBe(salsahEl.href, expectedPageMetaData.salsahUrl);
                    expectToBe(salsahEl.textContent, 'SALSAH');
                });

                it('... DHLAB', () => {
                    const dhlabDes = getAndExpectDebugElementByCss(compDe, 'a#dhlab-link', 1, 1);
                    const dhlabEl = dhlabDes[0].nativeElement;

                    expect(dhlabEl).toBeDefined();
                    expectToBe(dhlabEl.href, expectedPageMetaData.dhlabUrl);
                    expectToBe(dhlabEl.textContent, 'Digital Humanities Lab');
                });

                it('... DaSCH', () => {
                    const daschDes = getAndExpectDebugElementByCss(compDe, 'a#dasch-link', 1, 1);
                    const daschEl = daschDes[0].nativeElement;

                    expect(daschEl).toBeDefined();
                    expectToBe(daschEl.href, expectedPageMetaData.daschUrl);
                    expectToBe(daschEl.textContent, 'Swiss National Data & Service Center for the Humanities (DaSCH)');
                });

                it('... DaSCH mission', () => {
                    const daschMissionDes = getAndExpectDebugElementByCss(compDe, 'a#dasch-mission-link', 1, 1);
                    const daschMissionEl = daschMissionDes[0].nativeElement;

                    const missionRoute = 'visionandmission';

                    expect(daschMissionEl).toBeDefined();
                    expectToBe(daschMissionEl.href, expectedPageMetaData.daschUrl + missionRoute);
                    expectToBe(daschMissionEl.textContent, 'Mission Statement DaSCH');
                });

                it('... GitHub', () => {
                    const githubDes = getAndExpectDebugElementByCss(compDe, 'a#github-link', 1, 1);
                    const githubEl = githubDes[0].nativeElement;

                    expect(githubEl).toBeDefined();
                    expectToBe(githubEl.href, expectedPageMetaData.githubUrl);
                    expectToBe(githubEl.textContent, 'GitHub');
                });

                it('... Compodoc', () => {
                    const compodocDes = getAndExpectDebugElementByCss(compDe, 'a#compodoc-link', 1, 1);
                    const compodocEl = compodocDes[0].nativeElement;

                    expect(compodocEl).toBeDefined();
                    expectToContain(compodocEl.href, expectedPageMetaData.compodocUrl);
                    expectToBe(compodocEl.textContent, 'dokumentiert');
                });
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLinkStubDirective,
                    expectedOrderOfRouterlinks.length,
                    expectedOrderOfRouterlinks.length
                );

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedOrderOfRouterlinks.length);
            });

            it('... can get correct linkParams from template', () => {
                routerLinks.forEach((routerLink, index) => {
                    expectToEqual(routerLink.linkParams, expectedOrderOfRouterlinks[index]);
                });
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink, index) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedOrderOfRouterlinks[index];

                    expect(routerLink.navigatedTo).toBeNull();

                    click(linkDe);
                    fixture.detectChanges();

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                });
            });
        });
    });
});
