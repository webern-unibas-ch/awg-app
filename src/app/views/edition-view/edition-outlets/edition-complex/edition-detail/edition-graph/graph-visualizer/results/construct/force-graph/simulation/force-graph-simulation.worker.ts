/*
 * The web worker of the force graph simulation.
 *
 * It runs the simulation of a posted simulation input off the main thread,
 * steers it with posted pin and release messages
 * and posts the positions of each step back (transferring their buffers).
 * A failing step is reported as error event of the worker.
 */

import type {
    ForceGraphSimulation,
    ForceGraphSimulationMessage,
    ForceGraphSimulationProgress,
} from './force-graph-simulation.model';
import { FORCE_GRAPH_SIMULATION_UTILS } from './force-graph-simulation.utils';

/**
 * Private variable: _simulation.
 *
 * It keeps the simulation of the worker, once started.
 */
let _simulation: ForceGraphSimulation | undefined;

/**
 * Private function: _onSimulationMessage.
 *
 * It starts the simulation of a posted `start` message, posting the progress of each step
 * back to the main thread and transferring the buffer of its positions (no copy).
 * It forwards posted `pin` and `release` messages to the simulation.
 *
 * @param {MessageEvent<ForceGraphSimulationMessage>} event The given message event with the simulation message.
 * @returns {void} Steers the simulation.
 */
function _onSimulationMessage({ data }: MessageEvent<ForceGraphSimulationMessage>): void {
    switch (data.type) {
        case 'start':
            _simulation = FORCE_GRAPH_SIMULATION_UTILS.startSimulation(
                data.input,
                (progress: ForceGraphSimulationProgress) =>
                    postMessage(progress, { transfer: [progress.positions.buffer] }),
                // A failing step is reported as error event of the worker to the main thread
                (error: unknown) => reportError(error)
            );
            break;
        case 'pin':
            _simulation?.pin(data.index, data.point);
            break;
        case 'release':
            _simulation?.release(data.index);
            break;
    }
}

addEventListener('message', _onSimulationMessage);
