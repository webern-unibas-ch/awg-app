import { EventEmitter } from '@angular/core';

import { D3SimulationNode } from './d3-simulation-node.model';
import { D3SimulationLink } from './d3-simulation-link.model';

import * as d3_force from 'd3-force';

const FORCES = {
    LINK_DISTANCE: 1 / 50,
    COLLISION_STRENGTH: 1,
    CHARGE_STRENGTH: -1
};

export interface D3Simulation extends d3_force.Simulation<D3SimulationNode, D3SimulationLink> {}

export interface D3ForceSimulationOptions {
    width: number;
    height: number;
}

export class D3ForceSimulation {
    ticker: EventEmitter<D3Simulation> = new EventEmitter();
    forceSimulation: D3Simulation;

    nodes: D3SimulationNode[] = [];
    links: D3SimulationLink[] = [];

    private chargeForce;
    private centerForce;
    private collideForce;
    private linkForce;

    constructor(nodes: D3SimulationNode[], links: D3SimulationLink[], options: D3ForceSimulationOptions) {
        this.nodes = nodes;
        this.links = links;

        this.initSimulation(options);
    }

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

    private initLinks(): void {
        if (!this.forceSimulation) {
            throw new Error('Simulation was not initialized yet');
        }
        // add links to the simulation
        this.forceSimulation.force('links', this.linkForce);
    }

    private initNodes(): void {
        if (!this.forceSimulation) {
            throw new Error('Simulation was not initialized yet');
        }
        // add nodes to the simulation
        this.forceSimulation.nodes(this.nodes);
    }

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
            this.forceSimulation.on('tick', function() {
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
