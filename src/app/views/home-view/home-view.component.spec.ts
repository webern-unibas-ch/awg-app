/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { Router } from '@angular/router';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
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

describe('HomeViewComponent (DONE)', () => {
    let component: HomeViewComponent;
    let fixture: ComponentFixture<HomeViewComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let mockRouter: Partial<Router>;

    const expectedTitle = 'Beispieleditionen ausgewählter Skizzen';
    const expectedId = 'awg-home-view';

    let expectedEditionComplexOp12: EditionComplex;
    let expectedEditionComplexOp25: EditionComplex;
    let expectedEditionComplexM34: EditionComplex;

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
        expectedEditionComplexOp12 = EDITION_COMPLEXES.OP12;
        expectedEditionComplexOp25 = EDITION_COMPLEXES.OP25;
        expectedEditionComplexM34 = EDITION_COMPLEXES.M34;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'routeToSidenav').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should have title and id', () => {
            expect(component.homeViewTitle).toBeDefined();
            expect(component.homeViewTitle).withContext(`should be ${expectedTitle}`).toBe(expectedTitle);

            expect(component.homeViewId).toBeDefined();
            expect(component.homeViewId).withContext(`should be ${expectedId}`).toBe(expectedId);
        });

        it('should have edition complex for op. 12', () => {
            expect(component.EDITION_COMPLEX_OP12).toBeDefined();
            expect(component.EDITION_COMPLEX_OP12)
                .withContext(`should be ${expectedEditionComplexOp12}`)
                .toEqual(expectedEditionComplexOp12);
        });

        it('should have edition complex for op. 25', () => {
            expect(component.EDITION_COMPLEX_OP25).toBeDefined();
            expect(component.EDITION_COMPLEX_OP25)
                .withContext(`should be ${expectedEditionComplexOp25}`)
                .toEqual(expectedEditionComplexOp25);
        });

        it('should have edition complex for M 34', () => {
            expect(component.EDITION_COMPLEX_M34).toBeDefined();
            expect(component.EDITION_COMPLEX_M34)
                .withContext(`should be ${expectedEditionComplexM34}`)
                .toEqual(expectedEditionComplexM34);
        });

        describe('#routeToSidenav', () => {
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

            it('... should have one h6 and two h3 in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'h3.awg-edition-info-header', 2, 2);
            });

            it('... should not render bread crumb header in first div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const headerDes = getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).withContext('should be empty string').not.toBeTruthy();
            });

            it('... should not render title of edition info headers in first div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const titleDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'h3.awg-edition-info-header .awg-edition-info-header-title',
                    2,
                    2
                );

                const title1El = titleDes[0].nativeElement;
                const title2El = titleDes[1].nativeElement;

                expect(title1El).toBeDefined();
                expect(title2El).toBeDefined();

                expect(title1El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(title2El.textContent).withContext('should be empty string').not.toBeTruthy();
            });

            it('... should not render catalogue of edition info headers in first div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const catalogueDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    '.awg-edition-info-header .awg-edition-info-header-catalogue',
                    2,
                    2
                );

                const catalogue1El = catalogueDes[0].nativeElement;
                const catalogue2El = catalogueDes[1].nativeElement;

                expect(catalogue1El).toBeDefined();
                expect(catalogue2El).toBeDefined();

                expect(catalogue1El.innerHTML).withContext('should be empty string').not.toBeTruthy();
                expect(catalogue2El.innerHTML).withContext('should be empty string').not.toBeTruthy();
            });

            it('... should not render links of edition info headers in first div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const aDes = getAndExpectDebugElementByCss(divDes[0], '.awg-edition-info-header a', 3, 3);

                const a1El = aDes[0].nativeElement;
                const a2El = aDes[1].nativeElement;
                const a3El = aDes[2].nativeElement;

                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();
                expect(a3El).toBeDefined();

                expect(a1El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(a2El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(a3El.textContent).withContext('should be empty string').not.toBeTruthy();
            });

            it('... should have one h6 and one h3 in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                getAndExpectDebugElementByCss(divDes[1], 'h6.awg-breadcrumb', 1, 1);
                getAndExpectDebugElementByCss(divDes[1], 'h3.awg-edition-info-header', 1, 1);
            });

            it('... should not render bread crumb header in second div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const headerDes = getAndExpectDebugElementByCss(divDes[1], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).withContext('should be empty string').not.toBeTruthy();
            });

            it('... should not render title of edition info headers in second div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const titleDes = getAndExpectDebugElementByCss(
                    divDes[1],
                    'h3.awg-edition-info-header .awg-edition-info-header-title',
                    1,
                    1
                );

                const title1El = titleDes[0].nativeElement;

                expect(title1El).toBeDefined();

                expect(title1El.textContent).withContext('should be empty string').not.toBeTruthy();
            });

            it('... should not render catalogue of edition info headers in second div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const catalogueDes = getAndExpectDebugElementByCss(
                    divDes[1],
                    '.awg-edition-info-header .awg-edition-info-header-catalogue',
                    1,
                    1
                );
                const catalogue1El = catalogueDes[0].nativeElement;

                expect(catalogue1El).toBeDefined();
                expect(catalogue1El.innerHTML).withContext('should be empty string').not.toBeTruthy();
            });

            it('... should not render links of edition info headers in second div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const aDes = getAndExpectDebugElementByCss(divDes[1], '.awg-edition-info-header a', 1, 1);
                const a1El = aDes[0].nativeElement;

                expect(a1El).toBeDefined();
                expect(a1El.textContent).withContext('should be empty string').not.toBeTruthy();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#routeToSideNav', () => {
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

                expect(navArgs).withContext('should be defined').toBeDefined();
                expect(navArgs[0]).withContext('should be defined').toBeDefined();
                expect(outletRoute).withContext('should be defined').toBeDefined();
                expect(outletRoute).withContext('should be `editionInfo`').toBe(expectedRoute);

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });

            it('... should tell ROUTER to navigate with `preserveFragment:true`', () => {
                // Catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const navExtras = navArgs[1];

                expect(navExtras).withContext('should have navExtras').toBeDefined();
                expect(navExtras.preserveFragment).withContext('should be defined').toBeDefined();
                expect(navExtras.preserveFragment).withContext('should be `preserveFragment:true`').toBe(true);

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading component', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeTruthy();
                expect(headingCmp.title).withContext(`should have title: ${expectedTitle}`).toBe(expectedTitle);

                expect(headingCmp.id).toBeTruthy();
                expect(headingCmp.id).withContext(`should have id: ${expectedId}`).toBe(expectedId);
            });

            it('... should render bread crumb header in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const headerDes = getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                const expectedBreadCrumb = ` ${expectedEditionComplexOp12.editionRoute.short} / ${expectedEditionComplexOp12.series.full} / ${expectedEditionComplexOp12.section.full} `;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).withContext(`should be ${expectedBreadCrumb}`).toBe(expectedBreadCrumb);
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

                expect(title0El).toBeDefined();
                expect(title1El).toBeDefined();

                expect(title0El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexOp12.titleStatement.title}`)
                    .toBe(expectedEditionComplexOp12.titleStatement.title);
                expect(title1El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexOp25.titleStatement.title}`)
                    .toBe(expectedEditionComplexOp25.titleStatement.title);
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

                expect(catalogue0El).toBeDefined();
                expect(catalogue1El).toBeDefined();

                expect(catalogue0El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexOp12.complexId.short}`)
                    .toBe(expectedEditionComplexOp12.complexId.short);
                expect(catalogue1El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexOp25.complexId.short}`)
                    .toBe(expectedEditionComplexOp25.complexId.short);
            });

            it('... should render part links in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const aDes = getAndExpectDebugElementByCss(divDes[0], '.awg-edition-info-header a', 3, 3);

                const a0El = aDes[0].nativeElement;
                const a1El = aDes[1].nativeElement;
                const a2El = aDes[2].nativeElement;

                expect(a0El).toBeDefined();
                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();

                expect(a0El.textContent)
                    .withContext(`should be ${expectedEditionComplexOp12.type.full}`)
                    .toBe(expectedEditionComplexOp12.type.full);
                expect(a1El.textContent)
                    .withContext(`should be ${expectedEditionComplexOp25.type.full}`)
                    .toBe(expectedEditionComplexOp25.type.full);
                expect(a2El.textContent)
                    .withContext(`should be ${expectedEditionComplexOp25.graphRoute.short}`)
                    .toBe(expectedEditionComplexOp25.graphRoute.short);
            });

            it('... should render bread crumb header in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const headerDes = getAndExpectDebugElementByCss(divDes[1], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                const expectedBreadCrumb = ` ${expectedEditionComplexM34.editionRoute.short} / ${expectedEditionComplexM34.series.full} / ${expectedEditionComplexM34.section.full} `;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).withContext(`should be ${expectedBreadCrumb}`).toBe(expectedBreadCrumb);
            });

            it('... should render title of edition info headers in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const titleDes = getAndExpectDebugElementByCss(
                    divDes[1],
                    'h3.awg-edition-info-header .awg-edition-info-header-title',
                    1,
                    1
                );
                const title0El = titleDes[0].nativeElement;

                expect(title0El).toBeDefined();
                expect(title0El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexM34.titleStatement.title}`)
                    .toBe(expectedEditionComplexM34.titleStatement.title);
            });

            it('... should render catalogue number of edition info headers in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const catalogueDes = getAndExpectDebugElementByCss(
                    divDes[1],
                    '.awg-edition-info-header .awg-edition-info-header-catalogue',
                    1,
                    1
                );
                const catalogue0El = catalogueDes[0].nativeElement;

                expect(catalogue0El).toBeDefined();
                expect(catalogue0El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexM34.complexId.short}`)
                    .toBe(expectedEditionComplexM34.complexId.short);
            });

            it('... should render part links in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const aDes = getAndExpectDebugElementByCss(divDes[1], '.awg-edition-info-header a', 1, 1);
                const a0El = aDes[0].nativeElement;

                expect(a0El).toBeDefined();
                expect(a0El.textContent)
                    .withContext(`should be ${expectedEditionComplexM34.type.full}`)
                    .toBe(expectedEditionComplexM34.type.full);
            });

            describe('[routerLink]', () => {
                beforeEach(() => {
                    // Find DebugElements with an attached RouterLinkStubDirective
                    linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 12, 12);

                    // Get attached link directive instances using each DebugElement's injector
                    routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
                });

                it('... can get routerLinks from template', () => {
                    expect(routerLinks.length).withContext('should have 12 routerLinks').toBe(12);

                    expect(routerLinks[0].linkParams)
                        .withContext(
                            `should equal ${[
                                expectedEditionComplexOp12.baseRoute,
                                expectedEditionComplexOp12.introRoute.route,
                            ]}`
                        )
                        .toEqual([expectedEditionComplexOp12.baseRoute, expectedEditionComplexOp12.sheetsRoute.route]);

                    expect(routerLinks[1].linkParams)
                        .withContext(
                            `should equal ${[
                                expectedEditionComplexOp25.baseRoute,
                                expectedEditionComplexOp25.sheetsRoute.route,
                            ]}`
                        )
                        .toEqual([expectedEditionComplexOp25.baseRoute, expectedEditionComplexOp25.sheetsRoute.route]);

                    expect(routerLinks[2].linkParams)
                        .withContext(
                            `should equal ${[
                                expectedEditionComplexOp25.baseRoute,
                                expectedEditionComplexOp25.graphRoute.route,
                            ]}`
                        )
                        .toEqual([expectedEditionComplexOp25.baseRoute, expectedEditionComplexOp25.graphRoute.route]);

                    expect(routerLinks[3].linkParams)
                        .withContext(
                            `should equal ${[
                                expectedEditionComplexM34.baseRoute,
                                expectedEditionComplexM34.sheetsRoute.route,
                            ]}`
                        )
                        .toEqual([expectedEditionComplexM34.baseRoute, expectedEditionComplexM34.sheetsRoute.route]);

                    expect(routerLinks[4].linkParams)
                        .withContext(`should equal ${['/structure']}`)
                        .toEqual(['/structure']);

                    expect(routerLinks[5].linkParams)
                        .withContext(
                            `should equal ${[
                                expectedEditionComplexOp12.baseRoute,
                                expectedEditionComplexOp12.sheetsRoute.route,
                            ]}`
                        )
                        .toEqual([expectedEditionComplexOp12.baseRoute, expectedEditionComplexOp12.sheetsRoute.route]);

                    expect(routerLinks[6].linkParams)
                        .withContext(
                            `should equal ${[
                                expectedEditionComplexOp25.baseRoute,
                                expectedEditionComplexOp25.sheetsRoute.route,
                            ]}`
                        )
                        .toEqual([expectedEditionComplexOp25.baseRoute, expectedEditionComplexOp25.sheetsRoute.route]);

                    expect(routerLinks[7].linkParams)
                        .withContext(
                            `should equal ${[
                                expectedEditionComplexM34.baseRoute,
                                expectedEditionComplexM34.sheetsRoute.route,
                            ]}`
                        )
                        .toEqual([expectedEditionComplexM34.baseRoute, expectedEditionComplexM34.sheetsRoute.route]);

                    expect(routerLinks[8].linkParams)
                        .withContext(`should equal ${['/edition/row-tables']}`)
                        .toEqual(['/edition/row-tables']);

                    expect(routerLinks[9].linkParams)
                        .withContext(`should equal ${['/data/search', 'fulltext']}`)
                        .toEqual(['/data/search', 'fulltext']);

                    expect(routerLinks[10].linkParams)
                        .withContext(`should equal ${['/data/search', 'extended']}`)
                        .toEqual(['/data/search', 'extended']);

                    expect(routerLinks[11].linkParams)
                        .withContext(`should equal ${['/contact']}`)
                        .toEqual(['/contact']);
                });

                it('... can click `sheets` link in template', () => {
                    const sheetsLinkDe = linkDes[1]; // Sheets link DebugElement
                    const sheetsLink = routerLinks[1]; // Sheets link directive

                    expect(sheetsLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                    sheetsLinkDe.triggerEventHandler('click', null);

                    fixture.detectChanges();

                    expect(sheetsLink.navigatedTo)
                        .withContext(
                            `should equal ${[
                                expectedEditionComplexOp25.baseRoute,
                                expectedEditionComplexOp25.sheetsRoute.route,
                            ]}`
                        )
                        .toEqual([expectedEditionComplexOp25.baseRoute, expectedEditionComplexOp25.sheetsRoute.route]);
                });

                it('... can click `graph` link in template', () => {
                    const graphLinkDe = linkDes[2]; // Gaph link DebugElement
                    const graphLink = routerLinks[2]; // Graph link directive

                    expect(graphLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                    graphLinkDe.triggerEventHandler('click', null);

                    fixture.detectChanges();

                    expect(graphLink.navigatedTo)
                        .withContext(
                            `should equal ${[
                                expectedEditionComplexOp25.baseRoute,
                                expectedEditionComplexOp25.graphRoute.route,
                            ]}`
                        )
                        .toEqual([expectedEditionComplexOp25.baseRoute, expectedEditionComplexOp25.graphRoute.route]);
                });

                it('... can click `structure` link in template', () => {
                    const structureLinkDe = linkDes[4]; // Structure link DebugElement
                    const structureLink = routerLinks[4]; // Structure link directive

                    expect(structureLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                    structureLinkDe.triggerEventHandler('click', null);

                    fixture.detectChanges();

                    expect(structureLink.navigatedTo)
                        .withContext(`should equal ${['/structure']}`)
                        .toEqual(['/structure']);
                });

                it('... can click `row tables` link in template', () => {
                    const rowTablesLinkDe = linkDes[8]; // RowTables link DebugElement
                    const rowTablesLink = routerLinks[8]; // RowTables link directive

                    expect(rowTablesLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                    rowTablesLinkDe.triggerEventHandler('click', null);

                    fixture.detectChanges();

                    expect(rowTablesLink.navigatedTo)
                        .withContext(`should equal ${['/edition/row-tables']}`)
                        .toEqual(['/edition/row-tables']);
                });

                it('... can click `fulltext search` link in template', () => {
                    const searchLinkDe = linkDes[9]; // Fulltext search link DebugElement
                    const searchLink = routerLinks[9]; // Fulltext search link directive

                    expect(searchLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                    searchLinkDe.triggerEventHandler('click', null);

                    fixture.detectChanges();

                    expect(searchLink.navigatedTo)
                        .withContext(`should equal ${['/data/search', 'fulltext']}`)
                        .toEqual(['/data/search', 'fulltext']);
                });

                it('... can click `extended search` link in template', () => {
                    const searchLinkDe = linkDes[10]; // Extended search link DebugElement
                    const searchLink = routerLinks[10]; // Extended search link directive

                    expect(searchLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                    searchLinkDe.triggerEventHandler('click', null);

                    fixture.detectChanges();

                    expect(searchLink.navigatedTo)
                        .withContext(`should equal ${['/data/search', 'extended']}`)
                        .toEqual(['/data/search', 'extended']);
                });

                it('... can click `contact` link in template', () => {
                    const searchLinkDe = linkDes[11]; // Contact link DebugElement
                    const searchLink = routerLinks[11]; // Contact link directive

                    expect(searchLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                    searchLinkDe.triggerEventHandler('click', null);

                    fixture.detectChanges();

                    expect(searchLink.navigatedTo)
                        .withContext(`should equal ${['/contact']}`)
                        .toEqual(['/contact']);
                });
            });
        });
    });
});
