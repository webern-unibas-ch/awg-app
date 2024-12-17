import { Component } from '@angular/core';

import { faCalendarXmark } from '@fortawesome/free-solid-svg-icons';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

/**
 * The DisclaimerWorkeditions component.
 *
 * It contains the disclaimer for work editions.
 */
@Component({
    selector: 'awg-disclaimer-workeditions',
    templateUrl: './disclaimer-workeditions.component.html',
    styleUrls: ['./disclaimer-workeditions.component.scss'],
})
export class DisclaimerWorkeditionsComponent {
    /**
     * Public variable: disclaimer.
     *
     *
     * It keeps the disclaimer for work editions.
     */
    disclaimer =
        'Werkeditionen sind aus rechtlichen Gründen frühestens ab 2049 online verfügbar. Bis dahin konsultieren Sie bitte die entsprechende Printausgabe.';

    /**
     * Public variable: faCalendarXmark.
     *
     * It instantiates fontawesome's faCalendarXmark icon.
     */
    faCalendarXmark = faCalendarXmark;

    /**
     * Constructor of the DisclaimerWorkeditionsComponent.
     *
     * It declares an instance of the NgbPopoverConfig.
     *
     * @param {NgbPopoverConfig} config Instance of the NgbPopoverConfig.
     */
    constructor(public config: NgbPopoverConfig) {
        config.placement = 'top';
        config.container = 'body';
        config.triggers = 'mouseenter:mouseleave';
    }
}
