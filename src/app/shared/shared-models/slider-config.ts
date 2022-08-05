/**
 * The SliderConfig class.
 *
 * It is used to configure the slider.
 */
export class SliderConfig {
    /*
     * The initial value of the slider.
     */
    initial: number;

    /*
     * The minimum value of the slider.
     */
    min: number;

    /*
     * The maximum value of the slider.
     */
    max: number;

    /*
     * The step size of the slider.
     */
    stepSize: number;

    /*
     * The current value of the slider.
     */
    value: number;

    /**
     * Constructor of the SliderConfig class.
     *
     * @param {number} initial The initial value of the slider.
     * @param {number} min The minimum value of the slider.
     * @param {number} max The maximum value of the slider.
     * @param {number} stepSize The step size of the slider.
     * @param {number} value The current value of the slider.
     */
    constructor(initial: number, min: number, max: number, stepSize: number, value: number) {
        this.initial = initial;
        this.min = min;
        this.max = max;
        this.stepSize = stepSize;
        this.value = value;
    }
}
