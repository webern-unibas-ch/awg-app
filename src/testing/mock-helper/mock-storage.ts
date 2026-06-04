/**
 * The internal IStorageDescriptorMap interface.
 *
 * It stores optional property descriptors for window storage types.
 */
interface IStorageDescriptorMap {
    localStorage?: PropertyDescriptor;
    sessionStorage?: PropertyDescriptor;
}

/**
 * Type for supported window storage names.
 */
export type WindowStorageType = 'localStorage' | 'sessionStorage';

/**
 * Creates an in-memory Storage implementation.
 */
const createInMemoryStorage = (): Storage => {
    const store = new Map<string, string>();

    return {
        get length() {
            return store.size;
        },
        clear() {
            store.clear();
        },
        getItem(key: string) {
            return store.has(key) ? store.get(key) : null;
        },
        key(index: number) {
            return Array.from(store.keys())[index] ?? null;
        },
        removeItem(key: string) {
            store.delete(key);
        },
        setItem(key: string, value: string) {
            store.set(key, value);
        },
    };
};

/**
 * Test helper: mockStorage.
 *
 * It ensures window storage availability and can restore original descriptors.
 */
export const mockStorage = {
    captureStorageDescriptors(types: WindowStorageType[]): IStorageDescriptorMap {
        return types.reduce((descriptors: IStorageDescriptorMap, type: WindowStorageType) => {
            descriptors[type] = Object.getOwnPropertyDescriptor(window, type);
            return descriptors;
        }, {});
    },

    ensureStorage(type: WindowStorageType): Storage {
        const availableStorage = window[type] as Storage | undefined;
        if (availableStorage) {
            return availableStorage;
        }

        const fallbackStorage = createInMemoryStorage();
        Object.defineProperty(window, type, {
            configurable: true,
            value: fallbackStorage,
        });

        return window[type] as Storage;
    },

    clearStorages(types: WindowStorageType[]): void {
        types.forEach((type: WindowStorageType) => {
            const storage = window[type] as Storage | undefined;
            storage?.clear();
        });
    },

    restoreStorageDescriptors(descriptors: IStorageDescriptorMap): void {
        const storageTypes: WindowStorageType[] = ['localStorage', 'sessionStorage'];

        storageTypes.forEach((type: WindowStorageType) => {
            const descriptor = descriptors[type];
            if (descriptor) {
                Object.defineProperty(window, type, descriptor);
            } else {
                Reflect.deleteProperty(window, type);
            }
        });
    },
};
