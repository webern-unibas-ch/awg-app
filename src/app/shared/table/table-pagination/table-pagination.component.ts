import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * The TablePagination component.
 *
 * It contains hte pagination panel of the configurable table
 * that is provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-table-pagination',
    templateUrl: './table-pagination.component.html',
    styleUrls: ['./table-pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePaginationComponent implements OnInit {
    /**
     * Input variable: collectionSize.
     *
     * It keeps the collectionSize of the pagination.
     */
    @Input()
    collectionSize: number;

    /**
     * Input variable: page.
     *
     * It keeps the page of the pagination.
     */
    @Input()
    page: number;

    /**
     * Output variable: pageChange.
     *
     * It keeps an event emitter for a change of the page number.
     */
    @Output()
    pageChange: EventEmitter<number> = new EventEmitter();

    /**
     * Output variable: pageChangeRequest.
     *
     * It keeps an event emitter for a change of the page number.
     */
    @Output()
    pageChangeRequest: EventEmitter<number> = new EventEmitter();

    /**
     * Readonly variable: FILTER_PAG_REGEX.
     *
     * It keeps a regex for anything else but a number value.
     */
    readonly FILTER_PAG_REGEX = /\D/g;

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        // Intentionally left empty until implemented
    }

    /**
     * Public method: replaceNonNumberInput.
     *
     * It replaces all non-number input values with empty string.
     *
     * @param {HTMLInputElement} input The given input.
     *
     * @returns {void} Replaces the input.value.
     */
    replaceNonNumberInput(input: HTMLInputElement): void {
        input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
    }

    /**
     * Public method: onPageChange.
     *
     * It emits an event when the user changes the page of the pagination.
     *
     * @param {number} newPage The given page.
     *
     * @returns {void} Emits the event.
     */
    onPageChange(newPage: number): void {
        if (!newPage) {
            return;
        }
        this.pageChange.emit(newPage);
        this.pageChangeRequest.emit(newPage);
    }

    /**
     * Public method: selectPage.
     *
     * It selects a given page.
     *
     * @param {string} page The given page.
     *
     * @returns {void} Selects the page.
     */
    selectPage(page: string): void {
        this.page = parseInt(page, 10) || 1;
        this.onPageChange(this.page);
    }
}
