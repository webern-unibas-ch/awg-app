import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { LOGOSDATA, METADATA } from '@awg-core/core-data';
import { Logo, Logos, MetaPage, MetaSectionTypes } from '@awg-core/core-models';

import { CoreService } from '@awg-core/services';
import { FooterComponent } from './footer.component';

// Mock components
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
    @Input()
    pageMetaData: MetaPage;
}

describe('FooterComponent (DONE)', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    let compDe: DebugElement;

    let mockCoreService: Partial<CoreService>;

    let expectedPageMetaData: MetaPage;
    let expectedLogos: Logos;

    beforeEach(waitForAsync(() => {
        // Stub service for test purposes
        mockCoreService = {
            getMetaDataSection: sectionType => METADATA[sectionType],
            getLogos: () => expectedLogos,
        };

        TestBed.configureTestingModule({
            declarations: [
                FooterComponent,
                FooterCopyrightStubComponent,
                FooterDeclarationStubComponent,
                FooterLogoStubComponent,
                FooterPoweredbyStubComponent,
            ],
            providers: [{ provide: CoreService, useValue: mockCoreService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLogos = LOGOSDATA;
        expectedPageMetaData = METADATA[MetaSectionTypes.page];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expect(mockCoreService === coreService).toBeTrue();
    });

    describe('BEFORE initial data binding', () => {
        describe('#provideMetaData()', () => {
            it('... should have a method `provideMetaData`', () => {
                expect(component.provideMetaData).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });

            it('... should not have pageMetaData', () => {
                expect(component.pageMetaData).toBeUndefined();
            });

            it('... should not have logos', () => {
                expect(component.logos).toBeUndefined();
            });
        });

        describe('VIEW', () => {
            it('... should contain 1 main top footer div and 1 secondary bottom footer div', () => {
                getAndExpectDebugElementByCss(compDe, 'footer div.awg-footer-top', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'footer div.awg-footer-bottom', 1, 1);
            });

            describe('main top footer', () => {
                it('... should contain 3 inner divs', () => {
                    getAndExpectDebugElementByCss(compDe, '.awg-footer-top div', 3, 3);
                });

                it('... should contain 1 footer declaration component (stubbed) in first inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-top div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[0], FooterDeclarationStubComponent, 1, 1);
                });

                it('... should contain 3 footer logo components (stubbed)', () => {
                    const footerTopDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-top', 1, 1);

                    getAndExpectDebugElementByDirective(footerTopDes[0], FooterLogoStubComponent, 3, 3);
                });

                it('... should contain 1 footer logo component in second inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-top div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], FooterLogoStubComponent, 1, 1);
                });

                it('... should contain 2 footer logo component in third inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-top div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[2], FooterLogoStubComponent, 2, 2);
                });
            });

            describe('secondary bottom footer', () => {
                it('... should contain 3 inner divs', () => {
                    getAndExpectDebugElementByCss(compDe, '.awg-footer-bottom div', 3, 3);
                });

                it('... should contain 1 footer copyright component (stubbed) in first inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-bottom div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[0], FooterCopyrightStubComponent, 1, 1);
                });

                it('... should contain 1 footer poweredby component (stubbed) in second inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-bottom div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], FooterPoweredbyStubComponent, 1, 1);
                });

                it('... should contain 1 google tranlate div in third inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-bottom div', 3, 3);
                    const gtransDiv = divDes[2];
                    const gtransEl = gtransDiv.nativeElement;

                    expectToBe(gtransEl.id, 'google_translate_element');
                    expectToContain(gtransEl.classList, 'gtrans');
                });
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Mock the call to the meta service in #provideMetaData
            component.pageMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.page);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData()', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return metadata', () => {
                expectToEqual(component.pageMetaData, expectedPageMetaData);
            });

            it('... should return logos', () => {
                expectToEqual(component.logos, expectedLogos);
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

                    expectToEqual(footerDeclarationCmp.pageMetaData, expectedPageMetaData);
                });

                it('... should pass down logos to footer logo components', () => {
                    const footerLogoDes = getAndExpectDebugElementByDirective(compDe, FooterLogoStubComponent, 3, 3);
                    const footerLogoCmps = footerLogoDes.map(
                        de => de.injector.get(FooterLogoStubComponent) as FooterLogoStubComponent
                    );

                    expectToBe(footerLogoCmps.length, 3);
                    expectToEqual(footerLogoCmps[0].logo, expectedLogos['sagw']);
                    expectToEqual(footerLogoCmps[1].logo, expectedLogos['unibas']);
                    expectToEqual(footerLogoCmps[2].logo, expectedLogos['snf']);
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

                    expectToEqual(footerCopyrightCmp.pageMetaData, expectedPageMetaData);
                });

                it('... should pass down pageMetaData to footer poweredby component', () => {
                    const footerPoweredbyDes = getAndExpectDebugElementByDirective(
                        compDe,
                        FooterPoweredbyStubComponent,
                        1,
                        1
                    );
                    const footerPoweredbyCmp = footerPoweredbyDes[0].injector.get(
                        FooterPoweredbyStubComponent
                    ) as FooterPoweredbyStubComponent;

                    expectToEqual(footerPoweredbyCmp.pageMetaData, expectedPageMetaData);
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

                    expectToEqual(footerPoweredbyCmp.logos, expectedLogos);
                });
            });
        });
    });
});
