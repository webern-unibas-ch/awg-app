import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { EMPTY, Subject } from 'rxjs';

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { ResultGraph } from '@awg-graph/graph-visualizer/models/result-graph.model';

import { ForceGraphData } from '../force-graph.model';
import { FORCE_GRAPH_UTILS } from '../force-graph.utils';

import { FORCE_GRAPH_SIMULATION_TRANSFER_UTILS } from './force-graph-simulation-transfer.utils';
import {
    ForceGraphSimulation,
    ForceGraphSimulationCommand,
    ForceGraphSimulationMessage,
    ForceGraphSimulationProgress,
    ForceGraphSimulationWorkerFactory,
} from './force-graph-simulation.model';
import { FORCE_GRAPH_SIMULATION_WORKER_FACTORY, ForceGraphSimulationService } from './force-graph-simulation.service';
import { FORCE_GRAPH_SIMULATION_UTILS } from './force-graph-simulation.utils';

/**
 * The FakeWorker class.
 *
 * It stands in for the web worker of the simulation and records the posted messages.
 */
class FakeWorker {
    onmessage: ((event: MessageEvent<ForceGraphSimulationProgress>) => void) | null = null;
    onerror: ((event: ErrorEvent) => void) | null = null;
    postMessage: Mock<(message: ForceGraphSimulationMessage, transfer: Transferable[]) => void> = vi.fn();
    terminate: Mock<() => void> = vi.fn();

    /**
     * Emits the given progress as a message of the worker.
     */
    emit(progress: ForceGraphSimulationProgress): void {
        this.onmessage?.({ data: progress } as MessageEvent<ForceGraphSimulationProgress>);
    }

    /**
     * Emits an error event of the worker with the given message
     * (without message: a plain event, as for a failed loading of the worker script).
     */
    fail(message?: string): void {
        const event = message === undefined ? { preventDefault: vi.fn() } : { message, preventDefault: vi.fn() };
        this.onerror?.(event as unknown as ErrorEvent);
    }
}

describe('ForceGraphSimulationService (DONE)', () => {
    let forceGraphSimulationService: ForceGraphSimulationService;
    let forceGraphData: ForceGraphData;

    const resultGraph: ResultGraph = {
        nodes: [
            { id: 'a', shortName: 'ex:a', label: 'A', kind: 'instance' },
            { id: 'b', shortName: 'ex:b', label: 'ex:b', kind: 'class' },
        ],
        edges: [{ id: 'e0', source: 'a', target: 'b', label: 'rdf:type' }],
        tripleCount: 1,
    };

    const progress = (isCalm: boolean): ForceGraphSimulationProgress => ({
        positions: Float32Array.from([1, 2, 3, 4]),
        isCalm,
    });

    /**
     * Installs fake timers for the main thread simulation, with a real `setInterval`.
     * d3-force starts its internal timer on creation, and its poke interval is cleared on the next animation frame;
     * d3 binds the real `requestAnimationFrame` at load, so a faked interval would never be cleared in a browser.
     */
    const useSimulationFakeTimers = (): void => {
        vi.useFakeTimers({ toNotFake: ['setInterval', 'clearInterval'] });
    };

    /**
     * Configures the testing module with the given worker factory and injects the service.
     */
    const setup = (workerFactory: ForceGraphSimulationWorkerFactory): void => {
        TestBed.configureTestingModule({
            providers: [{ provide: FORCE_GRAPH_SIMULATION_WORKER_FACTORY, useValue: workerFactory }],
        });
        forceGraphSimulationService = TestBed.inject(ForceGraphSimulationService);
    };

    beforeEach(() => {
        // Test data
        forceGraphData = FORCE_GRAPH_UTILS.toForceGraphData(resultGraph);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('... should inject', () => {
        setup(() => undefined);

        expect(forceGraphSimulationService).toBeTruthy();
    });

    describe('FORCE_GRAPH_SIMULATION_WORKER_FACTORY', () => {
        it('... should hold a default factory that creates a module worker of the simulation', () => {
            const workerMock = vi.fn<(workerUrl: URL, workerOptions: WorkerOptions) => void>(function () {});
            vi.stubGlobal('Worker', workerMock);

            const worker = TestBed.inject(FORCE_GRAPH_SIMULATION_WORKER_FACTORY)();

            expect(worker).toBeDefined();
            expectSpyCall(workerMock, 1);
            const [url, options] = workerMock.mock.calls[0];
            // The url of the bundled worker script (its name is set by the builder)
            expect(url).toBeInstanceOf(URL);
            expectToEqual(options, { type: 'module' });
        });

        it('... should hold a default factory that creates no worker if web workers are not available', () => {
            vi.stubGlobal('Worker', undefined);

            const worker = TestBed.inject(FORCE_GRAPH_SIMULATION_WORKER_FACTORY)();

            expect(worker).toBeUndefined();
        });

        it('... should hold a default factory that creates no worker if the worker cannot be created', () => {
            vi.stubGlobal(
                'Worker',
                vi.fn(function () {
                    throw new Error('SecurityError');
                })
            );

            const worker = TestBed.inject(FORCE_GRAPH_SIMULATION_WORKER_FACTORY)();

            expect(worker).toBeUndefined();
        });
    });

    describe('#simulate()', () => {
        it('... should have a method `simulate`', () => {
            setup(() => undefined);

            expect(forceGraphSimulationService.simulate).toBeDefined();
        });

        describe('... without web worker', () => {
            beforeEach(() => {
                setup(() => undefined);
                useSimulationFakeTimers();
            });

            afterEach(() => {
                vi.useRealTimers();
            });

            it('... should run the simulation on the main thread until it has settled (without completing)', () => {
                const results: ForceGraphSimulationProgress[] = [];
                let isCompleted = false;

                forceGraphSimulationService.simulate(forceGraphData, EMPTY).subscribe({
                    next: result => results.push(result),
                    complete: () => (isCompleted = true),
                });
                vi.runAllTimers();
                const lastResult = results[results.length - 1];

                // The settled simulation rests (no timer left)
                expectToBe(vi.getTimerCount(), 0);
                expectToBe(lastResult.positions.length, forceGraphData.nodes.length * 2);
                expectToBe(isCompleted, false);
            });

            it('... should pin a node of the main thread simulation by a command', () => {
                const results: ForceGraphSimulationProgress[] = [];
                const commands$ = new Subject<ForceGraphSimulationCommand>();

                forceGraphSimulationService
                    .simulate(forceGraphData, commands$)
                    .subscribe(result => results.push(result));
                vi.runAllTimers();
                commands$.next({ type: 'pin', node: forceGraphData.visibleNodes[1], point: { x: 50, y: 60 } });
                vi.advanceTimersToNextTimer();
                const { positions } = results[results.length - 1];

                expectToEqual([positions[2], positions[3]], [50, 60]);
                // The pinned node keeps the simulation running
                expectToBe(vi.getTimerCount(), 1);
            });

            it('... should stop the main thread simulation on unsubscribe', () => {
                const startSimulationSpy = vi.spyOn(FORCE_GRAPH_SIMULATION_UTILS, 'startSimulation');
                const subscription = forceGraphSimulationService.simulate(forceGraphData, EMPTY).subscribe();
                const simulation = startSimulationSpy.mock.results[0].value as ForceGraphSimulation;
                const disposeSpy = vi.spyOn(simulation, 'dispose');

                subscription.unsubscribe();

                expectSpyCall(disposeSpy, 1);
            });

            it('... should error if a step of the main thread simulation fails', () => {
                const stepError = new Error('Boom');
                vi.spyOn(FORCE_GRAPH_SIMULATION_TRANSFER_UTILS, 'packPositions').mockImplementation(() => {
                    throw stepError;
                });
                let error: unknown;

                forceGraphSimulationService.simulate(forceGraphData, EMPTY).subscribe({ error: err => (error = err) });
                vi.runAllTimers();

                expectToBe(error, stepError);
                // The failed simulation rests (no timer left)
                expectToBe(vi.getTimerCount(), 0);
            });

            it('... should not start the simulation before subscription', () => {
                const startSimulationSpy = vi.spyOn(FORCE_GRAPH_SIMULATION_UTILS, 'startSimulation');

                const simulation$ = forceGraphSimulationService.simulate(forceGraphData, EMPTY);

                expect(simulation$).toBeDefined();
                expectSpyCall(startSimulationSpy, 0);
            });
        });

        describe('... with web worker', () => {
            let workers: FakeWorker[];

            beforeEach(() => {
                workers = [];
                setup(() => {
                    const worker = new FakeWorker();
                    workers.push(worker);
                    return worker as unknown as Worker;
                });
            });

            it('... should create one worker per subscription', () => {
                const simulation$ = forceGraphSimulationService.simulate(forceGraphData, EMPTY);

                expectToBe(workers.length, 0);

                simulation$.subscribe();
                simulation$.subscribe();

                expectToBe(workers.length, 2);
            });

            it('... should post a start message with the simulation input to the worker and transfer its buffers', () => {
                // A restored position of a previous layout (one of two nodes: a relayout)
                forceGraphData.nodes[0].x = 5;
                forceGraphData.nodes[0].y = 6;

                forceGraphSimulationService.simulate(forceGraphData, EMPTY).subscribe();

                expectSpyCall(workers[0].postMessage, 1);
                const [message, transfer] = workers[0].postMessage.mock.calls[0];
                const input = (message as Extract<ForceGraphSimulationMessage, { type: 'start' }>).input;

                expectToBe(message.type, 'start');
                expectToEqual(Array.from(input.radii), [11, 10]);
                expectToEqual(Array.from(input.links), [0, 1]);
                expectToBe(input.isRelayout, true);
                expectToEqual(transfer, [input.radii.buffer, input.links.buffer, input.positions.buffer]);
            });

            it('... should emit the results of the worker without completing once settled', () => {
                const results: ForceGraphSimulationProgress[] = [];
                let isCompleted = false;

                forceGraphSimulationService.simulate(forceGraphData, EMPTY).subscribe({
                    next: result => results.push(result),
                    complete: () => (isCompleted = true),
                });

                workers[0].emit(progress(false));
                workers[0].emit(progress(true));

                expectToEqual(results, [progress(false), progress(true)]);
                expectToBe(isCompleted, false);
            });

            it('... should post pin and release commands to the worker (by node index)', () => {
                const commands$ = new Subject<ForceGraphSimulationCommand>();
                forceGraphSimulationService.simulate(forceGraphData, commands$).subscribe();

                commands$.next({ type: 'pin', node: forceGraphData.visibleNodes[1], point: { x: 50, y: 60 } });
                expectSpyCall(workers[0].postMessage, 2, [{ type: 'pin', index: 1, point: { x: 50, y: 60 } }, []]);

                commands$.next({ type: 'release', node: forceGraphData.visibleNodes[1] });
                expectSpyCall(workers[0].postMessage, 3, [{ type: 'release', index: 1 }, []]);
            });

            it('... should ignore commands for nodes of other force graph data', () => {
                const commands$ = new Subject<ForceGraphSimulationCommand>();
                const otherNode = {
                    id: 'x',
                    radius: 9,
                    resultNode: { id: 'x', shortName: 'x', label: 'x', kind: 'resource' as const },
                    x: NaN,
                    y: NaN,
                };
                forceGraphSimulationService.simulate(forceGraphData, commands$).subscribe();

                commands$.next({ type: 'release', node: otherNode });

                expectSpyCall(workers[0].postMessage, 1);
            });

            it('... should terminate the worker and stop listening for commands on unsubscribe', () => {
                const commands$ = new Subject<ForceGraphSimulationCommand>();
                const subscription = forceGraphSimulationService.simulate(forceGraphData, commands$).subscribe();
                workers[0].emit(progress(true));

                expectSpyCall(workers[0].terminate, 0);

                subscription.unsubscribe();

                expectSpyCall(workers[0].terminate, 1);
                expectToBe(commands$.observed, false);
            });

            describe('... if the worker fails', () => {
                let consoleWarnSpy: Mock<(...args: unknown[]) => void>;

                /**
                 * Mocks the main thread simulation with a fake simulation and gets it with the spy.
                 */
                const mockMainThreadSimulation = () => {
                    const fakeSimulation = { pin: vi.fn(), release: vi.fn(), dispose: vi.fn() };
                    const startSimulationSpy = vi
                        .spyOn(FORCE_GRAPH_SIMULATION_UTILS, 'startSimulation')
                        .mockReturnValue(fakeSimulation);
                    return { fakeSimulation, startSimulationSpy };
                };

                beforeEach(() => {
                    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
                });

                afterEach(() => {
                    vi.useRealTimers();
                });

                it('... should terminate the worker and continue the simulation on the main thread', () => {
                    const { startSimulationSpy } = mockMainThreadSimulation();
                    let error: unknown;
                    forceGraphSimulationService
                        .simulate(forceGraphData, EMPTY)
                        .subscribe({ error: err => (error = err) });

                    workers[0].fail('Boom');

                    expectSpyCall(workers[0].terminate, 1);
                    expectSpyCall(startSimulationSpy, 1);
                    expectSpyCall(consoleWarnSpy, 1, [
                        '[ForceGraphSimulationService] Simulation worker failed, continuing on the main thread:',
                        'Boom',
                    ]);
                    expect(error).toBeUndefined();
                });

                it('... should error if the main thread simulation cannot be started', () => {
                    const startError = new Error('Boom');
                    vi.spyOn(FORCE_GRAPH_SIMULATION_UTILS, 'startSimulation').mockImplementation(() => {
                        throw startError;
                    });
                    let error: unknown;
                    forceGraphSimulationService
                        .simulate(forceGraphData, EMPTY)
                        .subscribe({ error: err => (error = err) });

                    workers[0].fail('Boom');

                    expectToBe(error, startError);
                });

                it('... should error if a step of the main thread simulation fails', () => {
                    const { startSimulationSpy } = mockMainThreadSimulation();
                    const stepError = new Error('Boom');
                    let error: unknown;
                    forceGraphSimulationService
                        .simulate(forceGraphData, EMPTY)
                        .subscribe({ error: err => (error = err) });
                    workers[0].fail('Boom');

                    const [, , onError] = startSimulationSpy.mock.calls[0];
                    onError(stepError);

                    expectToBe(error, stepError);
                });

                it('... should warn about a worker script that could not be loaded', () => {
                    mockMainThreadSimulation();
                    forceGraphSimulationService.simulate(forceGraphData, EMPTY).subscribe();

                    workers[0].fail();

                    expectSpyCall(consoleWarnSpy, 1, [
                        '[ForceGraphSimulationService] Simulation worker failed, continuing on the main thread:',
                        'The worker script could not be loaded.',
                    ]);
                });

                it('... should continue from the last known positions on the main thread', () => {
                    const { startSimulationSpy } = mockMainThreadSimulation();
                    forceGraphSimulationService.simulate(forceGraphData, EMPTY).subscribe();
                    // A position of the worker simulation, unpacked into the force graph data
                    forceGraphData.nodes[0].x = 5;
                    forceGraphData.nodes[0].y = 6;

                    workers[0].fail('Boom');

                    const [input] = startSimulationSpy.mock.calls[0];

                    expectToEqual([input.positions[0], input.positions[1]], [5, 6]);
                    expectToBe(input.isRelayout, true);
                });

                it('... should emit the results of the main thread simulation', () => {
                    useSimulationFakeTimers();
                    const results: ForceGraphSimulationProgress[] = [];
                    forceGraphSimulationService
                        .simulate(forceGraphData, EMPTY)
                        .subscribe(result => results.push(result));

                    workers[0].fail('Boom');
                    vi.runAllTimers();
                    const lastResult = results[results.length - 1];

                    expectToBe(lastResult.positions.length, forceGraphData.nodes.length * 2);
                });

                it('... should steer the main thread simulation by commands', () => {
                    const { fakeSimulation } = mockMainThreadSimulation();
                    const commands$ = new Subject<ForceGraphSimulationCommand>();
                    forceGraphSimulationService.simulate(forceGraphData, commands$).subscribe();

                    workers[0].fail('Boom');
                    commands$.next({ type: 'pin', node: forceGraphData.visibleNodes[1], point: { x: 50, y: 60 } });
                    commands$.next({ type: 'release', node: forceGraphData.visibleNodes[1] });

                    expectSpyCall(fakeSimulation.pin, 1, [1, { x: 50, y: 60 }]);
                    expectSpyCall(fakeSimulation.release, 1, 1);
                    // Only the start message has been posted to the worker
                    expectSpyCall(workers[0].postMessage, 1);
                });

                it('... should stop the main thread simulation on unsubscribe', () => {
                    const { fakeSimulation } = mockMainThreadSimulation();
                    const subscription = forceGraphSimulationService.simulate(forceGraphData, EMPTY).subscribe();
                    workers[0].fail('Boom');

                    subscription.unsubscribe();

                    expectSpyCall(fakeSimulation.dispose, 1);
                });
            });
        });
    });
});
