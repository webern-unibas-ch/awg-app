import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, Output } from '@angular/core';

import { SparqlSelectResult } from '../models/sparql-result.model';
import { SPARQL_TABLE_UTILS } from './sparql-table.utils';

/**
 * The SparqlTable component.
 *
 * It contains the SPARQL table for SELECT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-sparql-table',
    templateUrl: './sparql-table.component.html',
    styleUrls: ['./sparql-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SparqlTableComponent {
    /**
     * Readonly input signal: queryResult.
     *
     * It holds the result of the query.
     */
    readonly queryResult = input.required<SparqlSelectResult>();

    /**
     * Output variable: clickedTableRequest.
     *
     * It keeps an event emitter for a click on a table IRI.
     */
    @Output()
    clickedTableRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Readonly computed signal: tableRows.
     *
     * It holds the rows of the table, converted from the bindings of the query result.
     */
    readonly tableRows = computed(() => SPARQL_TABLE_UTILS.toTableRows(this.queryResult()));

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
