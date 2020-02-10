import { TestBed } from '@angular/core/testing';

import { expectSpyCall } from '@testing/expect-helper';

import { StorageType } from '@awg-core/services/storage-service';
import { GndService } from './gnd.service';

describe('GndService', () => {
    let gndService: GndService;

    const sessionType = StorageType.sessionStorage;
    const localType = StorageType.localStorage;

    const expectedGndKey = 'gnd';
    const expectedDnbReg = /href="(https?:\/\/d-nb.info\/gnd\/([\w\-]{8,11}))"/i;

    let expectedMockStorage: Storage;
    const expectedLocalStorage: Storage = window[localType];
    const expectedSessionStorage: Storage = window[sessionType];

    const expectedInputValue = '<a href="http://d-nb.info/gnd/12345678-X">http://d-nb.info/gnd/12345678-X</a>';
    const expectedItem = '12345678-X';
    const otherInputValue = '<a href="http://d-nb.info/gnd/87654321-A">http://d-nb.info/gnd/12345678-X</a>';
    const otherItem = '87654321-A';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GndService]
        });
        // inject service
        gndService = TestBed.get(GndService);

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
        expect(gndService).toBeTruthy();
    });

    it('should have gndKey', () => {
        expect(gndService.gndKey).toBeTruthy();
        expect(gndService.gndKey).toEqual(expectedGndKey);
    });

    it('should have dnbReg', () => {
        expect(gndService.dnbReg).toBeTruthy();
        expect<RegExp>(gndService.dnbReg).toEqual(expectedDnbReg);
    });

    it('should not have linkRegArr before setGndToSessionStorage call', () => {
        expect(gndService.linkRegArr).toBeUndefined();

        gndService.setGndToSessionStorage(expectedInputValue);

        expect(gndService.linkRegArr).toBeDefined();
    });

    describe('#setGndToSessionStorage', () => {
        it('... should set key/value pair to storage if value has gnd link', () => {
            expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

            gndService.setGndToSessionStorage(expectedInputValue);

            expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
        });

        it(`... should set an item to the correct storage if value has gnd link`, () => {
            const otherStorage = expectedLocalStorage;

            expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
            expect(otherStorage.getItem(expectedGndKey)).toBeNull();

            gndService.setGndToSessionStorage(expectedInputValue);

            expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            expect(otherStorage.getItem(expectedGndKey)).not.toEqual(expectedItem, `should not be ${otherItem}`);
            expect(otherStorage.getItem(expectedGndKey)).toBeNull();
        });

        it('... should overwrite an existing gnd key if value has gnd link', () => {
            expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

            gndService.setGndToSessionStorage(expectedInputValue);
            expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);

            gndService.setGndToSessionStorage(otherInputValue);
            expect(expectedMockStorage.getItem(expectedGndKey)).not.toEqual(
                expectedItem,
                `should not be ${expectedItem}`
            );
            expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(otherItem, `should be ${otherItem}`);
        });

        it('... should return null if value has no gnd link', () => {
            expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

            gndService.setGndToSessionStorage(expectedItem);

            expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
        });

        it('... should call helper function with input value to check if value has gnd link', () => {
            expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

            const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
            gndService.setGndToSessionStorage(expectedInputValue);

            expectSpyCall(valueHasGndSpy, 1, expectedInputValue);
        });

        describe('#valueHasGnd', () => {
            it('... should execute regex check and populate linkRegArr if value has gnd link', () => {
                expect(gndService.linkRegArr).toBeUndefined();
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callFake(checkValue => {
                    gndService.linkRegArr = gndService.dnbReg.exec(checkValue);
                });
                gndService.setGndToSessionStorage(expectedInputValue);

                expectSpyCall(valueHasGndSpy, 1, expectedInputValue);

                expect(expectedInputValue).toMatch(expectedDnbReg);
                expect(gndService.linkRegArr).toBeDefined();
                expect(gndService.linkRegArr).toEqual(expectedDnbReg.exec(expectedInputValue));
            });

            it('... should execute regex check and set linkRegArr = null if value has no gnd link', () => {
                expect(gndService.linkRegArr).toBeUndefined();
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
                gndService.setGndToSessionStorage(otherItem);

                expectSpyCall(valueHasGndSpy, 1, otherItem);

                expect(otherItem).not.toMatch(expectedDnbReg);
                expect(gndService.linkRegArr).toBeNull();
            });

            it('... should return true if value has gnd link', () => {
                expect(gndService.linkRegArr).toBeUndefined();
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
                gndService.setGndToSessionStorage(expectedInputValue);

                expectSpyCall(valueHasGndSpy, 1, expectedInputValue);
                expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });

            it('... should return false if value has no gnd link', () => {
                expect(gndService.linkRegArr).toBeUndefined();
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                const valueHasGndSpy = spyOn<any>(gndService, 'valueHasGnd').and.callThrough();
                gndService.setGndToSessionStorage(otherItem);

                expectSpyCall(valueHasGndSpy, 1, otherItem);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
            });
        });
    });

    describe('removeGndFromSessionStorage', () => {
        it(`... should remove an item by key from the storage`, () => {
            expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
            expectedMockStorage.setItem(expectedGndKey, expectedItem);

            expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);

            gndService.removeGndFromSessionStorage();

            expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
        });

        it(`... should remove an item from the correct storage`, () => {
            const otherStorage = expectedLocalStorage;

            expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
            expect(otherStorage.getItem(expectedGndKey)).toBeNull();

            expectedMockStorage.setItem(expectedGndKey, expectedItem);
            otherStorage.setItem(expectedGndKey, otherItem);

            expect(expectedMockStorage.getItem(expectedGndKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            expect(otherStorage.getItem(expectedGndKey)).toEqual(otherItem, `should be ${otherItem}`);

            gndService.removeGndFromSessionStorage();

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

            gndService.removeGndFromSessionStorage();

            expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
            expect(expectedMockStorage.getItem(otherKey)).toEqual(expectedItem, `should be ${expectedItem}`);
        });

        describe(`... should do nothing if:`, () => {
            it('- storage has not the gnd key', () => {
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();

                gndService.removeGndFromSessionStorage();

                expect(gndService.removeGndFromSessionStorage()).toBeUndefined();
                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
            });

            it(`- storage has other key but not the gnd key`, () => {
                const otherKey = 'otherKey';

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                expect(expectedMockStorage.getItem(otherKey)).toBeNull();

                expectedMockStorage.setItem(otherKey, expectedItem);

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                expect(expectedMockStorage.getItem(otherKey)).toEqual(expectedItem, `should be ${expectedItem}`);

                gndService.removeGndFromSessionStorage();

                expect(expectedMockStorage.getItem(expectedGndKey)).toBeNull();
                expect(expectedMockStorage.getItem(otherKey)).toEqual(expectedItem, `should be ${expectedItem}`);
            });
        });
    });
});
