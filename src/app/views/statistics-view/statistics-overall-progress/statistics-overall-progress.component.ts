import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StatisticsProgressBarComponent } from '@awg-views/statistics-view/statistics-progress-bar';

/**
 * The StatisticsOverallProgress Component
 *
 * It displays the overall progress of the statistics view,
 * showing the progress rate and the number of active complexes out of the total complexes.
 */
@Component({
    selector: 'awg-statistics-overall-progress',
    templateUrl: './statistics-overall-progress.component.html',
    styleUrl: './statistics-overall-progress.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [StatisticsProgressBarComponent],
})
export class StatisticsOverallProgressComponent {
    /**
     * Input signal: progressRate.
     *
     * It holds the overall progress rate.
     */
    progressRate = input.required<number>();

    /**
     * Input signal: activeComplexes.
     *
     * It holds the number of active complexes.
     */
    activeComplexes = input.required<number>();

    /**
     * Input signal: totalComplexes.
     *
     * It holds the total number of complexes.
     */
    totalComplexes = input.required<number>();
}
