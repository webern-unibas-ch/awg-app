/* eslint-disable @typescript-eslint/no-unused-vars */
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from 'testing/router-stubs';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS, EDITION_TYPE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';

import { EditionInfoComponent } from './edition-info.component';

describe('EditionInfoComponent (DONE)', () => {
    let component: EditionInfoComponent;
    let fixture: ComponentFixture<EditionInfoComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let expectedEditionComplexM30: EditionComplex;
    let expectedEditionComplexM34: EditionComplex;
    let expectedEditionComplexOp12: EditionComplex;
    let expectedEditionComplexOp25: EditionComplex;
    let expectedDisplayedEditionComplexes: EditionComplex[];
    let expectedOrderOfRouterlinks: string[][];
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;
    const expectedEditionTypeConstants: typeof EDITION_TYPE_CONSTANTS = EDITION_TYPE_CONSTANTS;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditionInfoComponent, RouterLinkStubDirective],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedEditionComplexM30 = EDITION_COMPLEXES.M30;
        expectedEditionComplexM34 = EDITION_COMPLEXES.M34;
        expectedEditionComplexOp12 = EDITION_COMPLEXES.OP12;
        expectedEditionComplexOp25 = EDITION_COMPLEXES.OP25;

        expectedDisplayedEditionComplexes = [
            expectedEditionComplexOp12,
            expectedEditionComplexOp25,
            expectedEditionComplexM30,
            expectedEditionComplexM34,
        ];

        expectedOrderOfRouterlinks = [
            [expectedEditionRouteConstants.EDITION.route, expectedEditionRouteConstants.ROWTABLES.route],
            [expectedEditionComplexOp12.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
            [expectedEditionComplexOp25.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
            [expectedEditionComplexOp25.baseRoute, expectedEditionRouteConstants.EDITION_GRAPH.route],
            [expectedEditionComplexM30.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
            [expectedEditionComplexM34.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
        ];
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have edition complex M 30', () => {
            expect(component.EDITION_COMPLEX_M30).toBeDefined();
            expect(component.EDITION_COMPLEX_M30)
                .withContext(`should be ${expectedEditionComplexM30}`)
                .toEqual(expectedEditionComplexM30);
        });

        it('... should have edition complex M 34', () => {
            expect(component.EDITION_COMPLEX_M34).toBeDefined();
            expect(component.EDITION_COMPLEX_M34)
                .withContext(`should be ${expectedEditionComplexM34}`)
                .toEqual(expectedEditionComplexM34);
        });

        it('... should have edition complex op. 12', () => {
            expect(component.EDITION_COMPLEX_OP12).toBeDefined();
            expect(component.EDITION_COMPLEX_OP12)
                .withContext(`should be ${expectedEditionComplexOp12}`)
                .toEqual(expectedEditionComplexOp12);
        });

        it('... should have edition complex op. 25', () => {
            expect(component.EDITION_COMPLEX_OP25).toBeDefined();
            expect(component.EDITION_COMPLEX_OP25)
                .withContext(`should be ${expectedEditionComplexOp25}`)
                .toEqual(expectedEditionComplexOp25);
        });

        it('... should have `editionRouteConstants`', () => {
            expect(component.editionRouteConstants).toBeDefined();
            expect(component.editionRouteConstants)
                .withContext(`should be ${expectedEditionRouteConstants}`)
                .toBe(expectedEditionRouteConstants);
        });

        it('... should have `editionTypeConstants`', () => {
            expect(component.editionTypeConstants).toBeDefined();
            expect(component.editionTypeConstants)
                .withContext(`should be ${expectedEditionTypeConstants}`)
                .toBe(expectedEditionTypeConstants);
        });

        describe('VIEW', () => {
            it('... should contain 1 div.card with div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card div.card-body', 1, 1);
            });

            it('... should contain 3 `h6` header and 3 `p` elements in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h6.awg-edition-info-header', 3, 3);
                getAndExpectDebugElementByCss(compDe, 'div.card-body p', 3, 3);
            });

            it('... should not render links in edition info headers yet', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    '.awg-edition-info-header a',
                    expectedOrderOfRouterlinks.length,
                    expectedOrderOfRouterlinks.length
                );

                aDes.forEach(aDe => {
                    const aEl = aDe.nativeElement;

                    expect(aEl).toBeDefined();
                    expect(aEl.textContent).withContext('should be empty string').not.toBeTruthy();
                });
            });

            it('... should not render edition series in breadcrumb of edition info headers yet', () => {
                const seriesDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-breadcrumb',
                    2,
                    2
                );

                const series1El = seriesDes[0].nativeElement;
                const series2El = seriesDes[1].nativeElement;

                expect(series1El).toBeDefined();
                expect(series2El).toBeDefined();

                expect(series1El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(series2El.textContent).withContext('should be empty string').not.toBeTruthy();
            });

            it('... should not render title of edition info headers yet', () => {
                const titleDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-edition-info-header-title',
                    expectedDisplayedEditionComplexes.length,
                    expectedDisplayedEditionComplexes.length
                );

                titleDes.forEach(titleDe => {
                    const titleEl = titleDe.nativeElement;

                    expect(titleEl).toBeDefined();
                    expect(titleEl.textContent).withContext('should be empty string').not.toBeTruthy();
                });
            });

            it('... should not render catalogue number of edition info headers yet', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-edition-info-header-catalogue',
                    expectedDisplayedEditionComplexes.length,
                    expectedDisplayedEditionComplexes.length
                );

                catalogueDes.forEach(catalogueDe => {
                    const catalogueEl = catalogueDe.nativeElement;

                    expect(catalogueEl).toBeDefined();
                    expect(catalogueEl.textContent).withContext('should be empty string').not.toBeTruthy();
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
            it('... should render links in edition info headers', () => {
                const expectedOrderOfHeaders = [
                    expectedEditionRouteConstants.ROWTABLES.full,
                    expectedEditionTypeConstants.SKETCH_EDITION.full,
                    expectedEditionTypeConstants.SKETCH_EDITION.full,
                    expectedEditionRouteConstants.EDITION_GRAPH.full,
                    expectedEditionTypeConstants.SKETCH_EDITION.full,
                    expectedEditionTypeConstants.SKETCH_EDITION.full,
                ];

                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    '.awg-edition-info-header a',
                    expectedOrderOfHeaders.length,
                    expectedOrderOfHeaders.length
                );

                aDes.forEach((aDe, index) => {
                    const aEl = aDe.nativeElement;

                    expect(aEl).toBeDefined();
                    expect(aEl.textContent).toBeTruthy();
                    expect(aEl.textContent)
                        .withContext(`should equal ${expectedOrderOfHeaders[index]}`)
                        .toEqual(expectedOrderOfHeaders[index]);
                });
            });

            it('... should render edition series in breadcrumb of edition info headers', () => {
                const seriesDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-breadcrumb',
                    2,
                    2
                );

                const series1El = seriesDes[0].nativeElement;
                const series2El = seriesDes[1].nativeElement;

                const expectedBreadCrumb1 = `${expectedEditionRouteConstants.EDITION.short} ${expectedEditionRouteConstants.SERIES_1.short}/${expectedEditionRouteConstants.SECTION_5.short}`;
                const expectedBreadCrumb2 = `${expectedEditionRouteConstants.EDITION.short} ${expectedEditionRouteConstants.SERIES_2.short}/${expectedEditionRouteConstants.SECTION_2A.short}`;

                expect(series1El).toBeDefined();
                expect(series2El).toBeDefined();

                expect(series1El.textContent).withContext(`should be ${expectedBreadCrumb1}`).toBe(expectedBreadCrumb1);
                expect(series2El.textContent).withContext(`should be ${expectedBreadCrumb2}`).toBe(expectedBreadCrumb2);
            });

            it('... should render title of edition info headers', () => {
                const titleDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-edition-info-header-title',
                    expectedDisplayedEditionComplexes.length,
                    expectedDisplayedEditionComplexes.length
                );

                titleDes.forEach((titleDe, index) => {
                    const titleEl = titleDe.nativeElement;

                    expect(titleEl).toBeDefined();
                    expect(titleEl.innerHTML).toBeTruthy();
                    expect(titleEl.innerHTML)
                        .withContext(`should be ${expectedDisplayedEditionComplexes[index].titleStatement.title}`)
                        .toBe(expectedDisplayedEditionComplexes[index].titleStatement.title);
                });
            });

            it('... should render catalogue number of edition info headers', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-edition-info-header-catalogue',
                    expectedDisplayedEditionComplexes.length,
                    expectedDisplayedEditionComplexes.length
                );

                catalogueDes.forEach((catalogueDe, index) => {
                    const catalogueEl = catalogueDe.nativeElement;

                    expect(catalogueEl).toBeDefined();
                    expect(catalogueEl.innerHTML).toBeTruthy();
                    expect(catalogueEl.innerHTML)
                        .withContext(`should be ${expectedDisplayedEditionComplexes[index].complexId.short}`)
                        .toBe(expectedDisplayedEditionComplexes[index].complexId.short);
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
                expect(routerLinks.length)
                    .withContext(`should have ${expectedOrderOfRouterlinks.length} routerLinks`)
                    .toBe(expectedOrderOfRouterlinks.length);
            });

            it('... can get correct linkParams from template', () => {
                routerLinks.forEach((routerLink, index) => {
                    expect(routerLink.linkParams)
                        .withContext(`should be ${expectedOrderOfRouterlinks[index]}`)
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
