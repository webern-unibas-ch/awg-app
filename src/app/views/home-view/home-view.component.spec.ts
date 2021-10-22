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

import { EditionWork, EditionWorks } from '@awg-views/edition-view/models';

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
    let compEl: any;
    let linkDes: DebugElement[];
    let routerLinks;

    let mockRouter: Partial<Router>;

    const expectedTitle = 'Beispieleditionen ausgewählter Skizzen';
    const expectedId = 'awg-home-view';

    let expectedEditionWorkOp12: EditionWork;
    let expectedEditionWorkOp25: EditionWork;

    beforeEach(
        waitForAsync(() => {
            // Router spy object
            mockRouter = jasmine.createSpyObj('Router', ['navigate']);

            TestBed.configureTestingModule({
                declarations: [HomeViewComponent, HeadingStubComponent, RouterLinkStubDirective],
                providers: [{ provide: Router, useValue: mockRouter }],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedEditionWorkOp12 = EditionWorks.OP12;
        expectedEditionWorkOp25 = EditionWorks.OP25;

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
            expect(component.homeViewTitle).toBe(expectedTitle);

            expect(component.homeViewId).toBeDefined();
            expect(component.homeViewId).toBe(expectedId);
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

            it('... should contain two `div.para` elements', () => {
                getAndExpectDebugElementByCss(compDe, 'div.para', 2, 2);
            });

            it('... should have one h6 and two h3 in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 2, 2);
                getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'h3.awg-edition-info-header', 2, 2);
            });

            it('... should not render bread crumb header in first div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 2, 2);
                const headerDes = getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).not.toBeTruthy('should be empty string');
            });

            it('... should not render title of edition info headers in first div.para yet', () => {
                const titleDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h3.awg-edition-info-header em.awg-edition-info-header-title',
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

            it('... should not render catalogue of edition info headers in first div.para yet', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    '.awg-edition-info-header .awg-edition-info-header-catalogue',
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

            it('... should not render links of edition info headers in first div.para yet', () => {
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

                expect(navArgs).toBeDefined('should have navArgs');
                expect(navArgs[0]).toBeDefined('should have navCommand');
                expect(outletRoute).toBeDefined('should have outletRoute');
                expect(outletRoute).toBe(expectedRoute, 'should be `editionInfo`');

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });

            it('... should tell ROUTER to navigate with `preserveFragment:true`', () => {
                // Catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const navExtras = navArgs[1];

                expect(navExtras).toBeDefined('should have navExtras');
                expect(navExtras.preserveFragment).toBeDefined('should have preserveFragment extra');
                expect(navExtras.preserveFragment).toBe(true, 'should be `preserveFragment:true`');

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading component', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeTruthy();
                expect(headingCmp.title).toBe(expectedTitle, `should have title: ${expectedTitle}`);

                expect(headingCmp.id).toBeTruthy();
                expect(headingCmp.id).toBe(expectedId, `should have id: ${expectedId}`);
            });

            it('... should render bread crumb header in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 2, 2);
                const headerDes = getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                const expectedBreadCrumb = ` ${expectedEditionWorkOp12.edition.short} / ${expectedEditionWorkOp12.series.full} / ${expectedEditionWorkOp12.section.full} `;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).toBe(expectedBreadCrumb, `should be ${expectedBreadCrumb}`);
            });

            it('... should render title of edition info headers in first div.para', () => {
                const titleDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h3.awg-edition-info-header em.awg-edition-info-header-title',
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

            it('... should render catalogue of edition info headers in first div.para', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    '.awg-edition-info-header .awg-edition-info-header-catalogue',
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

            it('... should render part links in first div.para', () => {
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

            describe('[routerLink]', () => {
                beforeEach(() => {
                    // Find DebugElements with an attached RouterLinkStubDirective
                    linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 8, 8);

                    // Get attached link directive instances using each DebugElement's injector
                    routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
                });

                it('... can get routerLink from template', () => {
                    expect(routerLinks.length).toBe(8, 'should have 8 routerLinks');
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
                    expect(routerLinks[3].linkParams).toEqual(['/structure']);
                    expect(routerLinks[4].linkParams).toEqual([
                        expectedEditionWorkOp12.baseRoute,
                        expectedEditionWorkOp12.detailRoute.route,
                    ]);
                    expect(routerLinks[5].linkParams).toEqual([
                        expectedEditionWorkOp25.baseRoute,
                        expectedEditionWorkOp25.detailRoute.route,
                    ]);
                    expect(routerLinks[6].linkParams).toEqual(['/data/search', 'fulltext']);
                    expect(routerLinks[7].linkParams).toEqual(['/contact']);
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

                it('... can click `structure` link in template', () => {
                    const structureLinkDe = linkDes[3]; // Contact link DebugElement
                    const structureLink = routerLinks[3]; // Contact link directive

                    expect(structureLink.navigatedTo).toBeNull('should not have navigated yet');

                    structureLinkDe.triggerEventHandler('click', null);

                    fixture.detectChanges();

                    expect(structureLink.navigatedTo).toEqual(['/structure']);
                });

                it('... can click `search` link in template', () => {
                    const searchLinkDe = linkDes[6]; // Contact link DebugElement
                    const searchLink = routerLinks[6]; // Contact link directive

                    expect(searchLink.navigatedTo).toBeNull('should not have navigated yet');

                    searchLinkDe.triggerEventHandler('click', null);

                    fixture.detectChanges();

                    expect(searchLink.navigatedTo).toEqual(['/data/search', 'fulltext']);
                });

                it('... can click `contact` link in template', () => {
                    const searchLinkDe = linkDes[7]; // Contact link DebugElement
                    const searchLink = routerLinks[7]; // Contact link directive

                    expect(searchLink.navigatedTo).toBeNull('should not have navigated yet');

                    searchLinkDe.triggerEventHandler('click', null);

                    fixture.detectChanges();

                    expect(searchLink.navigatedTo).toEqual(['/contact']);
                });
            });
        });
    });
});
