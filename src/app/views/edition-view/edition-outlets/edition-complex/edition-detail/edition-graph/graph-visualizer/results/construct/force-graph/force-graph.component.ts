/*
 * This component is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */

import { Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';

import { ZoomConfig } from '@awg-shared/zoom/zoom.model';

import { GraphData, GraphNode } from '../../../models/graph-data.model';
import { GRAPH_DATA_UTILS } from '../../../utils/graph-data.utils';
import { ForceGraphSvgComponent } from './svg/force-graph-svg.component';

/**
 * The ForceGraphComponent component.
 *
 * It visualizes an RDF graph using a D3 force simulation
 * (rendered by the {@link ForceGraphSvgComponent}).
 */
@Component({
    selector: 'awg-force-graph',
    templateUrl: './force-graph.component.html',
    styleUrls: ['./force-graph.component.scss'],
    standalone: false,
})
export class ForceGraphComponent implements OnChanges {
    /**
     * Input variable: graphData.
     *
     * It keeps the graph data of the query result.
     */
    @Input() graphData?: GraphData;

    /**
     * Input variable: height.
     *
     * It keeps the default height of the component.
     */
    @Input() height = 0;

    /**
     * Output variable: clickedNodeRequest.
     *
     * It keeps an event emitter for the graph node a user clicked on.
     */
    @Output() clickedNodeRequest = new EventEmitter<GraphNode>();

    /**
     * ViewChild variable: graphSvg.
     *
     * It keeps the reference to the svg component of the graph.
     */
    @ViewChild(ForceGraphSvgComponent) graphSvg?: ForceGraphSvgComponent;

    /**
     * Public variable: limitValues.
     *
     * It keeps the array of possible limit values.
     */
    limitValues = [5, 10, 25, 50, 100, 250, 500, 1000];

    /**
     * Public variable: limit.
     *
     * It keeps the default limit value for the display of query results.
     */
    limit = 50;

    /**
     * Public variable: limitedGraphData.
     *
     * It keeps the graph data limited to the current limit.
     */
    limitedGraphData: GraphData | undefined;

    /**
     * Public variable: zoomConfig.
     *
     * It keeps the default values for the zoom slider input.
     */
    zoomConfig = new ZoomConfig(1, 0.1, 3, 0.01);

    /**
     * Readonly signal: zoomValue.
     *
     * It holds the current zoom factor of the graph (shown by the zoom slider).
     */
    readonly zoomValue = signal<number>(this.zoomConfig.initial);

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     *
     * @param {SimpleChanges} changes The changes of the input.
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['graphData']) {
            this._updateLimitedGraphData();
        }
    }

    /**
     * Public method: onLimitValueChange.
     *
     * It sets the current limit to a given limit value
     * and limits the graph data accordingly.
     *
     * @param {number} limitValue The given limit value.
     *
     * @returns {void} Sets the new limit.
     */
    onLimitValueChange(limitValue: number): void {
        this.limit = limitValue;
        this._updateLimitedGraphData();
    }

    /**
     * Public method: onResetZoom.
     *
     * It resets the zoom of the graph via the svg component.
     *
     * @returns {void} Resets the zoom.
     */
    onResetZoom(): void {
        this.graphSvg?.resetZoom();
    }

    /**
     * Private method: _updateLimitedGraphData.
     *
     * It limits the graph data to the current limit.
     *
     * @returns {void} Sets the limited graph data.
     */
    private _updateLimitedGraphData(): void {
        this.limitedGraphData = this.graphData
            ? GRAPH_DATA_UTILS.limitGraphData(this.graphData, this.limit)
            : undefined;
    }
}
