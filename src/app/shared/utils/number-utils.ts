/**
 * Private utils method: _shiftDecimalPoint.
 *
 * It shifts the decimal point of a given value by a given number of places (to the right if positive)
 * via its exponential notation, so it also works for values printed in exponential notation (e.g., 1e-7).
 *
 * @param {number} value The given value.
 * @param {number} places The given number of places.
 * @returns {number} The shifted value.
 */
function _shiftDecimalPoint(value: number, places: number): number {
    const [mantissa = '', exponent = '0'] = String(value).split('e');
    return Number(`${mantissa}e${Number(exponent) + places}`);
}

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
    return _shiftDecimalPoint(Math.round(_shiftDecimalPoint(value, decimals)), -decimals);
}

/**
 * Utils method: roundToStepPrecision.
 *
 * It rounds a given value to the same number of decimal places as the given step size
 * (also for step sizes printed in exponential notation, e.g., 1.5e-7 has 8 decimal places).
 * Cf. https://stackoverflow.com/a/13635455
 *
 * @param {number} value The given value to round.
 * @param {number} stepSize The given step size (e.g., of an input range).
 * @returns {number} The rounded value.
 */
export function roundToStepPrecision(value: number, stepSize: number): number {
    const [mantissa = '', exponent = '0'] = String(stepSize).split('e');
    const mantissaDecimals = mantissa.split('.')[1]?.length ?? 0;
    const decimalPlaces = Math.max(0, mantissaDecimals - Number(exponent));

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
