/**
 * The SourceDescriptionSystemRow class.
 *
 * It is used in the context of the edition view
 * to store the data for a system row of a source description
 * from a source description json file.
 */
export class SourceDescriptionSystemRow {
    /**
     * The type of the row (optional).
     */
    rowType?: string;

    /**
     * The base of the row (optional).
     */
    rowBase?: string;

    /**
     * The number of the row (optional).
     */
    rowNumber?: string;
}

/**
 * The SourceDescriptionSystem class.
 *
 * It is used in the context of the edition view
 * to store the data for a system of a source description
 * from a source description json file.
 */
export class SourceDescriptionSystem {
    /**
     * The system label (optional).
     */
    system?: string;

    /**
     * The system description (optional).
     */
    systemDescription?: string;

    /**
     * The measure label (optional).
     */
    measure?: string;

    /**
     * The measure link (optional).
     */
    linkTo?: string;

    /**
     * The system rows (optional).
     */
    row?: SourceDescriptionSystemRow;
}

/**
 * The SourceDescriptionFolio class.
 *
 * It is used in the context of the edition view
 * to store the data for a folio of a source description
 * from a source description json file.
 */
export class SourceDescriptionFolio {
    /**
     * The folio label (optional).
     */
    folio?: string;

    /**
     * The folio link (optional).
     */
    folioLinkTo?: string;

    /**
     * The folio description (optional).
     */
    folioDescription?: string;

    /**
     * The systemGroups of a folio (optional).
     */
    systemGroups?: SourceDescriptionSystem[][];
}

/**
 * The SourceDescriptionContent class.
 *
 * It is used in the context of the edition view
 * to store the data for the content of a source description
 * from a source description json file.
 */
export class SourceDescriptionContent {
    /**
     * The content item (optional).
     */
    item?: string;

    /**
     * The content item link (optional).
     */
    itemLinkTo?: string;

    /**
     * The content item description (optional).
     */
    itemDescription?: string;

    /**
     * The folios of the content item (optional).
     */
    folios?: SourceDescriptionFolio[];
}

/**
 * The SourceDescriptionDesc class.
 *
 * It is used in the context of the edition view
 * to store the data for the description of a source description
 * from a source description json file.
 */
export class SourceDescriptionDesc {
    /**
     * The description of a source (optional).
     */
    desc?: string[];

    /**
     * The writing material used for a source (optional).
     */
    writingMaterial?: string;

    /**
     * The writing instruments used in a source (optional).
     */
    writingInstruments?: {
        main?: string;
        secondary?: string[];
    };

    /**
     * A title as it appears in a source (optional).
     */
    title?: string;

    /**
     * A date as it appears in a source (optional).
     */
    date?: string;

    /**
     * The pagination as it appears in a source (optional).
     */
    pagination?: string;

    /**
     * Measure numbers as they appear in a source (optional).
     */
    measureNumbers?: string;

    /**
     * The instrumentation as it appears in a source (optional).
     */
    instrumentation?: string;

    /**
     * Annotations as they appear in a source (optional).
     */
    annotations?: string;

    /**
     * The content of a source (optional).
     */
    content?: SourceDescriptionContent[];
}

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
     * The addendum to a siglum of a sourceDescription (optional).
     */
    siglumAddendum?: string;

    /**
     * The type description of a source.
     */
    type: string;

    /**
     * The physical location of a source.
     */
    location: string;

    /**
     * The description of a sourceDescription.
     */
    description: SourceDescriptionDesc;
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
