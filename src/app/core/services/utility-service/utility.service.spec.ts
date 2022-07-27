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

    it('should be created', () => {
        expect(utils).toBeTruthy();
    });

    describe('#isNotEmptyArray', () => {
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

    describe('#isNotEmptyObject', () => {
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
});
