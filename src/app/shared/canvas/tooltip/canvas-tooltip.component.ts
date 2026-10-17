import { afterRenderEffect, ChangeDetectionStrategy, Component, input, untracked, viewChild } from '@angular/core';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

import { CanvasPoint } from '../canvas.model';

/**
 * The CanvasTooltip component.
 *
 * It shows a tooltip with a given text at a given point of a canvas (in css pixels),
 * e.g. for the node under the pointer. It is placed next to the canvas inside its positioned container.
 */
@Component({
    selector: 'awg-canvas-tooltip',
    templateUrl: './canvas-tooltip.component.html',
    styleUrls: ['./canvas-tooltip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbTooltip],
})
export class CanvasTooltipComponent {
    /**
     * Readonly input signal: point.
     *
     * It holds the point of the canvas to show the tooltip at, if any.
     */
    readonly point = input<CanvasPoint | undefined>();

    /**
     * Readonly input signal: text.
     *
     * It holds the text of the tooltip; without a text or a point, the tooltip is closed.
     */
    readonly text = input<string | undefined>();

    /**
     * Readonly view child signal: tooltip.
     *
     * It holds the tooltip at the anchor (opened and closed manually).
     */
    readonly tooltip = viewChild.required(NgbTooltip);

    /**
     * Constructor of the CanvasTooltipComponent.
     *
     * It shows the tooltip at the given point, or hides it without a text or a point.
     */
    constructor() {
        // After rendering, the anchor of the tooltip is at the given point
        afterRenderEffect(() => {
            const point = this.point();
            const text = this.text();
            untracked(() => this._updateTooltip(!!text && !!point));
        });
    }

    /**
     * Private method: _updateTooltip.
     *
     * It closes the tooltip and opens it again if it is shown,
     * so that it is positioned at the current position of its anchor.
     *
     * @param {boolean} isShown The flag if the tooltip is shown (with a text at a point).
     * @returns {void} Shows or hides the tooltip.
     */
    private _updateTooltip(isShown: boolean): void {
        const tooltip = this.tooltip();
        tooltip.close(false);
        if (isShown) {
            tooltip.open();
        }
    }
}
