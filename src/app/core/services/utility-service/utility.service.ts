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
     * Public method: isNotEmptyArray.
     *
     * It checks if a given array of the textcritical comment input
     * is not empty.
     *
     * @param {any[]} checkArray The given array input.
     * @returns {boolean} The boolean result of the check.
     */
    isNotEmptyArray(checkArray: any[]): boolean {
        return checkArray && checkArray.constructor === Array && checkArray.length > 0;
    }

    /**
     * Public method: isNotEmptyObject.
     *
     * It checks if a given object is not empty.
     *
     * @param {any{}} checkObj The given object input.
     *
     * @returns {boolean} The boolean result of the check.
     */
    isNotEmptyObject(checkObj): boolean {
        return Object.keys(checkObj).length !== 0;
    }
}
