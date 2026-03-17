import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The StatisticsProgressBarComponent component.
 *
 * It displays a Bootstrap progress bar with customizable styling and percentage display.
 */
@Component({
    selector: 'awg-progress-bar',
    templateUrl: './statistics-progress-bar.component.html',
    styleUrls: ['./statistics-progress-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class StatisticsProgressBarComponent {
    /**
     * The percentage value for the progress bar (0-100).
     */
    @Input() percentage: number = 0;

    /**
     * Whether to show the percentage label next to the bar.
     */
    @Input() showLabel: boolean = true;

    /**
     * The height of the progress bar (e.g., '15px', '20px').
     */
    @Input() height: string = '15px';

    /**
     * The minimum width of the progress bar for responsive behavior.
     */
    @Input() minWidth: string = '120px';

    /**
     * Additional CSS classes to apply to the progress bar.
     */
    @Input() customClasses: string = '';

    /**
     * Whether to use only custom classes and skip automatic class logic.
     */
    @Input() useCustomClassesOnly: boolean = false;

    /**
     * Whether to show the label with bold styling (for series rows).
     */
    @Input() boldLabel: boolean = false;

    /**
     * Public method: getProgressBarClass.
     *
     * It returns the appropriate Bootstrap class for progress bar color based on percentage.
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
