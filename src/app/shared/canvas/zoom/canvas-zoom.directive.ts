import { Directive, input, signal } from '@angular/core';

import * as D3_ZOOM from 'd3-zoom';

import { ZoomBaseDirective } from '@awg-shared/zoom/zoom-base.directive';

import { CanvasBounds, CanvasSize } from '../canvas.model';

import { CanvasZoomFilter } from './canvas-zoom.model';

/**
 * The CanvasZoom directive.
 *
 * It binds a d3 pan and zoom behaviour to the host canvas and holds the transform in a signal (to redraw with);
 * the zoom factor is synced two-way via `zoomValue` (cf. {@link ZoomBaseDirective}).
 */
@Directive({
    selector: 'canvas[awgCanvasZoom]',
    exportAs: 'awgCanvasZoom',
})
export class CanvasZoomDirective extends ZoomBaseDirective<HTMLCanvasElement> {
    /**
     * Readonly input signal: zoomFilter.
     *
     * It holds an extra filter for the pointer events that may start a pan (default: all; wheel events always zoom).
     */
    readonly zoomFilter = input<CanvasZoomFilter>(() => true);

    /**
     * Private readonly signal: _transform.
     *
     * It holds the current zoom transform.
     */
    private readonly _transform = signal<D3_ZOOM.ZoomTransform>(D3_ZOOM.zoomIdentity);

    /**
     * Readonly signal: transform.
     *
     * It holds the current zoom transform (readonly).
     */
    readonly transform = this._transform.asReadonly();

    /**
     * Constructor of the CanvasZoomDirective.
     *
     * It sets the filter of the zoom behaviour.
     */
    constructor() {
        super();
        this._zoomBehaviour.filter((event: MouseEvent | TouchEvent | WheelEvent) => this._filter(event));
    }

    /**
     * Public method: zoomToFit.
     *
     * It zooms and pans so that the given bounds (plus padding) fit centered into the canvas of the given size,
     * with a scale between the minimum and the initial one; without a rendered canvas size, it does nothing.
     * The size is given by the caller, so that the bounds and the fit refer to the same size of the canvas.
     *
     * @param {CanvasBounds} bounds The given bounds (in css pixels of the untransformed canvas).
     * @param {CanvasSize} size The given rendered size of the canvas (in css pixels).
     * @param {number} [padding] The padding around the bounds (in css pixels; default: 20).
     * @returns {void} Zooms to the bounds.
     */
    zoomToFit(bounds: CanvasBounds, size: CanvasSize, padding: number = 20): void {
        const { width, height } = size;
        if (!width || !height) {
            return;
        }
        const { min, initial } = this.zoomConfig();
        const fitScale = Math.min(
            width / (bounds.max.x - bounds.min.x + 2 * padding),
            height / (bounds.max.y - bounds.min.y + 2 * padding)
        );
        const scale = Math.min(Math.max(fitScale, min), initial);

        const centerX = (bounds.min.x + bounds.max.x) / 2;
        const centerY = (bounds.min.y + bounds.max.y) / 2;
        // The center of the bounds moves to the origin, is scaled and moves to the center of the canvas
        const transform = D3_ZOOM.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(scale)
            .translate(-centerX, -centerY);

        this._selection.call(this._zoomBehaviour.transform, transform);
    }

    /**
     * Protected method: _applyTransform.
     *
     * It holds a given zoom transform.
     *
     * @param {D3_ZOOM.ZoomTransform} transform The given zoom transform.
     * @returns {void} Sets the zoom transform.
     */
    protected _applyTransform(transform: D3_ZOOM.ZoomTransform): void {
        this._transform.set(transform);
    }

    /**
     * Private method: _filter.
     *
     * It decides if a given event may start a gesture: like d3's default filter (no secondary button, no ctrl+drag),
     * wheel events always, other events only if the zoom filter accepts them.
     *
     * @param {MouseEvent | TouchEvent | WheelEvent} event The given event.
     * @returns {boolean} The result of the check.
     */
    private _filter(event: MouseEvent | TouchEvent | WheelEvent): boolean {
        const isSecondaryButton = 'button' in event && !!event.button;
        if ((event.ctrlKey && event.type !== 'wheel') || isSecondaryButton) {
            return false;
        }
        return event.type === 'wheel' || this.zoomFilter()(event);
    }
}
