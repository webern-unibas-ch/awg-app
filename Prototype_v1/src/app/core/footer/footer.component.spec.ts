/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { FooterComponent } from './footer.component';
import { Logo, Logos, Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

// mock components
@Component({ selector: 'awg-footer-copyright', template: '' })
class FooterCopyrightStubComponent {
    @Input()
    metaData: Meta;
}

@Component({ selector: 'awg-footer-declaration', template: '' })
class FooterDeclarationStubComponent {
    @Input()
    metaData: Meta;
}

@Component({ selector: 'awg-footer-logo', template: '' })
class FooterLogoStubComponent {
    @Input()
    logo: Logo;
}

@Component({ selector: 'awg-footer-poweredby', template: '' })
class FooterPoweredbyStubComponent {
    @Input()
    logos: Logos;
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
            declarations: [
                FooterComponent,
                FooterCopyrightStubComponent,
                FooterDeclarationStubComponent,
                FooterLogoStubComponent,
                FooterPoweredbyStubComponent
            ],
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
                src: 'assets/img/logos/snf.png',
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

            it('... should not have metaData', () => {
                expect(component.metaData).toBeUndefined('should be undefined');
            });

            it('... should not have logos', () => {
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
                    const footerTextDes = footerTopDe.queryAll(By.directive(FooterDeclarationStubComponent));

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
                it('... should contain 1 footer copyright component (stubbed)', () => {
                    const footerBottomDe = fixture.debugElement.query(By.css('.awg-footer-bottom'));
                    const footerCopyrightDes = footerBottomDe.queryAll(By.directive(FooterCopyrightStubComponent));

                    expect(footerCopyrightDes).toBeTruthy();
                    expect(footerCopyrightDes.length).toBe(1, 'should have 1 copyright component');
                });

                it('... should contain 1 footer poweredby component (stubbed)', () => {
                    const footerBottomDe = fixture.debugElement.query(By.css('.awg-footer-bottom'));
                    const footerPoweredbyDes = footerBottomDe.queryAll(By.directive(FooterPoweredbyStubComponent));

                    expect(footerPoweredbyDes).toBeTruthy();
                    expect(footerPoweredbyDes.length).toBe(1, 'should have 1 poweredby component');
                });
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
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

            it('... should return logos', () => {
                expect(component.logos).toBeDefined();
                expect(component.logos).toBe(expectedLogos);
            });
        });

        describe('VIEW', () => {
            describe('main top footer', () => {
                it('... should pass down metaData to footer declaration component', () => {
                    const footerDeclarationDe = fixture.debugElement.query(
                        By.directive(FooterDeclarationStubComponent)
                    );
                    const footerDeclarationCmp = footerDeclarationDe.injector.get(
                        FooterDeclarationStubComponent
                    ) as FooterDeclarationStubComponent;

                    expect(footerDeclarationCmp.metaData).toBeTruthy();
                    expect(footerDeclarationCmp.metaData).toEqual(expectedMetaData, 'should have metaData');
                });

                it('... should pass down logos to footer logo components', () => {
                    const footerLogoDes = fixture.debugElement.queryAll(By.directive(FooterLogoStubComponent));
                    const footerLogoCmps = [];
                    footerLogoDes.forEach(de => {
                        footerLogoCmps.push(de.injector.get(FooterLogoStubComponent) as FooterLogoStubComponent);
                    });

                    expect(footerLogoCmps.length).toBe(2, 'should have 2 logo components');

                    expect(footerLogoCmps[0].logo).toBeTruthy();
                    expect(footerLogoCmps[0].logo).toEqual(expectedLogos.unibas, 'should have unibas logo');

                    expect(footerLogoCmps[1].logo).toBeTruthy();
                    expect(footerLogoCmps[1].logo).toEqual(expectedLogos.snf, 'should have snf logo');
                });
            });

            describe('secondary bottom footer', () => {
                it('... should pass down metaData to footer copyright component', () => {
                    const footerCopyrightDe = fixture.debugElement.query(By.directive(FooterCopyrightStubComponent));
                    const footerCopyrightCmp = footerCopyrightDe.injector.get(
                        FooterCopyrightStubComponent
                    ) as FooterCopyrightStubComponent;

                    expect(footerCopyrightCmp.metaData).toBeTruthy();
                    expect(footerCopyrightCmp.metaData).toEqual(expectedMetaData, 'should have metaData');
                });

                it('... should pass down logos to footer poweredby component', () => {
                    const footerPoweredbyDes = fixture.debugElement.queryAll(
                        By.directive(FooterPoweredbyStubComponent)
                    );
                    const footerPoweredbyCmps = [];
                    footerPoweredbyDes.forEach(de => {
                        footerPoweredbyCmps.push(de.injector.get(
                            FooterPoweredbyStubComponent
                        ) as FooterPoweredbyStubComponent);
                    });

                    expect(footerPoweredbyCmps.length).toBe(1, 'should have 1 poweredby component');

                    expect(footerPoweredbyCmps[0].logos).toBeTruthy();
                    expect(footerPoweredbyCmps[0].logos).toEqual(expectedLogos, 'should have logos');
                });
            });
        });
    });
});
