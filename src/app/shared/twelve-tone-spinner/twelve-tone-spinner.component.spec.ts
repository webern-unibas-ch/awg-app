import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { TwelveToneSpinnerComponent } from './twelve-tone-spinner.component';

// Helper functions for testing pseudo-element content
function _getExpectedNoteSymbol(index: number): string {
    if (index === 6 || index === 12) {
        return '\u266D'; // UNICODE FLAT SIGN
    }

    if (index === 3 || index === 9) {
        return '\u266F'; // UNICODE SHARP SIGN
    }

    return '\u2669'; // UNICODE QUARTER NOTE
}

function _assertPseudoContentFromStyles(index: number, expectedContent: string): void {
    const styles = Array.from(document.querySelectorAll('style'))
        .map(style => style.textContent ?? '')
        .join('\n');

    if (index === 6 || index === 12) {
        expect(styles).toMatch(/spinner-note6/);
        expect(styles).toMatch(/spinner-note12/);
        expect(styles).toMatch(/content:\s*"\\266d"/i);
        return;
    }

    if (index === 3 || index === 9) {
        expect(styles).toMatch(/spinner-note3/);
        expect(styles).toMatch(/spinner-note9/);
        expect(styles).toMatch(/content:\s*"\\266f"/i);
        return;
    }

    expect(styles).toMatch(/>\s*div[^\n]*:before/i);
    expect(styles).toMatch(/content:\s*"\\2669"/i);
    expectToBe(expectedContent, '\u2669');
}

describe('TwelveToneSpinnerComponent', () => {
    let component: TwelveToneSpinnerComponent;
    let fixture: ComponentFixture<TwelveToneSpinnerComponent>;
    let compDe: DebugElement;

    let expectedSpinnerLoadText: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TwelveToneSpinnerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TwelveToneSpinnerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSpinnerLoadText = 'loading';

        // Mock getComputedStyle to ensure consistent test results across different environments
        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(window, 'getComputedStyle').mockImplementation((element: Element) =>
            originalGetComputedStyle(element)
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `spinnerLoadText`', () => {
            expectToBe(component.spinnerLoadText, expectedSpinnerLoadText);
        });

        describe('VIEW', () => {
            it('... should contain one div.spinner', () => {
                getAndExpectDebugElementByCss(compDe, 'div.spinner', 1, 1);
            });

            it('... should contain one div.spinner-load-text in div.spinner', () => {
                getAndExpectDebugElementByCss(compDe, 'div.spinner > div.spinner-load-text', 1, 1);
            });

            it(`... should not display load text yet`, () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.spinner > div.spinner-load-text > p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent, '');
            });

            for (let i = 1; i <= 12; i++) {
                it(`... should contain one div.spinner-note${i} in div.spinner`, () => {
                    getAndExpectDebugElementByCss(compDe, `div.spinner > div.spinner-note${i}`, 1, 1);
                });
            }

            for (let i = 1; i <= 12; i++) {
                it(`... should contain one div.spinner-note${i} with correct :before content in div.spinner`, () => {
                    const noteDes = getAndExpectDebugElementByCss(compDe, `div.spinner > div.spinner-note${i}`, 1, 1);
                    const noteEl: HTMLDivElement = noteDes[0].nativeElement;

                    const beforeContent = window.getComputedStyle(noteEl, ':before').getPropertyValue('content');

                    // Replace is used to remove the quotes around the content string
                    const actualContent = beforeContent.replace(/['"]+/g, '');
                    const expectedContent = _getExpectedNoteSymbol(i);

                    if (actualContent === 'normal' || actualContent === '') {
                        _assertPseudoContentFromStyles(i, expectedContent);
                    } else {
                        expectToBe(actualContent, expectedContent);
                    }
                });
            }
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it(`... should display load text`, () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.spinner > div.spinner-load-text > p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent, expectedSpinnerLoadText);
            });
        });
    });
});
