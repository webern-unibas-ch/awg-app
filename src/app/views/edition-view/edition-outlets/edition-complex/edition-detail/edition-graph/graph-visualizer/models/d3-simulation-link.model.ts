import { D3SimulationNode } from './d3-simulation-node.model';

import * as d3_force from 'd3-force';

/**
 * Type alias: D3SimulationNodeOrStringOrNumber.
 *
 * Represents a union of D3SimulationNode or string or number type.
 */
type D3SimulationNodeOrStringOrNumber = D3SimulationNode | string | number;

/**
 * The D3SimulationLink class.
 *
 * It is used in the context of the graph visualizer
 * to store the data of a d3 simulation link.
 */
export class D3SimulationLink implements d3_force.SimulationLinkDatum<D3SimulationNode> {
    /**
     * The source of the simulation link.
     */
    source: D3SimulationNodeOrStringOrNumber;

    /**
     * The target of the simulation link.
     */
    target: D3SimulationNodeOrStringOrNumber;

    /**
     * The predicate of the simulation link.
     */
    predicate: string;

    /**
     * The weight of the simulation link.
     */
    weight: number;

    /**
     * The index of the simulation link.
     *
     * optional property from d3.SimulationLinkDatum
     */
    index?: number;

    /**
     * Constructor of the D3SimulationLink class.
     *
     * It sets the default values of a simulation link.
     *
     * @param {D3SimulationNodeOrStringOrNumber} source The given source.
     * @param {D3SimulationNodeOrStringOrNumber} target The given target.
     */
    constructor(source: D3SimulationNodeOrStringOrNumber, target: D3SimulationNodeOrStringOrNumber) {
        const blankLabel = '';

        this.source = source;
        this.target = target;
        this.predicate = blankLabel;
        this.weight = 1;
    }
}
