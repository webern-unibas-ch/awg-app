import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { LOGOS_DATA } from '@awg-core/core-data';
import { Logo } from '@awg-core/core-models';

import { FooterLogoComponent } from './footer-logo.component';

describe('FooterLogoComponent (DONE)', () => {
    let component: FooterLogoComponent;
    let fixture: ComponentFixture<FooterLogoComponent>;
    let compDe: DebugElement;

    let expectedLeftMainFooterLogo: Logo;
    let expectedRightMainFooterLogo: Logo;
    let expectedNonMainFooterLogo: Logo;

    const cssClassFloatEnd = 'float-end';
    const cssClassMarginY2 = 'my-2';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FooterLogoComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterLogoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLeftMainFooterLogo = LOGOS_DATA['unibas'];
        expectedRightMainFooterLogo = LOGOS_DATA['sagw'];
        expectedNonMainFooterLogo = LOGOS_DATA['angular'];

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('logo', {} as Logo);
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `logo` input', () => {
            expectToEqual(component.logo(), {} as Logo);
        });

        it('... should have computed `logoClassList` to be empty string (due to empty pageMetaData)', () => {
            expectToBe(component.logoClassList(), '');
        });

        describe('VIEW', () => {
            it('... should contain no anchor or image yet', () => {
                getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
                getAndExpectDebugElementByCss(compDe, 'a > img', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent updating the input properties
            fixture.componentRef.setInput('logo', expectedRightMainFooterLogo);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have logo', () => {
            expectToEqual(component.logo(), expectedRightMainFooterLogo);
        });

        it('... should change logo if input changes', () => {
            expectToEqual(component.logo(), expectedRightMainFooterLogo);

            fixture.componentRef.setInput('logo', expectedLeftMainFooterLogo);

            expectToEqual(component.logo(), expectedLeftMainFooterLogo);

            fixture.componentRef.setInput('logo', expectedNonMainFooterLogo);

            expectToEqual(component.logo(), expectedNonMainFooterLogo);
        });

        describe('... should have computed `logoClassList` to return ...', () => {
            it('... the correct CSS classes for each logo type', () => {
                const testCases = [
                    { logo: expectedRightMainFooterLogo, expected: `${cssClassMarginY2} ${cssClassFloatEnd}` },
                    { logo: expectedLeftMainFooterLogo, expected: cssClassMarginY2 },
                    { logo: expectedNonMainFooterLogo, expected: '' },
                ];

                testCases.forEach(({ logo, expected }) => {
                    fixture.componentRef.setInput('logo', logo);

                    expectToBe(component.logoClassList(), expected);
                });
            });
        });

        describe('VIEW', () => {
            const getElements = () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
                return {
                    anchorEl: anchorDes[0].nativeElement as HTMLAnchorElement,
                    imageEl: imageDes[0].nativeElement as HTMLImageElement,
                };
            };

            it('... should contain one image inside an anchor a', () => {
                getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
            });

            it('... should display the correct attributes (href, id, src, alt) for each logo', async () => {
                const logosToTest = [
                    expectedRightMainFooterLogo,
                    expectedLeftMainFooterLogo,
                    expectedNonMainFooterLogo,
                ];

                for (const expectedLogo of logosToTest) {
                    fixture.componentRef.setInput('logo', expectedLogo);
                    await detectChangesOnPush(fixture);

                    const { anchorEl, imageEl } = getElements();

                    expectToContain(anchorEl.href, expectedLogo.href);
                    expectToBe(imageEl.id, expectedLogo.id);
                    expectToContain(imageEl.src, expectedLogo.src);
                    expectToBe(imageEl.alt, expectedLogo.alt);
                }
            });

            it('... should apply the correct CSS classes to the image for each logo type', async () => {
                const { imageEl } = getElements();

                fixture.componentRef.setInput('logo', expectedRightMainFooterLogo);
                await detectChangesOnPush(fixture);

                expectToBe(imageEl.classList.length, 2);
                expectToContain(imageEl.classList, cssClassMarginY2);
                expectToContain(imageEl.classList, cssClassFloatEnd);

                fixture.componentRef.setInput('logo', expectedLeftMainFooterLogo);
                await detectChangesOnPush(fixture);

                expectToBe(imageEl.classList.length, 1);
                expectToBe(imageEl.className, cssClassMarginY2);

                fixture.componentRef.setInput('logo', expectedNonMainFooterLogo);
                await detectChangesOnPush(fixture);

                expectToBe(imageEl.classList.length, 0);
                expectToBe(imageEl.className, '');
            });
        });
    });
});
