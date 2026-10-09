import { inject, Injectable, Injector, signal } from '@angular/core';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';

import { ModalComponent } from './modal.component';
import { MODAL_DATA, ModalData } from './modal.model';

/**
 * The ModalService.
 *
 * It provides methods to open and close the modal with a given text or image content.
 */
@Injectable({
    providedIn: 'root',
})
export class ModalService {
    /**
     * Private readonly injection variable: _injector.
     *
     * It keeps the instance of the injected Angular Injector.
     */
    private readonly _injector = inject(Injector);

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
     * It opens the modal component with the given text content.
     *
     * @param {string} id The identifier for the text.
     * @param {string} content The (HTML) text content.
     * @returns {void} Opens the modal.
     */
    openTextModal(id: string, content: string): void {
        const modalData: ModalData = {
            type: 'text',
            id: id,
            title: 'Hinweis',
            content: content,
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
     * and supply it with the given ModalData via the MODAL_DATA injection token.
     *
     * @param {ModalData} modalData The data for the modal.
     * @returns {void} Opens the modal via NgBootstrap.
     */
    private _open(modalData: ModalData): void {
        const modalRef = this._ngbModal.open(ModalComponent, {
            size: 'xl',
            centered: true,
            ariaLabelledBy: 'awg-modal-title',
            injector: Injector.create({
                providers: [{ provide: MODAL_DATA, useValue: modalData }],
                parent: this._injector,
            }),
        });

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
