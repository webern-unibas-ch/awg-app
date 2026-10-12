import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCalendarXmark } from '@fortawesome/free-solid-svg-icons';

import { NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap/popover';

/**
 * The DisclaimerWorkeditions component.
 *
 * It contains the disclaimer for work editions.
 */
@Component({
    selector: 'awg-edition-disclaimer-workeditions',
    templateUrl: './edition-disclaimer-workeditions.component.html',
    styleUrls: ['./edition-disclaimer-workeditions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent, NgbPopoverModule],
})
export class EditionDisclaimerWorkeditionsComponent {
    /**
     * Readonly variable: disclaimer.
     *
     * It keeps the disclaimer for work editions.
     */
    readonly DISCLAIMER =
        'Werkeditionen sind aus rechtlichen Gründen frühestens ab 2049 online verfügbar. Bis dahin konsultieren Sie bitte die entsprechende Printausgabe.';

    /**
     * Readonly variable: faCalendarXmark.
     *
     * It instantiates fontawesome's faCalendarXmark icon.
     */
    readonly faCalendarXmark = faCalendarXmark;

    /**
     * Readonly injection variable: config.
     *
     * It injects the NgbPopoverConfig service to configure the popover.
     */
    readonly config: NgbPopoverConfig = inject(NgbPopoverConfig);

    /**
     * Constructor of the EditionDisclaimerWorkeditionsComponent.
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
