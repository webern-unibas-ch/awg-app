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

    let expectedLeftMainFooterLogoData: Logo;
    let expectedRightMainFooterLogoData: Logo;
    let expectedNonMainFooterLogoData: Logo;

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
        expectedLeftMainFooterLogoData = LOGOS_DATA['unibas'];
        expectedRightMainFooterLogoData = LOGOS_DATA['sagw'];
        expectedNonMainFooterLogoData = LOGOS_DATA['angular'];

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('logoData', {} as Logo);
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `logoData` input', () => {
            expectToEqual(component.logoData(), {} as Logo);
        });

        it('... should have computed `logoClassList` to be empty string (due to empty logoData)', () => {
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
            fixture.componentRef.setInput('logoData', expectedRightMainFooterLogoData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `logoData`', () => {
            expectToEqual(component.logoData(), expectedRightMainFooterLogoData);
        });

        it('... should change `logoData` if input changes', () => {
            expectToEqual(component.logoData(), expectedRightMainFooterLogoData);

            fixture.componentRef.setInput('logoData', expectedLeftMainFooterLogoData);

            expectToEqual(component.logoData(), expectedLeftMainFooterLogoData);

            fixture.componentRef.setInput('logoData', expectedNonMainFooterLogoData);

            expectToEqual(component.logoData(), expectedNonMainFooterLogoData);
        });

        it('... should have computed `logoClassList` to return the correct CSS classes (for right main footer)', () => {
            expectToBe(component.logoClassList(), `${cssClassMarginY2} ${cssClassFloatEnd}`);
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

            it('... should display the correct attributes (href, id, src, alt) for each logo type', async () => {
                const logosToTest = [
                    expectedRightMainFooterLogoData,
                    expectedLeftMainFooterLogoData,
                    expectedNonMainFooterLogoData,
                ];

                for (const logo of logosToTest) {
                    fixture.componentRef.setInput('logoData', logo);
                    await detectChangesOnPush(fixture);

                    const { anchorEl, imageEl } = getElements();

                    expectToContain(anchorEl.href, logo.href);
                    expectToBe(imageEl.id, logo.id);
                    expectToContain(imageEl.src, logo.src);
                    expectToBe(imageEl.alt, logo.alt);
                }
            });

            it('... should apply the correct CSS classes to the image for each logo type', async () => {
                const { imageEl } = getElements();

                fixture.componentRef.setInput('logoData', expectedRightMainFooterLogoData);
                await detectChangesOnPush(fixture);

                expectToBe(imageEl.classList.length, 2);
                expectToContain(imageEl.classList, cssClassMarginY2);
                expectToContain(imageEl.classList, cssClassFloatEnd);

                fixture.componentRef.setInput('logoData', expectedLeftMainFooterLogoData);
                await detectChangesOnPush(fixture);

                expectToBe(imageEl.classList.length, 1);
                expectToBe(imageEl.className, cssClassMarginY2);

                fixture.componentRef.setInput('logoData', expectedNonMainFooterLogoData);
                await detectChangesOnPush(fixture);

                expectToBe(imageEl.classList.length, 0);
                expectToBe(imageEl.className, '');
            });
        });

        describe('#logoClassList', () => {
            it('... should have a computed signal `logoClassList`', () => {
                expect(component.logoClassList).toBeDefined();
            });

            it('... should return correct CSS classes depending on the logo type', () => {
                const testCases = [
                    { logoData: expectedRightMainFooterLogoData, expected: `${cssClassMarginY2} ${cssClassFloatEnd}` },
                    { logoData: expectedLeftMainFooterLogoData, expected: cssClassMarginY2 },
                    { logoData: expectedNonMainFooterLogoData, expected: '' },
                ];

                testCases.forEach(({ logoData, expected }) => {
                    fixture.componentRef.setInput('logoData', logoData);

                    expectToBe(component.logoClassList(), expected);
                });
            });
        });
    });
});
