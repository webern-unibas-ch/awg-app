/**
 * Utils method: roundToDecimals.
 *
 * It rounds a given value to a given number of decimal places.
 * The exponential notation avoids the floating point errors of Math.round (e.g., 1.005 => 1.01),
 * cf. https://www.jacklmoore.com/notes/rounding-in-javascript/
 *
 * @param {number} value The given value to round.
 * @param {number} decimals The given number of decimal places.
 * @returns {number} The rounded value.
 */
export function roundToDecimals(value: number, decimals: number): number {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

/**
 * Utils method: roundToStepPrecision.
 *
 * It rounds a given value to the same number of decimal places as the given step size.
 * Cf. https://stackoverflow.com/a/13635455
 *
 * @param {number} value The given value to round.
 * @param {number} stepSize The given step size (e.g., of an input range).
 * @returns {number} The rounded value.
 */
export function roundToStepPrecision(value: number, stepSize: number): number {
    // Count decimals of the step size
    const decimalPlaces = Math.floor(stepSize) === stepSize ? 0 : stepSize.toString().split('.')[1].length;

    return roundToDecimals(value, decimalPlaces);
}

/**
 * Utils constants: NUMBER_UTILS.
 *
 * It keeps a namespace reference to the number utils methods.
 */
export const NUMBER_UTILS = {
    roundToDecimals,
    roundToStepPrecision,
} as const;
