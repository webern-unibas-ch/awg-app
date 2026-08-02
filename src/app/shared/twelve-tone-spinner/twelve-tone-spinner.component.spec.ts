import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { TwelveToneSpinnerComponent } from './twelve-tone-spinner.component';

// Helper functions for testing pseudo-element content
function _getExpectedNoteSymbol(index: number): string {
    if (index === 0 || index === 6) {
        return '\u266F'; // UNICODE SHARP SIGN
    }

    if (index === 3 || index === 9) {
        return '\u266D'; // UNICODE FLAT SIGN
    }

    return '\u2669'; // UNICODE QUARTER NOTE
}

function _assertPseudoContentFromStyles(index: number, expectedContent: string): void {
    const styles = Array.from(document.querySelectorAll('style'))
        .map(style => style.textContent ?? '')
        .join('\n');

    let hexCode = '2669'; // Standard: Quarter Note
    if (expectedContent === '♭') {
        hexCode = '266d'; // Flat Sign
    } else if (expectedContent === '♯') {
        hexCode = '266f'; // Sharp Sign
    }

    const noteContentRegex = new RegExp(
        `data-note=["']${index}["'].*:before\\s*\\{\\s*content:\\s*["']\\\\${hexCode}["']`,
        'i'
    );

    expect(styles).toMatch(noteContentRegex);

    if (index === 0 || index === 6) {
        expectToBe(expectedContent, '♯');
    } else if (index === 3 || index === 9) {
        expectToBe(expectedContent, '♭');
    } else {
        expectToBe(expectedContent, '♩');
    }
}

describe('TwelveToneSpinnerComponent', () => {
    let component: TwelveToneSpinnerComponent;
    let fixture: ComponentFixture<TwelveToneSpinnerComponent>;
    let compDe: DebugElement;

    let expectedSpinnerText: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TwelveToneSpinnerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSpinnerText = 'loading';

        // Mock getComputedStyle to ensure consistent test results across different environments
        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(window, 'getComputedStyle').mockImplementation((element: Element) =>
            originalGetComputedStyle(element)
        );

        // Create component fixture
        fixture = TestBed.createComponent(TwelveToneSpinnerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `spinnerText` to hold the default text', () => {
            expectToBe(isSignal(component.spinnerText), true);

            expectToBe(component.spinnerText(), expectedSpinnerText);
        });

        it('... should have `spinnerNotes` with indices from 0 to 11', () => {
            const expectedNotes = Array.from({ length: 12 }, (_, i) => i);

            expectToEqual(component.spinnerNotes, expectedNotes);
        });

        describe('VIEW', () => {
            it('... should contain one div.twelve-tone-spinner', () => {
                getAndExpectDebugElementByCss(compDe, 'div.twelve-tone-spinner', 1, 1);
            });

            it('... should contain one div.twelve-tone-spinner-text in div.twelve-tone-spinner', () => {
                getAndExpectDebugElementByCss(compDe, 'div.twelve-tone-spinner > div.twelve-tone-spinner-text', 1, 1);
            });

            it('... should not display `spinnerText` yet', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.twelve-tone-spinner > div.twelve-tone-spinner-text > p',
                    1,
                    1
                );
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent, '');
            });

            it(`... should contain no div.twelve-tone-spinner-note yet"`, () => {
                getAndExpectDebugElementByCss(compDe, 'div.twelve-tone-spinner > div.twelve-tone-spinner-note', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should display `spinnerText`', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.twelve-tone-spinner > div.twelve-tone-spinner-text > p',
                    1,
                    1
                );
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent, expectedSpinnerText);
            });

            it('... should change `spinnerText` when input signal changes', () => {
                const newSpinnerText = 'running';

                fixture.componentRef.setInput('spinnerText', newSpinnerText);
                fixture.detectChanges();

                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.twelve-tone-spinner > div.twelve-tone-spinner-text > p',
                    1,
                    1
                );
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent, newSpinnerText);
            });

            describe('... should contain twelve div.twelve-tone-spinner-note with', () => {
                for (let i = 0; i <= 11; i++) {
                    it(`... data-note="${i}"`, () => {
                        getAndExpectDebugElementByCss(
                            compDe,
                            `div.twelve-tone-spinner > div.twelve-tone-spinner-note[data-note="${i}"]`,
                            1,
                            1
                        );
                    });
                }
            });

            describe('... should have correct :before content in div.twelve-tone-spinner-note with', () => {
                for (let i = 0; i <= 11; i++) {
                    it(`... data-note="${i}"`, () => {
                        const noteDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div.twelve-tone-spinner > div.twelve-tone-spinner-note[data-note="${i}"]`,
                            1,
                            1
                        );
                        const noteEl: HTMLDivElement = noteDes[0].nativeElement;

                        const beforeStyle = window.getComputedStyle(noteEl, ':before');
                        const beforeContent = beforeStyle.getPropertyValue('content');

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
    });
});
