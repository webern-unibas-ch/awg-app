import { TableRows } from './table.model';

/**
 * Array constant: TABLE_PAGE_SIZE_OPTIONS.
 *
 * It keeps the selectable page sizes of the table.
 */
export const TABLE_PAGE_SIZE_OPTIONS: readonly number[] = [5, 10, 25, 50, 100, 200];

/**
 * Number constant: TABLE_DEFAULT_PAGE_SIZE.
 *
 * It keeps the default page size of the table.
 */
export const TABLE_DEFAULT_PAGE_SIZE = 10;

/**
 * Utils method: filterTableRows.
 *
 * It filters the given rows by a search term.
 * A row matches if the label of one of its entries
 * contains the term (case-insensitive).
 *
 * @param {TableRows[]} rows The given rows.
 * @param {string} term The given search term.
 * @returns {TableRows[]} The filtered rows.
 */
export function filterTableRows(rows: TableRows[], term: string): TableRows[] {
    const searchTerm = term.toString().toLowerCase();

    return rows.filter(row =>
        Object.values(row).some(rowEntry => rowEntry?.['label']?.toString().toLowerCase().includes(searchTerm))
    );
}

/**
 * Object constant: TABLE_COLLATOR.
 *
 * It keeps a collator for a natural, case-insensitive string comparison
 * (e.g. `a` = `A`, `2r` < `11r`).
 */
const TABLE_COLLATOR = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/**
 * Utils method: isMissingTableValue.
 *
 * It checks if a given table value is missing (null, undefined or NaN).
 *
 * @param {unknown} value The given value.
 * @returns {boolean} The result of the check.
 */
export function isMissingTableValue(value: unknown): boolean {
    return value == null || Number.isNaN(value);
}

/**
 * Utils method: compareTableValues.
 *
 * It compares two table values for sorting:
 * - strings in natural, case-insensitive order,
 * - numbers numerically,
 * - numbers before strings,
 * - missing values (null, undefined, NaN) at the end.
 *
 * @param {unknown} a The first value.
 * @param {unknown} b The second value.
 * @returns {number} The comparison result (-1, 0, 1).
 */
export function compareTableValues(a: unknown, b: unknown): number {
    const isMissingA = isMissingTableValue(a);
    const isMissingB = isMissingTableValue(b);

    if (isMissingA || isMissingB) {
        return Number(isMissingA) - Number(isMissingB);
    }

    const isNumberA = typeof a === 'number';
    const isNumberB = typeof b === 'number';

    if (isNumberA && isNumberB) {
        return Math.sign(a - b);
    }
    if (isNumberA !== isNumberB) {
        return isNumberA ? -1 : 1;
    }
    return Math.sign(TABLE_COLLATOR.compare(String(a), String(b)));
}

/**
 * Utils method: sortTableRows.
 *
 * It sorts a copy of the given rows by the label of the given key.
 * The sort is stable in both directions, so equal values keep their order,
 * and missing values stay at the end also in reverse order.
 *
 * @param {TableRows[]} rows The given rows.
 * @param {string} key The given key (header label) to sort by.
 * @param {boolean} reverse The flag for reverse sort order.
 * @returns {TableRows[]} The sorted rows.
 */
export function sortTableRows(rows: TableRows[], key: string, reverse: boolean): TableRows[] {
    if (!key) {
        return rows;
    }

    return [...rows].sort((rowA, rowB) => {
        const a = rowA[key]?.label;
        const b = rowB[key]?.label;
        const result = compareTableValues(a, b);

        // Keep missing values at the end, independent of the sort order
        if (!reverse || isMissingTableValue(a) || isMissingTableValue(b)) {
            return result;
        }
        return -result;
    });
}

/**
 * Utils method: paginateTableRows.
 *
 * It returns the rows of the given page.
 *
 * @param {TableRows[]} rows The given rows.
 * @param {number} page The given page (starting with 1).
 * @param {number} pageSize The given page size.
 * @returns {TableRows[]} The rows of the given page.
 */
export function paginateTableRows(rows: TableRows[], page: number, pageSize: number): TableRows[] {
    const startRow = (page - 1) * pageSize;

    return rows.slice(startRow, startRow + pageSize);
}
