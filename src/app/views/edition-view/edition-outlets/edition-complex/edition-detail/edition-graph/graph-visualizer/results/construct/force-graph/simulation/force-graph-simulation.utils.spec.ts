import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { ResultGraph } from '@awg-graph/graph-visualizer/models/result-graph.model';

import { ForceGraphData } from '../force-graph.model';
import { FORCE_GRAPH_LARGE_NODE_COUNT, FORCE_GRAPH_UTILS } from '../force-graph.utils';

import { FORCE_GRAPH_SIMULATION_TRANSFER_UTILS, toSimulationInput } from './force-graph-simulation-transfer.utils';
import {
    ForceGraphSimulation,
    ForceGraphSimulationInput,
    ForceGraphSimulationProgress,
    ForceGraphSimulationScheduler,
} from './force-graph-simulation.model';
import {
    FORCE_GRAPH_SIMULATION_CONFIG,
    FORCE_GRAPH_SIMULATION_UTILS,
    startSimulation,
} from './force-graph-simulation.utils';

/**
 * The FakeScheduler class.
 *
 * It stands in for the scheduler of a simulation: its clock advances by the given time step on every call,
 * its timer keeps the scheduled step of the simulation to run it on demand.
 * With a time step of `PROGRESS_INTERVAL_MS`, every step of the initial layout runs one tick.
 */
class FakeScheduler implements ForceGraphSimulationScheduler {
    pendingStep: (() => void) | undefined;

    readonly schedule: Mock<ForceGraphSimulationScheduler['schedule']> = vi.fn(callback => {
        this.pendingStep = callback;
        return () => (this.pendingStep = undefined);
    });

    private _time = 0;

    constructor(private readonly _timeStep: number = FORCE_GRAPH_SIMULATION_CONFIG.PROGRESS_INTERVAL_MS) {}

    /**
     * Advances the clock by the time step.
     */
    now(): number {
        this._time += this._timeStep;
        return this._time;
    }

    /**
     * Runs the scheduled step, if any.
     */
    runStep(): void {
        const step = this.pendingStep;
        this.pendingStep = undefined;
        step?.();
    }

    /**
     * Runs the scheduled steps until the simulation rests.
     */
    runUntilSettled(): void {
        while (this.pendingStep) {
            this.runStep();
        }
    }
}

/**
 * Helper function: startSimulationWith.
 *
 * It starts the simulation of the given input with the given scheduler and collects all reported results and errors.
 */
const startSimulationWith = (
    input: ForceGraphSimulationInput,
    scheduler: FakeScheduler
): { simulation: ForceGraphSimulation; results: ForceGraphSimulationProgress[]; errors: unknown[] } => {
    const results: ForceGraphSimulationProgress[] = [];
    const errors: unknown[] = [];
    const simulation = startSimulation(
        input,
        progress => results.push(progress),
        error => errors.push(error),
        scheduler
    );
    return { simulation, results, errors };
};

/**
 * Helper function: collectProgress.
 *
 * It runs the simulation of the given input until it has settled and collects all reported results.
 */
const collectProgress = (
    input: ForceGraphSimulationInput,
    scheduler = new FakeScheduler()
): ForceGraphSimulationProgress[] => {
    const { results } = startSimulationWith(input, scheduler);
    scheduler.runUntilSettled();
    return results;
};

/**
 * Helper function: createSimulationInput.
 *
 * It creates the simulation input of a chain of the given number of nodes (without known positions).
 */
const createSimulationInput = (nodeCount: number, isRelayout = false): ForceGraphSimulationInput => {
    const links = new Int32Array(Math.max(nodeCount - 1, 0) * 2);
    for (let index = 0; index < nodeCount - 1; index++) {
        links[2 * index] = index;
        links[2 * index + 1] = index + 1;
    }
    return {
        radii: new Float32Array(nodeCount).fill(9),
        links,
        positions: new Float32Array(nodeCount * 2).fill(NaN),
        isRelayout,
    };
};

describe('ForceGraphSimulationUtils (DONE)', () => {
    let forceGraphData: ForceGraphData;

    const { LARGE_GRAPH, SMALL_GRAPH } = FORCE_GRAPH_SIMULATION_CONFIG;

    const resultGraph: ResultGraph = {
        nodes: [
            { id: 'a', shortName: 'ex:a', label: 'A', kind: 'instance' },
            { id: 'b', shortName: 'ex:b', label: 'ex:b', kind: 'class' },
            { id: 'c', shortName: 'ex:c', label: 'ex:c', kind: 'blank' },
        ],
        edges: [
            { id: 'e0', source: 'a', target: 'b', label: 'rdf:type' },
            { id: 'e1', source: 'a', target: 'c', label: 'ex:has' },
            { id: 'e2', source: 'c', target: 'a', label: 'ex:back' },
        ],
        tripleCount: 3,
    };

    beforeEach(() => {
        // Nodes a, b, c and the middle node of the repeated edge e2
        forceGraphData = FORCE_GRAPH_UTILS.toForceGraphData(resultGraph);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    describe('FORCE_GRAPH_SIMULATION_UTILS', () => {
        it('... should reference all force graph simulation utils methods', () => {
            expectToEqual(FORCE_GRAPH_SIMULATION_UTILS, { startSimulation });
        });
    });

    describe('FORCE_GRAPH_SIMULATION_CONFIG', () => {
        it('... should hold the expected configuration', () => {
            expectToEqual(FORCE_GRAPH_SIMULATION_CONFIG, {
                COLLISION_STRENGTH: 1,
                GRAVITY_STRENGTH: 0.05,
                PROGRESS_INTERVAL_MS: 16,
                ALPHA_MIN: 0.001,
                ALPHA_CALM: 0.02,
                ALPHA_REHEAT: 0.1,
                ALPHA_TARGET_DRAG: 0.1,
                SMALL_GRAPH: {
                    LINK_DISTANCE: 30,
                    CHARGE_STRENGTH: -20,
                    CHARGE_THETA: 0.9,
                    COLLISION_PADDING: 50,
                    COLLISION_ITERATIONS: 2,
                    TICKS: 300,
                    INITIAL_STEP_TICKS: 6,
                    RELEASE_TICKS: 120,
                },
                LARGE_GRAPH: {
                    LINK_DISTANCE: 10,
                    CHARGE_STRENGTH: -10,
                    CHARGE_THETA: 1.2,
                    COLLISION_PADDING: 2,
                    COLLISION_ITERATIONS: 1,
                    TICKS: 120,
                    INITIAL_STEP_TICKS: Infinity,
                    RELEASE_TICKS: 60,
                },
            });
        });

        it('... should be frozen (with the forces of small and large graphs)', () => {
            expectToBe(Object.isFrozen(FORCE_GRAPH_SIMULATION_CONFIG), true);
            expectToBe(Object.isFrozen(SMALL_GRAPH), true);
            expectToBe(Object.isFrozen(LARGE_GRAPH), true);
        });
    });

    describe('METHODS', () => {
        describe('#startSimulation()', () => {
            it('... should have a method `startSimulation`', () => {
                expect(startSimulation).toBeDefined();
            });

            it('... should compute the simulation in scheduled steps (not on start)', () => {
                const scheduler = new FakeScheduler();
                const { results } = startSimulationWith(createSimulationInput(10), scheduler);

                expectToBe(results.length, 0);
                expectSpyCall(scheduler.schedule, 1, [expect.any(Function), 0]);
            });

            it('... should report the result of every step until the simulation has settled', () => {
                const scheduler = new FakeScheduler();
                const { results } = startSimulationWith(toSimulationInput(forceGraphData), scheduler);
                let stepCount = 0;

                while (scheduler.pendingStep) {
                    scheduler.runStep();
                    stepCount++;
                }

                expect(stepCount).toBeGreaterThan(1);
                expectToBe(results.length, stepCount);
            });

            it('... should report the layout as calm before it has settled (and from then on)', () => {
                const results = collectProgress(createSimulationInput(10));
                const firstCalmIndex = results.findIndex(result => result.isCalm);
                const calmResults = results.slice(firstCalmIndex);

                expect(firstCalmIndex).toBeGreaterThan(0);
                expect(firstCalmIndex).toBeLessThan(results.length - 1);
                calmResults.forEach(result => expectToBe(result.isCalm, true));
            });

            it('... should report the layout as calm once alpha is below ALPHA_CALM', () => {
                const ticksUntilCalm =
                    collectProgress(createSimulationInput(10)).findIndex(result => result.isCalm) + 1;
                // Alpha decays from 1 to ALPHA_MIN within TICKS (one tick per step with the default fake scheduler)
                const { ALPHA_CALM, ALPHA_MIN } = FORCE_GRAPH_SIMULATION_CONFIG;
                const expectedTicks = Math.ceil((SMALL_GRAPH.TICKS * Math.log(ALPHA_CALM)) / Math.log(ALPHA_MIN));

                expect(Math.abs(ticksUntilCalm - expectedTicks)).toBeLessThanOrEqual(1);
            });

            it('... should rest once the simulation has settled (no further step scheduled)', () => {
                const scheduler = new FakeScheduler();

                collectProgress(createSimulationInput(10), scheduler);

                expect(scheduler.pendingStep).toBeUndefined();
            });

            it('... should run as many ticks per step of the initial layout as fit into PROGRESS_INTERVAL_MS', () => {
                const halfInterval = FORCE_GRAPH_SIMULATION_CONFIG.PROGRESS_INTERVAL_MS / 2;
                // One tick per interval: one step per tick, two ticks per interval: one step per two ticks
                const stepCountPerTick = collectProgress(createSimulationInput(10)).length;
                const stepCountPerTwoTicks = collectProgress(
                    createSimulationInput(10),
                    new FakeScheduler(halfInterval)
                ).length;

                expectToBe(stepCountPerTwoTicks, Math.ceil(stepCountPerTick / 2));
            });

            it('... should run at most INITIAL_STEP_TICKS ticks per step of the initial layout of a small graph', () => {
                // A frozen clock: the interval never runs out
                const stepCount = collectProgress(createSimulationInput(10), new FakeScheduler(0)).length;

                expect(stepCount).toBeGreaterThanOrEqual(Math.ceil(SMALL_GRAPH.TICKS / SMALL_GRAPH.INITIAL_STEP_TICKS));
                expect(stepCount).toBeLessThanOrEqual(
                    Math.ceil((SMALL_GRAPH.TICKS + 1) / SMALL_GRAPH.INITIAL_STEP_TICKS)
                );
            });

            it('... should start the steps of the initial layout one interval apart', () => {
                // A frozen clock: the ticks of a step take no time
                const scheduler = new FakeScheduler(0);
                startSimulationWith(createSimulationInput(10), scheduler);

                scheduler.runStep();

                expect(scheduler.schedule).toHaveBeenLastCalledWith(
                    expect.any(Function),
                    FORCE_GRAPH_SIMULATION_CONFIG.PROGRESS_INTERVAL_MS
                );
            });

            // A real layout of a large graph takes several seconds with coverage instrumentation
            it(
                '... should report only the settled result if the initial layout of a large graph cools down within one interval',
                { timeout: 30000 },
                () => {
                    const results = collectProgress(
                        createSimulationInput(FORCE_GRAPH_LARGE_NODE_COUNT),
                        new FakeScheduler(0)
                    );

                    expectToBe(results.length, 1);
                    expectToBe(results[0].isCalm, true);
                }
            );

            it('... should hold finite positions for all nodes', () => {
                const results = collectProgress(toSimulationInput(forceGraphData));
                const { positions } = results[results.length - 1];
                const hasFinitePositions = Array.from(positions).every(Number.isFinite);

                expectToBe(positions.length, forceGraphData.nodes.length * 2);
                expectToBe(hasFinitePositions, true);
            });

            // With the default fake scheduler, every step runs one tick
            it('... should cool down within the default number of ticks for a small graph', () => {
                const ticks = collectProgress(createSimulationInput(10)).length;

                expect(ticks).toBeGreaterThanOrEqual(SMALL_GRAPH.TICKS);
                expect(ticks).toBeLessThanOrEqual(SMALL_GRAPH.TICKS + 1);
            });

            // A real layout of a large graph takes several seconds with coverage instrumentation
            it('... should cool down faster for a large graph', { timeout: 30000 }, () => {
                const ticks = collectProgress(createSimulationInput(FORCE_GRAPH_LARGE_NODE_COUNT)).length;

                expect(ticks).toBeGreaterThanOrEqual(LARGE_GRAPH.TICKS);
                expect(ticks).toBeLessThanOrEqual(LARGE_GRAPH.TICKS + 1);
            });

            it('... should start with a reduced alpha (fewer ticks) for a relayout', () => {
                const ticks = collectProgress(createSimulationInput(10, true)).length;

                expect(ticks).toBeLessThan(SMALL_GRAPH.TICKS);
            });

            it('... should pull unconnected nodes towards the center (gravity)', () => {
                // Two unlinked nodes start far apart (the charge alone would keep them there)
                const input = { ...createSimulationInput(2), links: new Int32Array(0) };
                input.positions.set([-1000, 0, 1000, 0]);

                const results = collectProgress(input);
                const { positions } = results[results.length - 1];
                const distance = Math.hypot(positions[2] - positions[0], positions[3] - positions[1]);

                expect(distance).toBeLessThan(1000);
            });

            it('... should keep the nodes of a small graph at least their collision radii apart', () => {
                // Two unlinked nodes (radius 9) start almost at the same position
                const input = { ...createSimulationInput(2), links: new Int32Array(0) };
                input.positions.set([0, 0, 0, 1]);
                const collisionRadius = 9 + SMALL_GRAPH.COLLISION_PADDING;

                const results = collectProgress(input);
                const { positions } = results[results.length - 1];
                const distance = Math.hypot(positions[2] - positions[0], positions[3] - positions[1]);

                expect(distance).toBeGreaterThanOrEqual(collisionRadius);
            });

            it('... should start from the known positions', () => {
                // The second node starts directly below the first one
                const input = createSimulationInput(2);
                input.positions.set([100, 100, 100, 110]);

                const results = collectProgress(input);
                const { positions } = results[results.length - 1];
                // All forces act along the vertical axis, so the nodes stay vertically aligned (centered at the origin)
                const horizontalOffset = Math.abs(positions[0] - positions[2]);

                expect(horizontalOffset).toBeLessThan(0.001);
                expect(positions[3]).toBeGreaterThan(positions[1]);
            });

            it('... should report only one settled result for an empty input', () => {
                const results = collectProgress(createSimulationInput(0));

                expectToEqual(results, [{ positions: new Float32Array(0), isCalm: true }]);
            });

            it('... should use `performance.now` and `setTimeout` as default scheduler', () => {
                vi.useFakeTimers();
                const nowSpy = vi.spyOn(performance, 'now');
                const results: ForceGraphSimulationProgress[] = [];

                startSimulation(
                    createSimulationInput(2),
                    progress => results.push(progress),
                    () => {}
                );
                vi.runAllTimers();

                expect(nowSpy).toHaveBeenCalled();
                expect(results.length).toBeGreaterThan(0);
                // The settled simulation rests (no timer left)
                expectToBe(vi.getTimerCount(), 0);
            });

            describe('... with a failing step', () => {
                const stepError = new Error('Boom');

                it('... should report the error of the failing step', () => {
                    const scheduler = new FakeScheduler();
                    const { errors } = startSimulationWith(createSimulationInput(10), scheduler);
                    vi.spyOn(FORCE_GRAPH_SIMULATION_TRANSFER_UTILS, 'packPositions').mockImplementation(() => {
                        throw stepError;
                    });

                    scheduler.runStep();

                    expectToEqual(errors, [stepError]);
                });

                it('... should stop the simulation (no further step scheduled)', () => {
                    const scheduler = new FakeScheduler();
                    startSimulationWith(createSimulationInput(10), scheduler);
                    vi.spyOn(FORCE_GRAPH_SIMULATION_TRANSFER_UTILS, 'packPositions').mockImplementation(() => {
                        throw stepError;
                    });

                    scheduler.runStep();

                    expect(scheduler.pendingStep).toBeUndefined();
                    expectSpyCall(scheduler.schedule, 1);
                });

                it('... should keep a failed simulation from waking up on pin', () => {
                    const scheduler = new FakeScheduler();
                    const { simulation } = startSimulationWith(createSimulationInput(10), scheduler);
                    vi.spyOn(FORCE_GRAPH_SIMULATION_TRANSFER_UTILS, 'packPositions').mockImplementation(() => {
                        throw stepError;
                    });

                    scheduler.runStep();
                    simulation.pin(0, { x: 500, y: 600 });

                    expect(scheduler.pendingStep).toBeUndefined();
                    expectSpyCall(scheduler.schedule, 1);
                });
            });

            describe('... pin', () => {
                const pinPoint = { x: 500, y: 600 };

                it('... should hold the pinned node at the given point', () => {
                    const scheduler = new FakeScheduler();
                    const { simulation, results } = startSimulationWith(createSimulationInput(10), scheduler);

                    simulation.pin(0, pinPoint);
                    scheduler.runStep();
                    const { positions } = results[results.length - 1];

                    expectToEqual([positions[0], positions[1]], [pinPoint.x, pinPoint.y]);
                    expect(scheduler.pendingStep).toBeDefined();
                });

                it('... should wake up a settled simulation', () => {
                    const scheduler = new FakeScheduler();
                    const { simulation } = startSimulationWith(createSimulationInput(10), scheduler);
                    scheduler.runUntilSettled();

                    simulation.pin(0, pinPoint);

                    expect(scheduler.pendingStep).toBeDefined();
                    expect(scheduler.schedule).toHaveBeenLastCalledWith(
                        expect.any(Function),
                        FORCE_GRAPH_SIMULATION_CONFIG.PROGRESS_INTERVAL_MS
                    );
                });

                it('... should run one tick per step (paced by PROGRESS_INTERVAL_MS) while a node is pinned', () => {
                    // A frozen clock: without pin, the first step would run several ticks of the initial layout
                    const scheduler = new FakeScheduler(0);
                    const { simulation, results } = startSimulationWith(createSimulationInput(10), scheduler);

                    simulation.pin(0, pinPoint);
                    scheduler.runStep();

                    expectToBe(results.length, 1);
                    expect(scheduler.schedule).toHaveBeenLastCalledWith(
                        expect.any(Function),
                        FORCE_GRAPH_SIMULATION_CONFIG.PROGRESS_INTERVAL_MS
                    );
                });

                it('... should start the next step right away if a tick takes longer than PROGRESS_INTERVAL_MS', () => {
                    // A slow clock: every tick takes longer than one interval
                    const scheduler = new FakeScheduler(2 * FORCE_GRAPH_SIMULATION_CONFIG.PROGRESS_INTERVAL_MS);
                    const { simulation } = startSimulationWith(createSimulationInput(10), scheduler);

                    simulation.pin(0, pinPoint);
                    scheduler.runStep();

                    expect(scheduler.schedule).toHaveBeenLastCalledWith(expect.any(Function), 0);
                });

                it('... should keep the simulation running while a node is pinned', () => {
                    const scheduler = new FakeScheduler();
                    const { simulation, results } = startSimulationWith(createSimulationInput(10), scheduler);

                    simulation.pin(0, pinPoint);
                    // Far more steps than the simulation needs to cool down
                    for (let step = 0; step < 2 * SMALL_GRAPH.TICKS; step++) {
                        scheduler.runStep();
                    }

                    expectToBe(results.length, 2 * SMALL_GRAPH.TICKS);
                    expect(scheduler.pendingStep).toBeDefined();
                });

                it('... should not pin a node at an invalid index (nor wake up a settled simulation)', () => {
                    const scheduler = new FakeScheduler();
                    const { simulation } = startSimulationWith(createSimulationInput(10), scheduler);
                    scheduler.runUntilSettled();
                    const invalidIndices = [-1, 10, 1.5, '__proto__' as unknown as number];

                    invalidIndices.forEach(index => simulation.pin(index, pinPoint));

                    expect(scheduler.pendingStep).toBeUndefined();
                    expectToBe(Object.hasOwn(Array.prototype, 'fx'), false);
                });
            });

            describe('... release', () => {
                it('... should free the released node and let the simulation settle again', () => {
                    const scheduler = new FakeScheduler();
                    const { simulation, results } = startSimulationWith(createSimulationInput(10), scheduler);
                    simulation.pin(0, { x: 500, y: 600 });
                    scheduler.runStep();

                    simulation.release(0);
                    scheduler.runUntilSettled();
                    const { positions, isCalm } = results[results.length - 1];

                    expectToBe(isCalm, true);
                    expect(scheduler.pendingStep).toBeUndefined();
                    // The center force pulls the freed node away from the pin point
                    expect(positions[0]).not.toBe(500);
                });

                it('... should cool down within the release ticks after a release', () => {
                    const scheduler = new FakeScheduler();
                    const { simulation, results } = startSimulationWith(createSimulationInput(10), scheduler);
                    simulation.pin(0, { x: 500, y: 600 });
                    // Long enough for alpha to reach the alpha target of the drag
                    for (let step = 0; step < SMALL_GRAPH.TICKS; step++) {
                        scheduler.runStep();
                    }
                    const stepCountBeforeRelease = results.length;

                    simulation.release(0);
                    scheduler.runUntilSettled();
                    const ticksAfterRelease = results.length - stepCountBeforeRelease;

                    expect(ticksAfterRelease).toBeGreaterThanOrEqual(SMALL_GRAPH.RELEASE_TICKS - 1);
                    expect(ticksAfterRelease).toBeLessThanOrEqual(SMALL_GRAPH.RELEASE_TICKS + 1);
                });

                // A real layout of a large graph takes several seconds with coverage instrumentation
                it(
                    '... should cool down within the release ticks after a release for a large graph',
                    { timeout: 30000 },
                    () => {
                        const scheduler = new FakeScheduler();
                        const { simulation, results } = startSimulationWith(
                            createSimulationInput(FORCE_GRAPH_LARGE_NODE_COUNT),
                            scheduler
                        );
                        simulation.pin(0, { x: 500, y: 600 });
                        // Long enough for alpha to reach the alpha target of the drag
                        for (let step = 0; step < LARGE_GRAPH.TICKS; step++) {
                            scheduler.runStep();
                        }
                        const stepCountBeforeRelease = results.length;

                        simulation.release(0);
                        scheduler.runUntilSettled();
                        const ticksAfterRelease = results.length - stepCountBeforeRelease;

                        expect(ticksAfterRelease).toBeGreaterThanOrEqual(LARGE_GRAPH.RELEASE_TICKS - 1);
                        expect(ticksAfterRelease).toBeLessThanOrEqual(LARGE_GRAPH.RELEASE_TICKS + 1);
                    }
                );

                it('... should not release a node at an invalid index (the pinned node stays at its point)', () => {
                    const scheduler = new FakeScheduler();
                    const { simulation, results } = startSimulationWith(createSimulationInput(10), scheduler);
                    simulation.pin(0, { x: 500, y: 600 });

                    simulation.release(10);
                    scheduler.runStep();
                    const { positions } = results[results.length - 1];
                    const pinnedNodePosition = [positions[0], positions[1]];

                    expectToEqual(pinnedNodePosition, [500, 600]);
                });
            });

            describe('... dispose', () => {
                it('... should cancel the scheduled step', () => {
                    const scheduler = new FakeScheduler();
                    const { simulation, results } = startSimulationWith(createSimulationInput(10), scheduler);

                    simulation.dispose();

                    expect(scheduler.pendingStep).toBeUndefined();
                    expectToBe(results.length, 0);
                });

                it('... should keep a disposed simulation from waking up on pin', () => {
                    const scheduler = new FakeScheduler();
                    const { simulation } = startSimulationWith(createSimulationInput(10), scheduler);

                    simulation.dispose();
                    simulation.pin(0, { x: 500, y: 600 });

                    expect(scheduler.pendingStep).toBeUndefined();
                    expectSpyCall(scheduler.schedule, 1);
                });
            });
        });
    });
});
