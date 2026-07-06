import { Injectable } from '@angular/core';

/**
 * The Utility service.
 *
 * It handles some utility functions used throughout the app.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class UtilityService {
    /**
     * Public method: isEmptyArray.
     *
     * It checks if aan array is null, undefined, or empty.
     *
     * @param value The array to check.
     * @returns True if the array is null, undefined, or empty; false otherwise.
     */
    isEmptyArray<T>(value: T[] | null | undefined): value is null | undefined | [] {
        return !value || !Array.isArray(value) || value.length === 0;
    }

    /**
     * Public method: isEmptyObject.
     *
     * It checks if an object is null, undefined, or empty (no keys).
     *
     * @param value The object to check.
     * @returns True if the object is null, undefined, or empty; false otherwise.
     */
    isEmptyObject(value: unknown): value is null | undefined | Record<string, never> {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return true;
        }
        return Object.keys(value).length === 0;
    }

    /**
     * Public method: isSketchId.
     *
     * It checks whether the given string ID represents a sketch ID.
     *
     * @param {string} id The given string ID to check.
     * @returns {boolean} True if the ID is a valid sketch ID, false otherwise.
     */
    isSketchId(id: string | null | undefined): id is string {
        if (!id) {
            return false;
        }
        return id.includes('_Sk') || id.includes('SkRT');
    }
}
