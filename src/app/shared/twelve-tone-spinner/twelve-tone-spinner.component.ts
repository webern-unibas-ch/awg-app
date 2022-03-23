import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The TwelveToneSpinner component.
 *
 * It contains the loading spinner of the app
 * (an animated twelve tone cycle)
 * that is provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-twelve-tone-spinner',
    templateUrl: './twelve-tone-spinner.component.html',
    styleUrls: ['./twelve-tone-spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwelveToneSpinnerComponent {
    /**
     * Public variable: spinnerMessage.
     *
     * It contains the message to be displayed
     * while the spinner is active.
     */
    spinnerMessage = 'loading';
}
