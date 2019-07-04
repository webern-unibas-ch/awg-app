import { Component, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Object constant with a set of modal texts.
 *
 * It provides the text snippets to be used in a modal.
 *
 * Available snippet keys: `sourceNotA`, `sheetComingSoon`, `editionComingSoon`, `M198`.
 */
const MODALCONTENTSNIPPETS = {
    sourceNotA:
        '<p>Die Beschreibung der weiteren Quellenbestandteile von <strong>A</strong> sowie der Quellen <strong>B</strong> bis <strong>G1</strong> einschließlich der darin gegebenenfalls enthaltenen Korrekturen erfolgt im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.</p>',
    sheetComingSoon:
        'Die edierten Notentexte von <strong>Aa:SkI/1</strong>, <strong>Ab:SkII/1</strong>, <strong>Ac:SkIII/1</strong> und <strong>Ac:SkIII/7</strong> sowie <strong>Ae:SkIV/1</strong> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.',
    editionComingSoon:
        '<p>Die Einleitungen, edierten Notentexte und Kritischen Berichte zu</p><ul class="none"><li>Werkedition der Druckfassung der <i>Vier Lieder</i> op. 12 <br/> Textedition von Nr. I „<i>Der Tag ist vergangen</i>“ (Fassung 1) <br/> Textedition von Nr. I „<i>Der Tag ist vergangen</i>“ (Fassung 2) <br/> Textedition von Nr. IV <i>Gleich und Gleich</i> (Fassung 1) </li></ul><p> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.</p>',
    M198:
        '<p>Das Fragment „<em>Schien mir’s als ich sah die Sonne</em>“ (M 198) für Chor und Orchester wird in AWG II/3 ediert.</p>'
};

/**
 * The Modal component.
 *
 * It contains a modal template that is
 * provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent {
    /**
     * ViewChild variable: modalTemplate.
     *
     * It keeps the reference to the HTML template.
     */
    @ViewChild('modalTemplate', { static: false })
    modalTemplate;

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
     * @param {NgbModal} modalService Instance of the NgbModal.
     */
    constructor(private modalService: NgbModal) {}

    /**
     * Private static method: getDismissReason.
     *
     * It gets the dismiss reason message
     * of the closing event of the modal.
     *
     * @param {*} reason The given reason.
     * @returns {string} The dismiss reason message.
     */
    private static getDismissReason(reason: any): string {
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
     * Snippet key must be an existing key of MODALCONTENTSNIPPETS.
     *
     * @param {string} modalContentSnippetKey The given snippet key.
     * @returns {void} Opens the modal.
     */
    open(modalContentSnippetKey: string): void {
        // get modal text
        this.modalContent = MODALCONTENTSNIPPETS[modalContentSnippetKey]
            ? MODALCONTENTSNIPPETS[modalContentSnippetKey]
            : '';

        // open modalTemplate via modalService
        this.modalService.open(this.modalTemplate, { ariaLabelledBy: 'awg-modal' }).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
            },
            reason => {
                this.closeResult = `Dismissed ${ModalComponent.getDismissReason(reason)}`;
            }
        );
    }
}
