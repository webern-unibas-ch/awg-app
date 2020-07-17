/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { Logo, Logos, Meta, MetaContact, MetaPage, MetaSectionTypes, MetaStructure } from '@awg-core/core-models';
import { LOGOSDATA, METADATA } from '@awg-core/mock-data';

import { CoreService } from '@awg-core/services';
import { FooterComponent } from './footer.component';

// mock components
@Component({ selector: 'awg-footer-copyright', template: '' })
class FooterCopyrightStubComponent {
    @Input()
    pageMetaData: MetaPage;
}

@Component({ selector: 'awg-footer-declaration', template: '' })
class FooterDeclarationStubComponent {
    @Input()
    pageMetaData: MetaPage;
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

    let expectedPageMetaData: MetaPage;
    let expectedLogos: Logos;

    beforeEach(async(() => {
        // stub service for test purposes
        mockCoreService = {
            getMetaDataSection: sectionType => METADATA[sectionType],
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

        // test data
        expectedLogos = LOGOSDATA;
        expectedPageMetaData = METADATA[MetaSectionTypes.page];

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('stub service and injected coreService should not be the same', () => {
        const coreService = TestBed.inject(CoreService);
        expect(mockCoreService === coreService).toBe(false);
    });

    it('changing the stub service has no effect on the injected service', () => {
        const coreService = TestBed.inject(CoreService);
        const CHANGEDMETA: Meta = {
            page: new MetaPage(),
            structure: new MetaStructure(),
            contact: new MetaContact()
        };
        mockCoreService = {
            getMetaDataSection: sectionType => CHANGEDMETA[sectionType],
            getLogos: () => expectedLogos
        };

        expect(coreService.getMetaDataSection(MetaSectionTypes.page)).toBe(expectedPageMetaData);
    });

    describe('BEFORE initial data binding', () => {
        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });

            it('... should not have pageMetaData', () => {
                expect(component.pageMetaData).toBeUndefined('should be undefined');
            });

            it('... should not have logos', () => {
                expect(component.logos).toBeUndefined('should be undefined');
            });
        });

        describe('VIEW', () => {
            it('... should contain 1 main top footer and 1 secondary bottom footer', () => {
                getAndExpectDebugElementByCss(compDe, 'footer div.awg-footer-top', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'footer div.awg-footer-bottom', 1, 1);
            });

            describe('main top footer', () => {
                it('... should contain 1 footer declaration component (stubbed)', () => {
                    const footerTopDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-top', 1, 1);

                    getAndExpectDebugElementByDirective(footerTopDes[0], FooterDeclarationStubComponent, 1, 1);
                });

                it('... should contain 3 footer logo components (stubbed)', () => {
                    const footerTopDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-top', 1, 1);

                    getAndExpectDebugElementByDirective(footerTopDes[0], FooterLogoStubComponent, 3, 3);
                });
            });

            describe('secondary bottom footer', () => {
                it('... should contain 1 footer copyright component (stubbed)', () => {
                    const footerBottomDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-bottom', 1, 1);

                    getAndExpectDebugElementByDirective(footerBottomDes[0], FooterCopyrightStubComponent, 1, 1);
                });

                it('... should contain 1 footer poweredby component (stubbed)', () => {
                    const footerBottomDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-bottom', 1, 1);

                    getAndExpectDebugElementByDirective(footerBottomDes[0], FooterPoweredbyStubComponent, 1, 1);
                });
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the call to the meta service in #provideMetaData
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

            it('... should return logos', () => {
                expect(component.logos).toBeDefined();
                expect(component.logos).toBe(expectedLogos);
            });
        });

        describe('VIEW', () => {
            describe('main top footer', () => {
                it('... should pass down pageMetaData to footer declaration component', () => {
                    const footerDeclarationDes = getAndExpectDebugElementByDirective(
                        compDe,
                        FooterDeclarationStubComponent,
                        1,
                        1
                    );
                    const footerDeclarationCmp = footerDeclarationDes[0].injector.get(
                        FooterDeclarationStubComponent
                    ) as FooterDeclarationStubComponent;

                    expect(footerDeclarationCmp.pageMetaData).toBeTruthy();
                    expect(footerDeclarationCmp.pageMetaData).toEqual(expectedPageMetaData, 'should have pageMetaData');
                });

                it('... should pass down logos to footer logo components', () => {
                    const footerLogoDes = getAndExpectDebugElementByDirective(compDe, FooterLogoStubComponent, 3, 3);
                    const footerLogoCmps = footerLogoDes.map(
                        de => de.injector.get(FooterLogoStubComponent) as FooterLogoStubComponent
                    );

                    expect(footerLogoCmps.length).toBe(3, 'should have 3 logo components');

                    expect(footerLogoCmps[0].logo).toBeTruthy();
                    expect(footerLogoCmps[0].logo).toEqual(expectedLogos.sagw, 'should have sagw logo');

                    expect(footerLogoCmps[1].logo).toBeTruthy();
                    expect(footerLogoCmps[1].logo).toEqual(expectedLogos.unibas, 'should have unibas logo');

                    expect(footerLogoCmps[2].logo).toBeTruthy();
                    expect(footerLogoCmps[2].logo).toEqual(expectedLogos.snf, 'should have snf logo');
                });
            });

            describe('secondary bottom footer', () => {
                it('... should pass down pageMetaData to footer copyright component', () => {
                    const footerCopyrightDes = getAndExpectDebugElementByDirective(
                        compDe,
                        FooterCopyrightStubComponent,
                        1,
                        1
                    );
                    const footerCopyrightCmp = footerCopyrightDes[0].injector.get(
                        FooterCopyrightStubComponent
                    ) as FooterCopyrightStubComponent;

                    expect(footerCopyrightCmp.pageMetaData).toBeTruthy();
                    expect(footerCopyrightCmp.pageMetaData).toEqual(expectedPageMetaData, 'should have pageMetaData');
                });

                it('... should pass down logos to footer poweredby component', () => {
                    const footerPoweredbyDes = getAndExpectDebugElementByDirective(
                        compDe,
                        FooterPoweredbyStubComponent,
                        1,
                        1
                    );
                    const footerPoweredbyCmp = footerPoweredbyDes[0].injector.get(
                        FooterPoweredbyStubComponent
                    ) as FooterPoweredbyStubComponent;

                    expect(footerPoweredbyCmp.logos).toBeTruthy();
                    expect(footerPoweredbyCmp.logos).toEqual(expectedLogos, 'should have logos');
                });
            });
        });
    });
});
