import { Directive, input } from '@angular/core';

import * as D3_SELECTION from 'd3-selection';
import type { ZoomTransform } from 'd3-zoom';

import { ZoomBaseDirective } from './zoom-base.directive';

/**
 * The SvgZoom directive.
 *
 * It binds a d3 pan and zoom behaviour to the host svg and applies the transform to a given target element;
 * the zoom factor is synced two-way via `zoomValue` (cf. {@link ZoomBaseDirective}).
 */
@Directive({
    selector: 'svg[awgSvgZoom]',
    exportAs: 'awgSvgZoom',
})
export class SvgZoomDirective extends ZoomBaseDirective<SVGSVGElement> {
    /**
     * Readonly input signal: zoomTarget.
     *
     * It holds the element that receives the zoom transform.
     */
    readonly zoomTarget = input.required<Element>();

    /**
     * Protected method: _applyTransform.
     *
     * It applies a given zoom transform to the zoom target.
     *
     * @param {ZoomTransform} transform The given zoom transform.
     * @returns {void} Applies the zoom transform.
     */
    protected _applyTransform(transform: ZoomTransform): void {
        D3_SELECTION.select(this.zoomTarget()).attr('transform', transform.toString());
    }
}
