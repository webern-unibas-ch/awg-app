import { Component, Input } from '@angular/core';

/**
 * The ErrorAlertComponent.
 *
 * It contains an error alert message that is
 * provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-error-alert',
    templateUrl: './error-alert.component.html',
    styleUrl: './error-alert.component.scss',
})
export class ErrorAlertComponent {
    /**
     * Input variable: errorObject.
     *
     * It keeps the error object for the component.
     */
    @Input()
    errorObject: any;
}
