import { EventEmitter } from '@angular/core';

import { D3SimulationNode } from './d3-simulation-node.model';
import { D3SimulationLink } from './d3-simulation-link.model';

import * as d3_force from 'd3-force';

/**
 * Object constant with a set of forces.
 *
 * It provides the default values for the D3 simulation's forces.
 *
 * Available force values: `LINK_DISTANCE`, `COLLISION_STRENGTH`, `CHARGE_STRENGTH`.
 */
const FORCES = {
    LINK_DISTANCE: 1 / 50,
    COLLISION_STRENGTH: 1,
    CHARGE_STRENGTH: -1,
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
     * Private variable: _chargeForce.
     *
     * It keeps the charging force.
     */
    private _chargeForce;

    /**
     * Private variable: _centerForce.
     *
     * It keeps the centering force.
     */
    private _centerForce;

    /**
     * Private variable: _collideForce.
     *
     * It keeps the colliding force.
     */
    private _collideForce;

    /**
     * Private variable: _linkForce.
     *
     * It keeps the linking force.
     */
    private _linkForce;

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

        this._initSimulation(options);
    }

    /**
     * Private method: _initSimulation.
     *
     * It inits the simulation.
     *
     * @param {D3ForceSimulationOptions} options The given simulation options.
     *
     * @returns {void} It inits the simulation.
     */
    private _initSimulation(options: D3ForceSimulationOptions): void {
        if (!options || !options.width || !options.height) {
            throw new Error('Missing options when initializing simulation');
        }

        // Create the simulation
        if (!this.forceSimulation) {
            const ticker = this.ticker;

            // Set up the simulation
            this.forceSimulation = d3_force.forceSimulation();

            this._createForces(options);

            // Add forces to the simulation
            this.forceSimulation
                .force('charge_force', this._chargeForce)
                .force('collide_force', this._collideForce)
                .force('center_force', this._centerForce);

            // Connect the d3 ticker to an angular event emitter
            this.forceSimulation.on('tick', function () {
                ticker.emit(this);
            });

            // Add nodes and links to the simulation
            this._initNodes();
            this._initLinks();
        }

        // Restart the simulation's internal timer
        this.forceSimulation.alpha(1).restart();
    }

    /**
     * Private method: _createForces.
     *
     * It creates the simulation's forces.
     *
     * @param {D3ForceSimulationOptions} options The given simulation options.
     *
     * @returns {void} It creates the simulation's forces.
     */
    private _createForces(options: D3ForceSimulationOptions): void {
        // Create forces
        this._chargeForce = d3_force.forceManyBody().strength((d: D3SimulationNode) => d['r'] * FORCES.CHARGE_STRENGTH);

        this._centerForce = d3_force.forceCenter(options.width / 2, options.height / 2);

        this._collideForce = d3_force
            .forceCollide()
            .strength(FORCES.COLLISION_STRENGTH)
            .radius(d => d['r'] + 5)
            .iterations(2);

        // Create a custom link force with id accessor to use named sources and targets
        this._linkForce = d3_force
            .forceLink()
            .links(this.links)
            .id((d: D3SimulationLink) => d.predicate)
            .distance(FORCES.LINK_DISTANCE); // FORCES.LINKS
    }

    /**
     * Private method: _initLinks.
     *
     * It inits the link force of the simulation.
     *
     * @returns {void} It inits the link force of the simulation.
     */
    private _initLinks(): void {
        if (!this.forceSimulation) {
            throw new Error('Simulation was not initialized yet');
        }
        // Add links to the simulation
        this.forceSimulation.force('links', this._linkForce);
    }

    /**
     * Private method: _initNodes.
     *
     * It inits the nodes of the simulation.
     *
     * @returns {void} It inits the nodes of the simulation.
     */
    private _initNodes(): void {
        if (!this.forceSimulation) {
            throw new Error('Simulation was not initialized yet');
        }
        // Add nodes to the simulation
        this.forceSimulation.nodes(this.nodes);
    }
}
