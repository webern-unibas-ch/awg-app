import { Component, DebugElement, input, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { faScrewdriverWrench, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { LogoComponent } from '@awg-shared/logos/logo.component';
import { LOGOS_DATA } from '@awg-shared/logos/logos.data';
import { Logo, Logos } from '@awg-shared/logos/logos.model';

import { META_DATA } from '../../data/meta.data';
import { MetaPage, MetaSectionTypes } from '../../models/meta.model';

import { FooterPoweredbyComponent } from './footer-poweredby.component';

// Mock components
@Component({
    selector: 'awg-logo',
    template: '',
})
class LogoStubComponent {
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
                remove: { imports: [LogoComponent] },
                add: { imports: [LogoStubComponent] },
            })
            .compileComponents();
    });

    beforeEach(() => {
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

        // Create component fixture
        fixture = TestBed.createComponent(FooterPoweredbyComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `logosData`', () => {
            expectToBe(isSignal(component.logosData), true);

            expect(() => component.logosData()).toThrow();
        });

        it('... should throw due to missing required input signal `pageMetaData`', () => {
            expectToBe(isSignal(component.pageMetaData), true);

            expect(() => component.pageMetaData()).toThrow();
        });

        it('... should throw when accessing computed signal `poweredByData` due to missing input', () => {
            expectToBe(isSignal(component.poweredByData), true);

            expect(() => component.poweredByData()).toThrow();
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
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('logosData', expectedLogosData);
            fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `logosData` to hold the provided data', () => {
            expectToEqual(component.logosData(), expectedLogosData);
        });

        it('... should have input signal `pageMetaData` to hold the provided data', () => {
            expectToEqual(component.pageMetaData(), expectedPageMetaData);
        });

        it('... should have computed signal `poweredByData` to hold the expected data', () => {
            expectToEqual(component.poweredByData(), expectedPoweredByData);
        });

        describe('... should have computed signal `poweredByData` to hold null if ...', () => {
            it.each([
                { desc: 'pageMetaData is an empty object {}', logos: expectedLogosData, meta: {} as MetaPage },
                { desc: 'pageMetaData is null', logos: expectedLogosData, meta: null as unknown as MetaPage },
                { desc: 'pageMetaData is undefined', logos: expectedLogosData, meta: undefined as unknown as MetaPage },
                { desc: 'logos is an empty object {}', logos: {} as Logos, meta: expectedPageMetaData },
                { desc: 'logos is null', logos: null as unknown as Logos, meta: expectedPageMetaData },
                { desc: 'logos is undefined', logos: undefined as unknown as Logos, meta: expectedPageMetaData },
            ])('... $desc', ({ logos, meta }) => {
                fixture.componentRef.setInput('logosData', logos);
                fixture.componentRef.setInput('pageMetaData', meta);

                expectToBe(component.poweredByData(), null);
            });

            it.each([
                { desc: 'githubLogo is missing from logos', missingKey: 'github' },
                { desc: 'angularLogo is missing from logos', missingKey: 'angular' },
                { desc: 'bootstrapLogo is missing from logos', missingKey: 'bootstrap' },
            ])('... $desc', ({ missingKey }) => {
                const incompleteLogos = structuredClone(expectedLogosData);
                incompleteLogos[missingKey] = undefined;

                fixture.componentRef.setInput('logosData', incompleteLogos);
                fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

                expectToBe(component.poweredByData(), null);
            });

            it('... devUrl is missing from meta', () => {
                const incompletePageMetaData = structuredClone(expectedPageMetaData);
                incompletePageMetaData.awgAppDevUrl = undefined;

                fixture.componentRef.setInput('logosData', expectedLogosData);
                fixture.componentRef.setInput('pageMetaData', incompletePageMetaData);

                expectToBe(component.poweredByData(), null);
            });
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-powered-by', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-powered-by', 1, 1);
            });

            it('... should contain 3 logo components (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, LogoStubComponent, 3, 3);
            });

            it('... should pass down logos to logo link components', () => {
                const logoDes = getAndExpectDebugElementByDirective(compDe, LogoStubComponent, 3, 3);
                const logoCmps = logoDes.map(de => de.injector.get(LogoStubComponent) as LogoStubComponent);

                expectToBe(logoCmps.length, 3);
                expectToEqual(logoCmps[0].logoData(), expectedLogosData['github']);
                expectToEqual(logoCmps[1].logoData(), expectedLogosData['angular']);
                expectToEqual(logoCmps[2].logoData(), expectedLogosData['bootstrap']);
            });

            it('... should contain one anchor #dev-preview-link with faIcon', () => {
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
    });
});
