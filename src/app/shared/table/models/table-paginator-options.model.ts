/**
 * The TablePaginatorOptions class.
 *
 * It is used in the context of the app framework
 * to store the options for a table paginator.
 */
export class TablePaginatorOptions {
    /**
     * The current page number.
     */
    page: number;

    /**
     * The selected number of rows per page.
     */
    selectedPageSize: number;

    /**
     * The page size options.
     */
    pageSizeOptions: number[];

    /**
     * The size of the collection.
     */
    collectionSize: number;

    /**
     * Constructor of the PaginatorOptions class.
     *
     * It initializes the class with given values.
     *
     * @param {number} page The current page number.
     * @param {number} selectedPageSize The number of rows per page.
     * @param {number[]} pageSizeOptions The options for the page size.
     * @param {number} collectionSize The size of the collection.
     */
    constructor(page: number, selectedPageSize: number, pageSizeOptions: number[], collectionSize: number) {
        this.page = page;
        this.selectedPageSize = selectedPageSize;
        this.pageSizeOptions = pageSizeOptions;
        this.collectionSize = collectionSize;
    }
}
