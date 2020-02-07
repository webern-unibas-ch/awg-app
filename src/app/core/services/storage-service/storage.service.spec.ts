import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { expectSpyCall } from '@testing/expect-helper';

import { StorageService, StorageType } from './storage.service';
import { throwError } from 'rxjs';

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
        storageService = TestBed.get(StorageService);

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
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            expect(expectedMockStorage.getItem(expectedKey)).toBe(expectedItem, `should be ${expectedItem}`);
        });

        it(`... should set item to the correct storage type`, () => {
            const otherStorage = expectedLocalStorage;

            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            storageService.setStorageKey(localType, expectedKey, otherItem);

            expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            expect(otherStorage.getItem(expectedKey)).toEqual(otherItem, `should be ${otherItem}`);
        });

        it(`... should return null for non existing prev item`, () => {
            const expectedPrevKey = expectedKey + '_prev';
            const getStorageKeySpy = spyOn(storageService, 'getStorageKey').and.callThrough();

            storageService.setStorageKey(sessionType, expectedKey, expectedItem);

            expectSpyCall(getStorageKeySpy, 1, sessionType);
            expect(expectedMockStorage.getItem(expectedPrevKey)).toBe('null');
            expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
        });

        it(`... should set correct prev item when existing`, () => {
            const expectedPrevKey = expectedKey + '_prev';
            const getStorageKeySpy = spyOn(storageService, 'getStorageKey').and.callThrough();

            expectedMockStorage.setItem(expectedKey, otherItem);
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);

            expectSpyCall(getStorageKeySpy, 1, sessionType);
            expect(expectedMockStorage.getItem(expectedPrevKey)).toEqual(otherItem, `should be ${otherItem}`);
            expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
        });

        describe(`... should do nothing if:`, () => {
            it(`- storage type is undefined `, () => {
                storageService.setStorageKey(undefined, expectedKey, expectedItem);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- storage type is null`, () => {
                storageService.setStorageKey(null, expectedKey, expectedItem);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- storage is not available`, () => {
                spyOn<any>(storageService, 'storageIsAvailable').and.returnValue(false);
                storageService.setStorageKey(sessionType, expectedKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- storage is not supported`, () => {
                spyOn<any>(storageService, 'storageIsSupported').and.returnValue(false);
                storageService.setStorageKey(sessionType, expectedKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- key is undefined `, () => {
                storageService.setStorageKey(sessionType, undefined, expectedItem);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- key is null`, () => {
                storageService.setStorageKey(sessionType, null, expectedItem);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- value is undefined `, () => {
                storageService.setStorageKey(sessionType, expectedKey, undefined);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- value is null`, () => {
                storageService.setStorageKey(sessionType, expectedKey, null);
                expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            });
        });
    });

    describe('#getStorageKey', () => {
        it(`... should get an item by key from a given storage type`, () => {
            expectedMockStorage.setItem(expectedKey, expectedItem);
            expect(storageService.getStorageKey(sessionType, expectedKey)).toEqual(
                expectedItem,
                `should be ${expectedItem}`
            );
        });

        it('... should return null for non existing items', () => {
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull(); // null
            expect(storageService.getStorageKey(sessionType, 'key')).toBeNull();
        });

        it(`... should get item from the correct storage type`, () => {
            const otherStorage = expectedLocalStorage;

            expectedMockStorage.setItem(expectedKey, expectedItem);
            otherStorage.setItem(expectedKey, otherItem);

            expect(storageService.getStorageKey(sessionType, expectedKey)).toEqual(
                expectedItem,
                `should be ${expectedItem}`
            );
            expect(storageService.getStorageKey(localType, expectedKey)).toEqual(otherItem, `should be ${otherItem}`);
        });

        describe(`... should do nothing if:`, () => {
            it(`- storage type is undefined `, () => {
                expectedMockStorage.setItem(expectedKey, expectedItem);
                expect(storageService.getStorageKey(undefined, expectedKey)).toBeNull();
            });

            it(`- storage type is null`, () => {
                expectedMockStorage.setItem(expectedKey, expectedItem);
                expect(storageService.getStorageKey(null, expectedKey)).toBeNull();
            });

            it(`- storage has not the given key`, () => {
                expectedMockStorage.setItem(expectedKey, expectedItem);

                spyOn<any>(storageService, 'storageHasKey').and.returnValue(false);
                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });

            it(`- storage is not supported`, () => {
                expectedMockStorage.setItem(expectedKey, expectedItem);
                spyOn<any>(storageService, 'storageIsSupported').and.returnValue(undefined);

                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });

            it(`- storage is not available`, () => {
                expectedMockStorage.setItem(expectedKey, expectedItem);
                spyOn<any>(storageService, 'storageIsAvailable').and.returnValue(undefined);

                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });
        });
    });

    describe('#removeStorageKey', () => {
        it(`... should remove an item by key from a given storage type`, () => {
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            expect(expectedMockStorage.getItem(expectedKey)).toBe(expectedItem, `should be ${expectedItem}`);

            storageService.removeStorageKey(sessionType, expectedKey);
            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
        });

        it('... should return null for non existing items', () => {
            expect(storageService.removeStorageKey(sessionType, expectedKey)).toBeNull();
        });

        it(`... should remove item from the correct storage type`, () => {
            const otherStorage = expectedLocalStorage;
            expectedMockStorage.setItem(expectedKey, expectedItem);
            otherStorage.setItem(expectedKey, otherItem);

            storageService.removeStorageKey(sessionType, expectedKey);

            expect(expectedMockStorage.getItem(expectedKey)).toBeNull();
            expect(otherStorage.getItem(expectedKey)).toEqual(otherItem, `should be ${otherItem}`);

            storageService.removeStorageKey(localType, expectedKey);

            expect(otherStorage.getItem(expectedKey)).toBeNull();
        });

        describe(`... should do nothing if:`, () => {
            it(`- storage type is undefined `, () => {
                expectedMockStorage.setItem(expectedKey, expectedItem);

                storageService.removeStorageKey(undefined, expectedKey);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage type is null`, () => {
                expectedMockStorage.setItem(expectedKey, expectedItem);

                storageService.removeStorageKey(null, expectedKey);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage has not the given key`, () => {
                expectedMockStorage.setItem(expectedKey, expectedItem);
                spyOn<any>(storageService, 'storageHasKey').and.returnValue(false);

                storageService.removeStorageKey(sessionType, expectedKey);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage is not supported`, () => {
                expectedMockStorage.setItem(expectedKey, expectedItem);
                spyOn<any>(storageService, 'storageIsSupported').and.returnValue(undefined);

                storageService.removeStorageKey(sessionType, expectedKey);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage is not available`, () => {
                expectedMockStorage.setItem(expectedKey, expectedItem);
                spyOn<any>(storageService, 'storageIsAvailable').and.returnValue(undefined);

                storageService.removeStorageKey(sessionType, expectedKey);

                expect(expectedMockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });
        });
    });
});
