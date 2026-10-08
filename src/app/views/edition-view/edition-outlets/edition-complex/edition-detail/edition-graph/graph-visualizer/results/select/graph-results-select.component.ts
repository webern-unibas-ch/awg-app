import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';

import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { SparqlResult, SparqlSelectResult } from '../../models/sparql-result.model';
import { GraphResultsEmptyComponent } from '../empty/graph-results-empty.component';
import { SelectTableComponent } from './table/select-table.component';

/**
 * The GraphResultsSelect component.
 *
 * It contains the results for SELECT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-graph-results-select',
    templateUrl: './graph-results-select.component.html',
    styleUrls: ['./graph-results-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbAccordionModule, GraphResultsEmptyComponent, SelectTableComponent, TwelveToneSpinnerComponent],
})
export class GraphResultsSelectComponent {
    /**
     * Readonly input signal: queryResult.
     *
     * It holds the result of the query
     * (undefined while the query is running).
     */
    readonly queryResult = input<SparqlResult | undefined>();

    /**
     * Readonly input signal: queryTime.
     *
     * It holds the duration time of the query.
     */
    readonly queryTime = input<number>(0);

    /**
     * Readonly input signal: isFullscreenMode.
     *
     * It holds a boolean flag if fullscreenMode is set.
     * If true, the accordion item is disabled.
     */
    readonly isFullscreenMode = input<boolean>(false);

    /**
     * Readonly output signal: clickedTableRequest.
     *
     * It emits the IRI of a table value the user clicked on.
     */
    readonly clickedTableRequest = output<string>();

    /**
     * Public method: isValidSelectQueryResult.
     *
     * It checks if a given query result is a select result with variables and bindings.
     *
     * @param {SparqlResult | null | undefined} queryResult The given query result.
     * @returns {boolean} True if it is a filled select result.
     */
    isValidSelectQueryResult(queryResult: SparqlResult | null | undefined): queryResult is SparqlSelectResult {
        return queryResult?.kind === 'select' && queryResult.variables.length > 0 && queryResult.bindings.length > 0;
    }

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
