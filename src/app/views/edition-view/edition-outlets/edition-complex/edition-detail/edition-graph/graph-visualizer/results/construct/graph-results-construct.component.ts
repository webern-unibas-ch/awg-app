import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { map, Observable } from 'rxjs';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';

import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { GraphData, GraphNode } from '../../models/graph-data.model';
import { SparqlResult } from '../../models/sparql-result.model';
import { GRAPH_DATA_UTILS } from '../../utils/graph-data.utils';
import { GraphResultsEmptyComponent } from '../empty/graph-results-empty.component';
import { ForceGraphComponent } from './force-graph/force-graph.component';

/**
 * Object constant: EMPTY_GRAPH_DATA.
 *
 * It keeps the graph data of a result without triples.
 */
const EMPTY_GRAPH_DATA: GraphData = Object.freeze({ nodes: [], edges: [], tripleCount: 0 });

/**
 * The GraphResultsConstruct component.
 *
 * It contains the results for CONSTRUCT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-graph-results-construct',
    templateUrl: './graph-results-construct.component.html',
    styleUrls: ['./graph-results-construct.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AsyncPipe,
        NgbAccordionModule,
        ForceGraphComponent,
        GraphResultsEmptyComponent,
        TwelveToneSpinnerComponent,
    ],
})
export class GraphResultsConstructComponent {
    /**
     * Readonly input signal: queryResult$.
     *
     * It holds the result of the query as an observable.
     */
    readonly queryResult$ = input.required<Observable<SparqlResult>>();

    /**
     * Readonly input signal: defaultForceGraphHeight.
     *
     * It holds the default height for the force graph.
     */
    readonly defaultForceGraphHeight = input<number>(0);

    /**
     * Readonly input signal: isFullscreenMode.
     *
     * It holds a boolean flag if fullscreenMode is set.
     */
    readonly isFullscreenMode = input<boolean>(false);

    /**
     * Readonly output signal: clickedNodeRequest.
     *
     * It emits the graph node a user clicked on.
     */
    readonly clickedNodeRequest = output<GraphNode>();

    /**
     * Readonly computed signal: graphData$.
     *
     * It holds the graph data of the query result as an observable
     * (derived once per query result, not per change detection).
     */
    readonly graphData$ = computed<Observable<GraphData>>(() =>
        this.queryResult$().pipe(map(queryResult => this._toGraphData(queryResult)))
    );

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
        if (queryResult?.kind !== 'construct') {
            return EMPTY_GRAPH_DATA;
        }
        return GRAPH_DATA_UTILS.toGraphData(queryResult.quads, queryResult.prefixes);
    }
}
