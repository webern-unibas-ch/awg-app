import { D3SimulationNode } from './d3-simulation-node.model';

import * as d3_force from 'd3-force';

export class D3SimulationLink implements d3_force.SimulationLinkDatum<D3SimulationNode> {
    source: D3SimulationNode | string | number;
    target: D3SimulationNode | string | number;

    predicate: string;
    weight: number;

    // optional properties from d3.SimulationLinkDatum
    index?: number;

    // set default values
    //  source: predNode, target: objNode, predicate: blankLabel, weight: 1
    constructor(
        source: D3SimulationNode | string | number,
        target: D3SimulationNode | string | number,
        predicate: string,
        weight: number
    ) {
        this.source = source;
        this.target = target;
        this.predicate = predicate;
        this.weight = weight;
    }
}
