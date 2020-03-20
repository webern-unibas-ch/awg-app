/**
 * The PrefixForm enumeration.
 *
 * It stores the possible prefix forms.
 */
export enum PrefixForm {
    short = 'short',
    long = 'long'
}

/**
 * The Prefix class.
 *
 * It is used in the context of the edition graph
 * and esp. the {@link PrefixPipe}
 * to store the name and IRI of a prefix.
 */
export class Prefix {
    /**
     * The name of the prefix (short form).
     */
    prefixName: string;

    /**
     * The iri of the prefix (long form).
     */
    prefixIri: string;

    /**
     * Constructor of the Prefix class.
     *
     * It sets the prefix name and IRI.
     *
     * @param {string} prefixName The given prefix name.
     * @param {string} prefixIri The given prefix IRI.
     */
    constructor(prefixName: string, prefixIri: string) {
        this.prefixName = prefixName;
        this.prefixIri = prefixIri;
    }
}
