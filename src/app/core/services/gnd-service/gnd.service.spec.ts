import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall } from '@testing/expect-helper';
import { mockConsole, mockLocalStorage, mockSessionStorage, mockWindow } from '@testing/mock-helper';

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

    let mockStorage;
    let expectedStorage: Storage;
    const expectedLocalStorage: Storage = window[localType];
    const expectedSessionStorage: Storage = window[sessionType];

    const expectedGndKey = 'gnd';
    const expectedDnbReg = /href="(https?:\/\/d-nb.info\/gnd\/([\w\-]{8,11}))"/i;

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
        expectedStorage = expectedSessionStorage;
        mockStorage = mockSessionStorage;

        // replace storage calls with fake mockStorage calls
        spyOn(expectedSessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
        spyOn(expectedSessionStorage, 'setItem').and.callFake(mockSessionStorage.setItem);
        spyOn(expectedSessionStorage, 'removeItem').and.callFake(mockSessionStorage.removeItem);
        spyOn(expectedSessionStorage, 'clear').and.callFake(mockSessionStorage.clear);

        spyOn(expectedLocalStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
        spyOn(expectedLocalStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
        spyOn(expectedLocalStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
        spyOn(expectedLocalStorage, 'clear').and.callFake(mockLocalStorage.clear);

        // spy on console
        consoleSpy = spyOn(console, 'log').and.callFake(mockConsole.log);

        // spies for private service methods
        setGndToSessionStorageSpy = spyOn<any>(gndService, 'setGndToSessionStorage').and.callThrough();
        removeGndFromSessionStorageSpy = spyOn<any>(gndService, 'removeGndFromSessionStorage').and.callThrough();
        exposeGndMessageToParentSpy = spyOn<any>(gndService, 'exposeGndMessageToParent').and.callThrough();
    });

    afterEach(() => {
        // clear storages and mock objects after each test
        expectedStorage.clear();
        mockStorage.clear();
        mockConsole.clear();
        mockWindow.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(gndService).toBeTruthy();
    });

    describe('mock test objects (self-test)', () => {
        it('... should use mock console', () => {
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
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(undefined);

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('- gndEvent is null', () => {
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(null);

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('- gndEvent has undefined values', () => {
                const expectedDefaultMessage = 'got an uncatched GND event';

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(new GndEvent(undefined, undefined));

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                expectSpyCall(consoleSpy, 1, expectedDefaultMessage);
                expect(mockConsole.get(0)).toBe(expectedDefaultMessage);
            });

            it('- gndEvent has null values', () => {
                const expectedDefaultMessage = 'got an uncatched GND event';

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(new GndEvent(null, null));

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                expectSpyCall(consoleSpy, 1, expectedDefaultMessage);
                expect(mockConsole.get(0)).toBe(expectedDefaultMessage);
            });
        });

        describe('... `set`', () => {
            it('... should call setGndToSessionStorage method if given gndEvent type is `set`', () => {
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(setGndToSessionStorageSpy, 1);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);
            });

            it('... should set key/value pair to storage if given gndEvent type is `set`', () => {
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(setGndToSessionStorageSpy, 1);

                expect(mockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it('... should expose gnd if given gndEvent type is `set`', () => {
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
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
                const expectedOtherStorage = expectedLocalStorage;
                const otherMockStorage = mockLocalStorage;

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                expect(otherMockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(expectedSetEvent);

                expect(mockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
                expect(otherMockStorage.getItem(expectedGndKey)).not.toEqual(
                    expectedItem,
                    `should not be ${otherItem}`
                );
                expect(otherMockStorage.getItem(expectedGndKey)).toBeNull();

                otherMockStorage.clear();
            });

            it('... should overwrite an existing gnd key if gndEvent value has gnd link', () => {
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(expectedSetEvent);
                expect(mockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                gndService.exposeGnd(otherSetEvent);
                expect(mockStorage.getItem(expectedGndKey)).not.toEqual(expectedItem, `should not be ${expectedItem}`);
                expect(mockStorage.getItem(expectedGndKey)).toEqual(otherItem, `should be ${otherItem}`);
            });

            it('... should return null if value has no gnd link', () => {
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(noLinkGndSetEvent);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('... should call helper function with input value to check if value has gnd link', () => {
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(valueHasGndSpy, 1, expectedGndEventValue);
            });

            describe('#valueHasGnd', () => {
                it('... should execute regex check and populate linkRegArr if value has gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();

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
                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                    const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
                    gndService.exposeGnd(noLinkGndSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, noLinkGndEventValue);

                    expect(noLinkGndEventValue).not.toMatch(expectedDnbReg);
                    expect(gndService.linkRegArr).toBeNull();
                });

                it('... should return true (and set item) if value has gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                    const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
                    gndService.exposeGnd(expectedSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, expectedGndEventValue);
                    expect(mockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
                });

                it('... should return false (and set no item) if value has no gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                    const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
                    gndService.exposeGnd(noLinkGndSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, noLinkGndEventValue);

                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();
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
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                expectedStorage.setItem(expectedGndKey, expectedItem);

                expect(mockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                gndService.exposeGnd(expectedRemoveEvent);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('... should expose null value if given gndEvent type is `remove`', () => {
                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, null);
            });

            it('... should expose null value to parent window if target meets parent location (inseri)', () => {
                // set current target to inseri
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
                // set current target to localhost
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
                const expectedOtherStorage = expectedLocalStorage;
                const otherMockStorage = mockLocalStorage;

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                expect(otherMockStorage.getItem(expectedGndKey)).toBeNull();

                expectedStorage.setItem(expectedGndKey, expectedItem);
                expectedOtherStorage.setItem(expectedGndKey, otherItem);

                expect(mockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
                expect(otherMockStorage.getItem(expectedGndKey)).toEqual(otherItem, `should be ${otherItem}`);

                gndService.exposeGnd(expectedRemoveEvent);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                expect(otherMockStorage.getItem(expectedGndKey)).toEqual(otherItem, `should be ${otherItem}`);

                otherMockStorage.clear();
            });

            it(`... should remove the correct item from the storage`, () => {
                const otherKey = 'otherKey';

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                expect(mockStorage.getItem(otherKey)).toBeNull();

                expectedStorage.setItem(expectedGndKey, expectedItem);
                expectedStorage.setItem(otherKey, expectedItem);

                expect(mockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
                expect(mockStorage.getItem(otherKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                gndService.exposeGnd(expectedRemoveEvent);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                expect(mockStorage.getItem(otherKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            describe(`... should do nothing if:`, () => {
                it('- storage has not the gnd key', () => {
                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                    gndService.exposeGnd(expectedRemoveEvent);

                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                });

                it(`- storage has other key but not the gnd key`, () => {
                    const otherKey = 'otherKey';

                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                    expect(mockStorage.getItem(otherKey)).toBeNull();

                    expectedStorage.setItem(otherKey, expectedItem);

                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                    expect(mockStorage.getItem(otherKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                    gndService.exposeGnd(expectedRemoveEvent);

                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                    expect(mockStorage.getItem(otherKey)).toEqual(expectedItem, `should be ${expectedItem}`);
                });
            });
        });
    });
});
