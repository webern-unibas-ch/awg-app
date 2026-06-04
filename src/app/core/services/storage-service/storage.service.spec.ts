import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe } from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';

import { StorageService, StorageType } from './storage.service';

describe('StorageService (DONE)', () => {
    let storageService: StorageService;

    const sessionType = StorageType.sessionStorage;
    const localType = StorageType.localStorage;

    let expectedStorage: Storage;
    let expectedLocalStorage!: Storage;
    let expectedSessionStorage!: Storage;

    let consoleSpy: Spy;

    const expectedKey = 'key';
    const expectedItem = 'expectedItem';
    const otherItem = 'otherItem';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StorageService],
        });
        // Inject service
        storageService = TestBed.inject(StorageService);

        expectedLocalStorage = window[localType] as Storage;
        expectedSessionStorage = window[sessionType] as Storage;

        // Default to sessionStorage
        expectedStorage = expectedSessionStorage;

        consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
    });

    afterEach(() => {
        // Clear storages and mocks after each test
        expectedSessionStorage?.clear();
        expectedLocalStorage?.clear();
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(storageService).toBeTruthy();
    });

    describe('storage environment sanity checks', () => {
        it('... should isolate session and local storage', () => {
            const otherStorage = expectedLocalStorage;

            expectedStorage.setItem('testkey', 'testvalue');

            expectToBe(expectedStorage.getItem('testkey'), 'testvalue');
            expectToBe(otherStorage.getItem('testkey'), null);

            expectedStorage.clear();
            otherStorage.clear();

            otherStorage.setItem('testkey', 'testvalue');

            expectToBe(otherStorage.getItem('testkey'), 'testvalue');
            expectToBe(expectedStorage.getItem('testkey'), null);

            otherStorage.clear();
        });

        it('... should start each test with empty default storage', () => {
            expectToBe(expectedStorage.getItem('testkey'), null);
        });
    });

    describe('#setStorageKey()', () => {
        it('... should have a method `setStorageKey`', () => {
            expect(storageService.setStorageKey).toBeDefined();
        });

        it('... should set a given key/item string pair to a given storage type', () => {
            expectToBe(expectedStorage.getItem(expectedKey), null);
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);

            expectToBe(expectedStorage.getItem(expectedKey), expectedItem);
        });

        it('... should set item to the correct storage type', () => {
            const otherMockStorage = expectedLocalStorage;

            expectToBe(expectedStorage.getItem(expectedKey), null);
            expectToBe(otherMockStorage.getItem(expectedKey), null);

            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            storageService.setStorageKey(localType, expectedKey, otherItem);

            expectToBe(expectedStorage.getItem(expectedKey), expectedItem);
            expectToBe(otherMockStorage.getItem(expectedKey), otherItem);

            otherMockStorage.clear();
        });

        it('... should set a new key/item when a key does not exist', () => {
            expectToBe(expectedStorage.getItem(expectedKey), null);
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);

            expectToBe(expectedStorage.getItem(expectedKey), expectedItem);
        });

        it('... should overwrite an existing item with the correct item when a key exists', () => {
            expectToBe(expectedStorage.getItem(expectedKey), null);

            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            expectToBe(expectedStorage.getItem(expectedKey), expectedItem);

            storageService.setStorageKey(sessionType, expectedKey, otherItem);
            expectToBe(expectedStorage.getItem(expectedKey), otherItem);
        });

        describe('... should do nothing if:', () => {
            it('- storage type is undefined ', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                storageService.setStorageKey(undefined, expectedKey, expectedItem);
                expectToBe(expectedStorage.getItem(expectedKey), null);
            });

            it('- storage type is null', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                storageService.setStorageKey(null, expectedKey, expectedItem);
                expectToBe(expectedStorage.getItem(expectedKey), null);
            });

            it('- storage is not available', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                vi.spyOn(storageService as any, '_storageIsAvailable').mockReturnValue(false);
                storageService.setStorageKey(sessionType, expectedKey, expectedItem);

                expectToBe(expectedStorage.getItem(expectedKey), null);
            });

            it('- storage is not supported', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                vi.spyOn(storageService as any, '_storageIsSupported').mockReturnValue(false);
                storageService.setStorageKey(sessionType, expectedKey, expectedItem);

                expectToBe(expectedStorage.getItem(expectedKey), null);
            });

            it('- key is undefined ', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                storageService.setStorageKey(sessionType, undefined, expectedItem);
                expectToBe(expectedStorage.getItem(expectedKey), null);
            });

            it('- key is null', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                storageService.setStorageKey(sessionType, null, expectedItem);
                expectToBe(expectedStorage.getItem(expectedKey), null);
            });

            it('- value is undefined ', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                storageService.setStorageKey(sessionType, expectedKey, undefined);
                expectToBe(expectedStorage.getItem(expectedKey), null);
            });

            it('- value is null', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                storageService.setStorageKey(sessionType, expectedKey, null);
                expectToBe(expectedStorage.getItem(expectedKey), null);
            });
        });
    });

    describe('#getStorageKey()', () => {
        it('... should have a method `getStorageKey`', () => {
            expect(storageService.getStorageKey).toBeDefined();
        });

        it('... should get an item by key from a given storage type', () => {
            expectToBe(expectedStorage.getItem(expectedKey), null);
            expectedStorage.setItem(expectedKey, expectedItem);

            expectToBe(storageService.getStorageKey(sessionType, expectedKey), expectedItem);
        });

        it('... should get item from the correct storage type', () => {
            const otherStorage = expectedLocalStorage;

            expectToBe(expectedStorage.getItem(expectedKey), null);
            expectToBe(otherStorage.getItem(expectedKey), null);

            expectedStorage.setItem(expectedKey, expectedItem);
            otherStorage.setItem(expectedKey, otherItem);

            expectToBe(storageService.getStorageKey(sessionType, expectedKey), expectedItem);
            expectToBe(storageService.getStorageKey(localType, expectedKey), otherItem);

            otherStorage.clear();
        });

        it('... should return null for non existing keys', () => {
            expectToBe(expectedStorage.getItem(expectedKey), null);
            expectToBe(storageService.getStorageKey(sessionType, expectedKey), null);
        });

        describe('... should do nothing if:', () => {
            it('- storage type is undefined ', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(storageService.getStorageKey(undefined, expectedKey), null);
            });

            it('- storage type is null', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(storageService.getStorageKey(null, expectedKey), null);
            });

            it('- storage has not the given key', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                expectedStorage.setItem(expectedKey, expectedItem);

                vi.spyOn(storageService as any, '_storageHasKey').mockReturnValue(false);

                expectToBe(storageService.getStorageKey(sessionType, expectedKey), null);
            });

            it('- storage is not supported', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                expectedStorage.setItem(expectedKey, expectedItem);

                vi.spyOn(storageService as any, '_storageIsSupported').mockReturnValue(undefined);

                expectToBe(storageService.getStorageKey(sessionType, expectedKey), null);
            });

            it('- storage is not available', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                expectedStorage.setItem(expectedKey, expectedItem);

                vi.spyOn(storageService as any, '_storageIsAvailable').mockReturnValue(undefined);

                expectToBe(storageService.getStorageKey(sessionType, expectedKey), null);
            });
        });
    });

    describe('#removeStorageKey()', () => {
        it('... should have a method `removeStorageKey`', () => {
            expect(storageService.removeStorageKey).toBeDefined();
        });

        it('... should remove an item by key from a given storage type', () => {
            expectToBe(expectedStorage.getItem(expectedKey), null);
            storageService.setStorageKey(sessionType, expectedKey, expectedItem);
            expectToBe(expectedStorage.getItem(expectedKey), expectedItem);

            storageService.removeStorageKey(sessionType, expectedKey);
            expectToBe(expectedStorage.getItem(expectedKey), null);
        });

        it('... should remove item from the correct storage type', () => {
            const otherStorage = expectedLocalStorage;

            expectToBe(expectedStorage.getItem(expectedKey), null);
            expectToBe(otherStorage.getItem(expectedKey), null);

            expectedStorage.setItem(expectedKey, expectedItem);
            otherStorage.setItem(expectedKey, otherItem);

            storageService.removeStorageKey(sessionType, expectedKey);

            expectToBe(expectedStorage.getItem(expectedKey), null);
            expectToBe(otherStorage.getItem(expectedKey), otherItem);

            storageService.removeStorageKey(localType, expectedKey);

            expectToBe(otherStorage.getItem(expectedKey), null);

            otherStorage.clear();
        });

        it('... should return for non existing items', () => {
            expectToBe(expectedStorage.getItem(expectedKey), null);
            expect(storageService.removeStorageKey(sessionType, expectedKey)).toBeUndefined();
        });

        describe('... should do nothing if:', () => {
            it('- storage type is undefined ', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(expectedStorage.getItem(expectedKey), expectedItem);

                storageService.removeStorageKey(undefined, expectedKey);

                expectToBe(expectedStorage.getItem(expectedKey), expectedItem);
            });

            it('- storage type is null', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(expectedStorage.getItem(expectedKey), expectedItem);

                storageService.removeStorageKey(null, expectedKey);

                expectToBe(expectedStorage.getItem(expectedKey), expectedItem);
            });

            it('- storage has not the given key', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(expectedStorage.getItem(expectedKey), expectedItem);

                vi.spyOn(storageService as any, '_storageHasKey').mockReturnValue(false);
                storageService.removeStorageKey(sessionType, expectedKey);

                expectToBe(expectedStorage.getItem(expectedKey), expectedItem);
            });

            it('- storage is not supported', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(expectedStorage.getItem(expectedKey), expectedItem);

                vi.spyOn(storageService as any, '_storageIsSupported').mockReturnValue(undefined);
                storageService.removeStorageKey(sessionType, expectedKey);

                expectToBe(expectedStorage.getItem(expectedKey), expectedItem);
            });

            it('- storage is not available', () => {
                expectToBe(expectedStorage.getItem(expectedKey), null);
                expectedStorage.setItem(expectedKey, expectedItem);

                expectToBe(expectedStorage.getItem(expectedKey), expectedItem);

                vi.spyOn(storageService as any, '_storageIsAvailable').mockReturnValue(undefined);
                storageService.removeStorageKey(sessionType, expectedKey);

                expectToBe(expectedStorage.getItem(expectedKey), expectedItem);
            });
        });
    });

    describe('#_storageIsAvailable()', () => {
        it('... should have a method `_storageIsAvailable`', () => {
            expect((storageService as any)._storageIsAvailable).toBeDefined();
        });

        it('... should return true if the storage is available', () => {
            expectToBe((storageService as any)._storageIsAvailable(expectedStorage), true);
            expectSpyCall(consoleSpy, 0);
        });

        it('... should return false and log an error if the storage is not available', () => {
            expectToBe((storageService as any)._storageIsAvailable(null), false);
            expectSpyCall(consoleSpy, 1, ['Storage is not available:']);
        });
    });
});
