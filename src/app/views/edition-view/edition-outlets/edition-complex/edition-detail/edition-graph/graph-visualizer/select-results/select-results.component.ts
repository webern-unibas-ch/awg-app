import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { EMPTY, Observable } from 'rxjs';

import { SparqlResult, SparqlSelectResult } from '../models/sparql-result.model';

/**
 * The SelectResults component.
 *
 * It contains the results for SELECT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-select-results',
    templateUrl: './select-results.component.html',
    styleUrls: ['./select-results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SelectResultsComponent {
    /**
     * Input variable: queryResult$.
     *
     * It keeps the query result as an observable.
     */
    @Input()
    queryResult$: Observable<SparqlResult> = EMPTY;

    /**
     * Input variable: queryTime.
     *
     * It keeps the duration time of the query.
     */
    @Input()
    queryTime = 0;

    /**
     * Input variable: isFullscreen.
     *
     * It keeps a boolean flag if fullscreenMode is set.
     */
    @Input()
    isFullscreen = false;

    /**
     * Output variable: clickedTableRequest.
     *
     * It keeps an event emitter for a click on a table IRI.
     */
    @Output()
    clickedTableRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public method: isAccordionItemDisabled.
     *
     * It returns a boolean flag if the accordion item should be disabled.
     * It returns true if fullscreenMode is set, otherwise false.
     *
     * @returns {boolean} The boolean value of the comparison.
     */
    isAccordionItemDisabled(): boolean {
        return this.isFullscreen;
    }

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
