import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EDITION_GLYPHS_DATA } from '@awg-app/views/edition-view/data';

import { TextcriticalComment } from '@awg-views/edition-view/models';

/**
 * The EditionTkaTable component.
 *
 * It contains the table for the textcritical comments
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-tka-table',
    templateUrl: './edition-tka-table.component.html',
    styleUrls: ['./edition-tka-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionTkaTableComponent {
    /**
     * Input variable: textcriticalComments.
     *
     * It keeps the textcritical comments.
     */
    @Input()
    textcriticalComments: TextcriticalComment[];

    /**
     * Input variable: isRowTable.
     *
     * It keeps a boolean flag to indicate if the textcritics describe a row table.
     */
    @Input()
    isRowTable = false;

    /**
     * Output variable: openModalRequest.
     *
     * It keeps an event emitter to open the modal
     * with the selected modal text snippet.
     */
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Readonly variable: GLYPHS.
     *
     * It keeps the data for musical glyphs.
     */
    readonly GLYPHS = EDITION_GLYPHS_DATA;

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: EditionTkaTableComponent;

    /**
     * Public variable: tableHeaderStrings.
     *
     * It keeps different string collections for the table header.
     */
    tableHeaderStrings = {
        default: [
            { reference: 'measure', label: 'Takt' },
            { reference: 'system', label: 'System' },
            { reference: 'location', label: 'Ort im Takt' },
            { reference: 'comment', label: 'Kommentar' },
        ],
        rowTable: [
            { reference: 'measure', label: 'Folio' },
            { reference: 'system', label: 'System' },
            { reference: 'location', label: 'Reihe/Reihenton' },
            { reference: 'comment', label: 'Kommentar' },
        ],
    };

    /**
     * Constructor of the EditionTkaTableComponent.
     *
     * It initializes the self-referring ref variable needed for CompileHtml library.
     */
    constructor() {
        this.ref = this;
    }

    /**
     * Public method: getGlyph.
     *
     * It returns the hex value string for a glyph referenced by the given glyph string.
     *
     * @param {string} glyphString The given glyph string.
     * @returns {string} The hex value string of the given glyph string or empty string.
     */
    getGlyph(glyphString: string): string {
        const glyph = Object.values(this.GLYPHS).find(g => g.alt === glyphString);
        return glyph ? glyph.hex : '';
    }

    /**
     * Public method: getTableHeaderStrings.
     *
     * It returns different table header strings depending on the isRowTable flag.
     *
     * @returns {{reference: string, label: string}[]} The table header string collection.
     */
    getTableHeaderStrings(): { reference: string; label: string }[] {
        if (this.isRowTable) {
            return this.tableHeaderStrings.rowTable;
        }
        return this.tableHeaderStrings.default;
    }

    /**
     * Public method: openModal.
     *
     * It emits a given id of a modal snippet text
     * to the {@link openModalRequest}.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Emits the id.
     */
    openModal(id: string): void {
        if (!id) {
            return;
        }
        this.openModalRequest.emit(id);
    }

    /**
     * Public method: selectSvgSheet.
     *
     * It emits a given id of a selected svg sheet
     * to the {@link selectSvgSheetRequest}.
     *
     * @param {string} id The given sheet id.
     * @returns {void} Emits the id.
     */
    selectSvgSheet(id: string): void {
        if (!id) {
            return;
        }
        this.selectSvgSheetRequest.emit(id);
    }
}
