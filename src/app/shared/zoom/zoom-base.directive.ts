import { Directive, effect, ElementRef, inject, input, model } from '@angular/core';

import * as D3_SELECTION from 'd3-selection';
import * as D3_ZOOM from 'd3-zoom';

import { NUMBER_UTILS } from '@awg-shared/utils/number-utils';

import { ZoomConfig } from './zoom.model';

/**
 * The ZoomBase directive.
 *
 * It binds a d3 pan and zoom behaviour to the host element (scale extent from the zoom configuration)
 * and syncs the zoom factor two-way via `zoomValue` (e.g., with a {@link ZoomSliderComponent}).
 * Subclasses apply the resulting transform.
 */
@Directive()
export abstract class ZoomBaseDirective<E extends Element> {
    /**
     * Private readonly injection variable: _elementRef.
     *
     * It keeps the reference to the host element.
     */
    private readonly _elementRef = inject<ElementRef<E>>(ElementRef);

    /**
     * Readonly input signal: zoomConfig.
     *
     * It holds the zoom configuration (initial, min, max, step size).
     */
    readonly zoomConfig = input.required<ZoomConfig>();

    /**
     * Readonly model signal: zoomValue.
     *
     * It holds the current zoom factor (rounded to the step size of the zoom configuration).
     */
    readonly zoomValue = model.required<number>();

    /**
     * Protected readonly variable: _hostEl.
     *
     * It keeps the host element.
     */
    protected readonly _hostEl = this._elementRef.nativeElement;

    /**
     * Protected readonly variable: _selection.
     *
     * It keeps the D3 selection of the host element.
     */
    protected readonly _selection = D3_SELECTION.select<E, unknown>(this._hostEl);

    /**
     * Protected readonly variable: _zoomBehaviour.
     *
     * It keeps the D3 zoom behaviour bound to the host element.
     */
    protected readonly _zoomBehaviour = D3_ZOOM.zoom<E, unknown>().on(
        'zoom',
        (event: D3_ZOOM.D3ZoomEvent<E, unknown>) => this._onZoom(event.transform)
    );

    /**
     * Constructor of the ZoomBaseDirective.
     *
     * It binds the zoom behaviour to the host element and
     * sets up the effects for the scale extent and external scale changes.
     */
    constructor() {
        this._selection.call(this._zoomBehaviour);

        // Update scale extent when the zoom configuration changes
        effect(() => {
            const { min, max } = this.zoomConfig();
            this._zoomBehaviour.scaleExtent([min, max]);
        });

        // Apply scale changes from outside (e.g., a slider); values set by d3 itself are already in sync
        effect(() => {
            const scale = this.zoomValue();
            const currentScale = NUMBER_UTILS.roundToStepPrecision(
                D3_ZOOM.zoomTransform(this._hostEl).k,
                this.zoomConfig().stepSize
            );

            if (scale && scale !== currentScale) {
                this._zoomBehaviour.scaleTo(this._selection, scale);
            }
        });
    }

    /**
     * Public method: reset.
     *
     * It resets the zoom to the initial scale and the origin (0,0).
     *
     * @returns {void} Resets the zoom.
     */
    reset(): void {
        const { initial } = this.zoomConfig();
        const initialTransform = D3_ZOOM.zoomIdentity.scale(initial);

        this._zoomBehaviour.transform(this._selection, initialTransform);
    }

    /**
     * Protected abstract method: _applyTransform.
     *
     * It applies a given zoom transform (e.g., to a target element or a signal).
     *
     * @param {D3_ZOOM.ZoomTransform} transform The given zoom transform.
     * @returns {void} Applies the zoom transform.
     */
    protected abstract _applyTransform(transform: D3_ZOOM.ZoomTransform): void;

    /**
     * Private method: _onZoom.
     *
     * It applies a given zoom transform and sets the rounded zoom factor.
     *
     * @param {D3_ZOOM.ZoomTransform} transform The given zoom transform.
     * @returns {void} Applies the zoom transform.
     */
    private _onZoom(transform: D3_ZOOM.ZoomTransform): void {
        this._applyTransform(transform);
        this.zoomValue.set(NUMBER_UTILS.roundToStepPrecision(transform.k, this.zoomConfig().stepSize));
    }
}
