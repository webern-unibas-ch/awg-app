import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
            .overrideComponent(LogoComponent, { set: { template: '', imports: [] } })
            .overrideComponent(FooterDeclarationComponent, { set: { template: '', imports: [] } })
            .overrideComponent(FooterCopyrightComponent, { set: { template: '', imports: [] } })
            .overrideComponent(FooterPoweredbyComponent, { set: { template: '', imports: [] } })
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

                it('... should contain one FooterDeclarationComponent (hollow) in first inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[0], FooterDeclarationComponent, 1, 1);
                });

                it('... should throw due to missing required values for FooterDeclarationComponent (hollow)', () => {
                    const footerDeclarationDes = getAndExpectDebugElementByDirective(
                        compDe,
                        FooterDeclarationComponent,
                        1,
                        1
                    );
                    const footerDeclarationCmp = footerDeclarationDes[0].injector.get(FooterDeclarationComponent);

                    // Expect the required inputs to throw if not provided
                    expect(() => footerDeclarationCmp.pageMetaData()).toThrow();
                });

                it('... should contain one LogoComponent (hollow) in second inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], LogoComponent, 1, 1);
                });

                it('... should contain two LogoComponents (hollow) in third inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[2], LogoComponent, 2, 2);
                });

                it('... should throw due to missing required values for LogoComponents (hollow)', () => {
                    const logoDes = getAndExpectDebugElementByDirective(compDe, LogoComponent, 3, 3);
                    const logoCmps = logoDes.map(de => de.injector.get(LogoComponent));

                    // Expect the required inputs to throw if not provided
                    logoCmps.forEach(logoCmp => {
                        expect(() => logoCmp.logoData()).toThrow();
                    });
                });
            });

            describe('secondary bottom footer', () => {
                it('... should contain 3 inner divs', () => {
                    getAndExpectDebugElementByCss(compDe, '.awg-footer-secondary div', 3, 3);
                });

                it('... should contain one FooterCopyrightComponent (hollow) in first inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-secondary div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[0], FooterCopyrightComponent, 1, 1);
                });

                it('... should contain one FooterPoweredbyComponent (hollow) in second inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-secondary div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], FooterPoweredbyComponent, 1, 1);
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
                it('... should pass down pageMetaData to FooterDeclarationComponent (hollow)', () => {
                    const footerDeclarationDes = getAndExpectDebugElementByDirective(
                        compDe,
                        FooterDeclarationComponent,
                        1,
                        1
                    );
                    const footerDeclarationCmp = footerDeclarationDes[0].injector.get(FooterDeclarationComponent);

                    expectToEqual(footerDeclarationCmp.pageMetaData(), expectedPageMetaData);
                });

                it('... should contain 3 LogoComponents (hollow)', () => {
                    const footerTopDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main', 1, 1);

                    getAndExpectDebugElementByDirective(footerTopDes[0], LogoComponent, 3, 3);
                });

                it('... should contain one LogoComponent (hollow) in second inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[1], LogoComponent, 1, 1);
                });

                it('... should contain two LogoComponents (hollow) in third inner div', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, '.awg-footer-main div', 3, 3);

                    getAndExpectDebugElementByDirective(divDes[2], LogoComponent, 2, 2);
                });

                it('... should pass down logoData to LogoComponents (hollow)', () => {
                    const logoDes = getAndExpectDebugElementByDirective(compDe, LogoComponent, 3, 3);
                    const logoCmps = logoDes.map(de => de.injector.get(LogoComponent));

                    expectToBe(logoCmps.length, 3);
                    expectToEqual(logoCmps[0].logoData(), expectedLogosData['unibas']);
                    expectToEqual(logoCmps[1].logoData(), expectedLogosData['sagw']);
                    expectToEqual(logoCmps[2].logoData(), expectedLogosData['snf']);
                });

                it('... should have default linkClass on LogoComponents (hollow)', () => {
                    const logoDes = getAndExpectDebugElementByDirective(compDe, LogoComponent, 3, 3);

                    logoDes.forEach(logoDe => {
                        const logoCmp = logoDe.injector.get(LogoComponent);

                        expectToBe(logoCmp.linkClass(), 'awg-logo-link');
                    });
                });
            });

            describe('secondary bottom footer', () => {
                it('... should pass down pageMetaData to FooterCopyrightComponent (hollow)', () => {
                    const footerCopyrightDes = getAndExpectDebugElementByDirective(
                        compDe,
                        FooterCopyrightComponent,
                        1,
                        1
                    );
                    const footerCopyrightCmp = footerCopyrightDes[0].injector.get(FooterCopyrightComponent);

                    expectToEqual(footerCopyrightCmp.pageMetaData(), expectedPageMetaData);
                });

                it('... should pass down pageMetaData to FooterPoweredbyComponent (hollow)', () => {
                    const footerPoweredbyDes = getAndExpectDebugElementByDirective(
                        compDe,
                        FooterPoweredbyComponent,
                        1,
                        1
                    );
                    const footerPoweredbyCmp = footerPoweredbyDes[0].injector.get(FooterPoweredbyComponent);

                    expectToEqual(footerPoweredbyCmp.pageMetaData(), expectedPageMetaData);
                });

                it('... should pass down logosData to FooterPoweredbyComponent (hollow)', () => {
                    const footerPoweredbyDes = getAndExpectDebugElementByDirective(
                        compDe,
                        FooterPoweredbyComponent,
                        1,
                        1
                    );
                    const footerPoweredbyCmp = footerPoweredbyDes[0].injector.get(FooterPoweredbyComponent);

                    expectToEqual(footerPoweredbyCmp.logosData(), expectedLogosData);
                });
            });
        });
    });
});
