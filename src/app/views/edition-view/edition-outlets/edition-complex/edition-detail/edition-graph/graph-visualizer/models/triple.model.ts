/**
 * The AbstractTriple interface.
 *
 * It represents an abstract RDF triple.
 */
export interface AbstractTriple {
    /**
     * The subject of an abstract RDF triple.
     */
    subject: any;

    /**
     * The predicate of an abstract RDF triple.
     */
    predicate: any;

    /**
     * The object of an abstract  RDF triple.
     */
    object: any;
}

/**
 * The Triple interface.
 *
 * It represents an RDF triple.
 */
export interface Triple extends AbstractTriple {
    /**
     * The subject of an RDF triple.
     */
    subject: string;

    /**
     * The predicate of an RDF triple.
     */
    predicate: string;

    /**
     * The object of an RDF triple.
     */
    object: string;
}

/**
 * The StoreTriple interface.
 *
 * It represents an RDF triple as returned from Triplestore.
 */
export interface StoreTriple extends AbstractTriple {
    /**
     * The subject of an RDF triple.
     */
    subject: StoreTripleValue;

    /**
     * The predicate of an RDF triple.
     */
    predicate: StoreTripleValue;

    /**
     * The object of an RDF triple.
     */
    object: StoreTripleValue;
}

/**
 * The StoreTripleValue interface.
 *
 * It represents the nominal value of an RDF triple as returned from Triplestore.
 */
export interface StoreTripleValue {
    /**
     * The nominal value of an RDF triple component.
     */
    nominalValue: string;
}
