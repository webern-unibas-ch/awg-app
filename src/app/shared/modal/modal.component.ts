import { Component, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Object constant with a set of modal texts.
 *
 * It provides the text snippets to be used in a modal.
 *
 * Available snippet keys:
 *          `op12_sourceNotA`,
 *          `op12_sheetComingSoon`,
 *          `op12_editionComingSoon`,
 *          `op25_sheetComingSoon`,
 *          `op25_sourceNotA`,
 *          `M198`,
 *          `hintEditionDetail`.
 */
const MODALCONTENTSNIPPETS = {
    op12_sourceNotA:
        '<p>Die Beschreibung der weiteren Quellenbestandteile von <strong>A</strong> sowie der Quellen <strong>B</strong> bis <strong>G1</strong> einschließlich der darin gegebenenfalls enthaltenen Korrekturen erfolgt im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.</p>',
    op12_sheetComingSoon:
        'Die edierten Notentexte von <strong>Aa:SkI/1</strong>, <strong>Ab:SkII/1</strong>, <strong>Ac:SkIII/1</strong> und <strong>Ac:SkIII/7</strong> sowie <strong>Ae:SkIV/1</strong> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.',
    op12_editionComingSoon:
        '<p>Die Einleitungen, edierten Notentexte und Kritischen Berichte zu</p><ul class="none"><li>Werkedition der Druckfassung der <i>Vier Lieder</i> op. 12 <br/> Textedition von Nr. I „<i>Der Tag ist vergangen</i>“ (Fassung 1) <br/> Textedition von Nr. I „<i>Der Tag ist vergangen</i>“ (Fassung 2) <br/> Textedition von Nr. IV <i>Gleich und Gleich</i> (Fassung 1) </li></ul><p> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.</p>',
    op25_sheetComingSoon:
        'Die edierten Notentexte weiterer Skizzen der <i>Drei Lieder nach Gedichten von Hildegard Jone</i> op. 25 erscheinen in Kürze (02/2020).',
    op25_sourceNotA:
        '<p>Die Beschreibung der Quellen <strong>B</strong> sowie <strong>D–E</strong> einschließlich der darin gegebenenfalls enthaltenen Korrekturen erfolgt im Zusammenhang der vollständigen Edition der <i>Drei Lieder nach Gedichten von Hildegard Jone</i> op. 25 in AWG I/5.</p>',
    M198:
        '<p>Das Fragment „<em>Schien mir’s als ich sah die Sonne</em>“ (M 198) für Chor und Orchester wird in AWG II/3 ediert.</p>',
    hintEditionDetail:
        '<p>\n' +
        '        <span class="bold">Hinweise zur Nutzung:</span> <br />\n' +
        '        Ausgewählte Skizzentranskriptionen lassen sich durch Klick auf einen markierten Bereich in der Konvolutansicht bzw. über die einzelnen Tabs unter <i>Edierter Notentext</i> aufrufen.<br />\n' +
        '        Einen Takt oder eine markierte Stelle innerhalb einer Skizzentranskription anklicken, um die entsprechenden textkritischen Anmerkungen anzuzeigen.<br />\n' +
        '        Die größeren Boxen im Notentext markieren die jeweiligen Anschlüsse unmittelbar benachbarter Skizzen und sind ebenfalls verknüpft.<br />\n' +
        '        <span class="text-danger">Diese Funktionalität ist noch nicht für alle Skizzenbestandteile vorhanden, wird aber sukzessive ergänzt.</span>\n' +
        '    </p>',
    hintEditionGraph:
        '<p>\n' +
        '        <span class="bold">Hinweise zur Nutzung:</span> <br />\n' +
        '        <i>RDF Triples</i>: Das Resource Description Framework (<i>RDF</i>) stellt grundlegende syntaktische und semantische Elemente zur Beschreibung digitaler Repräsentationen von Objekten (Ressourcen) zur Verfügung. Dabei folgt es einer dreigliedrigen Struktur der Form <i>&lt;SUBJEKT&gt; &lt;PRÄDIKAT&gt; &lt;OBJEKT&gt;</i>, die auch als <i>Triple</i> bezeichnet wird. Eine Menge solcher Triples kann als (gerichteter) Graph verstanden und visualisiert werden. Unter dem Punkt <i>RDF Triples</i> sind die für die vorliegende Graph-Visualisierung zugrundeliegenden RDF-Daten einsehbar und interaktiv lokal bearbeitbar. (Achtung: Änderungen werden von der AWG-APP nicht gespeichert und sollten bei Bedarf lokal gesichert werden.) Weiterführende Informationen zu RDF finden sich unter: <a href="https://www.w3.org/RDF/" target="_blank" rel="noopener noreferrer">https://www.w3.org/RDF/</a>.<br /><br />\n' +
        '        <i>SPARQL Abfrage</i>: Die SPARQL Protocol And RDF Query Language (<i>SPARQL</i>) stellt u.a. eine Abfragesprache für graph-basierte Datensätze bereit. Sie    ermöglicht komplexe Abfragen und Manipulationen von in RDF dargestellten und strukturierten Daten. Dabei wird nach dem Prinzip des <i>graph pattern matching</i> der RDF-Graph nach einer angefragten Triple-Folge durchsucht. Unter dem Punkt <i>SPARQL Abfrage</i> lassen sich die Suchanfragen interaktiv anpassen. Einige Beispielabfragen sind bereits in einem Auswahl-Dropdown-Menü vorformuliert. Weiterführende Informationen zu SPARQL finden sich unter: <a href="https://www.w3.org/TR/sparql11-query/" target="_blank" rel="noopener noreferrer">https://www.w3.org/TR/sparql11-query/</a>.<br /><br />\n' +
        '\n' +
        '        <i>Resultat</i>: Der durch die <i>SPARQL Abfrage</i> über die <i>RDF Triples</i> zurückgelieferte Datensatz wird unter dem Punkt <i>Resultat</i> als dynamisches Graph-Netzwerk aus bezeichneten Knoten und Kanten mit Hilfe der JavaScript-Bibliothek <a href="https://d3js.org/" target="_blank" rel="noopener noreferrer">d3.js</a> visualisiert. Die Darstellung ist zoom- und verschiebbar, die Position einzelner Knoten lässt sich ebenfalls durch "Ziehen" mit der Maus verändern. Die Anzahl der angezeigten Triples lässt sich je nach Größe des Ergebnis-Datensatzes über ein Auswahl-Dropdown-Menü filtern; in der Voreinstellung findet eine Beschränkung auf 50 Triples statt.<br />\n' +
        '    </p>'
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
