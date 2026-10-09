/**
 * Utils method: isSketchId.
 *
 * It checks whether the given string ID represents a sketch ID.
 *
 * @param {string} id The given string ID to check.
 * @returns {boolean} True if the ID is a valid sketch ID, false otherwise.
 */
export function isSketchId(id: string | null | undefined): id is string {
    if (!id) {
        return false;
    }
    return id.includes('_Sk') || id.includes('SkRT');
}

/**
 * Utils method: isWorkEditionId.
 *
 * It checks if the given id is a work edition id.
 *
 * @param {string} id The given id.
 * @returns {boolean} The result of the check.
 */
export function isWorkEditionId(id: string): boolean {
    if (!id) {
        return false;
    }
    return id.includes('_WE');
}

/**
 * Utils constants: EDITION_UTILS.
 *
 * It keeps a namespace reference to the edition utils methods.
 */
export const EDITION_UTILS = {
    isSketchId,
    isWorkEditionId,
} as const;
