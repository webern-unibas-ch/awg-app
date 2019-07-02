/**
 * The SearchInfo class.
 *
 * It is used in the context of the search info
 * to store the data to inform about a search.
 */
export class SearchInfo {
    /**
     * The query string of a search.
     */
    query: string;

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
     * @param {string} query The given query string.
     * @param {string} nhits The given number of hits.
     */
    constructor(query: string, nhits: string) {
        this.query = query;
        this.nhits = nhits;
    }
}
