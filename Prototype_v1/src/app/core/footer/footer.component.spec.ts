/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { FooterComponent } from './footer.component';
import { Logo, Logos, Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

// mock components
@Component({ selector: 'awg-footer-logo', template: '' })
class FooterLogoStubComponent {
    @Input()
    logo: Logo;
}

describe('FooterComponent (DONE)', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes, routerLinks;

    let mockCoreService: Partial<CoreService>;

    let expectedMetaData: Meta;
    let expectedLogos: Logos;

    beforeEach(async(() => {
        // stub service for test purposes
        mockCoreService = {
            getMetaData: () => expectedMetaData,
            getLogos: () => expectedLogos
        };

        TestBed.configureTestingModule({
            declarations: [FooterComponent, FooterLogoStubComponent, RouterLinkStubDirective],
            providers: [{ provide: CoreService, useValue: mockCoreService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test logos
        expectedLogos = {
            unibas: {
                id: 'unibaslogo',
                src: 'assets/img/uni.svg',
                alt: 'Logo Uni Basel',
                href: 'http://www.unibas.ch'
            },
            snf: { id: 'snflogo', src: 'assets/img/snf.jpg', alt: 'Logo SNF', href: 'http://www.snf.ch' }
        };
        // test meta data
        expectedMetaData = new Meta();
        expectedMetaData.page = {
            yearStart: 2015,
            yearRecent: 2018,
            version: '0.2.0',
            versionReleaseDate: '18. Oktober 2018'
        };

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('stub service and injected coreService should not be the same', () => {
        const coreService = TestBed.get(CoreService);
        expect(mockCoreService === coreService).toBe(false);

        // changing the stub service has no effect on the injected service
        const changedMetaData = new Meta();
        changedMetaData.page = {
            yearStart: 2015,
            yearRecent: 2017,
            version: '1.0.0',
            versionReleaseDate: '8. November 2016'
        };
        mockCoreService.getMetaData = () => changedMetaData;

        expect(coreService.getMetaData()).toBe(expectedMetaData);
    });

    describe('BEFORE initial data binding', () => {
        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });
        });

        it('should not have metaData', () => {
            expect(component.metaData).toBeUndefined('should be undefined');
        });

        it('should not have logos', () => {
            expect(component.logos).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain 2 footer logo components (stubbed)', () => {
                const footerLogoDes = fixture.debugElement.queryAll(By.directive(FooterLogoStubComponent));
                expect(footerLogoDes).toBeTruthy();
                expect(footerLogoDes.length).toBe(2, 'should have 2 footer logos');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the input values supplied by the parent component
            expectedMetaData = new Meta();
            expectedMetaData.page = {
                yearStart: 2015,
                yearRecent: 2017,
                version: '1.0.0',
                versionReleaseDate: '8. November 2016'
            };

            // simulate the parent setting the input properties
            component.metaData = expectedMetaData;

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return metadata', () => {
                expect(component.metaData).toBeDefined();
                expect(component.metaData).toBe(expectedMetaData);
            });

            it('should return logos', () => {
                expect(component.logos).toBeDefined();
                expect(component.logos).toBe(expectedLogos);
            });
        });

        describe('VIEW', () => {
            it('should render values', () => {
                const expectedVersion = expectedMetaData.page.version;
                const expectedVersionDate = expectedMetaData.page.versionReleaseDate;
                const expectedYearStart = expectedMetaData.page.yearStart;
                const expectedYearRecent = expectedMetaData.page.yearRecent;

                // find debug elements
                const versionDe = fixture.debugElement.query(By.css('#version'));
                const versionDateDe = fixture.debugElement.query(By.css('#versionDate'));
                const copyDe = fixture.debugElement.query(By.css('#copyrightPeriod'));

                // find native elements
                const versionEl = versionDe.nativeElement;
                const versionDateEl = versionDateDe.nativeElement;
                const copyEl = copyDe.nativeElement;

                expect(versionEl.textContent).toContain(expectedVersion);
                expect(versionDateEl.textContent).toContain(expectedVersionDate);
                expect(copyEl.textContent).toContain(expectedYearStart + '–' + expectedYearRecent);
            });

            it('should pass down logos to footer logo components', () => {
                const footerLogoDes = fixture.debugElement.queryAll(By.directive(FooterLogoStubComponent));
                const footerLogoCmps = [];
                footerLogoDes.forEach(de => {
                    footerLogoCmps.push(de.injector.get(FooterLogoStubComponent) as FooterLogoStubComponent);
                });

                expect(footerLogoCmps[0].logo).toBeTruthy();
                expect(footerLogoCmps[0].logo).toEqual(expectedLogos.unibas, 'should have unibas logo');

                expect(footerLogoCmps[1].logo).toBeTruthy();
                expect(footerLogoCmps[1].logo).toEqual(expectedLogos.snf, 'should have snf logo');
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLink from template', () => {
                expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
                expect(routerLinks[0].linkParams).toEqual(['/contact']);
            });

            it('... can click Contact link in template', () => {
                const contactLinkDe = linkDes[0]; // contact link DebugElement
                const contactLink = routerLinks[0]; // contact link directive

                expect(contactLink.navigatedTo).toBeNull('should not have navigated yet');

                contactLinkDe.triggerEventHandler('click', null);
                fixture.detectChanges();

                expect(contactLink.navigatedTo).toEqual(['/contact']);
            });
        });
    });
});
