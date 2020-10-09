import { Injectable } from '@angular/core';

import {
    D3ForceSimulation,
    D3Selection,
    D3Simulation,
    D3ForceSimulationOptions,
    D3SimulationLink,
    D3SimulationNode
} from '@awg-views/edition-view/edition-outlets/edition-graph/graph-visualizer/models';

import * as d3_drag from 'd3-drag';
import * as d3_selection from 'd3-selection';
import * as d3_zoom from 'd3-zoom';

/**
 * The D3 service.
 *
 * It provides methods to enable user interaction with elements
 * while maintaining the d3 simulations physics.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class D3Service {
    /**
     * Constructor of the D3Service.
     */
    constructor() {}

    /**
     * Public method: applyDragBehaviour.
     *
     * It binds a draggable behaviour to an svg element.
     *
     *  @param {any} element The given element that shall be dragged.
     *  @param {D3Simulation} simulation The given force simulation.
     *
     *  @returns {void} Sets the drag behaviour.
     */
    applyDragBehaviour(element: any, simulation: D3Simulation): void {
        const dragElement: D3Selection = d3_selection.select(element);

        const dragStart = (d: D3SimulationNode) => {
            // prevent propagation of dragstart to parent elements
            d3_selection.event.sourceEvent.stopPropagation();

            if (!d3_selection.event.active) {
                simulation.alphaTarget(0.3).restart();
            }

            d.fx = d.x;
            d.fy = d.y;
        };

        const dragActions = (d: D3SimulationNode) => {
            d.fx = d3_selection.event.x;
            d.fy = d3_selection.event.y;
        };

        const dragEnd = (d: D3SimulationNode) => {
            if (!d3_selection.event.active) {
                simulation.alphaTarget(0);
            }

            d.fx = null;
            d.fy = null;
        };

        dragElement.call(d3_drag.drag().on('start', dragStart).on('drag', dragActions).on('end', dragEnd));
    }

    /**
     * Public method: applyZoomBehaviour.
     *
     * It binds a pan and zoom behaviour to an svg element.
     *
     *  @param {any} svgElement The given svg element that contains the zoomContainer.
     *  @param {any} zoomContainerElement The given zoom container.
     *  @returns {void} Sets the zoom behaviour.
     */
    applyZoomBehaviour(svgElement: any, zoomContainerElement: any): void {
        // select the elements
        const svg: D3Selection = d3_selection.select(svgElement);
        const zoomContainer: D3Selection = d3_selection.select(zoomContainerElement);

        // perform the zooming
        const zoomActions = () => {
            zoomContainer.attr('transform', d3_selection.event.transform);
        };

        // create zoomHandler that calls the zoomActions on zoom
        const zoomHandler = d3_zoom.zoom().on('zoom', zoomActions);

        // apply zoom handler
        svg.call(zoomHandler);
    }

    /**
     * Public method: getForceSimulation.
     *
     * It creates a new D3ForceSimulation instance and provides all relevant calculations for the new simulation.
     * This method does not interact with the document, purely physical calculations with d3.
     *
     * @returns {D3ForceSimulation} The new D3ForceSimulation.
     */
    getForceSimulation(
        nodes: D3SimulationNode[],
        links: D3SimulationLink[],
        options: D3ForceSimulationOptions
    ): D3ForceSimulation {
        const simulation: D3ForceSimulation = new D3ForceSimulation(nodes, links, options);
        return simulation;
    }
}
