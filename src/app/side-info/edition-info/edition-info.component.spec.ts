/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from 'testing/router-stubs';

import { EditionWork, EditionWorks } from '@awg-views/edition-view/models';

import { EditionInfoComponent } from './edition-info.component';

describe('EditionInfoComponent (DONE)', () => {
    let component: EditionInfoComponent;
    let fixture: ComponentFixture<EditionInfoComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes: DebugElement[];
    let routerLinks;

    const expectedTitle = 'Beispieleditionen ausgewählter Skizzen';
    let expectedEditionWorkOp12: EditionWork;
    let expectedEditionWorkOp25: EditionWork;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [EditionInfoComponent, RouterLinkStubDirective],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedEditionWorkOp12 = EditionWorks.OP12;
        expectedEditionWorkOp25 = EditionWorks.OP25;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should have info view title', () => {
            expect(component.editionInfoViewTitle).toBeDefined();
            expect(component.editionInfoViewTitle).toBe(expectedTitle);
        });

        it('should have editionWorks', () => {
            expect(component.EDITION_WORK_OP12).toBeDefined('should be defined');
            expect(component.EDITION_WORK_OP25).toBeDefined('should be defined');

            expect(component.EDITION_WORK_OP12).toEqual(
                expectedEditionWorkOp12,
                `should be ${expectedEditionWorkOp12}`
            );
            expect(component.EDITION_WORK_OP25).toEqual(
                expectedEditionWorkOp25,
                `should be ${expectedEditionWorkOp25}`
            );
        });

        describe('VIEW', () => {
            it('... should contain 1 div.card with div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card div.card-body', 1, 1);
            });

            it('... should contain two `h6` header and 4 `p` elements in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h6.awg-edition-info-header', 2, 2);
                getAndExpectDebugElementByCss(compDe, 'div.card-body p', 4, 4);
            });

            it('... should not render series of edition info headers yet', () => {
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

                expect(series1El.textContent).not.toBeTruthy('should be empty string');
                expect(series2El.textContent).not.toBeTruthy('should be empty string');
            });

            it('... should not render title of edition info headers yet', () => {
                const titleDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header em.awg-edition-info-header-title',
                    2,
                    2
                );

                const title1El = titleDes[0].nativeElement;
                const title2El = titleDes[1].nativeElement;

                expect(title1El).toBeDefined();
                expect(title2El).toBeDefined();

                expect(title1El.textContent).not.toBeTruthy('should be empty string');
                expect(title2El.textContent).not.toBeTruthy('should be empty string');
            });

            it('... should not render catalogue of edition info headers yet', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-edition-info-header-catalogue',
                    2,
                    2
                );

                const catalogue1El = catalogueDes[0].nativeElement;
                const catalogue2El = catalogueDes[1].nativeElement;

                expect(catalogue1El).toBeDefined();
                expect(catalogue2El).toBeDefined();

                expect(catalogue1El.innerHTML).not.toBeTruthy('should be empty string');
                expect(catalogue2El.innerHTML).not.toBeTruthy('should be empty string');
            });

            it('... should not render links in edition info headers yet', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, '.awg-edition-info-header a', 3, 3);

                const a1El = aDes[0].nativeElement;
                const a2El = aDes[1].nativeElement;
                const a3El = aDes[2].nativeElement;

                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();
                expect(a3El).toBeDefined();

                expect(a1El.textContent).not.toBeTruthy('should be empty string');
                expect(a2El.textContent).not.toBeTruthy('should be empty string');
                expect(a3El.textContent).not.toBeTruthy('should be empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render series of edition info headers', () => {
                const seriesDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-breadcrumb',
                    2,
                    2
                );

                const series1El = seriesDes[0].nativeElement;
                const series2El = seriesDes[1].nativeElement;

                const expectedBreadCrumb1 = `${expectedEditionWorkOp12.edition.short} ${expectedEditionWorkOp12.series.short}/${expectedEditionWorkOp12.section.short}`;
                const expectedBreadCrumb2 = `${expectedEditionWorkOp25.edition.short} ${expectedEditionWorkOp25.series.short}/${expectedEditionWorkOp25.section.short}`;

                expect(series1El).toBeDefined();
                expect(series2El).toBeDefined();

                expect(series1El.textContent).toBe(expectedBreadCrumb1, `should be ${expectedBreadCrumb1}`);
                expect(series2El.textContent).toBe(expectedBreadCrumb2, `should be ${expectedBreadCrumb2}`);
            });

            it('... should render title of edition info headers', () => {
                const titleDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header em.awg-edition-info-header-title',
                    2,
                    2
                );

                const title1El = titleDes[0].nativeElement;
                const title2El = titleDes[1].nativeElement;

                expect(title1El).toBeDefined();
                expect(title2El).toBeDefined();

                expect(title1El.textContent).toBe(
                    expectedEditionWorkOp12.titleStatement.title,
                    `should be ${expectedEditionWorkOp12.titleStatement.title}`
                );
                expect(title2El.textContent).toBe(
                    expectedEditionWorkOp25.titleStatement.title,
                    `should be ${expectedEditionWorkOp25.titleStatement.title}`
                );
            });

            it('... should render catalogue of edition info headers', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-edition-info-header-catalogue',
                    2,
                    2
                );

                const catalogue1El = catalogueDes[0].nativeElement;
                const catalogue2El = catalogueDes[1].nativeElement;

                expect(catalogue1El).toBeDefined();
                expect(catalogue2El).toBeDefined();

                expect(catalogue1El.innerHTML).toBe(
                    expectedEditionWorkOp12.work.short,
                    `should be ${expectedEditionWorkOp12.work.short}`
                );
                expect(catalogue2El.innerHTML).toBe(
                    expectedEditionWorkOp25.work.short,
                    `should be ${expectedEditionWorkOp25.work.short}`
                );
            });

            it('... should render links in edition info headers', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, '.awg-edition-info-header a', 3, 3);

                const a1El = aDes[0].nativeElement;
                const a2El = aDes[1].nativeElement;
                const a3El = aDes[2].nativeElement;

                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();
                expect(a3El).toBeDefined();

                expect(a1El.textContent).toBe(
                    expectedEditionWorkOp12.type.full,
                    `should be ${expectedEditionWorkOp12.type.full}`
                );
                expect(a2El.textContent).toBe(
                    expectedEditionWorkOp25.type.full,
                    `should be ${expectedEditionWorkOp25.type.full}`
                );
                expect(a3El.textContent).toBe(
                    expectedEditionWorkOp25.graphRoute.short,
                    `should be ${expectedEditionWorkOp25.graphRoute.short}`
                );
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 3, 3);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLink from template', () => {
                expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
                expect(routerLinks[0].linkParams).toEqual([
                    expectedEditionWorkOp12.baseRoute,
                    expectedEditionWorkOp12.introRoute.route,
                ]);
                expect(routerLinks[1].linkParams).toEqual([
                    expectedEditionWorkOp25.baseRoute,
                    expectedEditionWorkOp25.detailRoute.route,
                ]);
                expect(routerLinks[2].linkParams).toEqual([
                    expectedEditionWorkOp25.baseRoute,
                    expectedEditionWorkOp25.graphRoute.route,
                ]);
            });

            it('... can click `intro` link in template', () => {
                const introLinkDe = linkDes[0]; // Contact link DebugElement
                const introLink = routerLinks[0]; // Contact link directive

                expect(introLink.navigatedTo).toBeNull('should not have navigated yet');

                introLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(introLink.navigatedTo).toEqual([
                    expectedEditionWorkOp12.baseRoute,
                    expectedEditionWorkOp12.introRoute.route,
                ]);
            });

            it('... can click `detail` link in template', () => {
                const detailLinkDe = linkDes[1]; // Contact link DebugElement
                const detailLink = routerLinks[1]; // Contact link directive

                expect(detailLink.navigatedTo).toBeNull('should not have navigated yet');

                detailLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(detailLink.navigatedTo).toEqual([
                    expectedEditionWorkOp25.baseRoute,
                    expectedEditionWorkOp25.detailRoute.route,
                ]);
            });

            it('... can click `graph` link in template', () => {
                const graphLinkDe = linkDes[2]; // Contact link DebugElement
                const graphLink = routerLinks[2]; // Contact link directive

                expect(graphLink.navigatedTo).toBeNull('should not have navigated yet');

                graphLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(graphLink.navigatedTo).toEqual([
                    expectedEditionWorkOp25.baseRoute,
                    expectedEditionWorkOp25.graphRoute.route,
                ]);
            });
        });
    });
});
