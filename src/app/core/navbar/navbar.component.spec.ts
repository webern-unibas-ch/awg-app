/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faFileAlt, faHome, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Meta, MetaContact, MetaPage, MetaSectionTypes, MetaStructure } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';
import { CoreService } from '@awg-core/services';

import { EditionWork, EditionWorks } from '@awg-views/edition-view/models';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent (DONE)', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes: DebugElement[];
    let routerLinks;

    let mockCoreService: Partial<CoreService>;

    let expectedPageMetaData: MetaPage;
    let expectedIsCollapsed: boolean;

    let expectedEditionWorks: EditionWork[] = [EditionWorks.OP12, EditionWorks.OP25];
    let expectedSelectEditionWork: EditionWork = EditionWorks.OP12;

    beforeEach(
        waitForAsync(() => {
            // Stub service for test purposes
            mockCoreService = {
                getMetaDataSection: sectionType => METADATA[sectionType]
            };

            TestBed.configureTestingModule({
                imports: [FontAwesomeModule, NgbCollapseModule, NgbDropdownModule],
                declarations: [NavbarComponent, RouterLinkStubDirective],
                providers: [{ provide: CoreService, useValue: mockCoreService }]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedIsCollapsed = true;
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
            expect(component.faEnvelope).toBe(faEnvelope, 'should be faEnvelope');
            expect(component.faFileAlt).toBe(faFileAlt, 'should be faFileAlt');
            expect(component.faHome).toBe(faHome, 'should be faHome');
            expect(component.faNetworkWired).toBe(faNetworkWired, 'should be faNetworkWired');
            expect(component.faSearch).toBe(faSearch, 'should be faSearch');
        });

        it('should have `isCollapsed = true`', () => {
            expect(component.isCollapsed).toBe(true, 'should be true');
        });

        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });

            it('... should not have pageMetaData', () => {
                expect(component.pageMetaData).toBeUndefined('should be undefined');
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

                expect(component.isCollapsed).toBe(false);

                component.toggleNav();

                expect(component.isCollapsed).toBe(true);
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
                expect(urlEl1.href).toBe('', 'should be empty string');

                expect(urlEl2.href).toBeDefined();
                expect(urlEl2.href).toBe('', 'should be empty string');
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
                expect(component.pageMetaData).toBe(expectedPageMetaData);
            });
        });

        describe('VIEW', () => {
            it('... should render awg project url in navbar-brand', () => {
                const urlDes = getAndExpectDebugElementByCss(compDe, 'a.navbar-brand', 2, 2);
                const urlEl1 = urlDes[0].nativeElement;
                const urlEl2 = urlDes[1].nativeElement;

                expect(urlEl1.href).toBeDefined();
                expect(urlEl1.href).toBe(
                    expectedPageMetaData.awgProjectUrl,
                    `should be ${expectedPageMetaData.awgProjectUrl}`
                );

                expect(urlEl2.href).toBeDefined();
                expect(urlEl2.href).toBe(
                    expectedPageMetaData.awgProjectUrl,
                    `should be ${expectedPageMetaData.awgProjectUrl}`
                );
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 16, 16);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get 16 routerLinks from template', () => {
                expect(routerLinks.length).toBe(16, 'should have 16 routerLinks');
            });

            it('... can get correct routes from routerLinks', () => {
                expect(routerLinks[0].linkParams).toEqual(['/home']);
                expect(routerLinks[1].linkParams).toEqual([
                    expectedEditionWorks[0].baseRoute,
                    expectedEditionWorks[0].introRoute.route
                ]);
                expect(routerLinks[2].linkParams).toEqual([
                    expectedEditionWorks[1].baseRoute,
                    expectedEditionWorks[1].introRoute.route
                ]);
                expect(routerLinks[3].linkParams).toEqual([
                    expectedSelectEditionWork.baseRoute,
                    expectedSelectEditionWork.introRoute.route
                ]);
                expect(routerLinks[4].linkParams).toEqual([
                    expectedSelectEditionWork.baseRoute,
                    expectedSelectEditionWork.detailRoute.route
                ]);
                expect(routerLinks[5].linkParams).toEqual([
                    expectedSelectEditionWork.baseRoute,
                    expectedSelectEditionWork.detailRoute.route
                ]);
                expect(routerLinks[6].linkParams).toEqual([
                    expectedSelectEditionWork.baseRoute,
                    expectedSelectEditionWork.detailRoute.route
                ]);
                expect(routerLinks[7].linkParams).toEqual([
                    expectedSelectEditionWork.baseRoute,
                    expectedSelectEditionWork.detailRoute.route
                ]);
                expect(routerLinks[8].linkParams).toEqual([
                    expectedSelectEditionWork.baseRoute,
                    expectedSelectEditionWork.reportRoute.route
                ]);
                expect(routerLinks[9].linkParams).toEqual([
                    expectedSelectEditionWork.baseRoute,
                    expectedSelectEditionWork.reportRoute.route
                ]);
                expect(routerLinks[10].linkParams).toEqual([
                    expectedSelectEditionWork.baseRoute,
                    expectedSelectEditionWork.reportRoute.route
                ]);
                expect(routerLinks[11].linkParams).toEqual([
                    expectedSelectEditionWork.baseRoute,
                    expectedSelectEditionWork.reportRoute.route
                ]);
                expect(routerLinks[12].linkParams).toEqual([
                    expectedSelectEditionWork.baseRoute,
                    expectedSelectEditionWork.reportRoute.route
                ]);
                expect(routerLinks[13].linkParams).toEqual(['/structure']);
                expect(routerLinks[14].linkParams).toEqual(['/data/search', 'fulltext']);
                expect(routerLinks[15].linkParams).toEqual(['/contact']);
            });

            it('... can get correct queryParams from routerLinks', () => {
                expect(routerLinks[4].queryParams).toEqual({ sketch: 'Aa:SkI/2' });
                expect(routerLinks[5].queryParams).toEqual({ sketch: 'Aa:SkI/3' });
                expect(routerLinks[6].queryParams).toEqual({ sketch: 'Aa:SkI/4' });
                expect(routerLinks[7].queryParams).toEqual({ sketch: 'Aa:SkI/5' });
            });

            it('... can click Home link in template', () => {
                const homeLinkDe = linkDes[0]; // Contact link DebugElement
                const homeLink = routerLinks[0]; // Contact link directive

                expect(homeLink.navigatedTo).toBeNull('should not have navigated yet');

                click(homeLinkDe);
                fixture.detectChanges();

                expect(homeLink.navigatedTo).toEqual(['/home']);
            });

            it('... can click Edition link in template', () => {
                const editionLinkDe = linkDes[1]; // Contact link DebugElement
                const editionLink = routerLinks[1]; // Contact link directive

                expect(editionLink.navigatedTo).toBeNull('should not have navigated yet');

                click(editionLinkDe);
                fixture.detectChanges();

                expect(editionLink.navigatedTo).toEqual([
                    expectedSelectEditionWork.baseRoute,
                    expectedSelectEditionWork.introRoute.route
                ]);
            });

            it('... can click Structure link in template', () => {
                const structureLinkDe = linkDes[13]; // Contact link DebugElement
                const structureLink = routerLinks[13]; // Contact link directive

                expect(structureLink.navigatedTo).toBeNull('should not have navigated yet');

                click(structureLinkDe);
                fixture.detectChanges();

                expect(structureLink.navigatedTo).toEqual(['/structure']);
            });

            it('... can click Data link in template', () => {
                const dataLinkDe = linkDes[14]; // Contact link DebugElement
                const dataLink = routerLinks[14]; // Contact link directive

                expect(dataLink.navigatedTo).toBeNull('should not have navigated yet');

                click(dataLinkDe);
                fixture.detectChanges();

                expect(dataLink.navigatedTo).toEqual(['/data/search', 'fulltext']);
            });

            it('... can click Contact link in template', () => {
                const contactLinkDe = linkDes[15]; // Contact link DebugElement
                const contactLink = routerLinks[15]; // Contact link directive

                expect(contactLink.navigatedTo).toBeNull('should not have navigated yet');

                click(contactLinkDe);
                fixture.detectChanges();

                expect(contactLink.navigatedTo).toEqual(['/contact']);
            });
        });
    });
});
