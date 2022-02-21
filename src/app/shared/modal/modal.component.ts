import { Component, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Object constant with a set of modal texts.
 *
 * It provides the text snippets to be used in a modal.
 *
 * Available snippet keys:
 *          `OP12_SOURCE_NOT_A`,
 *          `OP12_SHEET_COMING_SOON`,
 *          `OP12_EDITION_COMING_SOON`,
 *          `OP25_SHEET_COMING_SOON`,
 *          `OP25_SOURCE_NOT_A`,
 *          `M198`,
 *          `HINT_EDITION_SHEETS`,
 *          `HINT_EDITION_GRAPH`.
 */
const MODALCONTENTSNIPPETS = {
    OP12_SOURCE_NOT_A:
        '<p>Die Beschreibung der weiteren Quellenbestandteile von <strong>A</strong> sowie der Quellen <strong>B</strong> bis <strong>G1</strong> einschließlich der darin gegebenenfalls enthaltenen Korrekturen erfolgt im Zusammenhang der vollständigen Edition der <em>Vier Lieder</em> op. 12 in AWG I/5.</p>',
    OP12_SHEET_COMING_SOON:
        'Die edierten Notentexte von <strong>Aa:SkI/1</strong>, <strong>Ab:SkII/1</strong>, <strong>Ac:SkIII/1</strong> und <strong>Ac:SkIII/7</strong> sowie <strong>Ae:SkIV/1</strong> erscheinen im Zusammenhang der vollständigen Edition der <em>Vier Lieder</em> op. 12 in AWG I/5.',
    OP12_EDITION_COMING_SOON:
        '<p>Die Einleitungen, edierten Notentexte und Kritischen Berichte zu</p><ul class="nobullets"><li>Werkedition der Druckfassung der <em>Vier Lieder</em> op. 12 <br/> Textedition von Nr. I „<em>Der Tag ist vergangen</em>“ (Fassung 1) <br/> Textedition von Nr. I „<em>Der Tag ist vergangen</em>“ (Fassung 2) <br/> Textedition von Nr. IV <em>Gleich und Gleich</em> (Fassung 1) </li></ul><p> erscheinen im Zusammenhang der vollständigen Edition der <em>Vier Lieder</em> op. 12 in AWG I/5.</p>',
    OP25_SHEET_COMING_SOON:
        'Die edierten Notentexte weiterer Skizzen der <em>Drei Lieder nach Gedichten von Hildegard Jone</em> op. 25 erscheinen in Kürze (02/2022).',
    OP25_SOURCE_NOT_A:
        '<p>Die Beschreibung der Quellen <strong>B</strong> sowie <strong>D–E</strong> einschließlich der darin gegebenenfalls enthaltenen Korrekturen erfolgt im Zusammenhang der vollständigen Edition der <em>Drei Lieder nach Gedichten von Hildegard Jone</em> op. 25 in AWG I/5.</p>',
    M198: '<p>Das Fragment „<em>Schien mir’s als ich sah die Sonne</em>“ (M 198) für Chor und Orchester wird in AWG II/3 ediert.</p>',
    HINT_EDITION_SHEETS:
        '<p>\n' +
        '        <span class="bold">Hinweise zur Nutzung:</span> <br />\n' +
        '        Ausgewählte Skizzentranskriptionen lassen sich durch Klick auf einen markierten Bereich in der Konvolutansicht bzw. über die einzelnen Tabs unter <em>Edierter Notentext</em> aufrufen.<br />\n' +
        '        Einen Takt oder eine markierte Stelle innerhalb einer Skizzentranskription anklicken, um die entsprechenden textkritischen Anmerkungen anzuzeigen.<br />\n' +
        '        Die größeren Boxen im Notentext markieren die jeweiligen Anschlüsse unmittelbar benachbarter Skizzen und sind ebenfalls verknüpft.<br />\n' +
        '        <span class="text-danger">Diese Funktionalität ist noch nicht für alle Skizzenbestandteile vorhanden, wird aber sukzessive ergänzt.</span>\n' +
        '    </p>',
    HINT_EDITION_GRAPH:
        '<p>\n' +
        '        <span class="bold">Hinweise zur Nutzung:</span> <br />\n' +
        '        <em>RDF Triples</em>: Das Resource Description Framework (<em>RDF</em>) stellt grundlegende syntaktische und semantische Elemente zur Beschreibung digitaler Repräsentationen von Objekten (Ressourcen) zur Verfügung. Dabei folgt es einer dreigliedrigen Struktur der Form <em>&lt;SUBJEKT&gt; &lt;PRÄDIKAT&gt; &lt;OBJEKT&gt;</em>, die auch als <em>Triple</em> bezeichnet wird. Eine Menge solcher Triples kann als (gerichteter) Graph verstanden und visualisiert werden. Unter dem Punkt <em>RDF Triples</em> sind die für die vorliegende Graph-Visualisierung zugrundeliegenden RDF-Daten einsehbar und interaktiv lokal bearbeitbar. (Achtung: Änderungen werden von der AWG-APP nicht gespeichert und sollten bei Bedarf lokal gesichert werden.) Weiterführende Informationen zu RDF finden sich unter: <a href="https://www.w3.org/RDF/">https://www.w3.org/RDF/</a>.<br /><br />\n' +
        '        <em>SPARQL Abfrage</em>: Die SPARQL Protocol And RDF Query Language (<em>SPARQL</em>) stellt u.a. eine Abfragesprache für graph-basierte Datensätze bereit. Sie    ermöglicht komplexe Abfragen und Manipulationen von in RDF dargestellten und strukturierten Daten. Dabei wird nach dem Prinzip des <em>graph pattern matching</em> der RDF-Graph nach einer angefragten Triple-Folge durchsucht. Unter dem Punkt <em>SPARQL Abfrage</em> lassen sich die Suchanfragen interaktiv anpassen. Einige Beispielabfragen sind bereits in einem Auswahl-Dropdown-Menü vorformuliert. Weiterführende Informationen zu SPARQL finden sich unter: <a href="https://www.w3.org/TR/sparql11-query/">https://www.w3.org/TR/sparql11-query/</a>.<br /><br />\n' +
        '\n' +
        '        <em>Resultat</em>: Der durch die <em>SPARQL Abfrage</em> über die <em>RDF Triples</em> zurückgelieferte Datensatz wird unter dem Punkt <em>Resultat</em> als dynamisches Graph-Netzwerk aus bezeichneten Knoten und Kanten mit Hilfe der JavaScript-Bibliothek <a href="https://d3js.org/">d3.js</a> visualisiert. Die Darstellung ist zoom- und verschiebbar, die Position einzelner Knoten lässt sich ebenfalls durch "Ziehen" mit der Maus verändern. Die Anzahl der angezeigten Triples lässt sich je nach Größe des Ergebnis-Datensatzes über ein Auswahl-Dropdown-Menü filtern; in der Voreinstellung findet eine Beschränkung auf 50 Triples statt.<br />\n' +
        '    </p>',
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
    styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
    /**
     * ViewChild variable: modalTemplate.
     *
     * It keeps the reference to the HTML template.
     */
    @ViewChild('modalTemplate')
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
     * Snippet key must be an existing key of MODALCONTENTSNIPPETS.
     *
     * @param {string} modalContentSnippetKey The given snippet key.
     * @returns {void} Opens the modal.
     */
    open(modalContentSnippetKey: string): void {
        // Get modal text
        this.modalContent = MODALCONTENTSNIPPETS[modalContentSnippetKey]
            ? MODALCONTENTSNIPPETS[modalContentSnippetKey]
            : '';

        // Open modalTemplate via modalService
        this.modalService.open(this.modalTemplate, { ariaLabelledBy: 'awg-modal' }).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
            },
            reason => {
                this.closeResult = `Dismissed ${ModalComponent._getDismissReason(reason)}`;
            }
        );
    }
}
