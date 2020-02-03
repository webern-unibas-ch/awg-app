/**
 * The SourceDescription class.
 *
 * It is used in the context of the edition view
 * to store the data for a single source description
 * from a source description json file.
 */
export class SourceDescription {
    /**
     * The id of a sourceDescription.
     */
    id: string;

    /**
     * The siglum of a sourceDescription.
     */
    siglum: string;

    /**
     * The physical location of a source.
     */
    location: string;

    /**
     * The description of a sourceDescription.
     */
    description: string;
}

/**
 * The SourceDescriptionList class.
 *
 * It is used in the context of the edition view
 * to store the data for a source description list
 * from a source description json file.
 */
export class SourceDescriptionList {
    /**
     * The array of sources from a source description list.
     */
    sources: SourceDescription[];
}
