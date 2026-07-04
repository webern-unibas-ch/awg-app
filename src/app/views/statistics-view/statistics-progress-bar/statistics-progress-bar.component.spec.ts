import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { StatisticsProgressBarConfig } from '../models/statistics.model';

import { StatisticsProgressBarComponent } from './statistics-progress-bar.component';

describe('StatisticsProgressBarComponent', () => {
    let component: StatisticsProgressBarComponent;
    let fixture: ComponentFixture<StatisticsProgressBarComponent>;
    let compDe: DebugElement;

    let expectedPercentage: number;
    let expectedHeight: string;
    let expectedShowPercentageLabel: boolean;
    let expectedBoldPercentageLabel: boolean;
    let expectedCustomType: string;
    let expectedUseCustomTypeOnly: boolean;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsProgressBarComponent, NgbProgressbar],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedPercentage = 75;
        expectedHeight = '20px';
        expectedShowPercentageLabel = true;
        expectedBoldPercentageLabel = true;
        expectedCustomType = 'custom-type';
        expectedUseCustomTypeOnly = false;

        // Create component fixture
        fixture = TestBed.createComponent(StatisticsProgressBarComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `fsElement`', () => {
            expectToBe(isSignal(component.config), true);

            expect(() => component.config()).toThrow();
        });

        it('... should have input signal `headerLabel` to be undefined', () => {
            expectToBe(isSignal(component.headerLabel), true);

            expect(component.headerLabel()).toBeUndefined();
        });

        it('... should have input signal `height` to hold the default value', () => {
            expectToBe(isSignal(component.height), true);

            expectToBe(component.height(), '15px');
        });

        it('... should have input signal `showPercentageLabel` to hold the default value', () => {
            expectToBe(component.showPercentageLabel(), true);
        });

        it('... should have input signal `boldPercentageLabel` to hold the default value', () => {
            expectToBe(component.boldPercentageLabel(), false);
        });

        it('... should have input signal `customType` to hold the default value', () => {
            expectToBe(component.customType(), '');
        });

        it('... should have input signal `useCustomTypeOnly` to hold the default value', () => {
            expectToBe(component.useCustomTypeOnly(), false);
        });

        it('... should throw when accessing computed signal `progressBarColorType` due to missing input', () => {
            expectToBe(isSignal(component.progressBarColorType), true);

            expect(() => component.progressBarColorType()).toThrow();
        });

        it('... should throw when accessing computed signal `progressBarWidth` due to missing input', () => {
            expectToBe(isSignal(component.progressBarWidth), true);

            expect(() => component.progressBarWidth()).toThrow();
        });

        it('... should throw when accessing computed signal `progressHeaderValue` due to missing input', () => {
            expectToBe(isSignal(component.progressHeaderValue), true);

            expect(() => component.progressHeaderValue()).toThrow();
        });

        it('... should throw when accessing computed signal `hasHeaderValue` due to missing input', () => {
            expectToBe(isSignal(component.hasHeaderValue), true);

            expect(() => component.hasHeaderValue()).toThrow();
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
                const containerEl: HTMLDivElement = containerDes[0].nativeElement;

                expectToContain(containerEl.classList, 'd-flex');
                expectToContain(containerEl.classList, 'align-items-center');
            });

            it('... should contain one NgbProgressbar', () => {
                getAndExpectDebugElementByDirective(compDe, NgbProgressbar, 1, 1);
            });

            it('... should have flex-grow-1 classes on NgbProgressbar', () => {
                const progressDes = getAndExpectDebugElementByDirective(compDe, NgbProgressbar, 1, 1);
                const progressEl: HTMLDivElement = progressDes[0].nativeElement;

                expectToContain(progressEl.classList, 'progress'); // Default class of NgbProgressbar
                expectToContain(progressEl.classList, 'flex-grow-1');
            });

            it('... should not have me-2 class on NgbProgressbar yet', () => {
                const progressDes = getAndExpectDebugElementByDirective(compDe, NgbProgressbar, 1, 1);
                const progressEl: HTMLDivElement = progressDes[0].nativeElement;

                expectToBe(progressEl.classList.length, 2);
                expectToContain(progressEl.classList, 'progress'); // Default class of NgbProgressbar
                expectToContain(progressEl.classList, 'flex-grow-1');
                expectToNotContain(progressEl.classList, 'me-2');
            });

            it('... should not pass down type, height, value or ariaLabel yet', () => {
                const progressDes = getAndExpectDebugElementByDirective(compDe, NgbProgressbar, 1, 1);
                const progressCmp = progressDes[0].injector.get(NgbProgressbar) as NgbProgressbar;

                expect(progressCmp.height).toBeUndefined();
                expect(progressCmp.type).toBeUndefined();
                expectToBe(progressCmp.value, 0); // Default value of NgbProgressbar
                expectToBe(progressCmp.ariaLabel, 'progress bar'); // Default label of NgbProgressbar
            });

            it('... should not show percentage label yet', () => {
                getAndExpectDebugElementByCss(compDe, 'small', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding (update)', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs signals
            fixture.componentRef.setInput('config', { mode: 'percentage', percentage: expectedPercentage });
            fixture.componentRef.setInput('height', expectedHeight);
            fixture.componentRef.setInput('showPercentageLabel', expectedShowPercentageLabel);
            fixture.componentRef.setInput('boldPercentageLabel', expectedBoldPercentageLabel);
            fixture.componentRef.setInput('customType', expectedCustomType);
            fixture.componentRef.setInput('useCustomTypeOnly', expectedUseCustomTypeOnly);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `config` to hold the provided data', () => {
            expectToEqual(component.config(), { mode: 'percentage', percentage: expectedPercentage });
        });

        it('... should have input signal `headerLabel` to be undefined', () => {
            expect(component.headerLabel()).toBeUndefined();
        });

        it('... should have input signal `height` to hold the provided height', () => {
            expectToBe(component.height(), expectedHeight);
        });

        it('... should have updated `showPercentageLabel` to hold the provided value', () => {
            expectToBe(component.showPercentageLabel(), expectedShowPercentageLabel);
        });

        it('... should have updated `boldPercentageLabel` to hold the provided value', () => {
            expectToBe(component.boldPercentageLabel(), expectedBoldPercentageLabel);
        });

        it('... should have updated `customType` to hold the provided type', () => {
            expectToBe(component.customType(), expectedCustomType);
        });

        it('... should have updated `useCustomTypeOnly` to hold the provided value', () => {
            expectToBe(component.useCustomTypeOnly(), expectedUseCustomTypeOnly);
        });

        it('... should have computed `progressBarColorType` to hold `warning` (due to percentage=75)', () => {
            expectToBe(component.progressBarColorType(), 'warning');
        });

        describe('... should update `progressBarColorType` when input changes', () => {
            describe('... with `useCustomTypeOnly` true', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('useCustomTypeOnly', true);
                });

                describe('... should return custom type (if provided) regardless of values', () => {
                    it('... in percentage mode', () => {
                        const config: StatisticsProgressBarConfig = {
                            mode: 'percentage',
                            percentage: 75,
                        };
                        fixture.componentRef.setInput('config', config);

                        expectToBe(component.progressBarColorType(), expectedCustomType);
                    });

                    it('... in ratio mode', () => {
                        const config: StatisticsProgressBarConfig = {
                            mode: 'ratio',
                            active: 90,
                            total: 120,
                        };
                        fixture.componentRef.setInput('config', config);

                        expectToBe(component.progressBarColorType(), expectedCustomType);
                    });

                    it('... in absolute mode', () => {
                        const config: StatisticsProgressBarConfig = {
                            mode: 'absolute',
                            active: 90,
                            total: 120,
                        };
                        fixture.componentRef.setInput('config', config);

                        expectToBe(component.progressBarColorType(), expectedCustomType);
                    });
                });

                describe('... should return light regardless of values if custom type is not provided', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('customType', '');
                    });

                    it('... in percentage mode', () => {
                        const config: StatisticsProgressBarConfig = {
                            mode: 'percentage',
                            percentage: 75,
                        };
                        fixture.componentRef.setInput('config', config);

                        expectToBe(component.progressBarColorType(), 'light');
                    });

                    it('... in ratio mode', () => {
                        const config: StatisticsProgressBarConfig = {
                            mode: 'ratio',
                            active: 90,
                            total: 120,
                        };
                        fixture.componentRef.setInput('config', config);

                        expectToBe(component.progressBarColorType(), 'light');
                    });

                    it('... in absolute mode', () => {
                        const config: StatisticsProgressBarConfig = {
                            mode: 'absolute',
                            active: 90,
                            total: 120,
                        };
                        fixture.componentRef.setInput('config', config);

                        expectToBe(component.progressBarColorType(), 'light');
                    });
                });
            });

            describe('... with `useCustomTypeOnly` false', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('useCustomTypeOnly', false);
                });

                describe('... should return `success` for width >= 80', () => {
                    it('... in percentage mode', () => {
                        const successCases: StatisticsProgressBarConfig[] = [
                            { mode: 'percentage', percentage: 80 },
                            { mode: 'percentage', percentage: 90 },
                            { mode: 'percentage', percentage: 100 },
                        ];

                        successCases.forEach(config => {
                            fixture.componentRef.setInput('config', config);

                            expectToBe(component.progressBarColorType(), 'success');
                        });
                    });

                    it('... in ratio mode', () => {
                        const successCases: StatisticsProgressBarConfig[] = [
                            { mode: 'ratio', active: 96, total: 120 },
                            { mode: 'ratio', active: 108, total: 120 },
                            { mode: 'ratio', active: 120, total: 120 },
                        ];

                        successCases.forEach(config => {
                            fixture.componentRef.setInput('config', config);

                            expectToBe(component.progressBarColorType(), 'success');
                        });
                    });

                    it('... in absolute mode', () => {
                        const successCases: StatisticsProgressBarConfig[] = [
                            { mode: 'absolute', active: 96, total: 120 },
                            { mode: 'absolute', active: 108, total: 120 },
                            { mode: 'absolute', active: 120, total: 120 },
                        ];

                        successCases.forEach(config => {
                            fixture.componentRef.setInput('config', config);

                            expectToBe(component.progressBarColorType(), 'success');
                        });
                    });
                });

                describe('... should return `warning` for width >= 50 and < 80', () => {
                    it('... in percentage mode', () => {
                        const warningCases: StatisticsProgressBarConfig[] = [
                            { mode: 'percentage', percentage: 50 },
                            { mode: 'percentage', percentage: 60 },
                            { mode: 'percentage', percentage: 79 },
                        ];

                        warningCases.forEach(config => {
                            fixture.componentRef.setInput('config', config);

                            expectToBe(component.progressBarColorType(), 'warning');
                        });
                    });

                    it('... in ratio mode', () => {
                        const warningCases: StatisticsProgressBarConfig[] = [
                            { mode: 'ratio', active: 60, total: 120 },
                            { mode: 'ratio', active: 72, total: 120 },
                            { mode: 'ratio', active: 95, total: 120 },
                        ];

                        warningCases.forEach(config => {
                            fixture.componentRef.setInput('config', config);

                            expectToBe(component.progressBarColorType(), 'warning');
                        });
                    });

                    it('... in absolute mode', () => {
                        const warningCases: StatisticsProgressBarConfig[] = [
                            { mode: 'absolute', active: 60, total: 120 },
                            { mode: 'absolute', active: 72, total: 120 },
                            { mode: 'absolute', active: 95, total: 120 },
                        ];

                        warningCases.forEach(config => {
                            fixture.componentRef.setInput('config', config);

                            expectToBe(component.progressBarColorType(), 'warning');
                        });
                    });
                });

                describe('... should return `danger` for width >= 1 and < 50', () => {
                    it('... in percentage mode', () => {
                        const dangerCases: StatisticsProgressBarConfig[] = [
                            { mode: 'percentage', percentage: 1 },
                            { mode: 'percentage', percentage: 25 },
                            { mode: 'percentage', percentage: 49 },
                        ];

                        dangerCases.forEach(config => {
                            fixture.componentRef.setInput('config', config);

                            expectToBe(component.progressBarColorType(), 'danger');
                        });
                    });

                    it('... in ratio mode', () => {
                        const dangerCases: StatisticsProgressBarConfig[] = [
                            { mode: 'ratio', active: 1, total: 120 },
                            { mode: 'ratio', active: 30, total: 120 },
                            { mode: 'ratio', active: 59, total: 120 },
                        ];

                        dangerCases.forEach(config => {
                            fixture.componentRef.setInput('config', config);

                            expectToBe(component.progressBarColorType(), 'danger');
                        });
                    });

                    it('... in absolute mode', () => {
                        const dangerCases: StatisticsProgressBarConfig[] = [
                            { mode: 'absolute', active: 1, total: 120 },
                            { mode: 'absolute', active: 30, total: 120 },
                            { mode: 'absolute', active: 59, total: 120 },
                        ];

                        dangerCases.forEach(config => {
                            fixture.componentRef.setInput('config', config);

                            expectToBe(component.progressBarColorType(), 'danger');
                        });
                    });
                });

                describe('... should return light for width === 0', () => {
                    it('... in percantage mode', () => {
                        const config: StatisticsProgressBarConfig = {
                            mode: 'percentage',
                            percentage: 0,
                        };
                        fixture.componentRef.setInput('config', config);

                        expectToBe(component.progressBarColorType(), 'light');
                    });

                    it('... in ratio mode', () => {
                        const config: StatisticsProgressBarConfig = {
                            mode: 'ratio',
                            active: 0,
                            total: 120,
                        };
                        fixture.componentRef.setInput('config', config);

                        expectToBe(component.progressBarColorType(), 'light');
                    });

                    it('... in absolute mode', () => {
                        const config: StatisticsProgressBarConfig = {
                            mode: 'absolute',
                            active: 0,
                            total: 120,
                        };
                        fixture.componentRef.setInput('config', config);

                        expectToBe(component.progressBarColorType(), 'light');
                    });
                });
            });
        });

        it('... should have computed `progressBarWidth` to hold the correct value (75%)', () => {
            expectToBe(component.progressBarWidth(), 75);
        });

        describe('... should update `progressBarWidth` when input changes', () => {
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

                it('... should clamp percentage to 100 if the configured percentage is greater than 100', () => {
                    fixture.componentRef.setInput('config', {
                        mode: 'percentage',
                        percentage: 125,
                    });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 100);
                });

                it('... should clamp percentage to 0 if the configured percentage is negative', () => {
                    fixture.componentRef.setInput('config', {
                        mode: 'percentage',
                        percentage: -50,
                    });
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 0);
                });
            });

            describe('... in ratio mode', () => {
                it('... should return 0 if total is 0', () => {
                    const config: StatisticsProgressBarConfig = {
                        mode: 'ratio',
                        active: 30,
                        total: 0,
                    };
                    fixture.componentRef.setInput('config', config);
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 0);
                });
                it('... should calculate width as percentage of active vs total in ratio mode', () => {
                    const testCases = [
                        { active: 0, expectedWidth: 0 },
                        { active: 30, expectedWidth: 25 },
                        { active: 60, expectedWidth: 50 },
                        { active: 90, expectedWidth: 75 },
                        { active: 120, expectedWidth: 100 },
                    ];

                    testCases.forEach(testCase => {
                        const config: StatisticsProgressBarConfig = {
                            mode: 'ratio',
                            active: testCase.active,
                            total: 120,
                        };
                        fixture.componentRef.setInput('config', config);
                        fixture.detectChanges();

                        expectToBe(component.progressBarWidth(), testCase.expectedWidth);
                    });
                });

                it('... should clamp percentage to 100 if the configured active/total ratio is greater than 100%', () => {
                    const config: StatisticsProgressBarConfig = {
                        mode: 'ratio',
                        active: 150,
                        total: 120,
                    };
                    fixture.componentRef.setInput('config', config);
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 100);
                });

                it('... should clamp percentage to 0 if the configured active/total ratio is negative', () => {
                    const config: StatisticsProgressBarConfig = {
                        mode: 'ratio',
                        active: -30,
                        total: 120,
                    };
                    fixture.componentRef.setInput('config', config);
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 0);
                });
            });

            describe('... in absolute mode', () => {
                it('... should return 0 if total is 0', () => {
                    const config: StatisticsProgressBarConfig = {
                        mode: 'absolute',
                        active: 30,
                        total: 0,
                    };
                    fixture.componentRef.setInput('config', config);
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 0);
                });

                it('... should calculate width as percentage of active vs total', () => {
                    const testCases = [
                        { active: 0, expectedWidth: 0 },
                        { active: 30, expectedWidth: 25 },
                        { active: 60, expectedWidth: 50 },
                        { active: 90, expectedWidth: 75 },
                        { active: 120, expectedWidth: 100 },
                    ];

                    testCases.forEach(testCase => {
                        const config: StatisticsProgressBarConfig = {
                            mode: 'absolute',
                            active: testCase.active,
                            total: 120,
                        };
                        fixture.componentRef.setInput('config', config);
                        fixture.detectChanges();

                        expectToBe(component.progressBarWidth(), testCase.expectedWidth);
                    });
                });

                it('... should clamp percentage to 100 if the configured active vs. total value is greater than 100%', () => {
                    const config: StatisticsProgressBarConfig = {
                        mode: 'absolute',
                        active: 150,
                        total: 120,
                    };
                    fixture.componentRef.setInput('config', config);
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 100);
                });

                it('... should clamp percentage to 0 if the configured active vs. total value is negative', () => {
                    const config: StatisticsProgressBarConfig = {
                        mode: 'absolute',
                        active: -30,
                        total: 120,
                    };
                    fixture.componentRef.setInput('config', config);
                    fixture.detectChanges();

                    expectToBe(component.progressBarWidth(), 0);
                });
            });

            it('... should return 0 for unknown mode (default)', () => {
                const config: StatisticsProgressBarConfig = {
                    mode: 'unknown' as any,
                    active: 30,
                    total: 120,
                };
                fixture.componentRef.setInput('config', config);
                fixture.detectChanges();

                expectToBe(component.progressBarWidth(), 0);
            });
        });

        it('... should have computed `progressHeaderValue` to hold the correct value (empty string)', () => {
            expectToBe(component.progressHeaderValue(), '');
        });

        describe('... should update `progressHeaderValue` when input changes', () => {
            describe('... should return empty string', () => {
                it('... when mode is percentage', () => {
                    fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 75 });
                    fixture.detectChanges();

                    expectToBe(component.progressHeaderValue(), '');
                });

                it('... when mode is ratio but active is undefined', () => {
                    const config: StatisticsProgressBarConfig = {
                        mode: 'ratio',
                        active: undefined,
                        total: 120,
                    };
                    fixture.componentRef.setInput('config', config);
                    fixture.detectChanges();

                    expectToBe(component.progressHeaderValue(), '');
                });

                it('... when mode is absolute but active is undefined', () => {
                    const config: StatisticsProgressBarConfig = {
                        mode: 'absolute',
                        active: undefined,
                        total: 120,
                    };
                    fixture.componentRef.setInput('config', config);
                    fixture.detectChanges();

                    expectToBe(component.progressHeaderValue(), '');
                });
            });

            it('... should return active/total ratio as string in ratio mode', () => {
                const config: StatisticsProgressBarConfig = {
                    mode: 'ratio',
                    active: 75,
                    total: 120,
                };
                fixture.componentRef.setInput('config', config);
                fixture.detectChanges();

                expectToBe(component.progressHeaderValue(), '75 / 120');
            });

            it('... should return active value as string in absolute mode', () => {
                const config: StatisticsProgressBarConfig = {
                    mode: 'absolute',
                    active: 75,
                    total: 120,
                };
                fixture.componentRef.setInput('config', config);
                fixture.detectChanges();

                expectToBe(component.progressHeaderValue(), '75');
            });
        });

        it('... should have computed `hasHeaderValue` to hold the correct value (false)', () => {
            expectToBe(component.hasHeaderValue(), false);
        });

        describe('... should update `hasHeaderValue` when input changes', () => {
            it('... should return false when mode is percentage', () => {
                fixture.componentRef.setInput('config', { mode: 'percentage', percentage: 75 });
                fixture.detectChanges();

                expectToBe(component.hasHeaderValue(), false);
            });

            it('... should return true when mode is ratio and active is defined', () => {
                const config: StatisticsProgressBarConfig = {
                    mode: 'ratio',
                    active: 75,
                    total: 120,
                };
                fixture.componentRef.setInput('config', config);
                fixture.detectChanges();

                expectToBe(component.hasHeaderValue(), true);
            });

            it('... should return true when mode is absolute and active is defined', () => {
                const config: StatisticsProgressBarConfig = {
                    mode: 'absolute',
                    active: 75,
                    total: 120,
                };
                fixture.componentRef.setInput('config', config);
                fixture.detectChanges();

                expectToBe(component.hasHeaderValue(), true);
            });
        });

        describe('VIEW', () => {
            it('... should have me-2 class on NgbProgressbar', () => {
                const progressDes = getAndExpectDebugElementByDirective(compDe, NgbProgressbar, 1, 1);
                const progressEl: HTMLDivElement = progressDes[0].nativeElement;

                expectToBe(progressEl.classList.length, 3);
                expectToContain(progressEl.classList, 'progress');
                expectToContain(progressEl.classList, 'flex-grow-1');
                expectToContain(progressEl.classList, 'me-2');
            });

            it('... should pass down correct height, value, type and ariaLabel to NgbProgressbar', () => {
                const progressDes = getAndExpectDebugElementByDirective(compDe, NgbProgressbar, 1, 1);
                const progressCmp = progressDes[0].injector.get(NgbProgressbar) as NgbProgressbar;

                expectToBe(progressCmp.height, '20px');
                expectToBe(progressCmp.value, 75);
                expectToBe(progressCmp.type, 'warning');
                expectToBe(progressCmp.ariaLabel, 'Progress Bar');
            });

            it('... should show percentage label (75%)', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl: HTMLElement = labelDes[0].nativeElement;

                expectToBe(labelEl.textContent?.trim(), '75%');
            });

            it('... should have fw-bold class on percentage label', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl: HTMLElement = labelDes[0].nativeElement;

                expectToContain(labelEl.classList, 'fw-bold');
            });

            it('... should not have text-muted class on percentage label due to non-zero percentage', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'small', 1, 1);
                const labelEl: HTMLElement = labelDes[0].nativeElement;

                expectToNotContain(labelEl.classList, 'text-muted');
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
                        const headerEl: HTMLDivElement = headerDes[0].nativeElement;

                        expectToBe(headerEl.classList.length, 2);
                        expectToContain(headerEl.classList, 'awg-statistics-progress-header');
                        expectToContain(headerEl.classList, 'mb-1');
                        expectToNotContain(headerEl.classList, 'd-flex');
                        expectToNotContain(headerEl.classList, 'justify-content-between');
                    });

                    it('... should display the headerLabel in only span in progress-header div', () => {
                        const headerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statistics-progress-header',
                            1,
                            1
                        );
                        const headerSpanDes = getAndExpectDebugElementByCss(headerDes[0], 'span', 1, 1);
                        const headerSpanEl: HTMLSpanElement = headerSpanDes[0].nativeElement;

                        expectToBe(headerSpanEl.textContent?.trim(), 'Progress Label');
                    });

                    it('... should pass down the headerLabel to NgbProgressbar', () => {
                        const progressDes = getAndExpectDebugElementByDirective(compDe, NgbProgressbar, 1, 1);
                        const progressCmp = progressDes[0].injector.get(NgbProgressbar) as NgbProgressbar;

                        expectToBe(progressCmp.ariaLabel, 'Progress Label');
                    });
                });

                describe('... in ratio/absolute mode (with progressHeaderValue)', () => {
                    beforeEach(() => {
                        fixture.componentRef.setInput('config', {
                            mode: 'ratio',
                            active: 75,
                            total: 100,
                        } as StatisticsProgressBarConfig);
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
                        const headerEl: HTMLDivElement = headerDes[0].nativeElement;

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
                        const headerSpanEl: HTMLSpanElement = headerSpanDes[0].nativeElement;

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
                        const headerSpanEl: HTMLSpanElement = headerSpanDes[1].nativeElement;

                        expectToBe(headerSpanEl.textContent?.trim(), '75 / 100');
                    });

                    it('... should display the progressHeaderValue as absolute value in second span in progress-header div (absolute mode)', () => {
                        fixture.componentRef.setInput('config', {
                            mode: 'absolute',
                            active: 75,
                            total: 100,
                        } as StatisticsProgressBarConfig);
                        fixture.detectChanges();

                        const headerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statistics-progress-header',
                            1,
                            1
                        );
                        const headerSpanDes = getAndExpectDebugElementByCss(headerDes[0], 'span', 2, 2);
                        const headerSpanEl: HTMLSpanElement = headerSpanDes[1].nativeElement;

                        expectToBe(headerSpanEl.textContent?.trim(), '75');
                    });

                    it('... should pass down the headerLabel to NgbProgressbar', () => {
                        const progressDes = getAndExpectDebugElementByDirective(compDe, NgbProgressbar, 1, 1);
                        const progressCmp = progressDes[0].injector.get(NgbProgressbar) as NgbProgressbar;

                        expectToBe(progressCmp.ariaLabel, 'Progress Label');
                    });
                });
            });

            describe('... when useCustomTypeOnly is true', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('useCustomTypeOnly', true);
                    fixture.detectChanges();
                });

                it('... should have computed signal `progressBarColorType` to hold custom type', () => {
                    expectToBe(component.progressBarColorType(), expectedCustomType);
                });

                it('... should not have color types on NgbProgressbar, but custom type only', () => {
                    const progressDes = getAndExpectDebugElementByDirective(compDe, NgbProgressbar, 1, 1);
                    const progressCmp = progressDes[0].injector.get(NgbProgressbar) as NgbProgressbar;

                    expectToBe(progressCmp.type, expectedCustomType);
                });
            });

            describe('... when showPercentageLabel is false', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('showPercentageLabel', false);
                    fixture.detectChanges();
                });

                it('... should not have me-2 class on NgbProgressbar', () => {
                    const progressDes = getAndExpectDebugElementByDirective(compDe, NgbProgressbar, 1, 1);
                    const progressEl: HTMLDivElement = progressDes[0].nativeElement;

                    expectToBe(progressEl.classList.length, 2);
                    expectToContain(progressEl.classList, 'progress');
                    expectToContain(progressEl.classList, 'flex-grow-1');
                    expectToNotContain(progressEl.classList, 'me-2');
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
                    const labelEl: HTMLElement = labelDes[0].nativeElement;

                    expectToNotContain(labelEl.classList, 'fw-bold');
                });
            });
        });
    });
});
