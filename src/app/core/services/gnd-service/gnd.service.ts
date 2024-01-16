import { Injectable } from '@angular/core';

import { AppConfig } from '@awg-app/app.config';
import { StorageService, StorageType } from '@awg-core/services/storage-service';

/**
 * The GndEventType enumeration.
 *
 * It stores the possible GND event types.
 */
export enum GndEventType {
    SET = 'set',
    GET = 'get',
    REMOVE = 'remove',
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
    providedIn: 'root',
})
export class GndService extends StorageService {
    /**
     * Readonly variable: GND_KEY.
     *
     * It holds the public key that is set to the storage.
     */
    readonly GND_KEY = 'gnd';

    /**
     * Readonly variable: DNB_REG.
     *
     * It holds the regular expression for a d-nb link in a href.
     */
    readonly DNB_REG = /href="(https?:\/\/d-nb.info\/gnd\/([\w\-]{8,11}))"/i; // Regexp for d-nb links

    /**
     * Readonly variable: CURRENT_LOCATION.
     *
     * Helper function to spy on and set origin in tests.
     * It returns the origin of the current location.
     */
    readonly CURRENT_LOCATION = {
        getOrigin: (location: Location) => location.origin,
    };

    /**
     * Public variable: linkRegArr.
     *
     * It holds the result array of a regex check execution .
     */
    linkRegArr: RegExpExecArray;

    /**
     * Public method: exposeGnd.
     *
     * It  exposes or removes a given gnd event (type, value)
     * to/from the sessionStorage.
     *
     * @param {GndEvent} gndEvent The given GND event.
     *
     * @returns {void} It exposes or removes the event to/from the storage.
     */
    exposeGnd(gndEvent: GndEvent) {
        if (!gndEvent?.type) {
            return;
        }
        switch (gndEvent.type) {
            case GndEventType.SET: {
                this._setGndToSessionStorage(gndEvent.value);
                break;
            }
            case GndEventType.REMOVE: {
                this._removeGndFromSessionStorage();
                break;
            }
            default: {
                console.warn('Got an uncatched GND event', gndEvent);
            }
        }
    }

    /**
     * Public method: _setGndToSessionStorage.
     *
     * It sets a given value to the key defined in 'GND_KEY'
     * in the sessionStorage.
     *
     * @param {string} value The given input value.
     *
     * @returns {void} It sets the key/value pair to the storage.
     */
    private _setGndToSessionStorage(value: string): void {
        if (this._valueHasGnd(value)) {
            // Take last argument (pop) of linkRegArray
            const gndItem = this.linkRegArr.pop().toString();

            // Set to storage
            this.setStorageKey(StorageType.sessionStorage, this.GND_KEY, gndItem);

            // Expose gndItem to parent window
            this._exposeGndMessageToParent(gndItem);
        }
    }

    /**
     * Public method: _removeGndFromSessionStorage.
     *
     * It removes the key defined in 'GND_KEY'
     * from the sessionStorage.
     *
     * @returns {void} It removes the key/value pair from the storage.
     */
    private _removeGndFromSessionStorage(): void {
        this.removeStorageKey(StorageType.sessionStorage, this.GND_KEY);

        // Expose removed gndItem to parent window
        this._exposeGndMessageToParent(null);
    }

    /**
     * Private method: _exposeGndMessageToParent.
     *
     * It exposes a given GND value to the
     * parent windows of the given targets,
     * for now esp. Inseri IFrame,
     * via the Web API postmessage method
     * (cf. https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).
     *
     * @param {string} value The given value to post.
     *
     * @return {void} Sends the postMessage to the parent window.
     */
    private _exposeGndMessageToParent(value: string): void {
        const inseriTarget = AppConfig.INSERI_URL;
        const localTarget = AppConfig.LOCALHOST_URL;
        const targets = [inseriTarget, localTarget];

        for (const target of targets) {
            // Check if parent location meets target
            if (this.CURRENT_LOCATION.getOrigin(window.parent.location) === target) {
                window.parent.window.postMessage({ gnd: value }, target);
            }
        }
    }

    /**
     * Private method: _valueHasGnd.
     *
     * It checks if a given value contains a GND link
     * (checked via the DNB_REG regex).
     *
     * @param {string} checkValue The given value to check.
     *
     * @return {boolean} The boolean result of the check.
     */
    private _valueHasGnd(checkValue: string): boolean {
        if (this.DNB_REG.test(checkValue)) {
            this.linkRegArr = this.DNB_REG.exec(checkValue);
        } else {
            this.linkRegArr = null;
        }
        return !!this.linkRegArr;
    }
}
