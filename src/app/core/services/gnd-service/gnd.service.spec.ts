import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall } from '@testing/expect-helper';

import { StorageType } from '@awg-core/services/storage-service';
import { GndEvent, GndEventType, GndService } from './gnd.service';

import { AppConfig } from '@awg-app/app.config';

describe('GndService', () => {
    let gndService: GndService;

    const sessionType = StorageType.sessionStorage;
    const localType = StorageType.localStorage;

    let setGndToSessionStorageSpy: Spy;
    let removeGndFromSessionStorageSpy: Spy;
    let exposeGndMessageToParentSpy: Spy;
    let consoleSpy: Spy;

    let mockStorage: {
        getItem: (key: string) => string;
        setItem: (key: string, value: string) => void;
        removeItem: (key: string) => void;
        clear: () => void;
    };
    let mockWindow: {
        postMessage: (value: { gnd: string }, messageTarget: string) => void;
        get: (index: number) => [{ gnd: string }, string];
        clear: () => void;
    };
    let mockConsole: { log: (message: string) => void; get: (index: number) => string; clear: () => void };

    const expectedGndKey = 'gnd';
    const expectedDnbReg = /href="(https?:\/\/d-nb.info\/gnd\/([\w\-]{8,11}))"/i;

    let expectedMockStorage: Storage;
    const expectedLocalStorage: Storage = window[localType];
    const expectedSessionStorage: Storage = window[sessionType];

    const expectedGndEventValue = '<a href="http://d-nb.info/gnd/12345678-X">http://d-nb.info/gnd/12345678-X</a>';
    const expectedItem = '12345678-X';
    const otherGndEventValue = '<a href="http://d-nb.info/gnd/87654321-A">http://d-nb.info/gnd/12345678-X</a>';
    const otherItem = '87654321-A';
    const noLinkGndEventValue = '<a href="http://no-gnd.info/gnd/12345678-X">http://d-nb.info/gnd/12345678-X</a>';

    const expectedSetEvent = new GndEvent(GndEventType.set, expectedGndEventValue);
    const noLinkGndSetEvent = new GndEvent(GndEventType.set, noLinkGndEventValue);
    const otherSetEvent = new GndEvent(GndEventType.set, otherGndEventValue);
    const expectedRemoveEvent = new GndEvent(GndEventType.remove, null);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GndService]
        });
        // inject service
        gndService = TestBed.inject(GndService);

        // default to sessionStorage
        expectedMockStorage = expectedSessionStorage;

        // mock Storage
        let store = {};
        mockStorage = {
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

        // mock window object (to catch postmessage events)
        let windowStore = [];
        mockWindow = {
            postMessage: (value: { gnd: string }, messageTarget: string) => {
                windowStore.push([value, messageTarget]);
            },
            get: (index: number): [{ gnd: string }, string] => {
                return windowStore[index];
            },
            clear: () => {
                windowStore = [];
            }
        };

        // mock Console (to catch console output)
        let consoleArray = [];
        mockConsole = {
            log: (message: string) => {
                consoleArray.push(message);
            },
            get: (index: number): string => {
                return consoleArray[index];
            },

            clear: () => {
                consoleArray = [];
            }
        };

        // replace storage calls with fake mockStorage calls
        spyOn(localStorage, 'getItem').and.callFake(mockStorage.getItem);
        spyOn(localStorage, 'setItem').and.callFake(mockStorage.setItem);
        spyOn(localStorage, 'removeItem').and.callFake(mockStorage.removeItem);
        spyOn(localStorage, 'clear').and.callFake(mockStorage.clear);

        // spies for private service methods
        setGndToSessionStorageSpy = spyOn<any>(gndService, 'setGndToSessionStorage').and.callThrough();
        removeGndFromSessionStorageSpy = spyOn<any>(gndService, 'removeGndFromSessionStorage').and.callThrough();
        exposeGndMessageToParentSpy = spyOn<any>(gndService, 'exposeGndMessageToParent').and.callThrough();
    });

    afterEach(() => {
        // clear storages after each test
        expectedSessionStorage.clear();
        expectedLocalStorage.clear();
        mockConsole.clear();
        mockStorage.clear();
        mockWindow.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(gndService).toBeTruthy();
    });

    describe('... mock test objects (self-test)', () => {
        it('... should use mock console', () => {
            // spy on console
            consoleSpy = spyOn(console, 'log').and.callFake(mockConsole.log);

            console.log('Test');

            expect(mockConsole.get(0)).toBe('Test');
        });

        it('... should clear mock console after each run', () => {
            expect(mockConsole.get(0)).toBeUndefined(`should be undefined`);
        });

        it('... should use mock window', () => {
            // spy on window
            const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

            window.parent.window.postMessage('testMessage', 'testTarget');

            expect(mockWindow.get(0)).toEqual(['testMessage', 'testTarget']);
        });

        it('... should clear mock window after each run', () => {
            expect(mockWindow.get(0)).toBeUndefined(`should be undefined`);
        });

        it('... should use mock storage', () => {
            localStorage.setItem('testkey', 'testvalue');

            expect(mockStorage.getItem('testkey')).toEqual('testvalue', `should be 'testvalue'`);
        });

        it('... should set and get an item', () => {
            mockStorage.setItem('testkey', 'testvalue');

            expect(mockStorage.getItem('testkey')).toEqual('testvalue', `should be 'testvalue'`);
        });

        it('... should remove an item', () => {
            mockStorage.setItem('testkey', 'testvalue');

            expect(mockStorage.getItem('testkey')).toEqual('testvalue', `should be 'testvalue'`);

            mockStorage.removeItem('testkey');

            expect(mockStorage.getItem('testkey')).toBeNull(`should be null`);
        });

        it('... should remove the correct item', () => {
            mockStorage.setItem('testkey', 'testvalue');
            mockStorage.setItem('testkey2', 'testvalue2');

            expect(mockStorage.getItem('testkey')).toEqual('testvalue', `should be 'testvalue'`);
            expect(mockStorage.getItem('testkey2')).toEqual('testvalue2', `should be 'testvalue2'`);

            mockStorage.removeItem('testkey');

            expect(mockStorage.getItem('testkey')).toBeNull(`should be null`);
            expect(mockStorage.getItem('testkey2')).toEqual('testvalue2', `should be 'testvalue2'`);

            mockStorage.removeItem('testkey2');

            expect(mockStorage.getItem('testkey')).toBeNull(`should be null`);
            expect(mockStorage.getItem('testkey2')).toBeNull(`should be null`);
        });

        it('... should clear mock storage after each run', () => {
            expect(mockStorage.getItem('testkey')).toBeNull(`should be undefined`);
        });
    });

    it('should have gndKey', () => {
        expect(gndService.gndKey).toBeTruthy();
        expect(gndService.gndKey).toEqual(expectedGndKey);
    });

    it('should have dnbReg', () => {
        expect(gndService.dnbReg).toBeTruthy();
        expect<RegExp>(gndService.dnbReg).toEqual(expectedDnbReg);
    });

    it('should not have linkRegArr before exposeGnd call', () => {
        expect(gndService.linkRegArr).toBeUndefined();

        gndService.exposeGnd(expectedSetEvent);

        expect(gndService.linkRegArr).toBeDefined();
    });

    describe('#exposeGnd', () => {
        describe(`... should do nothing if:`, () => {
            it('- gndEvent is undefined', () => {
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(undefined);

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('- gndEvent is null', () => {
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(null);

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('- gndEvent has undefined values', () => {
                const expectedDefaultMessage = 'got an uncatched GND event';
                // spy on console
                consoleSpy = spyOn(console, 'log').and.callFake(mockConsole.log);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(new GndEvent(undefined, undefined));

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);
                expectSpyCall(consoleSpy, 1, expectedDefaultMessage);
                expect(mockConsole.get(0)).toBe(expectedDefaultMessage);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                mockConsole.clear();
            });

            it('- gndEvent has null values', () => {
                const expectedDefaultMessage = 'got an uncatched GND event';
                // spy on console
                consoleSpy = spyOn(console, 'log').and.callFake(mockConsole.log);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(new GndEvent(null, null));

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);
                expectSpyCall(consoleSpy, 1, expectedDefaultMessage);
                expect(mockConsole.get(0)).toBe(expectedDefaultMessage);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                mockConsole.clear();
            });
        });

        describe('... `set`', () => {
            it('... should call setGndToSessionStorage method if given gndEvent type is `set`', () => {
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(setGndToSessionStorageSpy, 1);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);
            });

            it('... should set key/value pair to storage if given gndEvent type is `set`', () => {
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(setGndToSessionStorageSpy, 1);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it('... should expose gnd if given gndEvent type is `set`', () => {
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
            });

            it('... should expose gnd to parent window if target meets parent location (awg)', () => {
                // set current target to awg
                const target = AppConfig.AWG_APP_URL;
                const origin = target;

                // spy on current location and return origin
                const locationSpy = spyOn(gndService.currentLocation, 'getOrigin').and.returnValue(origin);
                // spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
                expectSpyCall(postMessageSpy, 1, [{ gnd: expectedItem }, target]);
                expect(mockWindow.get(0)).toEqual(
                    [{ gnd: expectedItem }, target],
                    `should be [{ gnd: ${expectedItem}, ${target}]]`
                );
            });

            it('... should expose gnd to parent window if target meets parent location (inseri)', () => {
                // set current target to Inseri
                const target = AppConfig.INSERI_TEST_URL;
                const origin = target;

                // spy on current location and return origin
                const locationSpy = spyOn(gndService.currentLocation, 'getOrigin').and.returnValue(origin);
                // spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
                expectSpyCall(postMessageSpy, 1, [{ gnd: expectedItem }, target]);
                expect(mockWindow.get(0)).toEqual(
                    [{ gnd: expectedItem }, target],
                    `should be [{ gnd: ${expectedItem}, ${target}]]`
                );
            });

            it('... should expose gnd to parent window if target meets parent location (localhost)', () => {
                // set current target to localhost
                const target = AppConfig.LOCALHOST_URL;
                const origin = target;

                // spy on current location and return origin
                const locationSpy = spyOn(gndService.currentLocation, 'getOrigin').and.returnValue(origin);
                // spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
                expectSpyCall(postMessageSpy, 1, [{ gnd: expectedItem }, target]);
                expect(mockWindow.get(0)).toEqual(
                    [{ gnd: expectedItem }, target],
                    `should be [{ gnd: ${expectedItem}, ${target}]]`
                );
            });

            it('... should not expose gnd to window if target does not meet parent location', () => {
                // set current target to Inseri
                const target = AppConfig.INSERI_TEST_URL;
                const origin = 'http://www.example.com';

                // spy on current location and return origin
                const locationSpy = spyOn(gndService.currentLocation, 'getOrigin').and.returnValue(origin);
                // spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
                expectSpyCall(postMessageSpy, 0);
                expect(mockWindow.get(0)).toBeUndefined(`should be undefined`);
            });

            it(`... should set an item to the correct storage if given gndEvent value has gnd link`, () => {
                const otherStorage = expectedLocalStorage;

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                expect(otherStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(expectedSetEvent);

                expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
                expect(otherStorage.getItem(expectedGndKey)).not.toEqual(expectedItem, `should not be ${otherItem}`);
                expect(otherStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('... should overwrite an existing gnd key if gndEvent value has gnd link', () => {
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(expectedSetEvent);
                expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                gndService.exposeGnd(otherSetEvent);
                expect(expectedMockStorage.getItem(expectedGndKey)).not.toEqual(
                    expectedItem,
                    `should not be ${expectedItem}`
                );
                expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(otherItem, `should be ${otherItem}`);
            });

            it('... should return null if value has no gnd link', () => {
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(noLinkGndSetEvent);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('... should call helper function with input value to check if value has gnd link', () => {
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(valueHasGndSpy, 1, expectedGndEventValue);
            });

            describe('#valueHasGnd', () => {
                it('... should execute regex check and populate linkRegArr if value has gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                    const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callFake(checkValue => {
                        gndService.linkRegArr = gndService.dnbReg.exec(checkValue);
                    });
                    gndService.exposeGnd(expectedSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, expectedGndEventValue);

                    expect(expectedGndEventValue).toMatch(expectedDnbReg);
                    expect(gndService.linkRegArr).toBeDefined();
                    expect(gndService.linkRegArr).toEqual(expectedDnbReg.exec(expectedGndEventValue));
                });

                it('... should execute regex check and set linkRegArr = null if value has no gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                    const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
                    gndService.exposeGnd(noLinkGndSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, noLinkGndEventValue);

                    expect(noLinkGndEventValue).not.toMatch(expectedDnbReg);
                    expect(gndService.linkRegArr).toBeNull();
                });

                it('... should return true (and set item) if value has gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                    const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
                    gndService.exposeGnd(expectedSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, expectedGndEventValue);
                    expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(
                        expectedItem,
                        `should be ${expectedItem}`
                    );
                });

                it('... should return false (and set no item) if value has no gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                    const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
                    gndService.exposeGnd(noLinkGndSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, noLinkGndEventValue);

                    expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                });
            });
        });

        describe('... `remove`', () => {
            it('... should call removeGndFromSessionStorage method if given gndEvent type is `remove`', () => {
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(setGndToSessionStorageSpy, 1);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);
            });

            it('... should remove an item by key from the storage if given gndEvent type is `remove`', () => {
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                expectedMockStorage.setItem(expectedGndKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                gndService.exposeGnd(expectedRemoveEvent);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('... should expose null value if given gndEvent type is `remove`', () => {
                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, null);
            });

            it('... should expose null value to parent window if target meets parent location (awg)', () => {
                // set current target to awg
                const target = AppConfig.AWG_APP_URL;
                const origin = target;

                // spy on current location and return origin
                const locationSpy = spyOn(gndService.currentLocation, 'getOrigin').and.returnValue(origin);
                // spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, null);
                expectSpyCall(postMessageSpy, 1, [{ gnd: null }, target]);
                expect(mockWindow.get(0)).toEqual(
                    [{ gnd: null }, target],
                    `should be [{ gnd: ${expectedItem}, ${target}]]`
                );
            });

            it('... should expose null value to parent window if target meets parent location (inseri)', () => {
                // set current target to awg
                const target = AppConfig.INSERI_TEST_URL;
                const origin = target;

                // spy on current location and return origin
                const locationSpy = spyOn(gndService.currentLocation, 'getOrigin').and.returnValue(origin);
                // spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, null);
                expectSpyCall(postMessageSpy, 1, [{ gnd: null }, target]);
                expect(mockWindow.get(0)).toEqual(
                    [{ gnd: null }, target],
                    `should be [{ gnd: ${expectedItem}, ${target}]]`
                );
            });

            it('... should expose null value to parent window if target meets parent location (localhost)', () => {
                // set current target to awg
                const target = AppConfig.LOCALHOST_URL;
                const origin = target;

                // spy on current location and return origin
                const locationSpy = spyOn(gndService.currentLocation, 'getOrigin').and.returnValue(origin);
                // spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, null);
                expectSpyCall(postMessageSpy, 1, [{ gnd: null }, target]);
                expect(mockWindow.get(0)).toEqual(
                    [{ gnd: null }, target],
                    `should be [{ gnd: ${expectedItem}, ${target}]]`
                );
            });

            it('... should remove an item from the correct storage', () => {
                const otherStorage = expectedLocalStorage;

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                expect(otherStorage.getItem(expectedGndKey)).toBeNull();

                expectedMockStorage.setItem(expectedGndKey, expectedItem);
                otherStorage.setItem(expectedGndKey, otherItem);

                expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
                expect(otherStorage.getItem(expectedGndKey)).toEqual(otherItem, `should be ${otherItem}`);

                gndService.exposeGnd(expectedRemoveEvent);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                expect(otherStorage.getItem(expectedGndKey)).toEqual(otherItem, `should be ${otherItem}`);
            });

            it(`... should remove the correct item from the storage`, () => {
                const otherKey = 'otherKey';

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                expect(expectedMockStorage.getItem(otherKey)).toBeNull();

                expectedMockStorage.setItem(expectedGndKey, expectedItem);
                expectedMockStorage.setItem(otherKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
                expect(expectedMockStorage.getItem(otherKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                gndService.exposeGnd(expectedRemoveEvent);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                expect(expectedMockStorage.getItem(otherKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            describe(`... should do nothing if:`, () => {
                it('- storage has not the gnd key', () => {
                    expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                    gndService.exposeGnd(expectedRemoveEvent);

                    expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                });

                it(`- storage has other key but not the gnd key`, () => {
                    const otherKey = 'otherKey';

                    expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                    expect(expectedMockStorage.getItem(otherKey)).toBeNull();

                    expectedMockStorage.setItem(otherKey, expectedItem);

                    expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                    expect(expectedMockStorage.getItem(otherKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                    gndService.exposeGnd(expectedRemoveEvent);

                    expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                    expect(expectedMockStorage.getItem(otherKey)).toEqual(expectedItem, `should be ${expectedItem}`);
                });
            });
        });
    });
});
