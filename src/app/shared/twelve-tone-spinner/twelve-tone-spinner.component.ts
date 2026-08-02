import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
     * Readonly input signal: spinnerText.
     *
     * It holds the text that is displayed inside the spinner.
     */
    readonly spinnerText = input<string>('loading');

    /**
     * Readonly variable: spinnerNotes.
     *
     * It contains the twelve notes of the spinner.
     */
    readonly spinnerNotes = Array.from({ length: 12 }, (_, i) => i);
}
