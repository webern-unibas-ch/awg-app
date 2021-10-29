import { Injectable } from '@angular/core';

/**
 * The StorageType enumeration.
 *
 * It stores the possible storage types.
 */
export enum StorageType {
    localStorage = 'localStorage',
    sessionStorage = 'sessionStorage',
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
    providedIn: 'root',
})
export class StorageService {
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
        if (this._storageIsSupported(storage)) {
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
        if (this._storageHasKey(storage, key)) {
            return storage.getItem(key);
        } else {
            return null;
        }
    }

    /**
     * Public method: removeStorageKey.
     *
     * It removes a key from a given storage type.
     *
     * @param {string} type The given storage type.
     * @param {string} key The given key.
     *
     * @returns {void} Removes a key pair from the storage.
     */
    removeStorageKey(type: StorageType, key: string): void {
        if (!type || !key) {
            return;
        }
        const storage = window[type];
        if (this._storageHasKey(storage, key)) {
            storage.removeItem(key);
        } else {
            return;
        }
    }

    /**
     * Private method: _storageHasKey.
     *
     * It checks if a given storage type has a given key.
     *
     * @param {any} storage The given storage type.
     * @param {string} key The given key.
     *
     * @returns {boolean} The boolean value for the given key in the given storage type.
     */
    private _storageHasKey(storage: Storage, key: string): boolean {
        if (this._storageIsSupported(storage)) {
            return !!storage.getItem(key);
        }
        return false;
    }

    /**
     * Private method: _storageIsSupported.
     *
     * It checks if a given storage type is supported.
     *
     * @param {Storage} storage The given storage type.
     *
     * @returns {Storage} The local reference to Storage for the given storage type.
     */
    private _storageIsSupported(storage: Storage): Storage {
        return typeof storage !== 'undefined' && storage !== null && this._storageIsAvailable(storage);
    }

    /**
     * Private method: _storageIsAvailable.
     *
     * It checks if a given storage type is available.
     * cf. https://mathiasbynens.be/notes/localstorage-pattern
     *
     * @param {Storage} storage The given storage type.
     *
     * @returns {Storage} The local reference to Storage for the given storage type.
     */
    private _storageIsAvailable(storage: Storage): Storage {
        try {
            // Make uid from Date
            const uid = new Date().toDateString();

            // Set, get and remove item
            storage.setItem(uid, uid);
            const result = storage.getItem(uid) === uid;

            storage.removeItem(uid);

            // Return local reference to Storage or undefined
            return result && storage;
        } catch (e) {}
    }
}
