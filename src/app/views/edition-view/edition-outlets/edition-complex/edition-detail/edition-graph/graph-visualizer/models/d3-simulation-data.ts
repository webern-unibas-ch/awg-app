import { D3SimulationLink } from './d3-simulation-link.model';
import { D3SimulationNodeTriple } from './d3-simulation-node-triple.model';
import { D3SimulationNode } from './d3-simulation-node.model';

/**
 * The D3SimulationData class.
 *
 * It is used in the context of the graph visualizer
 * to store the data of a d3 simulation.
 */
export class D3SimulationData {
    /**
     * The nodes of the simulation data.
     */
    nodes: D3SimulationNode[];

    /**
     * The links of the simulation data.
     */
    links: D3SimulationLink[];

    /**
     * The node triples of the simulation data.
     */
    nodeTriples: D3SimulationNodeTriple[];

    /**
     * Constructor of the D3SimulationData class.
     *
     * It sets the default values of the simulation data (empty arrays).
     */
    constructor() {
        this.nodes = [];
        this.links = [];
        this.nodeTriples = [];
    }
}
