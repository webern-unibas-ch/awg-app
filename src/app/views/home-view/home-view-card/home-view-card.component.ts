import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { ExternalLinkDirective } from '@awg-shared/external-link/external-link.directive';

import { HomeViewCard } from './home-view-card.model';

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
    imports: [FaIconComponent, ExternalLinkDirective, NgTemplateOutlet, RouterLink],
})
export class HomeViewCardComponent {
    /**
     * Readonly input signal: cardData.
     *
     * It holds the data for the home view card.
     */
    readonly cardData = input.required<HomeViewCard>();

    /**
     * Readonly variable: faArrowRight.
     *
     * It instantiates fontawesome's faArrowRight icon.
     */
    readonly faArrowRight = faArrowRight;
}
