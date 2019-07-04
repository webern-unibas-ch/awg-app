/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { click } from '@testing/click-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faFileAlt, faHome, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';

import { MetaPage, MetaSectionKey } from '@awg-core/core-models';
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
            getMetaDataSection: () => expectedPageMetaData
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
        expectedPageMetaData = METADATA[MetaSectionKey.page];

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
        spyOn(component, 'toggleNav').and.callThrough();
    });

    it('stub service and injected coreService should not be the same', () => {
        const coreService = TestBed.get(CoreService);
        expect(mockCoreService === coreService).toBe(false);

        // changing the stub service has no effect on the injected service
        let changedPageMetaData = new MetaPage();
        changedPageMetaData = {
            yearStart: 2015,
            yearCurrent: 2017,
            awgAppUrl: '',
            compodocUrl: '',
            githubUrl: '',
            awgProjectName: '',
            awgProjectUrl: '',
            version: '1.0.0',
            versionReleaseDate: '8. November 2016'
        };
        mockCoreService.getMetaDataSection = () => changedPageMetaData;

        expect(coreService.getMetaDataSection()).toBe(expectedPageMetaData);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
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

            it('... should not render awg project url yet', () => {
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
            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render contact url', () => {
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

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return metadata', () => {
                expect(component.pageMetaData).toBeDefined();
                expect(component.pageMetaData).toBe(expectedPageMetaData);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 14, 14);

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLink from template', () => {
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
