/**
 * The FolioConvoluteList class.
 *
 * It is used in the context of the edition convolutes
 * to store the data for a convolute list
 * from a convolute json file.
 */
export class FolioConvoluteList {
    /**
     * The array of FolioLists from a convolute list.
     */
    convolutes: FolioConvolute[];
}

/**
 * The FolioConvolute class.
 *
 * It is used in the context of the edition convolutes
 * to store the data for a single convolute
 * from a convolute json file.
 */
export class FolioConvolute {
    /**
     * The convolute's id (string).
     */
    convoluteId: string;

    /**
     * The array of folios from a convolute.
     */
    folios: Folio[];

    /**
     * The link to a convolute description in the critical report.
     */
    linkTo?: string;
}

/**
 * The Folio class.
 *
 * It is used in the context of the edition folio convolutes
 * to store the top level data for a single folio
 * from a folio json file.
 */
export class Folio {
    /**
     * The folio's id (string).
     */
    folioId: string;

    /**
     * The folio's number of systems (string).
     */
    systems: string;

    /**
     * The folio's format values (FolioFormat).
     */
    format: FolioFormat;

    /**
     * The folio's content array (FolioContent[]).
     */
    content: FolioContent[];
}

/**
 * The Folio format class.
 *
 * It is used in the context of the edition folio convolutes
 * to store the sub level data for folio format
 * from a folio json file.
 */
export class FolioFormat {
    /**
     * The folio format's height (number).
     */
    height: number;

    /**
     * The folio format's width (number).
     */
    width: number;
}

/**
 * The Folio content class.
 *
 * It is used in the context of the edition folio convolutes
 * to store the sub level data for folio content
 * from a folio json file.
 */
export class FolioContent {
    /**
     * The folio content's id (string).
     */
    id: string;

    /**
     * The folio content's sigle (string).
     */
    sigle: string;

    /**
     * The folio content's sigle addendum (string).
     */
    sigleAddendum: string;

    /**
     * Boolean flag if the content item can be selected..
     */
    selectable?: boolean;

    /**
     * The link to a convolute description in the critical report.
     */
    linkTo?: string;

    /**
     * The folio content's optional sectionPartition (number).
     */
    sectionPartition?: number;

    /**
     * The folio content's optional sections array (FolioSection[]).
     */
    sections?: FolioSection[];
}

/**
 * The Folio section class.
 *
 * It is used in the context of the edition folio convolutes
 * to store the sub level data for folio sections
 * from a folio json file.
 */
export class FolioSection {
    /**
     * The folio section's start system (number).
     */
    startSystem: number;

    /**
     * The folio section's end system (number).
     */
    endSystem: number;

    /**
     * The folio section's optional position (number).
     */
    position?: number;
}
