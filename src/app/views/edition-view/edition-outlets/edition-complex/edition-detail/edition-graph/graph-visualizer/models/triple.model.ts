/**
 * The Triple interface.
 *
 * It represents an RDF triple.
 */
export interface Triple {
    /**
     * The subject of an RDF triple.
     */
    subject: TripleValue;

    /**
     * The predicate of an RDF triple.
     */
    predicate: TripleValue;

    /**
     * The object of an RDF triple.
     */
    object: TripleValue;
}

/**
 * The TripleValue interface.
 *
 * It represents the nominal value of an RDF triple.
 */
export interface TripleValue {
    /**
     * The nominal value of an RDF triple component.
     */
    nominalValue: any;
}
