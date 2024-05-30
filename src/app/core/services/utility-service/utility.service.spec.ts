import { TestBed } from '@angular/core/testing';

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
            expect(utils.isNotEmptyArray(checkArray)).toBeTrue();
        });

        it('... should return false if a given array is empty', () => {
            const checkArray = [];
            expect(utils.isNotEmptyArray(checkArray)).toBeFalse();
        });

        it('... should return false if a given array is null', () => {
            const checkArray = null;
            expect(utils.isNotEmptyArray(checkArray)).toBeFalse();
        });

        it('... should return false if a given array is undefined', () => {
            const checkArray = undefined;
            expect(utils.isNotEmptyArray(checkArray)).toBeFalse();
        });
    });

    describe('#isNotEmptyObject()', () => {
        it('... should have a method `isNotEmptyObject`', () => {
            expect(utils.isNotEmptyObject).toBeDefined();
        });

        it('... should return true if a given object is not empty', () => {
            const checkObj = { a: 1 };
            expect(utils.isNotEmptyObject(checkObj)).toBeTrue();
        });

        it('... should return false if a given object is empty', () => {
            const checkObj = {};
            expect(utils.isNotEmptyObject(checkObj)).toBeFalse();
        });

        it('... should return false if a given object is an Array', () => {
            const checkObj = [1, 2, 3];
            expect(utils.isNotEmptyObject(checkObj)).toBeFalse();
        });

        it('... should return false if a given object is an empty Array', () => {
            const checkObj = [];
            expect(utils.isNotEmptyObject(checkObj)).toBeFalse();
        });

        it('... should return false if a given object is undefined', () => {
            const checkObj = undefined;
            expect(utils.isNotEmptyObject(checkObj)).toBeFalse();
        });

        it('... should return false if a given object is null', () => {
            const checkObj = null;
            expect(utils.isNotEmptyObject(checkObj)).toBeFalse();
        });
    });

    describe('#isSketchId()', () => {
        it('... should have a method `isSketchId`', () => {
            expect(utils.isSketchId).toBeDefined();
        });

        describe('... should return false if', () => {
            it('... id is undefined', () => {
                const result = utils.isSketchId(undefined);

                expect(result).toBeFalse();
            });

            it('... id is null', () => {
                const result = utils.isSketchId(null);

                expect(result).toBeFalse();
            });

            it('... id does not include `_Sk`', () => {
                const id = 'test-1';

                const result = utils.isSketchId(id);

                expect(result).toBeFalse();
            });
        });

        it('... should return true if id includes `_Sk`', () => {
            const id = 'test-1_Sk1';

            const result = utils.isSketchId(id);

            expect(result).toBeTrue();
        });

        it('... should return true if id includes `SkRT`', () => {
            const id = 'SkRT';

            const result = utils.isSketchId(id);

            expect(result).toBeTrue();
        });
    });
});
