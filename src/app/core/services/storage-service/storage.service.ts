import { Injectable } from '@angular/core';

/**
 * The StorageType enumeration.
 *
 * It stores the possible storage types.
 */
export enum StorageType {
    localStorage = 'localStorage',
    sessionStorage = 'sessionStorage'
}

/**
 * The Storage service.
 *
 * It handles the storage of data
 * in the session- or localstorage.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    /**
     * Constructor of the StorageService.
     */
    constructor() {}

    /**
     * Public method: setStorageKey.
     *
     * It sets a given key/item string pair to a given storage type.
     *
     * @param {string} type The given storage type.
     * @param {string} key The given key.
     * @param {string} item The given item.
     *
     * @returns {void} It sets the storage key.
     */
    setStorageKey(type: StorageType, key: string, item: string): void {
        if (!type || !key || !item) {
            return;
        }
        const storage = window[type];
        if (this.storageIsSupported(storage)) {
            const prevItem = this.getStorageKey(type, key);
            storage.setItem(key + '_prev', prevItem);
            storage.setItem(key, item);
        } else {
            return;
        }
    }

    /**
     * Public method: getStorageKey.
     *
     * It gets one item by key from a given storage type.
     *
     * @param {string} type The given storage type.
     * @param {string} key The given key.
     *
     * @returns {string} The item from the storage.
     */
    getStorageKey(type: StorageType, key: string): string {
        if (!type || !key) {
            return null;
        }
        const storage = window[type];
        if (this.storageHasKey(storage, key)) {
            return storage.getItem(key);
        } else {
            return null;
        }
    }

    /**
     * Private method: storageHasKey.
     *
     * It checks if a given storage type has a given key.
     *
     * @param {any} storage The given storage type.
     * @param {string} key The given key.
     *
     * @returns {boolean} The boolean value for the given key in the given storage type.
     */
    private storageHasKey(storage: Storage, key: string): boolean {
        if (this.storageIsSupported(storage)) {
            return !!storage.getItem(key);
        }
        return false;
    }

    /**
     * Private method: storageIsSupported.
     *
     * It checks if a given storage type is supported.
     *
     * @param {Storage} storage The given storage type.
     *
     * @returns {Storage} The local reference to Storage for the given storage type.
     */
    private storageIsSupported(storage: Storage): Storage {
        return typeof storage !== 'undefined' && storage !== null && this.storageIsAvailable(storage);
    }

    /**
     * Private method: storageIsAvailable.
     *
     * It checks if a given storage type is available.
     * cf. https://mathiasbynens.be/notes/localstorage-pattern
     *
     * @param {Storage} storage The given storage type.
     *
     * @returns {boolean} The local reference to Storage for the given storage type.
     */
    private storageIsAvailable(storage: Storage): Storage {
        try {
            // make uid from Date
            const uid = JSON.stringify(new Date());

            // set, get and remove item
            storage.setItem(uid, uid);
            const result = storage.getItem(uid) === uid;
            storage.removeItem(uid);

            // return local reference to Storage or undefined
            return result && storage;
        } catch (e) {}
    }
}
