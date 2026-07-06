import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { UtilityService } from './utility.service';

describe('UtilityService (DONE)', () => {
    let utils: UtilityService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UtilityService],
        });

        // Inject services
        utils = TestBed.inject(UtilityService);
    });

    it('... should create', () => {
        expect(utils).toBeTruthy();
    });

    describe('METHODS', () => {
        describe('#isEmptyArray()', () => {
            it('... should have a method `isEmptyArray`', () => {
                expect(utils.isEmptyArray).toBeDefined();
            });

            describe('... should return true if the array', () => {
                it('... is undefined', () => {
                    expectToBe(utils.isEmptyArray(undefined), true);
                });

                it('... is null', () => {
                    expectToBe(utils.isEmptyArray(null), true);
                });

                it('... is empty', () => {
                    expectToBe(utils.isEmptyArray([]), true);
                });
            });

            describe('... should return false if the array', () => {
                it('... contains elements', () => {
                    expectToBe(utils.isEmptyArray(['test']), false);
                    expectToBe(utils.isEmptyArray([1, 2, 3]), false);
                });

                it('... contains an empty object or null as an element', () => {
                    expectToBe(utils.isEmptyArray([{}]), false);
                    expectToBe(utils.isEmptyArray([null]), false);
                });
            });
        });

        describe('#isEmptyObject()', () => {
            it('... should have a method `isEmptyObject`', () => {
                expect(utils.isEmptyObject).toBeDefined();
            });

            describe('... should return true if the object', () => {
                it('... is undefined', () => {
                    expectToBe(utils.isEmptyObject(undefined), true);
                });

                it('... is null', () => {
                    expectToBe(utils.isEmptyObject(null), true);
                });

                it('... is empty', () => {
                    expectToBe(utils.isEmptyObject({}), true);
                });

                it('... is not an object (primitive types)', () => {
                    expectToBe(utils.isEmptyObject('string'), true);
                    expectToBe(utils.isEmptyObject(42), true);
                    expectToBe(utils.isEmptyObject(true), true);
                });

                it('... is an array (arrays should be treated as empty/invalid objects)', () => {
                    expectToBe(utils.isEmptyObject([]), true);
                    expectToBe(utils.isEmptyObject(['test']), true);
                });
            });

            describe('... should return false if the object', () => {
                it('... contains properties', () => {
                    expectToBe(utils.isEmptyObject({ id: 1 }), false);
                    expectToBe(utils.isEmptyObject({ name: '' }), false); // Auch leere Strings sind gültige Keys!
                });

                it('... contains a nested empty object', () => {
                    expectToBe(utils.isEmptyObject({ nested: {} }), false);
                });
            });
        });

        describe('#isSketchId()', () => {
            it('... should have a method `isSketchId`', () => {
                expect(utils.isSketchId).toBeDefined();
            });

            describe('... should return false if the ID ...', () => {
                it('... is undefined', () => {
                    const result = utils.isSketchId(undefined);

                    expectToBe(result, false);
                });

                it('... is null', () => {
                    const result = utils.isSketchId(null);

                    expectToBe(result, false);
                });

                it('... is an empty string', () => {
                    const result = utils.isSketchId('');

                    expectToBe(result, false);
                });

                it('... does include sketch identifier in wrong case', () => {
                    expectToBe(utils.isSketchId('id_sk_lowercase'), false);
                    expectToBe(utils.isSketchId('id_sK_wrongcase'), false);

                    expectToBe(utils.isSketchId('id_skrt_lowercase'), false);
                    expectToBe(utils.isSketchId('id_SKRT_uppercase'), false);
                    expectToBe(utils.isSketchId('id_sKrt_mixedcase'), false);
                });

                it('... does not include `_Sk`', () => {
                    const id = 'test-1';

                    const result = utils.isSketchId(id);

                    expectToBe(result, false);
                });
            });

            describe('... should return true if the ID ...', () => {
                it('... includes `_Sk`', () => {
                    const id = 'test-1_Sk1';

                    const result = utils.isSketchId(id);

                    expectToBe(result, true);
                });

                it('... includes `SkRT`', () => {
                    const id = 'SkRT';

                    const result = utils.isSketchId(id);

                    expectToBe(result, true);
                });
            });
        });
    });
});
