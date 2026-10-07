import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { TableComponent } from '@awg-shared/table/table.component';

import { SparqlSelectResult } from '../../../models/sparql-result.model';
import { SELECT_TABLE_UTILS } from './select-table.utils';

/**
 * The SelectTable component.
 *
 * It contains the SPARQL table for SELECT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-select-table',
    templateUrl: './select-table.component.html',
    styleUrls: ['./select-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TableComponent],
})
export class SelectTableComponent {
    /**
     * Readonly input signal: queryResult.
     *
     * It holds the result of the query.
     */
    readonly queryResult = input.required<SparqlSelectResult>();

    /**
     * Readonly output signal: clickedTableRequest.
     *
     * It emits the IRI of a table value the user clicked on.
     */
    readonly clickedTableRequest = output<string>();

    /**
     * Readonly computed signal: tableRows.
     *
     * It holds the rows of the table, converted from the bindings of the query result.
     */
    readonly tableRows = computed(() => SELECT_TABLE_UTILS.toTableRows(this.queryResult()));

    /**
     * Public method: onTableNodeClick.
     *
     * It emits a uri the user clicked on in the result table.
     *
     * @param {string} uri The given uri.
     *
     * @returns {void} Emits the uri.
     */
    onTableNodeClick(uri: string): void {
        if (!uri) {
            return;
        }
        this.clickedTableRequest.emit(uri);
    }
}
