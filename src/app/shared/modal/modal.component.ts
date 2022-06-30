import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MODAL_CONTENT_SNIPPETS } from './data/modal-content-snippets.data';

/**
 * The Modal component.
 *
 * It contains a modal template that is
 * provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
    /**
     * ViewChild variable: modalTemplate.
     *
     * It keeps the reference to the HTML template.
     */
    @ViewChild('modalTemplate')
    modalTemplate: TemplateRef<any>;

    /**
     * Public variable: modalTitle.
     *
     * It keeps the title of the modal
     * to be displayed in the header.
     */
    modalTitle = 'Hinweis';

    /**
     * Public variable: modalCloseLabel.
     *
     * It keeps the label for the
     * closing button of the modal
     * to be displayed in the footer.
     */
    modalCloseLabel = 'Schließen';

    /**
     * Public variable: modalContent.
     *
     * It keeps the content of the modal
     * to be displayed in the body.
     */
    modalContent: string;

    /**
     * Public variable: closeResult.
     *
     * It keeps a message after the
     * closing event of the modal.
     */
    closeResult: string;

    /**
     * Constructor of the ModalComponent.
     *
     * It declares a private NgbModal instance
     * to handle the modal.
     *
     * @param {NgbModal} ngbModal Instance of the NgbModal.
     */
    constructor(private ngbModal: NgbModal) {}

    /**
     * Private static method: _getDismissReason.
     *
     * It gets the dismiss reason message
     * of the closing event of the modal.
     *
     * @param {*} reason The given reason.
     * @returns {string} The dismiss reason message.
     */
    private static _getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    /**
     * Public method: open.
     *
     * It opens the modal with the text snippet
     * represented by the given snippet key.
     *
     * Snippet key must be an existing key of MODAL_CONTENT_SNIPPETS.
     *
     * @param {string} modalContentSnippetKey The given snippet key.
     *
     * @returns {void} Opens the modal.
     */
    open(modalContentSnippetKey: string): void {
        // Get modal text
        this.modalContent = MODAL_CONTENT_SNIPPETS[modalContentSnippetKey]
            ? MODAL_CONTENT_SNIPPETS[modalContentSnippetKey]
            : '';

        // Open modalTemplate via modalService
        this.ngbModal.open(this.modalTemplate, { ariaLabelledBy: 'awg-modal' }).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
            },
            reason => {
                this.closeResult = `Dismissed ${ModalComponent._getDismissReason(reason)}`;
            }
        );
    }
}
