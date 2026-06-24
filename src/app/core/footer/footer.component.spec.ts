import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { LOGOS_DATA, META_DATA } from '@awg-core/core-data';
import { Logo, Logos, MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { LogoLinkComponent } from '@awg-core/logo-link/logo-link.component';
import { CoreService } from '@awg-core/services';

import { FooterCopyrightComponent } from './footer-copyright/footer-copyright.component';
import { FooterDeclarationComponent } from './footer-declaration/footer-declaration.component';
import { FooterPoweredbyComponent } from './footer-poweredby/footer-poweredby.component';

import { FooterComponent } from './footer.component';

// Mock components
@Component({
    selector: 'awg-footer-copyright',
    template: '',
})
class FooterCopyrightStubComponent {
    pageMetaData = input.required<MetaPage>();
}

@Component({
    selector: 'awg-footer-declaration',
    template: '',
})
class FooterDeclarationStubComponent {
    pageMetaData = input.required<MetaPage>();
}

@Component({
    selector: 'awg-logo-link',
    template: '',
})
class LogoLinkStubComponent {
    logoData = input.required<Logo>();
}

@Component({
    selector: 'awg-footer-poweredby',
    template: '',
})
class FooterPoweredbyStubComponent {
    logosData = input.required<Logos>();
    pageMetaData = input.required<MetaPage>();
}

describe('FooterComponent (DONE)', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    let compDe: DebugElement;

    let mockCoreService: Partial<CoreService>;

    let expectedPageMetaData: MetaPage;
    let expectedLogosData: Logos;

    beforeEach(async () => {
        // Mock service for test purposes
        mockCoreService = {
            getMetaDataSection: sectionType => META_DATA[sectionType],
            getLogos: () => LOGOS_DATA,
        };

        await TestBed.configureTestingModule({
            imports: [FooterComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }],
        })
            .overrideComponent(FooterComponent, {
                remove: {
                    imports: [
                        LogoLinkComponent,
                        FooterDeclarationComponent,
                        FooterCopyrightComponent,
                        FooterPoweredbyComponent,
                    ],
                },
                add: {
                    imports: [
                        LogoLinkStubComponent,
                        FooterDeclarationStubComponent,
                        FooterCopyrightStubComponent,
                        FooterPoweredbyStubComponent,
                    ],
                },
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLogosData = LOGOS_DATA;
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expectToBe(mockCoreService === coreService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `pageMetaData`', () => {
            expectToEqual(component.pageMetaData(), expectedPageMetaData);
        });

        it('... should have `logos`', () => {
            expectToEqual(component.logosData(), expectedLogosData);
        });

        describe('VIEW', () => {
            it('... should contain one main top footer div and 1 secondary bottom footer div', () => {
                getAndExpectDebugElementByCss(compDe, 'footer div.awg-footer-main', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'footer div.awg-footer-secondary', 1, 1);
            });

            describe('main top footer', () => {
                it('... should contain 3 inner divs', () => {
                    getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);
                });

                it('... should contain one footer declaration component (stubbed) in first inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[0], FooterDeclarationStubComponent, 1, 1);
                });

                it('... should throw due to missing required values for footer declaration component', () => {
                    const footerDeclarationDes = getAndExpectDebugElementByDirective(
                        compDe,
                        FooterDeclarationStubComponent,
                        1,
                        1
                    );
                    const footerDeclarationCmp = footerDeclarationDes[0].injector.get(
                        FooterDeclarationStubComponent
                    ) as FooterDeclarationStubComponent;

                    // Expect the required inputs to throw if not provided
                    expect(() => footerDeclarationCmp.pageMetaData()).toThrow();
                });

                it('... should contain no footer logo components (stubbed) in second inner div yet', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], LogoLinkStubComponent, 0, 0);
                });

                it('... should contain no footer logo components in third inner div yet', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[2], LogoLinkStubComponent, 0, 0);
                });
            });

            describe('secondary bottom footer', () => {
                it('... should contain 3 inner divs', () => {
                    getAndExpectDebugElementByCss(compDe, '.awg-footer-secondary div', 3, 3);
                });

                it('... should contain 1 footer copyright component (stubbed) in first inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-secondary div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[0], FooterCopyrightStubComponent, 1, 1);
                });

                it('... should contain 1 footer poweredby component (stubbed) in second inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-secondary div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], FooterPoweredbyStubComponent, 1, 1);
                });

                it('... should contain 1 google translate div in third inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-secondary div', 3, 3);
                    const gtransDiv = divDes[2];
                    const gtransEl: HTMLDivElement = gtransDiv.nativeElement;

                    expectToBe(gtransEl.id, 'google_translate_element');
                    expectToContain(gtransEl.classList, 'gtrans');
                });
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
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

                    expectToEqual(footerDeclarationCmp.pageMetaData(), expectedPageMetaData);
                });

                it('... should contain 3 footer logo components (stubbed)', () => {
                    const footerTopDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main', 1, 1);

                    getAndExpectDebugElementByDirective(footerTopDes[0], LogoLinkStubComponent, 3, 3);
                });

                it('... should contain one footer logo component in second inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], LogoLinkStubComponent, 1, 1);
                });

                it('... should contain two footer logo components in third inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[2], LogoLinkStubComponent, 2, 2);
                });

                it('... should pass down logos to footer logo components', () => {
                    const footerLogoDes = getAndExpectDebugElementByDirective(compDe, LogoLinkStubComponent, 3, 3);
                    const footerLogoCmps = footerLogoDes.map(
                        de => de.injector.get(LogoLinkStubComponent) as LogoLinkStubComponent
                    );

                    expectToBe(footerLogoCmps.length, 3);
                    expectToEqual(footerLogoCmps[0].logoData(), expectedLogosData['unibas']);
                    expectToEqual(footerLogoCmps[1].logoData(), expectedLogosData['sagw']);
                    expectToEqual(footerLogoCmps[2].logoData(), expectedLogosData['snf']);
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

                    expectToEqual(footerCopyrightCmp.pageMetaData(), expectedPageMetaData);
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

                    expectToEqual(footerPoweredbyCmp.pageMetaData(), expectedPageMetaData);
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

                    expectToEqual(footerPoweredbyCmp.logosData(), expectedLogosData);
                });
            });
        });
    });
});
