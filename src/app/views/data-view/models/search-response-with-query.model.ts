import { SearchResponseJson } from '@awg-shared/api-objects';
import { ExtendedSearchParams, SearchQuery } from '@awg-views/data-view/models';

/**
 * The SearchResponseWithQuery class.
 *
 * It is used in the context of the search
 * to store the data for a search response
 * and its corresponding query string.
 */
export class SearchResponseWithQuery {
    /**
     * The search response data.
     */
    data: SearchResponseJson;

    /**
     * The query string or extended search object.
     */
    query: SearchQuery;

    /**
     * Constructor of the SearchResponseWithQuery class.
     *
     * It initializes the class with values from a given
     * search response and the corresponding query string.
     *
     * @param {SearchResponseJson} data The given search response.
     * @param {SearchQuery} query The given search query.
     */
    constructor(data: SearchResponseJson, query: SearchQuery) {
        this.data = data;
        this.query = query;
    }
}
