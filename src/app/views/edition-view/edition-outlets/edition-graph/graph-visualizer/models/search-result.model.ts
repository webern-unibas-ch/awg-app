/**
 * The SearchResult interface.
 *
 * It represents the result of a search.
 */
export interface SearchResult {
    /**
     * The head of the search result with the variable names.
     */
    head: SearchResultHead;

    /**
     * The body of the search result with the bindings.
     */
    body: SearchResultBody;
}

/**
 * The SearchResultHead interface.
 *
 * It represents the head of a search result.
 */
export interface SearchResultHead {
    /**
     * The variable names of the search result head.
     */
    vars: string[];
}

/**
 * The SearchResultBody interface.
 *
 * It represents the body of a search result.
 */
export interface SearchResultBody {
    /**
     * The bindings of the search result body.
     */
    bindings: SearchResultBindings[];
}

/**
 * The SearchResultBindings interface.
 *
 * It represents the bindings of a search result.
 */
export interface SearchResultBindings {
    /**
     * The key-value pair bindings of the search result body.
     */
    [key: string]: any;
}
