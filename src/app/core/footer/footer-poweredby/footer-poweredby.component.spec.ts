import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { faScrewdriverWrench, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { LOGOS_DATA, META_DATA } from '@awg-core/core-data';
import { Logo, Logos, MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { LogoLinkComponent } from '@awg-core/logo-link/logo-link.component';

import { FooterPoweredbyComponent } from './footer-poweredby.component';

@Component({
    selector: 'awg-logo-link',
    template: '',
})
class LogoLinkStubComponent {
    logoData = input.required<Logo>();
}

describe('FooterPoweredbyComponent (DONE)', () => {
    let component: FooterPoweredbyComponent;
    let fixture: ComponentFixture<FooterPoweredbyComponent>;
    let compDe: DebugElement;

    let expectedLogosData: Logos;
    let expectedPageMetaData: MetaPage;
    let expectedPoweredByData: NonNullable<ReturnType<typeof component.poweredByData>>;
    let expectedScrewdriverWrenchIcon: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FooterPoweredbyComponent],
        })
            .overrideComponent(FooterPoweredbyComponent, {
                remove: { imports: [LogoLinkComponent] },
                add: { imports: [LogoLinkStubComponent] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterPoweredbyComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLogosData = LOGOS_DATA;
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];
        expectedPoweredByData = {
            githubLogo: expectedLogosData['github'],
            angularLogo: expectedLogosData['angular'],
            bootstrapLogo: expectedLogosData['bootstrap'],
            devUrl: expectedPageMetaData.awgAppDevUrl,
        };
        expectedScrewdriverWrenchIcon = faScrewdriverWrench;

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('pageMetaData', {} as MetaPage);
        fixture.componentRef.setInput('logosData', {} as Logos);
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `logosData` input', () => {
            expectToEqual(component.logosData(), {} as Logos);
        });

        it('... should have required `pageMetaData` input', () => {
            expectToEqual(component.pageMetaData(), {} as MetaPage);
        });

        it('... should have `poweredByData` computed to null', () => {
            expectToBe(component.poweredByData(), null);
        });

        it('... should have fontawesome icon', () => {
            expectToEqual(component.faScrewdriverWrench, expectedScrewdriverWrenchIcon);
        });

        describe('VIEW', () => {
            it('... should contain no div.awg-powered-by yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-powered-by', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('logosData', expectedLogosData);
            fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `logosData`', () => {
            expectToEqual(component.logosData(), expectedLogosData);
        });

        it('... should have `pageMetaData`', () => {
            expectToEqual(component.pageMetaData(), expectedPageMetaData);
        });

        it('... should have computed `poweredByData`', () => {
            expectToEqual(component.poweredByData(), expectedPoweredByData);
        });

        describe('VIEW', () => {
            it('... should contain 1 div.awg-powered-by', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-powered-by', 1, 1);
            });

            it('... should contain 3 logo link components (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, LogoLinkStubComponent, 3, 3);
            });

            it('... should pass down logos to logo link components', () => {
                const logoLinkDes = getAndExpectDebugElementByDirective(compDe, LogoLinkStubComponent, 3, 3);
                const logoLinkCmps = logoLinkDes.map(
                    de => de.injector.get(LogoLinkStubComponent) as LogoLinkStubComponent
                );

                expectToBe(logoLinkCmps.length, 3);
                expectToEqual(logoLinkCmps[0].logoData(), expectedLogosData['github']);
                expectToEqual(logoLinkCmps[1].logoData(), expectedLogosData['angular']);
                expectToEqual(logoLinkCmps[2].logoData(), expectedLogosData['bootstrap']);
            });

            it('... should contain 1 anchor #dev-preview-link with faIcon', () => {
                getAndExpectDebugElementByCss(compDe, 'a#dev-preview-link', 1, 1);

                getAndExpectDebugElementByCss(compDe, 'a#dev-preview-link > fa-icon', 1, 1);
            });

            it('... should display screwdriverWrench icon in devPreview link ', () => {
                const faIconDes = getAndExpectDebugElementByCss(compDe, 'a#dev-preview-link > fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;
                const faIconEl = faIconDes[0].nativeElement;

                expectToEqual(faIconIns(), expectedScrewdriverWrenchIcon);
                expectToBe(faIconEl.getAttribute('title'), 'Preview for the develop branch');
            });

            it('... should render link to devPreview', () => {
                const devDes = getAndExpectDebugElementByCss(compDe, 'a#dev-preview-link', 1, 1);
                const devEl: HTMLAnchorElement = devDes[0].nativeElement;

                expect(devEl).toBeDefined();
                expectToBe(devEl.href, expectedPageMetaData.awgAppDevUrl);
            });
        });

        describe('#poweredByData', () => {
            it('... should have a computed signal `poweredByData`', () => {
                expect(component.poweredByData).toBeDefined();
            });

            it('... should return correct poweredByData if logosData and pageMetaData are present', () => {
                fixture.componentRef.setInput('logosData', expectedLogosData);
                fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

                expectToEqual(component.poweredByData(), expectedPoweredByData);
            });

            describe('... should return null if ...', () => {
                it('... pageMetaData is an empty object {}, null or undefined', () => {
                    fixture.componentRef.setInput('logosData', expectedLogosData);
                    fixture.componentRef.setInput('pageMetaData', {} as MetaPage);

                    expectToBe(component.poweredByData(), null);

                    fixture.componentRef.setInput('pageMetaData', null as unknown as MetaPage);
                    expectToBe(component.poweredByData(), null);

                    fixture.componentRef.setInput('pageMetaData', undefined as unknown as MetaPage);
                    expectToBe(component.poweredByData(), null);
                });

                it('... logos is an empty object {}, null or undefined', () => {
                    fixture.componentRef.setInput('logosData', {} as Logos);
                    fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

                    expectToBe(component.poweredByData(), null);

                    fixture.componentRef.setInput('logosData', null as unknown as Logos);
                    expectToBe(component.poweredByData(), null);

                    fixture.componentRef.setInput('logosData', undefined as unknown as Logos);
                    expectToBe(component.poweredByData(), null);
                });

                it('... githubLogo is missing', () => {
                    const incompleteLogos = structuredClone(expectedLogosData);
                    incompleteLogos['github'] = undefined;

                    fixture.componentRef.setInput('logosData', incompleteLogos);
                    fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

                    expectToBe(component.poweredByData(), null);
                });

                it('... angularLogo is missing', () => {
                    const incompleteLogos = structuredClone(expectedLogosData);
                    incompleteLogos['angular'] = undefined;

                    fixture.componentRef.setInput('logosData', incompleteLogos);
                    fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

                    expectToBe(component.poweredByData(), null);
                });

                it('... bootstrapLogo is missing', () => {
                    const incompleteLogos = structuredClone(expectedLogosData);
                    incompleteLogos['bootstrap'] = undefined;

                    fixture.componentRef.setInput('logosData', incompleteLogos);
                    fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

                    expectToBe(component.poweredByData(), null);
                });

                it('... devUrl is missing', () => {
                    const incompletePageMetaData = structuredClone(expectedPageMetaData);
                    incompletePageMetaData.awgAppDevUrl = undefined;

                    fixture.componentRef.setInput('logosData', expectedLogosData);
                    fixture.componentRef.setInput('pageMetaData', incompletePageMetaData);

                    expectToBe(component.poweredByData(), null);
                });
            });
        });
    });
});
