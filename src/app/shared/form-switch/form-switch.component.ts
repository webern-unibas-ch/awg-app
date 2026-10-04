import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * The FormSwitch component.
 *
 * It contains a single Bootstrap form switch (checkbox)
 * with a projected label.
 */
@Component({
    selector: 'awg-form-switch',
    templateUrl: './form-switch.component.html',
    styleUrl: './form-switch.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class FormSwitchComponent {
    /**
     * Readonly input signal: inputId.
     *
     * It holds the id of the checkbox (referenced by its label).
     */
    readonly inputId = input.required<string>();

    /**
     * Readonly input signal: checked.
     *
     * It holds the checked state of the checkbox.
     */
    readonly checked = input.required<boolean>();

    /**
     * Readonly output signal: checkedChange.
     *
     * It emits the new checked state of the checkbox when the user changes it.
     */
    readonly checkedChange = output<boolean>();
}
