/**
 * The SearchParams class.
 *
 * It is used in the context of the search
 * to store the data for search (url) params.
 */
export class SearchParams {
    /**
     * The query string.
     */
    query: string;

    /**
     * The number of rows to return per result list page.
     */
    nRows: string;

    /**
     * The position in the result list to start at.
     */
    startAt: string;

    /**
     * The requested view ('table', 'grid').
     */
    view: string;
}
