/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { FooterComponent } from './footer.component';
import { Logo, Logos, Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

// mock components
@Component({ selector: 'awg-footer-text', template: '' })
class FooterTextStubComponent {
    @Input()
    metaData: Meta;
}

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
            declarations: [FooterComponent, FooterLogoStubComponent, FooterTextStubComponent],
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
                src: 'assets/img/logos/uni.svg',
                alt: 'Logo Uni Basel',
                href: 'http://www.unibas.ch'
            },
            snf: {
                id: 'snflogo',
                src: 'assets/img/logos/snf.jpg',
                alt: 'Logo SNF',
                href: 'http://www.snf.ch'
            },
            angular: {
                id: 'angularlogo',
                src: 'assets/img/logos/angular.svg',
                alt: 'Logo Angular',
                href: 'https://angular.io'
            },
            bootstrap: {
                id: 'bootstraplogo',
                src: 'assets/img/logos/ng-bootstrap.svg',
                alt: 'Logo ng-Bootstrap',
                href: 'https://ng-bootstrap.github.io/'
            }
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

            it('should not have metaData', () => {
                expect(component.metaData).toBeUndefined('should be undefined');
            });

            it('should not have logos', () => {
                expect(component.logos).toBeUndefined('should be undefined');
            });
        });

        describe('VIEW', () => {
            it('... should contain 1 main top footer and 1 secondary bootom footer', () => {
                const footerTopDe = fixture.debugElement.queryAll(By.css('.awg-footer-top'));
                const footerBottomDe = fixture.debugElement.queryAll(By.css('.awg-footer-bottom'));

                expect(footerTopDe).toBeTruthy();
                expect(footerTopDe.length).toBe(1, 'should have 1 top footer');

                expect(footerBottomDe).toBeTruthy();
                expect(footerBottomDe.length).toBe(1, 'should have 1 bottom footer');
            });

            describe('main top footer', () => {
                it('... should contain 1 footer text component (stubbed)', () => {
                    const footerTopDe = fixture.debugElement.query(By.css('.awg-footer-top'));
                    const footerTextDes = footerTopDe.queryAll(By.directive(FooterTextStubComponent));

                    expect(footerTextDes).toBeTruthy();
                    expect(footerTextDes.length).toBe(1, 'should have 1 text component');
                });

                it('... should contain 2 footer logo components (stubbed)', () => {
                    const footerTopDe = fixture.debugElement.query(By.css('.awg-footer-top'));
                    const footerLogoDes = footerTopDe.queryAll(By.directive(FooterLogoStubComponent));

                    expect(footerLogoDes).toBeTruthy();
                    expect(footerLogoDes.length).toBe(2, 'should have 2 footer logos');
                });
            });

            describe('secondary bottom footer', () => {
                it('... should contain 1 awg-copyright-desc', () => {
                    const footerBottomDe = fixture.debugElement.query(By.css('.awg-footer-bottom'));
                    const footerCopyrightDes = footerBottomDe.queryAll(By.css('.awg-copyright-desc'));

                    expect(footerCopyrightDes).toBeTruthy();
                    expect(footerCopyrightDes.length).toBe(1, 'should have 1 awg-copyright-desc');
                });

                it('... should contain 2 footer logo components (stubbed)', () => {
                    const footerBottomDe = fixture.debugElement.query(By.css('.awg-footer-bottom'));
                    const footerLogoDes = footerBottomDe.queryAll(By.directive(FooterLogoStubComponent));

                    expect(footerLogoDes).toBeTruthy();
                    expect(footerLogoDes.length).toBe(2, 'should have 2 footer logos');
                });

                it('... should not render metaData yet', () => {
                    const copyDe = fixture.debugElement.query(By.css('#awg-copyright-period'));
                    const copyEl = copyDe.nativeElement;

                    expect(copyEl.textContent).toBeDefined();
                    expect(copyEl.textContent).toBe('', 'should be empty string');
                });
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
                const expectedYearStart = expectedMetaData.page.yearStart;
                const expectedYearRecent = expectedMetaData.page.yearRecent;

                const copyDe = fixture.debugElement.query(By.css('#awg-copyright-period'));
                const copyEl = copyDe.nativeElement;

                expect(copyEl.textContent).toContain(expectedYearStart + '–' + expectedYearRecent);
            });

            it('should pass down metaData to footer text component', () => {
                const footerTextDe = fixture.debugElement.query(By.directive(FooterTextStubComponent));
                const footerTextCmp = footerTextDe.injector.get(FooterTextStubComponent) as FooterTextStubComponent;

                expect(footerTextCmp.metaData.page).toBeTruthy();
                expect(footerTextCmp.metaData.page).toEqual(expectedMetaData.page, 'should have page metaData');
            });

            it('should pass down logos to footer logo components', () => {
                const footerLogoDes = fixture.debugElement.queryAll(By.directive(FooterLogoStubComponent));
                const footerLogoCmps = [];
                footerLogoDes.forEach(de => {
                    footerLogoCmps.push(de.injector.get(FooterLogoStubComponent) as FooterLogoStubComponent);
                });

                expect(footerLogoCmps.length).toBe(4, 'should have 4 logo components');

                expect(footerLogoCmps[0].logo).toBeTruthy();
                expect(footerLogoCmps[0].logo).toEqual(expectedLogos.unibas, 'should have unibas logo');

                expect(footerLogoCmps[1].logo).toBeTruthy();
                expect(footerLogoCmps[1].logo).toEqual(expectedLogos.snf, 'should have snf logo');

                expect(footerLogoCmps[2].logo).toBeTruthy();
                expect(footerLogoCmps[2].logo).toEqual(expectedLogos.angular, 'should have angular logo');

                expect(footerLogoCmps[3].logo).toBeTruthy();
                expect(footerLogoCmps[3].logo).toEqual(expectedLogos.bootstrap, 'should have bootstrap logo');
            });
        });
    });
});
