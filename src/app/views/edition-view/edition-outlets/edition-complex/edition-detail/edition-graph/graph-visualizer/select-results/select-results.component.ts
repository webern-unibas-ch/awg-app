import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { EMPTY, Observable } from 'rxjs';

import { UTILS } from '@awg-shared/utils/object-utils';
import { QuerySelectResult } from '../models/query-result.model';

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
    queryResult$: Observable<QuerySelectResult | string | undefined> = EMPTY;

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
     * It checks if a given select query result is valid.
     *
     * @param {QuerySelectResult} selectQueryResult The given select query result.
     * @returns {boolean} True if it is a valid, filled object.
     */
    isValidSelectQueryResult(
        selectQueryResult: QuerySelectResult | string | null | undefined
    ): selectQueryResult is QuerySelectResult {
        if (!selectQueryResult || typeof selectQueryResult === 'string') {
            return false;
        }
        if (UTILS.isEmptyArray(selectQueryResult.head.vars) || UTILS.isEmptyArray(selectQueryResult.body.bindings)) {
            return false;
        }

        return true;
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
