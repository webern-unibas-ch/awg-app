import { ChangeDetectionStrategy, Component, model } from '@angular/core';

/**
 * The ButtonExpandAll component.
 *
 * It contains the button to expand or collapse all details of the target.
 */
@Component({
    selector: 'awg-button-expand-all',
    templateUrl: './button-expand-all.component.html',
    styleUrl: './button-expand-all.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ButtonExpandAllComponent {
    /**
     * Model signal: isOpen.
     *
     * It holds the state of the button to expand or collapse all details.
     * @default false
     */
    isOpen = model<boolean>(false);

    /**
     * Public method: toggle.
     *
     * It toggles the state of the button.
     */
    toggle(): void {
        this.isOpen.update(v => !v);
    }
}
