import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { UtilityService } from '@awg-app/core/services';
import { QueryResult } from '../models';

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
})
export class SelectResultsComponent {
    /**
     * Input variable: queryResult$.
     *
     * It keeps the query result as an observable.
     */
    @Input()
    queryResult$: Observable<QueryResult>;

    /**
     * Input variable: queryTime.
     *
     * It keeps the duration time of the query.
     */
    @Input()
    queryTime: number;

    /**
     * Input variable: isFullscreen.
     *
     * It keeps a boolean flag if fullscreenMode is set.
     */
    @Input()
    isFullscreen: boolean;

    /**
     * Output variable: clickedTableRequest.
     *
     * It keeps an event emitter for a click on a table IRI.
     */
    @Output()
    clickedTableRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Constructor of the SelectResultsComponent.
     *
     * It declares a public instance of the UtilityService.
     *
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor(public utils: UtilityService) {}

    /**
     * Public method: isNotEmpty.
     *
     * It checks if a given queryResult is not empty.
     *
     * @param {string} queryResult The given queryResult.
     *
     * @returns {boolean} The boolean value of the comparison result.
     */
    isNotEmpty(queryResult: QueryResult): boolean {
        const { head, body } = queryResult;
        const varsNotEmpty = this.utils.isNotEmptyArray(head?.vars);
        const bindingsNotEmpty = this.utils.isNotEmptyArray(body?.bindings);

        if (!varsNotEmpty || !bindingsNotEmpty) {
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

    /**
     * Public method: isAccordionItemDisabled.
     *
     * It returns a boolean flag if the accordion item should be disabled.
     * It returns true if fullscreenMode is set, otherwise false.
     *
     * @returns {boolean} The boolean value of the comparison.
     */
    isAccordionItemDisabled(): boolean {
        return this.isFullscreen ? true : false;
    }
}
