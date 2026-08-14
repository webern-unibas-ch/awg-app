import { inject, Injectable, signal } from '@angular/core';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';

import { MODAL_TEXT_SNIPPETS } from './modal-text-snippets.data';
import { ModalComponent } from './modal.component';
import { ModalData } from './modal.model';

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
     * Private readonly injection variable: _ngbModal.
     *
     * It keeps the instance of the injected NgbModal.
     */
    private readonly _ngbModal = inject(NgbModal);

    /**
     * Readonly signal: closeResult.
     *
     * It holds the result of the modal close or dismiss action.
     */
    readonly closeResult = signal('');

    /**
     * Public method: openTextModal.
     *
     * It opens the modal component with a text snippet from MODAL_TEXT_SNIPPETS.
     *
     * @param {string | null | undefined}  snippetKey The key of the text snippet.
     * @returns {void} Opens the modal.
     */
    openTextModal(snippetKey?: string | null): void {
        const id = snippetKey || 'CONTENTS_NOT_AVAILABLE';
        const isValidKey = Object.hasOwn(MODAL_TEXT_SNIPPETS, id);
        const textSnippet = isValidKey ? MODAL_TEXT_SNIPPETS[id as keyof typeof MODAL_TEXT_SNIPPETS] : '';

        const modalData: ModalData = {
            type: 'text',
            id: id,
            title: 'Hinweis',
            content: textSnippet,
        };
        this._open(modalData);
    }

    /**
     * Public method: openImageModal.
     *
     * It opens the modal component with an image snippet.
     *
     * @param {string} imgId The identifier for the image.
     * @param {string} imgSrc The image source URL.
     * @returns {void} Opens the modal.
     */
    openImageModal(imgId: string, imgSrc: string): void {
        const modalData: ModalData = {
            type: 'image',
            id: imgId,
            title: `Abbildung: ${imgId}`,
            content: imgSrc,
        };

        this._open(modalData);
    }

    /**
     * Private method: _open.
     *
     * An internal helper method to open the ModalComponent via NgbModal
     * and supply it with the required ModalData input.
     *
     * @param {ModalData} modalData The data for the modal.
     * @returns {void} Opens the modal via NgBootstrap.
     */
    private _open(modalData: ModalData): void {
        const modalRef = this._ngbModal.open(ModalComponent, {
            size: 'xl',
            centered: true,
            ariaLabelledBy: 'awg-modal',
        });

        modalRef.componentInstance.modalData = modalData;

        modalRef.result.then(
            result => {
                this.closeResult.set(`Closed with: ${result}`);
            },
            reason => {
                this.closeResult.set(`Dismissed ${this._getDismissReason(reason)}`);
            }
        );
    }

    /**
     * Private method: _getDismissReason.
     *
     * It returns a string describing the reason for modal dismissal.
     *
     * @param {any} reason The reason for dismissal.
     * @returns {string} The dismissal reason as a string.
     */
    private _getDismissReason(reason: any): string {
        switch (reason) {
            case ModalDismissReasons.ESC:
                return 'by pressing ESC';
            case ModalDismissReasons.BACKDROP_CLICK:
                return 'by clicking on a backdrop';
            default:
                return `with: ${reason}`;
        }
    }
}
