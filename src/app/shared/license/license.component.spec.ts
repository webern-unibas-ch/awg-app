import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { LicenseComponent } from './license.component';

describe('LicenseComponent', () => {
    let component: LicenseComponent;
    let fixture: ComponentFixture<LicenseComponent>;
    let compDe: DebugElement;

    let expectedLicenseLink: string;
    let expectedLicenseText: string;
    let expectedLicenseIcons: Array<{
        src: string;
        alt: string;
    }>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LicenseComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedLicenseLink = 'https://creativecommons.org/licenses/by-sa/4.0/';
        expectedLicenseText =
            'Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International Lizenz';
        expectedLicenseIcons = [
            { src: 'https://mirrors.creativecommons.org/presskit/icons/cc.svg', alt: 'CC' },
            { src: 'https://mirrors.creativecommons.org/presskit/icons/by.svg', alt: 'BY' },
            { src: 'https://mirrors.creativecommons.org/presskit/icons/sa.svg', alt: 'SA' },
        ];

        // Create component fixture
        fixture = TestBed.createComponent(LicenseComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `LICENSE_LINK`', () => {
            expectToBe(component.LICENSE_LINK, expectedLicenseLink);
        });

        it('... should have `LICENSE_TEXT`', () => {
            expectToBe(component.LICENSE_TEXT, expectedLicenseText);
        });

        it('... should have `LICENSE_ICONS`', () => {
            expectToEqual(component.LICENSE_ICONS, expectedLicenseIcons);
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-license', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-license', 1, 1);
            });

            it('... should contain one paragraph with expected classes in div.awg-license', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-license', 1, 1);
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToContain(pEl.classList, 'small');
                expectToContain(pEl.classList, 'text-center');
            });

            it('... should contain one anchor in paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-license p', 1, 1);
                getAndExpectDebugElementByCss(pDes[0], 'a.awg-license-link', 1, 1);
            });

            it('... should have rel but no href attribute on anchor yet', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-license-link', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                expectToBe(aEl.href, '');
                expectToBe(aEl.rel, 'license');
            });

            it('... should contain no license text in anchor yet', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-license-link', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                expectToBe(aEl.textContent, '');
            });

            it('... should contain license icon span in anchor', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-license-link', 1, 1);

                getAndExpectDebugElementByCss(aDes[0], 'span.awg-license-icon', 1, 1);
            });

            it('... should contain no img elements in icon pan yet', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span.awg-license-icon', 1, 1);
                getAndExpectDebugElementByCss(spanDes[0], 'img', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should contain license text in anchor', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-license-link', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                expectToContain(aEl.textContent, expectedLicenseText);
            });

            it('... should have expected href and rel attributes on anchor', async () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-license-link', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                expectToBe(aEl.href, expectedLicenseLink);
                expectToContain(aEl.rel, 'license');
                // Security attributes automatically added by ExternalLinkDirective
                expectToContain(aEl.rel, 'noopener');
                expectToContain(aEl.rel, 'noreferrer');
            });

            it('... should contain 3 image elements with license icons in icon span', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span.awg-license-icon', 1, 1);
                const imgDes = getAndExpectDebugElementByCss(spanDes[0], 'img', 3, 3);

                imgDes.forEach((imgDe, index) => {
                    const imgEl: HTMLImageElement = imgDe.nativeElement;
                    expectToBe(imgEl.src, expectedLicenseIcons[index].src);
                    expectToBe(imgEl.alt, expectedLicenseIcons[index].alt);
                });
            });
        });
    });
});
