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
     * It checks if a given array input is not empty.
     *
     * @param {any[]} checkArray The given array input.
     *
     * @returns {boolean} The boolean result of the check.
     */
    isNotEmptyArray(checkArray: any[]): boolean {
        if (checkArray && Array.isArray(checkArray)) {
            return checkArray.length !== 0;
        }
        return false;
    }

    /**
     * Public method: isNotEmptyObject.
     *
     * It checks if a given object is not empty.
     *
     * @param {object} checkObj The given object input.
     *
     * @returns {boolean} The boolean result of the check.
     */
    isNotEmptyObject(checkObj: object): boolean {
        if (checkObj && !Array.isArray(checkObj)) {
            return Object.keys(checkObj).length !== 0;
        }
        return false;
    }
}
