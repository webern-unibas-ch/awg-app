import { describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { isSketchId, isWorkEditionId } from './edition-utils';

describe('EditionUtils', () => {
    describe('METHODS', () => {
        describe('#isSketchId()', () => {
            it('... should have a method `isSketchId`', () => {
                expect(isSketchId).toBeDefined();
            });

            describe('... should return false if the ID ...', () => {
                it.each([
                    { id: undefined, label: 'undefined' },
                    { id: null, label: 'null' },
                    { id: '', label: 'empty string' },
                    { id: 'op12_WE', label: 'a regular work edition ID' },
                    { id: 'op12_TF1', label: 'a regular text edition ID' },
                ])('... is $label', ({ id }) => {
                    expectToBe(isSketchId(id), false);
                });

                it.each([
                    { id: 'id_sk_lowercase', label: 'sketch identifier in lowercase (_sk)' },
                    { id: 'id_sK_wrongcase', label: 'sketch identifier in wrong mixed case (_sK)' },
                    { id: 'id_skrt_lowercase', label: 'sketch identifier in lowercase (skrt)' },
                    { id: 'idSk', label: 'sketch identifier without underscore (Sk)' },
                    { id: 'id_SKRT_uppercase', label: 'SkRT identifier in uppercase (SKRT)' },
                    { id: 'id_sKrt_mixedcase', label: 'SkRT identifier in wrong mixed case (sKrt)' },
                    { id: 'test-1', label: 'no `_Sk` or `SkRT` at all' },
                ])('... includes $label', ({ id }) => {
                    expectToBe(isSketchId(id), false);
                });
            });

            describe('... should return true if the ID ...', () => {
                it.each([
                    { id: 'test-1_Sk1', label: '`_Sk`' },
                    { id: 'SkRT', label: '`SkRT`' },
                ])('... includes $label', ({ id }) => {
                    expectToBe(isSketchId(id), true);
                });
            });
        });

        describe('#isWorkEditionId()', () => {
            it('... should have a method `isWorkEditionId`', () => {
                expect(isWorkEditionId).toBeDefined();
            });

            describe('... should return false if the ID', () => {
                it.each([
                    { id: undefined, label: 'undefined' },
                    { id: null, label: 'null' },
                    { id: '', label: 'empty string' },
                    { id: 'op12_Sk1', label: 'a regular sketch edition ID' },
                    { id: 'op12_TF1', label: 'a regular text edition ID' },
                ])('... is $label', ({ id }) => {
                    expectToBe(isWorkEditionId(id), false);
                });

                it.each([
                    { id: 'op12_we_lowercase', label: 'work edition identifier in lowercase (_we)' },
                    { id: 'op12_wE_wrongcase', label: 'work edition identifier in wrong mixed case (_wE)' },
                    { id: 'op12_We_otherwrongcase', label: 'work edition identifier in other wrong mixed case (_We)' },
                    { id: 'op12WE', label: 'work edition identifier without underscore (WE)' },
                    { id: 'test-1', label: 'no `_WE` at all' },
                ])('... includes $label', ({ id }) => {
                    expectToBe(isWorkEditionId(id), false);
                });
            });

            it('... should return true if the ID includes `_WE`', () => {
                expectToBe(isWorkEditionId('op12_WE'), true);
            });
        });
    });
});
