import { SearchQuery } from '@awg-views/data-view/models';

/**
 * The SearchInfo class.
 *
 * It is used in the context of the search info
 * to store the data to inform about a search.
 */
export class SearchInfo {
    /**
     * The query of a search (string or ExtendedSearchParams).
     */
    query: SearchQuery;

    /**
     * The number of hits of a search.
     */
    nhits: string;

    /**
     * Constructor of the SearchInfo class.
     *
     * It initializes the class with values
     * from a given query and number of hits
     * of a search.
     *
     * @param {SearchQuery} query The given search query.
     * @param {string} nhits The given number of hits.
     */
    constructor(query: SearchQuery, nhits: string) {
        this.query = query;
        this.nhits = nhits;
    }
}
