import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap/collapse';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EditionOutlineSection } from '@awg-views/edition-view/models';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { LOGOS_DATA } from '../data/logos.data';
import { LogoLinkComponent } from '../logo-link/logo-link.component';
import { Logo, Logos } from '../models/logos.model';
import { CoreService } from '../services/core-service/core.service';

import {
    NAVBAR_DISPLAYED_SECTION_IDS,
    NAVBAR_DROPDOWN_EDITION_GENERAL_LINKS,
    NAVBAR_DROPDOWN_EDITION_SECTION_LINKS,
    NAVBAR_ITEMS,
} from './data/navbar.data';
import { NavbarDropdownLink, NavbarItem, NavbarItems, NavbarSection } from './models/navbar.model';
import { NavbarDropdownLinkComponent } from './navbar-dropdown-link/navbar-dropdown-link.component';
import { NavbarItemComponent } from './navbar-item/navbar-item.component';
import { NavbarComponent } from './navbar.component';

// Mock components
@Component({
    selector: 'awg-logo-link',
    template: '',
})
class LogoLinkStubComponent {
    logoData = input.required<Logo>();
}

@Component({
    selector: 'awg-navbar-dropdown-link',
    template: '',
})
class NavbarDropdownLinkStubComponent {
    label = input.required<string>();
    route = input.required<string[]>();
}

@Component({
    selector: 'awg-navbar-item',
    template: '',
})
class NavbarItemStubComponent {
    item = input.required<NavbarItem>();
    id = input<string>('');
    isDropdown = input<boolean>(false);
}

describe('NavbarComponent (DONE)', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let compDe: DebugElement;

    let router: Router;
    let mockCoreService: Partial<CoreService>;

    let toggleNavSpy: Spy;
    let mapSectionToNavbarLinkSpy: Spy;

    let expectedLogosData: Logos;
    let expectedSectionsData: EditionOutlineSection[];
    let expectedDisplayedSections: NavbarSection[];
    let expectedNavbarItems: NavbarItems;
    let expectedGeneralEditionLinks: NavbarDropdownLink[];
    let expectedSectionEditionLinks: NavbarDropdownLink[];

    beforeAll(() => {
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        // Mock service for test purposes
        mockCoreService = {
            getLogos: () => LOGOS_DATA,
        };

        await TestBed.configureTestingModule({
            imports: [NavbarComponent],
            providers: [
                provideRouter([
                    { path: 'home', component: NavbarComponent },
                    { path: 'edition', component: NavbarComponent },
                ]),
                { provide: CoreService, useValue: mockCoreService },
            ],
        })
            .overrideComponent(NavbarComponent, {
                remove: { imports: [LogoLinkComponent, NavbarDropdownLinkComponent, NavbarItemComponent] },
                add: { imports: [LogoLinkStubComponent, NavbarDropdownLinkStubComponent, NavbarItemStubComponent] },
            })
            .compileComponents();

        // Disable animation for NgbCollapse to avoid timing issues in tests
        const collapseConfig = TestBed.inject(NgbCollapseConfig);
        collapseConfig.animation = false;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        router = TestBed.inject(Router);

        // Test data
        expectedNavbarItems = NAVBAR_ITEMS;
        expectedGeneralEditionLinks = NAVBAR_DROPDOWN_EDITION_GENERAL_LINKS;
        expectedSectionEditionLinks = NAVBAR_DROPDOWN_EDITION_SECTION_LINKS;
        expectedLogosData = LOGOS_DATA;
        expectedSectionsData = NAVBAR_DISPLAYED_SECTION_IDS.map(section =>
            EditionOutlineService.getEditionSectionById(section.seriesId, section.sectionId)
        );
        expectedDisplayedSections = expectedSectionsData.map(section => ({
            baseRoute: ['/edition', 'series', section.seriesParent.route, 'section', section.section.route],
            fullTitle: section.section.full,
            shortTitle: `[AWG ${section.seriesParent.short}/${section.section.short}]`,
        }));

        // Spies
        toggleNavSpy = vi.spyOn(component, 'toggleNav');
        mapSectionToNavbarLinkSpy = vi.spyOn(component as any, '_mapSectionToNavbarLink');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expectToBe(mockCoreService === coreService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `navbarItems`', () => {
            expectToEqual(component.navbarItems, expectedNavbarItems);
        });

        it('... should have `generalEditionLinks`', () => {
            expectToEqual(component.generalEditionLinks, expectedGeneralEditionLinks);
        });

        it('... should have `sectionEditionLinks`', () => {
            expectToEqual(component.sectionEditionLinks, expectedSectionEditionLinks);
        });

        it('... should have `isCollapsed = true`', () => {
            expectToBe(component.isCollapsed(), true);
        });

        it('... should have `logosData`', () => {
            expectToEqual(component.logosData(), expectedLogosData);
        });

        it('... should have `sectionsData`', () => {
            expectToEqual(component.sectionsData(), expectedSectionsData);
        });

        it('... should have computed `displayedSections`', () => {
            expectToEqual(component.displayedSections(), expectedDisplayedSections);
        });

        describe('VIEW', () => {
            it('... should contain one navbar', () => {
                getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
            });

            it('... should contain two navbar-brand-container in navbar', () => {
                getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
            });

            it('... should display first navbar-brand link not on sm devices, and second navbar-brand link only on sm devices', () => {
                const navbarDes = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                const brandContainerDes = getAndExpectDebugElementByCss(navbarDes[0], '.navbar-brand-container', 2, 2);

                const brandContainerEl1: HTMLElement = brandContainerDes[0].nativeElement;
                const brandContainerEl2: HTMLElement = brandContainerDes[1].nativeElement;

                expectToContain(brandContainerEl1.classList, 'd-sm-none');
                expectToContain(brandContainerEl1.classList, 'd-md-inline');

                expectToContain(brandContainerEl2.classList, 'd-sm-inline');
                expectToContain(brandContainerEl2.classList, 'd-md-none');
            });

            it('... should contain one logo link components in each of the two navbar-brand-containers', () => {
                const navbarDes = getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                const brandContainerDes = getAndExpectDebugElementByCss(navbarDes[0], '.navbar-brand-container', 2, 2);

                brandContainerDes.forEach(brandContainerDe => {
                    getAndExpectDebugElementByDirective(brandContainerDe, LogoLinkStubComponent, 1, 1);
                });
            });

            it('... should throw due to missing required values for logo link component', () => {
                const logoLinkDes = getAndExpectDebugElementByDirective(compDe, LogoLinkStubComponent, 2, 2);

                logoLinkDes.forEach(logoLinkDe => {
                    const logoLinkCmp = logoLinkDe.injector.get(LogoLinkStubComponent) as LogoLinkStubComponent;

                    // Expect the required inputs to throw if not provided
                    expect(() => logoLinkCmp.logoData()).toThrow();
                });
            });

            it('... should contain one toggle button in navbar', () => {
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

            it('... should contain one navbar item component in each of the nav-items', () => {
                const navItemDes = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 4, 4);

                navItemDes.forEach(navItemDe => {
                    getAndExpectDebugElementByDirective(navItemDe, NavbarItemStubComponent, 1, 1);
                });
            });

            it('... should throw due to missing required values for navbar item component', () => {
                const navbarItemDes = getAndExpectDebugElementByDirective(compDe, NavbarItemStubComponent, 4, 4);

                navbarItemDes.forEach(navItemDe => {
                    const navbarItemCmp = navItemDe.injector.get(NavbarItemStubComponent) as NavbarItemStubComponent;

                    // Expect the required inputs to throw if not provided
                    expect(() => navbarItemCmp.item()).toThrow();
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
            let navItemDes: DebugElement[];

            beforeEach(() => {
                navItemDes = getAndExpectDebugElementByCss(compDe, 'li.nav-item', 4, 4);
            });

            it('... should pass down logoData to logo link components', () => {
                const logoLinkDes = getAndExpectDebugElementByDirective(compDe, LogoLinkStubComponent, 2, 2);

                logoLinkDes.forEach(logoLinkDe => {
                    const logoLinkCmp = logoLinkDe.injector.get(LogoLinkStubComponent) as LogoLinkStubComponent;

                    expectToEqual(logoLinkCmp.logoData(), expectedLogosData['awg']);
                });
            });

            describe('... first nav-item link (home)', () => {
                it('... should pass down home item to navbar item component', () => {
                    const navbarItemDes = getAndExpectDebugElementByDirective(compDe, NavbarItemStubComponent, 4, 4);
                    const navbarItemCmp = navbarItemDes[0].injector.get(
                        NavbarItemStubComponent
                    ) as NavbarItemStubComponent;

                    expectToEqual(navbarItemCmp.item(), expectedNavbarItems.home);
                });
            });

            describe('... second nav-item link (edition)', () => {
                it('... should pass down edition item to navbar item component', () => {
                    const navbarItemDes = getAndExpectDebugElementByDirective(compDe, NavbarItemStubComponent, 4, 4);
                    const navbarItemCmp = navbarItemDes[1].injector.get(
                        NavbarItemStubComponent
                    ) as NavbarItemStubComponent;

                    expectToEqual(navbarItemCmp.item(), expectedNavbarItems.edition);
                });

                it('... should have a dropdown menu', () => {
                    getAndExpectDebugElementByCss(navItemDes[1], 'div.dropdown-menu', 1, 1);
                });

                it('... should have a dropdown heading `Allgemein` as first child', () => {
                    const hDes = getAndExpectDebugElementByCss(
                        navItemDes[1],
                        'div.dropdown-menu > h6.dropdown-header:nth-child(1)',
                        1,
                        1
                    );
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                    expectToBe(hEl.textContent, 'Allgemein');
                });

                it('... should be followed by 3 dropdown link components for general edition links', () => {
                    const dropdownDes = getAndExpectDebugElementByCss(compDe, 'div.dropdown-menu', 1, 1);
                    const dropdownLinkDes = getAndExpectDebugElementByDirective(
                        dropdownDes[0],
                        NavbarDropdownLinkStubComponent,
                        7,
                        7
                    );
                    const generalLinkDes = dropdownLinkDes.filter(
                        linkDe => !linkDe.nativeElement.closest('.awg-dropdown-sections')
                    );

                    expectToBe(generalLinkDes.length, 3);
                });

                it('... should pass down label and route to dropdown link component', () => {
                    const dropdownDes = getAndExpectDebugElementByCss(compDe, 'div.dropdown-menu', 1, 1);
                    const dropdownLinkDes = getAndExpectDebugElementByDirective(
                        dropdownDes[0],
                        NavbarDropdownLinkStubComponent,
                        7,
                        7
                    );
                    const generalLinkDes = dropdownLinkDes.filter(
                        linkDe => !linkDe.nativeElement.closest('.awg-dropdown-sections')
                    );

                    expectToBe(generalLinkDes.length, 3);

                    generalLinkDes.forEach((linkDe, index) => {
                        const dropdownLinkCmp = linkDe.injector.get(
                            NavbarDropdownLinkStubComponent
                        ) as NavbarDropdownLinkStubComponent;
                        const expectedLink = expectedGeneralEditionLinks[index];

                        expectToBe(dropdownLinkCmp.label(), expectedLink.label);
                        expectToEqual(dropdownLinkCmp.route(), expectedLink.route);
                    });
                });

                it('... should have another dropdown heading `Auswahl Abteilungen` surrounded by dividers', () => {
                    const dropdownDes = getAndExpectDebugElementByCss(compDe, 'div.dropdown-menu', 1, 1);

                    getAndExpectDebugElementByCss(
                        dropdownDes[0],
                        'div.dropdown-menu > div.dropdown-divider:nth-child(5)',
                        1,
                        1
                    );
                    const hDes = getAndExpectDebugElementByCss(
                        dropdownDes[0],
                        'div.dropdown-menu > h6.dropdown-header:nth-child(6)',
                        1,
                        1
                    );
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                    getAndExpectDebugElementByCss(
                        dropdownDes[0],
                        'div.dropdown-menu > div.dropdown-divider:nth-child(7)',
                        1,
                        1
                    );

                    expectToBe(hEl.textContent, 'Auswahl Abteilungen');
                });

                it('... should be followed by as many `div.awg-dropdown-sections` as edition sections are available', () => {
                    const dropdownDes = getAndExpectDebugElementByCss(compDe, 'div.dropdown-menu', 1, 1);

                    getAndExpectDebugElementByCss(
                        dropdownDes[0],
                        'div.dropdown-menu > div.awg-dropdown-sections',
                        expectedDisplayedSections.length,
                        expectedDisplayedSections.length
                    );
                });

                it('... should contain a heading for each dropdown section', () => {
                    const sectionsDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.dropdown-menu > div.awg-dropdown-sections',
                        expectedDisplayedSections.length,
                        expectedDisplayedSections.length
                    );

                    sectionsDes.forEach(sectionDe => {
                        getAndExpectDebugElementByCss(sectionDe, 'h6.dropdown-header', 1, 1);
                    });
                });

                it('... should display correct heading for each dropdown section', () => {
                    const sectionsDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.dropdown-menu > div.awg-dropdown-sections',
                        expectedDisplayedSections.length,
                        expectedDisplayedSections.length
                    );

                    sectionsDes.forEach((sectionDe, index) => {
                        const hDes = getAndExpectDebugElementByCss(sectionDe, 'h6.dropdown-header', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const headingSpanDes = getAndExpectDebugElementByCss(hDes[0], 'span', 1, 1);
                        const headingSpanEl: HTMLSpanElement = headingSpanDes[0].nativeElement;

                        const expectedSection = component.displayedSections()[index];

                        const headingSiglum = expectedSection.shortTitle;
                        const headingId = expectedSection.fullTitle;

                        expectToContain(hEl.textContent, headingSiglum);
                        expectToBe(headingSpanEl.innerHTML.trim(), headingId.trim());
                    });
                });

                it('... should be followed by 2 dropdown item components for each dropdown section', () => {
                    const sectionsDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.dropdown-menu > div.awg-dropdown-sections',
                        expectedDisplayedSections.length,
                        expectedDisplayedSections.length
                    );

                    sectionsDes.forEach(sectionDe => {
                        getAndExpectDebugElementByDirective(
                            sectionDe,
                            NavbarDropdownLinkStubComponent,
                            expectedSectionEditionLinks.length,
                            expectedSectionEditionLinks.length
                        );
                    });
                });

                it('... should pass down label and route to dropdown link component for each dropdown section', () => {
                    const sectionsDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.dropdown-menu > div.awg-dropdown-sections',
                        expectedDisplayedSections.length,
                        expectedDisplayedSections.length
                    );

                    sectionsDes.forEach((sectionDe, sectionIndex) => {
                        const section = expectedDisplayedSections[sectionIndex];
                        const dropdownLinkDes = getAndExpectDebugElementByDirective(
                            sectionDe,
                            NavbarDropdownLinkStubComponent,
                            expectedSectionEditionLinks.length,
                            expectedSectionEditionLinks.length
                        );

                        expectedSectionEditionLinks.forEach((link, linkIndex) => {
                            const linkDe = dropdownLinkDes[linkIndex];
                            const dropdownLinkCmp = linkDe.injector.get(
                                NavbarDropdownLinkStubComponent
                            ) as NavbarDropdownLinkStubComponent;

                            const expectedRoute = [...section.baseRoute, ...link.route];

                            expectToBe(dropdownLinkCmp.label(), link.label);
                            expectToEqual(dropdownLinkCmp.route(), expectedRoute);
                        });
                    });
                });
            });

            describe('... third nav-item link (structure)', () => {
                it('... should pass down structure item to navbar item component', () => {
                    const navbarItemDes = getAndExpectDebugElementByDirective(compDe, NavbarItemStubComponent, 4, 4);
                    const navbarItemCmp = navbarItemDes[2].injector.get(
                        NavbarItemStubComponent
                    ) as NavbarItemStubComponent;

                    expectToEqual(navbarItemCmp.item(), expectedNavbarItems.structure);
                });
            });

            describe('... fourth nav-item link (contact)', () => {
                it('... should pass down contact item to navbar item component', () => {
                    const navbarItemDes = getAndExpectDebugElementByDirective(compDe, NavbarItemStubComponent, 4, 4);
                    const navbarItemCmp = navbarItemDes[3].injector.get(
                        NavbarItemStubComponent
                    ) as NavbarItemStubComponent;

                    expectToEqual(navbarItemCmp.item(), expectedNavbarItems.contact);
                });
            });
        });

        describe('#isEditionRouteActive()', () => {
            it('... should have a signal `isEditionRouteActive`', async () => {
                expect(component.isEditionRouteActive).toBeDefined();
            });

            it('should react when the route changes to `/edition`', async () => {
                await router.navigateByUrl('/home');
                fixture.detectChanges();

                expectToBe(component.isEditionRouteActive(), false);

                await router.navigateByUrl('/edition');
                fixture.detectChanges();

                expectToBe(component.isEditionRouteActive(), true);
            });
        });

        describe('METHODS', () => {
            describe('#toggleNav()', () => {
                it('... should have a method `toggleNav`', () => {
                    expect(component.toggleNav).toBeDefined();
                });

                it('... should not have been called', () => {
                    expectSpyCall(toggleNavSpy, 0);
                });

                it('... should be called when navbar toggle button clicked (click helper)', async () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.navbar-toggler', 1, 1);

                    expectSpyCall(toggleNavSpy, 0);

                    // Click button
                    await clickAndAwaitChanges(btnDes[0], fixture);
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(toggleNavSpy, 2);
                });

                it('... should toggle `isCollapsed`', () => {
                    component.toggleNav();

                    expectToBe(component.isCollapsed(), false);

                    component.toggleNav();

                    expectToBe(component.isCollapsed(), true);

                    component.toggleNav();

                    expectToBe(component.isCollapsed(), false);
                });
            });

            describe('#_mapSectionToNavbarLink()', () => {
                it('... should have a method `_mapSectionToNavbarLink`', () => {
                    expect((component as any)._mapSectionToNavbarLink).toBeDefined();
                });

                it('... should be triggered by `displayedSections` computed signal for each edition section', () => {
                    expectSpyCall(mapSectionToNavbarLinkSpy, expectedSectionsData.length);
                });

                it('... should map a given outline section to a NavbarSection', () => {
                    expectedSectionsData.forEach((section, index) => {
                        const actualLink = (component as any)._mapSectionToNavbarLink(section);
                        expectToEqual(actualLink, expectedDisplayedSections[index]);
                    });
                });
            });
        });
    });
});
