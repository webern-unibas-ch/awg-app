import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StatisticsProgressBarComponent } from '../statistics-progress-bar';

@Component({
    selector: 'awg-statistics-overall-progress-card',
    templateUrl: './statistics-overall-progress-card.component.html',
    styleUrl: './statistics-overall-progress-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [StatisticsProgressBarComponent],
})
export class StatisticsOverallProgressCardComponent {
    /**
     * Input signal: progressRate.
     *
     * It holds the overall progress rate.
     */
    progressRate = input.required<number>();

    /**
     * Input signal: availableComplexes.
     *
     * It holds the number of available complexes.
     */
    availableComplexes = input.required<number>();

    /**
     * Input signal: totalComplexes.
     *
     * It holds the total number of complexes.
     */
    totalComplexes = input.required<number>();
}
