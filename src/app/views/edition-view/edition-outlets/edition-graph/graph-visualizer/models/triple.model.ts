/**
 * The Triple interface.
 *
 * It represents an RDF triple.
 */
export interface Triple {
    /**
     * The subject of an RDF triple.
     */
    subject: TripleComponent;

    /**
     * The predicate of an RDF triple.
     */
    predicate: TripleComponent;

    /**
     * The object of an RDF triple.
     */
    object: TripleComponent;
}

/**
 * The TripleComponent interface.
 *
 * It represents an RDF triple component.
 */
export interface TripleComponent {
    /**
     * The nominal value of an RDF triple component.
     */
    nominalValue;
}
