import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/**
 * The StatisticsSummaryCard component.
 *
 * It displays a single statistics summary card with title, value, and icon.
 */
@Component({
    selector: 'awg-statistics-summary-card',
    templateUrl: './statistics-summary-card.component.html',
    styleUrls: ['./statistics-summary-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent],
})
export class StatisticsSummaryCardComponent {
    /**
     * Input signal: title.
     *
     * It keeps the title for a statistics summary card.
     */
    title = input<string>();

    /**
     * Input signal: value.
     *
     * It keeps the value to display in the statistics summary card.
     */
    value = input<number | string>();

    /**
     * Input signal: icon.
     *
     * It keeps the FontAwesome icon class for the statistics summary card.
     */
    icon = input<IconDefinition>();

    /**
     * Input signal: bgClass.
     *
     * It keeps the background color class for the statistics summary card.
     */
    bgClass = input<string>();
}
