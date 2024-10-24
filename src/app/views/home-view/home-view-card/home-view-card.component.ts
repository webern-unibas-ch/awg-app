import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { HomeViewCard } from '@awg-views/home-view/models';

/**
 * The HomeViewCard component.
 *
 * It contains the home card
 * for the home view of the app.
 */
@Component({
    selector: 'awg-home-view-card',
    templateUrl: './home-view-card.component.html',
    styleUrls: ['./home-view-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeViewCardComponent {
    /**
     * Input variable: cardData.
     *
     * It keeps the data for the home view card.
     */
    @Input() cardData: HomeViewCard;

    /**
     * Public variable: faArrowRight.
     *
     * It instantiates fontawesome's faArrowRight icon.
     */
    faArrowRight = faArrowRight;
}
