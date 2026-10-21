/**
 * Utils method: isEmptyObject.
 *
 * It checks if an object is null, undefined, or empty (no keys).
 *
 * @param {unknown} value The object to check.
 * @returns {boolean} True if the object is null, undefined, or empty; false otherwise.
 */
export function isEmptyObject(value: unknown): value is null | undefined | Record<string, never> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return true;
    }
    return Object.keys(value).length === 0;
}

/**
 * Utils constants: OBJECT_UTILS.
 *
 * It keeps a namespace reference to the object utils methods.
 */
export const OBJECT_UTILS = {
    isEmptyObject,
} as const;
