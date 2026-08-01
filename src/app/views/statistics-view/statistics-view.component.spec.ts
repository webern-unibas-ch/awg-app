import { Component, DebugElement, input, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';

import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ScrollToTopButtonComponent } from '@awg-shared/scroll-to-top-button/scroll-to-top-button.component';
import { EditionOutlineSeries } from '@awg-views/edition-view/models/edition-outline.model';
import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';

import {
    Statistics,
    StatisticsComplexBreakdownData,
    StatisticsOverallProgressData,
    StatisticsSeriesBreakdown,
    StatisticsSummaryData,
} from './models/statistics.model';
import { StatisticsService } from './services/statistics.service';
import { StatisticsComplexBreakdownComponent } from './statistics-complex-breakdown/statistics-complex-breakdown.component';
import { StatisticsOverallProgressComponent } from './statistics-overall-progress/statistics-overall-progress.component';
import { StatisticsSeriesBreakdownComponent } from './statistics-series-breakdown/statistics-series-breakdown.component';
import { StatisticsSummaryComponent } from './statistics-summary/statistics-summary.component';

import { StatisticsViewComponent } from './statistics-view.component';

// Mock components
@Component({
    selector: 'awg-statistics-complex-breakdown',
    template: '',
})
class StatisticsComplexBreakdownStubComponent {
    complexBreakdownData = input.required<StatisticsComplexBreakdownData>();
}

@Component({
    selector: 'awg-statistics-series-breakdown',
    template: '',
})
class StatisticsSeriesBreakdownStubComponent {
    seriesBreakdownData = input.required<StatisticsSeriesBreakdown[]>();
}

@Component({
    selector: 'awg-statistics-overall-progress',
    template: '',
})
class StatisticsOverallProgressStubComponent {
    overallProgressData = input.required<StatisticsOverallProgressData>();
}

@Component({
    selector: 'awg-statistics-summary',
    template: '',
})
class StatisticsSummaryStubComponent {
    summaryData = input.required<StatisticsSummaryData>();
}

@Component({
    selector: 'awg-scroll-to-top-button',
    template: '',
})
class ScrollToTopButtonStubComponent {}

describe('StatisticsViewComponent', () => {
    let component: StatisticsViewComponent;
    let fixture: ComponentFixture<StatisticsViewComponent>;
    let compDe: DebugElement;

    let mockStatisticsService: Mocked<Partial<StatisticsService>>;

    let mockOutlineSignal: WritableSignal<EditionOutlineSeries[] | null>;
    let expectedStatisticsData: Statistics;

    let expectedComplexBreakdownData: StatisticsComplexBreakdownData;
    let expectedOverallProgressData: StatisticsOverallProgressData;
    let expectedSummaryData: StatisticsSummaryData;

    beforeEach(async () => {
        mockOutlineSignal = signal(null);

        mockStatisticsService = {
            getStatisticsFromOutline: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [StatisticsViewComponent],
            providers: [
                { provide: StatisticsService, useValue: mockStatisticsService },
                { provide: EditionOutlineService, useValue: { editionOutline: mockOutlineSignal.asReadonly() } },
            ],
        })
            .overrideComponent(StatisticsViewComponent, {
                remove: {
                    imports: [
                        StatisticsComplexBreakdownComponent,
                        StatisticsOverallProgressComponent,
                        StatisticsSeriesBreakdownComponent,
                        StatisticsSummaryComponent,
                        ScrollToTopButtonComponent,
                    ],
                },
                add: {
                    imports: [
                        StatisticsComplexBreakdownStubComponent,
                        StatisticsOverallProgressStubComponent,
                        StatisticsSeriesBreakdownStubComponent,
                        StatisticsSummaryStubComponent,
                        ScrollToTopButtonStubComponent,
                    ],
                },
            })
            .compileComponents();
    });

    beforeEach(() => {
        // Service spies
        mockStatisticsService.getStatisticsFromOutline.mockReturnValue(null);

        // Test data
        expectedStatisticsData = {
            totalSeries: 3,
            activeSeries: 2,
            totalSections: 15,
            activeSections: 5,
            totalComplexes: 100,
            activeComplexes: 75,
            progressRate: 75,
            seriesBreakdown: [
                {
                    series: 'I',
                    totalSections: 5,
                    activeSections: 2,
                    totalComplexes: 50,
                    activeComplexes: 40,
                    progressRate: 40,
                    sectionBreakdown: [
                        {
                            section: '1',
                            disabled: true,
                            totalComplexes: 0,
                            activeComplexes: 0,
                            progressRate: 0,
                            complexBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                            activeComplexBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                        },
                        {
                            section: '5',
                            disabled: false,
                            totalComplexes: 50,
                            activeComplexes: 40,
                            progressRate: 80,
                            complexBreakdown: { opus: 5, mnr: 30, mnrX: 15 },
                            activeComplexBreakdown: { opus: 4, mnr: 25, mnrX: 11 },
                        },
                    ],
                    complexBreakdown: { opus: 5, mnr: 30, mnrX: 15 },
                    activeComplexBreakdown: { opus: 4, mnr: 25, mnrX: 11 },
                },
            ],
            complexBreakdown: { opus: 20, mnr: 60, mnrX: 20 },
            activeComplexBreakdown: { opus: 15, mnr: 45, mnrX: 15 },
        } as Statistics;

        expectedComplexBreakdownData = {
            activeComplexBreakdown: expectedStatisticsData.activeComplexBreakdown,
            complexBreakdown: expectedStatisticsData.complexBreakdown,
            totalComplexes: expectedStatisticsData.totalComplexes,
        };

        expectedOverallProgressData = {
            progressRate: expectedStatisticsData.progressRate,
            activeComplexes: expectedStatisticsData.activeComplexes,
            totalComplexes: expectedStatisticsData.totalComplexes,
        };

        expectedSummaryData = {
            activeSeries: expectedStatisticsData.activeSeries,
            activeSections: expectedStatisticsData.activeSections,
            activeComplexes: expectedStatisticsData.activeComplexes,
            totalComplexes: expectedStatisticsData.totalComplexes,
        };

        // Create component fixture
        fixture = TestBed.createComponent(StatisticsViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have computed signal `statisticsData` to hold null', () => {
            expectToBe(isSignal(component.statisticsData), true);

            expectToEqual(component.statisticsData(), null);

            expectSpyCall(mockStatisticsService.getStatisticsFromOutline, 0);
        });

        it('... should have computed signal `complexBreakdownData` to hold null', () => {
            expectToBe(isSignal(component.complexBreakdownData), true);

            expectToBe(component.complexBreakdownData(), null);
        });
        it('... should have computed signal `overallProgressData` to hold null', () => {
            expectToBe(isSignal(component.overallProgressData), true);

            expectToBe(component.overallProgressData(), null);
        });
        it('... should have computed signal `summaryData` to hold null', () => {
            expectToBe(isSignal(component.summaryData), true);

            expectToBe(component.summaryData(), null);
        });

        describe('VIEW', () => {
            it('... should contain no outer div yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-view', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set input signals with test data
            mockOutlineSignal.set([{ series: { route: '1', short: 'I', full: 'Serie 1' }, sections: [] }]);
            mockStatisticsService.getStatisticsFromOutline.mockReturnValue(expectedStatisticsData);

            fixture.detectChanges();
        });

        it('... should have computed signal `statisticsData` to hold the provided data', () => {
            expectToEqual(component.statisticsData(), expectedStatisticsData);

            expectSpyCall(mockStatisticsService.getStatisticsFromOutline, 1, [
                [{ series: { route: '1', short: 'I', full: 'Serie 1' }, sections: [] }],
            ]);
        });

        it('... should have computed signal `complexBreakdownData` to hold the expected data', () => {
            const complexBreakdownData = component.complexBreakdownData();

            expectToEqual(complexBreakdownData, {
                activeComplexBreakdown: expectedStatisticsData.activeComplexBreakdown,
                complexBreakdown: expectedStatisticsData.complexBreakdown,
                totalComplexes: expectedStatisticsData.totalComplexes,
            });
        });

        it('... should have computed signal `overallProgressData` to hold the expected data', () => {
            const overallProgressData = component.overallProgressData();

            expectToEqual(overallProgressData, {
                progressRate: expectedStatisticsData.progressRate,
                activeComplexes: expectedStatisticsData.activeComplexes,
                totalComplexes: expectedStatisticsData.totalComplexes,
            });
        });

        it('... should have computed signal `summaryData` to hold the expected data', () => {
            const summaryData = component.summaryData();

            expectToEqual(summaryData, {
                activeSeries: expectedStatisticsData.activeSeries,
                activeSections: expectedStatisticsData.activeSections,
                activeComplexes: expectedStatisticsData.activeComplexes,
                totalComplexes: expectedStatisticsData.totalComplexes,
            });
        });

        describe('... if no outline is provided', () => {
            beforeEach(() => {
                mockStatisticsService.getStatisticsFromOutline.mockClear();
                mockOutlineSignal.set(null);

                fixture.detectChanges();
            });

            it('... should have re-computed signal `statisticsData` to hold null', () => {
                expectToEqual(component.statisticsData(), null);

                expectSpyCall(mockStatisticsService.getStatisticsFromOutline, 0);
            });

            it('... should have re-computed signal `complexBreakdownData` to hold null', () => {
                expectToBe(component.complexBreakdownData(), null);
            });

            it('... should have re-computed signal `overallProgressData` to hold null', () => {
                expectToBe(component.overallProgressData(), null);
            });

            it('... should have re-computed signal `summaryData` to hold null', () => {
                expectToBe(component.summaryData(), null);
            });
        });

        describe('VIEW', () => {
            const getStatisticsViewDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-view', 1, 1);
            const getStatisticsViewMainDes = () =>
                getAndExpectDebugElementByCss(getStatisticsViewDes()[0], 'div.row main', 1, 1);
            const getStatisticsViewHeaderDes = () =>
                getAndExpectDebugElementByCss(getStatisticsViewMainDes()[0], 'header.awg-statistics-view-header', 1, 1);

            it('... should contain one paragraph info about about missing data if statisticsData is null', () => {
                mockOutlineSignal.set(null);
                fixture.detectChanges();

                const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent.trim(), 'No statistics data available.');
            });

            it('... should contain one outer div if statisticsData is available', () => {
                getStatisticsViewDes();
            });

            it('... should contain one ScrollToTop component (stubbed) in `div.awg-statistics-view`', () => {
                getAndExpectDebugElementByDirective(getStatisticsViewDes()[0], ScrollToTopButtonStubComponent, 1, 1);
            });

            it('... should contain a container and row div in outer div', () => {
                const containerDes = getAndExpectDebugElementByCss(
                    getStatisticsViewDes()[0],
                    'div.container-fluid',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(containerDes[0], 'div.row', 1, 1);
            });

            it('... should contain one main element in row div', () => {
                const rowDes = getAndExpectDebugElementByCss(getStatisticsViewDes()[0], 'div.row', 1, 1);

                getAndExpectDebugElementByCss(rowDes[0], 'main', 1, 1);
            });

            it('... should contain one header in main element', () => {
                getStatisticsViewHeaderDes();
            });

            it('... should contain one h2 in header', () => {
                getAndExpectDebugElementByCss(getStatisticsViewHeaderDes()[0], 'h2', 1, 1);
            });

            it('... should display correct header in header', () => {
                const hDes = getAndExpectDebugElementByCss(getStatisticsViewHeaderDes()[0], 'h2', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent.trim(), 'Statistics');
            });

            it('... should contain one lead p in header', () => {
                getAndExpectDebugElementByCss(getStatisticsViewHeaderDes()[0], 'p.lead', 1, 1);
            });

            it('... should display correct lead text (muted) in header', () => {
                const pDes = getAndExpectDebugElementByCss(getStatisticsViewHeaderDes()[0], 'p.lead', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToContain(pEl.classList, 'text-muted');
                expectToBe(
                    pEl.textContent.trim(),
                    'Overview of key metrics in the online edition of the Anton Webern Gesamtausgabe'
                );
            });

            it('... should contain one statistics summary component (stubbed) in main element', () => {
                getAndExpectDebugElementByDirective(
                    getStatisticsViewMainDes()[0],
                    StatisticsSummaryStubComponent,
                    1,
                    1
                );
            });

            it('... should pass down correct summaryData to statistics summary component', () => {
                const summaryDes = getAndExpectDebugElementByDirective(
                    getStatisticsViewMainDes()[0],
                    StatisticsSummaryStubComponent,
                    1,
                    1
                );
                const summaryCmp = summaryDes[0].injector.get(StatisticsSummaryStubComponent);

                expectToEqual(summaryCmp.summaryData(), expectedSummaryData);
            });

            it('... should contain one statistics overall progress component (stubbed) in main element', () => {
                getAndExpectDebugElementByDirective(
                    getStatisticsViewMainDes()[0],
                    StatisticsOverallProgressStubComponent,
                    1,
                    1
                );
            });

            it('... should pass down correct overallProgressData to statistics overall progress component', () => {
                const overallProgressDes = getAndExpectDebugElementByDirective(
                    getStatisticsViewMainDes()[0],
                    StatisticsOverallProgressStubComponent,
                    1,
                    1
                );
                const overallProgressCmp = overallProgressDes[0].injector.get(StatisticsOverallProgressStubComponent);

                expectToEqual(overallProgressCmp.overallProgressData(), expectedOverallProgressData);
            });

            it('... should contain one statistics complex breakdown component (stubbed) in main element', () => {
                getAndExpectDebugElementByDirective(
                    getStatisticsViewMainDes()[0],
                    StatisticsComplexBreakdownStubComponent,
                    1,
                    1
                );
            });

            it('... should pass down correct complexBreakdownData to statistics complex breakdown component', () => {
                const complexBreakdownDes = getAndExpectDebugElementByDirective(
                    getStatisticsViewMainDes()[0],
                    StatisticsComplexBreakdownStubComponent,
                    1,
                    1
                );
                const complexBreakdownCmp = complexBreakdownDes[0].injector.get(
                    StatisticsComplexBreakdownStubComponent
                );

                expectToEqual(complexBreakdownCmp.complexBreakdownData(), expectedComplexBreakdownData);
            });

            it('... should contain one statistics series breakdown component (stubbed) in main element', () => {
                getAndExpectDebugElementByDirective(
                    getStatisticsViewMainDes()[0],
                    StatisticsSeriesBreakdownStubComponent,
                    1,
                    1
                );
            });

            it('... should pass down correct seriesBreakdownData to statistics series breakdown component', () => {
                const seriesBreakdownDes = getAndExpectDebugElementByDirective(
                    getStatisticsViewMainDes()[0],
                    StatisticsSeriesBreakdownStubComponent,
                    1,
                    1
                );
                const seriesBreakdownCmp = seriesBreakdownDes[0].injector.get(StatisticsSeriesBreakdownStubComponent);

                expectToEqual(seriesBreakdownCmp.seriesBreakdownData(), expectedStatisticsData.seriesBreakdown);
            });
        });
    });
});
