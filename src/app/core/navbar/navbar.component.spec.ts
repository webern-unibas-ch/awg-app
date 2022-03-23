/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement, NgModule } from '@angular/core';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faEnvelope, faFileAlt, faHome, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgbCollapseModule, NgbConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';
import { CoreService } from '@awg-core/services';

import { EditionWork, EditionWorks } from '@awg-views/edition-view/models';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent (DONE)', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let mockCoreService: Partial<CoreService>;

    let expectedPageMetaData: MetaPage;

    let expectedEditionWorks: EditionWork[] = [EditionWorks.OP12, EditionWorks.OP25];
    let expectedSelectEditionWork: EditionWork = EditionWorks.OP12;

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

        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, NgbConfigModule],
            declarations: [NavbarComponent, RouterLinkStubDirective],
            providers: [{ provide: CoreService, useValue: mockCoreService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedPageMetaData = METADATA[MetaSectionTypes.page];
        expectedEditionWorks = [EditionWorks.OP12, EditionWorks.OP25];
        expectedSelectEditionWork = EditionWorks.OP12;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
        spyOn(component, 'toggleNav').and.callThrough();
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

        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });

            it('... should not have pageMetaData', () => {
                expect(component.pageMetaData).withContext('should be undefined').toBeUndefined();
            });
        });

        describe('#toggleNav', () => {
            it('... should not have been called', () => {
                expect(component.toggleNav).not.toHaveBeenCalled();
            });

            it('... should be called when button clicked (click helper)', () => {
                // Find button elements
                const buttonDes = getAndExpectDebugElementByCss(compDe, 'button.navbar-toggler', 1, 1);
                const buttonEl = buttonDes[0].nativeElement;

                // Should have not been called yet
                expect(component.toggleNav).not.toHaveBeenCalled();

                // Click button
                click(buttonDes[0]);
                click(buttonEl);

                expect(component.toggleNav).toHaveBeenCalled();
                expect(component.toggleNav).toHaveBeenCalledTimes(2);
            });

            it('... should toggle `isCollapsed`', () => {
                component.toggleNav();

                expect(component.isCollapsed).withContext(`should be false`).toBeFalse();

                component.toggleNav();

                expect(component.isCollapsed).withContext(`should be true`).toBeTrue();
            });
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
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            component.pageMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.page);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return metadata', () => {
                expect(component.pageMetaData).toBeDefined();
                expect(component.pageMetaData)
                    .withContext(`should be ${expectedPageMetaData}`)
                    .toBe(expectedPageMetaData);
            });
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

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 12, 12);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get 12 routerLinks from template', () => {
                expect(routerLinks.length).withContext('should have 12 routerLinks').toBe(12);
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
                        `should equal ${[expectedEditionWorks[0].baseRoute, expectedEditionWorks[0].introRoute.route]}`
                    )
                    .toEqual([expectedEditionWorks[0].baseRoute, expectedEditionWorks[0].introRoute.route]);

                expect(routerLinks[4].linkParams)
                    .withContext(
                        `should equal ${[expectedEditionWorks[0].baseRoute, expectedEditionWorks[0].sheetsRoute.route]}`
                    )
                    .toEqual([expectedEditionWorks[0].baseRoute, expectedEditionWorks[0].sheetsRoute.route]);

                expect(routerLinks[5].linkParams)
                    .withContext(
                        `should equal ${[expectedEditionWorks[0].baseRoute, expectedEditionWorks[0].reportRoute.route]}`
                    )
                    .toEqual([expectedEditionWorks[0].baseRoute, expectedEditionWorks[0].reportRoute.route]);

                expect(routerLinks[6].linkParams)
                    .withContext(
                        `should equal ${[expectedEditionWorks[1].baseRoute, expectedEditionWorks[1].introRoute.route]}`
                    )
                    .toEqual([expectedEditionWorks[1].baseRoute, expectedEditionWorks[1].introRoute.route]);

                expect(routerLinks[7].linkParams)
                    .withContext(
                        `should equal ${[expectedEditionWorks[1].baseRoute, expectedEditionWorks[1].sheetsRoute.route]}`
                    )
                    .toEqual([expectedEditionWorks[1].baseRoute, expectedEditionWorks[1].sheetsRoute.route]);

                expect(routerLinks[8].linkParams)
                    .withContext(
                        `should equal ${[expectedEditionWorks[1].baseRoute, expectedEditionWorks[1].reportRoute.route]}`
                    )
                    .toEqual([expectedEditionWorks[1].baseRoute, expectedEditionWorks[1].reportRoute.route]);

                expect(routerLinks[9].linkParams).withContext(`should equal ['/structure']`).toEqual(['/structure']);
                expect(routerLinks[10].linkParams).withContext(`should equal ['/data']`).toEqual(['/data']);
                expect(routerLinks[11].linkParams).withContext(`should equal ['/contact']`).toEqual(['/contact']);
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

                const expectedRoute = [expectedSelectEditionWork.baseRoute, expectedSelectEditionWork.introRoute.route];

                expect(editionLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                click(editionLinkDe);
                fixture.detectChanges();

                expect(editionLink.navigatedTo).toBeTruthy();
                expect(editionLink.navigatedTo).withContext(`should equal ${expectedRoute}`).toEqual(expectedRoute);
            });

            it('... can click Structure link in template', () => {
                const structureLinkDe = linkDes[9]; // Structure link DebugElement
                const structureLink = routerLinks[9]; // Structure link directive

                const expectedRoute = ['/structure'];

                expect(structureLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                click(structureLinkDe);
                fixture.detectChanges();

                expect(structureLink.navigatedTo).toBeTruthy();
                expect(structureLink.navigatedTo).withContext(`should equal ${expectedRoute}`).toEqual(expectedRoute);
            });

            it('... can click Data link in template', () => {
                const dataLinkDe = linkDes[10]; // Data link DebugElement
                const dataLink = routerLinks[10]; // Data link directive

                const expectedRoute = ['/data'];

                expect(dataLink.navigatedTo).withContext('should not have navigated yet').toBeNull();

                click(dataLinkDe);
                fixture.detectChanges();

                expect(dataLink.navigatedTo).toBeTruthy();
                expect(dataLink.navigatedTo).withContext(`should equal ${expectedRoute}`).toEqual(expectedRoute);
            });

            it('... can click Contact link in template', () => {
                const contactLinkDe = linkDes[11]; // Contact link DebugElement
                const contactLink = routerLinks[11]; // Contact link directive

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
