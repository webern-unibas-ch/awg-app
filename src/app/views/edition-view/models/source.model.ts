/**
 * The Source interface.
 *
 * It stores data for a single source from a source list JSON file.
 */
export interface Source {
    /**
     * The siglum of a source.
     **/
    siglum: string;

    /**
     * The addendum to a siglum of a source.
     **/
    siglumAddendum?: string;

    /**
     * The flag if a source is missing (optional).
     **/
    missing?: boolean;

    /**
     * The type description of a source.
     **/
    type: string;

    /**
     * The physical location of a source.
     **/
    location: string;

    /**
     * A flag if a source has a source description.
     **/
    hasDescription: boolean;

    /**
     * The link to the source description.
     **/
    linkTo: string;
}

/**
 * The SourceSiglum type.
 *
 * It stores the data needed to display the siglum of a source
 * (siglum, addendum and missing flag).
 */
export type SourceSiglum = Pick<Source, 'siglum' | 'siglumAddendum' | 'missing'>;

/**
 * The TextSource interface.
 *
 * It stores data for a single text source from a source list JSON file.
 */
export interface TextSource {
    /**
     * The id of a text source.
     **/
    id: string;

    /**
     * The siglum of a text source.
     **/
    siglum: string;

    /**
     * The addendum to a siglum of a text source (optional).
     **/
    siglumAddendum?: string;

    /**
     * The type description of a text source.
     **/
    type: string;

    /**
     * The physical location of a text source.
     **/
    location: string;
}
