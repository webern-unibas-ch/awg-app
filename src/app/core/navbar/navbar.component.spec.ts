/* eslint-disable @typescript-eslint/no-unused-vars */
import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click, clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

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

import { METADATA } from '@awg-core/core-data';
import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent (DONE)', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let coreServiceSpy: Spy;
    let getEditionComplexSpy: Spy;
    let isActiveRouteSpy: Spy;
    let routerSpy: Spy;
    let provideMetaDataSpy: Spy;
    let toggleNavSpy: Spy;

    let mockCoreService: Partial<CoreService>;
    let mockRouter: Partial<Router>;

    let expectedPageMetaData: MetaPage;

    let expectedContactIcon: IconDefinition;
    let expectedEditionIcon: IconDefinition;
    let expectedHomeIcon: IconDefinition;
    let expectedSearchIcon: IconDefinition;
    let expectedStructureIcon: IconDefinition;

    let expectedEditionComplexes: EditionComplex[];
    let expectedSelectedEditionComplex: EditionComplex = EDITION_COMPLEXES.OP12;
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
            getMetaDataSection: sectionType => METADATA[sectionType],
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

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedPageMetaData = METADATA[MetaSectionTypes.page];
        expectedEditionComplexes = [
            EDITION_COMPLEXES.OP12,
            EDITION_COMPLEXES.OP25,
            EDITION_COMPLEXES.M30,
            EDITION_COMPLEXES.M34,
        ];
        expectedSelectedEditionComplex = expectedEditionComplexes[0];

        expectedContactIcon = faEnvelope;
        expectedEditionIcon = faFileAlt;
        expectedHomeIcon = faHome;
        expectedSearchIcon = faSearch;
        expectedStructureIcon = faNetworkWired;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        coreServiceSpy = spyOn(mockCoreService, 'getMetaDataSection').and.callThrough();
        getEditionComplexSpy = spyOn(component, 'getEditionComplex').and.callThrough();
        isActiveRouteSpy = spyOn(component, 'isActiveRoute').and.callThrough();
        routerSpy = mockRouter.isActive as jasmine.Spy;
        provideMetaDataSpy = spyOn(component, 'provideMetaData').and.callThrough();
        toggleNavSpy = spyOn(component, 'toggleNav').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expect(mockCoreService === coreService).toBe(true);
    });

    describe('BEFORE initial data binding', () => {
        it('should have fontawesome icons', () => {
            expect(component.faEnvelope).toBeTruthy();
            expect(component.faEnvelope)
                .withContext(`should equal ${expectedContactIcon}`)
                .toEqual(expectedContactIcon);

            expect(component.faFileAlt).toBeTruthy();
            expect(component.faFileAlt).withContext(`should equal ${expectedEditionIcon}`).toEqual(expectedEditionIcon);

            expect(component.faHome).toBeTruthy();
            expect(component.faHome).withContext(`should equal ${expectedHomeIcon}`).toEqual(expectedHomeIcon);

            expect(component.faNetworkWired).toBeTruthy();
            expect(component.faNetworkWired)
                .withContext(`should equal ${expectedStructureIcon}`)
                .toEqual(expectedStructureIcon);

            expect(component.faSearch).toBeTruthy();
            expect(component.faSearch).withContext(`should equal ${expectedSearchIcon}`).toEqual(expectedSearchIcon);
        });

        it('should have `isCollapsed = true`', () => {
            expect(component.isCollapsed).withContext('should be true').toBeTrue();
        });

        it('should have `DISPLAYED_EDITION_COMPLEXES`', () => {
            expect(component.DISPLAYED_EDITION_COMPLEXES).toBeTruthy();
            expect(component.DISPLAYED_EDITION_COMPLEXES)
                .withContext(`should equal ${expectedEditionComplexes}`)
                .toEqual(expectedEditionComplexes);
        });

        it('should have `editionRouteConstants`', () => {
            expect(component.editionRouteConstants).toBeDefined();
            expect(component.editionRouteConstants)
                .withContext(`should be ${expectedEditionRouteConstants}`)
                .toBe(expectedEditionRouteConstants);
        });

        it('should not have `pageMetaData`', () => {
            expect(component.pageMetaData).toBeUndefined();
        });

        it('should not have `selectedEditionComplex`', () => {
            expect(component.selectedEditionComplex).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain 1 navbar', () => {
                getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
            });

            it('... should contain 2 navbar-brand links in navbar', () => {
                const navbarDe = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                getAndExpectDebugElementByCss(navbarDe[0], 'a.navbar-brand', 2, 2);
            });

            it('... should display first navbar-brand link on not sm devices, and second navbar-brand link on sm devices', () => {
                const navbarDe = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                const navbarBrandDes = getAndExpectDebugElementByCss(navbarDe[0], 'a.navbar-brand', 2, 2);

                const navbarBrandEl1 = navbarBrandDes[0].nativeElement;
                const navbarBrandEl2 = navbarBrandDes[1].nativeElement;

                expect(navbarBrandEl1.classList).withContext('should contain `d-sm-none`').toContain('d-sm-none');
                expect(navbarBrandEl1.classList).withContext('should contain `d-md-inline`').toContain('d-md-inline');

                expect(navbarBrandEl2.classList).withContext('should contain `d-sm-inline`').toContain('d-sm-inline');
                expect(navbarBrandEl2.classList).withContext('should contain `d-md-none`').toContain('d-md-none');
            });

            it('... should not render awg project url in navbar-brand link yet', () => {
                const urlDes = getAndExpectDebugElementByCss(compDe, 'a.navbar-brand', 2, 2);
                const urlEl1 = urlDes[0].nativeElement;
                const urlEl2 = urlDes[1].nativeElement;

                expect(urlEl1.href).toBeDefined();
                expect(urlEl1.href).withContext('should be empty string').toBe('');

                expect(urlEl2.href).toBeDefined();
                expect(urlEl2.href).withContext('should be empty string').toBe('');
            });

            it('... should contain 1 toggle button in navbar', () => {
                const navbarDe = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                getAndExpectDebugElementByCss(navbarDe[0], 'button.navbar-toggler', 1, 1);
            });

            it('... should contain 1 navbar collapse in navbar', () => {
                const navbarDe = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                getAndExpectDebugElementByCss(navbarDe[0], 'div.navbar-collapse', 1, 1);
            });

            it('... should contain 2 ul.navbar-nav in navbar collapse', () => {
                const navbarCollapseDe = getAndExpectDebugElementByCss(compDe, 'div.navbar-collapse', 1, 1);
                getAndExpectDebugElementByCss(navbarCollapseDe[0], 'ul.navbar-nav', 2, 2);
            });

            it('... should contain 3 nav-items in first ul.navbar-nav, and 2 nav-items in second ul.navbar-nav', () => {
                const navbarCollapseDe = getAndExpectDebugElementByCss(compDe, 'div.navbar-collapse', 1, 1);
                const ulDe = getAndExpectDebugElementByCss(navbarCollapseDe[0], 'ul.navbar-nav', 2, 2);

                getAndExpectDebugElementByCss(ulDe[0], 'li.nav-item', 3, 3);
                getAndExpectDebugElementByCss(ulDe[1], 'li.nav-item', 2, 2);
            });

            it('... should have `awg-app` label and fa-icon on first nav-item link', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const navItemLinkSpanDe = getAndExpectDebugElementByCss(navItemDe[0], 'a.nav-link > span', 2, 2);
                const navItemLinkSpanEl1 = navItemLinkSpanDe[0].nativeElement;
                const navItemLinkSpanEl2 = navItemLinkSpanDe[1].nativeElement;

                expect(navItemLinkSpanEl1.textContent).toBeTruthy();
                expect(navItemLinkSpanEl1.textContent).withContext('should be `awg-app`').toBe('awg-app');

                expect(navItemLinkSpanEl2.textContent).toBeTruthy();
                expect(navItemLinkSpanEl2.textContent).withContext('should be `(current)`').toBe('(current)');
                expect(navItemLinkSpanEl2.classList).withContext('should contain `sr-only`').toContain('sr-only');

                getAndExpectDebugElementByCss(navItemDe[0], 'a.nav-link > fa-icon', 1, 1);
            });

            it('... should have `Edition` label and fa-icon on second nav-item link', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const navItemLinkSpanDe = getAndExpectDebugElementByCss(navItemDe[1], 'a.nav-link > span', 1, 1);
                const navItemLinkSpanEl = navItemLinkSpanDe[0].nativeElement;

                expect(navItemLinkSpanEl.textContent).toBeTruthy();
                expect(navItemLinkSpanEl.textContent).withContext('should be `Edition`').toBe('Edition');

                getAndExpectDebugElementByCss(navItemDe[1], 'a.nav-link > fa-icon', 1, 1);
            });

            it('... should have `Strukturmodell` label and fa-icon on third nav-item link', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const navItemLinkSpanDe = getAndExpectDebugElementByCss(navItemDe[2], 'a.nav-link > span', 1, 1);
                const navItemLinkSpanEl = navItemLinkSpanDe[0].nativeElement;

                expect(navItemLinkSpanEl.textContent).toBeTruthy();
                expect(navItemLinkSpanEl.textContent).withContext('should be `Strukturmodell`').toBe('Strukturmodell');

                getAndExpectDebugElementByCss(navItemDe[2], 'a.nav-link > fa-icon', 1, 1);
            });

            it('... should have `Suche` label and fa-icon on fourth nav-item link', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const navItemLinkSpanDe = getAndExpectDebugElementByCss(navItemDe[3], 'a.nav-link > span', 1, 1);
                const navItemLinkSpanEl = navItemLinkSpanDe[0].nativeElement;

                expect(navItemLinkSpanEl.textContent).toBeTruthy();
                expect(navItemLinkSpanEl.textContent).withContext('should be `Suche`').toBe('Suche');

                getAndExpectDebugElementByCss(navItemDe[3], 'a.nav-link > fa-icon', 1, 1);
            });

            it('... should have `Kontakt` label and fa-icon on fifth nav-item link', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const navItemLinkSpanDe = getAndExpectDebugElementByCss(navItemDe[4], 'a.nav-link > span', 1, 1);
                const navItemLinkSpanEl = navItemLinkSpanDe[0].nativeElement;

                expect(navItemLinkSpanEl.textContent).toBeTruthy();
                expect(navItemLinkSpanEl.textContent).withContext('should be `Kontakt`').toBe('Kontakt');

                getAndExpectDebugElementByCss(navItemDe[4], 'a.nav-link > fa-icon', 1, 1);
            });
        });

        describe('#getEditionComplex', () => {
            it('should have a `getEditionComplex` method', () => {
                expect(component.getEditionComplex).toBeTruthy();
            });

            it('... should not have been called', () => {
                expectSpyCall(getEditionComplexSpy, 0);
            });

            it('... should not have `selectedEditionComplex`', () => {
                expect(component.selectedEditionComplex).toBeUndefined();
            });
        });

        describe('#isActiveRoute', () => {
            it('should have a `isActiveRoute` method', () => {
                expect(component.isActiveRoute).toBeTruthy();
            });

            it('... should not have been called', () => {
                expectSpyCall(isActiveRouteSpy, 0);
            });
        });

        describe('#provideMetaData', () => {
            it('should have a `provideMetaData` method', () => {
                expect(component.provideMetaData).toBeTruthy();
            });

            it('... should not have been called', () => {
                expectSpyCall(provideMetaDataSpy, 0);
            });

            it('... should not have `pageMetaData`', () => {
                expect(component.pageMetaData).toBeUndefined();
            });
        });

        describe('#toggleNav', () => {
            it('should have a `toggleNav` method', () => {
                expect(component.toggleNav).toBeTruthy();
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

                expect(component.isCollapsed).toBeFalse();

                component.toggleNav();

                expect(component.isCollapsed).toBeTrue();

                component.toggleNav();

                expect(component.isCollapsed).toBeFalse();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render awg project url in navbar-brand link', () => {
                const urlDes = getAndExpectDebugElementByCss(compDe, 'a.navbar-brand', 2, 2);
                const urlEl1 = urlDes[0].nativeElement;
                const urlEl2 = urlDes[1].nativeElement;

                expect(urlEl1.href).toBeDefined();
                expect(urlEl1.href)
                    .withContext(`should be ${expectedPageMetaData.awgProjectUrl}`)
                    .toBe(expectedPageMetaData.awgProjectUrl);

                expect(urlEl2.href).toBeDefined();
                expect(urlEl2.href)
                    .withContext(`should be ${expectedPageMetaData.awgProjectUrl}`)
                    .toBe(expectedPageMetaData.awgProjectUrl);
            });

            it('... should display home icon in first nav-item link ', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const faIconDe = getAndExpectDebugElementByCss(navItemDe[0], 'a.nav-link > fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expect(faIconIns).toBeTruthy();
                expect(faIconIns).withContext(`should equal ${expectedHomeIcon}`).toEqual(expectedHomeIcon);
            });

            it('... should display edition icon in second nav-item link ', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const faIconDe = getAndExpectDebugElementByCss(navItemDe[1], 'a.nav-link > fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expect(faIconIns).toBeTruthy();
                expect(faIconIns).withContext(`should equal ${expectedEditionIcon}`).toEqual(expectedEditionIcon);
            });

            it('... should display structure icon in third nav-item link ', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const faIconDe = getAndExpectDebugElementByCss(navItemDe[2], 'a.nav-link > fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expect(faIconIns).toBeTruthy();
                expect(faIconIns).withContext(`should equal ${expectedStructureIcon}`).toEqual(expectedStructureIcon);
            });

            it('... should display search icon in fourth nav-item link ', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const faIconDe = getAndExpectDebugElementByCss(navItemDe[3], 'a.nav-link > fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expect(faIconIns).toBeTruthy();
                expect(faIconIns).withContext(`should equal ${expectedSearchIcon}`).toEqual(expectedSearchIcon);
            });

            it('... should display contact icon in fifth nav-item link ', () => {
                const navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                const faIconDe = getAndExpectDebugElementByCss(navItemDe[4], 'a.nav-link > fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expect(faIconIns).toBeTruthy();
                expect(faIconIns).withContext(`should equal ${expectedContactIcon}`).toEqual(expectedContactIcon);
            });

            describe('... second nav-item link', () => {
                let navItemDe: DebugElement[];
                let navItemLinkDe: DebugElement[];

                beforeEach(fakeAsync(() => {
                    navItemDe = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 5, 5);
                    navItemLinkDe = getAndExpectDebugElementByCss(navItemDe[1], 'a.nav-link', 1, 1);

                    // Click on second nav-item link
                    clickAndAwaitChanges(navItemLinkDe[0], fixture);
                }));

                it('... should have a dropdown menu', () => {
                    // Expect dropdown menu
                    getAndExpectDebugElementByCss(navItemDe[1], 'div.dropdown-menu', 1, 1);
                });

                it('... should have a dropdown header `Allgemein` as first child', () => {
                    const headerDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > h6.dropdown-header:nth-child(1)',
                        1,
                        1
                    );
                    const headerEl = headerDe[0].nativeElement;

                    expect(headerEl.textContent).toBeTruthy();
                    expect(headerEl.textContent).withContext('should be `Allgemein`').toBe('Allgemein');
                });

                it('... should be followed by 2 dropdown items', () => {
                    const firstItemDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > a.dropdown-item:nth-child(2)',
                        1,
                        1
                    );
                    const secondItemDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > a.dropdown-item:nth-child(3)',
                        1,
                        1
                    );

                    const firstItemEl = firstItemDe[0].nativeElement;
                    const secondItemEl = secondItemDe[0].nativeElement;

                    expect(firstItemEl.textContent).toBeTruthy();
                    expect(firstItemEl.textContent)
                        .withContext('should be `Editionsübersicht`')
                        .toBe('Editionsübersicht');

                    expect(secondItemEl.textContent).toBeTruthy();
                    expect(secondItemEl.textContent).withContext('should be `Reihentabellen`').toBe('Reihentabellen');
                });

                it('... should have another dropdown header `Auswahl Skizzenkomplexe` surrounded by dividers', () => {
                    getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.dropdown-divider:nth-child(4)',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.dropdown-divider:nth-child(6)',
                        1,
                        1
                    );

                    const headerDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > h6.dropdown-header:nth-child(5)',
                        1,
                        1
                    );
                    const headerEl = headerDe[0].nativeElement;

                    expect(headerEl.textContent).toBeTruthy();
                    expect(headerEl.textContent)
                        .withContext('should be `Auswahl Skizzenkomplexe`')
                        .toBe('Auswahl Skizzenkomplexe');
                });

                it('... should be followed by as many `div.awg-dropdown-complexes` as edition complexes are available', () => {
                    const divDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );
                });

                it('... should display a header and a list of 3 dropdown items for each dropdown complex', () => {
                    const divDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );

                    // Expect header and 3 dropdown items for each dropdown complex
                    divDe.forEach(complexDe => {
                        getAndExpectDebugElementByCss(complexDe, 'h6.dropdown-header', 1, 1);
                        getAndExpectDebugElementByCss(complexDe, 'a.dropdown-item', 3, 3);
                    });
                });

                it('... should display correct header for each dropdown complex', () => {
                    const divDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );

                    divDe.forEach((complexDe, index) => {
                        const headerDe = getAndExpectDebugElementByCss(complexDe, 'h6.dropdown-header', 1, 1);
                        const headerEl = headerDe[0].nativeElement;

                        const headerSiglum = `[AWG ${expectedEditionComplexes[index].series.short}/${expectedEditionComplexes[index].section.short}] `;
                        const headerId = expectedEditionComplexes[index].complexId.full;
                        const strippedHeaderId = headerId.replace(/<em>/g, '').replace(/<\/em>/g, '');
                        const headerLabel = headerSiglum + strippedHeaderId;

                        expect(headerEl.textContent).toBeTruthy();
                        expect(headerEl.textContent.trim())
                            .withContext(`should be ${headerLabel}`)
                            .toBe(headerLabel.trim());
                    });
                });

                it('... should display correct dropdown item labels for each dropdown complex', () => {
                    const divDe = getAndExpectDebugElementByCss(
                        navItemDe[1],
                        'div.dropdown-menu > div.awg-dropdown-complexes',
                        expectedEditionComplexes.length,
                        expectedEditionComplexes.length
                    );

                    // Expect header and 3 dropdown items for each dropdown complex
                    divDe.forEach((complexDe, index) => {
                        const itemsDe = getAndExpectDebugElementByCss(complexDe, 'a.dropdown-item', 3, 3);
                        const itemsEl1 = itemsDe[0].nativeElement;
                        const itemsEl2 = itemsDe[1].nativeElement;
                        const itemsEl3 = itemsDe[2].nativeElement;

                        expect(itemsEl1.textContent).toBeTruthy();
                        expect(itemsEl1.textContent).withContext('should be `Einleitung`').toBe('Einleitung');

                        expect(itemsEl2.textContent).toBeTruthy();
                        expect(itemsEl2.textContent)
                            .withContext('should be `Edierte Notentexte`')
                            .toBe('Edierte Notentexte');

                        expect(itemsEl3.textContent).toBeTruthy();
                        expect(itemsEl3.textContent)
                            .withContext('should be `Kritischer Bericht`')
                            .toBe('Kritischer Bericht');
                    });
                });
            });
        });

        describe('#getEditionComplex', () => {
            it('... should have been called', () => {
                expectSpyCall(getEditionComplexSpy, 1);
            });

            it('... should get `selectedEditionComplex`', () => {
                expect(component.selectedEditionComplex).toBeDefined();
                expect(component.selectedEditionComplex)
                    .withContext(`should be ${expectedSelectedEditionComplex}`)
                    .toBe(expectedSelectedEditionComplex);
            });
        });

        describe('#isActiveRoute', () => {
            it('... should have been called 2 times', () => {
                expectSpyCall(isActiveRouteSpy, 2);
            });

            it('... should return true if a given route is active', () => {
                const expectedActiveRoute = '/active-route';
                routerSpy.and.returnValue(true);

                expect(component.isActiveRoute(expectedActiveRoute)).toBeTrue();
            });

            it('... should return false if a given route is not active', () => {
                const expectedActiveRoute = '/non-active-route';
                routerSpy.and.returnValue(false);

                expect(component.isActiveRoute(expectedActiveRoute)).toBeFalse();
            });
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expectSpyCall(provideMetaDataSpy, 1);
            });

            it('... should get `pageMetaData`', () => {
                expect(component.pageMetaData).toBeDefined();
                expect(component.pageMetaData)
                    .withContext(`should be ${expectedPageMetaData}`)
                    .toBe(expectedPageMetaData);
            });

            it('... should have called coreService', () => {
                expectSpyCall(coreServiceSpy, 1);
            });
        });

        describe('[routerLink]', () => {
            let expectedOrderOfRouterlinks: string[][];

            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 18, 18);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));

                expectedOrderOfRouterlinks = [
                    ['/home'],
                    [expectedEditionRouteConstants.EDITION.route, expectedEditionRouteConstants.SERIES.route],
                    [expectedEditionRouteConstants.EDITION.route, expectedEditionRouteConstants.ROWTABLES.route],
                    [expectedEditionComplexes[0].baseRoute, expectedEditionRouteConstants.EDITION_INTRO.route],
                    [expectedEditionComplexes[0].baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    [expectedEditionComplexes[0].baseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    [expectedEditionComplexes[1].baseRoute, expectedEditionRouteConstants.EDITION_INTRO.route],
                    [expectedEditionComplexes[1].baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    [expectedEditionComplexes[1].baseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    [expectedEditionComplexes[2].baseRoute, expectedEditionRouteConstants.EDITION_INTRO.route],
                    [expectedEditionComplexes[2].baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    [expectedEditionComplexes[2].baseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    [expectedEditionComplexes[3].baseRoute, expectedEditionRouteConstants.EDITION_INTRO.route],
                    [expectedEditionComplexes[3].baseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    [expectedEditionComplexes[3].baseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    ['/structure'],
                    ['/data'],
                    ['/contact'],
                ];
            });

            it('... can get correct numer of routerLinks from template', () => {
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
