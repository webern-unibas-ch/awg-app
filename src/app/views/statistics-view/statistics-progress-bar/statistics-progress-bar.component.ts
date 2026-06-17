import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

import { StatisticsProgressBarConfig } from '../models/statistics.model';

/**
 * The StatisticsProgressBarComponent component.
 *
 * It displays a Bootstrap progress bar with customizable styling and percentage display.
 */
@Component({
    selector: 'awg-statistics-progress-bar',
    templateUrl: './statistics-progress-bar.component.html',
    styleUrls: ['./statistics-progress-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbProgressbar],
})
export class StatisticsProgressBarComponent {
    /**
     * Input signal: config.
     *
     * It holds the configuration for the progress bar,
     * including mode and relevant values.
     */
    config = input.required<StatisticsProgressBarConfig>();

    /**
     * Input signal: headerLabel.
     *
     * It holds an optional label to display above the progress bar.
     */
    headerLabel = input<string>();

    /**
     * Input signal: height.
     *
     * It holds the height of the progress bar (e.g., '15px', '20px').
     * @default '15px'
     */
    height = input<string>('15px');

    /**
     * Input signal: showPercentageLabel.
     *
     * It holds a flag whether to show the percentage label next to the bar.
     * @default true
     */
    showPercentageLabel = input<boolean>(true);

    /**
     * Input signal: boldPercentageLabel.
     *
     * It holds a flag whether to show the percentage label with bold styling (for series rows).
     * @default false
     */
    boldPercentageLabel = input<boolean>(false);

    /**
     * Input signal: customType.
     *
     * It holds a custom type to apply to the progress bar.
     * @default ''
     */
    customType = input<string>('');

    /**
     * Input signal: useCustomTypeOnly.
     *
     * It holds a flag whether to use only custom type and skip automatic color type logic.
     * @default false
     */
    useCustomTypeOnly = input<boolean>(false);

    /**
     * Computed signal: progressBarColorType.
     *
     * It returns the appropriate abstract color type for the progress bar based on percentage,
     * or an empty string if custom type should be used exclusively.
     */
    progressBarColorType = computed<'success' | 'warning' | 'danger' | 'light' | ''>(() => {
        if (this.useCustomTypeOnly()) {
            return '';
        }

        const percentage = this.progressBarWidth();

        if (percentage >= 80) {
            return 'success';
        } else if (percentage >= 50) {
            return 'warning';
        } else if (percentage > 0) {
            return 'danger';
        } else {
            return 'light';
        }
    });

    /**
     * Computed signal: progressBarWidth.
     *
     * Calculates the width for the progress bar based on the current mode and input values,
     * returning a percentage value for the width style.
     */
    progressBarWidth = computed(() => {
        const cfg = this.config();

        let width = 0;

        switch (cfg.mode) {
            case 'percentage':
                width = cfg.percentage ?? 0;
                break;
            case 'absolute':
            case 'ratio':
                if (cfg.total !== 0) {
                    width = Math.round((cfg.active / cfg.total) * 100);
                }
                break;
        }

        // Ensure width is between 0 and 100
        return Math.max(0, Math.min(100, width));
    });

    /**
     * Computed signal: progressHeaderValue.
     *
     * Calculates the header label value based on the current mode and input values,
     * showing either an absolute value or ratio as appropriate.
     */
    progressHeaderValue = computed(() => {
        const cfg = this.config();

        if (cfg.mode === 'percentage' || cfg.active === undefined) {
            return '';
        }

        return cfg.mode === 'ratio' ? `${cfg.active} / ${cfg.total}` : `${cfg.active}`;
    });
}
