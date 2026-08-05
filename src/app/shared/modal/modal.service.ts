import { Injectable, signal } from '@angular/core';

/**
 * The ModalService.
 *
 * It provides methods to open and close the modal with a given modal snippet id.
 */
@Injectable({
    providedIn: 'root',
})
export class ModalService {
    /**
     * Private readonly signal: _selectedModalId.
     *
     * It holds the id of the currently selected modal snippet.
     */
    private readonly _selectedModalId = signal<string | null>(null);

    /**
     * Public readonly signal: openModalId.
     *
     * It exposes the id of the currently selected modal snippet as a readonly signal.
     */
    readonly selectedModalId = this._selectedModalId.asReadonly();

    /**
     * Public method: updateModalId.
     *
     * It updates the selected modal snippet id or resets it to null.
     *
     * @param {string | null} id The given modal snippet id or null to reset.
     * @returns {void} Updates the signal.
     */
    updateModalId(id: string | null): void {
        this._selectedModalId.set(id);
    }
}
