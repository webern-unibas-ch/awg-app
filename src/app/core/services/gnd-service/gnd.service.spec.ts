import { TestBed } from '@angular/core/testing';

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockConsole, mockStorage, mockWindow } from '@testing/mock-helper';

import { AppConfig } from '@awg-app/app.config';
import { StorageType } from '@awg-core/services/storage-service';

import { GndEvent, GndEventType, GndService } from './gnd.service';

describe('GndService (DONE)', () => {
    let gndService: GndService;

    let setGndToSessionStorageSpy: Spy;
    let removeGndFromSessionStorageSpy: Spy;
    let exposeGndMessageToParentSpy: Spy;
    let consoleSpy: Spy;

    const sessionType = StorageType.sessionStorage;
    const localType = StorageType.localStorage;
    let expectedStorage: Storage;
    let expectedLocalStorage!: Storage;
    let expectedSessionStorage!: Storage;
    let initialStorageDescriptors: ReturnType<typeof mockStorage.captureStorageDescriptors>;

    const expectedGndKey = 'gnd';
    const expectedDnbReg = /href="(https?:\/\/d-nb.info\/gnd\/([\w-]{8,11}))"/i;

    const expectedGndEventValue = '<a href="http://d-nb.info/gnd/12345678-X">http://d-nb.info/gnd/12345678-X</a>';
    const expectedItem = '12345678-X';
    const otherGndEventValue = '<a href="http://d-nb.info/gnd/87654321-A">http://d-nb.info/gnd/12345678-X</a>';
    const otherItem = '87654321-A';
    const noLinkGndEventValue = '<a href="http://no-gnd.info/gnd/12345678-X">http://d-nb.info/gnd/12345678-X</a>';

    const expectedSetEvent = new GndEvent(GndEventType.SET, expectedGndEventValue);
    const noLinkGndSetEvent = new GndEvent(GndEventType.SET, noLinkGndEventValue);
    const otherSetEvent = new GndEvent(GndEventType.SET, otherGndEventValue);
    const expectedRemoveEvent = new GndEvent(GndEventType.REMOVE, null);

    beforeAll(() => {
        initialStorageDescriptors = mockStorage.captureStorageDescriptors([localType, sessionType]);
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GndService],
        });

        // Inject service
        gndService = TestBed.inject(GndService);

        expectedLocalStorage = mockStorage.ensureStorage(localType);
        expectedSessionStorage = mockStorage.ensureStorage(sessionType);

        // Default to sessionStorage
        expectedStorage = expectedSessionStorage;
        // Spy on console
        consoleSpy = vi.spyOn(console, 'warn').mockImplementation(mockConsole.log);

        // Spies for private service methods
        setGndToSessionStorageSpy = vi.spyOn(gndService as any, '_setGndToSessionStorage');
        removeGndFromSessionStorageSpy = vi.spyOn(gndService as any, '_removeGndFromSessionStorage');
        exposeGndMessageToParentSpy = vi.spyOn(gndService as any, '_exposeGndMessageToParent');
    });

    afterEach(() => {
        // Clear storages and mocks after each test
        mockConsole.clear();
        mockStorage.clearStorages([sessionType, localType]);
        mockWindow.clear();
        vi.restoreAllMocks();
    });

    afterAll(() => {
        mockStorage.restoreStorageDescriptors(initialStorageDescriptors);
    });

    it('... should create', () => {
        expect(gndService).toBeTruthy();
    });

    describe('test environment sanity checks', () => {
        it('... should use mock console', () => {
            console.warn('Test');

            expectToBe(mockConsole.get(0), 'Test');
        });

        it('... should clear mock console after each run', () => {
            expect(mockConsole.get(0)).toBeUndefined();
        });

        it('... should use mock window', () => {
            // Spy on window
            const postMessageSpy = vi
                .spyOn(window.parent.window, 'postMessage')
                .mockImplementation(mockWindow.postMessage);

            window.parent.window.postMessage('testMessage', 'testTarget');

            expectSpyCall(postMessageSpy, 1, 'testMessage');
            expectToEqual(mockWindow.get(0), ['testMessage', 'testTarget']);
        });

        it('... should clear mock window after each run', () => {
            expect(mockWindow.get(0)).toBeUndefined();
        });

        it('... should fallback to in-memory sessionStorage when window access throws', () => {
            mockStorage.restoreStorageDescriptors(initialStorageDescriptors);

            Object.defineProperty(window, sessionType, {
                configurable: true,
                get: () => {
                    throw new DOMException('Blocked by test', 'SecurityError');
                },
            });

            const fallbackSessionStorage = mockStorage.ensureStorage(sessionType);

            expectToBe(fallbackSessionStorage.getItem(expectedGndKey), null);
            expectToBe(fallbackSessionStorage.length, 0);
            expectToBe(fallbackSessionStorage.key(0), null);

            gndService.exposeGnd(expectedSetEvent);

            expectToBe(fallbackSessionStorage.getItem(expectedGndKey), expectedItem);
            expectToBe(fallbackSessionStorage.length, 1);
            expectToBe(fallbackSessionStorage.key(0), expectedGndKey);
            expectToBe(fallbackSessionStorage.key(1), null);
        });

        it('... should isolate session and local storage', () => {
            const otherStorage = expectedLocalStorage;

            expectedStorage.setItem('testkey', 'testvalue');

            expectToBe(expectedStorage.getItem('testkey'), 'testvalue');
            expectToBe(otherStorage.getItem('testkey'), null);

            expectedStorage.clear();
            otherStorage.clear();
        });

        it('... should start each test with empty default storage', () => {
            expectToBe(expectedStorage.length, 0);
            expectToBe(expectedStorage.key(0), null);
            expectToBe(expectedStorage.getItem('testkey'), null);
        });

        it('... should delete storage property if descriptor is missing on restore', () => {
            const currentDescriptors = mockStorage.captureStorageDescriptors([localType, sessionType]);

            Object.defineProperty(window, sessionType, {
                configurable: true,
                value: expectedSessionStorage,
            });

            expect(Object.getOwnPropertyDescriptor(window, sessionType)).toBeDefined();

            mockStorage.restoreStorageDescriptors({ localStorage: currentDescriptors.localStorage });

            expect(Object.getOwnPropertyDescriptor(window, sessionType)).toBeUndefined();

            mockStorage.restoreStorageDescriptors(currentDescriptors);
        });
    });

    it('... should have GND_KEY', () => {
        expectToBe(gndService.GND_KEY, expectedGndKey);
    });

    it('... should have DNB_REG', () => {
        expectToEqual(<RegExp>gndService.DNB_REG, expectedDnbReg);
    });

    it('... should not have linkRegArr before exposeGnd call', () => {
        expect(gndService.linkRegArr).toBeUndefined();

        gndService.exposeGnd(expectedSetEvent);

        expect(gndService.linkRegArr).toBeDefined();
    });

    describe('#exposeGnd()', () => {
        it('... should have a method `exposeGnd`', () => {
            expect(gndService.exposeGnd).toBeDefined();
        });

        describe('... should not do anything if', () => {
            it('... gndEvent is undefined', () => {
                expectToBe(expectedStorage.getItem(expectedGndKey), null);

                gndService.exposeGnd(undefined);

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expectToBe(expectedStorage.getItem(expectedGndKey), null);
            });

            it('... gndEvent is null', () => {
                expectToBe(expectedStorage.getItem(expectedGndKey), null);

                gndService.exposeGnd(null);

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expectToBe(expectedStorage.getItem(expectedGndKey), null);
            });

            it('... gndEvent has undefined type', () => {
                expectToBe(expectedStorage.getItem(expectedGndKey), null);

                gndService.exposeGnd(new GndEvent(undefined, '123'));

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expectToBe(expectedStorage.getItem(expectedGndKey), null);
            });

            it('... gndEvent has type null', () => {
                expectToBe(expectedStorage.getItem(expectedGndKey), null);

                gndService.exposeGnd(new GndEvent(null, '123'));

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expectToBe(expectedStorage.getItem(expectedGndKey), null);
            });

            it('... gndEvent has GET type', () => {
                const expectedDefaultMessage = 'Got an uncatched GND event';

                expectToBe(expectedStorage.getItem(expectedGndKey), null);

                gndService.exposeGnd(new GndEvent(GndEventType.GET, '123'));

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);
                expectToBe(expectedStorage.getItem(expectedGndKey), null);

                expectSpyCall(consoleSpy, 1, expectedDefaultMessage);
                expectToBe(mockConsole.get(0), expectedDefaultMessage);
            });
        });

        describe('... `set`', () => {
            it('... should call setGndToSessionStorage method if given gndEvent type is `set`', () => {
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(setGndToSessionStorageSpy, 1);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);
            });

            it('... should set key/value pair to storage if given gndEvent type is `set`', () => {
                expectToBe(expectedStorage.getItem(expectedGndKey), null);

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(setGndToSessionStorageSpy, 1);

                expectToBe(expectedStorage.getItem(expectedGndKey), expectedItem);
            });

            it('... should expose gnd if given gndEvent type is `set`', () => {
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
            });

            it('... should expose gnd to parent window if target meets parent location (inseri)', () => {
                // Set current target to Inseri
                const target = AppConfig.INSERI_URL;

                // Spy on current location and return target
                vi.spyOn(gndService.CURRENT_LOCATION, 'getOrigin').mockReturnValue(target);
                // Spy on postMessage call
                const postMessageSpy = vi
                    .spyOn(window.parent.window, 'postMessage')
                    .mockImplementation(mockWindow.postMessage);

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
                expectSpyCall(postMessageSpy, 1, [{ gnd: expectedItem }, target]);
                expectToEqual(mockWindow.get(0), [{ gnd: expectedItem }, target]);
            });

            it('... should expose gnd to parent window if target meets parent location (localhost)', () => {
                // Set current target to localhost
                const target = AppConfig.LOCALHOST_URL;

                // Spy on current location and return target
                vi.spyOn(gndService.CURRENT_LOCATION, 'getOrigin').mockReturnValue(target);
                // Spy on postMessage call
                const postMessageSpy = vi
                    .spyOn(window.parent.window, 'postMessage')
                    .mockImplementation(mockWindow.postMessage);

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
                expectSpyCall(postMessageSpy, 1, [{ gnd: expectedItem }, target]);
                expectToEqual(mockWindow.get(0), [{ gnd: expectedItem }, target]);
            });

            it('... should not expose gnd to window if target does not meet parent location', () => {
                // Set current target to Inseri
                const target = 'http://www.example.com';

                // Spy on current location and return target
                vi.spyOn(gndService.CURRENT_LOCATION, 'getOrigin').mockReturnValue(target);
                // Spy on postMessage call
                const postMessageSpy = vi
                    .spyOn(window.parent.window, 'postMessage')
                    .mockImplementation(mockWindow.postMessage);

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
                expectSpyCall(postMessageSpy, 0);
                expect(mockWindow.get(0)).toBeUndefined();
            });

            it('... should set an item to the correct storage if given gndEvent value has gnd link', () => {
                const otherStorage = expectedLocalStorage;

                expectToBe(expectedStorage.getItem(expectedGndKey), null);
                expectToBe(otherStorage.getItem(expectedGndKey), null);

                gndService.exposeGnd(expectedSetEvent);

                expectToBe(expectedStorage.getItem(expectedGndKey), expectedItem);
                expectToBe(otherStorage.getItem(expectedGndKey), null);

                otherStorage.clear();
            });

            it('... should overwrite an existing gnd key if gndEvent value has gnd link', () => {
                expectToBe(expectedStorage.getItem(expectedGndKey), null);

                gndService.exposeGnd(expectedSetEvent);
                expectToBe(expectedStorage.getItem(expectedGndKey), expectedItem);

                gndService.exposeGnd(otherSetEvent);
                expectToBe(expectedStorage.getItem(expectedGndKey), otherItem);
            });

            it('... should return null if value has no gnd link', () => {
                expectToBe(expectedStorage.getItem(expectedGndKey), null);

                gndService.exposeGnd(noLinkGndSetEvent);

                expectToBe(expectedStorage.getItem(expectedGndKey), null);
            });

            it('... should call helper function with input value to check if value has gnd link', () => {
                expectToBe(expectedStorage.getItem(expectedGndKey), null);

                const valueHasGndSpy = vi.spyOn(gndService as any, '_valueHasGnd');
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(valueHasGndSpy, 1, expectedGndEventValue);
            });

            describe('#_valueHasGnd()', () => {
                it('... should have a method `_valueHasGnd`', () => {
                    expect((gndService as any)._valueHasGnd).toBeDefined();
                });

                it('... should execute regex check and populate linkRegArr if value has gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expectToBe(expectedStorage.getItem(expectedGndKey), null);

                    const valueHasGndSpy = vi
                        .spyOn(gndService as any, '_valueHasGnd')
                        .mockImplementation((checkValue: string) => {
                            gndService.linkRegArr = gndService.DNB_REG.exec(checkValue);
                        });
                    gndService.exposeGnd(expectedSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, expectedGndEventValue);

                    expect(expectedGndEventValue).toMatch(expectedDnbReg);
                    expectToEqual(gndService.linkRegArr, expectedDnbReg.exec(expectedGndEventValue));
                });

                it('... should execute regex check and set linkRegArr = null if value has no gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expectToBe(expectedStorage.getItem(expectedGndKey), null);

                    const valueHasGndSpy = vi.spyOn(gndService as any, '_valueHasGnd');
                    gndService.exposeGnd(noLinkGndSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, noLinkGndEventValue);

                    expect(noLinkGndEventValue).not.toMatch(expectedDnbReg);
                    expectToBe(gndService.linkRegArr, null);
                });

                it('... should return true (and set item) if value has gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expectToBe(expectedStorage.getItem(expectedGndKey), null);

                    const valueHasGndSpy = vi.spyOn(gndService as any, '_valueHasGnd');
                    gndService.exposeGnd(expectedSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, expectedGndEventValue);
                    expectToBe(expectedStorage.getItem(expectedGndKey), expectedItem);
                });

                it('... should return false (and set no item) if value has no gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expectToBe(expectedStorage.getItem(expectedGndKey), null);

                    const valueHasGndSpy = vi.spyOn(gndService as any, '_valueHasGnd');
                    gndService.exposeGnd(noLinkGndSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, noLinkGndEventValue);

                    expectToBe(expectedStorage.getItem(expectedGndKey), null);
                });
            });
        });

        describe('... `remove`', () => {
            it('... should call removeGndFromSessionStorage method if given gndEvent type is `remove`', () => {
                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 1);
            });

            it('... should remove an item by key from the storage if given gndEvent type is `remove`', () => {
                expectToBe(expectedStorage.getItem(expectedGndKey), null);
                expectedStorage.setItem(expectedGndKey, expectedItem);

                expectToBe(expectedStorage.getItem(expectedGndKey), expectedItem);

                gndService.exposeGnd(expectedRemoveEvent);

                expectToBe(expectedStorage.getItem(expectedGndKey), null);
            });

            it('... should expose null value if given gndEvent type is `remove`', () => {
                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, null);
            });

            it('... should expose null value to parent window if target meets parent location (inseri)', () => {
                // Set current target to inseri
                const target = AppConfig.INSERI_URL;

                // Spy on current location and return target
                vi.spyOn(gndService.CURRENT_LOCATION, 'getOrigin').mockReturnValue(target);
                // Spy on postMessage call
                const postMessageSpy = vi
                    .spyOn(window.parent.window, 'postMessage')
                    .mockImplementation(mockWindow.postMessage);

                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, null);
                expectSpyCall(postMessageSpy, 1, [{ gnd: null }, target]);
                expectToEqual(mockWindow.get(0), [{ gnd: null }, target]);
            });

            it('... should expose null value to parent window if target meets parent location (localhost)', () => {
                // Set current target to localhost
                const target = AppConfig.LOCALHOST_URL;

                // Spy on current location and return target
                vi.spyOn(gndService.CURRENT_LOCATION, 'getOrigin').mockReturnValue(target);
                // Spy on postMessage call
                const postMessageSpy = vi
                    .spyOn(window.parent.window, 'postMessage')
                    .mockImplementation(mockWindow.postMessage);

                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, null);
                expectSpyCall(postMessageSpy, 1, [{ gnd: null }, target]);
                expectToEqual(mockWindow.get(0), [{ gnd: null }, target]);
            });

            it('... should remove an item from the correct storage', () => {
                const otherStorage = expectedLocalStorage;

                expectToBe(expectedStorage.getItem(expectedGndKey), null);
                expectToBe(otherStorage.getItem(expectedGndKey), null);

                expectedStorage.setItem(expectedGndKey, expectedItem);
                otherStorage.setItem(expectedGndKey, otherItem);

                expectToBe(expectedStorage.getItem(expectedGndKey), expectedItem);
                expectToBe(otherStorage.getItem(expectedGndKey), otherItem);

                gndService.exposeGnd(expectedRemoveEvent);

                expectToBe(expectedStorage.getItem(expectedGndKey), null);
                expectToBe(otherStorage.getItem(expectedGndKey), otherItem);

                otherStorage.clear();
            });

            it('... should remove the correct item from the storage', () => {
                const otherKey = 'otherKey';

                expectToBe(expectedStorage.getItem(expectedGndKey), null);
                expectToBe(expectedStorage.getItem(otherKey), null);

                expectedStorage.setItem(expectedGndKey, expectedItem);
                expectedStorage.setItem(otherKey, expectedItem);

                expectToBe(expectedStorage.getItem(expectedGndKey), expectedItem);
                expectToBe(expectedStorage.getItem(otherKey), expectedItem);

                gndService.exposeGnd(expectedRemoveEvent);

                expectToBe(expectedStorage.getItem(expectedGndKey), null);
                expectToBe(expectedStorage.getItem(otherKey), expectedItem);
            });

            describe('... should do nothing if:', () => {
                it('- storage has not the gnd key', () => {
                    expectToBe(expectedStorage.getItem(expectedGndKey), null);

                    gndService.exposeGnd(expectedRemoveEvent);

                    expectToBe(expectedStorage.getItem(expectedGndKey), null);
                });

                it('- storage has other key but not the gnd key', () => {
                    const otherKey = 'otherKey';

                    expectToBe(expectedStorage.getItem(expectedGndKey), null);
                    expectToBe(expectedStorage.getItem(otherKey), null);

                    expectedStorage.setItem(otherKey, expectedItem);

                    expectToBe(expectedStorage.getItem(expectedGndKey), null);
                    expectToBe(expectedStorage.getItem(otherKey), expectedItem);

                    gndService.exposeGnd(expectedRemoveEvent);

                    expectToBe(expectedStorage.getItem(expectedGndKey), null);
                    expectToBe(expectedStorage.getItem(otherKey), expectedItem);
                });
            });
        });
    });
});
