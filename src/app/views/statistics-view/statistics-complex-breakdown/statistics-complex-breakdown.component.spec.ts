import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import {
    StatisticsComplexBreakdown,
    StatisticsProgressBarConfig,
    StatisticsProgressBarItem,
} from '@awg-views/statistics-view/models';
import { StatisticsProgressBarComponent } from '@awg-views/statistics-view/statistics-progress-bar';

import { StatisticsComplexBreakdownComponent } from './statistics-complex-breakdown.component';

// Mock components
@Component({
    selector: 'awg-statistics-progress-bar',
    template: '',
})
class StatisticsProgressBarStubComponent {
    config = input.required<StatisticsProgressBarConfig>();
    headerLabel = input<string>();
    height = input<string>('15px');
    minWidth = input<string>('120px');
    showPercentageLabel = input<boolean>(true);
    boldPercentageLabel = input<boolean>(false);
    customClasses = input<string>('');
    useCustomClassesOnly = input<boolean>(false);
}

describe('StatisticsComplexBreakdownComponent', () => {
    let component: StatisticsComplexBreakdownComponent;
    let fixture: ComponentFixture<StatisticsComplexBreakdownComponent>;
    let compDe: DebugElement;

    let expectedAvailableComplexBreakdown: StatisticsComplexBreakdown;
    let expectedComplexBreakdown: StatisticsComplexBreakdown;
    let expectedTotalComplexes: number;
    let expectedComplexBreakdownItems: StatisticsProgressBarItem[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsComplexBreakdownComponent],
        })
            .overrideComponent(StatisticsComplexBreakdownComponent, {
                remove: { imports: [StatisticsProgressBarComponent] },
                add: { imports: [StatisticsProgressBarStubComponent] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(StatisticsComplexBreakdownComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedAvailableComplexBreakdown = new StatisticsComplexBreakdown({
            opus: 4,
            mnr: 2,
            mnrX: 2,
        });
        expectedComplexBreakdown = new StatisticsComplexBreakdown({
            opus: 8,
            mnr: 4,
            mnrX: 4,
        });
        expectedTotalComplexes = 16;

        expectedComplexBreakdownItems = [
            { key: 'opus', baseLabel: 'Opus', colorClass: 'bg-primary' },
            { key: 'mnr', baseLabel: 'M-number', colorClass: 'bg-secondary' },
            { key: 'mnrX', baseLabel: 'M*-number', colorClass: 'bg-info' },
        ];

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput(
            'availableComplexBreakdown',
            new StatisticsComplexBreakdown({ opus: 0, mnr: 0, mnrX: 0 })
        );
        fixture.componentRef.setInput('complexBreakdown', new StatisticsComplexBreakdown({ opus: 0, mnr: 0, mnrX: 0 }));
        fixture.componentRef.setInput('totalComplexes', 0);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `availableComplexBreakdown`', () => {
            expectToEqual(
                component.availableComplexBreakdown(),
                new StatisticsComplexBreakdown({ opus: 0, mnr: 0, mnrX: 0 })
            );
        });

        it('... should have required `complexBreakdown`', () => {
            expectToEqual(component.complexBreakdown(), new StatisticsComplexBreakdown({ opus: 0, mnr: 0, mnrX: 0 }));
        });

        it('... should have required `totalComplexes`', () => {
            expectToEqual(component.totalComplexes(), 0);
        });

        it('... should have `complexBreakdownItems`', () => {
            expectToEqual(component.complexBreakdownItems, expectedComplexBreakdownItems);
        });

        describe('VIEW', () => {
            it('... should contain one row div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
            });

            it('... should contain two column divs in row div', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                getAndExpectDebugElementByCss(rowDes[0], 'div.col-md-6', 2, 2);
            });

            it('... should contain one distribution card in first div', () => {
                const colDes = getAndExpectDebugElementByCss(compDe, 'div.col-md-6', 2, 2);
                getAndExpectDebugElementByCss(colDes[0], 'div.awg-statisctics-distribution-card', 1, 1);
            });

            it('... should contain one available card in second div', () => {
                const colDes = getAndExpectDebugElementByCss(compDe, 'div.col-md-6', 2, 2);
                getAndExpectDebugElementByCss(colDes[1], 'div.awg-statistics-available-card', 1, 1);
            });

            describe('... distribution card', () => {
                it('... should have correct classes on distribution card div', () => {
                    const distCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statisctics-distribution-card',
                        1,
                        1
                    );
                    const distCardEl: HTMLDivElement = distCardDes[0].nativeElement;

                    expectToBe(distCardEl.classList.length, 4);
                    expectToContain(distCardEl.classList, 'awg-statistics-card');
                    expectToContain(distCardEl.classList, 'awg-statisctics-distribution-card');
                    expectToContain(distCardEl.classList, 'card');
                    expectToContain(distCardEl.classList, 'h-100');
                });

                it('... should contain one card header div', () => {
                    const distCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statisctics-distribution-card',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(distCardDes[0], 'div.card-header', 1, 1);
                });

                it('... should contain h4 title element in card header', () => {
                    const distCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statisctics-distribution-card',
                        1,
                        1
                    );
                    const distCardHeaderDes = getAndExpectDebugElementByCss(distCardDes[0], 'div.card-header', 1, 1);
                    getAndExpectDebugElementByCss(distCardHeaderDes[0], 'h4.card-title', 1, 1);
                });

                it('... should contain correct title in card header', () => {
                    const distCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statisctics-distribution-card',
                        1,
                        1
                    );
                    const distCardHeaderDes = getAndExpectDebugElementByCss(distCardDes[0], 'div.card-header', 1, 1);

                    const hDes = getAndExpectDebugElementByCss(distCardHeaderDes[0], 'h4.card-title', 1, 1);
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                    expectToEqual(hEl.textContent?.trim(), 'Complex Types Distribution');
                });

                it('... should contain one card body', () => {
                    const distCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statisctics-distribution-card',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(distCardDes[0], 'div.card-body', 1, 1);
                });

                it('... should contain no div with progress bar components in card body yet', () => {
                    const distCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statisctics-distribution-card',
                        1,
                        1
                    );
                    const distCardBodyDes = getAndExpectDebugElementByCss(distCardDes[0], 'div.card-body', 1, 1);

                    getAndExpectDebugElementByCss(distCardBodyDes[0], 'div', 0, 0);
                    getAndExpectDebugElementByDirective(distCardBodyDes[0], StatisticsProgressBarStubComponent, 0, 0);
                });
            });

            describe('... available card', () => {
                it('... should have correct classes on available card div', () => {
                    const availCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statistics-available-card',
                        1,
                        1
                    );
                    const availCardEl: HTMLDivElement = availCardDes[0].nativeElement;

                    expectToBe(availCardEl.classList.length, 4);
                    expectToContain(availCardEl.classList, 'awg-statistics-card');
                    expectToContain(availCardEl.classList, 'awg-statistics-available-card');
                    expectToContain(availCardEl.classList, 'card');
                    expectToContain(availCardEl.classList, 'h-100');
                });

                it('... should contain one card header div', () => {
                    const availCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statistics-available-card',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(availCardDes[0], 'div.card-header', 1, 1);
                });

                it('... should contain h4 title element in card header', () => {
                    const availCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statistics-available-card',
                        1,
                        1
                    );
                    const availCardHeaderDes = getAndExpectDebugElementByCss(availCardDes[0], 'div.card-header', 1, 1);
                    getAndExpectDebugElementByCss(availCardHeaderDes[0], 'h4.card-title', 1, 1);
                });

                it('... should contain correct title in card header', () => {
                    const availCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statistics-available-card',
                        1,
                        1
                    );
                    const availCardHeaderDes = getAndExpectDebugElementByCss(availCardDes[0], 'div.card-header', 1, 1);

                    const hDes = getAndExpectDebugElementByCss(availCardHeaderDes[0], 'h4.card-title', 1, 1);
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                    expectToEqual(hEl.textContent?.trim(), 'Available Complex Types');
                });

                it('... should contain one card body', () => {
                    const availCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statistics-available-card',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(availCardDes[0], 'div.card-body', 1, 1);
                });

                it('... should contain no div with progress bar components in card body yet', () => {
                    const availCardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-statistics-available-card',
                        1,
                        1
                    );
                    const availCardBodyDes = getAndExpectDebugElementByCss(availCardDes[0], 'div.card-body', 1, 1);

                    getAndExpectDebugElementByCss(availCardBodyDes[0], 'div', 0, 0);
                    getAndExpectDebugElementByDirective(availCardBodyDes[0], StatisticsProgressBarStubComponent, 0, 0);
                });
            });
        });

        describe('AFTER initial data binding', () => {
            beforeEach(() => {
                // Set input signals with test data
                fixture.componentRef.setInput('availableComplexBreakdown', expectedAvailableComplexBreakdown);
                fixture.componentRef.setInput('complexBreakdown', expectedComplexBreakdown);
                fixture.componentRef.setInput('totalComplexes', expectedTotalComplexes);

                fixture.detectChanges();
            });

            it('... should have updated `availableComplexBreakdown`', () => {
                expectToEqual(component.availableComplexBreakdown(), expectedAvailableComplexBreakdown);
            });

            it('... should have updated `complexBreakdown`', () => {
                expectToEqual(component.complexBreakdown(), expectedComplexBreakdown);
            });

            it('... should have updated `totalComplexes`', () => {
                expectToEqual(component.totalComplexes(), expectedTotalComplexes);
            });

            it('... should have `complexBreakdownItems` unchanged', () => {
                expectToEqual(component.complexBreakdownItems, expectedComplexBreakdownItems);
            });

            describe('VIEW', () => {
                describe('... distribution card', () => {
                    it('... should contain 3 progress bar components in card body', () => {
                        const distCardBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statisctics-distribution-card > div.card-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            distCardBodyDes[0],
                            StatisticsProgressBarStubComponent,
                            3,
                            3
                        );
                    });

                    it('... should pass down corect inputs to progress bar components', () => {
                        const distCardBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statisctics-distribution-card > div.card-body',
                            1,
                            1
                        );
                        const progressBarDes = getAndExpectDebugElementByDirective(
                            distCardBodyDes[0],
                            StatisticsProgressBarStubComponent,
                            3,
                            3
                        );

                        progressBarDes.forEach((pbDe, index) => {
                            const progressBarCmp = pbDe.injector.get(StatisticsProgressBarStubComponent);
                            const expectedConfig: StatisticsProgressBarConfig = {
                                mode: 'absolute',
                                available: expectedComplexBreakdown[expectedComplexBreakdownItems[index].key],
                                total: expectedTotalComplexes,
                            };
                            const expectedLabel = expectedComplexBreakdownItems[index].baseLabel + ' Complexes';
                            const expectedClass = expectedComplexBreakdownItems[index].colorClass;

                            expectToEqual(progressBarCmp.config(), expectedConfig);
                            expectToBe(progressBarCmp.headerLabel(), expectedLabel);
                            expectToBe(progressBarCmp.showPercentageLabel(), false);
                            expectToBe(progressBarCmp.customClasses(), expectedClass);
                            expectToBe(progressBarCmp.useCustomClassesOnly(), true);
                        });
                    });
                });

                describe('... available card', () => {
                    it('... should contain 3 progress bar components in card body', () => {
                        const availCardBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statistics-available-card > div.card-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            availCardBodyDes[0],
                            StatisticsProgressBarStubComponent,
                            3,
                            3
                        );
                    });

                    it('... should pass down corect inputs to progress bar components', () => {
                        const availCardBodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-statistics-available-card > div.card-body',
                            1,
                            1
                        );
                        const progressBarDes = getAndExpectDebugElementByDirective(
                            availCardBodyDes[0],
                            StatisticsProgressBarStubComponent,
                            3,
                            3
                        );

                        progressBarDes.forEach((pbDe, index) => {
                            const progressBarCmp = pbDe.injector.get(StatisticsProgressBarStubComponent);
                            const expectedConfig: StatisticsProgressBarConfig = {
                                mode: 'ratio',
                                available: expectedAvailableComplexBreakdown[expectedComplexBreakdownItems[index].key],
                                total: expectedComplexBreakdown[expectedComplexBreakdownItems[index].key],
                            };
                            const expectedLabel =
                                'Available ' +
                                expectedComplexBreakdownItems[index].baseLabel +
                                (index === 0 ? '' : 's');

                            expectToEqual(progressBarCmp.config(), expectedConfig);
                            expectToBe(progressBarCmp.headerLabel(), expectedLabel);
                            expectToBe(progressBarCmp.showPercentageLabel(), false);
                        });
                    });
                });
            });

            describe('#getProgressBarConfig()', () => {
                it('... should have a method `getProgressBarConfig`', () => {
                    expect(component.getProgressBarConfig).toBeDefined();
                });

                it('... should return correct config for `ratio` mode', () => {
                    const key = 'mnr';
                    const expectedConfig: StatisticsProgressBarConfig = {
                        mode: 'ratio',
                        available: expectedAvailableComplexBreakdown[key],
                        total: expectedComplexBreakdown[key],
                    };

                    expectToEqual(component.getProgressBarConfig(key, 'ratio'), expectedConfig);
                });

                it('... should return correct config for `absolute` mode', () => {
                    const key = 'mnrX';
                    const expectedConfig: StatisticsProgressBarConfig = {
                        mode: 'absolute',
                        available: expectedComplexBreakdown[key],
                        total: expectedTotalComplexes,
                    };

                    expectToEqual(component.getProgressBarConfig(key, 'absolute'), expectedConfig);
                });
            });
        });
    });
});
