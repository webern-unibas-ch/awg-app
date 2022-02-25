/**
 * The Source class.
 *
 * It is used in the context of the edition view
 * to store the data for a single source
 * from a sourcelist json file.
 */
export class Source {
    /**
     * The siglum of a source.
     */
    siglum: string;

    /**
     * The type description of a source.
     */
    type: string;

    /**
     * The physical location of a source.
     */
    location: string;

    /**
     * A flag if the source has a source description in the critical report.
     */
    hasDescription: boolean;

    /**
     * The link to a source description in the critical report.
     */
    linkTo: string;
}

/**
 * The SourceList class.
 *
 * It is used in the context of the edition view
 * to store the data for a source list
 * from a sourcelist json file.
 */
export class SourceList {
    /**
     * The array of sources from a source list.
     */
    sources: Source[];
}
