import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StatisticsOverallProgressData } from '../models/statistics.model';
import { StatisticsProgressBarComponent } from '../statistics-progress-bar/statistics-progress-bar.component';

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
     * Readonly input signal: overallProgressData.
     *
     * It holds the overall progress data.
     */
    readonly overallProgressData = input.required<StatisticsOverallProgressData | null>();
}
