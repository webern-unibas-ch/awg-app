/**
 * The QueryResult interface.
 *
 * It represents the result of a SPARQL query.
 */
export interface QueryResult {
    /**
     * The head of the query result with the variable names.
     */
    head: QueryResultHead;

    /**
     * The body of the query result with the bindings.
     */
    body: QueryResultBody;
}

/**
 * The QueryResultHead interface.
 *
 * It represents the head of a query result.
 */
export interface QueryResultHead {
    /**
     * The variable names of the query result head.
     */
    vars: string[];
}

/**
 * The QueryResultBody interface.
 *
 * It represents the body of a query result.
 */
export interface QueryResultBody {
    /**
     * The bindings of the query result body.
     */
    bindings: QueryResultBindings[];
}

/**
 * The QueryResultBindings interface.
 *
 * It represents the bindings of a query result.
 */
export interface QueryResultBindings {
    /**
     * The key-value pair bindings of the query result body.
     */
    [key: string]: any;
}
