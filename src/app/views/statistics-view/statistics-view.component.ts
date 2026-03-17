import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { EditionOutlineService } from '@awg-views/edition-view/services';
import { EditionStatistics } from '@awg-views/statistics-view/models';
import { EditionStatisticsService } from '@awg-views/statistics-view/services';

import { StatisticsCardData } from './statistics-card';

/**
 * The Statistics view component.
 *
 * It contains the statistics view section of the app
 * with a statistics page about the edition complexes.
 */
@Component({
    selector: 'awg-statistics-view',
    templateUrl: './statistics-view.component.html',
    styleUrls: ['./statistics-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class StatisticsViewComponent implements OnInit {
    /**
     * Public variable: statistics.
     *
     * It keeps the calculated statistics.
     */
    statistics: EditionStatistics;

    /**
     * Public variable: statisticsCards.
     *
     * It keeps the data for the statistics cards.
     */
    statisticsCards: StatisticsCardData[] = [];

    /**
     * Constructor of the StatisticsViewComponent.
     *
     * It declares a private EditionStatisticsService instance
     * to get the statistics data.
     *
     * @param {EditionStatisticsService} editionStatisticsService Instance of the EditionStatisticsService.
     */
    constructor(private editionStatisticsService: EditionStatisticsService) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.calculateStatistics();
    }

    /**
     * Public method: calculateStatistics.
     *
     * It calculates the statistics from the edition outline data.
     *
     * @returns {void} Calculates the statistics.
     */
    calculateStatistics(): void {
        const editionOutline = EditionOutlineService.getEditionOutline();
        this.statistics = this.editionStatisticsService.calculateStatistics(editionOutline);

        console.log('Calculated Statistics:', this.statistics); // Debug log
        this.updateStatisticsCards();
    }

    /**
     * Public method: updateStatisticsCards.
     *
     * It updates the statistics cards data based on the current statistics.
     *
     * @returns {void} Updates the statistics cards.
     */
    updateStatisticsCards(): void {
        if (!this.statistics) {
            return;
        }

        this.statisticsCards = [
            {
                title: 'Active Series',
                value: this.statistics.activeSeries,
                icon: 'fas fa-list',
                bgClass: 'bg-primary',
            },
            {
                title: 'Active Sections',
                value: this.statistics.totalSections,
                icon: 'fas fa-folder',
                bgClass: 'bg-info',
            },
            {
                title: 'Total Complexes',
                value: this.statistics.totalComplexes,
                icon: 'fas fa-music',
                bgClass: 'bg-secondary',
            },
            {
                title: 'Available Complexes',
                value: this.statistics.availableComplexes,
                icon: 'fas fa-check-circle',
                bgClass: 'bg-success',
            },
        ];
    }

    /**
     * Public method: getProgressBarWidth.
     *
     * It calculates the width for a progress bar based on available vs total.
     *
     * @param {number} available The number of available items.
     * @param {number} total The total number of items.
     *
     * @returns {number} The width percentage.
     */
    getProgressBarWidth(available: number, total: number): number {
        return total > 0 ? Math.round((available / total) * 100) : 0;
    }

    /**
     * Public method: getProgressBarClass.
     *
     * It returns the appropriate Bootstrap class for progress bar color.
     *
     * @param {number} percentage The percentage value.
     *
     * @returns {string} The Bootstrap class name.
     */
    getProgressBarClass(percentage: number): string {
        if (percentage >= 80) {
            return 'bg-success';
        } else if (percentage >= 50) {
            return 'bg-warning';
        } else {
            return 'bg-danger';
        }
    }
}
