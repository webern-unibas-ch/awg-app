import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';

import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { ResultGraph, ResultGraphNode } from '@awg-graph/graph-visualizer/models/result-graph.model';
import { SparqlResult } from '@awg-graph/graph-visualizer/models/sparql-result.model';

import { GraphResultsEmptyComponent } from '../empty/graph-results-empty.component';
import { ForceGraphComponent } from './force-graph/force-graph.component';
import { RESULT_GRAPH_UTILS } from './result-graph.utils';

/**
 * Object constant: EMPTY_GRAPH_DATA.
 *
 * It keeps the graph data of a result without triples.
 */
const EMPTY_GRAPH_DATA: ResultGraph = Object.freeze({ nodes: [], edges: [], tripleCount: 0 });

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
    imports: [NgbAccordionModule, ForceGraphComponent, GraphResultsEmptyComponent, TwelveToneSpinnerComponent],
})
export class GraphResultsConstructComponent {
    /**
     * Readonly input signal: queryResult.
     *
     * It holds the result of the query
     * (undefined while the query is running).
     */
    readonly queryResult = input<SparqlResult | undefined>();

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
    readonly clickedNodeRequest = output<ResultGraphNode>();

    /**
     * Readonly computed signal: resultGraph.
     *
     * It holds the graph data of the query result
     * (undefined while the query is running).
     */
    readonly resultGraph = computed<ResultGraph | undefined>(() => {
        const queryResultData = this.queryResult();
        return queryResultData ? this._toResultGraph(queryResultData) : undefined;
    });

    /**
     * Public method: isValidResultGraph.
     *
     * It checks if the given graph data has edges to display.
     *
     * @param {ResultGraph | null | undefined} resultGraph The given graph data.
     * @returns {boolean} True if the graph data has edges.
     */
    isValidResultGraph(resultGraph: ResultGraph | null | undefined): resultGraph is ResultGraph {
        return !!resultGraph && resultGraph.edges.length > 0;
    }

    /**
     * Public method: onGraphNodeClick.
     *
     * It emits a trigger to
     * the {@link clickedNodeRequest}.
     *
     * @param {ResultGraphNode} node The given graph node.
     *
     * @returns {void} Triggers the request.
     */
    onGraphNodeClick(node: ResultGraphNode): void {
        if (!node) {
            return;
        }
        this.clickedNodeRequest.emit(node);
    }

    /**
     * Private method: _toResultGraph.
     *
     * It converts a given query result into graph data
     * (empty graph data for results that are no construct results).
     *
     * @param {SparqlResult} queryResult The given query result.
     * @returns {ResultGraph} The graph data.
     */
    private _toResultGraph(queryResult: SparqlResult): ResultGraph {
        if (queryResult?.kind !== 'construct') {
            return EMPTY_GRAPH_DATA;
        }
        return RESULT_GRAPH_UTILS.toResultGraph(queryResult.quads, queryResult.prefixes);
    }
}
