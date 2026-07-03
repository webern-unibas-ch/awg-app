import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

/**
 * The AlertInfoComponent.
 *
 * It contains an info alert message.
 */
@Component({
    selector: 'awg-alert-info',
    templateUrl: './alert-info.component.html',
    styleUrls: ['./alert-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent, NgbAlert],
})
export class AlertInfoComponent {
    /**
     * Readonly input signal: infoMessage.
     *
     * It holds the info message for the alert.
     */
    readonly infoMessage = input.required<string>();

    /**
     * Model signal: isOpen.
     *
     * It holds the state of the alert (open or closed).
     * @default true
     */
    isOpen = model<boolean>(true);

    /**
     * Readonly variable: faCircleInfo.
     *
     * It instantiates fontawesome's faCircleInfo icon.
     */
    readonly faCircleInfo = faCircleInfo;
}
