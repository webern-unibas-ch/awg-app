import { describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { isSketchId, isWorkEditionId } from './edition-utils';

describe('EditionUtils', () => {
    describe('METHODS', () => {
        describe('#isSketchId()', () => {
            it('... should have a method `isSketchId`', () => {
                expect(isSketchId).toBeDefined();
            });

            describe.each([
                {
                    expectedResult: false,
                    cases: [
                        { desc: 'is undefined', id: undefined },
                        { desc: 'is null', id: null },
                        { desc: 'is empty string', id: '' },
                        { desc: 'is a regular work edition ID', id: 'op12_WE' },
                        { desc: 'is a regular text edition ID', id: 'op12_TF1' },
                        { desc: 'includes sketch identifier in lowercase (_sk)', id: 'id_sk_lowercase' },
                        { desc: 'includes sketch identifier in wrong mixed case (_sK)', id: 'id_sK_wrongcase' },
                        { desc: 'includes sketch identifier in lowercase (skrt)', id: 'id_skrt_lowercase' },
                        { desc: 'includes sketch identifier without underscore (Sk)', id: 'idSk' },
                        { desc: 'includes SkRT identifier in uppercase (SKRT)', id: 'id_SKRT_uppercase' },
                        { desc: 'includes SkRT identifier in wrong mixed case (sKrt)', id: 'id_sKrt_mixedcase' },
                        { desc: 'includes no `_Sk` or `SkRT` at all', id: 'test-1' },
                    ],
                },
                {
                    expectedResult: true,
                    cases: [
                        { desc: 'includes `_Sk`', id: 'test-1_Sk1' },
                        { desc: 'includes `SkRT`', id: 'SkRT' },
                    ],
                },
            ])('... should return $expectedResult if ID', ({ expectedResult, cases }) => {
                it.each(cases)('... $desc', ({ id }) => {
                    expectToBe(isSketchId(id), expectedResult);
                });
            });
        });

        describe('#isWorkEditionId()', () => {
            it('... should have a method `isWorkEditionId`', () => {
                expect(isWorkEditionId).toBeDefined();
            });

            describe.each([
                {
                    expectedResult: false,
                    cases: [
                        { desc: 'is undefined', id: undefined },
                        { desc: 'is null', id: null },
                        { desc: 'is empty string', id: '' },
                        { desc: 'is a regular sketch edition ID', id: 'op12_Sk1' },
                        { desc: 'is a regular text edition ID', id: 'op12_TF1' },

                        { desc: 'includes work edition identifier in lowercase (_we)', id: 'op12_we_lowercase' },
                        { desc: 'includes work edition identifier in wrong mixed case (_wE)', id: 'op12_wE_wrongcase' },
                        {
                            desc: 'includes work edition identifier in other wrong mixed case (_We)',
                            id: 'op12_We_otherwrongcase',
                        },
                        { desc: 'includes work edition identifier without underscore (WE)', id: 'op12WE' },
                        { desc: 'includes no `_WE` at all', id: 'test-1' },
                    ],
                },
                {
                    expectedResult: true,
                    cases: [{ desc: 'includes `_WE`', id: 'op12_WE' }],
                },
            ])('... should return $expectedResult if ID', ({ expectedResult, cases }) => {
                it.each(cases)('... $desc', ({ id }) => {
                    expectToBe(isWorkEditionId(id), expectedResult);
                });
            });
        });
    });
});
