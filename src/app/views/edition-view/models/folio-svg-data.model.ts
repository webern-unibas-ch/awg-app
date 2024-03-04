import {
    FolioCalculation,
    FolioCalculationContentSegment,
    FolioCalculationLine,
    FolioCalculationPoint,
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
     * The folio's id (string).
     */
    folioId: string;

    /**
     * The upper left corner of a folio (FolioCalculationPoint).
     *
     * It contains the calculated upper left point (in px)
     * to draw the svg of the sheet of a folio.
     */
    upperLeftCorner: FolioCalculationPoint;

    /**
     * The lower right corner (in px) of a folio (FolioCalculationPoint).
     *
     * It contains the calculated lower right point (in px)
     * to draw the svg of the sheet of a folio.
     */
    lowerRightCorner: FolioCalculationPoint;

    /**
     * Constructor of the FolioSvgSheet class.
     *
     * It initializes the class with values from the folio sheet calculation.
     *
     * @param {FolioCalculationSheet} calculatedSheet The given calculated folio sheet.
     */
    constructor(calculatedSheet: FolioCalculationSheet) {
        this.folioId = calculatedSheet.FOLIO_ID;
        this.upperLeftCorner = calculatedSheet.UPPER_LEFT_CORNER;
        this.lowerRightCorner = calculatedSheet.LOWER_RIGHT_CORNER;
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
     * The line label array of a folio (FolioCalculationPoint[]).
     *
     * It contains all calculated labels and their positions (in px)
     * to draw the svg of the systems of a folio.
     */
    systemsLabelArray: FolioCalculationPoint[];

    /**
     * The array of line arrays of a folio (FolioCalculationLine[][]).
     *
     * It contains all calculated lines and their positions (in px)
     * to draw the svg of the systems of a folio.
     */
    systemsArrays: FolioCalculationLine[][];

    /**
     * Constructor of the FolioSvgSystems class.
     *
     * It initializes the class with values from the folio system calculation.
     *
     * @param {FolioCalculationSystems} calculatedSystems The given calculated folio systems.
     */
    constructor(calculatedSystems: FolioCalculationSystems) {
        this.systemsLabelArray = calculatedSystems.SYSTEMS_LABEL_ARRAY;
        this.systemsArrays = calculatedSystems.SYSTEMS_ARRAYS;
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
     * The id for the label of a content segment edition complex (string).
     */
    complexId: string;

    /**
     * The id for the label of a content segment sheet (string).
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
     * The optional boolean flag if the content segment is reversed.
     */
    reversed: boolean;

    /**
     * The array of labels of a content segment (string[]).
     */
    segmentLabelArray: string[];

    /**
     * The label of a content segment (string).
     */
    segmentLabel: string;

    /**
     * The vertices of a content segment polygon (string).
     */
    segmentVertices: string;

    /**
     * The centered X position of a content segment (number).
     */
    centeredXPosition: number;

    /**
     * The centered y position of a content segment (number).
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
        this.reversed = calculatedContentSegment.reversed;
        this.segmentVertices = calculatedContentSegment.segmentVertices;
        this.segmentLabelArray = calculatedContentSegment.segmentLabelArray;
        this.segmentLabel = calculatedContentSegment.segmentLabel;
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
     * The sheet of a folio (FolioSvgSheet).
     *
     * It contains all calculated values and their positions (in px)
     * to draw the svg of the sheet of a folio.
     */
    sheet: FolioSvgSheet;

    /**
     * The systems of a folio (FolioSvgSystems).
     *
     * It contains all calculated values and their positions (in px)
     * to draw the svg of the systems of a folio.
     */
    systems: FolioSvgSystems;

    /**
     * The content segments of a folio (FolioSvgContentSegments).
     *
     * It contains all calculated values and their positions (in px)
     * to draw the svg of the content segments of a folio.
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
        this.sheet = new FolioSvgSheet(calculation.sheet);
        this.systems = new FolioSvgSystems(calculation.systems);
        this.contentSegments = [];
        this.contentSegments = calculation.contentSegments.map(
            calculatedContentSegment => new FolioSvgContentSegment(calculatedContentSegment)
        );
    }
}
