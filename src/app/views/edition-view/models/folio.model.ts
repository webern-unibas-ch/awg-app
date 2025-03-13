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
     * The convolute's id.
     */
    convoluteId: string;

    /**
     * The convolute's label.
     */
    convoluteLabel: string;

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
     * The folio's id.
     */
    folioId: string;

    /**
     * The folio's number of systems.
     */
    systems: string;

    /**
     * The folio's dimensions.
     */
    dimensions: FolioDimensions;

    /**
     * The folio's optional boolean flag if the folio sheet is reversed.
     */
    reversed?: boolean;

    /**
     * The folio's optional trademark position.
     */
    trademarkPosition?: string;

    /**
     * The folio's content array.
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
export class FolioDimensions {
    /**
     * The folio's height.
     */
    height: number;

    /**
     * The folio's width.
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
     * The folio content's complex id.
     */
    complexId: string;

    /**
     * The folio content's sheet id.
     */
    sheetId: string;

    /**
     * The folio content's sigle.
     */
    sigle: string;

    /**
     * The folio content's sigle addendum.
     */
    sigleAddendum: string;

    /**
     * Boolean flag if the content item can be selected.
     */
    selectable?: boolean;

    /**
     * Boolean flag if the content item is reversed.
     */
    reversed?: boolean;

    /**
     * The link to a convolute description in the critical report.
     */
    linkTo?: string;

    /**
     * The folio content's optional sectionPartition.
     */
    sectionPartition?: number;

    /**
     * The folio content's optional segments array.
     */
    segments?: FolioSegment[];
}

/**
 * The FolioSegment class.
 *
 * It is used in the context of the edition folio convolutes
 * to store the sub level data for folio segments
 * from a folio json file.
 */
export class FolioSegment {
    /**
     * The folio segment's start system.
     */
    startSystem: number;

    /**
     * The folio segment's end system.
     */
    endSystem: number;

    /**
     * The folio segment's optional position.
     */
    position?: number;

    /**
     * The folio segment's optional position relative to the system.
     */
    relativeToSystem?: string;
}
