import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
    StatisticsComplexBreakdown,
    StatisticsComplexType,
    StatisticsProgressBarConfig,
    StatisticsProgressBarItem,
} from '@awg-views/statistics-view/models';
import { StatisticsProgressBarComponent } from '@awg-views/statistics-view/statistics-progress-bar';

/**
 * The StatisticsComplexBreakdown Component
 *
 * It displays a breakdown of the complex statistics in the statistics view,
 * showing the distribution of complex types and
 * ratio of available complexes for each complex category.
 */
@Component({
    selector: 'awg-statistics-complex-breakdown',
    templateUrl: './statistics-complex-breakdown.component.html',
    styleUrl: './statistics-complex-breakdown.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [StatisticsProgressBarComponent],
})
export class StatisticsComplexBreakdownComponent {
    /**
     * Input signal: availableComplexBreakdown.
     *
     * It holds the number of available complexes for the complex breakdown.
     */
    availableComplexBreakdown = input.required<StatisticsComplexBreakdown>();

    /**
     * Input signal: complexBreakdown.
     *
     * It holds the number of complexes for the complex breakdown.
     */
    complexBreakdown = input.required<StatisticsComplexBreakdown>();

    /**
     * Input signal: totalComplexes.
     *
     * It holds the total number of complexes.
     */
    totalComplexes = input.required<number>();

    /**
     * Public readonly variable: complexBreakdownItems.
     *
     * It defines the items for the complex breakdown progress bars.
     */
    readonly complexBreakdownItems: StatisticsProgressBarItem[] = [
        { key: 'opus', baseLabel: 'Opus', colorClass: 'bg-primary' },
        { key: 'mnr', baseLabel: 'M-number', colorClass: 'bg-secondary' },
        { key: 'mnrX', baseLabel: 'M*-number', colorClass: 'bg-info' },
    ];

    /**
     * Public method: getProgressBarConfig.
     *
     * It returns the config for the progress bar based on the provided key and mode.
     *
     * @param key The key corresponding to the complex type in the breakdown.
     * @param mode The mode for the progress bar, either 'ratio' or 'absolute'.
     *
     * @returns The config object for the progress bar.
     */
    getProgressBarConfig(key: StatisticsComplexType, mode: 'ratio' | 'absolute'): StatisticsProgressBarConfig {
        if (mode === 'ratio') {
            return {
                mode: 'ratio',
                available: this.availableComplexBreakdown()[key],
                total: this.complexBreakdown()[key],
            };
        }

        return {
            mode: 'absolute',
            available: this.complexBreakdown()[key],
            total: this.totalComplexes(),
        };
    }
}
