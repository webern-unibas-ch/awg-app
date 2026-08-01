import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
    readonly errorObject = input.required<any>();
}
