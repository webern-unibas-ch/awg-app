import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
    styleUrls: ['./construct-results.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructResultsComponent implements OnInit {
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
     * Output variable: clickedNodeRequest.
     *
     * It keeps an event emitter for a click on a graph node.
     */
    @Output()
    clickedNodeRequest: EventEmitter<D3SimulationNode> = new EventEmitter();

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {}

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
