import { FolioSettings } from './folio-settings.model';
import { Folio, FolioContent, FolioSection } from './folio.model';

/**
 * Utility function: round.
 *
 * It rounds a given number to a given number of decimal places.
 * JS in-built round-method is sometimes not correct,
 * see: {@link http://www.jacklmoore.com/notes/rounding-in-javascript/}.
 *
 * @param {number} value The given input value to be rounded.
 * @param {number} decimals The number of decimal places to round to.
 * @returns {number} The rounded number.
 */
function round(value: number, decimals: number): number {
    if (Number.isNaN(value)) {
        return undefined;
    }
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

/**
 * The FolioCalculationPoint class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a point on the folio canvas.
 *
 * Exposed to be used throughout {@link EditionSheetsModule}.
 */
export class FolioCalculationPoint {
    /**
     * The x value (in px) of a point.
     */
    public x: number;

    /**
     * The y value (in px) of a point.
     */
    public y: number;

    /**
     * Constructor of the FolioCalculationPoint class.
     *
     * It initializes the class with values for x and y (in px).
     *
     * @param {number} x The given x value (in px).
     * @param {number} y The given y value (in px).
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Public method: add.
     *
     * It adds x and y values (in px) to an existing point.
     *
     * @param {number} addX Add to x value.
     * @param {number} addY Add to y value.
     */
    public add(addX: number, addY: number): FolioCalculationPoint {
        this.x += addX;
        this.y += addY;
        return this;
    }
}

/**
 * The FolioCalculationLine class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a line on the folio canvas.
 *
 * Exposed to be used throughout {@link EditionSheetsModule}.
 */
export class FolioCalculationLine {
    /**
     * The starting point of a line (FolioCalculationPoint).
     */
    public readonly START_POINT: FolioCalculationPoint;

    /**
     * The ending point of a line (FolioCalculationPoint).
     */
    public readonly END_POINT: FolioCalculationPoint;

    /**
     * Constructor of the FolioCalculationLine class.
     *
     * It initializes the class with two points for start and end.
     *
     * @param {FolioCalculationPoint} startPoint The given starting point.
     * @param {FolioCalculationPoint} endPoint The given ending point.
     */
    constructor(startPoint: FolioCalculationPoint, endPoint: FolioCalculationPoint) {
        this.START_POINT = startPoint;
        this.END_POINT = endPoint;
    }
}

/**
 * The FolioCalculationContentSegmentVertices class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a content segment's vertices on the folio canvas.
 *
 * Not exposed, only called internally from {@link FolioCalculation}.
 */
export class FolioCalculationContentSegmentVertices {
    /**
     * The upper left vertex of a content segment (FolioCalculationPoint).
     */
    public readonly UPPER_LEFT_VERTEX: FolioCalculationPoint;

    /**
     * The upper right vertex of a content segment (FolioCalculationPoint).
     */
    public readonly UPPER_RIGHT_VERTEX: FolioCalculationPoint;

    /**
     * The lower right vertex of a content segment (FolioCalculationPoint).
     */
    public readonly LOWER_RIGHT_VERTEX: FolioCalculationPoint;

    /**
     * The lower left vertex of a content segment (FolioCalculationPoint).
     */
    public readonly LOWER_LEFT_VERTEX: FolioCalculationPoint;

    /**
     * Constructor of the FolioCalculationContentSegmentVertices class.
     *
     * It initializes the class with four points
     * for upper and lower left and upper and lower right vertices.
     *
     * @param {FolioCalculationContentSegment} calculatedContentSegment The given calculated content segment.
     */
    constructor({ startX, startY, endX, endY }: FolioCalculationContentSegment) {
        this.UPPER_LEFT_VERTEX = new FolioCalculationPoint(startX, startY);
        this.UPPER_RIGHT_VERTEX = new FolioCalculationPoint(endX, startY);
        this.LOWER_RIGHT_VERTEX = new FolioCalculationPoint(endX, endY);
        this.LOWER_LEFT_VERTEX = new FolioCalculationPoint(startX, endY);
    }

    /**
     * Public method: getSegmentVertices.
     *
     * It returns the vertices of a content segment as a string.
     *
     * @returns {string} The vertices of a content segment as a string.
     */
    public getSegmentVerticesAsString(): string {
        return [
            this.UPPER_LEFT_VERTEX.x,
            this.UPPER_LEFT_VERTEX.y,
            this.UPPER_RIGHT_VERTEX.x,
            this.UPPER_RIGHT_VERTEX.y,
            this.LOWER_RIGHT_VERTEX.x,
            this.LOWER_RIGHT_VERTEX.y,
            this.LOWER_LEFT_VERTEX.x,
            this.LOWER_LEFT_VERTEX.y,
            this.UPPER_LEFT_VERTEX.x,
            this.UPPER_LEFT_VERTEX.y,
        ].join(' ');
    }
}

/**
 * The FolioCalculationContentSegmentCache class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a content segment cache on the folio canvas.
 *
 * Not exposed, only called internally from {@link FolioCalculation}.
 */
class FolioCalculationContentSegmentCache {
    /**
     * The section of a content segment (FolioSection).
     */
    section: FolioSection;

    /**
     * The vertices of a content segment (FolioCalculationContentSegmentCornerPoints).
     */
    vertices: FolioCalculationContentSegmentVertices;

    constructor() {
        this.section = new FolioSection();
    }
}

/**
 * The FolioCalculationContentSegment class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a content segment on the folio canvas.
 *
 * Exposed to be used throughout {@link EditionSheetsModule}.
 */
export class FolioCalculationContentSegment {
    /**
     * The correction value for the offset of the content segment (number).
     */
    offsetCorrection: number;

    /**
     * The width including offset of the content segment (number).
     */
    widthWithOffset: number;

    /**
     * The width of the content segment (number).
     */
    width: number;

    /**
     * The height of the content segment (number).
     */
    height: number;

    /**
     * The centered X position of the content segment (number).
     */
    centeredXPosition: number;

    /**
     * The centered y position of the content segment (number).
     */
    centeredYPosition: number;

    /**
     * The system range of the content segment (number).
     */
    systemRange: number;

    /**
     * The start position (x-value) of the index of the content segment (number).
     */
    startXIndex: number;

    /**
     * The start position (y-value) of the index of the content segment (number).
     */
    startYIndex: number;

    /**
     * The start position (x-value) of the content segment (number).
     */
    startX: number;

    /**
     * The end position (x-value) of the content segment (number).
     */
    endX: number;

    /**
     * The start position (y-value) of the content segment (number).
     */
    startY: number;

    /**
     * The end position (y-value) of the content segment (number).
     */
    endY: number;

    /**
     * The current content segment (FolioCalculationContentSegmentCache).
     */
    current: FolioCalculationContentSegmentCache;

    /**
     * The previous content segment (FolioCalculationContentSegmentCache).
     */
    previous: FolioCalculationContentSegmentCache;

    /**
     * The vertices of the content segment polygon (string).
     */
    segmentVertices: string;

    /**
     * The label for the id of the edition complex of the content segment (string).
     */
    complexId: string;

    /**
     * The label for the id of the content segment (string).
     */
    sheetId: string;

    /**
     * The array of label strings for the content segment (string[]).
     */
    segmentLabelArray: string[];

    /**
     * The label for the content segment (string).
     */
    segmentLabel: string;

    /**
     * The label for the sigle of the content segment (string).
     */
    sigle: string;

    /**
     * The label for the sigle addendum of the content segment (string).
     */
    sigleAddendum: string;

    /**
     * The boolean flag if the content segment can be selected.
     */
    selectable: boolean;

    /**
     * The boolean flag if the content segment is reversed.
     */
    reversed: boolean;

    /**
     * The link to a convolute description in the critical report.
     */
    linkTo: string;

    /**
     * The section partition of the content segment (number).
     */
    sectionPartition: number;

    constructor() {
        this.previous = new FolioCalculationContentSegmentCache();
        this.current = new FolioCalculationContentSegmentCache();
    }
}

/**
 * The FolioCalculationSheet class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a sheet on the folio canvas.
 *
 * Exposed to be used throughout {@link EditionSheetsModule}.
 */
export class FolioCalculationSheet {
    /**
     * The offset of the sheet (FolioCalculationPoint).
     */
    public readonly OFFSET: FolioCalculationPoint;

    /**
     * The width of the sheet (number).
     */
    public readonly SHEET_WIDTH: number;

    /**
     * The height of the sheet (number).
     */
    public readonly SHEET_HEIGHT: number;

    /**
     * The optional folio id of the sheet (string).
     */
    public readonly FOLIO_ID?: string;

    /**
     * The optional upper left corner point of the sheet (FolioCalculationPoint).
     */
    public readonly UPPER_LEFT_CORNER?: FolioCalculationPoint;

    /**
     * The optional lower right corner point of the sheet (FolioCalculationPoint).
     */
    public readonly LOWER_RIGHT_CORNER?: FolioCalculationPoint;

    /**
     * Constructor of the FolioCalculationSheet class.
     *
     * It initializes the class with values from folio settings, the folio id and zoom factor.
     *
     * @param {FolioSettings} folioSettings The given folio settings.
     * @param {string} folioId The given folio id.
     */
    constructor({ initialOffsetX, initialOffsetY, formatX, formatY, factor }: FolioSettings, folioId: string) {
        this.FOLIO_ID = folioId;
        this.SHEET_WIDTH = formatX * factor;
        this.SHEET_HEIGHT = formatY * factor;
        this.OFFSET = new FolioCalculationPoint(initialOffsetX, initialOffsetY);
        this.UPPER_LEFT_CORNER = this.OFFSET;
        this.LOWER_RIGHT_CORNER = new FolioCalculationPoint(this.SHEET_WIDTH, this.SHEET_HEIGHT);
    }
}

/**
 * The FolioCalculationSystemsMargins class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the margins of the systems on the folio canvas.
 */
class FolioCalculationSystemsMargins {
    /**
     * The left margin factor of the systems (number).
     */
    private static readonly LEFT_MARGIN_FACTOR = 1 / 6;

    /**
     * The right margin factor of the systems (number).
     */
    private static readonly RIGHT_MARGIN_FACTOR = FolioCalculationSystemsMargins.LEFT_MARGIN_FACTOR / 2;

    /**
     * The horizontal margins of the systems (number).
     */
    public readonly HORIZONTAL_MARGINS: number;

    /**
     * The left margin of the systems (number).
     */
    public readonly LEFT_MARGIN: number;

    /**
     * The right margin of the systems (number).
     */
    public readonly RIGHT_MARGIN: number;

    /**
     * The upper margin of the systems (number).
     */
    public readonly UPPER_MARGIN: number;

    /**
     * Constructor of the FolioCalculationSystemsMargins class.
     *
     * It initializes the class with values
     * from the sheet and the number of systems.
     *
     * @param {FolioCalculationSheet} sheet The given calculated folio sheet.
     * @param {number} numberOfSystems The given number of systems.
     */
    constructor(
        private sheet: FolioCalculationSheet,
        private numberOfSystems: number
    ) {
        const UPPER_MARGIN_FACTOR = 1 / (this.numberOfSystems + 2);

        this.UPPER_MARGIN = this._calculateSheetMargin(this.sheet.SHEET_HEIGHT, UPPER_MARGIN_FACTOR);
        this.LEFT_MARGIN = this._calculateSheetMargin(
            this.sheet.SHEET_WIDTH,
            FolioCalculationSystemsMargins.LEFT_MARGIN_FACTOR
        );
        this.RIGHT_MARGIN = this._calculateSheetMargin(
            this.sheet.SHEET_WIDTH,
            FolioCalculationSystemsMargins.RIGHT_MARGIN_FACTOR
        );
        this.HORIZONTAL_MARGINS = this.LEFT_MARGIN + this.RIGHT_MARGIN;
    }

    /**
     * Private method: _calculateSheetWidthMargin.
     *
     * It calculates the width margin of the systems of a folio.
     *
     * @param {number} dimension The given dimension for the margin calculation.
     * @param {number} factor The given factor for the margin calculation.
     * @returns {number} The calculated width margin of the systems.
     */
    private _calculateSheetMargin(dimension: number, factor: number): number {
        return round(dimension * factor, 2);
    }
}

/**
 * The FolioCalculationSystemsDimensions class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the dimensions of the systems on the folio canvas.
 */
class FolioCalculationSystemsDimensions {
    /**
     * The end position (x-value) of the systems (number).
     */
    public readonly END_X: number;

    /**
     * The start position (x-value) of the systems (number).
     */
    public readonly START_X: number;

    /**
     * The start position (y-value) of the systems (number).
     */
    public readonly START_Y: number;

    /**
     * The width of the systems (number).
     */
    public readonly SYSTEMS_WIDTH: number;

    /**
     * Constructor of the FolioCalculationSystemsDimensions class.
     *
     * It initializes the class with values
     * from the sheet and the calculated margins.
     *
     * @param {FolioCalculationSheet} sheet The given calculated folio sheet.
     * @param {FolioCalculationSystemsMargins} systemsMargins The given calculated systems margins.
     */
    constructor(
        private sheet: FolioCalculationSheet,
        private systemsMargins: FolioCalculationSystemsMargins
    ) {
        const { SHEET_WIDTH: WIDTH, UPPER_LEFT_CORNER } = this.sheet;
        const { HORIZONTAL_MARGINS, LEFT_MARGIN, UPPER_MARGIN } = this.systemsMargins;

        this.SYSTEMS_WIDTH = WIDTH - HORIZONTAL_MARGINS;
        this.START_X = UPPER_LEFT_CORNER.x + LEFT_MARGIN;
        this.END_X = this.START_X + this.SYSTEMS_WIDTH;
        this.START_Y = UPPER_LEFT_CORNER.y + UPPER_MARGIN;
    }
}

/**
 * The FolioCalculationSystemsLines class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the lines of the systems on the folio canvas.
 */
class FolioCalculationSystemsLines {
    /**
     * The array of line arrays of the systems (FolioCalculationLine[][]).
     */
    public readonly SYSTEMS_ARRAYS: FolioCalculationLine[][];

    /**
     * Constructor of the FolioCalculationSystemsLines class.
     *
     * It initializes the class with values
     * from the yArray and the calculated dimensions.
     *
     * @param {number[][]} yArray The given y-value array for the systems.
     * @param {FolioCalculationSystemsDimensions} systemsDimensions The given calculated systems dimensions.
     */
    constructor(
        private yArray: number[][],
        private systemsDimensions: FolioCalculationSystemsDimensions
    ) {
        this.SYSTEMS_ARRAYS = this._calculateSystemsArrays();
    }

    /**
     * Private method: calculateSystemsArrays.
     *
     * It calculates the systems arrays.
     *
     * @returns {FolioCalculationLine[][]} The calculated systems arrays.
     */
    private _calculateSystemsArrays(): FolioCalculationLine[][] {
        return this.yArray.map(lineArray => lineArray.map(this._calculateSystemLine));
    }

    /**
     * Private arrow function: _calculateSystemLine.
     *
     * It calculates a single line of a system of a folio.
     *
     * @param {number} line The given line number.
     * @returns {FolioCalculationLine} The calculated line of a system.
     */
    private _calculateSystemLine = (line: number): FolioCalculationLine => {
        const { START_X: startX, END_X: endX } = this.systemsDimensions;
        return new FolioCalculationLine(new FolioCalculationPoint(startX, line), new FolioCalculationPoint(endX, line));
    };
}

/**
 * The FolioCalculationSystemsLabels class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the labels of the systems on the folio canvas.
 */
class FolioCalculationSystemsLabels {
    /**
     * The label x start factor (number).
     */
    private static readonly LABEL_START_X_OFFSET_FACTOR = 0.6;

    /**
     * The label y offset correction factor (number).
     */
    private static readonly LABEL_START_Y_OFFSET_FACTOR = 3;

    /**
     * The line label array of the systems (FolioCalculationPoint[]).
     */
    public readonly SYSTEMS_LABELS_ARRAY: FolioCalculationPoint[];

    /**
     * Constructor of the FolioCalculationSystemsLabels class.
     *
     * It initializes the class with values
     * from the yArray, the calculated margins and dimensions and the zoom factor.
     *
     * @param {number[][]} yArray The given y-value array for the systems.
     * @param {FolioCalculationSystemsMargins} systemsMargins The given calculated systems margins.
     * @param {FolioCalculationSystemsDimensions} systemsDimensions The given calculated systems dimensions.
     * @param {number} zoomFactor The given zoom factor.
     */
    constructor(
        private yArray: number[][],
        private systemsMargins: FolioCalculationSystemsMargins,
        private systemsDimensions: FolioCalculationSystemsDimensions,
        private zoomFactor: number
    ) {
        this.SYSTEMS_LABELS_ARRAY = this._calculateSystemsLabelArray();
    }

    /**
     * Private method: _calculateSystemsLabelArray.
     *
     * It calculates the label array of the systems.
     *
     * @returns {FolioCalculationPoint[]} The calculated label array of the systems.
     */
    private _calculateSystemsLabelArray(): FolioCalculationPoint[] {
        const labelStartX = round(
            this.systemsDimensions.START_X -
                this.systemsMargins.LEFT_MARGIN * FolioCalculationSystemsLabels.LABEL_START_X_OFFSET_FACTOR,
            2
        );
        const labelStartYOffset = round(FolioCalculationSystemsLabels.LABEL_START_Y_OFFSET_FACTOR / this.zoomFactor, 2);

        return this.yArray.map(lineArray => {
            const labelStartY = lineArray[0] - labelStartYOffset;
            return new FolioCalculationPoint(labelStartX, labelStartY);
        });
    }
}

/**
 * The FolioCalculationSystemsYArray class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the y-values of the systems on the folio canvas.
 */
class FolioCalculationSystemsYArray {
    /**
     * The array of y-value arrays for the systems (number).
     */
    public readonly Y_ARRAY: number[][];

    /**
     * Constructor of the FolioCalculationSystemsYArray class.
     *
     * It initializes the class with values
     * from the number of systems, the start position of the systems, the line space factor, the zoom factor and the offset.
     *
     * @param {number} numberOfSystems The given number of systems.
     * @param {number} systemStartY The given start position of the systems.
     * @param {number} lineSpaceFactor The given line space factor.
     * @param {number} zoomFactor The given zoom factor.
     * @param {number} offset The given offset.
     */
    constructor(
        private numberOfSystems: number,
        private systemStartY: number,
        private lineSpaceFactor: number,
        private zoomFactor: number,
        private offset: number
    ) {
        this.Y_ARRAY = this._calculateSystemYArray();
    }

    /**
     * Private method: _calculateSystemYArray.
     *
     * It calculates the array of start positions of the systems of a folio.
     *
     * @returns {number[][]} The array of start position arrays (Y values) for the calculatedSystems.
     */
    private _calculateSystemYArray(): number[][] {
        return Array.from({ length: this.numberOfSystems }, (_, i) => {
            const yStartValue = this._getContentSegmentStart(i);
            return this._calculateSystemLineArray(yStartValue);
        });
    }

    /**
     * Private method: _calculateSystemLineArray.
     *
     * It calculates the start position of the lines per system of a folio.
     *
     * @param {number} y The Y start value of the first line of a system.
     * @returns {number[]} The start position array (Y values) of a system.
     */
    private _calculateSystemLineArray(y: number): number[] {
        if (!y) {
            return undefined;
        }

        // Generate an array with 5 elements, each one being the start value for a line
        return Array.from({ length: 5 }, (_, i) => y + this.lineSpaceFactor * i * this.zoomFactor);
    }

    /**
     * Private method: _getContentSegmentStart.
     *
     * It calculates the start position of a content segment of a folio.
     *
     * @param {number} index The given index position (offset * index -->
     * (X: start at segment 1, 2, 3 etc; Y: start at system line 1, 2, 3 etc.)).
     * @returns {number} The start position for a calculatedContentSegment.
     */
    private _getContentSegmentStart(index: number): number {
        const segmentValue = this.systemStartY + this.offset * index;
        return round(parseFloat(segmentValue.toString()), 2);
    }
}

/**
 * The FolioCalculationSystems class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of the systems on the folio canvas.
 *
 * Exposed to be used throughout {@link EditionSheetsModule}.
 */
export class FolioCalculationSystems {
    /**
     * The line space factor of the systems (number).
     */
    public lineSpaceFactor = 1.5;

    /**
     * The line label array of the systems (FolioCalculationPoint[]).
     */
    public readonly SYSTEMS_LABEL_ARRAY: FolioCalculationPoint[];

    /**
     * The array of line arrays of the systems (FolioCalculationLine[][]).
     */
    public readonly SYSTEMS_ARRAYS: FolioCalculationLine[][];

    /**
     * The calculated margins of the systems (FolioCalculationSystemsMarginCalculator).
     */
    public readonly SYSTEMS_MARGINS: FolioCalculationSystemsMargins;

    /**
     * The calculated dimensions of the systems (FolioCalculationSystemsDimensions).
     */
    public readonly SYSTEMS_DIMENSIONS: FolioCalculationSystemsDimensions;

    /**
     * The array of y-value arrays for the systems (number).
     */
    private readonly Y_ARRAY: number[][];

    /**
     * Constructor of the FolioCalculationSheet class.
     *
     * It initializes the class with values from folio settings, the folio id and zoom factor.
     *
     * @param {FolioCalculationSheet} sheet The given calculated folio sheet.
     * @param {number} numberOfSystems The given number of systems.
     * @param {number} zoomFactor The given zoom factor.
     */
    constructor(
        private sheet: FolioCalculationSheet,
        private numberOfSystems: number,
        private zoomFactor: number
    ) {
        this.SYSTEMS_MARGINS = this._calculateSystemsMargins();
        this.SYSTEMS_DIMENSIONS = this._calculateSystemsDimensions();

        this.Y_ARRAY = this._calculateSystemsYArray().Y_ARRAY;
        this.SYSTEMS_ARRAYS = this._calculateSystemsLines().SYSTEMS_ARRAYS;
        this.SYSTEMS_LABEL_ARRAY = this._calculateSystemsLabels().SYSTEMS_LABELS_ARRAY;
    }

    /**
     * Private method: _calculateSystemsMargins.
     *
     * It calculates the margins of the systems of a folio.
     *
     * @returns {FolioCalculationSystemsMargins} The calculated margins of the systems.
     */
    private _calculateSystemsMargins(): FolioCalculationSystemsMargins {
        return new FolioCalculationSystemsMargins(this.sheet, this.numberOfSystems);
    }

    /**
     * Private method: _calculateSystemsDimensions.
     *
     * It calculates the dimensions of the systems of a folio.
     *
     * @returns {FolioCalculationSystemsDimensions} The calculated dimensions of the systems.
     */
    private _calculateSystemsDimensions(): FolioCalculationSystemsDimensions {
        return new FolioCalculationSystemsDimensions(this.sheet, this.SYSTEMS_MARGINS);
    }

    /**
     * Private method: _calculateSystemsYArray.
     *
     * It calculates the array of start positions of the systems of a folio.
     *
     * @returns {FolioCalculationSystemsYArray} The calculated array of start positions for the systems.
     */
    private _calculateSystemsYArray(): FolioCalculationSystemsYArray {
        return new FolioCalculationSystemsYArray(
            this.numberOfSystems,
            this.SYSTEMS_DIMENSIONS.START_Y,
            this.lineSpaceFactor,
            this.zoomFactor,
            this.SYSTEMS_MARGINS.UPPER_MARGIN
        );
    }

    /**
     * Private method: _calculateSystemsLines.
     *
     * It calculates the lines of the systems of a folio.
     *
     * @returns {FolioCalculationSystemsLines} The calculated lines of the systems.
     */
    private _calculateSystemsLines(): FolioCalculationSystemsLines {
        return new FolioCalculationSystemsLines(this.Y_ARRAY, this.SYSTEMS_DIMENSIONS);
    }

    /**
     * Private method: _calculateSystemsLabels.
     *
     * It calculates the labels of the systems of a folio.
     *
     * @returns {FolioCalculationSystemsLabels} The calculated labels of the systems.
     */
    private _calculateSystemsLabels(): FolioCalculationSystemsLabels {
        return new FolioCalculationSystemsLabels(
            this.Y_ARRAY,
            this.SYSTEMS_MARGINS,
            this.SYSTEMS_DIMENSIONS,
            this.zoomFactor
        );
    }
}

/**
 * The FolioCalculation class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate all the values needed for the folio canvas.
 *
 * Exposed to be used throughout {@link EditionSheetsModule}.
 */
export class FolioCalculation {
    /**
     * The number of systems (number).
     */
    public readonly NUMBER_OF_SYSTEMS: number;

    /**
     * The zoom factor (number).
     */
    public readonly ZOOM_FACTOR: number;

    /**
     * The calculated values for the sheet
     * of a folio (FolioCalculationSheet).
     */
    public sheet: FolioCalculationSheet;

    /**
     * The calculated values for the systems
     * of a folio (FolioCalculationSystems).
     */
    public systems: FolioCalculationSystems;

    /**
     * The calculated values for content segments
     * of a folio (FolioCalculationContentSegment[]).
     */
    public contentSegments: FolioCalculationContentSegment[];

    /**
     * Constructor of the FolioCalculation class.
     *
     * It initializes the class with values from folio settings, folio data and segment offset correction.
     *
     * @param {FolioSettings} folioSettings The given folio settings.
     * @param {Folio} folioData The given folio data.
     * @param {number} [segmentOffsetCorrection] The optional given segment offset correction.
     */
    constructor(
        folioSettings: FolioSettings,
        folioData: Folio,
        private segmentOffsetCorrection: number = 0
    ) {
        this.NUMBER_OF_SYSTEMS = folioData.systems ? parseInt(folioData.systems, 10) : 0;
        this.ZOOM_FACTOR = folioSettings.factor;

        this.sheet = new FolioCalculationSheet(folioSettings, folioData.folioId);
        this.systems = new FolioCalculationSystems(this.sheet, this.NUMBER_OF_SYSTEMS, this.ZOOM_FACTOR);

        this.contentSegments = this._calculateContentSegments(folioData.content);
    }

    private _calculateContentSegments(contents: FolioContent[] = []): FolioCalculationContentSegment[] {
        return contents.map((content: FolioContent) => this._calculateContentSegment(content));
    }

    private _calculateContentSegment(content: FolioContent): FolioCalculationContentSegment {
        const calculatedContentSegment = new FolioCalculationContentSegment();
        this._setOffsetCorrection(calculatedContentSegment);
        this._setSectionPartition(calculatedContentSegment, content);
        this._handleSections(calculatedContentSegment, content);

        return calculatedContentSegment;
    }

    private _setOffsetCorrection(calculatedContentSegment: FolioCalculationContentSegment): void {
        calculatedContentSegment.offsetCorrection = this.segmentOffsetCorrection;
    }

    private _setSectionPartition(
        calculatedContentSegment: FolioCalculationContentSegment,
        content: FolioContent
    ): void {
        calculatedContentSegment.sectionPartition = content.sectionPartition ?? 1;
    }

    private _handleSections(calculatedContentSegment: FolioCalculationContentSegment, content: FolioContent): void {
        if (!content.sections) {
            console.error('No sections array in content', content);
            return;
        }
        if (content.sections.length > calculatedContentSegment.sectionPartition) {
            console.error('Sections array is bigger than sectionPartition');
            return;
        }
        content.sections.forEach((section: FolioSection, _sectionIndex: number) => {
            this._handleSection(calculatedContentSegment, section, content);
        });
    }

    private _handleSection(
        calculatedContentSegment: FolioCalculationContentSegment,
        section: FolioSection,
        content: FolioContent
    ): void {
        this._setContentSegmentSectionCache(calculatedContentSegment, section);
        this._setContentSegmentMainValues(calculatedContentSegment, section, content);
        this._setVertices(calculatedContentSegment);
        this._setOtherProperties(calculatedContentSegment, content);
    }

    private _setVertices(calculatedContentSegment: FolioCalculationContentSegment): void {
        calculatedContentSegment.current.vertices = new FolioCalculationContentSegmentVertices(
            calculatedContentSegment
        );
        calculatedContentSegment.segmentVertices =
            calculatedContentSegment.current.vertices.getSegmentVerticesAsString();
    }

    private _setOtherProperties(
        calculatedContentSegment: FolioCalculationContentSegment,
        { complexId, sheetId, selectable = true, reversed = false, linkTo = '', sigle, sigleAddendum }: FolioContent
    ): void {
        const { segmentLabel, segmentLabelArray, segmentLabelOffset } = this._getSegmentLabelAndOffset(
            sigle,
            sigleAddendum
        );

        const { centeredXPosition, centeredYPosition } = this._calculateCenteredPositions(
            calculatedContentSegment,
            segmentLabelOffset,
            reversed
        );

        Object.assign(calculatedContentSegment, {
            complexId,
            sheetId,
            sigle,
            sigleAddendum,
            selectable: selectable,
            reversed: reversed,
            linkTo: linkTo,
            segmentLabelArray,
            segmentLabel,
            centeredXPosition,
            centeredYPosition,
        });
    }

    private _calculateCenteredPositions(
        calculatedContentSegment: FolioCalculationContentSegment,
        segmentLabelOffset: number,
        reversed: boolean
    ): { centeredXPosition: number; centeredYPosition: number } {
        const { UPPER_LEFT_VERTEX: upperLeftCorner, LOWER_RIGHT_VERTEX: lowerRightCorner } =
            calculatedContentSegment.current.vertices;

        const centeredXPosition = (upperLeftCorner.x + lowerRightCorner.x) / 2;
        const offsetCorrection = reversed ? -segmentLabelOffset : segmentLabelOffset;
        const centeredYPosition = (upperLeftCorner.y + lowerRightCorner.y) / 2 - offsetCorrection;

        return { centeredXPosition, centeredYPosition };
    }

    private _getSegmentLabelAndOffset(
        sigle: string,
        sigleAddendum: string | null
    ): { segmentLabel: string; segmentLabelArray: string[]; segmentLabelOffset: number } {
        const segmentLabelArray = [sigle, sigleAddendum ? ` ${sigleAddendum}` : ''];
        const segmentLabel = segmentLabelArray.join(' ');
        const segmentLabelOffset = sigleAddendum ? 5 : 0;

        return { segmentLabel, segmentLabelArray, segmentLabelOffset };
    }

    /**
     * Private helper method for _calculateContentArray: _setContentSegmentMainValues.
     *
     * It calculates the main values for the content segments of a folio.
     *
     * @param {FolioCalculationContentSegment} calculatedContentSegment The given calculated content segment.
     * @param {FolioSection} section The given section.
     * @param {FolioContent} content The given folio content.
     * @returns {void} Calculates and sets the main values of the calculatedContentSegment.
     */
    private _setContentSegmentMainValues(
        calculatedContentSegment: FolioCalculationContentSegment,
        section: FolioSection,
        content: FolioContent
    ): void {
        if (!calculatedContentSegment) {
            return;
        }

        // SegmentsWidth
        calculatedContentSegment.widthWithOffset = round(
            this.systems.SYSTEMS_DIMENSIONS.SYSTEMS_WIDTH / calculatedContentSegment.sectionPartition,
            2
        );
        calculatedContentSegment.width =
            calculatedContentSegment.widthWithOffset - calculatedContentSegment.offsetCorrection; // OffsetCorrection to avoid horizontal collision between segments

        // SegmentsHeight
        calculatedContentSegment.systemRange = section.endSystem - section.startSystem + 1;
        calculatedContentSegment.height = round(
            this.systems.SYSTEMS_MARGINS.UPPER_MARGIN * calculatedContentSegment.systemRange -
                calculatedContentSegment.offsetCorrection,
            2
        ); // OffsetCorrection to avoid vertical collision between segments

        // Find segment start indices
        calculatedContentSegment.startYIndex = section.startSystem - 1;
        calculatedContentSegment.startXIndex = 0;
        // Check if position exists ...
        if (section.position) {
            const position: number = section.position;
            if (position > calculatedContentSegment.sectionPartition) {
                // ... and is bigger than number of sections
                // Index remains 0
                console.error(
                    'Assuming position 1 because current position is bigger than number of sections for segment ',
                    content
                );
            } else if (calculatedContentSegment.sectionPartition > 1) {
                // ... or is smaller or equal to number of sections which is bigger 1
                // Than index is position - 1 (positions go from 1, 2, 3 to n)
                calculatedContentSegment.startXIndex = position - 1;
            }
        }
        // For other cases index remains 0 (default)

        // SegmentsStartX
        // WidthWithOffset * startXIndex
        // Add half the offsetCorrection to systemStartX to center segments
        calculatedContentSegment.startX = this._getContentSegmentStart(
            calculatedContentSegment.widthWithOffset,
            calculatedContentSegment.startXIndex,
            this.systems.SYSTEMS_DIMENSIONS.START_X,
            calculatedContentSegment.offsetCorrection / 2
        );
        calculatedContentSegment.endX = round(calculatedContentSegment.startX + calculatedContentSegment.width, 2);

        // SegmentsStartY
        // Subtract half the offsetCorrection from systemStartY to center segments
        calculatedContentSegment.startY = this._getContentSegmentStart(
            this.systems.SYSTEMS_MARGINS.UPPER_MARGIN,
            calculatedContentSegment.startYIndex,
            this.systems.SYSTEMS_DIMENSIONS.START_Y,
            -calculatedContentSegment.offsetCorrection / 2
        );
        calculatedContentSegment.endY = round(calculatedContentSegment.startY + calculatedContentSegment.height, 2);
    }

    /**
     * Private method: _setContentSegmentSectionCache.
     *
     * It caches the current and previous section of a calculated content segment.
     *
     * @param {FolioCalculationContentSegment} calculatedContentSegment The given calculated content segment.
     * @param {FolioSection} section The given section.
     * @returns {void} Caches the current and previous section of the calculatedContentSegment.
     */
    private _setContentSegmentSectionCache(
        calculatedContentSegment: FolioCalculationContentSegment,
        section: FolioSection
    ): void {
        if (!calculatedContentSegment) {
            return;
        }

        if (calculatedContentSegment.current['section']) {
            calculatedContentSegment.previous.section = calculatedContentSegment.current.section;
            calculatedContentSegment.previous.vertices = calculatedContentSegment.current.vertices;
        }
        calculatedContentSegment.current.section = section;
    }

    /**
     * Private helper method for _calculateContentArray: _getContentSegmentStart.
     *
     * It calculates the start position of a content segment of a folio.
     *
     * @param {number} offset The given offset.
     * @param {number} index The given index position (offset * index -->
     * (X: start at segment 1, 2, 3 etc; Y: start at system line 1, 2, 3 etc.)).
     * @param {number} systemStart The given horizontal(X) or vertical (Y) systemsMargins.
     * @param {number} [offsetCorrection] The optional given offset correction value (mostly needed to center segments).
     * @returns {number} The start position for a calculatedContentSegment.
     */
    private _getContentSegmentStart(
        offset: number,
        index: number,
        systemStart: number,
        offsetCorrection: number = 0
    ): number {
        const segmentValue = systemStart + offset * index + offsetCorrection;
        return round(parseFloat(segmentValue.toString()), 2);
    }
}
