import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { EDITION_UTILS } from '@awg-shared/utils/edition-utils';
import { UTILS } from '@awg-shared/utils/object-utils';
import { TextcriticalCommentary, TkaTableHeaderColumn } from '@awg-views/edition-view/models';
import { EditionSnippetService } from '@awg-views/edition-view/services';

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
    standalone: false,
})
export class EditionTkaTableComponent {
    /**
     * Private readonly injection variable: _editionSnippetService.
     *
     * It keeps the instance of the injected EditionSnippetService.
     */
    private readonly _editionSnippetService = inject(EditionSnippetService);

    /**
     * Input variable: commentary.
     *
     * It keeps the commentary data.
     */
    @Input()
    commentary: TextcriticalCommentary;

    /**
     * Input variable: id.
     *
     * It keeps the id of the sheet or textcritics.
     */
    @Input()
    id?: string;

    /**
     * Input variable: isCorrections.
     *
     * It keeps a boolean flag to indicate if the table content are corrections.
     */
    @Input()
    isCorrections = false;

    /**
     * Input variable: isRowtable.
     *
     * It keeps a boolean flag to indicate if the table content is a rowtable.
     */
    @Input()
    isRowtable = false;

    /**
     * Protected readonly variable: EDITION_UTILS.
     *
     * It keeps the reference to the {@link EDITION_UTILS} methods.
     */
    protected readonly EDITION_UTILS = EDITION_UTILS;

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

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
        rowtable: [
            { reference: 'measure', label: 'Folio' },
            { reference: 'system', label: 'System' },
            { reference: 'location', label: 'Reihe/Reihenton' },
            { reference: 'comment', label: 'Anmerkung' },
        ],
    };

    /**
     * Public method: getComment.
     *
     * It replaces each placeholder
     * `##Abbildung##` in a comment string with an image tag,
     * deriving the asset path from the given svgGroupId.
     * Multiple occurrences are disambiguated with an `a`, `b`, … suffix.
     *
     * @param {string} comment The given comment string.
     * @param {string | undefined} svgGroupId The given svgGroupId.
     * @returns {string} The comment string with placeholders replaced by image tags.
     */
    getComment(comment: string, svgGroupId?: string): string {
        return this._editionSnippetService.getComment(comment, svgGroupId);
    }

    /**
     * Public method: getTableHeaderStrings.
     *
     * It returns different table header strings depending on the isRowtable flag.
     *
     * @returns {{reference: string, label: string}[]} The table header string collection.
     */
    getTableHeaderStrings(): TkaTableHeaderColumn[] {
        const { rowtable, default: defaultTable, corrections: correctionsTable } = this.tableHeaderStrings;

        let selectedTableHeader: TkaTableHeaderColumn[];

        if (this.isRowtable) {
            selectedTableHeader = rowtable;
        } else if (this.isCorrections) {
            selectedTableHeader = correctionsTable;
        } else {
            selectedTableHeader = defaultTable;
        }

        // Adjust comment label for sketches, but not corrections
        if (EDITION_UTILS.isSketchId(this.id) && !this.isCorrections) {
            selectedTableHeader = selectedTableHeader.map(item =>
                item.reference === 'comment' ? { ...item, label: 'Kommentar' } : item
            );
        }

        return selectedTableHeader;
    }
}
