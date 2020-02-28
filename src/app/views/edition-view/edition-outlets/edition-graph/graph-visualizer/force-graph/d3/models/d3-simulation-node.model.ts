import * as d3_force from 'd3-force';

export enum D3SimulationNodeType {
    link = 'link',
    node = 'node'
}

export class D3SimulationNode implements d3_force.SimulationNodeDatum {
    id: string;
    label: string;
    weight: number;
    type: D3SimulationNodeType;
    owlClass: boolean;
    instance: boolean;

    // optional properties from d3_force.SimulationNodeDatum
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;

    // set default values
    constructor(id: string, weight: number, type: D3SimulationNodeType) {
        this.id = id;
        this.label = id;
        this.weight = weight;
        this.type = type;
        this.owlClass = false;
        this.instance = false;
    }
}
