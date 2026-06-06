import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { StatisticsProgressBarComponent } from './statistics-progress-bar.component';

describe('StatisticsProgressBarComponent', () => {
    let component: StatisticsProgressBarComponent;
    let fixture: ComponentFixture<StatisticsProgressBarComponent>;
    let compDe: DebugElement;

    let expectedPercentage: number;
    let expectedHeight: string;
    let expectedMinWidth: string;
    let expectedShowPercentageLabel: boolean;
    let expectedBoldPercentageLabel: boolean;
    let expectedCustomClasses: string;
    let expectedUseCustomClassesOnly: boolean;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StatisticsProgressBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatisticsProgressBarComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedPercentage = 75;
        expectedHeight = '20px';
        expectedMinWidth = '100px';
        expectedShowPercentageLabel = true;
        expectedBoldPercentageLabel = true;
        expectedCustomClasses = 'custom-class';
        expectedUseCustomClassesOnly = false;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have default `percentage`', () => {
            expectToBe(component.percentage(), 0);
        });

        it('... should have default `height`', () => {
            expectToBe(component.height(), '15px');
        });

        it('... should have default `minWidth`', () => {
            expectToBe(component.minWidth(), '120px');
        });

        it('... should have default `showPercentageLabel`', () => {
            expectToBe(component.showPercentageLabel(), true);
        });

        it('... should have default `boldPercentageLabel`', () => {
            expectToBe(component.boldPercentageLabel(), false);
        });

        it('... should have default `customClasses`', () => {
            expectToBe(component.customClasses(), '');
        });

        it('... should have default `useCustomClassesOnly`', () => {
            expectToBe(component.useCustomClassesOnly(), false);
        });

        it('... should have computed `progressBarColorType` (danger due to percentage=0)', () => {
            expectToBe(component.progressBarColorType(), 'danger');
        });

        describe('VIEW', () => {
            it('... should contain one outer div container', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-container', 1, 1);
            });

            it('... should have flex and center classes on outer div container', () => {
                const containerDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-statistics-progress-container',
                    1,
                    1
                );
                const containerEl = containerDes[0].nativeElement as HTMLDivElement;

                expectToContain(containerEl.classList, 'd-flex');
                expectToContain(containerEl.classList, 'align-items-center');
            });

            it('... should contain one progress div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress', 1, 1);
            });

            it('... should have progress and flex-grow-1 classes on progress div', () => {
                const progressDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress', 1, 1);
                const progressEl = progressDes[0].nativeElement as HTMLDivElement;

                expectToContain(progressEl.classList, 'progress');
                expectToContain(progressEl.classList, 'flex-grow-1');
            });

            it('... should not have me-2 class on progress div yet', () => {
                const progressDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress', 1, 1);
                const progressEl = progressDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressEl.classList.length, 3);
                expectToContain(progressEl.classList, 'awg-statistics-progress');
                expectToContain(progressEl.classList, 'progress');
                expectToContain(progressEl.classList, 'flex-grow-1');
                expectToBe(progressEl.classList.contains('me-2'), false);
            });

            it('... should not have style height and min-width set on progress div yet', () => {
                const progressDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress', 1, 1);
                const progressEl = progressDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressEl.style.height, '');
                expectToBe(progressEl.style.minWidth, '');
            });

            it('... should contain one progress bar div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-bar', 1, 1);
            });

            it('... should have progress-bar class on progress bar div', () => {
                const progressBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-bar', 1, 1);
                const progressBarEl = progressBarDes[0].nativeElement as HTMLDivElement;

                expectToContain(progressBarEl.classList, 'progress-bar');
            });

            it('... should not have custom or color classes on progress bar div yet', () => {
                const progressBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-bar', 1, 1);
                const progressBarEl = progressBarDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressBarEl.classList.length, 2);
                expectToContain(progressBarEl.classList, 'awg-statistics-progress-bar');
                expectToContain(progressBarEl.classList, 'progress-bar');
            });

            it('... should not have style width or aria-valuenow set in progress bar yet', () => {
                const progressBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-bar', 1, 1);
                const progressBarEl = progressBarDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressBarEl.style.width, '');
                expectToBe(progressBarEl.getAttribute('aria-valuenow'), null);
            });

            it('... should not show percentage label yet', () => {
                getAndExpectDebugElementByCss(compDe, 'small', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding (default)', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('... should have default `percentage`', () => {
            expectToBe(component.percentage(), 0);
        });

        it('... should have default `height`', () => {
            expectToBe(component.height(), '15px');
        });

        it('... should have default `minWidth`', () => {
            expectToBe(component.minWidth(), '120px');
        });

        it('... should have default `showPercentageLabel`', () => {
            expectToBe(component.showPercentageLabel(), true);
        });

        it('... should have default `boldPercentageLabel`', () => {
            expectToBe(component.boldPercentageLabel(), false);
        });

        it('... should have default `customClasses`', () => {
            expectToBe(component.customClasses(), '');
        });

        it('... should have default `useCustomClassesOnly`', () => {
            expectToBe(component.useCustomClassesOnly(), false);
        });

        it('... should have computed `progressBarColorType` (danger due to percentage=0)', () => {
            expectToBe(component.progressBarColorType(), 'danger');
        });

        describe('VIEW', () => {
            it('... should have me-2 class on progress div', () => {
                const progressDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress', 1, 1);
                const progressEl = progressDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressEl.classList.length, 4);
                expectToContain(progressEl.classList, 'awg-statistics-progress');
                expectToContain(progressEl.classList, 'progress');
                expectToContain(progressEl.classList, 'flex-grow-1');
                expectToContain(progressEl.classList, 'me-2');
            });

            it('... should have default style height and min-width set on progress div', () => {
                const progressDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress', 1, 1);
                const progressEl = progressDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressEl.style.height, '15px');
                expectToBe(progressEl.style.minWidth, '120px');
            });

            it('... should not have custom, but color classes on progress bar div (bg-danger due to percentage=0)', () => {
                const progressBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-bar', 1, 1);
                const progressBarEl = progressBarDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressBarEl.classList.length, 3);
                expectToContain(progressBarEl.classList, 'awg-statistics-progress-bar');
                expectToContain(progressBarEl.classList, 'progress-bar');
                expectToContain(progressBarEl.classList, 'bg-danger');
            });

            it('... should have style width or aria-valuenow set in progress bar (0)', () => {
                const progressBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-bar', 1, 1);
                const progressBarEl = progressBarDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressBarEl.style.width, '0%');
                expectToBe(progressBarEl.getAttribute('aria-valuenow'), '0');
            });

            it('... should show percentage label with default percentage value (0%)', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl = labelDes[0].nativeElement as HTMLElement;

                expectToBe(labelEl.textContent?.trim(), '0%');
            });

            it('... should not have fw-bold class on percentage label', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl = labelDes[0].nativeElement as HTMLElement;

                expectToBe(labelEl.classList.contains('fw-bold'), false);
            });
        });
    });

    describe('AFTER initial data binding (update)', () => {
        beforeEach(() => {
            // Simulate the parent component updating the input signals
            fixture.componentRef.setInput('percentage', expectedPercentage);
            fixture.componentRef.setInput('height', expectedHeight);
            fixture.componentRef.setInput('minWidth', expectedMinWidth);
            fixture.componentRef.setInput('showPercentageLabel', expectedShowPercentageLabel);
            fixture.componentRef.setInput('boldPercentageLabel', expectedBoldPercentageLabel);
            fixture.componentRef.setInput('customClasses', expectedCustomClasses);
            fixture.componentRef.setInput('useCustomClassesOnly', expectedUseCustomClassesOnly);

            fixture.detectChanges();
        });

        it('... should have updated `percentage` input signal', () => {
            expectToBe(component.percentage(), expectedPercentage);
        });

        it('... should have updated `height` input signal', () => {
            expectToBe(component.height(), expectedHeight);
        });

        it('... should have updated `minWidth` input signal', () => {
            expectToBe(component.minWidth(), expectedMinWidth);
        });

        it('... should have updated `showPercentageLabel` input signal', () => {
            expectToBe(component.showPercentageLabel(), expectedShowPercentageLabel);
        });

        it('... should have updated `boldPercentageLabel` input signal', () => {
            expectToBe(component.boldPercentageLabel(), expectedBoldPercentageLabel);
        });

        it('... should have updated `customClasses` input signal', () => {
            expectToBe(component.customClasses(), expectedCustomClasses);
        });

        it('... should have updated `useCustomClassesOnly` input signal', () => {
            expectToBe(component.useCustomClassesOnly(), expectedUseCustomClassesOnly);
        });

        it('... should have computed `progressBarColorType` (warning due to percentage=75)', () => {
            expectToBe(component.progressBarColorType(), 'warning');
        });

        describe('VIEW', () => {
            it('... should have me-2 class on progress div', () => {
                const progressDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress', 1, 1);
                const progressEl = progressDes[0].nativeElement as HTMLDivElement;

                console.log('Progress div classes:', progressEl.classList);
                expectToBe(progressEl.classList.length, 4);
                expectToContain(progressEl.classList, 'awg-statistics-progress');
                expectToContain(progressEl.classList, 'progress');
                expectToContain(progressEl.classList, 'flex-grow-1');
                expectToContain(progressEl.classList, 'me-2');
            });

            it('... should have style height and min-width set on progress div', () => {
                const progressDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress', 1, 1);
                const progressEl = progressDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressEl.style.height, expectedHeight);
                expectToBe(progressEl.style.minWidth, expectedMinWidth);
            });

            it('... should have custom and color classes on progress bar div (bg-warning due to percentage=75)', () => {
                const progressBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-bar', 1, 1);
                const progressBarEl = progressBarDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressBarEl.classList.length, 4);
                expectToContain(progressBarEl.classList, 'awg-statistics-progress-bar');
                expectToContain(progressBarEl.classList, 'progress-bar');
                expectToContain(progressBarEl.classList, 'custom-class');
                expectToContain(progressBarEl.classList, 'bg-warning');
            });

            it('... should have style width or aria-valuenow set in progress bar (depending on percentage)', () => {
                const progressBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-bar', 1, 1);
                const progressBarEl = progressBarDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressBarEl.style.width, '75%');
                expectToBe(progressBarEl.getAttribute('aria-valuenow'), '75');
            });

            it('... should show percentage label with percentage value (75%)', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl = labelDes[0].nativeElement as HTMLElement;

                expectToBe(labelEl.textContent?.trim(), '75%');
            });

            it('... should have fw-bold class on percentage label', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl = labelDes[0].nativeElement as HTMLElement;

                expectToContain(labelEl.classList, 'fw-bold');
            });

            describe('... when useCustomClassesOnly is true', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('useCustomClassesOnly', true);
                    fixture.detectChanges();
                });

                it('... should not have color classes on progress bar div, but custom classes only', () => {
                    const progressBarDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statistics-progress-bar',
                        1,
                        1
                    );
                    const progressBarEl = progressBarDes[0].nativeElement as HTMLDivElement;

                    expectToBe(progressBarEl.classList.length, 3);
                    expectToContain(progressBarEl.classList, 'awg-statistics-progress-bar');
                    expectToContain(progressBarEl.classList, 'progress-bar');
                    expectToContain(progressBarEl.classList, 'custom-class');
                    expectToBe(progressBarEl.classList.contains('bg-warning'), false);
                    expectToBe(progressBarEl.classList.contains('bg-success'), false);
                    expectToBe(progressBarEl.classList.contains('bg-danger'), false);
                });

                it('... should have computed `progressBarColorType` return empty string', () => {
                    expectToBe(component.progressBarColorType(), '');
                });
            });

            describe('... when showPercentageLabel is false', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('showPercentageLabel', false);
                    fixture.detectChanges();
                });

                it('... should not have me-2 class on progress div', () => {
                    const progressDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress', 1, 1);
                    const progressEl = progressDes[0].nativeElement as HTMLDivElement;

                    expectToBe(progressEl.classList.length, 3);
                    expectToContain(progressEl.classList, 'awg-statistics-progress');
                    expectToContain(progressEl.classList, 'progress');
                    expectToContain(progressEl.classList, 'flex-grow-1');
                    expectToBe(progressEl.classList.contains('me-2'), false);
                });

                it('... should not show percentage label', () => {
                    getAndExpectDebugElementByCss(compDe, 'small', 0, 0);
                });
            });

            describe('... when boldPercentageLabel is false', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('boldPercentageLabel', false);
                    fixture.detectChanges();
                });

                it('... should not have fw-bold class on percentage label', () => {
                    const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                    const labelEl = labelDes[0].nativeElement as HTMLElement;

                    expectToBe(labelEl.classList.contains('fw-bold'), false);
                });
            });
        });

        describe('#progressBarColorType()', () => {
            it('... should return an empty string if useCustomClassesOnly is true, regardless of percentage', () => {
                fixture.componentRef.setInput('percentage', 90);
                fixture.componentRef.setInput('useCustomClassesOnly', true);

                expectToBe(component.progressBarColorType(), '');
            });

            it('... should return success for percentage >= 80', () => {
                fixture.componentRef.setInput('percentage', 80);
                expectToBe(component.progressBarColorType(), 'success');

                fixture.componentRef.setInput('percentage', 90);
                expectToBe(component.progressBarColorType(), 'success');

                fixture.componentRef.setInput('percentage', 100);
                expectToBe(component.progressBarColorType(), 'success');
            });

            it('... should return warning for percentage >= 50 and < 80', () => {
                fixture.componentRef.setInput('percentage', 50);
                expectToBe(component.progressBarColorType(), 'warning');

                fixture.componentRef.setInput('percentage', 60);
                expectToBe(component.progressBarColorType(), 'warning');

                fixture.componentRef.setInput('percentage', 79);
                expectToBe(component.progressBarColorType(), 'warning');
            });

            it('... should return danger for percentage < 50', () => {
                fixture.componentRef.setInput('percentage', 0);
                expectToBe(component.progressBarColorType(), 'danger');

                fixture.componentRef.setInput('percentage', 25);
                expectToBe(component.progressBarColorType(), 'danger');

                fixture.componentRef.setInput('percentage', 49);
                expectToBe(component.progressBarColorType(), 'danger');
            });
        });
    });
});
