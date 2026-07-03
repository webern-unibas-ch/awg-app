import { Component, DebugElement, input, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { LOGOS_DATA } from '../data/logos.data';
import { META_DATA } from '../data/meta.data';
import { LogoLinkComponent } from '../logo-link/logo-link.component';
import { Logo, Logos } from '../models/logos.model';
import { MetaPage, MetaSectionTypes } from '../models/meta.model';
import { CoreService } from '../services/core-service/core.service';

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
        // Test data
        expectedLogosData = LOGOS_DATA;
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];

        // Create component fixture
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
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
        it('... should have signal `pageMetaData` to hold provided data (via service)', () => {
            expectToBe(isSignal(component.pageMetaData), true);

            expectToEqual(component.pageMetaData(), expectedPageMetaData);
        });

        it('... should have signal `logosData` to hold provided data (via service)', () => {
            expectToBe(isSignal(component.logosData), true);

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

                it('... should contain no logo link components (stubbed) in second inner div yet', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], LogoLinkStubComponent, 0, 0);
                });

                it('... should contain no logo link components in third inner div yet', () => {
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

                it('... should contain 3 logo link components (stubbed)', () => {
                    const footerTopDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main', 1, 1);

                    getAndExpectDebugElementByDirective(footerTopDes[0], LogoLinkStubComponent, 3, 3);
                });

                it('... should contain one logo link component in second inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], LogoLinkStubComponent, 1, 1);
                });

                it('... should contain two logo link components in third inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[2], LogoLinkStubComponent, 2, 2);
                });

                it('... should pass down logoData to logo link components', () => {
                    const logoLinkDes = getAndExpectDebugElementByDirective(compDe, LogoLinkStubComponent, 3, 3);
                    const logoLinkCmps = logoLinkDes.map(
                        de => de.injector.get(LogoLinkStubComponent) as LogoLinkStubComponent
                    );

                    expectToBe(logoLinkCmps.length, 3);
                    expectToEqual(logoLinkCmps[0].logoData(), expectedLogosData['unibas']);
                    expectToEqual(logoLinkCmps[1].logoData(), expectedLogosData['sagw']);
                    expectToEqual(logoLinkCmps[2].logoData(), expectedLogosData['snf']);
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

                it('... should pass down logosData to footer poweredby component', () => {
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
