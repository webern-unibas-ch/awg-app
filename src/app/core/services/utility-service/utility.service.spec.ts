import { TestBed } from '@angular/core/testing';

import { expectToBe } from '@testing/expect-helper';

import { UtilityService } from './utility.service';

describe('UtilityService (DONE)', () => {
    let utils: UtilityService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UtilityService],
        });
        // Inject service
        utils = TestBed.inject(UtilityService);
    });

    it('... should create', () => {
        expect(utils).toBeTruthy();
    });

    describe('#isNotEmptyArray()', () => {
        it('... should have a method `isNotEmptyArray`', () => {
            expect(utils.isNotEmptyArray).toBeDefined();
        });

        it('... should return true if a given array is not empty', () => {
            const checkArray = [1];
            expectToBe(utils.isNotEmptyArray(checkArray), true);
        });

        it('... should return false if a given array is empty', () => {
            const checkArray = [];
            expectToBe(utils.isNotEmptyArray(checkArray), false);
        });

        it('... should return false if a given array is null', () => {
            const checkArray = null;
            expectToBe(utils.isNotEmptyArray(checkArray), false);
        });

        it('... should return false if a given array is undefined', () => {
            const checkArray = undefined;
            expectToBe(utils.isNotEmptyArray(checkArray), false);
        });
    });

    describe('#isNotEmptyObject()', () => {
        it('... should have a method `isNotEmptyObject`', () => {
            expect(utils.isNotEmptyObject).toBeDefined();
        });

        it('... should return true if a given object is not empty', () => {
            const checkObj = { a: 1 };
            expectToBe(utils.isNotEmptyObject(checkObj), true);
        });

        it('... should return false if a given object is empty', () => {
            const checkObj = {};
            expectToBe(utils.isNotEmptyObject(checkObj), false);
        });

        it('... should return false if a given object is an Array', () => {
            const checkObj = [1, 2, 3];
            expectToBe(utils.isNotEmptyObject(checkObj), false);
        });

        it('... should return false if a given object is an empty Array', () => {
            const checkObj = [];
            expectToBe(utils.isNotEmptyObject(checkObj), false);
        });

        it('... should return false if a given object is undefined', () => {
            const checkObj = undefined;
            expectToBe(utils.isNotEmptyObject(checkObj), false);
        });

        it('... should return false if a given object is null', () => {
            const checkObj = null;
            expectToBe(utils.isNotEmptyObject(checkObj), false);
        });
    });

    describe('#isSketchId()', () => {
        it('... should have a method `isSketchId`', () => {
            expect(utils.isSketchId).toBeDefined();
        });

        describe('... should return false if', () => {
            it('... id is undefined', () => {
                const result = utils.isSketchId(undefined);

                expectToBe(result, false);
            });

            it('... id is null', () => {
                const result = utils.isSketchId(null);

                expectToBe(result, false);
            });

            it('... id does not include `_Sk`', () => {
                const id = 'test-1';

                const result = utils.isSketchId(id);

                expectToBe(result, false);
            });
        });

        it('... should return true if id includes `_Sk`', () => {
            const id = 'test-1_Sk1';

            const result = utils.isSketchId(id);

            expectToBe(result, true);
        });

        it('... should return true if id includes `SkRT`', () => {
            const id = 'SkRT';

            const result = utils.isSketchId(id);

            expectToBe(result, true);
        });
    });
});
