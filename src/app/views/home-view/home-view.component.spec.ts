/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import {
    expectSpyCall,
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
    let expectedEditionComplexOp12: EditionComplex;
    let expectedEditionComplexOp25: EditionComplex;
    let expectedEditionComplexM30: EditionComplex;
    let expectedEditionComplexM34: EditionComplex;

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
        expectedEditionComplexOp12 = EDITION_COMPLEXES.OP12;
        expectedEditionComplexOp25 = EDITION_COMPLEXES.OP25;
        expectedEditionComplexM30 = EDITION_COMPLEXES.M30;
        expectedEditionComplexM34 = EDITION_COMPLEXES.M34;

        expectedPageMetaData = METADATA[MetaSectionTypes.page];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
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

        it('should have edition complex for M 30', () => {
            expect(component.EDITION_COMPLEX_M30).toBeDefined();
            expect(component.EDITION_COMPLEX_M30)
                .withContext(`should be ${expectedEditionComplexM30}`)
                .toEqual(expectedEditionComplexM30);
        });

        it('should have edition complex for M 34', () => {
            expect(component.EDITION_COMPLEX_M34).toBeDefined();
            expect(component.EDITION_COMPLEX_M34)
                .withContext(`should be ${expectedEditionComplexM34}`)
                .toEqual(expectedEditionComplexM34);
        });

        it('should have `editionRouteConstants`', () => {
            expect(component.editionRouteConstants).toBeDefined();
            expect(component.editionRouteConstants)
                .withContext(`should be ${expectedEditionRouteConstants}`)
                .toBe(expectedEditionRouteConstants);
        });

        it('should have `editionTypeConstants`', () => {
            expect(component.editionTypeConstants).toBeDefined();
            expect(component.editionTypeConstants)
                .withContext(`should be ${expectedEditionTypeConstants}`)
                .toBe(expectedEditionTypeConstants);
        });

        it('should not have pageMetaData', () => {
            expect(component.pageMetaData).toBeUndefined();
        });

        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });
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

            it('... should have one h6 and two h3 in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                getAndExpectDebugElementByCss(divDes[1], 'h6.awg-breadcrumb', 1, 1);
                getAndExpectDebugElementByCss(divDes[1], 'h3.awg-edition-info-header', 2, 2);
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

            it('... should not render catalogue of edition info headers in second div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const catalogueDes = getAndExpectDebugElementByCss(
                    divDes[1],
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

            it('... should not render links of edition info headers in second div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const aDes = getAndExpectDebugElementByCss(divDes[1], '.awg-edition-info-header a', 2, 2);

                const a1El = aDes[0].nativeElement;
                const a2El = aDes[1].nativeElement;

                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();
                expect(a1El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(a2El.textContent).withContext('should be empty string').not.toBeTruthy();
            });

            describe('... should not render links to', () => {
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

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return pageMetaData', () => {
                expect(component.pageMetaData).toBeDefined();
                expect(component.pageMetaData)
                    .withContext(`should be: ${expectedPageMetaData}`)
                    .toBe(expectedPageMetaData);
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

                const expectedBreadCrumb = ` ${expectedEditionRouteConstants.EDITION.short} / ${expectedEditionComplexOp12.series.full} / ${expectedEditionComplexOp12.section.full} `;

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

            it('... should render edition type links in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const aDes = getAndExpectDebugElementByCss(divDes[0], '.awg-edition-info-header a', 3, 3);

                const a0El = aDes[0].nativeElement;
                const a1El = aDes[1].nativeElement;
                const a2El = aDes[2].nativeElement;

                expect(a0El).toBeDefined();
                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();

                expect(a0El.textContent)
                    .withContext(`should be ${expectedEditionTypeConstants.SKETCH_EDITION.full}`)
                    .toBe(expectedEditionTypeConstants.SKETCH_EDITION.full);
                expect(a1El.textContent)
                    .withContext(`should be ${expectedEditionTypeConstants.SKETCH_EDITION.full}`)
                    .toBe(expectedEditionTypeConstants.SKETCH_EDITION.full);
                expect(a2El.textContent)
                    .withContext(`should be ${expectedEditionRouteConstants.EDITION_GRAPH.short}`)
                    .toBe(expectedEditionRouteConstants.EDITION_GRAPH.short);
            });

            it('... should render bread crumb header in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const headerDes = getAndExpectDebugElementByCss(divDes[1], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                const expectedBreadCrumb = ` ${expectedEditionRouteConstants.EDITION.short} / ${expectedEditionComplexM34.series.full} / ${expectedEditionComplexM30.section.full} `;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).withContext(`should be ${expectedBreadCrumb}`).toBe(expectedBreadCrumb);
            });

            it('... should render title of edition info headers in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const titleDes = getAndExpectDebugElementByCss(
                    divDes[1],
                    'h3.awg-edition-info-header .awg-edition-info-header-title',
                    2,
                    2
                );
                const title1El = titleDes[0].nativeElement;
                const title2El = titleDes[1].nativeElement;

                expect(title1El).toBeDefined();
                expect(title2El).toBeDefined();
                expect(title1El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexM30.titleStatement.title}`)
                    .toBe(expectedEditionComplexM30.titleStatement.title);
                expect(title2El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexM34.titleStatement.title}`)
                    .toBe(expectedEditionComplexM34.titleStatement.title);
            });

            it('... should render catalogue number of edition info headers in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const catalogueDes = getAndExpectDebugElementByCss(
                    divDes[1],
                    '.awg-edition-info-header .awg-edition-info-header-catalogue',
                    2,
                    2
                );
                const catalogue1El = catalogueDes[0].nativeElement;
                const catalogue2El = catalogueDes[1].nativeElement;

                expect(catalogue1El).toBeDefined();
                expect(catalogue2El).toBeDefined();
                expect(catalogue1El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexM30.complexId.short}`)
                    .toBe(expectedEditionComplexM30.complexId.short);
                expect(catalogue2El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexM34.complexId.short}`)
                    .toBe(expectedEditionComplexM34.complexId.short);
            });

            it('... should render edition type links in second div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                const aDes = getAndExpectDebugElementByCss(divDes[1], '.awg-edition-info-header a', 2, 2);

                const a1El = aDes[0].nativeElement;
                const a2El = aDes[1].nativeElement;

                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();
                expect(a1El.textContent)
                    .withContext(`should be ${expectedEditionTypeConstants.SKETCH_EDITION.full}`)
                    .toBe(expectedEditionTypeConstants.SKETCH_EDITION.full);
                expect(a2El.textContent)
                    .withContext(`should be ${expectedEditionTypeConstants.SKETCH_EDITION.full}`)
                    .toBe(expectedEditionTypeConstants.SKETCH_EDITION.full);
            });

            describe('... should render links to', () => {
                it('... DSP', () => {
                    const dspDes = getAndExpectDebugElementByCss(compDe, 'a#dsp-link', 1, 1);
                    const dspEl = dspDes[0].nativeElement;

                    const dspRoute = 'dsp-app';

                    expect(dspEl).toBeDefined();
                    expect(dspEl.href).toBeTruthy();
                    expect(dspEl.href)
                        .withContext(`should be ${expectedPageMetaData.daschUrl + dspRoute}`)
                        .toBe(expectedPageMetaData.daschUrl + dspRoute);
                    expect(dspEl.textContent).toBeTruthy();
                    expect(dspEl.textContent)
                        .withContext(`should be 'DaSCH Service Platform (DSP)'`)
                        .toBe('DaSCH Service Platform (DSP)');
                });

                it('... SALSAH', () => {
                    const salsahDes = getAndExpectDebugElementByCss(compDe, 'a#salsah-link', 1, 1);
                    const salsahEl = salsahDes[0].nativeElement;

                    expect(salsahEl).toBeDefined();
                    expect(salsahEl.href).toBeTruthy();
                    expect(salsahEl.href)
                        .withContext(`should be ${expectedPageMetaData.salsahUrl}`)
                        .toBe(expectedPageMetaData.salsahUrl);
                    expect(salsahEl.textContent).toBeTruthy();
                    expect(salsahEl.textContent).withContext(`should be 'SALSAH'`).toBe('SALSAH');
                });

                it('... DHLAB', () => {
                    const dhlabDes = getAndExpectDebugElementByCss(compDe, 'a#dhlab-link', 1, 1);
                    const dhlabEl = dhlabDes[0].nativeElement;

                    expect(dhlabEl).toBeDefined();
                    expect(dhlabEl.href).toBeTruthy();
                    expect(dhlabEl.href)
                        .withContext(`should be ${expectedPageMetaData.dhlabUrl}`)
                        .toBe(expectedPageMetaData.dhlabUrl);
                    expect(dhlabEl.textContent)
                        .withContext(`should be 'Digital Humanities Lab'`)
                        .toBe('Digital Humanities Lab');
                });

                it('... DaSCH', () => {
                    const daschDes = getAndExpectDebugElementByCss(compDe, 'a#dasch-link', 1, 1);
                    const daschEl = daschDes[0].nativeElement;

                    expect(daschEl).toBeDefined();
                    expect(daschEl.href).toBeTruthy();
                    expect(daschEl.href)
                        .withContext(`should be ${expectedPageMetaData.daschUrl}`)
                        .toBe(expectedPageMetaData.daschUrl);
                    expect(daschEl.textContent).toBeTruthy();
                    expect(daschEl.textContent)
                        .withContext(`should be 'Swiss National Data & Service Center for the Humanities (DaSCH)'`)
                        .toBe('Swiss National Data & Service Center for the Humanities (DaSCH)');
                });

                it('... DaSCH mission', () => {
                    const daschMissionDes = getAndExpectDebugElementByCss(compDe, 'a#dasch-mission-link', 1, 1);
                    const daschMissionEl = daschMissionDes[0].nativeElement;

                    const missionRoute = 'visionandmission';

                    expect(daschMissionEl).toBeDefined();
                    expect(daschMissionEl.href).toBeTruthy();
                    expect(daschMissionEl.href)
                        .withContext(`should be ${expectedPageMetaData.daschUrl + missionRoute}`)
                        .toBe(expectedPageMetaData.daschUrl + missionRoute);
                    expect(daschMissionEl.textContent).toBeTruthy();
                    expect(daschMissionEl.textContent)
                        .withContext(`should be 'Mission Statement DaSCH'`)
                        .toBe('Mission Statement DaSCH');
                });

                it('... GitHub', () => {
                    const githubDes = getAndExpectDebugElementByCss(compDe, 'a#github-link', 1, 1);
                    const githubEl = githubDes[0].nativeElement;

                    expect(githubEl).toBeDefined();
                    expect(githubEl.href).toBeTruthy();
                    expect(githubEl.href)
                        .withContext(`should be ${expectedPageMetaData.githubUrl}`)
                        .toBe(expectedPageMetaData.githubUrl);
                    expect(githubEl.textContent).toBeTruthy();
                    expect(githubEl.textContent).withContext(`should be 'GitHub'`).toBe('GitHub');
                });

                it('... Compodoc', () => {
                    const compodocDes = getAndExpectDebugElementByCss(compDe, 'a#compodoc-link', 1, 1);
                    const compodocEl = compodocDes[0].nativeElement;

                    expect(compodocEl).toBeDefined();
                    expect(compodocEl.href).toBeTruthy();
                    expect(compodocEl.href)
                        .withContext(`should contain ${expectedPageMetaData.compodocUrl}`)
                        .toContain(expectedPageMetaData.compodocUrl);
                    expect(compodocEl.textContent).toBeTruthy();
                    expect(compodocEl.textContent).withContext(`should be 'dokumentiert'`).toBe('dokumentiert');
                });
            });
        });

        describe('[routerLink]', () => {
            let expectedOrderOfRouterlinks: string[][];

            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 14, 14);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));

                expectedOrderOfRouterlinks = [
                    [expectedEditionComplexOp12.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    [expectedEditionComplexOp25.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    [expectedEditionComplexOp25.baseRoute, expectedEditionRouteConstants.EDITION_GRAPH.route],
                    [expectedEditionComplexM30.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    [expectedEditionComplexM34.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    ['/structure'],
                    [expectedEditionComplexOp12.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    [expectedEditionComplexOp25.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    [expectedEditionComplexM30.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    [expectedEditionComplexM34.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    ['/edition', 'row-tables'],
                    ['/data/search', 'fulltext'],
                    ['/data/search', 'extended'],
                    ['/contact'],
                ];
            });

            it('... can get correct number of routerLinks from template', () => {
                expect(routerLinks.length)
                    .withContext(`should have ${expectedOrderOfRouterlinks.length} routerLinks`)
                    .toBe(expectedOrderOfRouterlinks.length);
            });

            it('... can get correct linkParams from template', () => {
                routerLinks.forEach((routerLink, index) => {
                    expect(routerLink.linkParams)
                        .withContext(`should equal ${expectedOrderOfRouterlinks[index]}`)
                        .toEqual(expectedOrderOfRouterlinks[index]);
                });
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink, index) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedOrderOfRouterlinks[index];

                    expect(routerLink.navigatedTo).toBeNull();

                    click(linkDe);
                    fixture.detectChanges();

                    expect(routerLink.navigatedTo)
                        .withContext(`should equal ${expectedRouterLink}`)
                        .toEqual(expectedRouterLink);
                });
            });
        });
    });
});
