import { Injectable } from '@angular/core';

import { AppConfig } from '@awg-app/app.config';
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
export class GndService extends StorageService {
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
    readonly dnbReg = /href="(https?:\/\/d-nb.info\/gnd\/([\w\-]{8,11}))"/i; // Regexp for d-nb links

    /**
     * Readonly variable: currentLocation.
     *
     * Helper function to spy on and set origin in tests.
     * It returns the origin of the current location.
     */
    readonly currentLocation = {
        getOrigin: (location: Location) =>
            // console.info('got location', location);
            location.origin
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
        if (!gndEvent) {
            return;
        }
        switch (gndEvent.type) {
            case GndEventType.set: {
                this.setGndToSessionStorage(gndEvent.value);
                break;
            }
            case GndEventType.remove: {
                this.removeGndFromSessionStorage();
                break;
            }
            default: {
                console.log('got an uncatched GND event', gndEvent);
            }
        }
    }

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
    private setGndToSessionStorage(value: string): void {
        if (this.valueHasGnd(value)) {
            // Take last argument (pop) of linkRegArray
            const gndItem = this.linkRegArr.pop().toString();

            // Set to storage
            this.setStorageKey(StorageType.sessionStorage, this.gndKey, gndItem);

            // Expose gndItem to parent window
            this.exposeGndMessageToParent(gndItem);
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
    private removeGndFromSessionStorage(): void {
        this.removeStorageKey(StorageType.sessionStorage, this.gndKey);

        // Expose removed gndItem to parent window
        this.exposeGndMessageToParent(null);
    }

    /**
     * Private method: exposeGndMessageToParent.
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
    private exposeGndMessageToParent(value: string): void {
        const inseriTarget = AppConfig.INSERI_TEST_URL;
        const localTarget = AppConfig.LOCALHOST_URL;
        const targets = [inseriTarget, localTarget];

        for (const target of targets) {
            // Check if parent location meets target
            if (this.currentLocation.getOrigin(window.parent.location) === target) {
                window.parent.window.postMessage({ gnd: value }, target);
            }
        }
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
        if (this.dnbReg.test(checkValue)) {
            this.linkRegArr = this.dnbReg.exec(checkValue);
        } else {
            this.linkRegArr = null;
        }
        return !!this.linkRegArr;
    }
}
