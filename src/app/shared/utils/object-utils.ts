/**
 * Utils method: isEmptyArray.
 *
 * It checks if aan array is null, undefined, or empty.
 *
 * @param value The array to check.
 * @returns True if the array is null, undefined, or empty; false otherwise.
 */
export function isEmptyArray<T>(value: T[] | null | undefined): value is null | undefined | [] {
    return !value || !Array.isArray(value) || value.length === 0;
}

/**
 * Utils method: isEmptyObject.
 *
 * It checks if an object is null, undefined, or empty (no keys).
 *
 * @param value The object to check.
 * @returns True if the object is null, undefined, or empty; false otherwise.
 */
export function isEmptyObject(value: unknown): value is null | undefined | Record<string, never> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return true;
    }
    return Object.keys(value).length === 0;
}

/**
 * Utils constants: UTILS.
 *
 * It keeps a namespace reference to the utils methods.
 */
export const UTILS = {
    isEmptyArray,
    isEmptyObject,
} as const;
