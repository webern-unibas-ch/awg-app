/**
 * The ZoomConfig class.
 *
 * It is used to configure the zoom slider and the svg zoom (initial, min, max, step size).
 */
export class ZoomConfig {
    /**
     * The initial value of the slider.
     */
    initial: number;

    /**
     * The minimum value of the slider.
     */
    min: number;

    /**
     * The maximum value of the slider.
     */
    max: number;

    /**
     * The step size of the slider.
     */
    stepSize: number;

    /**
     * Constructor of the ZoomConfig class.
     *
     * @param {number} initial The initial value of the slider.
     * @param {number} min The minimum value of the slider.
     * @param {number} max The maximum value of the slider.
     * @param {number} stepSize The step size of the slider.
     */
    constructor(initial: number, min: number, max: number, stepSize: number) {
        this.initial = initial;
        this.min = min;
        this.max = max;
        this.stepSize = stepSize;
    }
}
