import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
    StatisticsComplexBreakdownData,
    StatisticsComplexType,
    StatisticsProgressBarConfig,
    StatisticsProgressBarItem,
} from '../models/statistics.model';
import { StatisticsProgressBarComponent } from '../statistics-progress-bar/statistics-progress-bar.component';

/**
 * The StatisticsComplexBreakdown Component
 *
 * It displays a breakdown of the complex statistics in the statistics view,
 * showing the distribution of complex types and
 * ratio of active complexes for each complex category.
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
     * Readonly input signal: complexBreakdownData.
     *
     * It holds the complex breakdown data.
     */
    readonly complexBreakdownData = input.required<StatisticsComplexBreakdownData | null>();

    /**
     * Public readonly variable: COMPLEX_BREAKDOWN_ITEMS.
     *
     * It defines the items for the complex breakdown progress bars.
     */
    readonly COMPLEX_BREAKDOWN_ITEMS: StatisticsProgressBarItem[] = [
        { key: 'opus', baseLabel: 'Opus', colorType: 'primary' },
        { key: 'mnr', baseLabel: 'M-number', colorType: 'secondary' },
        { key: 'mnrX', baseLabel: 'M*-number', colorType: 'info' },
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
        const data = this.complexBreakdownData();
        if (!data) {
            return { mode: 'absolute', active: 0, total: 0 };
        }

        if (mode === 'ratio') {
            return {
                mode: 'ratio',
                active: data.activeComplexBreakdown[key],
                total: data.complexBreakdown[key],
            };
        }

        return {
            mode: 'absolute',
            active: data.complexBreakdown[key],
            total: data.totalComplexes,
        };
    }
}
