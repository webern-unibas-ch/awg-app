import { Component, inject } from '@angular/core';

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
    standalone: false,
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
     * Public injection variable: config.
     *
     * It injects the NgbPopoverConfig service to configure the popover.
     */
    config: NgbPopoverConfig = inject(NgbPopoverConfig);

    /**
     * Constructor of the DisclaimerWorkeditionsComponent.
     *
     * It initializes the popover configuration for the disclaimer.
     * The popover is placed at the top of the page, inside the body,
     * and is triggered by mouse enter and leave events.
     */
    constructor() {
        this.config.placement = 'top';
        this.config.container = 'body';
        this.config.triggers = 'mouseenter:mouseleave';
    }
}
