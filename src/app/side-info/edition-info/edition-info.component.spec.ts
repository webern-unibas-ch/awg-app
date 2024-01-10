/* eslint-disable @typescript-eslint/no-unused-vars */
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
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
    let expectedEditionComplexM37: EditionComplex;
    let expectedEditionComplexOp12: EditionComplex;
    let expectedEditionComplexOp25: EditionComplex;

    let expectedDisplayedEditionComplexes: EditionComplex[];
    let expectedOrderOfRouterlinks: string[][];
    let expectedOrderOfHeaders: string[];

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
        expectedEditionComplexM37 = EDITION_COMPLEXES.M37;
        expectedEditionComplexOp12 = EDITION_COMPLEXES.OP12;
        expectedEditionComplexOp25 = EDITION_COMPLEXES.OP25;

        expectedDisplayedEditionComplexes = [
            expectedEditionComplexOp12,
            expectedEditionComplexOp25,
            expectedEditionComplexM30,
            expectedEditionComplexM34,
            expectedEditionComplexM37,
        ];

        expectedOrderOfRouterlinks = [
            [expectedEditionRouteConstants.EDITION.route, expectedEditionRouteConstants.ROWTABLES.route],
            [expectedEditionComplexOp12.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
            [expectedEditionComplexOp25.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
            [expectedEditionComplexOp25.baseRoute, expectedEditionRouteConstants.EDITION_GRAPH.route],
            [expectedEditionComplexM30.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
            [expectedEditionComplexM34.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
            [expectedEditionComplexM37.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
        ];

        expectedOrderOfHeaders = [
            expectedEditionRouteConstants.ROWTABLES.full,
            expectedEditionTypeConstants.SKETCH_EDITION.full,
            expectedEditionTypeConstants.SKETCH_EDITION.full,
            expectedEditionRouteConstants.EDITION_GRAPH.full,
            expectedEditionTypeConstants.SKETCH_EDITION.full,
            expectedEditionTypeConstants.SKETCH_EDITION.full,
            expectedEditionTypeConstants.SKETCH_EDITION.full,
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
            expectToEqual(component.EDITION_COMPLEX_M30, expectedEditionComplexM30);
        });

        it('... should have edition complex M 34', () => {
            expectToEqual(component.EDITION_COMPLEX_M34, expectedEditionComplexM34);
        });

        it('... should have edition complex M 37', () => {
            expectToEqual(component.EDITION_COMPLEX_M37, expectedEditionComplexM37);
        });

        it('... should have edition complex op. 12', () => {
            expectToEqual(component.EDITION_COMPLEX_OP12, expectedEditionComplexOp12);
        });

        it('... should have edition complex op. 25', () => {
            expectToEqual(component.EDITION_COMPLEX_OP25, expectedEditionComplexOp25);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToBe(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        it('... should have `editionTypeConstants`', () => {
            expectToBe(component.editionTypeConstants, expectedEditionTypeConstants);
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
                    expectToBe(aEl.textContent, '');
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

                expectToBe(series1El.textContent, '');
                expectToBe(series2El.textContent, '');
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
                    expectToBe(titleEl.textContent, '');
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
                    expectToBe(catalogueEl.textContent, '');
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
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    '.awg-edition-info-header a',
                    expectedOrderOfHeaders.length,
                    expectedOrderOfHeaders.length
                );

                aDes.forEach((aDe, index) => {
                    const aEl = aDe.nativeElement;

                    expectToEqual(aEl.textContent, expectedOrderOfHeaders[index]);
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

                expectToBe(series1El.textContent, expectedBreadCrumb1);
                expectToBe(series2El.textContent, expectedBreadCrumb2);
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

                    expectToBe(titleEl.innerHTML, expectedDisplayedEditionComplexes[index].titleStatement.title);
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

                    expectToBe(catalogueEl.innerHTML, expectedDisplayedEditionComplexes[index].complexId.short);
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
