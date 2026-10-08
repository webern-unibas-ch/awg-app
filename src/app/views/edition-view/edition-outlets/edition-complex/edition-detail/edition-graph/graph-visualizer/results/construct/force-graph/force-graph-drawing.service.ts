/*
 * The drawing is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */

import { Injectable } from '@angular/core';

import * as D3_DRAG from 'd3-drag';
import * as D3_FORCE from 'd3-force';
import * as D3_SELECTION from 'd3-selection';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';

import { ResultGraphNode } from '../../../models/result-graph.model';
import { ForceSimulation, GraphSimNode, SimEdge, SimLink, SimNode, SimulationData } from './force-graph.model';
import { FORCE_GRAPH_UTILS } from './force-graph.utils';

/**
 * Object constant with a set of forces.
 *
 * It provides the default values for the D3 simulation's forces.
 *
 * Available force values: `LINK_DISTANCE`, `COLLISION_STRENGTH`, `COLLISION_RADIUS`, `CHARGE_STRENGTH`.
 */
const FORCES = {
    LINK_DISTANCE: 10, // Default 30
    COLLISION_STRENGTH: 1, // 0–1; Default: 0.7
    COLLISION_RADIUS: 30,
    CHARGE_STRENGTH: -10, //  Default -30
};

/**
 * Constant: FORCE_GRAPH_ARROW_MARKER_ID.
 *
 * It keeps the id of the svg marker drawn at the end of the links.
 */
export const FORCE_GRAPH_ARROW_MARKER_ID = 'awg-force-graph-arrow';

/**
 * The ForceGraphDrawing service.
 *
 * It draws the simulation data of a graph into a given svg root group
 * and sets up the D3 force simulation (incl. dragging of the nodes) around the origin (0,0).
 * The caller owns the returned simulation (e.g., stops it before redrawing).
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class ForceGraphDrawingService {
    /**
     * Public method: renderGraph.
     *
     * It renders the given simulation data into a given svg root group selection.
     *
     * @param {D3Selection} svgRootGroupSelection The given svg root group selection.
     * @param {SimulationData} simulationData The given simulation data.
     * @returns {ForceSimulation} The started force simulation.
     */
    renderGraph(svgRootGroupSelection: D3Selection, simulationData: SimulationData): ForceSimulation {
        // Clear the content of the root group before redrawing
        svgRootGroupSelection.selectAll('*').remove();

        const graphSimNodes = simulationData.nodes.filter((d: SimNode): d is GraphSimNode => !!d.graphNode);

        const links = this._drawLinks(svgRootGroupSelection, simulationData.edges);
        const linkTexts = this._drawLinkTexts(svgRootGroupSelection, simulationData.edges);
        const nodeTexts = this._drawNodeTexts(svgRootGroupSelection, graphSimNodes);
        const nodes = this._drawNodes(svgRootGroupSelection, graphSimNodes);

        const simulation = this._createSimulation(simulationData);

        // Update node and link positions on each tick of the simulation
        simulation.on('tick', () => {
            nodes.attr('cx', (d: SimNode) => d.x ?? 0).attr('cy', (d: SimNode) => d.y ?? 0);
            nodeTexts.attr('x', (d: SimNode) => (d.x ?? 0) + 12).attr('y', (d: SimNode) => (d.y ?? 0) + 3);
            links.attr('d', (d: SimEdge) => FORCE_GRAPH_UTILS.linkPath(d));
            linkTexts
                .attr('x', (d: SimEdge) => FORCE_GRAPH_UTILS.linkLabelPosition(d).x)
                .attr('y', (d: SimEdge) => FORCE_GRAPH_UTILS.linkLabelPosition(d).y);
        });

        nodes.call(this._createDragBehaviour(simulation));

        return simulation;
    }

    /**
     * Public method: getGraphNode.
     *
     * It gets the graph node of a given event target
     * if the target is a drawn node (a circle within the nodes group).
     *
     * @param {EventTarget | null} target The given event target.
     * @returns {ResultGraphNode | undefined} The graph node of the target, or undefined.
     */
    getGraphNode(target: EventTarget | null): ResultGraphNode | undefined {
        if (!(target instanceof Element) || !target.matches('g.nodes > circle')) {
            return undefined;
        }
        return D3_SELECTION.select<Element, SimNode | undefined>(target).datum()?.graphNode;
    }

    /**
     * Private method: _createDragBehaviour.
     *
     * It creates the drag behaviour for the drawn nodes:
     * a dragged node is fixed at the pointer position and the simulation is reheated.
     *
     * @param {ForceSimulation} simulation The given force simulation.
     * @returns {D3_DRAG.DragBehavior<any, SimNode, any>} The drag behaviour.
     */
    private _createDragBehaviour(simulation: ForceSimulation): D3_DRAG.DragBehavior<any, SimNode, any> {
        return D3_DRAG.drag<any, SimNode>()
            .on('start', (event: any, d: SimNode) => {
                // Prevent the propagation of the drag start to the parent elements (e.g., panning of the svg)
                event.sourceEvent.stopPropagation();

                if (!event.active) {
                    simulation.alphaTarget(0.3).restart();
                }
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event: any, d: SimNode) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event: any, d: SimNode) => {
                if (!event.active) {
                    simulation.alphaTarget(0);
                }
                d.fx = null;
                d.fy = null;
            });
    }

    /**
     * Private method: _createSimulation.
     *
     * It creates and starts the force simulation of the given simulation data
     * with a charge, a centering (to the origin), a collision and a link force.
     *
     * @param {SimulationData} simulationData The given simulation data.
     * @returns {ForceSimulation} The started force simulation.
     */
    private _createSimulation(simulationData: SimulationData): ForceSimulation {
        // The charge uses the radius of the drawn node reduced by 1
        const chargeForce = D3_FORCE.forceManyBody<SimNode>().strength(
            (d: SimNode) => (d.r - 1) * FORCES.CHARGE_STRENGTH
        );

        const centerForce = D3_FORCE.forceCenter<SimNode>(0, 0);

        const collideForce = D3_FORCE.forceCollide<SimNode>()
            .strength(FORCES.COLLISION_STRENGTH)
            .radius(FORCES.COLLISION_RADIUS)
            .iterations(2);

        // A link force with id accessor to use named sources and targets
        const linkForce = D3_FORCE.forceLink<SimNode, SimLink>()
            .links(simulationData.links)
            .id((d: SimNode) => d.id)
            .distance(FORCES.LINK_DISTANCE);

        return D3_FORCE.forceSimulation<SimNode, SimLink>()
            .force('charge_force', chargeForce)
            .force('center_force', centerForce)
            .force('collide_force', collideForce)
            .nodes(simulationData.nodes)
            .force('links', linkForce)
            .alpha(1)
            .restart();
    }

    /**
     * Private method: _drawLinks.
     *
     * It draws a path with an arrow marker for each of the given edges.
     *
     * @param {D3Selection} parentSelection The given parent selection.
     * @param {SimEdge[]} edges The given edges.
     * @returns {D3Selection} The selection of the drawn links.
     */
    private _drawLinks(parentSelection: D3Selection, edges: SimEdge[]): D3Selection {
        return parentSelection
            .append('g')
            .attr('class', 'links')
            .selectAll('.link')
            .data(edges)
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('marker-end', `url(#${FORCE_GRAPH_ARROW_MARKER_ID})`);
    }

    /**
     * Private method: _drawLinkTexts.
     *
     * It draws the label for each of the given edges.
     *
     * @param {D3Selection} parentSelection The given parent selection.
     * @param {SimEdge[]} edges The given edges.
     * @returns {D3Selection} The selection of the drawn link texts.
     */
    private _drawLinkTexts(parentSelection: D3Selection, edges: SimEdge[]): D3Selection {
        return parentSelection
            .append('g')
            .attr('class', 'link-texts')
            .selectAll('.link-text')
            .data(edges)
            .enter()
            .append('text')
            .attr('class', 'link-text')
            .text((d: SimEdge) => d.edge.label);
    }

    /**
     * Private method: _drawNodes.
     *
     * It draws a circle for each of the given simulation nodes,
     * with css class and radius by the kind of its graph node,
     * and its label as accessible title (no tab stop).
     *
     * @param {D3Selection} parentSelection The given parent selection.
     * @param {GraphSimNode[]} graphSimNodes The given simulation nodes of the graph nodes.
     * @returns {D3Selection} The selection of the drawn nodes.
     */
    private _drawNodes(parentSelection: D3Selection, graphSimNodes: GraphSimNode[]): D3Selection {
        const nodes = parentSelection
            .append('g')
            .attr('class', 'nodes')
            .selectAll('.node')
            .data(graphSimNodes)
            .enter()
            .append('circle')
            .attr('class', (d: GraphSimNode) => FORCE_GRAPH_UTILS.nodeCssClass(d.graphNode.kind))
            .attr('id', (d: GraphSimNode) => d.graphNode.label)
            .attr('r', (d: GraphSimNode) => d.r)
            .attr('role', 'img');

        nodes.append('title').text((d: GraphSimNode) => d.graphNode.label);

        return nodes;
    }

    /**
     * Private method: _drawNodeTexts.
     *
     * It draws the short name for each of the given simulation nodes.
     *
     * @param {D3Selection} parentSelection The given parent selection.
     * @param {GraphSimNode[]} graphSimNodes The given simulation nodes of the graph nodes.
     * @returns {D3Selection} The selection of the drawn node texts.
     */
    private _drawNodeTexts(parentSelection: D3Selection, graphSimNodes: GraphSimNode[]): D3Selection {
        return parentSelection
            .append('g')
            .attr('class', 'node-texts')
            .selectAll('.node-text')
            .data(graphSimNodes)
            .enter()
            .append('text')
            .attr('class', 'node-text')
            .text((d: GraphSimNode) => d.graphNode.shortName);
    }
}
