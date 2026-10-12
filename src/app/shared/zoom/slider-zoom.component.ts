import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCompressArrowsAlt } from '@fortawesome/free-solid-svg-icons';

import { ZoomConfig } from './zoom.model';

/**
 * The SliderZoom component.
 *
 * It contains a zoom slider (input range) with a label of the current zoom factor
 * and a button to reset the zoom.
 */
@Component({
    selector: 'awg-slider-zoom',
    templateUrl: './slider-zoom.component.html',
    styleUrl: './slider-zoom.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent],
})
export class SliderZoomComponent {
    /**
     * Readonly input signal: zoomConfig.
     *
     * It holds the configuration (initial, min, max, step size) of the slider.
     */
    readonly zoomConfig = input.required<ZoomConfig>();

    /**
     * Model signal: zoomValue.
     *
     * It holds the current zoom factor of the slider.
     * Changes by the user are emitted via `zoomValueChange`.
     */
    readonly zoomValue = model.required<number>();

    /**
     * Readonly output signal: resetRequest.
     *
     * It emits when the user requests to reset the zoom.
     */
    readonly resetRequest = output<void>();

    /**
     * Readonly variable: faCompressArrowsAlt.
     *
     * It instantiates fontawesome's faCompressArrowsAlt icon.
     */
    readonly faCompressArrowsAlt = faCompressArrowsAlt;
}
