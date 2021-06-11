import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';
import { SelectResponse } from '../models';

/**
 * The SelectResults component.
 *
 * It contains the results for SELECT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-select-results',
    templateUrl: './select-results.component.html',
    styleUrls: ['./select-results.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectResultsComponent implements OnInit {
    /**
     * Input variable: queryResult$.
     *
     * It keeps the SelectResponse as an observable.
     */
    @Input()
    queryResult$: Observable<SelectResponse>;

    /**
     * Input variable: queryTime.
     *
     * It keeps the duration time of the query.
     */
    @Input()
    queryTime: number;

    /**
     * Output variable: clickedTableRequest.
     *
     * It keeps an event emitter for a click on a table IRI.
     */
    @Output()
    clickedTableRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {}

    /**
     * Public method: isNotEmpty.
     *
     * It checks if a given queryResult with a SelectResponse
     * is not empty.
     *
     * @param {string} queryResult The given queryResult.
     *
     * @returns {boolean} The boolean value of the comparison result.
     */
    isNotEmpty(queryResult: SelectResponse): boolean {
        if (!queryResult.head && !queryResult.body) {
            return;
        }
        return queryResult.head.vars.length > 0 && queryResult.body.bindings.length > 0;
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
