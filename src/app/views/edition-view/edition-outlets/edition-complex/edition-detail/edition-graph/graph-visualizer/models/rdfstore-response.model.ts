import { RDFStoreConstructResponseTriple, RDFStoreSelectResponseTriple } from './triple.model';

/**
 * The RDFStoreConstructResponse interface.
 *
 * It represents the construct response from the rdfstore (triplestore).
 */
export interface RDFStoreConstructResponse {
    /**
     * The actions of the rdfstore response (optional).
     */
    actions?;

    /**
     * The duplicates of the rdfstore response (optional).
     */
    duplicates?: object[];

    /**
     * The triples of the rdfstore response (optional).
     */
    triples?: RDFStoreConstructResponseTriple[];
}

/**
 * The RDFStoreSelectResponse interface.
 *
 * It represents the select response from the rdfstore (triplestore).
 */
export interface RDFStoreSelectResponse extends Array<RDFStoreSelectResponseTriple> {
    // Intentionally left blank
}
