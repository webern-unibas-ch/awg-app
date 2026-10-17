import { inject, Injectable, InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

import { ForceGraphData } from '../force-graph.model';

import { FORCE_GRAPH_SIMULATION_TRANSFER_UTILS } from './force-graph-simulation-transfer.utils';
import {
    ForceGraphSimulation,
    ForceGraphSimulationCommand,
    ForceGraphSimulationInput,
    ForceGraphSimulationMessage,
    ForceGraphSimulationProgress,
    ForceGraphSimulationWorkerFactory,
} from './force-graph-simulation.model';
import { FORCE_GRAPH_SIMULATION_UTILS } from './force-graph-simulation.utils';

/**
 * Private function: _createSimulationWorker.
 *
 * It creates the web worker of the force graph simulation, if web workers are available
 * and the worker can be created (e.g., not blocked by a content security policy).
 *
 * @returns {Worker | undefined} The web worker or undefined.
 */
function _createSimulationWorker(): Worker | undefined {
    if (typeof Worker === 'undefined') {
        return undefined;
    }
    try {
        return new Worker(new URL('./force-graph-simulation.worker', import.meta.url), { type: 'module' });
    } catch {
        return undefined;
    }
}

/**
 * Private function: _startWorkerSimulation.
 *
 * It starts the simulation in the given web worker and passes its progress to the given callback.
 * If the worker fails (e.g., its script cannot be loaded or a step fails),
 * it terminates the worker and calls the given failure callback.
 * The returned simulation posts pin and release to the worker; disposing terminates it.
 *
 * @param {Worker} worker The given web worker.
 * @param {ForceGraphSimulationInput} input The given simulation input.
 * @param {(progress: ForceGraphSimulationProgress) => void} onProgress The callback for the progress of each step.
 * @param {() => void} onFailure The callback for a failure of the worker.
 * @returns {ForceGraphSimulation} The simulation in the worker.
 */
function _startWorkerSimulation(
    worker: Worker,
    input: ForceGraphSimulationInput,
    onProgress: (progress: ForceGraphSimulationProgress) => void,
    onFailure: () => void
): ForceGraphSimulation {
    const post = (message: ForceGraphSimulationMessage, transfer: Transferable[] = []): void =>
        worker.postMessage(message, transfer);

    worker.onmessage = ({ data }: MessageEvent<ForceGraphSimulationProgress>) => onProgress(data);
    // Load and runtime errors of the worker
    // (a failed loading of the worker script is reported as plain event, without message)
    worker.onerror = (event: ErrorEvent | Event) => {
        // The failure is handled (no uncaught error)
        event.preventDefault();
        console.warn(
            '[ForceGraphSimulationService] Simulation worker failed, continuing on the main thread:',
            'message' in event ? event.message : 'The worker script could not be loaded.'
        );
        worker.terminate();
        onFailure();
    };
    post({ type: 'start', input }, [input.radii.buffer, input.links.buffer, input.positions.buffer]);

    return {
        pin: (index, point) => post({ type: 'pin', index, point }),
        release: index => post({ type: 'release', index }),
        dispose: () => worker.terminate(),
    };
}

/**
 * Injection token: FORCE_GRAPH_SIMULATION_WORKER_FACTORY.
 *
 * It provides the factory of the web worker of the force graph simulation.
 */
export const FORCE_GRAPH_SIMULATION_WORKER_FACTORY = new InjectionToken<ForceGraphSimulationWorkerFactory>(
    'FORCE_GRAPH_SIMULATION_WORKER_FACTORY',
    { providedIn: 'root', factory: () => _createSimulationWorker }
);

/**
 * The ForceGraphSimulation service.
 *
 * It runs the force simulation of a graph in a web worker,
 * or on the main thread without web workers or if the worker fails.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class ForceGraphSimulationService {
    /**
     * Private readonly injection variable: _createWorker.
     *
     * It keeps the injected factory of the web worker of the simulation.
     */
    private readonly _createWorker = inject(FORCE_GRAPH_SIMULATION_WORKER_FACTORY);

    /**
     * Public method: simulate.
     *
     * It runs the force simulation of the given force graph data, steered by the given pin and release commands.
     * It emits the positions of every step and never completes (a later pin restarts a settled simulation);
     * unsubscribing stops it. A failing worker hands the simulation over to the main thread;
     * a failing simulation on the main thread errors.
     *
     * @param {ForceGraphData} graphData The given force graph data.
     * @param {Observable<ForceGraphSimulationCommand>} commands$ The given pin and release commands.
     * @returns {Observable<ForceGraphSimulationProgress>} The simulation progress.
     */
    simulate(
        graphData: ForceGraphData,
        commands$: Observable<ForceGraphSimulationCommand>
    ): Observable<ForceGraphSimulationProgress> {
        return new Observable<ForceGraphSimulationProgress>(subscriber => {
            let simulation: ForceGraphSimulation;

            // A new input for every start, from the last known positions of the force graph data
            // (the buffers of an input posted to the worker are transferred)
            const createSimulationInput = (): ForceGraphSimulationInput =>
                FORCE_GRAPH_SIMULATION_TRANSFER_UTILS.toSimulationInput(graphData);

            // The simulation refers to the nodes by their index in the force graph data
            const onCommand = (command: ForceGraphSimulationCommand): void => {
                const index = graphData.nodes.indexOf(command.node);
                if (index === -1) {
                    return;
                }
                if (command.type === 'pin') {
                    simulation.pin(index, command.point);
                } else {
                    simulation.release(index);
                }
            };
            const onProgress = (progress: ForceGraphSimulationProgress): void => subscriber.next(progress);
            const onError = (error: unknown): void => subscriber.error(error);

            const startOnMainThread = (): ForceGraphSimulation =>
                FORCE_GRAPH_SIMULATION_UTILS.startSimulation(createSimulationInput(), onProgress, onError);
            // A failing worker hands the simulation over to the main thread
            // (in the error callback of the worker: a failing start would be uncaught otherwise)
            const onFailure = (): void => {
                try {
                    simulation = startOnMainThread();
                } catch (error) {
                    onError(error);
                }
            };
            const startOnWorker = (simulationWorker: Worker): ForceGraphSimulation =>
                _startWorkerSimulation(simulationWorker, createSimulationInput(), onProgress, onFailure);

            const worker = this._createWorker();
            simulation = worker ? startOnWorker(worker) : startOnMainThread();
            const commandSubscription = commands$.subscribe(onCommand);

            return () => {
                commandSubscription.unsubscribe();
                simulation.dispose();
            };
        });
    }
}
