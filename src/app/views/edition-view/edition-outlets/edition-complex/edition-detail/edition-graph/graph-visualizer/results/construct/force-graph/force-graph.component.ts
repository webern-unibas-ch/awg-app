/*
 * This component is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */

import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { SliderZoomComponent } from '@awg-shared/zoom/slider-zoom.component';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';

import { ResultGraph, ResultGraphNode } from '@awg-graph/graph-visualizer/models/result-graph.model';

import { RESULT_GRAPH_UTILS } from '../result-graph.utils';
import { ForceGraphLimitComponent } from './limit/force-graph-limit.component';
import { ForceGraphSvgComponent } from './svg/force-graph-svg.component';

/**
 * The ForceGraphComponent component.
 *
 * It visualizes an RDF graph using a D3 force simulation
 * (rendered by the {@link ForceGraphSvgComponent})
 * with an icon bar for zoom ({@link SliderZoomComponent})
 * and limit ({@link ForceGraphLimitComponent}).
 */
@Component({
    selector: 'awg-force-graph',
    templateUrl: './force-graph.component.html',
    styleUrls: ['./force-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ForceGraphLimitComponent, ForceGraphSvgComponent, SliderZoomComponent],
})
export class ForceGraphComponent {
    /**
     * Readonly input signal: resultGraph.
     *
     * It holds the graph data of the query result.
     */
    readonly resultGraph = input.required<ResultGraph>();

    /**
     * Readonly input signal: height.
     *
     * It holds the height (in px) of the component.
     */
    readonly height = input<number>(0);

    /**
     * Readonly output signal: clickedNodeRequest.
     *
     * It emits the graph node a user clicked on.
     */
    readonly clickedNodeRequest = output<ResultGraphNode>();

    /**
     * Readonly variable: zoomConfig.
     *
     * It keeps the default values for the zoom slider input.
     */
    readonly zoomConfig = new ZoomConfig(1, 0.1, 3, 0.01);

    /**
     * Readonly signal: zoomValue.
     *
     * It holds the current zoom factor of the graph (shown by the zoom slider).
     */
    readonly zoomValue = signal<number>(this.zoomConfig.initial);

    /**
     * Readonly signal: limit.
     *
     * It holds the current limit of displayed triples.
     */
    readonly limit = signal<number>(50);

    /**
     * Readonly computed signal: limitedResultGraph.
     *
     * It holds the graph data limited to the current limit.
     */
    readonly limitedResultGraph = computed<ResultGraph>(() =>
        RESULT_GRAPH_UTILS.limitResultGraph(this.resultGraph(), this.limit())
    );
}
