import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { TableRows } from './models/table-rows.model';
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
    column1: { value: `value-${label1}`, label: label1, type: 'literal' },
    column2: { value: `value-${label2}`, label: label2, type: 'literal' },
});

describe('table.utils', () => {
    describe('constants', () => {
        it('... should have the expected page size options', () => {
            expectToEqual(TABLE_PAGE_SIZE_OPTIONS, [5, 10, 25, 50, 100, 200]);
        });

        it('... should have a default page size of 10', () => {
            expectToBe(TABLE_DEFAULT_PAGE_SIZE, 10);
        });
    });

    describe('#filterTableRows()', () => {
        const rows = [createRow('Apple', 'Red'), createRow('Banana', 'Yellow'), createRow('Cherry', 'Red')];

        it('... should have a method `filterTableRows`', () => {
            expect(filterTableRows).toBeDefined();
        });

        it('... should keep all rows for an empty term', () => {
            expectToEqual(filterTableRows(rows, ''), rows);
        });

        it('... should keep rows with a matching label in any column', () => {
            expectToEqual(filterTableRows(rows, 'red'), [rows[0], rows[2]]);
        });

        it('... should match case-insensitively', () => {
            expectToEqual(filterTableRows(rows, 'BANANA'), [rows[1]]);
        });

        it('... should match number labels', () => {
            const numberRows = [createRow(42), createRow(7)];

            expectToEqual(filterTableRows(numberRows, '4'), [numberRows[0]]);
        });

        it('... should ignore null and undefined entries', () => {
            const sparseRows: TableRows[] = [{ column1: null, column2: undefined }, createRow('Apple')];

            expectToEqual(filterTableRows(sparseRows, 'apple'), [sparseRows[1]]);
        });

        it('... should keep no rows if nothing matches', () => {
            expectToEqual(filterTableRows(rows, 'kiwi'), []);
        });
    });

    describe('#isMissingTableValue()', () => {
        it('... should have a method `isMissingTableValue`', () => {
            expect(isMissingTableValue).toBeDefined();
        });

        it('... should be true for null, undefined and NaN', () => {
            expectToBe(isMissingTableValue(null), true);
            expectToBe(isMissingTableValue(undefined), true);
            expectToBe(isMissingTableValue(Number.NaN), true);
        });

        it('... should be false for strings and numbers (also empty and 0)', () => {
            expectToBe(isMissingTableValue('a'), false);
            expectToBe(isMissingTableValue(''), false);
            expectToBe(isMissingTableValue(1), false);
            expectToBe(isMissingTableValue(0), false);
        });
    });

    describe('#compareTableValues()', () => {
        it('... should have a method `compareTableValues`', () => {
            expect(compareTableValues).toBeDefined();
        });

        it('... should be 0 for equal values', () => {
            expectToBe(compareTableValues('a', 'a'), 0);
            expectToBe(compareTableValues(1, 1), 0);
            expectToBe(compareTableValues(null, undefined), 0);
        });

        it('... should order strings alphabetically', () => {
            expectToBe(compareTableValues('a', 'b'), -1);
            expectToBe(compareTableValues('b', 'a'), 1);
        });

        it('... should order strings case-insensitively', () => {
            expectToBe(compareTableValues('B', 'a'), 1);
            expectToBe(compareTableValues('a', 'B'), -1);
            expectToBe(compareTableValues('awg:Sketch', 'awg:concomitates'), 1);
            expectToBe(compareTableValues('A', 'a'), 0);
        });

        it('... should order numbers in strings naturally', () => {
            expectToBe(compareTableValues('awg:PT_SB4_2r_1', 'awg:PT_SB4_11r_9'), -1);
            expectToBe(compareTableValues('m10', 'm2'), 1);
        });

        it('... should order numbers numerically', () => {
            expectToBe(compareTableValues(2, 10), -1);
            expectToBe(compareTableValues(10, 2), 1);
            expectToBe(compareTableValues(-1, 0), -1);
        });

        it('... should order numbers before strings', () => {
            expectToBe(compareTableValues(10, 'a'), -1);
            expectToBe(compareTableValues('1', 2), 1);
        });

        it('... should order null, undefined and NaN at the end', () => {
            expectToBe(compareTableValues(null, 'a'), 1);
            expectToBe(compareTableValues(undefined, 'a'), 1);
            expectToBe(compareTableValues(Number.NaN, 1), 1);
            expectToBe(compareTableValues('a', null), -1);
            expectToBe(compareTableValues(1, Number.NaN), -1);
        });
    });

    describe('#sortTableRows()', () => {
        const rows = [createRow('b', '2'), createRow('c', '1'), createRow(null, '3'), createRow('a', '4')];

        it('... should have a method `sortTableRows`', () => {
            expect(sortTableRows).toBeDefined();
        });

        it('... should sort by the label of the given key', () => {
            expectToEqual(sortTableRows(rows, 'column1', false), [rows[3], rows[0], rows[1], rows[2]]);
            expectToEqual(sortTableRows(rows, 'column2', false), [rows[1], rows[0], rows[2], rows[3]]);
        });

        it('... should sort in reverse order with missing values still at the end', () => {
            expectToEqual(sortTableRows(rows, 'column1', true), [rows[1], rows[0], rows[3], rows[2]]);
        });

        it('... should sort mixed-case labels with numbers naturally', () => {
            const labelRows = [
                createRow('awg:precedes', '1'),
                createRow('awg:PT_SB4_11r_9', '2'),
                createRow('awg:Sketch', '3'),
                createRow('awg:PT_SB4_2r_1', '4'),
                createRow('awg:concomitates', '5'),
            ];

            expectToEqual(sortTableRows(labelRows, 'column1', false), [
                labelRows[4],
                labelRows[0],
                labelRows[3],
                labelRows[1],
                labelRows[2],
            ]);
        });

        it('... should keep the input order of equal values in both directions', () => {
            const equalRows = [createRow('a', '1'), createRow('b', '2'), createRow('a', '3'), createRow('A', '4')];

            expectToEqual(sortTableRows(equalRows, 'column1', false), [
                equalRows[0],
                equalRows[2],
                equalRows[3],
                equalRows[1],
            ]);
            expectToEqual(sortTableRows(equalRows, 'column1', true), [
                equalRows[1],
                equalRows[0],
                equalRows[2],
                equalRows[3],
            ]);
        });

        it('... should keep the order if no key is given', () => {
            expectToEqual(sortTableRows(rows, '', false), rows);
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

        it('... should hold the rows of the first page', () => {
            expectToEqual(paginateTableRows(rows, 1, 10), rows.slice(0, 10));
        });

        it('... should hold the rows of a middle page', () => {
            expectToEqual(paginateTableRows(rows, 2, 10), rows.slice(10, 20));
        });

        it('... should hold the remaining rows of the last page', () => {
            expectToEqual(paginateTableRows(rows, 3, 10), rows.slice(20, 23));
        });

        it('... should hold no rows for a page out of range', () => {
            expectToEqual(paginateTableRows(rows, 4, 10), []);
        });
    });
});
