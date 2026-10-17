import type { Simulation, SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';

import type { ForceGraphPoint, ForceGraphVisibleNode } from '../force-graph.model';

/**
 * The ForceGraphD3Simulation type.
 *
 * It represents the D3 force simulation of the simulation nodes (steered via a {@link ForceGraphSimulation}).
 */
export type ForceGraphD3Simulation = Simulation<ForceGraphD3SimulationNode, undefined>;

/**
 * The ForceGraphD3SimulationLink type.
 *
 * It represents a link of the D3 force simulation between two simulation nodes (by index).
 */
export type ForceGraphD3SimulationLink = SimulationLinkDatum<ForceGraphD3SimulationNode>;

/**
 * The ForceGraphD3SimulationNode interface.
 *
 * It represents a node of the D3 force simulation of a layout (only radius and position).
 */
export interface ForceGraphD3SimulationNode extends SimulationNodeDatum {
    /**
     * The radius of the node.
     */
    readonly radius: number;
}

/**
 * The ForceGraphSimulation interface.
 *
 * It represents a running force simulation (in a web worker or on the main thread) that can be steered while it runs.
 */
export interface ForceGraphSimulation {
    /**
     * Fixes the node with the given index at the given point and keeps the simulation warm (its neighbours follow).
     */
    readonly pin: (index: number, point: ForceGraphPoint) => void;

    /**
     * Frees the node with the given index, so that the simulation cools down again.
     */
    readonly release: (index: number) => void;

    /**
     * Stops the simulation.
     */
    readonly dispose: () => void;
}

/**
 * The ForceGraphSimulationCommand type.
 *
 * It represents a command to a running simulation: `pin` fixes a dragged node at a point, `release` frees it.
 */
export type ForceGraphSimulationCommand =
    | { readonly type: 'pin'; readonly node: ForceGraphVisibleNode; readonly point: ForceGraphPoint }
    | { readonly type: 'release'; readonly node: ForceGraphVisibleNode };

/**
 * The ForceGraphSimulationConfig interface.
 *
 * It represents the configuration of the force simulation: its alphas, its pace and the forces per graph size.
 */
export interface ForceGraphSimulationConfig {
    /**
     * The strength of the collision force, 0–1 (D3 default: 0.7).
     */
    readonly COLLISION_STRENGTH: number;

    /**
     * The strength of the weak pull of each node towards the center (keeps unconnected parts close).
     */
    readonly GRAVITY_STRENGTH: number;

    /**
     * The time between two steps of the simulation in milliseconds (about one animation frame).
     */
    readonly PROGRESS_INTERVAL_MS: number;

    /**
     * The alpha below which the simulation rests (D3 default: 0.001).
     */
    readonly ALPHA_MIN: number;

    /**
     * The alpha below which the layout only moves gently and may cool down visibly (above `ALPHA_MIN`).
     */
    readonly ALPHA_CALM: number;

    /**
     * The start alpha of a relayout (most nodes keep their positions).
     */
    readonly ALPHA_REHEAT: number;

    /**
     * The alpha target while a node is pinned (D3 default: 0.3; above `ALPHA_MIN`).
     */
    readonly ALPHA_TARGET_DRAG: number;

    /**
     * The forces of small graphs (spacious layout with room for the labels).
     */
    readonly SMALL_GRAPH: ForceGraphSimulationForces;

    /**
     * The forces of large graphs (denser and cheaper layout; a tick takes longer than one frame).
     */
    readonly LARGE_GRAPH: ForceGraphSimulationForces;
}

/**
 * The ForceGraphSimulationForces interface.
 *
 * It represents the tuning of the D3 forces and the cooling down for one graph size (small or large).
 */
export interface ForceGraphSimulationForces {
    /**
     * The distance of linked nodes (D3 default: 30).
     */
    readonly LINK_DISTANCE: number;

    /**
     * The charge per radius unit of a node (negative: repulsion; D3 default: -30).
     */
    readonly CHARGE_STRENGTH: number;

    /**
     * The accuracy of the approximation of the charge force (D3 default: 0.9; higher is coarser).
     */
    readonly CHARGE_THETA: number;

    /**
     * The padding added to the radius of a node for its collision radius.
     */
    readonly COLLISION_PADDING: number;

    /**
     * The number of iterations of the collision force per tick.
     */
    readonly COLLISION_ITERATIONS: number;

    /**
     * The number of ticks until the layout has cooled down (D3 default: 300).
     */
    readonly TICKS: number;

    /**
     * The maximum number of ticks per step of the initial layout, which paces its visible cooling down
     * (`Infinity`: as many ticks as fit into one step).
     */
    readonly INITIAL_STEP_TICKS: number;

    /**
     * The number of ticks until the layout has cooled down after a release of a dragged node.
     */
    readonly RELEASE_TICKS: number;
}

/**
 * The ForceGraphSimulationInput interface.
 *
 * It represents the structured-cloneable input of a simulation (posted to a web worker), indexed like the nodes.
 */
export interface ForceGraphSimulationInput {
    /**
     * The radius of each force graph node.
     */
    readonly radii: Float32Array;

    /**
     * The links as pairs of node indices (source, target, ...); an edge with a middle node has two.
     */
    readonly links: Int32Array;

    /**
     * The known positions of the nodes as pairs (x, y, x, y, ...); NaN for unknown positions.
     */
    readonly positions: Float32Array;

    /**
     * The flag if at least half of the nodes keep a previous position (starts with a lower alpha to keep them).
     */
    readonly isRelayout: boolean;
}

/**
 * The ForceGraphSimulationMessage type.
 *
 * It represents a message to the simulation worker: `start` an input, `pin` and `release` a node by index.
 */
export type ForceGraphSimulationMessage =
    | { readonly type: 'start'; readonly input: ForceGraphSimulationInput }
    | { readonly type: 'pin'; readonly index: number; readonly point: ForceGraphPoint }
    | { readonly type: 'release'; readonly index: number };

/**
 * The ForceGraphSimulationProgress interface.
 *
 * It represents a result of a force graph simulation (reported after every step).
 */
export interface ForceGraphSimulationProgress {
    /**
     * The positions of the nodes as pairs (x, y, x, y, ...), indexed like the simulation input.
     */
    readonly positions: Float32Array;

    /**
     * The flag if the layout only moves gently anymore (alpha below `ALPHA_CALM`) or has settled.
     */
    readonly isCalm: boolean;
}

/**
 * The ForceGraphSimulationScheduler interface.
 *
 * It represents the clock and the timer that pace the steps of a force simulation.
 */
export interface ForceGraphSimulationScheduler {
    /**
     * The current time in milliseconds.
     */
    readonly now: () => number;

    /**
     * Schedules the given callback after the given delay and returns a function that cancels it.
     */
    readonly schedule: (callback: () => void, delayMs: number) => () => void;
}

/**
 * The ForceGraphSimulationWorkerFactory type.
 *
 * It represents a factory of the simulation web worker
 * (undefined if web workers are not available or the worker cannot be created).
 */
export type ForceGraphSimulationWorkerFactory = () => Worker | undefined;
