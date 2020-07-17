import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { StorageService, StorageType } from './storage.service';

describe('StorageService', () => {
    let storageService: StorageService;

    const sessionType = StorageType.sessionStorage;
    const localType = StorageType.localStorage;

    let expectedMockStorage: Storage;
    const expectedLocalStorage: Storage = window[localType];
    const expectedSessionStorage: Storage = window[sessionType];

    const expectedKey = 'key';
    const expectedItem = 'expectedItem';
    const otherItem = 'otherItem';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StorageService]
        });
        // inject service
        storageService = TestBed.inject(StorageService);

        // default to sessionStorage
        expectedMockStorage = expectedSessionStorage;

        // mock Storage
        let store = {};
        const mockStorage = {
            getItem: (key: string): string => {
                return key in store ? store[key] : null;
            },
            setItem: (key: string, value: string) => {
                store[key] = `${value}`;
            },
            removeItem: (key: string) => {
                delete store[key];
            },
            clear: () => {
                store = {};
            }
        };

        // spies replace storage calls with fake mockStorage calls
        spyOn(localStorage, 'getItem').and.callFake(mockStorage.getItem);
        spyOn(localStorage, 'setItem').and.callFake(mockStorage.setItem);
        spyOn(localStorage, 'removeItem').and.callFake(mockStorage.removeItem);
        spyOn(localStorage, 'clear').and.callFake(mockStorage.clear);
    });

    afterEach(() => {
        // clear storages after each test
        expectedSessionStorage.clear();
        expectedLocalStorage.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(storageService).toBeTruthy();
    });

    describe('mockStorage', () => {
        it('... should set, get and remove items from mockSessionStorage', () => {
            expectedMockStorage = expectedSessionStorage;

            expect(expectedMockStorage.setItem('foo', 'bar'));
            expect(expectedMockStorage.getItem('foo')).toBe('bar'); // bar
            expect(expectedMockStorage.removeItem('foo')).toBeUndefined(); // undefined
            expect(expectedMockStorage.getItem('foo')).toBeNull(); // null
        });

        it('... should set, get and remove items from mockLocalStorage', () => {
            expectedMockStorage = expectedLocalStorage;

            expect(expectedMockStorage.setItem('foo', 'bar'));
            expect(expectedMockStorage.getItem('foo')).toBe('bar'); // bar
            expect(expectedMockStorage.removeItem('foo')).toBeUndefined(); // undefined
            expect(expectedMockStorage.getItem('foo')).toBeNull(); // null
        });

        it('... should set, get items and clear mockSessionStorage', () => {
            expectedMockStorage = expectedSessionStorage;

            expect(expectedMockStorage.setItem('foo', 'bar'));
            expect(expectedMockStorage.setItem('bar', 'foo'));
            expect(expectedMockStorage.getItem('foo')).toBe('bar'); // bar
            expect(expectedMockStorage.getItem('bar')).toBe('foo'); // foo
            expect(expectedMockStorage.clear()).toBeUndefined(); // undefined
            expect(expectedMockStorage.getItem('foo')).toBeNull(); // null
            expect(expectedMockStorage.getItem('bar')).toBeNull(); // null
        });

        it('... should set, get items and clear mockLocalStorage', () => {
            expectedMockStorage = expectedLocalStorage;

            expect(expectedMockStorage.setItem('foo', 'bar'));
            expect(expectedMockStorage.setItem('bar', 'foo'));
            expect(expectedMockStorage.getItem('foo')).toBe('bar'); // bar
            expect(expectedMockStorage.getItem('bar')).toBe('foo'); // foo
            expect(expectedMockStorage.clear()).toBeUndefined(); // undefined
            expect(expectedMockStorage.getItem('foo')).toBeNull(); // null
            expect(expectedMockStorage.getItem('bar')).toBeNull(); // null
        });
    });

    describe('#setStorageKey', () => {
        it(`... should set a given key/item string pair to a given storage type`, () => {
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            expect(expectedMockStorage.getItem(expectedKey)).toBe(expectedItem, `should be ${expectedItem}`);
        });

        it(`... should set item to the correct storage type`, () => {
            const otherStorage = expectedLocalStorage;
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            expect(otherStorage.getItem(expectedKey)).toBeNull();

            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            storageService.setStorageKey(localType, expectedKey, otherItem);

            expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            expect(otherStorage.getItem(expectedKey)).toEqual(otherItem, `should be ${otherItem}`);
        });

        it(`... should set a new key/item when a key does not exist`, () => {
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);

            expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
        });

        it(`... should overwrite an existing item with the correct item when a key exists`, () => {
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

            storageService.setStorageKey(sessionType, expectedKey, otherItem);
            expect(expectedMockStorage.getItem(expectedKey)).toEqual(otherItem, `should be ${otherItem}`);
        });

        describe(`... should do nothing if:`, () => {
            it(`- storage type is undefined `, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(undefined, expectedKey, expectedItem);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- storage type is null`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(null, expectedKey, expectedItem);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- storage is not available`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                spyOn<any>(storageService, 'storageIsAvailable').and.returnValue(false);
                storageService.setStorageKey(sessionType, expectedKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- storage is not supported`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                spyOn<any>(storageService, 'storageIsSupported').and.returnValue(false);
                storageService.setStorageKey(sessionType, expectedKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- key is undefined `, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, undefined, expectedItem);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- key is null`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, null, expectedItem);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- value is undefined `, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, expectedKey, undefined);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- value is null`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, expectedKey, null);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });
        });
    });

    describe('#getStorageKey', () => {
        it(`... should get an item by key from a given storage type`, () => {
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            expectedMockStorage.setItem(expectedKey, expectedItem);

            expect(storageService.getStorageKey(sessionType, expectedKey)).toEqual(
                expectedItem,
                `should be ${expectedItem}`
            );
        });

        it(`... should get item from the correct storage type`, () => {
            const otherStorage = expectedLocalStorage;

            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            expect(otherStorage.getItem(expectedKey)).toBeNull();

            expectedMockStorage.setItem(expectedKey, expectedItem);
            otherStorage.setItem(expectedKey, otherItem);

            expect(storageService.getStorageKey(sessionType, expectedKey)).toEqual(
                expectedItem,
                `should be ${expectedItem}`
            );
            expect(storageService.getStorageKey(localType, expectedKey)).toEqual(otherItem, `should be ${otherItem}`);
        });

        it('... should return null for non existing keys', () => {
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
        });

        describe(`... should do nothing if:`, () => {
            it(`- storage type is undefined `, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                expectedMockStorage.setItem(expectedKey, expectedItem);

                expect(storageService.getStorageKey(undefined, expectedKey)).toBeNull();
            });

            it(`- storage type is null`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                expectedMockStorage.setItem(expectedKey, expectedItem);

                expect(storageService.getStorageKey(null, expectedKey)).toBeNull();
            });

            it(`- storage has not the given key`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                expectedMockStorage.setItem(expectedKey, expectedItem);

                spyOn<any>(storageService, 'storageHasKey').and.returnValue(false);

                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });

            it(`- storage is not supported`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                expectedMockStorage.setItem(expectedKey, expectedItem);

                spyOn<any>(storageService, 'storageIsSupported').and.returnValue(undefined);

                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });

            it(`- storage is not available`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                expectedMockStorage.setItem(expectedKey, expectedItem);

                spyOn<any>(storageService, 'storageIsAvailable').and.returnValue(undefined);

                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });
        });
    });

    describe('#removeStorageKey', () => {
        it(`... should remove an item by key from a given storage type`, () => {
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            expect(expectedMockStorage.getItem(expectedKey)).toBe(expectedItem, `should be ${expectedItem}`);

            storageService.removeStorageKey(sessionType, expectedKey);
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
        });

        it(`... should remove item from the correct storage type`, () => {
            const otherStorage = expectedLocalStorage;
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            expect(otherStorage.getItem(expectedKey)).toBeNull();

            expectedMockStorage.setItem(expectedKey, expectedItem);
            otherStorage.setItem(expectedKey, otherItem);

            storageService.removeStorageKey(sessionType, expectedKey);

            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            expect(otherStorage.getItem(expectedKey)).toEqual(otherItem, `should be ${otherItem}`);

            storageService.removeStorageKey(localType, expectedKey);

            expect(otherStorage.getItem(expectedKey)).toBeNull();
        });

        it('... should return for non existing items', () => {
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            expect(storageService.removeStorageKey(sessionType, expectedKey)).toBeUndefined();
        });

        describe(`... should do nothing if:`, () => {
            it(`- storage type is undefined `, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                expectedMockStorage.setItem(expectedKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                storageService.removeStorageKey(undefined, expectedKey);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage type is null`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                expectedMockStorage.setItem(expectedKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                storageService.removeStorageKey(null, expectedKey);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage has not the given key`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                expectedMockStorage.setItem(expectedKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                spyOn<any>(storageService, 'storageHasKey').and.returnValue(false);
                storageService.removeStorageKey(sessionType, expectedKey);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage is not supported`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                expectedMockStorage.setItem(expectedKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                spyOn<any>(storageService, 'storageIsSupported').and.returnValue(undefined);
                storageService.removeStorageKey(sessionType, expectedKey);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage is not available`, () => {
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
                expectedMockStorage.setItem(expectedKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                spyOn<any>(storageService, 'storageIsAvailable').and.returnValue(undefined);
                storageService.removeStorageKey(sessionType, expectedKey);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });
        });
    });
});
