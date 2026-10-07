import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { EMPTY, map, Observable } from 'rxjs';

import { GraphData, GraphNode } from '../models/graph-data.model';
import { SparqlResult } from '../models/sparql-result.model';
import { GRAPH_DATA_UTILS } from '../utils/graph-data.utils';

/**
 * Object constant: EMPTY_GRAPH_DATA.
 *
 * It keeps the graph data of a result without triples.
 */
const EMPTY_GRAPH_DATA: GraphData = Object.freeze({ nodes: [], edges: [], tripleCount: 0 });

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
     * Input variable: defaultForceGraphHeight.
     *
     * It keeps the default height for the force graph.
     */
    @Input()
    defaultForceGraphHeight = 0;

    /**
     * Input variable: isFullscreenMode.
     *
     * It keeps a boolean flag if fullscreenMode is set.
     */
    @Input()
    isFullscreenMode = false;

    /**
     * Output variable: clickedNodeRequest.
     *
     * It keeps an event emitter for a click on a graph node.
     */
    @Output()
    clickedNodeRequest: EventEmitter<GraphNode> = new EventEmitter();

    /**
     * Public variable: graphData$.
     *
     * It keeps the graph data of the query result as an observable.
     */
    graphData$: Observable<GraphData> = EMPTY;

    /**
     * Private variable: _queryResult$.
     *
     * It keeps the result of the query as an observable.
     */
    private _queryResult$: Observable<SparqlResult> = EMPTY;

    /**
     * Getter for the query result observable.
     */
    get queryResult$(): Observable<SparqlResult> {
        return this._queryResult$;
    }

    /**
     * Input setter: queryResult$.
     *
     * It sets the result of the query as an observable
     * and derives the graph data from it (once per result, not per change detection).
     */
    @Input()
    set queryResult$(queryResult$: Observable<SparqlResult>) {
        this._queryResult$ = queryResult$;
        this.graphData$ = queryResult$.pipe(map(queryResult => this._toGraphData(queryResult)));
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
        return this.isFullscreenMode;
    }

    /**
     * Public method: isValidGraphData.
     *
     * It checks if the given graph data has edges to display.
     *
     * @param {GraphData | null | undefined} graphData The given graph data.
     * @returns {boolean} True if the graph data has edges.
     */
    isValidGraphData(graphData: GraphData | null | undefined): graphData is GraphData {
        return !!graphData && graphData.edges.length > 0;
    }

    /**
     * Public method: onGraphNodeClick.
     *
     * It emits a trigger to
     * the {@link clickedNodeRequest}.
     *
     * @param {GraphNode} node The given graph node.
     *
     * @returns {void} Triggers the request.
     */
    onGraphNodeClick(node: GraphNode): void {
        if (!node) {
            return;
        }
        this.clickedNodeRequest.emit(node);
    }

    /**
     * Private method: _toGraphData.
     *
     * It converts a given query result into graph data
     * (empty graph data for results that are no construct results).
     *
     * @param {SparqlResult} queryResult The given query result.
     * @returns {GraphData} The graph data.
     */
    private _toGraphData(queryResult: SparqlResult): GraphData {
        if (queryResult.kind !== 'construct') {
            return EMPTY_GRAPH_DATA;
        }
        return GRAPH_DATA_UTILS.toGraphData(queryResult.quads, queryResult.prefixes);
    }
}
