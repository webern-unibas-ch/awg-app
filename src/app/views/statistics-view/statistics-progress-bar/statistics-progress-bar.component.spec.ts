import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

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

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 0 });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `config`', () => {
            expectToEqual(component.config(), { mode: 'percentage', percentage: 0 });
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

        describe('VIEW', () => {
            it('... should contain no progress-header div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-header', 0, 0);
            });

            it('... should contain one outer progress-container div', () => {
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

    describe('AFTER initial data binding (default values)', () => {
        beforeEach(() => {
            fixture.detectChanges();
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

        it('... should have computed `progressBarColorType` (light due to percentage=0)', () => {
            expectToBe(component.progressBarColorType(), 'light');
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
                expectToContain(progressBarEl.classList, 'bg-light');
            });

            it('... should have style width or aria-valuenow set in progress bar (0)', () => {
                const progressBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-bar', 1, 1);
                const progressBarEl = progressBarDes[0].nativeElement as HTMLDivElement;

                expectToBe(progressBarEl.style.width, '0%');
                expectToBe(progressBarEl.getAttribute('aria-valuenow'), '0');
            });

            it('... should show percentage label (0%)', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl = labelDes[0].nativeElement as HTMLElement;

                expectToBe(labelEl.textContent?.trim(), '0%');
            });

            it('... should not have fw-bold class on percentage label', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl = labelDes[0].nativeElement as HTMLElement;

                expectToBe(labelEl.classList.contains('fw-bold'), false);
            });

            it('... should have text-muted class on percentage label due to 0%', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl = labelDes[0].nativeElement as HTMLElement;

                expectToBe(labelEl.classList.contains('text-muted'), true);
            });
        });
    });

    describe('AFTER initial data binding (update)', () => {
        beforeEach(() => {
            // Simulate the parent component updating the input signals
            fixture.componentRef.setInput('config', { mode: 'percentage', percentage: expectedPercentage });
            fixture.componentRef.setInput('height', expectedHeight);
            fixture.componentRef.setInput('minWidth', expectedMinWidth);
            fixture.componentRef.setInput('showPercentageLabel', expectedShowPercentageLabel);
            fixture.componentRef.setInput('boldPercentageLabel', expectedBoldPercentageLabel);
            fixture.componentRef.setInput('customClasses', expectedCustomClasses);
            fixture.componentRef.setInput('useCustomClassesOnly', expectedUseCustomClassesOnly);

            fixture.detectChanges();
        });

        it('... should have updated `config`', () => {
            expectToEqual(component.config(), { mode: 'percentage', percentage: expectedPercentage });
        });

        it('... should have updated `height`', () => {
            expectToBe(component.height(), expectedHeight);
        });

        it('... should have updated `minWidth`', () => {
            expectToBe(component.minWidth(), expectedMinWidth);
        });

        it('... should have updated `showPercentageLabel`', () => {
            expectToBe(component.showPercentageLabel(), expectedShowPercentageLabel);
        });

        it('... should have updated `boldPercentageLabel`', () => {
            expectToBe(component.boldPercentageLabel(), expectedBoldPercentageLabel);
        });

        it('... should have updated `customClasses`', () => {
            expectToBe(component.customClasses(), expectedCustomClasses);
        });

        it('... should have updated `useCustomClassesOnly`', () => {
            expectToBe(component.useCustomClassesOnly(), expectedUseCustomClassesOnly);
        });

        it('... should have computed `progressBarColorType` (`warning` due to percentage=75)', () => {
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

            it('... should show percentage label (75%)', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl = labelDes[0].nativeElement as HTMLElement;

                expectToBe(labelEl.textContent?.trim(), '75%');
            });

            it('... should have fw-bold class on percentage label', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl = labelDes[0].nativeElement as HTMLElement;

                expectToContain(labelEl.classList, 'fw-bold');
            });

            it('... should not have text-muted class on percentage label due to non-zero percentage', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl = labelDes[0].nativeElement as HTMLElement;

                expectToBe(labelEl.classList.contains('text-muted'), false);
            });

            describe('... when headerLabel is given', () => {
                describe('... in percentage mode (without progressHeaderValue)', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 75 });
                        fixture.componentRef.setInput('headerLabel', 'Progress Label');
                        fixture.detectChanges();
                    });

                    it('... should contain one progress-header div', () => {
                        getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-header', 1, 1);
                    });

                    it('... should have no flex classes on progress-header div', () => {
                        const headerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statistics-progress-header',
                            1,
                            1
                        );
                        const headerEl = headerDes[0].nativeElement as HTMLDivElement;

                        expectToBe(headerEl.classList.length, 2);
                        expectToContain(headerEl.classList, 'awg-statistics-progress-header');
                        expectToContain(headerEl.classList, 'mb-1');
                        expectToBe(headerEl.classList.contains('d-flex'), false);
                        expectToBe(headerEl.classList.contains('justify-content-between'), false);
                    });

                    it('... should display the headerLabel in only span in progress-header div', () => {
                        const headerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statistics-progress-header',
                            1,
                            1
                        );
                        const headerSpanDes = getAndExpectDebugElementByCss(headerDes[0], 'span', 1, 1);
                        const headerSpanEl = headerSpanDes[0].nativeElement as HTMLSpanElement;

                        expectToBe(headerSpanEl.textContent?.trim(), 'Progress Label');
                    });
                });

                describe('... in ratio/absolute mode (with progressHeaderValue)', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 75, total: 100 });
                        fixture.componentRef.setInput('headerLabel', 'Progress Label');
                        fixture.detectChanges();
                    });

                    it('... should contain one progress-header div', () => {
                        getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-progress-header', 1, 1);
                    });

                    it('... should have flex and center classes on progress-header div', () => {
                        const headerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statistics-progress-header',
                            1,
                            1
                        );
                        const headerEl = headerDes[0].nativeElement as HTMLDivElement;

                        expectToBe(headerEl.classList.length, 4);
                        expectToContain(headerEl.classList, 'awg-statistics-progress-header');
                        expectToContain(headerEl.classList, 'mb-1');
                        expectToContain(headerEl.classList, 'd-flex');
                        expectToContain(headerEl.classList, 'justify-content-between');
                    });

                    it('... should display the headerLabel in first span in progress-header div', () => {
                        const headerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statistics-progress-header',
                            1,
                            1
                        );
                        const headerSpanDes = getAndExpectDebugElementByCss(headerDes[0], 'span', 2, 2);
                        const headerSpanEl = headerSpanDes[0].nativeElement as HTMLSpanElement;

                        expectToBe(headerSpanEl.textContent?.trim(), 'Progress Label');
                    });

                    it('... should display the progressHeaderValue as ratio in second span in progress-header div (ratio mode)', () => {
                        const headerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statistics-progress-header',
                            1,
                            1
                        );
                        const headerSpanDes = getAndExpectDebugElementByCss(headerDes[0], 'span', 2, 2);
                        const headerSpanEl = headerSpanDes[1].nativeElement as HTMLSpanElement;

                        expectToBe(headerSpanEl.textContent?.trim(), '75 / 100');
                    });

                    it('... should display the progressHeaderValue as absolute value in second span in progress-header div (absolute mode)', () => {
                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 75, total: 100 });
                        fixture.detectChanges();

                        const headerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statistics-progress-header',
                            1,
                            1
                        );
                        const headerSpanDes = getAndExpectDebugElementByCss(headerDes[0], 'span', 2, 2);
                        const headerSpanEl = headerSpanDes[1].nativeElement as HTMLSpanElement;

                        expectToBe(headerSpanEl.textContent?.trim(), '75');
                    });
                });
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
            it('... should have a computed signal `progressBarColorType', () => {
                expect(component.progressBarColorType()).toBeDefined();
            });

            describe('... with useCustomClassesOnly true', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('useCustomClassesOnly', true);
                });

                describe('... should return an empty string regardless of values', () => {
                    it('... in percentage mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 90 });

                        expectToBe(component.progressBarColorType(), '');
                    });

                    it('... in ratio mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 90, total: 120 });

                        expectToBe(component.progressBarColorType(), '');
                    });

                    it('... in absolute mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 90, total: 120 });

                        expectToBe(component.progressBarColorType(), '');
                    });
                });
            });

            describe('... with useCustomClassesOnly false', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('useCustomClassesOnly', false);
                });

                describe('... should return `success` for width >= 80', () => {
                    it('... in percentage mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 80 });
                        expectToBe(component.progressBarColorType(), 'success');

                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 90 });
                        expectToBe(component.progressBarColorType(), 'success');

                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 100 });
                        expectToBe(component.progressBarColorType(), 'success');
                    });

                    it('... in ratio mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 96, total: 120 });
                        expectToBe(component.progressBarColorType(), 'success');

                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 108, total: 120 });
                        expectToBe(component.progressBarColorType(), 'success');

                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 120, total: 120 });
                        expectToBe(component.progressBarColorType(), 'success');
                    });

                    it('... in absolute mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 96, total: 120 });
                        expectToBe(component.progressBarColorType(), 'success');

                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 108, total: 120 });
                        expectToBe(component.progressBarColorType(), 'success');

                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 120, total: 120 });
                        expectToBe(component.progressBarColorType(), 'success');
                    });
                });

                describe('... should return `warning` for width >= 50 and < 80', () => {
                    it('... in percentage mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 50 });
                        expectToBe(component.progressBarColorType(), 'warning');

                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 60 });
                        expectToBe(component.progressBarColorType(), 'warning');

                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 79 });
                        expectToBe(component.progressBarColorType(), 'warning');
                    });

                    it('... in ratio mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 60, total: 120 });
                        expectToBe(component.progressBarColorType(), 'warning');

                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 72, total: 120 });
                        expectToBe(component.progressBarColorType(), 'warning');

                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 95, total: 120 });
                        expectToBe(component.progressBarColorType(), 'warning');
                    });

                    it('... in absolute mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 60, total: 120 });
                        expectToBe(component.progressBarColorType(), 'warning');

                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 72, total: 120 });
                        expectToBe(component.progressBarColorType(), 'warning');

                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 95, total: 120 });
                        expectToBe(component.progressBarColorType(), 'warning');
                    });
                });

                describe('... should return `danger` for widht >= 1 and < 50', () => {
                    it('... in percentage mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 1 });
                        expectToBe(component.progressBarColorType(), 'danger');

                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 25 });
                        expectToBe(component.progressBarColorType(), 'danger');

                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 49 });
                        expectToBe(component.progressBarColorType(), 'danger');
                    });

                    it('... in ratio mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 1, total: 120 });
                        expectToBe(component.progressBarColorType(), 'danger');

                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 30, total: 120 });
                        expectToBe(component.progressBarColorType(), 'danger');

                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 59, total: 120 });
                        expectToBe(component.progressBarColorType(), 'danger');
                    });

                    it('... in absolute mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 1, total: 120 });
                        expectToBe(component.progressBarColorType(), 'danger');

                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 30, total: 120 });
                        expectToBe(component.progressBarColorType(), 'danger');

                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 59, total: 120 });
                        expectToBe(component.progressBarColorType(), 'danger');
                    });
                });

                describe('... should return light for width === 0', () => {
                    it('... in percantage mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 0 });
                        expectToBe(component.progressBarColorType(), 'light');
                    });

                    it('... in ratio mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'ratio', available: 0, total: 120 });
                        expectToBe(component.progressBarColorType(), 'light');
                    });

                    it('... in absolute mode', () => {
                        fixture.componentRef.setInput('config', { mode: 'absolute', available: 0, total: 120 });
                        expectToBe(component.progressBarColorType(), 'light');
                    });
                });
            });
        });

        describe('#progressBarWidth()', () => {
            it('... should have a computed signal `progressBarWidth', () => {
                expect(component.progressBarWidth()).toBeDefined();
            });

            describe('... in percentage mode', () => {
                it('... should return 0 if percentage is undefined', () => {
                    fixture.componentRef.setInput('config', { mode: 'percentage' });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 0);
                });

                it('... should return the given percentage value directly', () => {
                    fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 0 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 0);

                    fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 25 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 25);

                    fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 50 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 50);

                    fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 75 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 75);

                    fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 100 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 100);
                });
            });

            describe('... in ratio mode', () => {
                it('... should return 0 if total is 0', () => {
                    fixture.componentRef.setInput('config', { mode: 'ratio', available: 30, total: 0 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 0);
                });
                it('... should calculate width as percentage of available vs total in ratio mode', () => {
                    fixture.componentRef.setInput('config', { mode: 'ratio', available: 0, total: 120 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 0);

                    fixture.componentRef.setInput('config', { mode: 'ratio', available: 30, total: 120 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 25);

                    fixture.componentRef.setInput('config', { mode: 'ratio', available: 60, total: 120 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 50);

                    fixture.componentRef.setInput('config', { mode: 'ratio', available: 90, total: 120 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 75);

                    fixture.componentRef.setInput('config', { mode: 'ratio', available: 120, total: 120 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 100);
                });
            });

            describe('... in absolute mode', () => {
                it('... should return 0 if total is 0', () => {
                    fixture.componentRef.setInput('config', { mode: 'absolute', available: 30, total: 0 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 0);
                });

                it('... should calculate width as percentage of available vs total', () => {
                    fixture.componentRef.setInput('config', { mode: 'absolute', available: 0, total: 120 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 0);

                    fixture.componentRef.setInput('config', { mode: 'absolute', available: 30, total: 120 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 25);

                    fixture.componentRef.setInput('config', { mode: 'absolute', available: 60, total: 120 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 50);

                    fixture.componentRef.setInput('config', { mode: 'absolute', available: 90, total: 120 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 75);

                    fixture.componentRef.setInput('config', { mode: 'absolute', available: 120, total: 120 });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 100);
                });
            });

            it('... should return 0 for unknown mode (default)', () => {
                fixture.componentRef.setInput('config', { mode: 'unknown', available: 30, total: 120 } as any);
                fixture.detectChanges();

                expectToBe(component.progressBarWidth(), 0);
            });
        });

        describe('#progressHeaderValue()', () => {
            it('... should have a computed signal `progressHeaderValue', () => {
                expect(component.progressHeaderValue()).toBeDefined();
            });

            describe('... should return empty string', () => {
                it('... when mode is percentage', () => {
                    fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 75 });
                    fixture.detectChanges();

                    expectToBe(component.progressHeaderValue(), '');
                });

                it('... when mode is ratio but available is undefined', () => {
                    fixture.componentRef.setInput('config', { mode: 'ratio', available: undefined, total: 120 } as any);
                    fixture.detectChanges();

                    expectToBe(component.progressHeaderValue(), '');
                });

                it('... when mode is absolute but available is undefined', () => {
                    fixture.componentRef.setInput('config', {
                        mode: 'absolute',
                        available: undefined,
                        total: 120,
                    } as any);
                    fixture.detectChanges();

                    expectToBe(component.progressHeaderValue(), '');
                });
            });

            it('... should return available/total ratio as string in ratio mode', () => {
                fixture.componentRef.setInput('config', { mode: 'ratio', available: 75, total: 120 });
                fixture.detectChanges();

                expectToBe(component.progressHeaderValue(), '75 / 120');
            });

            it('... should return available value as string in absolute mode', () => {
                fixture.componentRef.setInput('config', { mode: 'absolute', available: 75, total: 120 });
                fixture.detectChanges();

                expectToBe(component.progressHeaderValue(), '75');
            });
        });
    });
});
