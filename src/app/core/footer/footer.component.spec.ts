import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    FooterCopyrightStubComponent,
    FooterDeclarationStubComponent,
    FooterPoweredbyStubComponent,
    LogoStubComponent,
} from '@testing/component-stubs';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { LogoComponent } from '@awg-shared/logos/logo.component';
import { LOGOS_DATA } from '@awg-shared/logos/logos.data';
import { Logos } from '@awg-shared/logos/logos.model';
import { META_DATA } from '@awg-shared/meta/meta.data';
import { MetaPage, MetaSectionTypes } from '@awg-shared/meta/meta.model';

import { FooterCopyrightComponent } from './footer-copyright/footer-copyright.component';
import { FooterDeclarationComponent } from './footer-declaration/footer-declaration.component';
import { FooterPoweredbyComponent } from './footer-poweredby/footer-poweredby.component';

import { FooterComponent } from './footer.component';

describe('FooterComponent (DONE)', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    let compDe: DebugElement;

    let expectedPageMetaData: MetaPage;
    let expectedLogosData: Logos;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FooterComponent],
        })
            .overrideComponent(FooterComponent, {
                remove: {
                    imports: [
                        LogoComponent,
                        FooterDeclarationComponent,
                        FooterCopyrightComponent,
                        FooterPoweredbyComponent,
                    ],
                },
                add: {
                    imports: [
                        LogoStubComponent,
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

    describe('BEFORE initial data binding', () => {
        it('... should have `pageMetaData`', () => {
            expectToEqual(component.pageMetaData, expectedPageMetaData);
        });

        it('... should have `logosData`', () => {
            expectToEqual(component.logosData, expectedLogosData);
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

                it('... should contain no logo components (stubbed) in second inner div yet', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], LogoStubComponent, 0, 0);
                });

                it('... should contain no logo components in third inner div yet', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[2], LogoStubComponent, 0, 0);
                });
            });

            describe('secondary bottom footer', () => {
                it('... should contain 3 inner divs', () => {
                    getAndExpectDebugElementByCss(compDe, '.awg-footer-secondary div', 3, 3);
                });

                it('... should contain one footer copyright component (stubbed) in first inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-secondary div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[0], FooterCopyrightStubComponent, 1, 1);
                });

                it('... should contain one footer poweredby component (stubbed) in second inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-secondary div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], FooterPoweredbyStubComponent, 1, 1);
                });

                it('... should contain one google translate div in third inner div', () => {
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

                it('... should contain 3 logo components (stubbed)', () => {
                    const footerTopDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main', 1, 1);

                    getAndExpectDebugElementByDirective(footerTopDes[0], LogoStubComponent, 3, 3);
                });

                it('... should contain one logo component in second inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], LogoStubComponent, 1, 1);
                });

                it('... should contain two logo components in third inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[2], LogoStubComponent, 2, 2);
                });

                it('... should pass down logoData to logo components', () => {
                    const logoDes = getAndExpectDebugElementByDirective(compDe, LogoStubComponent, 3, 3);
                    const logoCmps = logoDes.map(de => de.injector.get(LogoStubComponent) as LogoStubComponent);

                    expectToBe(logoCmps.length, 3);
                    expectToEqual(logoCmps[0].logoData(), expectedLogosData['unibas']);
                    expectToEqual(logoCmps[1].logoData(), expectedLogosData['sagw']);
                    expectToEqual(logoCmps[2].logoData(), expectedLogosData['snf']);
                });

                it('... should have default linkClass on logo components', () => {
                    const logoDes = getAndExpectDebugElementByDirective(compDe, LogoStubComponent, 3, 3);

                    logoDes.forEach(logoDe => {
                        const logoCmp = logoDe.injector.get(LogoStubComponent) as LogoStubComponent;

                        expectToBe(logoCmp.linkClass(), 'awg-logo-link');
                    });
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
