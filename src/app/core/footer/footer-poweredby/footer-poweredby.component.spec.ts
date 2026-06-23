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

import { FooterLogoComponent } from '../footer-logo/footer-logo.component';
import { FooterPoweredbyComponent } from './footer-poweredby.component';

@Component({
    selector: 'awg-footer-logo',
    template: '',
})
class FooterLogoStubComponent {
    logo = input.required<Logo>();
}

describe('FooterPoweredbyComponent (DONE)', () => {
    let component: FooterPoweredbyComponent;
    let fixture: ComponentFixture<FooterPoweredbyComponent>;
    let compDe: DebugElement;

    let expectedLogos: Logos;
    let expectedPageMetaData: MetaPage;
    let expectedScrewdriverWrenchIcon: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FooterPoweredbyComponent],
        })
            .overrideComponent(FooterPoweredbyComponent, {
                remove: { imports: [FooterLogoComponent] },
                add: { imports: [FooterLogoStubComponent] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterPoweredbyComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLogos = LOGOS_DATA;
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];
        expectedScrewdriverWrenchIcon = faScrewdriverWrench;

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('pageMetaData', {} as MetaPage);
        fixture.componentRef.setInput('logos', {} as Logos);
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `logos` input', () => {
            expectToEqual(component.logos(), {} as Logos);
        });

        it('... should have required `pageMetaData` input', () => {
            expectToEqual(component.pageMetaData(), {} as MetaPage);
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
            fixture.componentRef.setInput('logos', expectedLogos);
            fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have logos', () => {
            expectToEqual(component.logos(), expectedLogos);
        });

        it('... should have pageMetaData', () => {
            expectToEqual(component.pageMetaData(), expectedPageMetaData);
        });

        describe('VIEW', () => {
            it('... should contain 1 div.awg-powered-by', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-powered-by', 1, 1);
            });

            it('... should contain 3 footer logo components (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, FooterLogoStubComponent, 3, 3);
            });

            it('... should pass down logos to footer logo components', () => {
                const footerLogoDes = getAndExpectDebugElementByDirective(compDe, FooterLogoStubComponent, 3, 3);
                const footerLogoCmps = footerLogoDes.map(
                    de => de.injector.get(FooterLogoStubComponent) as FooterLogoStubComponent
                );

                expectToBe(footerLogoCmps.length, 3);
                expectToEqual(footerLogoCmps[0].logo(), expectedLogos['github']);
                expectToEqual(footerLogoCmps[1].logo(), expectedLogos['angular']);
                expectToEqual(footerLogoCmps[2].logo(), expectedLogos['bootstrap']);
            });

            it('... should contain 1 anchor #dev-preview-link with faIcon', () => {
                getAndExpectDebugElementByCss(compDe, 'a#dev-preview-link', 1, 1);

                getAndExpectDebugElementByCss(compDe, 'a#dev-preview-link > fa-icon', 1, 1);
            });

            it('... should display screwdriverWrench icon in devPreview link ', () => {
                const faIconDes = getAndExpectDebugElementByCss(compDe, 'a#dev-preview-link > fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expectToEqual(faIconIns(), expectedScrewdriverWrenchIcon);
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
