import { Directive, effect, ElementRef, inject, input, model } from '@angular/core';

import * as D3_SELECTION from 'd3-selection';
import * as D3_ZOOM from 'd3-zoom';

import { ZoomConfig } from './zoom.model';
import { roundToStepPrecision } from './zoom.utils';

/**
 * The SvgZoom directive.
 *
 * It binds a d3 pan and zoom behaviour to the host svg element
 * and applies the resulting transform to a given target element.
 * The current zoom factor is synced two-way via the `zoomValue` model
 * (e.g., with a {@link SliderZoomComponent}).
 */
@Directive({
    selector: 'svg[awgSvgZoom]',
    exportAs: 'awgSvgZoom',
})
export class SvgZoomDirective {
    /**
     * Readonly input signal: zoomConfig.
     *
     * It holds the zoom configuration (initial, min, max, step size).
     */
    readonly zoomConfig = input.required<ZoomConfig>();

    /**
     * Readonly input signal: zoomTarget.
     *
     * It holds the element that receives the zoom transform.
     */
    readonly zoomTarget = input.required<Element>();

    /**
     * Model signal: zoomValue.
     *
     * It holds the current zoom factor (rounded to the step size of the zoom configuration).
     */
    readonly zoomValue = model.required<number>();

    /**
     * Private readonly variable: _svg.
     *
     * It keeps the D3 selection of the host svg element.
     */
    private readonly _svg = D3_SELECTION.select<SVGSVGElement, unknown>(inject(ElementRef).nativeElement);

    /**
     * Private readonly variable: _zoomBehaviour.
     *
     * It keeps the D3 zoom behaviour bound to the host svg element.
     */
    private readonly _zoomBehaviour = D3_ZOOM.zoom<SVGSVGElement, unknown>().on('zoom', event =>
        this._onZoom(event.transform)
    );

    /**
     * Constructor of the SvgZoomDirective.
     *
     * It binds the zoom behaviour to the host svg element and
     * sets up the effects for the scale extent and external scale changes.
     */
    constructor() {
        this._svg.call(this._zoomBehaviour);

        // Update scale extent when the zoom configuration changes
        effect(() => {
            const { min, max } = this.zoomConfig();
            this._zoomBehaviour.scaleExtent([min, max]);
        });

        // Apply scale changes from outside (e.g., a slider); values set by d3 itself are already in sync
        effect(() => {
            const scale = this.zoomValue();
            const currentScale = roundToStepPrecision(
                D3_ZOOM.zoomTransform(this._svg.node() as SVGSVGElement).k,
                this.zoomConfig().stepSize
            );

            if (scale && scale !== currentScale) {
                this._svg.call(this._zoomBehaviour.scaleTo, scale);
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
        this._svg.call(this._zoomBehaviour.transform, D3_ZOOM.zoomIdentity.scale(this.zoomConfig().initial));
    }

    /**
     * Private method: _onZoom.
     *
     * It applies a given zoom transform to the zoom target
     * and sets the rounded zoom factor.
     *
     * @param {D3_ZOOM.ZoomTransform} transform The given zoom transform.
     * @returns {void} Applies the zoom transform.
     */
    private _onZoom(transform: D3_ZOOM.ZoomTransform): void {
        D3_SELECTION.select(this.zoomTarget()).attr('transform', transform.toString());
        this.zoomValue.set(roundToStepPrecision(transform.k, this.zoomConfig().stepSize));
    }
}
