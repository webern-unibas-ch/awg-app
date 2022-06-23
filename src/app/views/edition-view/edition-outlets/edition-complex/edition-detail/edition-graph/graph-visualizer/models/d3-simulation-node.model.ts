import * as d3_force from 'd3-force';

/**
 * The D3SimulationNodeType enumeration.
 *
 * It stores the possible node types.
 */
export enum D3SimulationNodeType {
    link = 'link',
    node = 'node',
}

/**
 * The D3SimulationNode class.
 *
 * It is used in the context of the graph visualizer
 * to store the data of a d3 simulation node.
 */
export class D3SimulationNode implements d3_force.SimulationNodeDatum {
    /**
     * The id of the simulation node.
     */
    id: string;

    /**
     * The label of the simulation node.
     */
    label: string;

    /**
     * The weigth of the simulation node.
     */
    weight: number;

    /**
     * The type of the simulation node.
     */
    type: D3SimulationNodeType;

    /**
     * A boolean flag if the simulation node is a owlClass.
     */
    owlClass: boolean;

    /**
     * A boolean flag if the simulation node is an instance.
     */
    instance: boolean;

    /**
     * The index of the simulation node.
     *
     * optional property from d3.SimulationLinkDatum
     */
    index?: number;

    /**
     * The x value of the simulation node.
     *
     * optional property from d3.SimulationLinkDatum
     */
    x?: number;

    /**
     * The y value of the simulation node.
     *
     * optional property from d3.SimulationLinkDatum
     */
    y?: number;

    /**
     * The vx value of the simulation node.
     *
     * optional property from d3.SimulationLinkDatum
     */
    vx?: number;

    /**
     * The vy value of the simulation node.
     *
     * optional property from d3.SimulationLinkDatum
     */
    vy?: number;

    /**
     * The fx value of the simulation node.
     *
     * optional property from d3.SimulationLinkDatum
     */
    fx?: number | null;

    /**
     * The fy value of the simulation node.
     *
     * optional property from d3.SimulationLinkDatum
     */
    fy?: number | null;

    /**
     * Constructor of the D3SimulationNode class.
     *
     * It sets the default values of a simulation node.
     *
     * @param {string} id The given node id.
     * @param {D3SimulationNodeType} type The given node type.
     */
    constructor(id: string, type: D3SimulationNodeType) {
        this.id = id;
        this.label = id;
        this.weight = 1;
        this.type = type;
        this.owlClass = false;
        this.instance = false;
    }
}
