/* eslint-disable @typescript-eslint/no-unused-vars */
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
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
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should have edition complex M 30', () => {
            expect(component.EDITION_COMPLEX_M30).toBeDefined();
            expect(component.EDITION_COMPLEX_M30)
                .withContext(`should be ${expectedEditionComplexM30}`)
                .toEqual(expectedEditionComplexM30);
        });

        it('should have edition complex M 34', () => {
            expect(component.EDITION_COMPLEX_M34).toBeDefined();
            expect(component.EDITION_COMPLEX_M34)
                .withContext(`should be ${expectedEditionComplexM34}`)
                .toEqual(expectedEditionComplexM34);
        });

        it('should have edition complex op. 12', () => {
            expect(component.EDITION_COMPLEX_OP12).toBeDefined();
            expect(component.EDITION_COMPLEX_OP12)
                .withContext(`should be ${expectedEditionComplexOp12}`)
                .toEqual(expectedEditionComplexOp12);
        });

        it('should have edition complex op. 25', () => {
            expect(component.EDITION_COMPLEX_OP25).toBeDefined();
            expect(component.EDITION_COMPLEX_OP25)
                .withContext(`should be ${expectedEditionComplexOp25}`)
                .toEqual(expectedEditionComplexOp25);
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
                const aDes = getAndExpectDebugElementByCss(compDe, '.awg-edition-info-header a', 6, 6);

                const a1El = aDes[0].nativeElement;
                const a2El = aDes[1].nativeElement;
                const a3El = aDes[2].nativeElement;
                const a4El = aDes[3].nativeElement;
                const a5El = aDes[4].nativeElement;
                const a6El = aDes[5].nativeElement;

                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();
                expect(a3El).toBeDefined();
                expect(a4El).toBeDefined();
                expect(a5El).toBeDefined();
                expect(a6El).toBeDefined();

                expect(a1El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(a2El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(a3El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(a4El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(a5El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(a6El.textContent).withContext('should be empty string').not.toBeTruthy();
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
                    4,
                    4
                );

                const title1El = titleDes[0].nativeElement;
                const title2El = titleDes[1].nativeElement;
                const title3El = titleDes[2].nativeElement;
                const title4El = titleDes[3].nativeElement;

                expect(title1El).toBeDefined();
                expect(title2El).toBeDefined();
                expect(title3El).toBeDefined();
                expect(title4El).toBeDefined();

                expect(title1El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(title2El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(title3El.textContent).withContext('should be empty string').not.toBeTruthy();
                expect(title4El.textContent).withContext('should be empty string').not.toBeTruthy();
            });

            it('... should not render catalogue number of edition info headers yet', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-edition-info-header-catalogue',
                    4,
                    4
                );

                const catalogue1El = catalogueDes[0].nativeElement;
                const catalogue2El = catalogueDes[1].nativeElement;
                const catalogue3El = catalogueDes[2].nativeElement;
                const catalogue4El = catalogueDes[2].nativeElement;

                expect(catalogue1El).toBeDefined();
                expect(catalogue2El).toBeDefined();
                expect(catalogue3El).toBeDefined();
                expect(catalogue4El).toBeDefined();

                expect(catalogue1El.innerHTML).withContext('should be empty string').not.toBeTruthy();
                expect(catalogue2El.innerHTML).withContext('should be empty string').not.toBeTruthy();
                expect(catalogue3El.innerHTML).withContext('should be empty string').not.toBeTruthy();
                expect(catalogue4El.innerHTML).withContext('should be empty string').not.toBeTruthy();
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
                const aDes = getAndExpectDebugElementByCss(compDe, '.awg-edition-info-header a', 6, 6);

                const a1El = aDes[0].nativeElement;
                const a2El = aDes[1].nativeElement;
                const a3El = aDes[2].nativeElement;
                const a4El = aDes[3].nativeElement;
                const a5El = aDes[4].nativeElement;
                const a6El = aDes[5].nativeElement;

                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();
                expect(a3El).toBeDefined();
                expect(a4El).toBeDefined();
                expect(a5El).toBeDefined();
                expect(a6El).toBeDefined();

                expect(a1El.textContent)
                    .withContext(`should be ${expectedEditionRouteConstants.ROWTABLES.full}`)
                    .toBe(expectedEditionRouteConstants.ROWTABLES.full);
                expect(a2El.textContent)
                    .withContext(`should be ${expectedEditionTypeConstants.SKETCH_EDITION.full}`)
                    .toBe(expectedEditionTypeConstants.SKETCH_EDITION.full);
                expect(a3El.textContent)
                    .withContext(`should be ${expectedEditionTypeConstants.SKETCH_EDITION.full}`)
                    .toBe(expectedEditionTypeConstants.SKETCH_EDITION.full);
                expect(a4El.textContent)
                    .withContext(`should be ${expectedEditionRouteConstants.EDITION_GRAPH.short}`)
                    .toBe(expectedEditionRouteConstants.EDITION_GRAPH.short);
                expect(a5El.textContent)
                    .withContext(`should be ${expectedEditionTypeConstants.SKETCH_EDITION.full}`)
                    .toBe(expectedEditionTypeConstants.SKETCH_EDITION.full);
                expect(a6El.textContent)
                    .withContext(`should be ${expectedEditionTypeConstants.SKETCH_EDITION.full}`)
                    .toBe(expectedEditionTypeConstants.SKETCH_EDITION.full);
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
                    4,
                    4
                );

                const title1El = titleDes[0].nativeElement;
                const title2El = titleDes[1].nativeElement;
                const title3El = titleDes[2].nativeElement;
                const title4El = titleDes[3].nativeElement;

                expect(title1El).toBeDefined();
                expect(title2El).toBeDefined();
                expect(title3El).toBeDefined();
                expect(title4El).toBeDefined();

                expect(title1El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexOp12.titleStatement.title}`)
                    .toBe(expectedEditionComplexOp12.titleStatement.title);
                expect(title2El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexOp25.titleStatement.title}`)
                    .toBe(expectedEditionComplexOp25.titleStatement.title);
                expect(title3El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexM30.titleStatement.title}`)
                    .toBe(expectedEditionComplexM30.titleStatement.title);
                expect(title4El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexM34.titleStatement.title}`)
                    .toBe(expectedEditionComplexM34.titleStatement.title);
            });

            it('... should render catalogue number of edition info headers', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-edition-info-header-catalogue',
                    4,
                    4
                );

                const catalogue1El = catalogueDes[0].nativeElement;
                const catalogue2El = catalogueDes[1].nativeElement;
                const catalogue3El = catalogueDes[2].nativeElement;
                const catalogue4El = catalogueDes[3].nativeElement;

                expect(catalogue1El).toBeDefined();
                expect(catalogue2El).toBeDefined();
                expect(catalogue3El).toBeDefined();
                expect(catalogue4El).toBeDefined();

                expect(catalogue1El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexOp12.complexId.short}`)
                    .toBe(expectedEditionComplexOp12.complexId.short);
                expect(catalogue2El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexOp25.complexId.short}`)
                    .toBe(expectedEditionComplexOp25.complexId.short);
                expect(catalogue3El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexM30.complexId.short}`)
                    .toBe(expectedEditionComplexM30.complexId.short);
                expect(catalogue4El.innerHTML)
                    .withContext(`should be ${expectedEditionComplexM34.complexId.short}`)
                    .toBe(expectedEditionComplexM34.complexId.short);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 6, 6);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLinks from template', () => {
                expect(routerLinks.length).withContext('should have 6 routerLinks').toBe(6);

                expect(routerLinks[0].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionRouteConstants.EDITION.route,
                            expectedEditionRouteConstants.ROWTABLES.route,
                        ]}`
                    )
                    .toEqual([
                        expectedEditionRouteConstants.EDITION.route,
                        expectedEditionRouteConstants.ROWTABLES.route,
                    ]);

                expect(routerLinks[1].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexOp12.baseRoute,
                            expectedEditionRouteConstants.EDITION_SHEETS.route,
                        ]}`
                    )
                    .toEqual([
                        expectedEditionComplexOp12.baseRoute,
                        expectedEditionRouteConstants.EDITION_SHEETS.route,
                    ]);

                expect(routerLinks[2].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexOp25.baseRoute,
                            expectedEditionRouteConstants.EDITION_SHEETS.route,
                        ]}`
                    )
                    .toEqual([
                        expectedEditionComplexOp25.baseRoute,
                        expectedEditionRouteConstants.EDITION_SHEETS.route,
                    ]);

                expect(routerLinks[3].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexOp25.baseRoute,
                            expectedEditionRouteConstants.EDITION_GRAPH.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexOp25.baseRoute, expectedEditionRouteConstants.EDITION_GRAPH.route]);

                expect(routerLinks[4].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexM30.baseRoute,
                            expectedEditionRouteConstants.EDITION_SHEETS.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexM30.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route]);

                expect(routerLinks[5].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexM34.baseRoute,
                            expectedEditionRouteConstants.EDITION_SHEETS.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexM34.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route]);
            });

            it('... can click `row tables` link in template', () => {
                const rowTablesLinkDe = linkDes[0]; // Row tables link DebugElement
                const rowTablesLink = routerLinks[0]; // Row tables link directive

                expect(rowTablesLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                rowTablesLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(rowTablesLink.navigatedTo)
                    .withContext(
                        `should equal ${[
                            expectedEditionRouteConstants.EDITION.route,
                            expectedEditionRouteConstants.ROWTABLES.route,
                        ]}`
                    )
                    .toEqual([
                        expectedEditionRouteConstants.EDITION.route,
                        expectedEditionRouteConstants.ROWTABLES.route,
                    ]);
            });

            it('... can click `sheets op. 12` link in template', () => {
                const introLinkDe = linkDes[1]; // Intro op. 12 link DebugElement
                const introLink = routerLinks[1]; // Intro op. 12 link directive

                expect(introLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                introLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(introLink.navigatedTo)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexOp12.baseRoute,
                            expectedEditionRouteConstants.EDITION_SHEETS.route,
                        ]}`
                    )
                    .toEqual([
                        expectedEditionComplexOp12.baseRoute,
                        expectedEditionRouteConstants.EDITION_SHEETS.route,
                    ]);
            });

            it('... can click `sheets op. 25` link in template', () => {
                const detailLinkDe = linkDes[2]; // Intro op. 25  link DebugElement
                const detailLink = routerLinks[2]; // Intro op. 25  link directive

                expect(detailLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                detailLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(detailLink.navigatedTo)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexOp25.baseRoute,
                            expectedEditionRouteConstants.EDITION_SHEETS.route,
                        ]}`
                    )
                    .toEqual([
                        expectedEditionComplexOp25.baseRoute,
                        expectedEditionRouteConstants.EDITION_SHEETS.route,
                    ]);
            });

            it('... can click `graph` link in template', () => {
                const graphLinkDe = linkDes[3]; // Graph op. 25 link DebugElement
                const graphLink = routerLinks[3]; // Graph op. 25 link directive

                expect(graphLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                graphLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(graphLink.navigatedTo)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexOp25.baseRoute,
                            expectedEditionRouteConstants.EDITION_GRAPH.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexOp25.baseRoute, expectedEditionRouteConstants.EDITION_GRAPH.route]);
            });

            it('... can click `sheets M 30` link in template', () => {
                const detailLinkDe = linkDes[4]; // Intro M 30 link DebugElement
                const detailLink = routerLinks[4]; // Intro M 30 link directive

                expect(detailLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                detailLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(detailLink.navigatedTo)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexM30.baseRoute,
                            expectedEditionRouteConstants.EDITION_SHEETS.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexM30.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route]);
            });

            it('... can click `sheets M 34` link in template', () => {
                const detailLinkDe = linkDes[5]; // Intro M 34 link DebugElement
                const detailLink = routerLinks[5]; // Intro M 34 link directive

                expect(detailLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                detailLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(detailLink.navigatedTo)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexM34.baseRoute,
                            expectedEditionRouteConstants.EDITION_SHEETS.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexM34.baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route]);
            });
        });
    });
});
