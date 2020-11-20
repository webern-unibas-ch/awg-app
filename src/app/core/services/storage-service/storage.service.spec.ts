import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { mockLocalStorage, mockSessionStorage } from '@testing/mock-helper';

import { StorageService, StorageType } from './storage.service';

describe('StorageService (DONE)', () => {
    let storageService: StorageService;

    const sessionType = StorageType.sessionStorage;
    const localType = StorageType.localStorage;

    let mockStorage;
    let expectedStorage: Storage;
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
        expectedStorage = expectedSessionStorage;
        mockStorage = mockSessionStorage;

        // spies replace storage calls with fake mockStorage calls
        // replace storage calls with fake mockStorage calls
        spyOn(expectedSessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
        spyOn(expectedSessionStorage, 'setItem').and.callFake(mockSessionStorage.setItem);
        spyOn(expectedSessionStorage, 'removeItem').and.callFake(mockSessionStorage.removeItem);
        spyOn(expectedSessionStorage, 'clear').and.callFake(mockSessionStorage.clear);

        spyOn(expectedLocalStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
        spyOn(expectedLocalStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
        spyOn(expectedLocalStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
        spyOn(expectedLocalStorage, 'clear').and.callFake(mockLocalStorage.clear);
    });

    afterEach(() => {
        // clear storages after each test
        expectedStorage.clear();
        mockStorage.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(storageService).toBeTruthy();
    });

    describe('mock test objects (self-test)', () => {
        it('... should use mock storage', () => {
            expectedStorage.setItem('testkey', 'testvalue');

            expect(mockStorage.getItem('testkey')).toEqual('testvalue', `should be 'testvalue'`);

            expectedStorage.removeItem('testkey');

            expect(mockStorage.getItem('testkey')).toBeNull(`should be null`);
        });

        it('... should use correct mock storage', () => {
            const expectedOtherStorage = expectedLocalStorage;
            const otherMockStorage = mockLocalStorage;

            expectedStorage.setItem('testkey', 'testvalue');

            expect(mockStorage.getItem('testkey')).toEqual('testvalue', `should be 'testvalue'`);
            expect(otherMockStorage.getItem('testkey')).toBeNull(`should be null`);

            mockStorage.clear();
            otherMockStorage.clear();

            expectedOtherStorage.setItem('testkey', 'testvalue');

            expect(otherMockStorage.getItem('testkey')).toEqual('testvalue', `should be 'testvalue'`);
            expect(mockStorage.getItem('testkey')).toBeNull(`should be null`);

            otherMockStorage.clear();
        });

        it('... should set and get an item', () => {
            expectedStorage.setItem('testkey', 'testvalue');

            expect(mockStorage.getItem('testkey')).toEqual('testvalue', `should be 'testvalue'`);
        });

        it('... should remove an item', () => {
            expectedStorage.setItem('testkey', 'testvalue');

            expect(mockStorage.getItem('testkey')).toEqual('testvalue', `should be 'testvalue'`);

            expectedStorage.removeItem('testkey');

            expect(mockStorage.getItem('testkey')).toBeNull(`should be null`);
        });

        it('... should remove the correct item', () => {
            expectedStorage.setItem('testkey', 'testvalue');
            expectedStorage.setItem('testkey2', 'testvalue2');

            expect(mockStorage.getItem('testkey')).toEqual('testvalue', `should be 'testvalue'`);
            expect(mockStorage.getItem('testkey2')).toEqual('testvalue2', `should be 'testvalue2'`);

            expectedStorage.removeItem('testkey');

            expect(mockStorage.getItem('testkey')).toBeNull(`should be null`);
            expect(mockStorage.getItem('testkey2')).toEqual('testvalue2', `should be 'testvalue2'`);

            expectedStorage.removeItem('testkey2');

            expect(mockStorage.getItem('testkey')).toBeNull(`should be null`);
            expect(mockStorage.getItem('testkey2')).toBeNull(`should be null`);
        });

        it('... should clear mock storage after each run', () => {
            expect(mockStorage.getItem('testkey')).toBeNull(`should be undefined`);
        });
    });

    describe('#setStorageKey', () => {
        it(`... should set a given key/item string pair to a given storage type`, () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);

            expect(mockStorage.getItem(expectedKey)).toBe(expectedItem, `should be ${expectedItem}`);
        });

        it(`... should set item to the correct storage type`, () => {
            const otherMockStorage = mockLocalStorage;

            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expect(otherMockStorage.getItem(expectedKey)).toBeNull();

            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            storageService.setStorageKey(localType, expectedKey, otherItem);

            expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            expect(otherMockStorage.getItem(expectedKey)).toEqual(otherItem, `should be ${otherItem}`);

            otherMockStorage.clear();
        });

        it(`... should set a new key/item when a key does not exist`, () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);

            expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
        });

        it(`... should overwrite an existing item with the correct item when a key exists`, () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();

            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

            storageService.setStorageKey(sessionType, expectedKey, otherItem);
            expect(expectedStorage.getItem(expectedKey)).toEqual(otherItem, `should be ${otherItem}`);
        });

        describe(`... should do nothing if:`, () => {
            it(`- storage type is undefined `, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(undefined, expectedKey, expectedItem);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- storage type is null`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(null, expectedKey, expectedItem);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- storage is not available`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                spyOn<any>(storageService, 'storageIsAvailable').and.returnValue(false);
                storageService.setStorageKey(sessionType, expectedKey, expectedItem);

                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- storage is not supported`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                spyOn<any>(storageService, 'storageIsSupported').and.returnValue(false);
                storageService.setStorageKey(sessionType, expectedKey, expectedItem);

                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- key is undefined `, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, undefined, expectedItem);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- key is null`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, null, expectedItem);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- value is undefined `, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, expectedKey, undefined);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it(`- value is null`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, expectedKey, null);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });
        });
    });

    describe('#getStorageKey', () => {
        it(`... should get an item by key from a given storage type`, () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expectedStorage.setItem(expectedKey, expectedItem);

            expect(storageService.getStorageKey(sessionType, expectedKey)).toEqual(
                expectedItem,
                `should be ${expectedItem}`
            );
        });

        it(`... should get item from the correct storage type`, () => {
            const expectedOtherStorage = expectedLocalStorage;
            const otherMockStorage = mockLocalStorage;

            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expect(otherMockStorage.getItem(expectedKey)).toBeNull();

            expectedStorage.setItem(expectedKey, expectedItem);
            expectedOtherStorage.setItem(expectedKey, otherItem);

            expect(storageService.getStorageKey(sessionType, expectedKey)).toEqual(
                expectedItem,
                `should be ${expectedItem}`
            );
            expect(storageService.getStorageKey(localType, expectedKey)).toEqual(otherItem, `should be ${otherItem}`);

            otherMockStorage.clear();
        });

        it('... should return null for non existing keys', () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
        });

        describe(`... should do nothing if:`, () => {
            it(`- storage type is undefined `, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expect(storageService.getStorageKey(undefined, expectedKey)).toBeNull();
            });

            it(`- storage type is null`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expect(storageService.getStorageKey(null, expectedKey)).toBeNull();
            });

            it(`- storage has not the given key`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                spyOn<any>(storageService, 'storageHasKey').and.returnValue(false);

                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });

            it(`- storage is not supported`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                spyOn<any>(storageService, 'storageIsSupported').and.returnValue(undefined);

                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });

            it(`- storage is not available`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                spyOn<any>(storageService, 'storageIsAvailable').and.returnValue(undefined);

                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });
        });
    });

    describe('#removeStorageKey', () => {
        it(`... should remove an item by key from a given storage type`, () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            expect(mockStorage.getItem(expectedKey)).toBe(expectedItem, `should be ${expectedItem}`);

            storageService.removeStorageKey(sessionType, expectedKey);
            expect(mockStorage.getItem(expectedKey)).toBeNull();
        });

        it(`... should remove item from the correct storage type`, () => {
            const expectedOtherStorage = expectedLocalStorage;
            const otherMockStorage = mockLocalStorage;

            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expect(otherMockStorage.getItem(expectedKey)).toBeNull();

            expectedStorage.setItem(expectedKey, expectedItem);
            expectedOtherStorage.setItem(expectedKey, otherItem);

            storageService.removeStorageKey(sessionType, expectedKey);

            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expect(otherMockStorage.getItem(expectedKey)).toEqual(otherItem, `should be ${otherItem}`);

            storageService.removeStorageKey(localType, expectedKey);

            expect(otherMockStorage.getItem(expectedKey)).toBeNull();

            otherMockStorage.clear();
        });

        it('... should return for non existing items', () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expect(storageService.removeStorageKey(sessionType, expectedKey)).toBeUndefined();
        });

        describe(`... should do nothing if:`, () => {
            it(`- storage type is undefined `, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                storageService.removeStorageKey(undefined, expectedKey);

                expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage type is null`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                storageService.removeStorageKey(null, expectedKey);

                expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage has not the given key`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                spyOn<any>(storageService, 'storageHasKey').and.returnValue(false);
                storageService.removeStorageKey(sessionType, expectedKey);

                expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage is not supported`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expect(expectedStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                spyOn<any>(storageService, 'storageIsSupported').and.returnValue(undefined);
                storageService.removeStorageKey(sessionType, expectedKey);

                expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it(`- storage is not available`, () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                spyOn<any>(storageService, 'storageIsAvailable').and.returnValue(undefined);
                storageService.removeStorageKey(sessionType, expectedKey);

                expect(mockStorage.getItem(expectedKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });
        });
    });
});
