import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { EDITION_MODAL_SNIPPETS } from '@awg-views/edition-view/data/edition-modal-snippets.data';
import { EditionModalService } from '@awg-views/edition-view/services/edition-modal.service';

/**
 * The UsageHints component.
 *
 * It contains the button to open the usage hints ("Hinweise zur Nutzung")
 * of an edition view in a text modal.
 */
@Component({
    selector: 'awg-usage-hints',
    templateUrl: './usage-hints.component.html',
    styleUrl: './usage-hints.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class UsageHintsComponent {
    /**
     * Private readonly injection variable: _editionModalService.
     *
     * It keeps the instance of the injected EditionModalService.
     */
    private readonly _editionModalService = inject(EditionModalService);

    /**
     * Readonly input signal: snippetKey.
     *
     * It holds the key of the edition text snippet with the usage hints.
     */
    readonly snippetKey = input.required<keyof typeof EDITION_MODAL_SNIPPETS>();

    /**
     * Public method: openUsageHints.
     *
     * It opens the usage hints in a text modal via the {@link EditionModalService}.
     *
     * @returns {void} Opens the text modal.
     */
    openUsageHints(): void {
        this._editionModalService.openTextModal(this.snippetKey());
    }
}
