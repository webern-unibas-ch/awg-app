/**
 * The SearchResultsViewTypes enumeration.
 *
 * It stores the possible view types for search results.
 */
export enum SearchResultsViewTypes {
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
    view: SearchResultsViewTypes;
}

/**
 * The ExtendedSearchParams class.
 *
 * It is used in the context of the extended search
 * to store the data for search (url) params.
 */
export class ExtendedSearchParams {
    /**
     * The ID of a resource type.
     */
    resourcetypeId: number;

    /**
     * The properties fields.
     */
    properties: ExtendedSearchParamsProperties[];

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
    view: SearchResultsViewTypes;
}

/**
 * The ExtendedSearchParamsProperties class.
 *
 * It is used in the context of the extended search
 * to store the data for the searched properties params.
 */
export class ExtendedSearchParamsProperties {
    /**
     * The ID of a property to be searched.
     */
    propertyId: number;

    /**
     * The comparison operator to be applied.
     */
    compop: string;

    /**
     * The search value string.
     */
    searchValue: string;
}
