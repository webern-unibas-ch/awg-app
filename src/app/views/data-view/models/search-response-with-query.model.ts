import { SearchResponseJson } from '@awg-shared/api-objects';

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
     * The query string.
     */
    query: string;

    /**
     * Constructor of the SearchResponseWithQuery class.
     *
     * It initializes the class with values from a given
     * search response and the corresponding query string.
     *
     * @param {SearchResponseJson} data The given search response.
     * @param {string} query The given query string.
     */
    constructor(data: SearchResponseJson, query: string) {
        this.data = data;
        this.query = query;
    }
}
