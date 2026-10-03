import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { MODAL_TEXT_SNIPPETS } from '@awg-shared/modal/modal-text-snippets.data';
import { ModalService } from '@awg-shared/modal/modal.service';

/**
 * The ButtonUsageHints component.
 *
 * It contains the button to open the usage hints ("Hinweise zur Nutzung")
 * of a view in a text modal.
 */
@Component({
    selector: 'awg-button-usage-hints',
    templateUrl: './button-usage-hints.component.html',
    styleUrl: './button-usage-hints.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ButtonUsageHintsComponent {
    /**
     * Private readonly injection variable: _modalService.
     *
     * It keeps the instance of the injected ModalService.
     */
    private readonly _modalService = inject(ModalService);

    /**
     * Readonly input signal: snippetKey.
     *
     * It holds the key of the modal text snippet with the usage hints.
     */
    readonly snippetKey = input.required<keyof typeof MODAL_TEXT_SNIPPETS>();

    /**
     * Public method: openUsageHints.
     *
     * It opens the usage hints in a text modal via the {@link ModalService}.
     *
     * @returns {void} Opens the text modal.
     */
    openUsageHints(): void {
        this._modalService.openTextModal(this.snippetKey());
    }
}
