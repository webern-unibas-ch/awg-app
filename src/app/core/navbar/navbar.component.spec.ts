/* eslint-disable @typescript-eslint/no-unused-vars */
import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import {
    faEnvelope,
    faFileAlt,
    faHome,
    faNetworkWired,
    faSearch,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { NgbCollapseModule, NgbConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click, clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { LOGOS_DATA } from '@awg-core/core-data';
import { Logos } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService } from '@awg-views/edition-view/services';

import { NavbarComponent } from './navbar.component';

/** Helper function */
function getRouterlinks(editionComplexes: EditionComplex[]): string[][] {
    const { EDITION, SERIES, ROWTABLES, PREFACE, EDITION_INTRO, EDITION_SHEETS, EDITION_REPORT } =
        EDITION_ROUTE_CONSTANTS;

    const baseLinks = [
        ['/home'],
        [EDITION.route, SERIES.route],
        [EDITION.route, ROWTABLES.route],
        [EDITION.route, PREFACE.route],
    ];

    const editionLinks = editionComplexes.flatMap(complex => [
        [complex.baseRoute, EDITION_INTRO.route],
        [complex.baseRoute, EDITION_SHEETS.route],
        [complex.baseRoute, EDITION_REPORT.route],
    ]);

    const otherLinks = [['/structure'], ['/contact']];

    return [...baseLinks, ...editionLinks, ...otherLinks];
}

describe('NavbarComponent (DONE)', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let coreServiceSpy: Spy;
    let isActiveRouteSpy: Spy;
    let routerSpy: Spy;
    let provideMetaDataSpy: Spy;
    let toggleNavSpy: Spy;

    let mockCoreService: Partial<CoreService>;
    let mockRouter: Partial<Router>;

    let expectedLogos: Logos;
    let expectedNavbarIcons: {
        [key: string]: IconDefinition;
    };
    let expectedNavbarLabels: {
        [key: string]: string;
    };
    let expectedEditionComplexes: EditionComplex[];
    let expectedRouterlinks: string[][];

    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    // global NgbConfigModule
    @NgModule({ imports: [NgbCollapseModule, NgbDropdownModule], exports: [NgbCollapseModule, NgbDropdownModule] })
    class NgbConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        // Stub service for test purposes
        mockCoreService = {
            getLogos: () => expectedLogos,
        };

        // Router spy object
        mockRouter = jasmine.createSpyObj('Router', ['isActive']);

        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, NgbConfigModule],
            declarations: [NavbarComponent, RouterLinkStubDirective],
            providers: [
                { provide: CoreService, useValue: mockCoreService },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();
    }));

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLogos = LOGOS_DATA;

        expectedEditionComplexes = [
            EditionComplexesService.getEditionComplexById('OP3'),
            EditionComplexesService.getEditionComplexById('OP4'),
            EditionComplexesService.getEditionComplexById('OP12'),
            EditionComplexesService.getEditionComplexById('OP23'),
            EditionComplexesService.getEditionComplexById('OP25'),
            EditionComplexesService.getEditionComplexById('M22'),
            EditionComplexesService.getEditionComplexById('M30'),
            EditionComplexesService.getEditionComplexById('M31'),
            EditionComplexesService.getEditionComplexById('M34'),
            EditionComplexesService.getEditionComplexById('M35_42'),
            EditionComplexesService.getEditionComplexById('M37'),
        ];
        expectedRouterlinks = getRouterlinks(expectedEditionComplexes);

        expectedNavbarIcons = {
            contact: faEnvelope,
            edition: faFileAlt,
            home: faHome,
            search: faSearch,
            structure: faNetworkWired,
        };
        expectedNavbarLabels = {
            home: 'Home',
            complexes: 'Auswahl Skizzenkomplexe',
            contact: 'Kontakt',
            edition: 'Edition',
            general: 'Allgemein',
            search: 'Datenbank-Suche',
            structure: 'Strukturmodell',
        };

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        coreServiceSpy = spyOn(mockCoreService, 'getLogos').and.callThrough();
        isActiveRouteSpy = spyOn(component, 'isActiveRoute').and.callThrough();
        routerSpy = mockRouter.isActive as jasmine.Spy;
        provideMetaDataSpy = spyOn(component, 'provideMetaData').and.callThrough();
        toggleNavSpy = spyOn(component, 'toggleNav').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expectToBe(mockCoreService === coreService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have navbar icons', () => {
            expectToEqual(component.navbarIcons, expectedNavbarIcons);
        });

        it('... should have navbar labels', () => {
            expectToEqual(component.navbarLabels, expectedNavbarLabels);
        });

        it('... should have `isCollapsed = true`', () => {
            expectToBe(component.isCollapsed, true);
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

        it('... should not have `logos`', () => {
            expect(component.logos).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain 1 navbar', () => {
                getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
            });

            it('... should contain 2 navbar-brand-container with links in navbar', () => {
                const navbarDes = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                getAndExpectDebugElementByCss(navbarDes[0], '.navbar-brand-container > a.navbar-brand', 2, 2);
            });

            it('... should display first navbar-brand link not on sm devices, and second navbar-brand link only on sm devices', () => {
                const navbarDes = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                const navbarBrandDes = getAndExpectDebugElementByCss(navbarDes[0], '.navbar-brand-container', 2, 2);

                const navbarBrandEl1 = navbarBrandDes[0].nativeElement;
                const navbarBrandEl2 = navbarBrandDes[1].nativeElement;

                expectToContain(navbarBrandEl1.classList, 'd-sm-none');
                expectToContain(navbarBrandEl1.classList, 'd-md-inline');

                expectToContain(navbarBrandEl2.classList, 'd-sm-inline');
                expectToContain(navbarBrandEl2.classList, 'd-md-none');
            });

            it('... should not render awg project url in navbar-brand link yet', () => {
                const urlDes = getAndExpectDebugElementByCss(compDe, 'a.navbar-brand', 2, 2);
                const urlEl1 = urlDes[0].nativeElement;
                const urlEl2 = urlDes[1].nativeElement;

                expectToBe(urlEl1.href, '');
                expectToBe(urlEl2.href, '');
            });

            it('... should contain 1 toggle button in navbar', () => {
                const navbarDes = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                getAndExpectDebugElementByCss(navbarDes[0], 'button.navbar-toggler', 1, 1);
            });

            it('... should contain 1 navbar collapse in navbar', () => {
                const navbarDes = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                getAndExpectDebugElementByCss(navbarDes[0], 'div.navbar-collapse', 1, 1);
            });

            it('... should contain 2 ul.navbar-nav in navbar collapse', () => {
                const navbarCollapseDes = getAndExpectDebugElementByCss(compDe, 'div.navbar-collapse', 1, 1);
                getAndExpectDebugElementByCss(navbarCollapseDes[0], 'ul.navbar-nav', 2, 2);
            });

            it('... should contain 3 nav-items in first ul.navbar-nav, and 1 nav-items in second ul.navbar-nav', () => {
                const navbarCollapseDes = getAndExpectDebugElementByCss(compDe, 'div.navbar-collapse', 1, 1);
                const ulDes = getAndExpectDebugElementByCss(navbarCollapseDes[0], 'ul.navbar-nav', 2, 2);

                getAndExpectDebugElementByCss(ulDes[0], 'li.nav-item', 3, 3);
                getAndExpectDebugElementByCss(ulDes[1], 'li.nav-item', 1, 1);
            });

            it('... should have fa-icon on first nav-item link', () => {
                const navItemDes = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 4, 4);
                const navItemLinkSpanDes = getAndExpectDebugElementByCss(navItemDes[0], 'a.nav-link > span', 2, 2);
                const navItemLinkSpanEl2 = navItemLinkSpanDes[1].nativeElement;

                expectToBe(navItemLinkSpanEl2.textContent, '(current)');
                expectToContain(navItemLinkSpanEl2.classList, 'sr-only');

                getAndExpectDebugElementByCss(navItemDes[0], 'a.nav-link > fa-icon', 1, 1);
            });

            it('... should have fa-icon on second nav-item link', () => {
                const navItemDes = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 4, 4);

                getAndExpectDebugElementByCss(navItemDes[1], 'a.nav-link > fa-icon', 1, 1);
            });

            it('... should have fa-icon on third nav-item link', () => {
                const navItemDes = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 4, 4);

                getAndExpectDebugElementByCss(navItemDes[2], 'a.nav-link > fa-icon', 1, 1);
            });

            it('... should have fa-icon on fourth nav-item link', () => {
                const navItemDes = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 4, 4);

                getAndExpectDebugElementByCss(navItemDes[3], 'a.nav-link > fa-icon', 1, 1);
            });
        });

        describe('#isActiveRoute()', () => {
            it('... should have a method `isActiveRoute`', () => {
                expect(component.isActiveRoute).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(isActiveRouteSpy, 0);
            });
        });

        describe('#provideMetaData()', () => {
            it('... should have a method `provideMetaData`', () => {
                expect(component.provideMetaData).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(provideMetaDataSpy, 0);
            });

            it('... should not have `logos`', () => {
                expect(component.logos).toBeUndefined();
            });
        });

        describe('#toggleNav()', () => {
            it('... should have a method `toggleNav`', () => {
                expect(component.toggleNav).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(toggleNavSpy, 0);
            });

            it('... should be called when navbar toggle button clicked (click helper)', () => {
                // Find button elements
                const buttonDes = getAndExpectDebugElementByCss(compDe, 'button.navbar-toggler', 1, 1);
                const buttonEl = buttonDes[0].nativeElement;

                // Should have not been called yet
                expectSpyCall(toggleNavSpy, 0);

                // Click button
                click(buttonDes[0]);
                click(buttonEl);

                expectSpyCall(toggleNavSpy, 2);
            });

            it('... should toggle `isCollapsed`', () => {
                component.toggleNav();

                expectToBe(component.isCollapsed, false);

                component.toggleNav();

                expectToBe(component.isCollapsed, true);

                component.toggleNav();

                expectToBe(component.isCollapsed, false);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            let navItemDes: DebugElement[];

            beforeEach(() => {
                navItemDes = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 4, 4);
            });

            it('... should render awg project url in navbar-brand link', () => {
                const urlDes = getAndExpectDebugElementByCss(compDe, 'a.navbar-brand', 2, 2);
                const urlEl1 = urlDes[0].nativeElement;
                const urlEl2 = urlDes[1].nativeElement;

                expectToBe(urlEl1.href, expectedLogos['awg'].href);
                expectToBe(urlEl2.href, expectedLogos['awg'].href);
            });

            describe('... first nav-item link (home)', () => {
                it('... should have home label and fa-icon', () => {
                    const navItemLinkSpanDes = getAndExpectDebugElementByCss(navItemDes[0], 'a.nav-link > span', 2, 2);
                    const navItemLinkSpanEl1 = navItemLinkSpanDes[0].nativeElement;
                    const navItemLinkSpanEl2 = navItemLinkSpanDes[1].nativeElement;

                    expectToBe(navItemLinkSpanEl1.textContent, expectedNavbarLabels['home']);

                    expectToBe(navItemLinkSpanEl2.textContent, '(current)');
                    expectToContain(navItemLinkSpanEl2.classList, 'sr-only');

                    getAndExpectDebugElementByCss(navItemDes[0], 'a.nav-link > fa-icon', 1, 1);
                });

                it('... should display home icon', () => {
                    const faIconDes = getAndExpectDebugElementByCss(navItemDes[0], 'a.nav-link > fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns, expectedNavbarIcons['home']);
                });
            });

            describe('... second nav-item link (edition)', () => {
                let navItemLinkDes: DebugElement[];

                beforeEach(fakeAsync(() => {
                    navItemLinkDes = getAndExpectDebugElementByCss(navItemDes[1], 'a.nav-link', 1, 1);

                    // Click on second nav-item link
                    clickAndAwaitChanges(navItemLinkDes[0], fixture);
                }));

                it('... should have edition label and fa-icon', () => {
                    const navItemLinkSpanDes = getAndExpectDebugElementByCss(navItemDes[1], 'a.nav-link > span', 1, 1);
                    const navItemLinkSpanEl = navItemLinkSpanDes[0].nativeElement;

                    expectToBe(navItemLinkSpanEl.textContent, expectedNavbarLabels['edition']);

                    getAndExpectDebugElementByCss(navItemDes[1], 'a.nav-link > fa-icon', 1, 1);
                });

                it('... should display edition icon', () => {
                    const faIconDes = getAndExpectDebugElementByCss(navItemDes[1], 'a.nav-link > fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns, expectedNavbarIcons['edition']);
                });

                it('... should have a dropdown menu', () => {
                    getAndExpectDebugElementByCss(navItemDes[1], 'div.dropdown-menu', 1, 1);
                });

                it('... should have a dropdown header `Allgemein` as first child', () => {
                    const headerDes = getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > h6.dropdown-header:nth-child(1)',
                        1,
                        1
                    );
                    const headerEl = headerDes[0].nativeElement;

                    expectToBe(headerEl.textContent, expectedNavbarLabels['general']);
                });

                it('... should be followed by 3 dropdown items for edition overview, rowtables and preface', () => {
                    const overviewDes = getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > a.dropdown-item:nth-child(2)',
                        1,
                        1
                    );
                    const rowtablesDes = getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > a.dropdown-item:nth-child(3)',
                        1,
                        1
                    );
                    const prefaceDes = getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > a.dropdown-item:nth-child(4)',
                        1,
                        1
                    );

                    const overviewEl = overviewDes[0].nativeElement;
                    const rowtablesEl = rowtablesDes[0].nativeElement;
                    const prefaceEl = prefaceDes[0].nativeElement;

                    expectToBe(overviewEl.textContent, EDITION_ROUTE_CONSTANTS.SERIES.full);
                    expectToBe(rowtablesEl.textContent, EDITION_ROUTE_CONSTANTS.ROWTABLES.full);
                    expectToBe(prefaceEl.textContent, EDITION_ROUTE_CONSTANTS.PREFACE.full);
                });

                it('... should have another dropdown header `Auswahl Skizzenkomplexe` surrounded by dividers', () => {
                    getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > div.dropdown-divider:nth-child(5)',
                        1,
                        1
                    );
                    const headerDes = getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > h6.dropdown-header:nth-child(6)',
                        1,
                        1
                    );
                    const headerEl = headerDes[0].nativeElement;

                    getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > div.dropdown-divider:nth-child(7)',
                        1,
                        1
                    );

                    expectToBe(headerEl.textContent, expectedNavbarLabels['complexes']);
                });

                it('... should be followed by as many `div.awg-dropdown-complexes` as edition complexes are available', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );
                });

                it('... should display a header and a list of 3 dropdown items for each dropdown complex', () => {
                    const complexDes = getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );

                    // Expect header and 3 dropdown items for each dropdown complex
                    complexDes.forEach(complexDe => {
                        getAndExpectDebugElementByCss(complexDe, 'h6.dropdown-header', 1, 1);
                        getAndExpectDebugElementByCss(complexDe, 'a.dropdown-item', 3, 3);
                    });
                });

                it('... should display correct header for each dropdown complex', () => {
                    const complexDes = getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );

                    complexDes.forEach((complexDe, index) => {
                        const headerDes = getAndExpectDebugElementByCss(complexDe, 'h6.dropdown-header', 1, 1);
                        const headerEl = headerDes[0].nativeElement;

                        const headerSpanDes = getAndExpectDebugElementByCss(headerDes[0], 'span', 1, 1);
                        const headerSpanEl = headerSpanDes[0].nativeElement;

                        const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                        const series = expectedEditionComplexes[index].pubStatement.series.short;
                        const section = expectedEditionComplexes[index].pubStatement.section.short;

                        const headerSiglum = `[${awg} ${series}/${section}] `;
                        const headerId = expectedEditionComplexes[index].complexId.full;

                        expectToContain(headerEl.textContent, headerSiglum);
                        expectToBe(headerSpanEl.innerHTML.trim(), headerId.trim());
                    });
                });

                it('... should display correct dropdown item labels for each dropdown complex', () => {
                    const complexDes = getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );

                    // Expect header and 3 dropdown items for each dropdown complex
                    complexDes.forEach((complexDe, index) => {
                        const itemsDes = getAndExpectDebugElementByCss(complexDe, 'a.dropdown-item', 3, 3);
                        const itemsEl1 = itemsDes[0].nativeElement;
                        const itemsEl2 = itemsDes[1].nativeElement;
                        const itemsEl3 = itemsDes[2].nativeElement;

                        expectToBe(itemsEl1.textContent, EDITION_ROUTE_CONSTANTS.EDITION_INTRO.full);
                        expectToBe(itemsEl2.textContent, EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.full);
                        expectToBe(itemsEl3.textContent, EDITION_ROUTE_CONSTANTS.EDITION_REPORT.full);
                    });
                });
            });

            describe('... third nav-item link (structure)', () => {
                it('... should have structure label and fa-icon', () => {
                    const navItemLinkSpanDes = getAndExpectDebugElementByCss(navItemDes[2], 'a.nav-link > span', 1, 1);
                    const navItemLinkSpanEl = navItemLinkSpanDes[0].nativeElement;

                    expectToBe(navItemLinkSpanEl.textContent, expectedNavbarLabels['structure']);

                    getAndExpectDebugElementByCss(navItemDes[2], 'a.nav-link > fa-icon', 1, 1);
                });

                it('... should display structure icon', () => {
                    const faIconDes = getAndExpectDebugElementByCss(navItemDes[2], 'a.nav-link > fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns, expectedNavbarIcons['structure']);
                });
            });

            describe('... fourth nav-item link (contact)', () => {
                it('... should have contact label and fa-icon', () => {
                    const navItemLinkSpanDes = getAndExpectDebugElementByCss(navItemDes[3], 'a.nav-link > span', 1, 1);
                    const navItemLinkSpanEl = navItemLinkSpanDes[0].nativeElement;

                    expectToBe(navItemLinkSpanEl.textContent, expectedNavbarLabels['contact']);

                    getAndExpectDebugElementByCss(navItemDes[3], 'a.nav-link > fa-icon', 1, 1);
                });

                it('... should display contact icon', () => {
                    const faIconDes = getAndExpectDebugElementByCss(navItemDes[3], 'a.nav-link > fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns, expectedNavbarIcons['contact']);
                });
            });
        });

        describe('#isActiveRoute()', () => {
            it('... should have been called 2 times', () => {
                expectSpyCall(isActiveRouteSpy, 2);
            });

            it('... should return true if a given route is active', () => {
                const expectedActiveRoute = '/active-route';
                routerSpy.and.returnValue(true);

                expectToBe(component.isActiveRoute(expectedActiveRoute), true);
            });

            it('... should return false if a given route is not active', () => {
                const expectedActiveRoute = '/non-active-route';
                routerSpy.and.returnValue(false);

                expectToBe(component.isActiveRoute(expectedActiveRoute), false);
            });
        });

        describe('#provideMetaData()', () => {
            it('... should have been called', () => {
                expectSpyCall(provideMetaDataSpy, 1);
            });

            it('... should get `logos`', () => {
                expectToEqual(component.logos, expectedLogos);
            });

            it('... should have called coreService', () => {
                expectSpyCall(coreServiceSpy, 1);
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

            it('... can get correct numer of routerLinks from template', () => {
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
