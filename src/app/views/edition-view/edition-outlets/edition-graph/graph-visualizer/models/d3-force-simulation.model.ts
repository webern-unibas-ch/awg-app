import { EventEmitter } from '@angular/core';

import { D3SimulationNode } from './d3-simulation-node.model';
import { D3SimulationLink } from './d3-simulation-link.model';

import * as d3_force from 'd3-force';

/**
 * Object constant for simulation forces.
 *
 * It provides constant values used for the d3 force simulation.
 */
const FORCES = {
    LINK_DISTANCE: 1 / 50,
    COLLISION_STRENGTH: 1,
    CHARGE_STRENGTH: -1
};

/**
 * The D3Simulation interface.
 *
 * It represents a d3 force simulation.
 */
export interface D3Simulation extends d3_force.Simulation<D3SimulationNode, D3SimulationLink> {}

/**
 * The D3ForceSimulationOptions interface.
 *
 * It represents the options of a d3 force simulation.
 */
export interface D3ForceSimulationOptions {
    /**
     * The width of the simulation options.
     */
    width: number;

    /**
     * The height of the simulation options.
     */
    height: number;
}

/**
 * The D3ForceSimulation class.
 *
 * It is used in the context of the graph visualizer
 * to store the data of a d3 force simulation.
 */
export class D3ForceSimulation {
    /**
     * Public variable: ticker.
     *
     * It keeps an event emitter for the d3 simulation.
     */
    ticker: EventEmitter<D3Simulation> = new EventEmitter();

    /**
     * Public variable: forceSimulation.
     *
     * It keeps the d3 simulation.
     */
    forceSimulation: D3Simulation;

    /**
     * Public variable: nodes.
     *
     * It keeps an array of nodes for the d3 simulation.
     */
    nodes: D3SimulationNode[] = [];

    /**
     * Public variable: links.
     *
     * It keeps an array of links for the d3 simulation.
     */
    links: D3SimulationLink[] = [];

    /**
     * Private variable: chargeForce.
     *
     * It keeps the charging force.
     */
    private chargeForce;

    /**
     * Private variable: centerForce.
     *
     * It keeps the centering force.
     */
    private centerForce;

    /**
     * Private variable: collideForce.
     *
     * It keeps the colliding force.
     */
    private collideForce;

    /**
     * Private variable: linkForce.
     *
     * It keeps the linking force.
     */
    private linkForce;

    /**
     * Constructor of the D3ForceSimulation class.
     *
     * It sets the default values of a force simulation.
     *
     * @param {D3SimulationNode[]} nodes The given nodes array.
     * @param {D3SimulationLink[]} links The given links array.
     * @param {D3ForceSimulationOptions} options The given simulation options.
     */
    constructor(nodes: D3SimulationNode[], links: D3SimulationLink[], options: D3ForceSimulationOptions) {
        this.nodes = nodes;
        this.links = links;

        this.initSimulation(options);
    }

    /**
     * Private method: createForces.
     *
     * It creates the simulation's forces.
     *
     * @param {D3ForceSimulationOptions} options The given simulation options.
     *
     * @returns {void} It creates the simulation's forces.
     */
    private createForces(options: D3ForceSimulationOptions): void {
        // create forces
        this.chargeForce = d3_force.forceManyBody().strength((d: D3SimulationNode) => d['r'] * FORCES.CHARGE_STRENGTH);

        this.centerForce = d3_force.forceCenter(options.width / 2, options.height / 2);

        this.collideForce = d3_force
            .forceCollide()
            .strength(FORCES.COLLISION_STRENGTH)
            .radius(d => d['r'] + 5)
            .iterations(2);

        // create a custom link force with id accessor to use named sources and targets
        this.linkForce = d3_force
            .forceLink()
            .links(this.links)
            .id((d: D3SimulationLink) => d.predicate)
            .distance(FORCES.LINK_DISTANCE); // FORCES.LINKS
    }

    /**
     * Private method: initLinks.
     *
     * It inits the link force of the simulation.
     *
     * @returns {void} It inits the link force of the simulation.
     */
    private initLinks(): void {
        if (!this.forceSimulation) {
            throw new Error('Simulation was not initialized yet');
        }
        // add links to the simulation
        this.forceSimulation.force('links', this.linkForce);
    }

    /**
     * Private method: initNodes.
     *
     * It inits the nodes of the simulation.
     *
     * @returns {void} It inits the nodes of the simulation.
     */
    private initNodes(): void {
        if (!this.forceSimulation) {
            throw new Error('Simulation was not initialized yet');
        }
        // add nodes to the simulation
        this.forceSimulation.nodes(this.nodes);
    }

    /**
     * Private method: initSimulation.
     *
     * It inits the simulation.
     *
     * @param {D3ForceSimulationOptions} options The given simulation options.
     *
     * @returns {void} It inits the simulation.
     */
    private initSimulation(options: D3ForceSimulationOptions): void {
        if (!options || !options.width || !options.height) {
            throw new Error('Missing options when initializing simulation');
        }

        // create the simulation
        if (!this.forceSimulation) {
            const ticker = this.ticker;

            // set up the simulation
            this.forceSimulation = d3_force.forceSimulation();

            this.createForces(options);

            // add forces to the simulation
            this.forceSimulation.force('charge_force', this.chargeForce).force('collide_force', this.collideForce);

            // connect the d3 ticker to an angular event emitter
            this.forceSimulation.on('tick', function () {
                ticker.emit(this);
            });

            // add nodes and links to the simulation
            this.initNodes();
            this.initLinks();
        }

        // update the center force of the simulation
        this.forceSimulation.force('center_force', this.centerForce);

        // restart the simulation's internal timer
        this.forceSimulation.restart();
    }
}
