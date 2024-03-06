import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockConsole, mockLocalStorage, mockSessionStorage, mockWindow } from '@testing/mock-helper';

import { AppConfig } from '@awg-app/app.config';

import { StorageType } from '@awg-core/services/storage-service';
import { GndEvent, GndEventType, GndService } from './gnd.service';
import Spy = jasmine.Spy;

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

    const expectedSetEvent = new GndEvent(GndEventType.SET, expectedGndEventValue);
    const noLinkGndSetEvent = new GndEvent(GndEventType.SET, noLinkGndEventValue);
    const otherSetEvent = new GndEvent(GndEventType.SET, otherGndEventValue);
    const expectedRemoveEvent = new GndEvent(GndEventType.REMOVE, null);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GndService],
        });
        // Inject service
        gndService = TestBed.inject(GndService);

        // Default to sessionStorage
        expectedStorage = expectedSessionStorage;
        mockStorage = mockSessionStorage;

        // Replace storage calls with fake mockStorage calls
        spyOn(expectedSessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
        spyOn(expectedSessionStorage, 'setItem').and.callFake(mockSessionStorage.setItem);
        spyOn(expectedSessionStorage, 'removeItem').and.callFake(mockSessionStorage.removeItem);
        spyOn(expectedSessionStorage, 'clear').and.callFake(mockSessionStorage.clear);

        spyOn(expectedLocalStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
        spyOn(expectedLocalStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
        spyOn(expectedLocalStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
        spyOn(expectedLocalStorage, 'clear').and.callFake(mockLocalStorage.clear);

        // Spy on console
        consoleSpy = spyOn(console, 'warn').and.callFake(mockConsole.log);

        // Spies for private service methods
        setGndToSessionStorageSpy = spyOn<any>(gndService, '_setGndToSessionStorage').and.callThrough();
        removeGndFromSessionStorageSpy = spyOn<any>(gndService, '_removeGndFromSessionStorage').and.callThrough();
        exposeGndMessageToParentSpy = spyOn<any>(gndService, '_exposeGndMessageToParent').and.callThrough();
    });

    afterEach(() => {
        // Clear storages and mock objects after each test
        expectedStorage.clear();
        mockStorage.clear();
        mockConsole.clear();
        mockWindow.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(gndService).toBeTruthy();
    });

    describe('mock test objects (self-test)', () => {
        it('... should use mock console', () => {
            console.warn('Test');

            expectToBe(mockConsole.get(0), 'Test');
        });

        it('... should clear mock console after each run', () => {
            expect(mockConsole.get(0)).toBeUndefined();
        });

        it('... should use mock window', () => {
            // Spy on window
            const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

            window.parent.window.postMessage('testMessage', 'testTarget');

            expectSpyCall(postMessageSpy, 1, 'testMessage');
            expectToEqual(mockWindow.get(0), ['testMessage', 'testTarget']);
        });

        it('... should clear mock window after each run', () => {
            expect(mockWindow.get(0)).toBeUndefined();
        });

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
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(undefined);

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('... gndEvent is null', () => {
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(null);

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('... gndEvent has undefined type', () => {
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(new GndEvent(undefined, '123'));

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('... gndEvent has type null', () => {
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(new GndEvent(null, '123'));

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('... gndEvent has GET type', () => {
                const expectedDefaultMessage = 'Got an uncatched GND event';

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(new GndEvent(GndEventType.GET, '123'));

                expectSpyCall(setGndToSessionStorageSpy, 0);
                expectSpyCall(removeGndFromSessionStorageSpy, 0);
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

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
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(setGndToSessionStorageSpy, 1);

                expectToBe(mockStorage.getItem(expectedGndKey), expectedItem);
            });

            it('... should expose gnd if given gndEvent type is `set`', () => {
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
            });

            it('... should expose gnd to parent window if target meets parent location (inseri)', () => {
                // Set current target to Inseri
                const target = AppConfig.INSERI_URL;

                // Spy on current location and return target
                spyOn(gndService.CURRENT_LOCATION, 'getOrigin').and.returnValue(target);
                // Spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
                expectSpyCall(postMessageSpy, 1, [{ gnd: expectedItem }, target]);
                expectToEqual(mockWindow.get(0), [{ gnd: expectedItem }, target]);
            });

            it('... should expose gnd to parent window if target meets parent location (localhost)', () => {
                // Set current target to localhost
                const target = AppConfig.LOCALHOST_URL;

                // Spy on current location and return target
                spyOn(gndService.CURRENT_LOCATION, 'getOrigin').and.returnValue(target);
                // Spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
                expectSpyCall(postMessageSpy, 1, [{ gnd: expectedItem }, target]);
                expectToEqual(mockWindow.get(0), [{ gnd: expectedItem }, target]);
            });

            it('... should not expose gnd to window if target does not meet parent location', () => {
                // Set current target to Inseri
                const target = 'http://www.example.com';

                // Spy on current location and return target
                spyOn(gndService.CURRENT_LOCATION, 'getOrigin').and.returnValue(target);
                // Spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, expectedItem);
                expectSpyCall(postMessageSpy, 0);
                expect(mockWindow.get(0)).toBeUndefined();
            });

            it('... should set an item to the correct storage if given gndEvent value has gnd link', () => {
                const otherMockStorage = mockLocalStorage;

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                expect(otherMockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(expectedSetEvent);

                expectToEqual(mockStorage.getItem(expectedGndKey), expectedItem);
                expect(otherMockStorage.getItem(expectedGndKey)).not.toEqual(expectedItem);
                expect(otherMockStorage.getItem(expectedGndKey)).toBeNull();

                otherMockStorage.clear();
            });

            it('... should overwrite an existing gnd key if gndEvent value has gnd link', () => {
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(expectedSetEvent);
                expectToEqual(mockStorage.getItem(expectedGndKey), expectedItem);

                gndService.exposeGnd(otherSetEvent);
                expect(mockStorage.getItem(expectedGndKey)).not.toEqual(expectedItem);
                expectToEqual(mockStorage.getItem(expectedGndKey), otherItem);
            });

            it('... should return null if value has no gnd link', () => {
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.exposeGnd(noLinkGndSetEvent);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('... should call helper function with input value to check if value has gnd link', () => {
                expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                const valueHasGndSpy = spyOn<any>(gndService, '_valueHasGnd').and.callThrough();
                gndService.exposeGnd(expectedSetEvent);

                expectSpyCall(valueHasGndSpy, 1, expectedGndEventValue);
            });

            describe('#_valueHasGnd()', () => {
                it('... should have a method `_valueHasGnd`', () => {
                    expect((gndService as any)._valueHasGnd).toBeDefined();
                });

                it('... should execute regex check and populate linkRegArr if value has gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                    const valueHasGndSpy = spyOn<any>(gndService, '_valueHasGnd').and.callFake(checkValue => {
                        gndService.linkRegArr = gndService.DNB_REG.exec(checkValue);
                    });
                    gndService.exposeGnd(expectedSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, expectedGndEventValue);

                    expect(expectedGndEventValue).toMatch(expectedDnbReg);
                    expectToEqual(gndService.linkRegArr, expectedDnbReg.exec(expectedGndEventValue));
                });

                it('... should execute regex check and set linkRegArr = null if value has no gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                    const valueHasGndSpy = spyOn<any>(gndService, '_valueHasGnd').and.callThrough();
                    gndService.exposeGnd(noLinkGndSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, noLinkGndEventValue);

                    expect(noLinkGndEventValue).not.toMatch(expectedDnbReg);
                    expect(gndService.linkRegArr).toBeNull();
                });

                it('... should return true (and set item) if value has gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                    const valueHasGndSpy = spyOn<any>(gndService, '_valueHasGnd').and.callThrough();
                    gndService.exposeGnd(expectedSetEvent);

                    expectSpyCall(valueHasGndSpy, 1, expectedGndEventValue);
                    expectToEqual(mockStorage.getItem(expectedGndKey), expectedItem);
                });

                it('... should return false (and set no item) if value has no gnd link', () => {
                    expect(gndService.linkRegArr).toBeUndefined();
                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                    const valueHasGndSpy = spyOn<any>(gndService, '_valueHasGnd').and.callThrough();
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

                expectToEqual(mockStorage.getItem(expectedGndKey), expectedItem);

                gndService.exposeGnd(expectedRemoveEvent);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it('... should expose null value if given gndEvent type is `remove`', () => {
                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, null);
            });

            it('... should expose null value to parent window if target meets parent location (inseri)', () => {
                // Set current target to inseri
                const target = AppConfig.INSERI_URL;

                // Spy on current location and return target
                spyOn(gndService.CURRENT_LOCATION, 'getOrigin').and.returnValue(target);
                // Spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, null);
                expectSpyCall(postMessageSpy, 1, [{ gnd: null }, target]);
                expectToEqual(mockWindow.get(0), [{ gnd: null }, target]);
            });

            it('... should expose null value to parent window if target meets parent location (localhost)', () => {
                // Set current target to localhost
                const target = AppConfig.LOCALHOST_URL;

                // Spy on current location and return target
                spyOn(gndService.CURRENT_LOCATION, 'getOrigin').and.returnValue(target);
                // Spy on postMessage call
                const postMessageSpy = spyOn(window.parent.window, 'postMessage').and.callFake(mockWindow.postMessage);

                gndService.exposeGnd(expectedRemoveEvent);

                expectSpyCall(exposeGndMessageToParentSpy, 1, null);
                expectSpyCall(postMessageSpy, 1, [{ gnd: null }, target]);
                expectToEqual(mockWindow.get(0), [{ gnd: null }, target]);
            });

            it('... should remove an item from the correct storage', () => {
                const expectedOtherStorage = expectedLocalStorage;
                const otherMockStorage = mockLocalStorage;

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                expect(otherMockStorage.getItem(expectedGndKey)).toBeNull();

                expectedStorage.setItem(expectedGndKey, expectedItem);
                expectedOtherStorage.setItem(expectedGndKey, otherItem);

                expectToEqual(mockStorage.getItem(expectedGndKey), expectedItem);
                expectToEqual(otherMockStorage.getItem(expectedGndKey), otherItem);

                gndService.exposeGnd(expectedRemoveEvent);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                expectToEqual(otherMockStorage.getItem(expectedGndKey), otherItem);

                otherMockStorage.clear();
            });

            it('... should remove the correct item from the storage', () => {
                const otherKey = 'otherKey';

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                expect(mockStorage.getItem(otherKey)).toBeNull();

                expectedStorage.setItem(expectedGndKey, expectedItem);
                expectedStorage.setItem(otherKey, expectedItem);

                expectToEqual(mockStorage.getItem(expectedGndKey), expectedItem);
                expectToEqual(mockStorage.getItem(otherKey), expectedItem);

                gndService.exposeGnd(expectedRemoveEvent);

                expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                expectToEqual(mockStorage.getItem(otherKey), expectedItem);
            });

            describe('... should do nothing if:', () => {
                it('- storage has not the gnd key', () => {
                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();

                    gndService.exposeGnd(expectedRemoveEvent);

                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                });

                it('- storage has other key but not the gnd key', () => {
                    const otherKey = 'otherKey';

                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                    expect(mockStorage.getItem(otherKey)).toBeNull();

                    expectedStorage.setItem(otherKey, expectedItem);

                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                    expectToEqual(mockStorage.getItem(otherKey), expectedItem);

                    gndService.exposeGnd(expectedRemoveEvent);

                    expect(mockStorage.getItem(expectedGndKey)).toBeNull();
                    expectToEqual(mockStorage.getItem(otherKey), expectedItem);
                });
            });
        });
    });
});
