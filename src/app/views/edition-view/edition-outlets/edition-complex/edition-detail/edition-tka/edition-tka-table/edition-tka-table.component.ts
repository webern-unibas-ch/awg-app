import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EDITION_GLYPHS_DATA } from '@awg-app/views/edition-view/data';

import { TextcriticalComment, TkaTableHeaderColumn } from '@awg-views/edition-view/models';

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
     * Input variable: isCorrections.
     *
     * It keeps a boolean flag to indicate if the table content are corrections.
     */
    @Input()
    isCorrections = false;

    /**
     * Input variable: isRowTable.
     *
     * It keeps a boolean flag to indicate if the table content is a row table.
     */
    @Input()
    isRowTable = false;

    /**
     * Input variable: isSketchId.
     *
     * It keeps a boolean flag to indicate if the textcritics are related to a sketch.
     */
    @Input()
    isSketchId = false;

    /**
     * Output variable: navigateToReportFragment.
     *
     * It keeps an event emitter for the selected ids of an edition complex and report fragment.
     */
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();

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
     * It keeps an event emitter for the selected ids of an edition complex and svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();

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
    tableHeaderStrings: { [key: string]: TkaTableHeaderColumn[] } = {
        default: [
            { reference: 'measure', label: 'Takt' },
            { reference: 'system', label: 'System' },
            { reference: 'location', label: 'Ort im Takt' },
            { reference: 'comment', label: 'Anmerkung' },
        ],
        corrections: [
            { reference: 'measure', label: 'Takt' },
            { reference: 'system', label: 'System' },
            { reference: 'location', label: 'Ort im Takt' },
            { reference: 'comment', label: 'Korrektur' },
        ],
        rowTable: [
            { reference: 'measure', label: 'Folio' },
            { reference: 'system', label: 'System' },
            { reference: 'location', label: 'Reihe/Reihenton' },
            { reference: 'comment', label: 'Anmerkung' },
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
    getTableHeaderStrings(): TkaTableHeaderColumn[] {
        const { rowTable, default: defaultTable, corrections: correctionsTable } = this.tableHeaderStrings;

        let selectedTableHeader: TkaTableHeaderColumn[];

        if (this.isRowTable) {
            selectedTableHeader = rowTable;
        } else if (this.isCorrections) {
            selectedTableHeader = correctionsTable;
        } else {
            selectedTableHeader = defaultTable;
        }

        // Adjust comment label for sketches, but not corrections
        if (this.isSketchId && !this.isCorrections) {
            selectedTableHeader = selectedTableHeader.map(item =>
                item.reference === 'comment' ? { ...item, label: 'Kommentar' } : item
            );
        }

        return selectedTableHeader;
    }

    /**
     * Public method: navigateToReportFragment.
     *
     * It emits the given ids of a selected edition complex and report fragment
     * to the {@link navigateToReportFragmentRequest}.
     *
     * @param {object} reportIds The given report ids as { complexId: string, fragmentId: string }.
     * @returns {void} Emits the ids.
     */
    navigateToReportFragment(reportIds: { complexId: string; fragmentId: string }): void {
        if (!reportIds?.fragmentId) {
            return;
        }
        this.navigateToReportFragmentRequest.emit(reportIds);
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
     * It emits the given ids of a selected edition complex
     * and svg sheet to the {@link selectSvgSheetRequest}.
     *
     * @param {string} complexId The given complex id.
     * @param {string} sheetId The given sheet id.
     * @returns {void} Emits the ids.
     */
    selectSvgSheet(complexId: string, sheetId: string): void {
        if (!sheetId) {
            return;
        }
        this.selectSvgSheetRequest.emit({ complexId: complexId, sheetId: sheetId });
    }
}
