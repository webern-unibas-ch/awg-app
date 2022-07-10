import { ViewHandleTypes } from '@awg-shared/view-handle-button-group/view-handle.model';

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
     * The requested view type.
     */
    viewType: ViewHandleTypes;

    /**
     * Constructor of the SearchParams class.
     *
     * @param {SearchQuery} query The search query (string or ExtendedSearchParams).
     * @param {string} nRows The number of rows to return per result list page.
     * @param {string} startAt The position in the result list to start at.
     * @param {ViewHandleTypes} viewType The requested view type.
     */
    constructor(query: SearchQuery, nRows: string, startAt: string, viewType: ViewHandleTypes) {
        this.query = query;
        this.nRows = nRows;
        this.startAt = startAt;
        this.viewType = viewType;
    }
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
