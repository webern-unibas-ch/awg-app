import { Triple } from './triple.model';

/**
 * The QueryResult interface.
 *
 * It represents the result of a query.
 */
export interface QueryResult {
    /**
     * The actions of the query result (optional).
     */
    actions?;

    /**
     * The duplicates of the query result (optional).
     */
    duplicates?: object[];

    /**
     * The triples of the query result (optional).
     */
    triples?: Triple[];
}
