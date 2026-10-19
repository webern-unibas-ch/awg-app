import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { TableRows } from './table.model';
import {
    compareTableValues,
    filterTableRows,
    isMissingTableValue,
    paginateTableRows,
    sortTableRows,
    TABLE_DEFAULT_PAGE_SIZE,
    TABLE_PAGE_SIZE_OPTIONS,
} from './table.utils';

/**
 * Helper function: createRow.
 *
 * It creates a table row with the given labels for column1 and column2.
 *
 * @param {unknown} label1 The label of column1.
 * @param {unknown} label2 The label of column2.
 * @returns {TableRows} The created row.
 */
const createRow = (label1: unknown, label2: unknown = 'x'): TableRows => ({
    column1: { value: `value-${String(label1)}`, label: label1, type: 'literal' },
    column2: { value: `value-${String(label2)}`, label: label2, type: 'literal' },
});

describe('TableUtils (DONE)', () => {
    describe('constants', () => {
        it('... should have the expected page size options', () => {
            expectToEqual(TABLE_PAGE_SIZE_OPTIONS, [5, 10, 25, 50, 100, 200]);
        });

        it('... should have a default page size of 10', () => {
            expectToBe(TABLE_DEFAULT_PAGE_SIZE, 10);
        });
    });

    describe('METHODS', () => {
        describe('#filterTableRows()', () => {
            const rows = [createRow('Apple', 'Red'), createRow('Banana', 'Yellow'), createRow('Cherry', 'Red')];

            it('... should have a method `filterTableRows`', () => {
                expect(filterTableRows).toBeDefined();
            });

            it('... should keep all rows for an empty term', () => {
                const filteredTableRows = filterTableRows(rows, '');

                expectToEqual(filteredTableRows, rows);
            });

            it('... should keep rows with a matching label in any column', () => {
                const filteredTableRows = filterTableRows(rows, 'red');

                expectToEqual(filteredTableRows, [rows[0], rows[2]]);
            });

            it('... should match case-insensitively', () => {
                const filteredTableRows = filterTableRows(rows, 'BANANA');

                expectToEqual(filteredTableRows, [rows[1]]);
            });

            it('... should match number labels', () => {
                const numberRows = [createRow(42), createRow(7)];

                const filteredTableRows = filterTableRows(numberRows, '4');

                expectToEqual(filteredTableRows, [numberRows[0]]);
            });

            it('... should ignore null and undefined entries', () => {
                const sparseRows: TableRows[] = [{ column1: null, column2: undefined }, createRow('Apple')];

                const filteredTableRows = filterTableRows(sparseRows, 'apple');

                expectToEqual(filteredTableRows, [sparseRows[1]]);
            });

            it('... should keep no rows if nothing matches', () => {
                const filteredTableRows = filterTableRows(rows, 'kiwi');

                expectToEqual(filteredTableRows, []);
            });
        });

        describe('#isMissingTableValue()', () => {
            it('... should have a method `isMissingTableValue`', () => {
                expect(isMissingTableValue).toBeDefined();
            });

            describe('... should be true for null, undefined and NaN', () => {
                it.each([
                    { desc: 'null', value: null },
                    { desc: 'undefined', value: undefined },
                    { desc: 'Number.NaN', value: Number.NaN },
                ])('... $desc', ({ value }) => {
                    const isMissing = isMissingTableValue(value);

                    expectToBe(isMissing, true);
                });
            });

            describe('... should be false for strings and numbers (also empty and 0)', () => {
                it.each([
                    { desc: 'a', value: 'a' },
                    { desc: '', value: '' },
                    { desc: '1', value: 1 },
                    { desc: '0', value: 0 },
                ])('... $desc', ({ value }) => {
                    const isMissing = isMissingTableValue(value);

                    expectToBe(isMissing, false);
                });
            });
        });

        describe('#compareTableValues()', () => {
            it('... should have a method `compareTableValues`', () => {
                expect(compareTableValues).toBeDefined();
            });

            describe('... should be 0 for equal values', () => {
                it.each([
                    { desc: "'a', 'a'", a: 'a', b: 'a' },
                    { desc: '1, 1', a: 1, b: 1 },
                    { desc: 'null, undefined', a: null, b: undefined },
                ])('... $desc', ({ a, b }) => {
                    const comparison = compareTableValues(a, b);

                    expectToBe(comparison, 0);
                });
            });

            describe('... should order strings alphabetically', () => {
                it.each([
                    { desc: "'a', 'b'", a: 'a', b: 'b', expected: -1 },
                    { desc: "'b', 'a'", a: 'b', b: 'a', expected: 1 },
                ])('... $desc', ({ a, b, expected }) => {
                    const comparison = compareTableValues(a, b);

                    expectToBe(comparison, expected);
                });
            });

            describe('... should order strings case-insensitively', () => {
                it.each([
                    { desc: "'B', 'a'", a: 'B', b: 'a', expected: 1 },
                    { desc: "'a', 'B'", a: 'a', b: 'B', expected: -1 },
                    { desc: "'awg:Sketch', 'awg:concomitates'", a: 'awg:Sketch', b: 'awg:concomitates', expected: 1 },
                    { desc: "'A', 'a'", a: 'A', b: 'a', expected: 0 },
                ])('... $desc', ({ a, b, expected }) => {
                    const comparison = compareTableValues(a, b);

                    expectToBe(comparison, expected);
                });
            });

            describe('... should order numbers in strings naturally', () => {
                it.each([
                    {
                        desc: "'awg:PT_SB4_2r_1', 'awg:PT_SB4_11r_9'",
                        a: 'awg:PT_SB4_2r_1',
                        b: 'awg:PT_SB4_11r_9',
                        expected: -1,
                    },
                    { desc: "'m10', 'm2'", a: 'm10', b: 'm2', expected: 1 },
                ])('... $desc', ({ a, b, expected }) => {
                    const comparison = compareTableValues(a, b);

                    expectToBe(comparison, expected);
                });
            });

            describe('... should order numbers numerically', () => {
                it.each([
                    { desc: '2, 10', a: 2, b: 10, expected: -1 },
                    { desc: '10, 2', a: 10, b: 2, expected: 1 },
                    { desc: '-1, 0', a: -1, b: 0, expected: -1 },
                ])('... $desc', ({ a, b, expected }) => {
                    const comparison = compareTableValues(a, b);

                    expectToBe(comparison, expected);
                });
            });

            describe('... should order numbers before strings', () => {
                it.each([
                    { desc: "10, 'a'", a: 10, b: 'a', expected: -1 },
                    { desc: "'1', 2", a: '1', b: 2, expected: 1 },
                ])('... $desc', ({ a, b, expected }) => {
                    const comparison = compareTableValues(a, b);

                    expectToBe(comparison, expected);
                });
            });

            describe('... should order null, undefined and NaN at the end', () => {
                it.each([
                    { desc: "null, 'a'", a: null, b: 'a', expected: 1 },
                    { desc: "undefined, 'a'", a: undefined, b: 'a', expected: 1 },
                    { desc: 'Number.NaN, 1', a: Number.NaN, b: 1, expected: 1 },
                    { desc: "'a', null", a: 'a', b: null, expected: -1 },
                    { desc: '1, Number.NaN', a: 1, b: Number.NaN, expected: -1 },
                ])('... $desc', ({ a, b, expected }) => {
                    const comparison = compareTableValues(a, b);

                    expectToBe(comparison, expected);
                });
            });
        });

        describe('#sortTableRows()', () => {
            const rows = [createRow('b', '2'), createRow('c', '1'), createRow(null, '3'), createRow('a', '4')];

            it('... should have a method `sortTableRows`', () => {
                expect(sortTableRows).toBeDefined();
            });

            describe('... should sort by the label of the given key', () => {
                it.each([
                    { desc: 'column1', key: 'column1', expected: [rows[3], rows[0], rows[1], rows[2]] },
                    { desc: 'column2', key: 'column2', expected: [rows[1], rows[0], rows[2], rows[3]] },
                ])('... $desc', ({ key, expected }) => {
                    const sortedTableRows = sortTableRows(rows, key, false);

                    expectToEqual(sortedTableRows, expected);
                });
            });

            it('... should sort in reverse order with missing values still at the end', () => {
                const sortedTableRows = sortTableRows(rows, 'column1', true);

                expectToEqual(sortedTableRows, [rows[1], rows[0], rows[3], rows[2]]);
            });

            it('... should sort mixed-case labels with numbers naturally', () => {
                const labelRows = [
                    createRow('awg:precedes', '1'),
                    createRow('awg:PT_SB4_11r_9', '2'),
                    createRow('awg:Sketch', '3'),
                    createRow('awg:PT_SB4_2r_1', '4'),
                    createRow('awg:concomitates', '5'),
                ];

                const sortedTableRows = sortTableRows(labelRows, 'column1', false);

                expectToEqual(sortedTableRows, [labelRows[4], labelRows[0], labelRows[3], labelRows[1], labelRows[2]]);
            });

            it('... should keep the input order of equal values in both directions', () => {
                const equalRows = [createRow('a', '1'), createRow('b', '2'), createRow('a', '3'), createRow('A', '4')];

                const ascendingRows = sortTableRows(equalRows, 'column1', false);
                const descendingRows = sortTableRows(equalRows, 'column1', true);

                expectToEqual(ascendingRows, [equalRows[0], equalRows[2], equalRows[3], equalRows[1]]);
                expectToEqual(descendingRows, [equalRows[1], equalRows[0], equalRows[2], equalRows[3]]);
            });

            it('... should keep the order if no key is given', () => {
                const sortedTableRows = sortTableRows(rows, '', false);

                expectToEqual(sortedTableRows, rows);
            });

            it('... should not mutate the given rows', () => {
                const rowsCopy = [...rows];

                sortTableRows(rows, 'column1', true);

                expectToEqual(rows, rowsCopy);
            });
        });

        describe('#paginateTableRows()', () => {
            const rows = Array.from({ length: 23 }, (_, i) => createRow(i));

            it('... should have a method `paginateTableRows`', () => {
                expect(paginateTableRows).toBeDefined();
            });

            describe('... should return', () => {
                it.each([
                    { desc: 'the rows of the first page', page: 1, expected: rows.slice(0, 10) },
                    { desc: 'the rows of a middle page', page: 2, expected: rows.slice(10, 20) },
                    { desc: 'the remaining rows of the last page', page: 3, expected: rows.slice(20, 23) },
                    { desc: 'no rows for a page out of range', page: 4, expected: [] },
                ])('... $desc', ({ page, expected }) => {
                    const paginatedTableRows = paginateTableRows(rows, page, 10);

                    expectToEqual(paginatedTableRows, expected);
                });
            });
        });
    });
});
