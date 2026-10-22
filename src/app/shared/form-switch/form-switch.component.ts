import { Component, input, model } from '@angular/core';

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
     * Readonly model signal: checked.
     *
     * It holds the checked state of the checkbox.
     * Changes by the user are emitted via `checkedChange`.
     */
    readonly checked = model.required<boolean>();
}
