import { D3SimulationNode } from './d3-simulation-node.model';

/**
 * The D3SimulationNodeTriple class.
 *
 * It is used in the context of the graph visualizer
 * to store the data of a d3 simulation nodeTriple.
 */
export class D3SimulationNodeTriple {
    /**
     * The subject of the simulation nodeTriple.
     */
    nodeSubject: D3SimulationNode;

    /**
     * The predicate of the simulation nodeTriple.
     */
    nodePredicate: D3SimulationNode;

    /**
     * The object of the simulation nodeTriple.
     */
    nodeObject: D3SimulationNode;

    /**
     * Constructor of the D3SimulationNodeTriple class.
     *
     * It sets the default values of a simulation nodeTriple.
     *
     * @param {D3SimulationNode} nodeSubject The given nodeTriple subject.
     * @param {D3SimulationNode} nodePredicate The given nodeTriple predicate.
     * @param {D3SimulationNode} nodeObject The given nodeTriple object.
     */
    constructor(nodeSubject: D3SimulationNode, nodePredicate: D3SimulationNode, nodeObject: D3SimulationNode) {
        this.nodeSubject = nodeSubject;
        this.nodePredicate = nodePredicate;
        this.nodeObject = nodeObject;
    }
}
