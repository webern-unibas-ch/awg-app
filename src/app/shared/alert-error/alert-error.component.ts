import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AlertError } from './alert-error.model';

/**
 * The AlertErrorComponent.
 *
 * It contains an error alert message.
 */
@Component({
    selector: 'awg-alert-error',
    templateUrl: './alert-error.component.html',
    styleUrls: ['./alert-error.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
     * It holds the error if it is a string, otherwise the message of the error (empty if it has none).
     */
    readonly errorMessage = computed(() => {
        const { error } = this.errorObject();

        if (typeof error === 'string') {
            return error;
        }
        if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
            return error.message;
        }
        return '';
    });
}
