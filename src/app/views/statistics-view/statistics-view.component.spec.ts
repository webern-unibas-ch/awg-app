import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';

import { EditionStatistics, StatisticsComplexBreakdown } from './models';
import { EditionStatisticsService } from './services';

import { StatisticsViewComponent } from './statistics-view.component';

// Mock components
@Component({
    selector: 'awg-statistics-progress-bar',
    template: '',
    standalone: false,
})
class StatisticsProgressBarStubComponent {
    config = input.required<number>();
    progressHeaderLabel = input<string>();
    height = input<string>('15px');
    minWidth = input<string>('120px');
    showPercentageLabel = input<boolean>(true);
    boldPercentageLabel = input<boolean>(false);
    customClasses = input<string>('');
    useCustomClassesOnly = input<boolean>(false);
}

@Component({
    selector: 'awg-statistics-summary-cards',
    template: '',
    standalone: false,
})
class StatisticsSummaryCardsStubComponent {
    activeSeries = input.required<number>();
    activeSections = input.required<number>();
    totalComplexes = input.required<number>();
    availableComplexes = input.required<number>();
}

@Component({
    selector: 'awg-statistics-breakdown-badge',
    template: '',
    standalone: false,
})
class StatisticsBreakdownBadgeStubComponent {
    breakdown = input<StatisticsComplexBreakdown>(new StatisticsComplexBreakdown());
    containerClasses = input<string>('small text-muted');
    showEmptyBadges = input<boolean>(false);
}

describe('StatisticsViewComponent', () => {
    let component: StatisticsViewComponent;
    let fixture: ComponentFixture<StatisticsViewComponent>;

    let mockEditionStatisticsService: Mocked<EditionStatisticsService>;

    beforeEach(async () => {
        // Create spy object for EditionStatisticsService
        const spy = {
            getStatisticsFromOutline: vi.fn(),
        };

        await TestBed.configureTestingModule({
            declarations: [
                StatisticsViewComponent,
                StatisticsBreakdownBadgeStubComponent,
                StatisticsSummaryCardsStubComponent,
                StatisticsProgressBarStubComponent,
            ],
            providers: [{ provide: EditionStatisticsService, useValue: spy }],
        }).compileComponents();

        mockEditionStatisticsService = TestBed.inject(EditionStatisticsService) as Mocked<EditionStatisticsService>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StatisticsViewComponent);
        component = fixture.componentInstance;

        // Mock return value for getStatisticsFromOutline
        mockEditionStatisticsService.getStatisticsFromOutline.mockReturnValue({
            totalSeries: 3,
            activeSeries: 2,
            totalSections: 15,
            activeSections: 5,
            totalComplexes: 100,
            availableComplexes: 75,
            progressRate: 75,
            seriesBreakdown: [
                {
                    series: '1',
                    sections: 2,
                    totalComplexes: 50,
                    availableComplexes: 40,
                    progressRate: 40, // (0 + 80) / 2 = 40%
                    sectionBreakdown: [
                        {
                            section: '1',
                            disabled: true,
                            totalComplexes: 0,
                            availableComplexes: 0,
                            progressRate: 0,
                            complexBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                            availableComplexBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                        },
                        {
                            section: '5',
                            disabled: false,
                            totalComplexes: 50,
                            availableComplexes: 40,
                            progressRate: 80,
                            complexBreakdown: { opus: 5, mnr: 30, mnrX: 15 },
                            availableComplexBreakdown: { opus: 4, mnr: 25, mnrX: 11 },
                        },
                    ],
                    complexBreakdown: { opus: 5, mnr: 30, mnrX: 15 },
                    availableComplexBreakdown: { opus: 4, mnr: 25, mnrX: 11 },
                },
            ],
            complexBreakdown: { opus: 20, mnr: 60, mnrX: 20 },
            availableComplexBreakdown: { opus: 15, mnr: 45, mnrX: 15 },
        } as EditionStatistics);

        fixture.detectChanges();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    /*
    Describe('#ngOnInit', () => {
        it('... should call calculateStatistics', () => {
            vi.spyOn(component, 'calculateStatistics');
            component.ngOnInit();
            expect(component.calculateStatistics).toHaveBeenCalled();
        });
    });

    describe('#calculateStatistics', () => {
        it('... should call EditionStatisticsService.calculateStatistics', () => {
            component.calculateStatistics();
            expect(mockEditionStatisticsService.calculateStatistics).toHaveBeenCalled();
        });

        it('... should set statistics property', () => {
            component.calculateStatistics();
            expect(component.statistics).toBeDefined();
            expectToBe(component.statistics.totalComplexes, 100);
            expectToBe(component.statistics.availableComplexes, 75);
        });

        it('... should call updateStatisticsCards', () => {
            vi.spyOn(component, 'updateStatisticsCards');
            component.calculateStatistics();
            expect(component.updateStatisticsCards).toHaveBeenCalled();
        });
    });

    describe('#updateStatisticsCards', () => {
        beforeEach(() => {
            component.statistics = {
                totalSeries: 3,
                activeSeries: 2,
                totalSections: 5,
                totalComplexes: 100,
                availableComplexes: 75,
                progressRate: 75,
                seriesBreakdown: [
                    {
                        series: '1',
                        sections: 2,
                        totalComplexes: 50,
                        availableComplexes: 40,
                        progressRate: 40, // (0 + 80) / 2 = 40%
                        sectionBreakdown: [
                            {
                                section: '1',
                                disabled: true,
                                totalComplexes: 0,
                                availableComplexes: 0,
                                progressRate: 0,
                                complexBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                                availableComplexBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                            },
                            {
                                section: '5',
                                disabled: false,
                                totalComplexes: 50,
                                availableComplexes: 40,
                                progressRate: 80,
                                complexBreakdown: { opus: 5, mnr: 30, mnrX: 15 },
                                availableComplexBreakdown: { opus: 4, mnr: 25, mnrX: 11 },
                            },
                        ],
                        complexBreakdown: { opus: 5, mnr: 30, mnrX: 15 },
                        availableComplexBreakdown: { opus: 4, mnr: 25, mnrX: 11 },
                    },
                ],
                complexBreakdown: { opus: 20, mnr: 60, mnrX: 20 },
                availableComplexBreakdown: { opus: 15, mnr: 45, mnrX: 15 },
            } as EditionStatistics;
        });

        it('... should populate statisticsSummaryCards array', () => {
            component.updateStatisticsCards();
            expect(component.statisticsSummaryCards).toBeDefined();
            expectToBe(component.statisticsSummaryCards.length, 4);
        });

        it('... should set correct card data', () => {
            component.updateStatisticsCards();

            const [seriesCard, sectionsCard, complexesCard, availableCard] = component.statisticsSummaryCards;

            expectToBe(seriesCard.title, 'Active Series');
            expectToBe(seriesCard.value, 2);
            expectToBe(seriesCard.icon, 'fas fa-list');
            expectToBe(seriesCard.bgClass, 'bg-primary');

            expectToBe(sectionsCard.title, 'Active Sections');
            expectToBe(sectionsCard.value, 5);
            expectToBe(sectionsCard.icon, 'fas fa-folder');
            expectToBe(sectionsCard.bgClass, 'bg-info');

            expectToBe(complexesCard.title, 'Total Complexes');
            expectToBe(complexesCard.value, 100);
            expectToBe(complexesCard.icon, 'fas fa-music');
            expectToBe(complexesCard.bgClass, 'bg-secondary');

            expectToBe(availableCard.title, 'Available Complexes');
            expectToBe(availableCard.value, 75);
            expectToBe(availableCard.icon, 'fas fa-check-circle');
            expectToBe(availableCard.bgClass, 'bg-success');
        });

        it('... should return early if statistics is not set', () => {
            component.statistics = null;

            component.updateStatisticsCards();

            expectToEqual(component.statisticsSummaryCards, []);
        });
    }); */
});
