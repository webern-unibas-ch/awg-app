import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { LicenseComponent } from './license.component';

describe('LicenseComponent', () => {
    let component: LicenseComponent;
    let fixture: ComponentFixture<LicenseComponent>;
    let compDe: DebugElement;

    let expectedLicenseLink: string;
    let expectedLicenseText: string;
    let expectedLicenseImageLink: string;
    let expectedLicenseImageText: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LicenseComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LicenseComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLicenseLink = 'https://creativecommons.org/licenses/by-sa/4.0/';
        expectedLicenseText =
            'Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International Lizenz';
        expectedLicenseImageLink = 'https://i.creativecommons.org/l/by-sa/4.0/80x15.png';
        expectedLicenseImageText = 'Creative Commons Attribution-ShareAlike BY-SA 4.0 International License';
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

            it('... should have small and text-center class on paragraph', () => {
                getAndExpectDebugElementByCss(compDe, 'p.small.text-center', 1, 1);
            });

            it('... should contain two links to the license', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-license p', 1, 1);
                getAndExpectDebugElementByCss(pDes[0], 'a[rel="license"]', 2, 2);
            });

            it('... should contain CC BY-SA 4.0 license links', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-license p', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a[rel="license"]', 2, 2);

                aDes.forEach(aDe => {
                    const aEl = aDe.nativeElement as HTMLAnchorElement;

                    expectToBe(aEl.href, expectedLicenseLink);
                });
            });

            it('... should contain license image in first link', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-license p', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a[rel="license"]', 2, 2);

                const imgDes = getAndExpectDebugElementByCss(aDes[0], 'img', 1, 1);
                const imgEl = imgDes[0].nativeElement as HTMLImageElement;

                expectToBe(imgEl.src, expectedLicenseImageLink);
                expectToBe(imgEl.alt, expectedLicenseImageText);
            });

            it('... should contain license text in second link', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-license p', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a[rel="license"]', 2, 2);
                const aEl = aDes[1].nativeElement as HTMLAnchorElement;

                expectToBe(aEl.textContent, expectedLicenseText);
            });
        });
    });
});
