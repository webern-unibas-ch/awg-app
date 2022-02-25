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
 * Describes a type that can be either string or ExtendedSearchParams object.
 */
export type SearchQuery = string | ExtendedSearchParams;

/**
 * The SearchParams class.
 *
 * It is used in the context of the search
 * to store the data for search (url) params.
 */
export class SearchParams {
    /**
     * The search query (string or ExtendedSearchParams).
     */
    query: SearchQuery;

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
    filterByRestype: string;

    /**
     * The ID of a property to be searched.
     */
    propertyId: string[];

    /**
     * The comparison operator to be applied.
     */
    compop: string[];

    /**
     * The search value string.
     */
    searchval: string[];
}
