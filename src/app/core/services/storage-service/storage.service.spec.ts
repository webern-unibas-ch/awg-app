import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe } from '@testing/expect-helper';
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
            providers: [StorageService],
        });
        // Inject service
        storageService = TestBed.inject(StorageService);

        // Default to sessionStorage
        expectedStorage = expectedSessionStorage;
        mockStorage = mockSessionStorage;

        // Spies replace storage calls with fake mockStorage calls
        // Replace storage calls with fake mockStorage calls
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
        // Clear storages after each test
        expectedStorage.clear();
        mockStorage.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(storageService).toBeTruthy();
    });

    describe('mock test objects (self-test)', () => {
        it('... should use mock storage', () => {
            expectedStorage.setItem('testkey', 'testvalue');

            expectToBe(mockStorage.getItem('testkey'), 'testvalue');

            expectedStorage.removeItem('testkey');

            expect(mockStorage.getItem('testkey')).toBeNull();
        });

        it('... should use correct mock storage', () => {
            const expectedOtherStorage = expectedLocalStorage;
            const otherMockStorage = mockLocalStorage;

            expectedStorage.setItem('testkey', 'testvalue');

            expectToBe(mockStorage.getItem('testkey'), 'testvalue');
            expect(otherMockStorage.getItem('testkey')).toBeNull();

            mockStorage.clear();
            otherMockStorage.clear();

            expectedOtherStorage.setItem('testkey', 'testvalue');

            expectToBe(otherMockStorage.getItem('testkey'), 'testvalue');
            expect(mockStorage.getItem('testkey')).toBeNull();

            otherMockStorage.clear();
        });

        it('... should set and get an item', () => {
            expectedStorage.setItem('testkey', 'testvalue');

            expectToBe(mockStorage.getItem('testkey'), 'testvalue');
        });

        it('... should remove an item', () => {
            expectedStorage.setItem('testkey', 'testvalue');

            expectToBe(mockStorage.getItem('testkey'), 'testvalue');

            expectedStorage.removeItem('testkey');

            expect(mockStorage.getItem('testkey')).toBeNull();
        });

        it('... should remove the correct item', () => {
            expectedStorage.setItem('testkey', 'testvalue');
            expectedStorage.setItem('testkey2', 'testvalue2');

            expectToBe(mockStorage.getItem('testkey'), 'testvalue');
            expectToBe(mockStorage.getItem('testkey2'), 'testvalue2');

            expectedStorage.removeItem('testkey');

            expect(mockStorage.getItem('testkey')).toBeNull();
            expectToBe(mockStorage.getItem('testkey2'), 'testvalue2');

            expectedStorage.removeItem('testkey2');

            expect(mockStorage.getItem('testkey')).toBeNull();
            expect(mockStorage.getItem('testkey2')).toBeNull();
        });

        it('... should clear mock storage after each run', () => {
            expect(mockStorage.getItem('testkey')).toBeNull();
        });
    });

    describe('#setStorageKey()', () => {
        it('... should have a method `setStorageKey`', () => {
            expect(storageService.setStorageKey).toBeDefined();
        });

        it('... should set a given key/item string pair to a given storage type', () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);

            expectToBe(mockStorage.getItem(expectedKey), expectedItem);
        });

        it('... should set item to the correct storage type', () => {
            const otherMockStorage = mockLocalStorage;

            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expect(otherMockStorage.getItem(expectedKey)).toBeNull();

            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            storageService.setStorageKey(localType, expectedKey, otherItem);

            expectToBe(mockStorage.getItem(expectedKey), expectedItem);
            expectToBe(otherMockStorage.getItem(expectedKey), otherItem);

            otherMockStorage.clear();
        });

        it('... should set a new key/item when a key does not exist', () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);

            expectToBe(mockStorage.getItem(expectedKey), expectedItem);
        });

        it('... should overwrite an existing item with the correct item when a key exists', () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();

            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            expectToBe(mockStorage.getItem(expectedKey), expectedItem);

            storageService.setStorageKey(sessionType, expectedKey, otherItem);
            expectToBe(expectedStorage.getItem(expectedKey), otherItem);
        });

        describe('... should do nothing if:', () => {
            it('- storage type is undefined ', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(undefined, expectedKey, expectedItem);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it('- storage type is null', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(null, expectedKey, expectedItem);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it('- storage is not available', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                spyOn<any>(storageService, '_storageIsAvailable').and.returnValue(false);
                storageService.setStorageKey(sessionType, expectedKey, expectedItem);

                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it('- storage is not supported', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                spyOn<any>(storageService, '_storageIsSupported').and.returnValue(false);
                storageService.setStorageKey(sessionType, expectedKey, expectedItem);

                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it('- key is undefined ', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, undefined, expectedItem);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it('- key is null', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, null, expectedItem);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it('- value is undefined ', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, expectedKey, undefined);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });

            it('- value is null', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                storageService.setStorageKey(sessionType, expectedKey, null);
                expect(mockStorage.getItem(expectedKey)).toBeNull();
            });
        });
    });

    describe('#getStorageKey()', () => {
        it('... should have a method `getStorageKey`', () => {
            expect(storageService.getStorageKey).toBeDefined();
        });

        it('... should get an item by key from a given storage type', () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expectedStorage.setItem(expectedKey, expectedItem);

            expectToBe(storageService.getStorageKey(sessionType, expectedKey), expectedItem);
        });

        it('... should get item from the correct storage type', () => {
            const expectedOtherStorage = expectedLocalStorage;
            const otherMockStorage = mockLocalStorage;

            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expect(otherMockStorage.getItem(expectedKey)).toBeNull();

            expectedStorage.setItem(expectedKey, expectedItem);
            expectedOtherStorage.setItem(expectedKey, otherItem);

            expectToBe(storageService.getStorageKey(sessionType, expectedKey), expectedItem);
            expectToBe(storageService.getStorageKey(localType, expectedKey), otherItem);

            otherMockStorage.clear();
        });

        it('... should return null for non existing keys', () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
        });

        describe('... should do nothing if:', () => {
            it('- storage type is undefined ', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expect(storageService.getStorageKey(undefined, expectedKey)).toBeNull();
            });

            it('- storage type is null', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expect(storageService.getStorageKey(null, expectedKey)).toBeNull();
            });

            it('- storage has not the given key', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                spyOn<any>(storageService, '_storageHasKey').and.returnValue(false);

                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });

            it('- storage is not supported', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                spyOn<any>(storageService, '_storageIsSupported').and.returnValue(undefined);

                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });

            it('- storage is not available', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                spyOn<any>(storageService, '_storageIsAvailable').and.returnValue(undefined);

                expect(storageService.getStorageKey(sessionType, expectedKey)).toBeNull();
            });
        });
    });

    describe('#removeStorageKey()', () => {
        it('... should have a method `removeStorageKey`', () => {
            expect(storageService.removeStorageKey).toBeDefined();
        });

        it('... should remove an item by key from a given storage type', () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            expectToBe(mockStorage.getItem(expectedKey), expectedItem);

            storageService.removeStorageKey(sessionType, expectedKey);
            expect(mockStorage.getItem(expectedKey)).toBeNull();
        });

        it('... should remove item from the correct storage type', () => {
            const expectedOtherStorage = expectedLocalStorage;
            const otherMockStorage = mockLocalStorage;

            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expect(otherMockStorage.getItem(expectedKey)).toBeNull();

            expectedStorage.setItem(expectedKey, expectedItem);
            expectedOtherStorage.setItem(expectedKey, otherItem);

            storageService.removeStorageKey(sessionType, expectedKey);

            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expectToBe(otherMockStorage.getItem(expectedKey), otherItem);

            storageService.removeStorageKey(localType, expectedKey);

            expect(otherMockStorage.getItem(expectedKey)).toBeNull();

            otherMockStorage.clear();
        });

        it('... should return for non existing items', () => {
            expect(mockStorage.getItem(expectedKey)).toBeNull();
            expect(storageService.removeStorageKey(sessionType, expectedKey)).toBeUndefined();
        });

        describe('... should do nothing if:', () => {
            it('- storage type is undefined ', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(mockStorage.getItem(expectedKey), expectedItem);

                storageService.removeStorageKey(undefined, expectedKey);

                expectToBe(mockStorage.getItem(expectedKey), expectedItem);
            });

            it('- storage type is null', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(mockStorage.getItem(expectedKey), expectedItem);

                storageService.removeStorageKey(null, expectedKey);

                expectToBe(mockStorage.getItem(expectedKey), expectedItem);
            });

            it('- storage has not the given key', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(mockStorage.getItem(expectedKey), expectedItem);

                spyOn<any>(storageService, '_storageHasKey').and.returnValue(false);
                storageService.removeStorageKey(sessionType, expectedKey);

                expectToBe(mockStorage.getItem(expectedKey), expectedItem);
            });

            it('- storage is not supported', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(expectedStorage.getItem(expectedKey), expectedItem);

                spyOn<any>(storageService, '_storageIsSupported').and.returnValue(undefined);
                storageService.removeStorageKey(sessionType, expectedKey);

                expectToBe(mockStorage.getItem(expectedKey), expectedItem);
            });

            it('- storage is not available', () => {
                expect(mockStorage.getItem(expectedKey)).toBeNull();
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(mockStorage.getItem(expectedKey), expectedItem);

                spyOn<any>(storageService, '_storageIsAvailable').and.returnValue(undefined);
                storageService.removeStorageKey(sessionType, expectedKey);

                expectToBe(mockStorage.getItem(expectedKey), expectedItem);
            });
        });
    });

    describe('#_storageIsAvailable()', () => {
        it('... should have a method `_storageIsAvailable`', () => {
            expect((storageService as any)._storageIsAvailable).toBeDefined();
        });

        it('... should return true if the storage is available', () => {
            expectToBe((storageService as any)._storageIsAvailable(expectedStorage), true);
        });

        it('... should return false if the storage is not available', () => {
            expectToBe((storageService as any)._storageIsAvailable(null), false);
        });
    });
});
