import {
    FolioCalculation,
    FolioCalculationContentSegment,
    FolioCalculationLine,
    FolioCalculationPoint,
    FolioCalculationRectangle,
    FolioCalculationSheet,
    FolioCalculationSystems,
} from './folio-calculation.model';

/**
 * The FolioSvgSheet class.
 *
 * It is used in the context of the edition folio convolutes
 * to store and expose the svg data for the sheet of a folio.
 *
 * Not exposed, only called internally from {@link FolioSvgData}.
 */
class FolioSvgSheet {
    /**
     * The folio's id.
     */
    folioId: string;

    /**
     * The folio's sheet rectangle
     */
    sheetRectangle: FolioCalculationRectangle;

    /**
     * The optional folio's trademark rectangle.
     */
    trademarkRectangle?: FolioCalculationRectangle;

    /**
     * Constructor of the FolioSvgSheet class.
     *
     * It initializes the class with values from the folio sheet calculation.
     *
     * @param {FolioCalculationSheet} calculatedSheet The given calculated folio sheet.
     */
    constructor(calculatedSheet: FolioCalculationSheet) {
        this.folioId = calculatedSheet.FOLIO_ID;
        this.sheetRectangle = calculatedSheet.SHEET_RECTANGLE;
        this.trademarkRectangle = calculatedSheet.TRADEMARK_RECTANGLE;
    }
}

/**
 * The FolioSvgSystems class.
 *
 * It is used in the context of the edition folio convolutes
 * to store the svg data for the systems of a folio.
 *
 * Not exposed, only called internally from {@link FolioSvgData}.
 */
class FolioSvgSystems {
    /**
     * The systems label positions of a folio.
     */
    systemsLabelPositions: FolioCalculationPoint[];

    /**
     * The system lines of a folio.
     */
    systemsLines: FolioCalculationLine[][];

    /**
     * The boolean flag if the systems are reversed.
     */
    systemsReversed: boolean;

    /**
     * Constructor of the FolioSvgSystems class.
     *
     * It initializes the class with values from the folio system calculation.
     *
     * @param {FolioCalculationSystems} calculatedSystems The given calculated folio systems.
     */
    constructor(calculatedSystems: FolioCalculationSystems) {
        this.systemsLabelPositions = calculatedSystems.SYSTEMS_LABELS.SYSTEMS_LABELS_ARRAY;
        this.systemsLines = calculatedSystems.SYSTEMS_LINES.SYSTEMS_ARRAYS;
        this.systemsReversed = calculatedSystems.SYSTEMS_REVERSED;
    }
}

/**
 * The FolioSvgContentSegment class.
 *
 * It is used in the context of the edition folio convolutes
 * to store the svg data for the content segment of a folio.
 *
 * Exposed to be used throughout {@link EditionSheetsModule}.
 */
export class FolioSvgContentSegment {
    /**
     * The id for the label of a content segment edition complex.
     */
    complexId: string;

    /**
     * The id for the label of a content segment sheet.
     */
    sheetId: string;

    /**
     * The optional link to a convolute description in the critical report.
     */
    linkTo: string;

    /**
     * The optional boolean flag if the content segment can be selected.
     */
    selectable: boolean;

    /**
     * The array of labels of a content segment.
     */
    segmentLabelArray: string[];

    /**
     * The optional boolean flag if the content segment is reversed.
     */
    segmentReversed: boolean;

    /**
     * The label of a content segment.
     */
    segmentLabel: string;

    /**
     * The vertices of a content segment polygon.
     */
    segmentVertices: string;

    /**
     * The centered X position of a content segment.
     */
    centeredXPosition: number;

    /**
     * The centered y position of a content segment.
     */
    centeredYPosition: number;

    /**
     * Constructor of the FolioSvgContentSegment class.
     *
     * It initializes the class with values from the folio content segment calculation.
     *
     * @param {FolioCalculationContentSegment} calculatedContentSegment The given calculated folio content segment.
     */
    constructor(calculatedContentSegment: FolioCalculationContentSegment) {
        this.complexId = calculatedContentSegment.complexId;
        this.sheetId = calculatedContentSegment.sheetId;
        this.linkTo = calculatedContentSegment.linkTo;
        this.selectable = calculatedContentSegment.selectable;
        this.segmentLabelArray = calculatedContentSegment.segmentLabelArray;
        this.segmentLabel = calculatedContentSegment.segmentLabel;
        this.segmentReversed = calculatedContentSegment.reversed;
        this.segmentVertices = calculatedContentSegment.vertices?.VERTICES_AS_STRING;
        this.centeredXPosition = calculatedContentSegment.centeredXPosition;
        this.centeredYPosition = calculatedContentSegment.centeredYPosition;
    }
}

/**
 * The FolioSvgData class.
 *
 * It is used in the context of the edition folio convolutes
 * to store and expose the svg data for a folio.
 *
 * Exposed to be used throughout {@link EditionSheetsModule}.
 */
export class FolioSvgData {
    /**
     * The sheet of a folio.
     */
    sheet: FolioSvgSheet;

    /**
     * The systems of a folio.
     */
    systems: FolioSvgSystems;

    /**
     * The content segments of a folio.
     */
    contentSegments: FolioSvgContentSegment[];

    /**
     * Constructor of the FolioSvgData class.
     *
     * It initializes the class with values from the folio calculation.
     *
     * @param {FolioCalculation} calculation The given folio calculation.
     */
    constructor(calculation: FolioCalculation) {
        this.sheet = new FolioSvgSheet(calculation.SHEET);
        this.systems = new FolioSvgSystems(calculation.SYSTEMS);
        this.contentSegments = calculation.CONTENT_SEGMENTS.map(segment => new FolioSvgContentSegment(segment));
    }
}
