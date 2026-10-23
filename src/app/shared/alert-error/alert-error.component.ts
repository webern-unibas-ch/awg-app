import { TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { ERROR_UTILS } from '@awg-shared/utils/error-utils';

import { AlertError } from './alert-error.model';

/**
 * The AlertErrorComponent.
 *
 * It contains an error alert message.
 */
@Component({
    selector: 'awg-alert-error',
    templateUrl: './alert-error.component.html',
    styleUrl: './alert-error.component.scss',
    imports: [TitleCasePipe],
})
export class AlertErrorComponent {
    /**
     * Readonly input signal: errorObject.
     *
     * It holds the error object for the component.
     */
    readonly errorObject = input.required<AlertError>();

    /**
     * Readonly computed signal: errorMessage.
     *
     * It holds the message to display for the error of the error object.
     */
    readonly errorMessage = computed(() => ERROR_UTILS.getErrorMessage(this.errorObject().error));
}
