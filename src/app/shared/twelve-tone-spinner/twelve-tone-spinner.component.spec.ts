import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { TwelveToneSpinnerComponent } from './twelve-tone-spinner.component';

describe('TwelveToneSpinnerComponent', () => {
    let component: TwelveToneSpinnerComponent;
    let fixture: ComponentFixture<TwelveToneSpinnerComponent>;
    let compDe: DebugElement;

    let expectedSpinnerLoadText: string;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [TwelveToneSpinnerComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TwelveToneSpinnerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSpinnerLoadText = 'loading';
    });

    afterAll(() => {
        cleanStylesFromDOM();
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

                    let expectedContent: string;
                    if (i === 6 || i === 12) {
                        expectedContent = '\u266D'; // UNICODE FLAT SIGN
                    } else if (i === 3 || i === 9) {
                        expectedContent = '\u266F'; // UNICODE SHARP SIGN
                    } else {
                        expectedContent = '\u2669'; // UNICODE QUARTER NOTE
                    }

                    expectToBe(actualContent, expectedContent);
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
