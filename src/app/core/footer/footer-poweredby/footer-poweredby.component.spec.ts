import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IconDefinition } from '@fortawesome/angular-fontawesome';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { LOGOS_DATA, META_DATA } from '@awg-core/core-data';
import { Logo, Logos, MetaPage, MetaSectionTypes } from '@awg-core/core-models';

import { FooterPoweredbyComponent } from './footer-poweredby.component';

@Component({ selector: 'awg-footer-logo', template: '' })
class FooterLogoStubComponent {
    @Input()
    logo: Logo;
}

describe('FooterPoweredbyComponent (DONE)', () => {
    let component: FooterPoweredbyComponent;
    let fixture: ComponentFixture<FooterPoweredbyComponent>;
    let compDe: DebugElement;

    let expectedLogos: Logos;
    let expectedPageMetaData: MetaPage;
    let expectedScrewdriverWrenchIcon: IconDefinition;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [FooterPoweredbyComponent, FooterLogoStubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterPoweredbyComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLogos = LOGOS_DATA;
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];
        expectedScrewdriverWrenchIcon = faScrewdriverWrench;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have logos', () => {
            expect(component.logos).toBeUndefined();
        });

        it('... should not have pageMetaData', () => {
            expect(component.pageMetaData).toBeUndefined();
        });

        it('... should have fontawesome icon', () => {
            expectToEqual(component.faScrewdriverWrench, expectedScrewdriverWrenchIcon);
        });

        describe('VIEW', () => {
            it('... should contain 1 div.awg-powered-by', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-powered-by', 1, 1);
            });

            it('... should contain 3 footer logo components (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, FooterLogoStubComponent, 3, 3);
            });

            it('... should contain 1 anchor #dev-preview-link with faIcon', () => {
                getAndExpectDebugElementByCss(compDe, 'a#dev-preview-link', 1, 1);

                getAndExpectDebugElementByCss(compDe, 'a#dev-preview-link > fa-icon', 1, 1);
            });

            it('... should not render link to devPreview yet', () => {
                const devDes = getAndExpectDebugElementByCss(compDe, 'a#dev-preview-link', 1, 1);
                const devEl: HTMLAnchorElement = devDes[0].nativeElement;

                expect(devEl).toBeDefined();
                expectToBe(devEl.href, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.logos = expectedLogos;
            component.pageMetaData = expectedPageMetaData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have logos', () => {
            expectToEqual(component.logos, expectedLogos);
        });

        it('... should have pageMetaData', () => {
            expectToEqual(component.pageMetaData, expectedPageMetaData);
        });

        describe('VIEW', () => {
            it('... should pass down logos to footer logo components', () => {
                const footerLogoDes = getAndExpectDebugElementByDirective(compDe, FooterLogoStubComponent, 3, 3);
                const footerLogoCmps = footerLogoDes.map(
                    de => de.injector.get(FooterLogoStubComponent) as FooterLogoStubComponent
                );

                expectToBe(footerLogoCmps.length, 3);
                expectToEqual(footerLogoCmps[0].logo, expectedLogos['github']);
                expectToEqual(footerLogoCmps[1].logo, expectedLogos['angular']);
                expectToEqual(footerLogoCmps[2].logo, expectedLogos['bootstrap']);
            });

            it('... should display screwdriverWrench icon in devPreview link ', () => {
                const faIconDe = getAndExpectDebugElementByCss(compDe, 'a#dev-preview-link > fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expectToEqual(faIconIns, expectedScrewdriverWrenchIcon);
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
