/**
 * The SearchParamsViewTypes enumeration.
 *
 * It stores the possible search params view types.
 */
export enum SearchParamsViewTypes {
    table = 'table',
    grid = 'grid',
}

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
     * The requested view type ('table', 'grid').
     */
    view: SearchParamsViewTypes;
}
