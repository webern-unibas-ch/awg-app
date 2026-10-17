/*
 * The simulation utils run in a web worker as well as on the main thread:
 * they must only depend on d3-force, pure utils and types (no window, Angular or polyfills).
 */

import * as D3_FORCE from 'd3-force';

import type { ForceGraphPoint } from '../force-graph.model';
import { FORCE_GRAPH_UTILS } from '../force-graph.utils';

import { FORCE_GRAPH_SIMULATION_TRANSFER_UTILS } from './force-graph-simulation-transfer.utils';
import type {
    ForceGraphD3Simulation,
    ForceGraphD3SimulationLink,
    ForceGraphD3SimulationNode,
    ForceGraphSimulation,
    ForceGraphSimulationConfig,
    ForceGraphSimulationForces,
    ForceGraphSimulationInput,
    ForceGraphSimulationProgress,
    ForceGraphSimulationScheduler,
} from './force-graph-simulation.model';

/**
 * Object constant: FORCE_GRAPH_SIMULATION_CONFIG.
 *
 * It keeps the configuration of the force simulation.
 */
export const FORCE_GRAPH_SIMULATION_CONFIG = Object.freeze<ForceGraphSimulationConfig>({
    COLLISION_STRENGTH: 1,
    GRAVITY_STRENGTH: 0.05,
    PROGRESS_INTERVAL_MS: 16,
    ALPHA_MIN: 0.001,
    ALPHA_CALM: 0.02,
    ALPHA_REHEAT: 0.1,
    ALPHA_TARGET_DRAG: 0.1,
    SMALL_GRAPH: Object.freeze<ForceGraphSimulationForces>({
        LINK_DISTANCE: 30,
        CHARGE_STRENGTH: -20,
        CHARGE_THETA: 0.9,
        COLLISION_PADDING: 50,
        COLLISION_ITERATIONS: 2,
        TICKS: 300,
        INITIAL_STEP_TICKS: 6, // About 50 frames (0.8 s) for a new layout, 35 for a relayout
        RELEASE_TICKS: 120,
    }),
    LARGE_GRAPH: Object.freeze<ForceGraphSimulationForces>({
        LINK_DISTANCE: 10,
        CHARGE_STRENGTH: -10,
        CHARGE_THETA: 1.2,
        COLLISION_PADDING: 2,
        COLLISION_ITERATIONS: 1,
        TICKS: 120,
        INITIAL_STEP_TICKS: Infinity,
        RELEASE_TICKS: 60,
    }),
});

/**
 * Object constant: DEFAULT_SIMULATION_SCHEDULER.
 *
 * It keeps the default clock (`performance.now`) and timer (`setTimeout`) of a simulation.
 */
const DEFAULT_SIMULATION_SCHEDULER: ForceGraphSimulationScheduler = {
    now: () => performance.now(),
    schedule: (callback, delayMs) => {
        const timeoutId = setTimeout(callback, delayMs);
        return () => clearTimeout(timeoutId);
    },
};

/**
 * Private utils method: _alpha.
 *
 * It gets the alpha of the given simulation; an empty simulation has nothing to move (alpha 0: settled from the start).
 *
 * @param {ForceGraphD3Simulation} d3Simulation The given D3 simulation.
 * @returns {number} The alpha.
 */
function _alpha(d3Simulation: ForceGraphD3Simulation): number {
    return d3Simulation.nodes().length === 0 ? 0 : d3Simulation.alpha();
}

/**
 * Private utils method: _createD3Simulation.
 *
 * It creates the stopped D3 force simulation (charge, centering, gravity, collision and link force)
 * of the given simulation nodes and links with the given forces.
 *
 * @param {ForceGraphD3SimulationNode[]} nodes The given simulation nodes.
 * @param {ForceGraphD3SimulationLink[]} links The given links (by node index).
 * @param {ForceGraphSimulationForces} forces The given forces (of small or large graphs).
 * @param {number} alphaDecay The given alpha decay (cooling down).
 * @param {boolean} isRelayout The flag if the layout is a relayout of a known graph (starts with a lower alpha).
 * @returns {ForceGraphD3Simulation} The stopped force simulation.
 */
function _createD3Simulation(
    nodes: ForceGraphD3SimulationNode[],
    links: ForceGraphD3SimulationLink[],
    forces: ForceGraphSimulationForces,
    alphaDecay: number,
    isRelayout: boolean
): ForceGraphD3Simulation {
    const { ALPHA_MIN, ALPHA_REHEAT, COLLISION_STRENGTH, GRAVITY_STRENGTH } = FORCE_GRAPH_SIMULATION_CONFIG;
    const { CHARGE_STRENGTH, CHARGE_THETA, COLLISION_ITERATIONS, COLLISION_PADDING, LINK_DISTANCE } = forces;

    // The charge uses the radius of the node reduced by 1
    const chargeForce = D3_FORCE.forceManyBody<ForceGraphD3SimulationNode>()
        .strength((d: ForceGraphD3SimulationNode) => (d.radius - 1) * CHARGE_STRENGTH)
        .theta(CHARGE_THETA);

    const collideForce = D3_FORCE.forceCollide<ForceGraphD3SimulationNode>()
        .strength(COLLISION_STRENGTH)
        .radius((d: ForceGraphD3SimulationNode) => d.radius + COLLISION_PADDING)
        .iterations(COLLISION_ITERATIONS);

    // Links refer to the nodes by index (default id accessor)
    const linkForce = D3_FORCE.forceLink<ForceGraphD3SimulationNode, ForceGraphD3SimulationLink>(links).distance(
        LINK_DISTANCE
    );

    return (
        D3_FORCE.forceSimulation<ForceGraphD3SimulationNode>(nodes)
            .stop()
            .alphaMin(ALPHA_MIN)
            .alphaDecay(alphaDecay)
            .alpha(isRelayout ? ALPHA_REHEAT : 1)
            .force('charge', chargeForce)
            .force('center', D3_FORCE.forceCenter<ForceGraphD3SimulationNode>(0, 0))
            // A weak pull towards the center keeps unconnected parts close (forceCenter only moves the mean)
            .force('gravityX', D3_FORCE.forceX<ForceGraphD3SimulationNode>(0).strength(GRAVITY_STRENGTH))
            .force('gravityY', D3_FORCE.forceY<ForceGraphD3SimulationNode>(0).strength(GRAVITY_STRENGTH))
            .force('collide', collideForce)
            .force('link', linkForce)
    );
}

/**
 * Private utils method: _findD3Node.
 *
 * It finds the simulation node at the given index, if it is a valid index of the given simulation nodes
 * (the index of a command comes from a worker message).
 *
 * @param {ForceGraphD3SimulationNode[]} d3Nodes The given simulation nodes.
 * @param {number} index The given index.
 * @returns {ForceGraphD3SimulationNode | undefined} The simulation node, if any.
 */
function _findD3Node(d3Nodes: ForceGraphD3SimulationNode[], index: number): ForceGraphD3SimulationNode | undefined {
    const isValidIndex = Number.isInteger(index) && index >= 0 && index < d3Nodes.length;
    return isValidIndex ? d3Nodes.at(index) : undefined;
}

/**
 * Private utils method: _fixNode.
 *
 * It fixes the node at the given index (if valid) at once at the given point, or frees it without a point.
 *
 * @param {ForceGraphD3SimulationNode[]} d3Nodes The given simulation nodes.
 * @param {number} index The given index of the node.
 * @param {ForceGraphPoint} [point] The given point (in graph coordinates).
 * @returns {boolean} The flag if the node has been fixed or freed (false for an invalid index).
 */
function _fixNode(d3Nodes: ForceGraphD3SimulationNode[], index: number, point?: ForceGraphPoint): boolean {
    const d3Node = _findD3Node(d3Nodes, index);
    if (!d3Node) {
        return false;
    }
    if (point) {
        d3Node.x = point.x;
        d3Node.y = point.y;
        d3Node.vx = 0;
        d3Node.vy = 0;
    }
    d3Node.fx = point?.x ?? null;
    d3Node.fy = point?.y ?? null;
    return true;
}

/**
 * Private utils method: _isSettled.
 *
 * It checks if the given simulation has settled (alpha below `ALPHA_MIN`).
 * A pinned node keeps alpha near `ALPHA_TARGET_DRAG`, so a simulation with a pinned node never settles.
 *
 * @param {ForceGraphD3Simulation} d3Simulation The given D3 simulation.
 * @returns {boolean} The result of the check.
 */
function _isSettled(d3Simulation: ForceGraphD3Simulation): boolean {
    return _alpha(d3Simulation) < FORCE_GRAPH_SIMULATION_CONFIG.ALPHA_MIN;
}

/**
 * Private utils method: _runTicks.
 *
 * It ticks the given simulation at least once, until it has settled, the given number of ticks is done
 * or the interval (`PROGRESS_INTERVAL_MS`) is used up.
 *
 * @param {ForceGraphD3Simulation} d3Simulation The given D3 simulation.
 * @param {number} maxTicks The given maximum number of ticks.
 * @param {ForceGraphSimulationScheduler} scheduler The given clock and timer.
 * @returns {number} The time the ticks took (in milliseconds).
 */
function _runTicks(
    d3Simulation: ForceGraphD3Simulation,
    maxTicks: number,
    scheduler: ForceGraphSimulationScheduler
): number {
    const startTime = scheduler.now();
    let ticks = 0;

    const hasTicksLeft = (): boolean => ticks < maxTicks;
    const hasTimeLeft = (): boolean => scheduler.now() - startTime < FORCE_GRAPH_SIMULATION_CONFIG.PROGRESS_INTERVAL_MS;

    do {
        d3Simulation.tick();
        ticks++;
    } while (!_isSettled(d3Simulation) && hasTicksLeft() && hasTimeLeft());

    return scheduler.now() - startTime;
}

/**
 * Private utils method: _toAlphaDecay.
 *
 * It gets the alpha decay that cools a simulation down from the given start alpha
 * to the minimum alpha within the given number of ticks.
 *
 * @param {number} alphaStart The given start alpha.
 * @param {number} ticks The given number of ticks.
 * @returns {number} The alpha decay.
 */
function _toAlphaDecay(alphaStart: number, ticks: number): number {
    return 1 - Math.pow(FORCE_GRAPH_SIMULATION_CONFIG.ALPHA_MIN / alphaStart, 1 / ticks);
}

/**
 * Private utils method: _toD3SimulationLinks.
 *
 * It creates the links of the simulation from the given pairs of node indices.
 *
 * @param {Int32Array} links The given links as pairs of node indices (source, target, ...).
 * @returns {ForceGraphD3SimulationLink[]} The links (by node index).
 */
function _toD3SimulationLinks(links: Int32Array): ForceGraphD3SimulationLink[] {
    const d3Links: ForceGraphD3SimulationLink[] = [];
    for (let index = 0; index < links.length; index += 2) {
        const sourceIndex = links[index];
        const targetIndex = links[index + 1];
        d3Links.push({ source: sourceIndex, target: targetIndex });
    }
    return d3Links;
}

/**
 * Private utils method: _toD3SimulationNodes.
 *
 * It creates the simulation nodes from the given radii and positions;
 * nodes without a known position (NaN) are placed by d3 (phyllotaxis arrangement).
 *
 * @param {Float32Array} radii The given radius of each node.
 * @param {Float32Array} positions The given positions as pairs (x, y, x, y, ...).
 * @returns {ForceGraphD3SimulationNode[]} The simulation nodes.
 */
function _toD3SimulationNodes(radii: Float32Array, positions: Float32Array): ForceGraphD3SimulationNode[] {
    return Array.from(radii, (radius, index) => {
        const point = FORCE_GRAPH_SIMULATION_TRANSFER_UTILS.getPosition(positions, index);
        return FORCE_GRAPH_UTILS.isPositioned(point) ? { radius, ...point } : { radius };
    });
}

/**
 * Utils method: startSimulation.
 *
 * It starts the D3 force simulation of the given input and runs it in steps (about one per frame),
 * reporting the positions after each step. Once settled, it rests until a node is pinned.
 * A failing step stops the simulation and is reported to the given error callback.
 *
 * @param {ForceGraphSimulationInput} input The given simulation input.
 * @param {(progress: ForceGraphSimulationProgress) => void} onProgress The callback for the progress of each step.
 * @param {(error: unknown) => void} onError The callback for the error of a failing step.
 * @param {ForceGraphSimulationScheduler} [scheduler] The given clock and timer (default: `performance`, `setTimeout`).
 * @returns {ForceGraphSimulation} The handle to pin, release and dispose the simulation.
 */
export function startSimulation(
    input: ForceGraphSimulationInput,
    onProgress: (progress: ForceGraphSimulationProgress) => void,
    onError: (error: unknown) => void,
    scheduler: ForceGraphSimulationScheduler = DEFAULT_SIMULATION_SCHEDULER
): ForceGraphSimulation {
    const { radii, links, positions, isRelayout } = input;
    const { ALPHA_CALM, ALPHA_TARGET_DRAG, LARGE_GRAPH, PROGRESS_INTERVAL_MS, SMALL_GRAPH } =
        FORCE_GRAPH_SIMULATION_CONFIG;

    const d3Nodes = _toD3SimulationNodes(radii, positions);
    const d3Links = _toD3SimulationLinks(links);
    const forces = FORCE_GRAPH_UTILS.isLargeGraph(d3Nodes.length) ? LARGE_GRAPH : SMALL_GRAPH;

    // The simulation cools down within the ticks, after a release faster within the release ticks
    const alphaDecay = _toAlphaDecay(1, forces.TICKS);
    const releaseAlphaDecay = _toAlphaDecay(ALPHA_TARGET_DRAG, forces.RELEASE_TICKS);

    const d3Simulation = _createD3Simulation(d3Nodes, d3Links, forces, alphaDecay, isRelayout);

    let isInitialLayout = true;
    let cancelStep: (() => void) | undefined;

    // The steps run in timer callbacks: their errors are reported (they would be uncaught otherwise)
    const step = (): void => {
        try {
            // The initial layout runs several ticks per step, later steps (e.g. while dragging) one tick
            const maxTicks = isInitialLayout ? forces.INITIAL_STEP_TICKS : 1;
            const tickTime = _runTicks(d3Simulation, maxTicks, scheduler);
            // Steps start one interval apart (the next one right away if the ticks took longer)
            const delay = Math.max(0, PROGRESS_INTERVAL_MS - tickTime);
            const isSettled = _isSettled(d3Simulation);

            // The positions change with every step (and their buffer is transferred to the main thread)
            onProgress({
                positions: FORCE_GRAPH_SIMULATION_TRANSFER_UTILS.packPositions(d3Nodes),
                isCalm: _alpha(d3Simulation) < ALPHA_CALM,
            });

            // The initial layout ends once settled (or on the first pin)
            isInitialLayout &&= !isSettled;

            // Once settled, the simulation rests until the next pin
            cancelStep = isSettled ? undefined : scheduler.schedule(step, delay);
        } catch (error) {
            // A failed simulation stops (the stale cancel of the step keeps a pin from waking it up)
            onError(error);
        }
    };

    cancelStep = scheduler.schedule(step, 0);

    return {
        pin: (index, point) => {
            const isPinned = _fixNode(d3Nodes, index, point);
            if (!isPinned) {
                return;
            }
            d3Simulation.alphaTarget(ALPHA_TARGET_DRAG).alphaDecay(alphaDecay);
            isInitialLayout = false;
            // Wakes up a resting simulation
            cancelStep ??= scheduler.schedule(step, PROGRESS_INTERVAL_MS);
        },
        release: index => {
            const isReleased = _fixNode(d3Nodes, index);
            if (!isReleased) {
                return;
            }
            d3Simulation.alphaTarget(0).alphaDecay(releaseAlphaDecay);
        },
        dispose: () => cancelStep?.(),
    };
}

/**
 * Utils constants: FORCE_GRAPH_SIMULATION_UTILS.
 *
 * It keeps a namespace reference to the force graph simulation utils methods.
 */
export const FORCE_GRAPH_SIMULATION_UTILS = {
    startSimulation,
} as const;
