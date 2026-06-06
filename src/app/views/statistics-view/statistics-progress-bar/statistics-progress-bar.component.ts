import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

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
    standalone: false,
})
export class StatisticsProgressBarComponent {
    /**
     * Input signal: percentage.
     *
     * Holds the percentage value for the progress bar (0-100).
     * @default 0
     */
    percentage = input<number>(0);

    /**
     * Input signal: height.
     *
     * Holds the height of the progress bar (e.g., '15px', '20px').
     * @default '15px'
     */
    height = input<string>('15px');

    /**
     * Input signal: minWidth.
     *
     * Holds the minimum width of the progress bar for responsive behavior.
     * @default '120px'
     */
    minWidth = input<string>('120px');

    /**
     * Input signal: showPercentageLabel.
     *
     * Holds a flag whether to show the percentage label next to the bar.
     * @default true
     */
    showPercentageLabel = input<boolean>(true);

    /**
     * Input signal: boldPercentageLabel.
     *
     * Holds a flag whether to show the percentage label with bold styling (for series rows).
     * @default false
     */
    boldPercentageLabel = input<boolean>(false);

    /**
     * Input signal: customClasses.
     *
     * Holds additional CSS classes to apply to the progress bar.
     * @default ''
     */
    customClasses = input<string>('');

    /**
     * Input signal: useCustomClassesOnly.
     *
     * Holds a flag whether to use only custom classes and skip automatic class logic.
     * @default false
     */
    useCustomClassesOnly = input<boolean>(false);

    /**
     * Computed signal: progressBarColorType.
     *
     * Returns the appropriate abstract color type for the progress bar based on percentage,
     * or an empty string if custom classes should be used exclusively.
     */
    progressBarColorType = computed<'success' | 'warning' | 'danger' | ''>(() => {
        if (this.useCustomClassesOnly()) {
            return '';
        }

        const percentage = this.percentage();

        if (percentage >= 80) {
            return 'success';
        } else if (percentage >= 50) {
            return 'warning';
        } else {
            return 'danger';
        }
    });
}
