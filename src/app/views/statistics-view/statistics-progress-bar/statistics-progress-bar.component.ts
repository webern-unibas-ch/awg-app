import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatisticsProgressBarConfig } from '@awg-views/statistics-view/models';

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
     * Input signal: minWidth.
     *
     * It holds the minimum width of the progress bar for responsive behavior.
     * @default '120px'
     */
    minWidth = input<string>('120px');

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
     * Input signal: customClasses.
     *
     * It holds additional CSS classes to apply to the progress bar.
     * @default ''
     */
    customClasses = input<string>('');

    /**
     * Input signal: useCustomClassesOnly.
     *
     * It holds a flag whether to use only custom classes and skip automatic class logic.
     * @default false
     */
    useCustomClassesOnly = input<boolean>(false);

    /**
     * Computed signal: progressBarColorType.
     *
     * It returns the appropriate abstract color type for the progress bar based on percentage,
     * or an empty string if custom classes should be used exclusively.
     */
    progressBarColorType = computed<'success' | 'warning' | 'danger' | 'light' | ''>(() => {
        if (this.useCustomClassesOnly()) {
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

        switch (cfg.mode) {
            case 'percentage':
                return cfg.percentage ?? 0;
            case 'absolute':
            case 'ratio':
                if (cfg.total === 0) {
                    return 0;
                }
                return Math.round((cfg.available / cfg.total) * 100);
            default:
                return 0;
        }
    });

    /**
     * Computed signal: progressHeaderValue.
     *
     * Calculates the header label value based on the current mode and input values,
     * showing either an absolute value or ratio as appropriate.
     */
    progressHeaderValue = computed(() => {
        const cfg = this.config();

        if (cfg.mode === 'percentage' || cfg.available === undefined) {
            return '';
        }

        return cfg.mode === 'ratio' ? `${cfg.available} / ${cfg.total}` : `${cfg.available}`;
    });
}
