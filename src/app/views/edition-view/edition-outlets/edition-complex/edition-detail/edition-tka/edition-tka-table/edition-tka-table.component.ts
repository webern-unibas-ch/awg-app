import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap/tooltip';

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { EDITION_UTILS } from '@awg-shared/utils/edition-utils';

import { TextcriticalCommentary } from '@awg-views/edition-view/models/textcritics.model';
import { TkaTableHeaderColumn } from '@awg-views/edition-view/models/tka-table-header.model';
import { EditionSnippetService } from '@awg-views/edition-view/services/edition-snippet.service';

import { TKA_TABLE_HEADERS } from './edition-tka-table.data';

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
    imports: [AbbrDirective, CompileHtmlDirective, NgbTooltipModule],
})
export class EditionTkaTableComponent {
    /**
     * Private readonly injection variable: _editionSnippetService.
     *
     * It keeps the instance of the injected EditionSnippetService.
     */
    private readonly _editionSnippetService = inject(EditionSnippetService);

    /**
     * Readonly input signal: displayedCommentary.
     *
     * It holds the commentary data to be displayed.
     */
    readonly displayedCommentary = input.required<TextcriticalCommentary | undefined>();

    /**
     * Readonly input signal: id.
     *
     * It holds the id of the sheet or textcritics.
     */
    readonly id = input<string>('');

    /**
     * Readonly input signal: isCorrections.
     *
     * It holds a boolean flag to indicate if the table content are corrections.
     */
    readonly isCorrections = input<boolean>(false);

    /**
     * Readonly input signal: isRowtable.
     *
     * It holds a boolean flag to indicate if the table content is a rowtable.
     */
    readonly isRowtable = input<boolean>(false);

    /**
     * Readonly computed signal: tableHeaders.
     *
     * It computes the table header based on the inputs.
     */
    readonly tableHeaders = computed<TkaTableHeaderColumn[]>(() => {
        const id = this.id();
        const isCorrections = this.isCorrections();
        const isRowtable = this.isRowtable();

        let tableHeader = TKA_TABLE_HEADERS['default'];

        if (isRowtable) {
            tableHeader = TKA_TABLE_HEADERS['rowtable'];
        } else if (isCorrections) {
            tableHeader = TKA_TABLE_HEADERS['corrections'];
        }

        if (EDITION_UTILS.isSketchId(id) && !isCorrections) {
            return tableHeader.map(item => (item.ref === 'comment' ? { ...item, label: 'Kommentar' } : item));
        }

        return tableHeader;
    });

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
}
