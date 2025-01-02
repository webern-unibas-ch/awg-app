import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The AlertErrorComponent.
 *
 * It contains an error alert message that is
 * provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-alert-error',
    templateUrl: './alert-error.component.html',
    styleUrl: './alert-error.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class AlertErrorComponent {
    /**
     * Input variable: errorObject.
     *
     * It keeps the error object for the component.
     */
    @Input()
    errorObject: any;
}
