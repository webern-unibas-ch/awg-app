import {
    FolioCalculationPoint,
    FolioCalculationLine,
    FolioCalculationContentItem,
    FolioCalculationSheet,
    FolioCalculationSystems,
    FolioCalculation
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
        this.folioId = calculatedSheet.folioId;
        this.upperLeftCorner = calculatedSheet.upperLeftCorner;
        this.lowerRightCorner = calculatedSheet.lowerRightCorner;
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
    lineLabelArray: FolioCalculationPoint[];

    /**
     * The array of line arrays of a folio (FolioCalculationLine[][]).
     *
     * It contains all calculated lines and their positions (in px)
     * to draw the svg of the systems of a folio.
     */
    lineArrays: FolioCalculationLine[][];

    /**
     * Constructor of the FolioSvgSystems class.
     *
     * It initializes the class with values from the folio system calculation.
     *
     * @param {FolioCalculationSystems} calculatedSystems The given calculated folio systems.
     */
    constructor(calculatedSystems: FolioCalculationSystems) {
        this.lineLabelArray = calculatedSystems.lineLabelArray;
        this.lineArrays = calculatedSystems.lineArrays;
    }
}

/**
 * The FolioSvgContentItem class.
 *
 * It is used in the context of the edition folio convolutes
 * to store the svg data for the content item of a folio.
 *
 * Not exposed, only called internally from {@link FolioSvgData}.
 */
class FolioSvgContentItem {
    /**
     * The sigle for the label of a content item (string).
     */
    sigle: string;

    /**
     * The measure for the label of a content item (string).
     */
    measure: string;

    /**
     * The upper left corner of a content item (FolioCalculationPoint).
     *
     * It contains the calculated upper left corner point (in px)
     * to draw the svg of a content item of a folio.
     */
    upperLeftCorner: FolioCalculationPoint;

    /**
     * The width of a content item (number).
     */
    width: number;

    /**
     * The height of a content item (number).
     */
    height: number;

    /**
     * The line array of a content item (FolioCalculationLine[]).
     *
     * It contains all calculated lines and their positions (in px)
     * to draw the svg of the content item of a folio.
     */
    lineArray: FolioCalculationLine[];

    /**
     * Constructor of the FolioSvgContentItem class.
     *
     * It initializes the class with values from the folio content item calculation.
     *
     * @param {FolioCalculationContentItem} calculatedContentItem The given calculated folio content item.
     */
    constructor(calculatedContentItem: FolioCalculationContentItem) {
        this.sigle = calculatedContentItem.sigle;
        this.measure = calculatedContentItem.measure;
        this.upperLeftCorner = calculatedContentItem.current.cornerPoints.upperLeftCorner;
        this.width = calculatedContentItem.width;
        this.height = calculatedContentItem.height;
        this.lineArray = calculatedContentItem.lineArray;
    }
}

/**
 * The FolioSvgData class.
 *
 * It is used in the context of the edition folio convolutes
 * to store and expose the svg data for a folio.
 *
 * Exposed to be used throughout {@link EditionDetailModule}.
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
     * The content items array of a folio (FolioSvgContentItems).
     *
     * It contains all calculated values and their positions (in px)
     * to draw the svg of the content items of a folio.
     */
    contentItemsArray: FolioSvgContentItem[];

    /**
     * Constructor of the FolioSvgData class.
     *
     * It initializes the class with values from the folio calculation.
     *
     * @param {FolioCalculation[]} calculation The given folio calculation.
     */
    constructor(calculation: FolioCalculation) {
        this.sheet = new FolioSvgSheet(calculation.sheet);
        this.systems = new FolioSvgSystems(calculation.systems);
        this.contentItemsArray = [];
        calculation.contentItemsArray.forEach((calculatedContentItem: FolioCalculationContentItem) => {
            this.contentItemsArray.push(new FolioSvgContentItem(calculatedContentItem));
        });
    }
}
