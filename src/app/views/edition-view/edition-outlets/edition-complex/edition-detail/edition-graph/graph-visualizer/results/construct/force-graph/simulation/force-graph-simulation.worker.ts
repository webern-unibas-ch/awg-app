/*
 * The web worker of the force graph simulation.
 *
 * It runs the simulation of a posted input off the main thread, steered by posted pin and release messages,
 * and posts each step's positions back (transferred). A failing step is reported as error event.
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
 * It starts the simulation on `start` (posting each step's progress back, positions transferred)
 * and forwards `pin` and `release` to it.
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
