import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { LicenseComponent } from './license.component';

describe('LicenseComponent', () => {
    let component: LicenseComponent;
    let fixture: ComponentFixture<LicenseComponent>;
    let compDe: DebugElement;

    let expectedLicenseIcons: Array<{ src: string; alt: string }>;
    let expectedLicenseLink: string;
    let expectedLicenseText: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LicenseComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LicenseComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLicenseIcons = [
            { src: 'https://mirrors.creativecommons.org/presskit/icons/cc.svg', alt: 'License: CC icon' },
            { src: 'https://mirrors.creativecommons.org/presskit/icons/by.svg', alt: 'License: CC Attribution icon' },
            { src: 'https://mirrors.creativecommons.org/presskit/icons/sa.svg', alt: 'License: CC ShareAlike icon' },
        ];
        expectedLicenseLink = 'https://creativecommons.org/licenses/by-sa/4.0/';
        expectedLicenseText =
            'Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International Lizenz';
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        describe('VIEW', () => {
            it('... should contain one div.awg-license', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-license', 1, 1);
            });

            it('... should contain one paragraph in div.awg-license', () => {
                getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
            });

            it('... should contain one paragraph with small and text-center classes', () => {
                getAndExpectDebugElementByCss(compDe, 'p.small.text-center', 1, 1);
            });

            it('... should contain one anchor with correct href and rel attributes', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-license p', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a[rel="license"]', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement as HTMLAnchorElement;

                expectToBe(aEl.href, expectedLicenseLink);
                expectToBe(aEl.rel, 'license');
            });

            it('... should contain license text in anchor', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-license p', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a[rel="license"]', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement as HTMLAnchorElement;

                expectToContain(aEl.textContent, expectedLicenseText);
            });

            it('... should contain license icon span in anchor', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-license p', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a[rel="license"]', 1, 1);

                getAndExpectDebugElementByCss(aDes[0], 'span.awg-license-icon', 1, 1);
            });

            it('... should contain 3 license icons in icon span', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span.awg-license-icon', 1, 1);
                const imgDes = getAndExpectDebugElementByCss(spanDes[0], 'img', 3, 3);

                imgDes.forEach((imgDe, index) => {
                    const imgEl: HTMLImageElement = imgDe.nativeElement as HTMLImageElement;
                    expectToBe(imgEl.src, expectedLicenseIcons[index].src);
                    expectToBe(imgEl.alt, expectedLicenseIcons[index].alt);
                });
            });
        });
    });
});
