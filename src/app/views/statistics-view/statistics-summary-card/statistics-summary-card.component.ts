import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';

/**
 * The StatisticsSummaryCard component.
 *
 * It displays a single statistics summary card with title, value, and icon.
 */
@Component({
    selector: 'awg-statistics-summary-card',
    imports: [FontAwesomeModule],
    templateUrl: './statistics-summary-card.component.html',
    styleUrls: ['./statistics-summary-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
     * It keeps the FontAwesome icon class for the statsitics summary card.
     */
    icon = input<IconDefinition>();

    /**
     * Input signal: bgClass.
     *
     * It keeps the background color class for the statsitics summary card.
     */
    bgClass = input<string>();
}
