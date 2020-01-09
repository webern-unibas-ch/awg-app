/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { click } from '@testing/click-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faFileAlt, faHome, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';

import { Meta, MetaContact, MetaEdition, MetaPage, MetaSectionTypes, MetaStructure } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';
import { CoreService } from '@awg-core/services';

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

    beforeEach(async(() => {
        // stub service for test purposes
        mockCoreService = {
            getMetaDataSection: sectionType => METADATA[sectionType]
        };

        TestBed.configureTestingModule({
            imports: [FontAwesomeModule, NgbCollapseModule, NgbDropdownModule],
            declarations: [NavbarComponent, RouterLinkStubDirective],
            providers: [{ provide: CoreService, useValue: mockCoreService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedIsCollapsed = true;
        expectedPageMetaData = METADATA[MetaSectionTypes.page];

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
        spyOn(component, 'toggleNav').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('stub service and injected coreService should not be the same', () => {
        const coreService = TestBed.get(CoreService);
        expect(mockCoreService === coreService).toBe(false);
    });

    it('changing the stub service has no effect on the injected service', () => {
        const coreService = TestBed.get(CoreService);
        const CHANGEDMETA: Meta = {
            page: new MetaPage(),
            edition: new MetaEdition(),
            structure: new MetaStructure(),
            contact: new MetaContact()
        };
        mockCoreService = { getMetaDataSection: sectionType => CHANGEDMETA[sectionType] };

        expect(coreService.getMetaDataSection(MetaSectionTypes.page)).toBe(expectedPageMetaData);
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
                // find button elements
                const buttonDes = getAndExpectDebugElementByCss(compDe, 'button.navbar-toggler', 1, 1);
                const buttonEl = buttonDes[0].nativeElement;

                // should have not been called yet
                expect(component.toggleNav).not.toHaveBeenCalled();

                // click button
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

            // trigger initial data binding
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
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 14, 14);

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get 14 routerLinks from template', () => {
                expect(routerLinks.length).toBe(14, 'should have 14 routerLinks');
                expect(routerLinks[0].linkParams).toEqual(['/home']);
                expect(routerLinks[1].linkParams).toEqual(['/edition', 'intro']);
                expect(routerLinks[2].linkParams).toEqual(['/edition/detail', 'Aa:SkI/2']);
                expect(routerLinks[3].linkParams).toEqual(['/edition/detail', 'Aa:SkI/3']);
                expect(routerLinks[4].linkParams).toEqual(['/edition/detail', 'Aa:SkI/4']);
                expect(routerLinks[5].linkParams).toEqual(['/edition/detail', 'Aa:SkI/5']);
                expect(routerLinks[6].linkParams).toEqual(['/edition', 'report']);
                expect(routerLinks[7].linkParams).toEqual(['/edition', 'report']);
                expect(routerLinks[8].linkParams).toEqual(['/edition', 'report']);
                expect(routerLinks[9].linkParams).toEqual(['/edition', 'report']);
                expect(routerLinks[10].linkParams).toEqual(['/edition', 'report']);
                expect(routerLinks[11].linkParams).toEqual(['/structure']);
                expect(routerLinks[12].linkParams).toEqual(['/data/search', 'fulltext']);
                expect(routerLinks[13].linkParams).toEqual(['/contact']);
            });

            it('... can click Home link in template', () => {
                const homeLinkDe = linkDes[0]; // contact link DebugElement
                const homeLink = routerLinks[0]; // contact link directive

                expect(homeLink.navigatedTo).toBeNull('should not have navigated yet');

                click(homeLinkDe);
                fixture.detectChanges();

                expect(homeLink.navigatedTo).toEqual(['/home']);
            });

            it('... can click Edition link in template', () => {
                const editionLinkDe = linkDes[1]; // contact link DebugElement
                const editionLink = routerLinks[1]; // contact link directive

                expect(editionLink.navigatedTo).toBeNull('should not have navigated yet');

                click(editionLinkDe);
                fixture.detectChanges();

                expect(editionLink.navigatedTo).toEqual(['/edition', 'intro']);
            });

            it('... can click Structure link in template', () => {
                const structureLinkDe = linkDes[11]; // contact link DebugElement
                const structureLink = routerLinks[11]; // contact link directive

                expect(structureLink.navigatedTo).toBeNull('should not have navigated yet');

                click(structureLinkDe);
                fixture.detectChanges();

                expect(structureLink.navigatedTo).toEqual(['/structure']);
            });

            it('... can click Data link in template', () => {
                const dataLinkDe = linkDes[12]; // contact link DebugElement
                const dataLink = routerLinks[12]; // contact link directive

                expect(dataLink.navigatedTo).toBeNull('should not have navigated yet');

                click(dataLinkDe);
                fixture.detectChanges();

                expect(dataLink.navigatedTo).toEqual(['/data/search', 'fulltext']);
            });

            it('... can click Contact link in template', () => {
                const contactLinkDe = linkDes[13]; // contact link DebugElement
                const contactLink = routerLinks[13]; // contact link directive

                expect(contactLink.navigatedTo).toBeNull('should not have navigated yet');

                click(contactLinkDe);
                fixture.detectChanges();

                expect(contactLink.navigatedTo).toEqual(['/contact']);
            });
        });
    });
});
