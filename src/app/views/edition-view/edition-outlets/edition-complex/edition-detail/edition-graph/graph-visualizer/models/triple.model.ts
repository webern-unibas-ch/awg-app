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
 * The RDFStoreConstructResponseTriple interface.
 *
 * It represents an RDF triple as returned from CONSTRUCT response against rdfstore.
 */
export interface RDFStoreConstructResponseTriple extends AbstractTriple {
    /**
     * The subject of an RDF triple from CONSTRUCT response against rdfstore..
     */
    subject: RDFStoreConstructResponseTripleSegment;

    /**
     * The predicate of an RDF triple from CONSTRUCT response against rdfstore..
     */
    predicate: RDFStoreConstructResponseTripleSegment;

    /**
     * The object of an RDF triple from CONSTRUCT response against rdfstore..
     */
    object: RDFStoreConstructResponseTripleSegment;
}

/**
 * The RDFStoreConstructResponseTripleSegment interface.
 *
 * It represents a segment of an RDF triple as returned from CONSTRUCT response against rdfstore.
 */
export interface RDFStoreConstructResponseTripleSegment {
    /**
     * The nominal value of an RDF triple segment from CONSTRUCT response against rdfstore.
     */
    nominalValue: string;

    /**
     * The interfacename of an RDF triple segment from CONSTRUCT response against rdfstore.
     */
    interfacename?: string;

    /**
     * The attributes of an RDF triple segment from CONSTRUCT response against rdfstore.
     */
    attributes?: string[];
}

/**
 * The RDFStoreSelectResponseTriple interface.
 *
 * It represents an RDF triple as returned from SELECT response against rdfstore.
 */
export interface RDFStoreSelectResponseTriple extends AbstractTriple {
    /**
     * The subject of an RDF triple from SELECT response against rdfstore..
     */
    subject: RDFStoreSelectResponseTripleSegment;

    /**
     * The predicate of an RDF triple from SELECT response against rdfstore..
     */
    predicate: RDFStoreSelectResponseTripleSegment;

    /**
     * The object of an RDF triple from SELECT response against rdfstore..
     */
    object: RDFStoreSelectResponseTripleSegment;
}

/**
 * The RDFStoreSelectResponseTripleSegment interface.
 *
 * It represents a segment of an RDF triple as returned from SELECT response against rdfstore.
 */
export interface RDFStoreSelectResponseTripleSegment {
    /**
     * The type of an RDF triple segment from SELECT response against rdfstore.
     */
    type: string;

    /**
     * The label of an RDF triple segment from SELECT response against rdfstore.
     */
    label: any;

    /**
     * The value of an RDF triple segment from SELECT response against rdfstore.
     */
    value: string;

    /**
     * The datatype of an RDF triple segment from SELECT response against rdfstore.
     */
    datatype?: string;
}
