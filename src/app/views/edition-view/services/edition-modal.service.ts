import { inject, Injectable } from '@angular/core';

import { ModalService } from '@awg-shared/modal/modal.service';

import { EDITION_MODAL_SNIPPETS } from '../data/edition-modal-snippets.data';

/**
 * The EditionModal service.
 *
 * It is the modal facade of the edition view: it resolves the edition text snippets by key
 * and opens text and image modals via the {@link ModalService}.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionModalService {
    /**
     * Private readonly injection variable: _modalService.
     *
     * It keeps the instance of the injected ModalService.
     */
    private readonly _modalService = inject(ModalService);

    /**
     * Public method: openTextModal.
     *
     * It opens a text modal with the edition text snippet for the given key.
     * A missing key falls back to `CONTENTS_NOT_AVAILABLE`,
     * an unknown key results in an empty content.
     *
     * @param {string | null | undefined} snippetKey The key of the edition text snippet.
     * @returns {void} Opens the text modal.
     */
    openTextModal(snippetKey?: string | null): void {
        const id = snippetKey || 'CONTENTS_NOT_AVAILABLE';
        const isValidKey = Object.hasOwn(EDITION_MODAL_SNIPPETS, id);
        const content = isValidKey ? EDITION_MODAL_SNIPPETS[id as keyof typeof EDITION_MODAL_SNIPPETS] : '';

        this._modalService.openTextModal(id, content);
    }

    /**
     * Public method: openImageModal.
     *
     * It opens an image modal via the {@link ModalService}.
     *
     * @param {string} imgId The identifier for the image.
     * @param {string} imgSrc The image source URL.
     * @returns {void} Opens the image modal.
     */
    openImageModal(imgId: string, imgSrc: string): void {
        this._modalService.openImageModal(imgId, imgSrc);
    }
}
