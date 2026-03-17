import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The StatisticsCard interface.
 *
 * It represents the data structure for a statistics card.
 */
export interface StatisticsCardData {
    /**
     * The title of the statistics card.
     */
    title: string;

    /**
     * The value to display in the statistics card.
     */
    value: number | string;

    /**
     * The FontAwesome icon class for the card.
     */
    icon: string;

    /**
     * The Bootstrap background color class for the card.
     */
    bgClass: string;
}

/**
 * The StatisticsCard component.
 *
 * It displays a single statistics card with title, value, and icon.
 */
@Component({
    selector: 'awg-statistics-card',
    templateUrl: './statistics-card.component.html',
    styleUrls: ['./statistics-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class StatisticsCardComponent {
    /**
     * Input property: title.
     *
     * It keeps the title for the statistics card.
     */
    @Input() title: string;

    /**
     * Input property: value.
     *
     * It keeps the value to display in the statistics card.
     */
    @Input() value: number | string;

    /**
     * Input property: icon.
     *
     * It keeps the FontAwesome icon class for the card.
     */
    @Input() icon: string;

    /**
     * Input property: bgClass.
     *
     * It keeps the Bootstrap background color class for the card.
     */
    @Input() bgClass: string;
}
