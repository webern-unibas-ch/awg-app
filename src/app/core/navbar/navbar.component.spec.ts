/* eslint-disable @typescript-eslint/no-unused-vars */
import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faEnvelope, faFileAlt, faHome, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgbCollapseModule, NgbConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { METADATA } from '@awg-core/core-data';
import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
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

    let expectedEditionComplexes: EditionComplex[];
    let expectedSelectedEditionComplex: EditionComplex = EDITION_COMPLEXES.OP12;

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
        expectedEditionComplexes = [EDITION_COMPLEXES.OP12, EDITION_COMPLEXES.OP25, EDITION_COMPLEXES.M34];
        expectedSelectedEditionComplex = expectedEditionComplexes[0];

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
            expect(component.faEnvelope).withContext('should be faEnvelope').toBe(faEnvelope);

            expect(component.faFileAlt).toBeTruthy();
            expect(component.faFileAlt).withContext('should be faFileAlt').toBe(faFileAlt);

            expect(component.faHome).toBeTruthy();
            expect(component.faHome).withContext('should be faHome').toBe(faHome);

            expect(component.faNetworkWired).toBeTruthy();
            expect(component.faNetworkWired).withContext('should be faNetworkWired').toBe(faNetworkWired);

            expect(component.faSearch).toBeTruthy();
            expect(component.faSearch).withContext('should be faSearch').toBe(faSearch);
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

        it('should not have `pageMetaData`', () => {
            expect(component.pageMetaData).toBeUndefined();
        });

        it('should not have `selectedEditionComplex`', () => {
            expect(component.selectedEditionComplex).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain 1 navbar with 1 toggle button', () => {
                getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'nav.navbar > button.navbar-toggler', 1, 1);
            });

            it('... should contain 1 navbar collapse', () => {
                getAndExpectDebugElementByCss(compDe, 'nav.navbar > .navbar-collapse', 1, 1);
            });

            it('... should not render awg project url in navbar-brand yet', () => {
                const urlDes = getAndExpectDebugElementByCss(compDe, 'a.navbar-brand', 2, 2);
                const urlEl1 = urlDes[0].nativeElement;
                const urlEl2 = urlDes[1].nativeElement;

                expect(urlEl1.href).toBeDefined();
                expect(urlEl1.href).withContext('should be empty string').toBe('');

                expect(urlEl2.href).toBeDefined();
                expect(urlEl2.href).withContext('should be empty string').toBe('');
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

            it('... should be called when button clicked (click helper)', () => {
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
            it('... should render awg project url in navbar-brand', () => {
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
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 15, 15);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get 15 routerLinks from template', () => {
                expect(routerLinks.length).withContext('should have 12 routerLinks').toBe(15);
            });

            it('... can get correct routes from routerLinks', () => {
                expect(routerLinks[0].linkParams).withContext(`should equal ['/home']`).toEqual(['/home']);

                expect(routerLinks[1].linkParams)
                    .withContext(`should equal ['/edition/series']`)
                    .toEqual(['/edition/series']);

                expect(routerLinks[2].linkParams)
                    .withContext(`should equal ['/edition/row-tables']`)
                    .toEqual(['/edition/row-tables']);

                expect(routerLinks[3].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexes[0].baseRoute,
                            expectedEditionComplexes[0].introRoute.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexes[0].baseRoute, expectedEditionComplexes[0].introRoute.route]);

                expect(routerLinks[4].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexes[0].baseRoute,
                            expectedEditionComplexes[0].sheetsRoute.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexes[0].baseRoute, expectedEditionComplexes[0].sheetsRoute.route]);

                expect(routerLinks[5].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexes[0].baseRoute,
                            expectedEditionComplexes[0].reportRoute.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexes[0].baseRoute, expectedEditionComplexes[0].reportRoute.route]);

                expect(routerLinks[6].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexes[1].baseRoute,
                            expectedEditionComplexes[1].introRoute.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexes[1].baseRoute, expectedEditionComplexes[1].introRoute.route]);

                expect(routerLinks[7].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexes[1].baseRoute,
                            expectedEditionComplexes[1].sheetsRoute.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexes[1].baseRoute, expectedEditionComplexes[1].sheetsRoute.route]);

                expect(routerLinks[8].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexes[1].baseRoute,
                            expectedEditionComplexes[1].reportRoute.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexes[1].baseRoute, expectedEditionComplexes[1].reportRoute.route]);

                expect(routerLinks[9].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexes[2].baseRoute,
                            expectedEditionComplexes[2].introRoute.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexes[2].baseRoute, expectedEditionComplexes[2].introRoute.route]);

                expect(routerLinks[10].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexes[2].baseRoute,
                            expectedEditionComplexes[2].sheetsRoute.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexes[2].baseRoute, expectedEditionComplexes[2].sheetsRoute.route]);

                expect(routerLinks[11].linkParams)
                    .withContext(
                        `should equal ${[
                            expectedEditionComplexes[2].baseRoute,
                            expectedEditionComplexes[2].reportRoute.route,
                        ]}`
                    )
                    .toEqual([expectedEditionComplexes[2].baseRoute, expectedEditionComplexes[2].reportRoute.route]);

                expect(routerLinks[12].linkParams).withContext(`should equal ['/structure']`).toEqual(['/structure']);
                expect(routerLinks[13].linkParams).withContext(`should equal ['/data']`).toEqual(['/data']);
                expect(routerLinks[14].linkParams).withContext(`should equal ['/contact']`).toEqual(['/contact']);
            });

            it('... can click Home link in template', () => {
                const homeLinkDe = linkDes[0]; // Home link DebugElement
                const homeLink = routerLinks[0]; // Home link directive

                const expectedRoute = ['/home'];

                expect(homeLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                click(homeLinkDe);
                fixture.detectChanges();

                expect(homeLink.navigatedTo).toBeTruthy();
                expect(homeLink.navigatedTo).withContext(`should equal ${expectedRoute}`).toEqual(expectedRoute);
            });

            it('... can click Edition link in template', () => {
                const editionLinkDe = linkDes[3]; // Edition link DebugElement
                const editionLink = routerLinks[3]; // Edition link directive

                const expectedRoute = [
                    expectedSelectedEditionComplex.baseRoute,
                    expectedSelectedEditionComplex.introRoute.route,
                ];

                expect(editionLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                click(editionLinkDe);
                fixture.detectChanges();

                expect(editionLink.navigatedTo).toBeTruthy();
                expect(editionLink.navigatedTo).withContext(`should equal ${expectedRoute}`).toEqual(expectedRoute);
            });

            it('... can click Structure link in template', () => {
                const structureLinkDe = linkDes[12]; // Structure link DebugElement
                const structureLink = routerLinks[12]; // Structure link directive

                const expectedRoute = ['/structure'];

                expect(structureLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                click(structureLinkDe);
                fixture.detectChanges();

                expect(structureLink.navigatedTo).toBeTruthy();
                expect(structureLink.navigatedTo).withContext(`should equal ${expectedRoute}`).toEqual(expectedRoute);
            });

            it('... can click Data link in template', () => {
                const dataLinkDe = linkDes[13]; // Data link DebugElement
                const dataLink = routerLinks[13]; // Data link directive

                const expectedRoute = ['/data'];

                expect(dataLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                click(dataLinkDe);
                fixture.detectChanges();

                expect(dataLink.navigatedTo).toBeTruthy();
                expect(dataLink.navigatedTo).withContext(`should equal ${expectedRoute}`).toEqual(expectedRoute);
            });

            it('... can click Contact link in template', () => {
                const contactLinkDe = linkDes[14]; // Contact link DebugElement
                const contactLink = routerLinks[14]; // Contact link directive

                const expectedRoute = ['/contact'];

                expect(contactLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                click(contactLinkDe);
                fixture.detectChanges();

                expect(contactLink.navigatedTo).toBeTruthy();
                expect(contactLink.navigatedTo).withContext(`should equal ${expectedRoute}`).toEqual(expectedRoute);
            });
        });
    });
});
