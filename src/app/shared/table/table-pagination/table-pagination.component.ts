import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { NgbPagination, NgbPaginationPages } from '@ng-bootstrap/ng-bootstrap/pagination';

import { TABLE_DEFAULT_PAGE_SIZE } from '../table.utils';

/**
 * The TablePagination component.
 *
 * It contains the pagination panel of the {@link TableComponent}
 * with an input field to select a page directly.
 */
@Component({
    selector: 'awg-table-pagination',
    templateUrl: './table-pagination.component.html',
    styleUrls: ['./table-pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbPagination, NgbPaginationPages],
})
export class TablePaginationComponent {
    /**
     * Readonly input signal: collectionSize.
     *
     * It holds the number of items to paginate.
     * @default 0
     */
    readonly collectionSize = input<number>(0);

    /**
     * Readonly input signal: pageSize.
     *
     * It holds the number of items per page.
     * @default 10
     */
    readonly pageSize = input<number>(TABLE_DEFAULT_PAGE_SIZE);

    /**
     * Readonly model signal: page.
     *
     * It holds the current page of the pagination.
     * Changes are emitted via `pageChange`.
     * @default 1
     */
    readonly page = model<number>(1);

    /**
     * Readonly variable: FILTER_PAG_REGEX.
     *
     * It keeps a regex for anything else but a number value.
     */
    readonly FILTER_PAG_REGEX = /\D/g;

    /**
     * Public method: replaceNonNumberInput.
     *
     * It replaces all non-number input values with empty string.
     *
     * @param {HTMLInputElement} inputEl The given input element.
     *
     * @returns {void} Replaces the value of the input element.
     */
    replaceNonNumberInput(inputEl: HTMLInputElement): void {
        inputEl.value = inputEl.value.replace(this.FILTER_PAG_REGEX, '');
    }

    /**
     * Public method: onPageChange.
     *
     * It sets the given page on the page model signal.
     *
     * @param {number} newPage The given page.
     *
     * @returns {void} Sets the page.
     */
    onPageChange(newPage: number): void {
        if (!newPage) {
            return;
        }
        this.page.set(newPage);
    }

    /**
     * Public method: selectPage.
     *
     * It selects the page from a given input value.
     * Values that cannot be parsed fall back to page 1.
     *
     * @param {string} page The given input value.
     *
     * @returns {void} Selects the page.
     */
    selectPage(page: string): void {
        this.onPageChange(Number.parseInt(page, 10) || 1);
    }
}
