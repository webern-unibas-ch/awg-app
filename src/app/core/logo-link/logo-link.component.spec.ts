import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { LOGOS_DATA } from '../data/logos.data';
import { Logo } from '../models/logos.model';
import { LogoLinkComponent } from './logo-link.component';

describe('LogoLinkComponent', () => {
    let component: LogoLinkComponent;
    let fixture: ComponentFixture<LogoLinkComponent>;
    let compDe: DebugElement;

    let expectedUnibasLogoData: Logo;
    let expectedSagwLogoData: Logo;
    let expectedAngularLogoData: Logo;

    const cssClassFloatEnd = 'float-end';
    const cssClassMarginY2 = 'my-2';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LogoLinkComponent],
        }).compileComponents();

        // Test data
        expectedUnibasLogoData = LOGOS_DATA['unibas'];
        expectedSagwLogoData = LOGOS_DATA['sagw'];
        expectedAngularLogoData = LOGOS_DATA['angular'];

        // Create component fixture
        fixture = TestBed.createComponent(LogoLinkComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `logoData`', () => {
            expectToBe(isSignal(component.logoData), true);

            expect(() => component.logoData()).toThrow();
        });

        it('... should have input signal `linkClass` to hold the default value', () => {
            expectToBe(isSignal(component.linkClass), true);

            expectToBe(component.linkClass(), 'awg-logo-link');
        });

        it('... should throw when accessing computed signal `logoClassList` due to missing input', () => {
            expectToBe(isSignal(component.logoClassList), true);

            expect(() => component.logoClassList()).toThrow();
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
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('logoData', expectedSagwLogoData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `logoData` to hold the provided data', () => {
            expectToEqual(component.logoData(), expectedSagwLogoData);
        });

        it('... should have computed signal `logoClassList` to hold the correct CSS classes (for right main footer)', () => {
            expectToBe(component.logoClassList(), `${cssClassMarginY2} ${cssClassFloatEnd}`);
        });

        it('... should update `logoClassList` when input changes', () => {
            const testCases = [
                { logoData: expectedSagwLogoData, expected: `${cssClassMarginY2} ${cssClassFloatEnd}` },
                { logoData: expectedUnibasLogoData, expected: cssClassMarginY2 },
                { logoData: expectedAngularLogoData, expected: '' },
            ];

            testCases.forEach(({ logoData, expected }) => {
                fixture.componentRef.setInput('logoData', logoData);

                expectToBe(component.logoClassList(), expected);
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

            it('... should display the correct attributes (href, id, src, alt) for each logo type', async () => {
                const logosToTest = [expectedSagwLogoData, expectedUnibasLogoData, expectedAngularLogoData];

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

                fixture.componentRef.setInput('logoData', expectedSagwLogoData);
                await detectChangesOnPush(fixture);

                expectToBe(imageEl.classList.length, 2);
                expectToContain(imageEl.classList, cssClassMarginY2);
                expectToContain(imageEl.classList, cssClassFloatEnd);

                fixture.componentRef.setInput('logoData', expectedUnibasLogoData);
                await detectChangesOnPush(fixture);

                expectToBe(imageEl.classList.length, 1);
                expectToBe(imageEl.className, cssClassMarginY2);

                fixture.componentRef.setInput('logoData', expectedAngularLogoData);
                await detectChangesOnPush(fixture);

                expectToBe(imageEl.classList.length, 0);
                expectToBe(imageEl.className, '');
            });
        });
    });
});
