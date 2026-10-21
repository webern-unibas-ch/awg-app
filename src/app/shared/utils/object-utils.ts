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
 * Utils method: isKeyOf.
 *
 * It checks if a given key is an own key of a given object (no prototype keys)
 * and narrows the key to the keys of the object.
 *
 * @param {T} object The object to check.
 * @param {PropertyKey} key The key to check.
 * @returns {boolean} True if the key is an own key of the object; false otherwise.
 */
export function isKeyOf<T extends object>(object: T, key: PropertyKey): key is keyof T {
    return Object.hasOwn(object, key);
}

/**
 * Utils constants: OBJECT_UTILS.
 *
 * It keeps a namespace reference to the object utils methods.
 */
export const OBJECT_UTILS = {
    isEmptyObject,
    isKeyOf,
} as const;
