import { Component, input, model, output } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMaximize, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

import { ZoomConfig } from './zoom.model';

/**
 * The ZoomSlider component.
 *
 * It contains a zoom slider (input range) with a label of the current zoom factor,
 * a button to reset the zoom and, optionally, a button to zoom to fit.
 */
@Component({
    selector: 'awg-zoom-slider',
    templateUrl: './zoom-slider.component.html',
    styleUrl: './zoom-slider.component.scss',
    imports: [FaIconComponent],
})
export class ZoomSliderComponent {
    /**
     * Readonly input signal: zoomConfig.
     *
     * It holds the configuration (initial, min, max, step size) of the slider.
     */
    readonly zoomConfig = input.required<ZoomConfig>();

    /**
     * Readonly input signal: hasFitButton.
     *
     * It holds the flag if the button to zoom to fit is shown (default: false).
     */
    readonly hasFitButton = input<boolean>(false);

    /**
     * Readonly model signal: zoomValue.
     *
     * It holds the current zoom factor of the slider.
     * Changes by the user are emitted via `zoomValueChange`.
     */
    readonly zoomValue = model.required<number>();

    /**
     * Readonly output signal: fitRequest.
     *
     * It emits when the user requests to zoom to fit.
     */
    readonly fitRequest = output();

    /**
     * Readonly output signal: resetRequest.
     *
     * It emits when the user requests to reset the zoom.
     */
    readonly resetRequest = output();

    /**
     * Readonly variable: faRotateLeft.
     *
     * It instantiates fontawesome's faRotateLeft icon.
     */
    readonly faRotateLeft = faRotateLeft;

    /**
     * Readonly variable: faMaximize.
     *
     * It instantiates fontawesome's faMaximize icon.
     */
    readonly faMaximize = faMaximize;
}
