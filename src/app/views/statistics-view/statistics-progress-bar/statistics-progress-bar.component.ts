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
     * Readonly input signal: config.
     *
     * It holds the configuration for the progress bar,
     * including mode and relevant values.
     */
    readonly config = input.required<StatisticsProgressBarConfig>();

    /**
     * Readonly input signal: headerLabel.
     *
     * It holds an optional label to display above the progress bar.
     */
    readonly headerLabel = input<string>();

    /**
     * Readonly input signal: height.
     *
     * It holds the height of the progress bar (e.g., '15px', '20px').
     * @default '15px'
     */
    readonly height = input<string>('15px');

    /**
     * Readonly input signal: showPercentageLabel.
     *
     * It holds a flag whether to show the percentage label next to the bar.
     * @default true
     */
    readonly showPercentageLabel = input<boolean>(true);

    /**
     * Readonly input signal: boldPercentageLabel.
     *
     * It holds a flag whether to show the percentage label with bold styling (for series rows).
     * @default false
     */
    readonly boldPercentageLabel = input<boolean>(false);

    /**
     * Readonly input signal: customType.
     *
     * It holds a custom type to apply to the progress bar.
     * @default ''
     */
    readonly customType = input<string>('');

    /**
     * Input signal: useCustomTypeOnly.
     *
     * It holds a flag whether to use only custom type and skip automatic color type logic.
     * @default false
     */
    readonly useCustomTypeOnly = input<boolean>(false);

    /**
     * Readonly computed signal: progressBarColorType.
     *
     * It returns the final color type for the progress bar,
     * factoring in the percentage logic or the custom type override.
     */
    readonly progressBarColorType = computed<string>(() => {
        if (this.useCustomTypeOnly()) {
            return this.customType() || 'light';
        }

        const percentage = this.progressBarWidth();

        if (percentage >= 80) {
            return 'success';
        }
        if (percentage >= 50) {
            return 'warning';
        }
        if (percentage > 0) {
            return 'danger';
        }

        return 'light';
    });

    /**
     * Readonly computed signal: progressBarWidth.
     *
     * Calculates the width for the progress bar based on the current mode and input values,
     * returning a percentage value for the width style.
     */
    readonly progressBarWidth = computed(() => {
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
     * Readonly computed signal: progressHeaderValue.
     *
     * Calculates the header label value based on the current mode and input values,
     * showing either an absolute value or ratio as appropriate.
     */
    readonly progressHeaderValue = computed(() => {
        const cfg = this.config();

        if (cfg.mode === 'percentage' || cfg.active === undefined) {
            return '';
        }

        return cfg.mode === 'ratio' ? `${cfg.active} / ${cfg.total}` : `${cfg.active}`;
    });

    /**
     * Readonly computed signal: hasHeaderValue.
     *
     * It returns a boolean indicating whether the progress header value is non-empty.
     */
    readonly hasHeaderValue = computed(() => this.progressHeaderValue() !== '');
}
