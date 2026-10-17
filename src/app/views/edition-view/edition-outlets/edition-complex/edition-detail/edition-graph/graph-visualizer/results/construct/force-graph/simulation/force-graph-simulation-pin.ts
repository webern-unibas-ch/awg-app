import { Subject } from 'rxjs';

import type { ForceGraphPoint, ForceGraphVisibleNode } from '../force-graph.model';
import type { ForceGraphSimulationCommand } from './force-graph-simulation.model';

/**
 * The ForceGraphSimulationPin class.
 *
 * It sends the pin and release commands of a dragged node to the simulation
 * and keeps the node at its point locally (the results of the simulation arrive one round trip late).
 */
export class ForceGraphSimulationPin {
    /**
     * Readonly variable: commands$.
     *
     * It keeps the subject of the pin and release commands to the simulation.
     */
    readonly commands$ = new Subject<ForceGraphSimulationCommand>();

    /**
     * Private variable: _pinned.
     *
     * It keeps the dragged node and its pin point, if any.
     */
    private _pinned: { readonly node: ForceGraphVisibleNode; readonly point: ForceGraphPoint } | undefined;

    /**
     * Public method: pin.
     *
     * It pins the given node at the given point: the simulation fixes it there (its neighbours follow),
     * and it is moved there at once, since the results of the simulation arrive one round trip late.
     *
     * @param {ForceGraphVisibleNode} node The given node.
     * @param {ForceGraphPoint} point The given point in graph coordinates.
     * @returns {void} Pins the node.
     */
    pin(node: ForceGraphVisibleNode, point: ForceGraphPoint): void {
        this._pinned = { node, point };
        this.commands$.next({ type: 'pin', node, point });
        this.apply();
    }

    /**
     * Public method: release.
     *
     * It releases the given pinned node, so that the graph settles again.
     *
     * @param {ForceGraphVisibleNode} node The given node.
     * @returns {void} Releases the node.
     */
    release(node: ForceGraphVisibleNode): void {
        this._pinned = undefined;
        this.commands$.next({ type: 'release', node });
    }

    /**
     * Public method: apply.
     *
     * It moves the pinned node to its pin point, if any node is pinned
     * (on the pin, and again after each result of the simulation).
     *
     * @returns {void} Sets the position of the pinned node.
     */
    apply(): void {
        if (!this._pinned) {
            return;
        }
        const { node, point } = this._pinned;
        node.x = point.x;
        node.y = point.y;
    }
}
