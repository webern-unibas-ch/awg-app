import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { UTILS } from '@awg-shared/utils/object-utils';
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
    standalone: false,
})
export class ConstructResultsComponent {
    /**
     * Input variable: queryResult$.
     *
     * It keeps the result of the query as an observable of triples.
     */
    @Input()
    queryResult$: Observable<Triple[] | undefined>;

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
     * Public method: isValidConstructQueryResult.
     *
     * It checks if a given construct result triple is valid.
     *
     * @param {Triple[] | null | undefined} constructQueryResult The given construct query result.
     * @returns {boolean} True if it is a valid, filled, and complete array.
     */
    isValidConstructQueryResult(constructQueryResult: Triple[] | null | undefined): constructQueryResult is Triple[] {
        if (UTILS.isEmptyArray(constructQueryResult)) {
            return false;
        }
        if (constructQueryResult.some(triple => !triple.subject || !triple.predicate || !triple.object)) {
            return false;
        }

        return true;
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
