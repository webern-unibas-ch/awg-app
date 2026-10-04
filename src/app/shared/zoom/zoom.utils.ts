/**
 * Utility method: roundToStepPrecision.
 *
 * It rounds a given value to the same number of decimal places as the given step size.
 * Cf. https://stackoverflow.com/a/13635455
 *
 * @param {number} value The given value to round.
 * @param {number} stepSize The given step size (e.g., of an input range).
 *
 * @returns {number} The rounded value.
 */
export function roundToStepPrecision(value: number, stepSize: number): number {
    // Count decimals of the step size
    // Cf. https://stackoverflow.com/a/17369245
    const decimalPlaces = Math.floor(stepSize) === stepSize ? 0 : stepSize.toString().split('.')[1].length;

    // Avoid Math.round error by using exponential notation
    // Cf. https://www.jacklmoore.com/notes/rounding-in-javascript/
    return Number(Math.round(Number(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
}
