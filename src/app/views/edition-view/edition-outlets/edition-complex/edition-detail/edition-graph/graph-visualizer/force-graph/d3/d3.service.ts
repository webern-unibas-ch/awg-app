import { Injectable } from '@angular/core';

import { D3Selection } from '@awg-app/views/edition-view/models';
import {
    D3ForceSimulation,
    D3Simulation,
    D3ForceSimulationOptions,
    D3SimulationLink,
    D3SimulationNode,
    D3DragBehaviour,
} from '../../models';

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
    providedIn: 'root',
})
export class D3Service {
    /**
     * Public method: applyDragBehaviour.
     *
     * It binds a draggable behaviour to an svg element.
     *
     *  @param {D3Selection} dragContext The given context element that shall be dragged.
     *  @param {D3Simulation} simulation The given force simulation.
     *
     *  @returns {void} Sets the drag behaviour.
     */
    applyDragBehaviour(dragContext: D3Selection, simulation: D3Simulation): void {
        // Const dragElement: D3Selection = d3_selection.select(element);

        const dragStart = (event: any, d: D3SimulationNode) => {
            // Prevent propagation of dragstart to parent elements
            event.sourceEvent.stopPropagation();

            if (!event.active) {
                simulation.alphaTarget(0.3).restart();
            }

            d.fx = d.x;
            d.fy = d.y;
        };

        const dragged = (event: any, d: D3SimulationNode) => {
            d.fx = event.x;
            d.fy = event.y;
        };

        const dragEnd = (event: any, d: D3SimulationNode) => {
            if (!event.active) {
                simulation.alphaTarget(0);
            }

            d.fx = null;
            d.fy = null;
        };

        // Create drag behaviour
        const dragBehaviour: D3DragBehaviour = d3_drag
            .drag()
            .on('start', dragStart)
            .on('drag', dragged)
            .on('end', dragEnd);

        // Apply drag behaviour
        dragContext.call(dragBehaviour);
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
    applyZoomBehaviour(zoomContainerElement: any, svgElement: any): void {
        // Select the elements
        const svg: D3Selection = d3_selection.select(svgElement);
        const zoomContainer: D3Selection = d3_selection.select(zoomContainerElement);

        // Perform the zooming
        const zoomed = (event: any) => {
            const currentTransform = event.transform;
            // Update d3 zoom context
            zoomContainer.attr('transform', currentTransform);
        };

        // Create zoom behaviour that calls the zoomActions on zoom
        const zoomBehaviour = d3_zoom.zoom().on('zoom', zoomed);

        // Apply zoom behaviour
        svg.call(zoomBehaviour);
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
