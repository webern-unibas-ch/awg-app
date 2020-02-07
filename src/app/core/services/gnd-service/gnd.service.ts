import { Injectable } from '@angular/core';

import { StorageType, StorageService } from '@awg-core/services/storage-service';

/**
 * The GndEventType enumeration.
 *
 * It stores the possible GND event types.
 */
export enum GndEventType {
    set = 'set',
    get = 'get',
    remove = 'remove'
}

/**
 * The GndEvent class.
 *
 * It stores a GND event.
 */
export class GndEvent {
    /**
     * The type of the GND event.
     */
    type: GndEventType;

    /**
     * The value of the GND event (GND number).
     */
    value: string;

    /**
     * Constructor of the GndEvent class.
     *
     * It initializes the class with a given type and value.
     *
     * @param {GndEventType} type The given GND event type.
     * @param {string} value The given GND value.
     */
    constructor(type: GndEventType, value: string) {
        this.type = type;
        this.value = value;
    }
}

/**
 * The GND service.
 *
 * It handles the exposure of GND values
 * to the session storage via the StorageService
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class GndService {
    /**
     * Readonly variable: gndKey.
     *
     * It holds the public key that is set to the storage.
     */
    readonly gndKey = 'gnd';

    /**
     * Readonly variable: dnbReg.
     *
     * It holds the regular expression for a d-nb link in a href.
     */
    readonly dnbReg = /href="(https?:\/\/d-nb.info\/gnd\/([\w\-]{8,11}))"/i; // regexp for d-nb links

    /**
     * Public variable: linkRegArr.
     *
     * It holds the result array of a regex check execution .
     */
    linkRegArr: RegExpExecArray;

    constructor(private storageService: StorageService) {}

    /**
     * Public method: setGndToSessionStorage.
     *
     * It sets a given value to the key defined in 'gndKey'
     * in the sessionStorage.
     *
     * @param {string} value The given input value.
     *
     * @returns {void} It sets the key/value pair to the storage.
     */
    setGndToSessionStorage(value: string): void {
        if (this.valueHasGnd(value)) {
            let gndItem: string;
            // take last argument (pop) of linkRegArray
            gndItem = this.linkRegArr.pop().toString();
            this.storageService.setStorageKey(StorageType.sessionStorage, this.gndKey, gndItem);
        } else {
            this.removeGndFromSessionStorage();
        }
    }

    /**
     * Public method: removeGndFromSessionStorage.
     *
     * It removes the key defined in 'gndKey'
     * from the sessionStorage.
     *
     * @returns {void} It removes the key/value pair from the storage.
     */
    removeGndFromSessionStorage(): void {
        this.storageService.removeStorageKey(StorageType.sessionStorage, this.gndKey);
    }

    /**
     * Private method: valueHasGnd.
     *
     * It checks if a given value contains a GND link
     * (checked via the dnbReg regex).
     *
     * @param {string} checkValue The given value to check.
     *
     * @return {boolean} The boolean result of the check.
     */
    private valueHasGnd(checkValue: string): boolean {
        if (this.dnbReg.exec(checkValue)) {
            this.linkRegArr = this.dnbReg.exec(checkValue);
        } else {
            this.linkRegArr = null;
        }
        return !!this.linkRegArr;
    }
}
