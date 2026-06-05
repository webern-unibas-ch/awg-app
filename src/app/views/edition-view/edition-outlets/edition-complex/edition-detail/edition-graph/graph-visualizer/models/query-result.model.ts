import type { Triple } from './triple.model';

/**
 * Query result union type.
 */
export type QueryResult = Triple[] | QuerySelectResult | string | undefined;

/**
 * The QuerySelectResult interface.
 *
 * It represents the result of a SPARQL select query.
 */
export interface QuerySelectResult {
    /**
     * The head of the query selectresult with the variable names.
     */
    head: QuerySelectResultHead;

    /**
     * The body of the query select result with the bindings.
     */
    body: QuerySelectResultBody;
}

/**
 * The QuerySelectResultHead interface.
 *
 * It represents the head of a query result.
 */
export interface QuerySelectResultHead {
    /**
     * The variable names of the query result head.
     */
    vars: string[];
}

/**
 * The QuerySelectResultBody interface.
 *
 * It represents the body of a query result.
 */
export interface QuerySelectResultBody {
    /**
     * The bindings of the query result body.
     */
    bindings: QuerySelectResultBindings[];
}

/**
 * The QuerySelectResultBindings interface.
 *
 * It represents the bindings of a query result.
 */
export interface QuerySelectResultBindings {
    /**
     * The key-value pair bindings of the query result body.
     */
    [key: string]: any;
}
