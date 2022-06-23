import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { SearchResult } from '../models';

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
     * It keeps the SearchResult as an observable.
     */
    @Input()
    queryResult$: Observable<SearchResult>;

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
     * Public method: isNotEmpty.
     *
     * It checks if a given queryResult with a SearchResult
     * is not empty.
     *
     * @param {string} queryResult The given queryResult.
     *
     * @returns {boolean} The boolean value of the comparison result.
     */
    isNotEmpty(queryResult: SearchResult): boolean {
        if (!queryResult.head || !queryResult.body) {
            return undefined;
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

    /**
     * Public method: preventPanelCollapseOnFullscreen.
     *
     * It prevents the given panel event from being collapsed in fullscreen mode.
     *
     * @returns {void} Prevents the panel collapse.
     */
    preventPanelCollapseOnFullscreen($event: NgbPanelChangeEvent): void {
        if (!$event) {
            return;
        }
        if (this.isFullscreen && $event.nextState === false) {
            $event.preventDefault();
        }
    }
}
