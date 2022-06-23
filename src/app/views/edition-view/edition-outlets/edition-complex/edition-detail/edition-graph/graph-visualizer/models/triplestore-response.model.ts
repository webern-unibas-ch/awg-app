import { Triple } from './triple.model';

/**
 * The TriplestoreResponse interface.
 *
 * It represents the response of a triplestore.
 */
export interface TriplestoreResponse {
    /**
     * The actions of the triplestore response (optional).
     */
    actions?;

    /**
     * The duplicates of the triplestore response (optional).
     */
    duplicates?: object[];

    /**
     * The triples of the triplestore response (optional).
     */
    triples?: Triple[];
}
