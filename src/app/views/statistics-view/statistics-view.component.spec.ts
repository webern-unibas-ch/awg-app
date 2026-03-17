import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionStatisticsService } from './services';
import { StatisticsViewComponent } from './statistics-view.component';

describe('StatisticsViewComponent', () => {
    let component: StatisticsViewComponent;
    let fixture: ComponentFixture<StatisticsViewComponent>;

    let mockEditionStatisticsService: jasmine.SpyObj<EditionStatisticsService>;

    beforeEach(async () => {
        // Create spy object for EditionStatisticsService
        const spy = jasmine.createSpyObj('EditionStatisticsService', ['calculateStatistics']);

        await TestBed.configureTestingModule({
            declarations: [StatisticsViewComponent],
            providers: [{ provide: EditionStatisticsService, useValue: spy }],
        }).compileComponents();

        mockEditionStatisticsService = TestBed.inject(
            EditionStatisticsService
        ) as jasmine.SpyObj<EditionStatisticsService>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StatisticsViewComponent);
        component = fixture.componentInstance;

        // Mock return value for calculateStatistics
        mockEditionStatisticsService.calculateStatistics.and.returnValue({
            totalSeries: 3,
            activeSeries: 2,
            totalSections: 5,
            totalComplexes: 100,
            availableComplexes: 75,
            availabilityRate: 75,
            seriesBreakdown: [
                {
                    series: '1',
                    sections: 2,
                    complexes: 50,
                    available: 40,
                    availabilityRate: 40, // (0 + 80) / 2 = 40%
                    sectionBreakdown: [
                        {
                            section: '1',
                            disabled: true,
                            complexes: 0,
                            available: 0,
                            availabilityRate: 0,
                            complexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                            availableComplexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                        },
                        {
                            section: '5',
                            disabled: false,
                            complexes: 50,
                            available: 40,
                            availabilityRate: 80,
                            complexTypeBreakdown: { opus: 5, mnr: 30, mnrX: 15 },
                            availableComplexTypeBreakdown: { opus: 4, mnr: 25, mnrX: 11 },
                        },
                    ],
                    complexTypeBreakdown: { opus: 5, mnr: 30, mnrX: 15 },
                    availableComplexTypeBreakdown: { opus: 4, mnr: 25, mnrX: 11 },
                },
            ],
            complexTypeBreakdown: { opus: 20, mnr: 60, mnrX: 20 },
            availableComplexTypeBreakdown: { opus: 15, mnr: 45, mnrX: 15 },
        });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('#ngOnInit', () => {
        it('... should call calculateStatistics', () => {
            spyOn(component, 'calculateStatistics');
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
            expect(component.statistics.totalComplexes).toBe(100);
            expect(component.statistics.availableComplexes).toBe(75);
        });

        it('... should call updateStatisticsCards', () => {
            spyOn(component, 'updateStatisticsCards');
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
                availabilityRate: 75,
                seriesBreakdown: [
                    {
                        series: '1',
                        sections: 2,
                        complexes: 50,
                        available: 40,
                        availabilityRate: 40, // (0 + 80) / 2 = 40%
                        sectionBreakdown: [
                            {
                                section: '1',
                                disabled: true,
                                complexes: 0,
                                available: 0,
                                availabilityRate: 0,
                                complexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                                availableComplexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                            },
                            {
                                section: '5',
                                disabled: false,
                                complexes: 50,
                                available: 40,
                                availabilityRate: 80,
                                complexTypeBreakdown: { opus: 5, mnr: 30, mnrX: 15 },
                                availableComplexTypeBreakdown: { opus: 4, mnr: 25, mnrX: 11 },
                            },
                        ],
                        complexTypeBreakdown: { opus: 5, mnr: 30, mnrX: 15 },
                        availableComplexTypeBreakdown: { opus: 4, mnr: 25, mnrX: 11 },
                    },
                ],
                complexTypeBreakdown: { opus: 20, mnr: 60, mnrX: 20 },
                availableComplexTypeBreakdown: { opus: 15, mnr: 45, mnrX: 15 },
            };
        });

        it('... should populate statisticsCards array', () => {
            component.updateStatisticsCards();
            expect(component.statisticsCards).toBeDefined();
            expect(component.statisticsCards.length).toBe(4);
        });

        it('... should set correct card data', () => {
            component.updateStatisticsCards();

            const [seriesCard, sectionsCard, complexesCard, availableCard] = component.statisticsCards;

            expect(seriesCard.title).toBe('Active Series');
            expect(seriesCard.value).toBe(2);
            expect(seriesCard.icon).toBe('fas fa-list');
            expect(seriesCard.bgClass).toBe('bg-primary');

            expect(sectionsCard.title).toBe('Active Sections');
            expect(sectionsCard.value).toBe(5);
            expect(sectionsCard.icon).toBe('fas fa-folder');
            expect(sectionsCard.bgClass).toBe('bg-info');

            expect(complexesCard.title).toBe('Total Complexes');
            expect(complexesCard.value).toBe(100);
            expect(complexesCard.icon).toBe('fas fa-music');
            expect(complexesCard.bgClass).toBe('bg-secondary');

            expect(availableCard.title).toBe('Available Complexes');
            expect(availableCard.value).toBe(75);
            expect(availableCard.icon).toBe('fas fa-check-circle');
            expect(availableCard.bgClass).toBe('bg-success');
        });

        it('... should return early if statistics is not set', () => {
            component.statistics = null;
            component.updateStatisticsCards();
            expect(component.statisticsCards).toEqual([]);
        });
    });

    describe('#getProgressBarWidth', () => {
        it('... should calculate correct percentage', () => {
            expect(component.getProgressBarWidth(75, 100)).toBe(75);
            expect(component.getProgressBarWidth(50, 100)).toBe(50);
            expect(component.getProgressBarWidth(0, 100)).toBe(0);
        });

        it('... should return 0 for zero total', () => {
            expect(component.getProgressBarWidth(10, 0)).toBe(0);
        });
    });

    describe('#getProgressBarClass', () => {
        it('... should return correct Bootstrap class for different percentages', () => {
            expect(component.getProgressBarClass(90)).toBe('bg-success');
            expect(component.getProgressBarClass(80)).toBe('bg-success');
            expect(component.getProgressBarClass(70)).toBe('bg-warning');
            expect(component.getProgressBarClass(50)).toBe('bg-warning');
            expect(component.getProgressBarClass(30)).toBe('bg-danger');
            expect(component.getProgressBarClass(0)).toBe('bg-danger');
        });
    });
});
