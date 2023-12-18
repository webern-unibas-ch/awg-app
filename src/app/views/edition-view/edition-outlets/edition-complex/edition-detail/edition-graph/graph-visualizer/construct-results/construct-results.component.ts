import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { D3SimulationNode, Triple } from '../models';

/**
 * The ConstructResults component.
 *
 * It contains the results for CONSTRUCT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-construct-results',
    templateUrl: './construct-results.component.html',
    styleUrls: ['./construct-results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructResultsComponent {
    /**
     * Input variable: queryResult$.
     *
     * It keeps the result of the query as an observable of triples.
     */
    @Input()
    queryResult$: Observable<Triple[]>;

    /**
     * Input variable: defaultForceGraphHeight.
     *
     * It keeps the default height for the force graph.
     */
    @Input()
    defaultForceGraphHeight: number;

    /**
     * Input variable: isFullscreen.
     *
     * It keeps a boolean flag if fullscreenMode is set.
     */
    @Input()
    isFullscreen: boolean;

    /**
     * Output variable: clickedNodeRequest.
     *
     * It keeps an event emitter for a click on a graph node.
     */
    @Output()
    clickedNodeRequest: EventEmitter<D3SimulationNode> = new EventEmitter();

    /**
     * Public method: isQueryResultNotEmpty.
     *
     * It checks if a given queryResult triple is not empty.
     *
     * @param {Triple[]} queryResult The given queryResult triples.
     *
     * @returns {boolean} The boolean value of the comparison result.
     */
    isQueryResultNotEmpty(queryResult: Triple[]): boolean {
        if (queryResult.length === 0) {
            return false;
        }
        return queryResult.every(triple => {
            const { subject, predicate, object } = triple;
            return Boolean(subject) && Boolean(predicate) && Boolean(object);
        });
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

    /**
     * Public method: onGraphNodeClick.
     *
     * It emits a trigger to
     * the {@link clickedNodeRequest}.
     *
     * @param {D3SimulationNode} node The given graph node.
     *
     * @returns {void} Triggers the request.
     */
    onGraphNodeClick(node: D3SimulationNode): void {
        if (!node) {
            return;
        }
        this.clickedNodeRequest.emit(node);
    }
}
