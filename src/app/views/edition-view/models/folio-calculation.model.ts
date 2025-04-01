import { FolioSettings } from './folio-settings.model';
import { Folio, FolioContent, FolioSegment } from './folio.model';

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
     * The starting point of a line.
     */
    public readonly START_POINT: FolioCalculationPoint;

    /**
     * The ending point of a line.
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
 * The FolioCalculationRectangle class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a rectangle on the folio canvas.
 *
 * Exposed to be used throughout {@link EditionSheetsModule}.
 */
export class FolioCalculationRectangle {
    /**
     * The upper left corner of a rectangle.
     */
    public readonly UPPER_LEFT_CORNER: FolioCalculationPoint;

    /**
     * The lower right corner of a rectangle.
     */
    public readonly LOWER_RIGHT_CORNER: FolioCalculationPoint;

    /**
     * Constructor of the FolioCalculationRectangle class.
     *
     * It initializes the class with two points for upper left and lower right corner.
     *
     * @param {FolioCalculationPoint} upperLeftCorner The given upper left corner.
     * @param {FolioCalculationPoint} lowerRightCorner The given lower right corner.
     */
    constructor(upperLeftCorner: FolioCalculationPoint, lowerRightCorner: FolioCalculationPoint) {
        this.UPPER_LEFT_CORNER = upperLeftCorner;
        this.LOWER_RIGHT_CORNER = lowerRightCorner;
    }
}

/**
 * The FolioCalculationContentSegmentCenteredPositions class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the centered positions of a content segment on the folio canvas.
 *
 * Not exposed, only called internally from {@link FolioCalculation}.
 */
class FolioCalculationContentSegmentCenteredPositions {
    /**
     * The centered X position of the content segment.
     */
    public readonly CENTERED_X_POSITION: number;

    /**
     * The centered Y position of the content segment.
     */
    public readonly CENTERED_Y_POSITION: number;

    /**
     * Constructor of the FolioCalculationContentSegmentCenteredPositions class.
     *
     * It initializes the class with values
     * from the segment vertices, the segment label offset and the reversed flag.
     *
     * @param {FolioCalculationContentSegmentVertices} segmentVertices The given segment vertices.
     * @param {number} segmentLabelOffset The given segment label offset.
     * @param {boolean} reversed The given reversed flag.
     */
    constructor(
        segmentVertices: FolioCalculationContentSegmentVertices,
        segmentLabelOffset: number,
        reversed: boolean
    ) {
        const { UPPER_LEFT_VERTEX, LOWER_RIGHT_VERTEX } = segmentVertices;

        this.CENTERED_X_POSITION = (UPPER_LEFT_VERTEX.x + LOWER_RIGHT_VERTEX.x) / 2;
        const offsetCorrection = reversed ? -segmentLabelOffset : segmentLabelOffset;
        this.CENTERED_Y_POSITION = (UPPER_LEFT_VERTEX.y + LOWER_RIGHT_VERTEX.y) / 2 - offsetCorrection;
    }
}

/**
 * The FolioCalculationContentSegmentCenteredPositions class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the centered positions of the content segments on the folio canvas.
 */
class FolioCalculationContentSegmentLabel {
    /**
     * The label for the content segment.
     */
    public readonly SEGMENT_LABEL: string;

    /**
     * The array of label strings for the content segment.
     */
    public readonly SEGMENT_LABEL_ARRAY: string[];

    /**
     * The label offset for the content segment.
     */
    public readonly SEGMENT_LABEL_OFFSET: number;

    /**
     * Constructor of the FolioCalculationContentSegmentLabelAndOffset class.
     *
     * It initializes the class with values
     * from the sigle and sigle addendum of the content segment.
     *
     * @param {string} sigle The given sigle of the content segment.
     * @param {string | null} sigleAddendum The given sigle addendum of the content segment.
     */
    constructor(sigle: string, sigleAddendum: string | null) {
        this.SEGMENT_LABEL_ARRAY = [sigle, sigleAddendum ? ` ${sigleAddendum}` : ''];
        this.SEGMENT_LABEL = this.SEGMENT_LABEL_ARRAY.join(' ');
        this.SEGMENT_LABEL_OFFSET = sigleAddendum ? 5 : 0;
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
     * The upper left vertex of a content segment.
     */
    public readonly UPPER_LEFT_VERTEX: FolioCalculationPoint;

    /**
     * The upper right vertex of a content segment.
     */
    public readonly UPPER_RIGHT_VERTEX: FolioCalculationPoint;

    /**
     * The lower right vertex of a content segment.
     */
    public readonly LOWER_RIGHT_VERTEX: FolioCalculationPoint;

    /**
     * The lower left vertex of a content segment.
     */
    public readonly LOWER_LEFT_VERTEX: FolioCalculationPoint;

    /**
     * The vertices of a content segment as a string.
     */
    public readonly VERTICES_AS_STRING: string;

    /**
     * Constructor of the FolioCalculationContentSegmentVertices class.
     *
     * It initializes the class with four points
     * for upper and lower left and upper and lower right vertices.
     *
     * @param {FolioSegment} segment The given segment of the folio content.
     * @param {FolioCalculationSystems} _systems The given calculated systems.
     * @param {number} _segmentSplit The given segment split.
     * @param {number} _segmentOffsetCorrection The given segment offset correction.
     */
    constructor(
        segment: FolioSegment,
        private readonly _systems: FolioCalculationSystems,
        private readonly _segmentSplit: number,
        private readonly _segmentOffsetCorrection: number
    ) {
        const { startX, startY, endX, endY } = this._calculateVertices(segment);

        this.UPPER_LEFT_VERTEX = new FolioCalculationPoint(startX, startY);
        this.UPPER_RIGHT_VERTEX = new FolioCalculationPoint(endX, startY);
        this.LOWER_RIGHT_VERTEX = new FolioCalculationPoint(endX, endY);
        this.LOWER_LEFT_VERTEX = new FolioCalculationPoint(startX, endY);
        this.VERTICES_AS_STRING = this._getSegmentVerticesAsString();
    }

    /**
     * Private method: _calculateVertices.
     *
     * It calculates the vertices of a content segment.
     *
     * @param {FolioSegment} segment The given segment of the folio content.
     * @returns {FolioCalculationPoint} The calculated vertices of a content segment.
     */
    private _calculateVertices(segment: FolioSegment): { startX: number; startY: number; endX: number; endY: number } {
        const startX = this._calculateX(segment, true);
        const endX = this._calculateX(segment, false);
        const startY = this._calculateY(segment, true);
        const endY = this._calculateY(segment, false);

        return { startX, startY, endX, endY };
    }

    /**
     * Private method: _calculateX.
     *
     * It calculates the x value of the content segment vertices.
     *
     * @param {FolioSegment} segment The given segment of the folio content.
     * @param {boolean} isStart The given flag if the x value is for the start.
     * @returns {number} The calculated the content segment vertices.
     */
    private _calculateX(segment: FolioSegment, isStart: boolean): number {
        const width = round(this._systems.SYSTEMS_DIMENSIONS.SYSTEMS_WIDTH / this._segmentSplit, 2);

        const systemIndex = segment.position && segment.position <= this._segmentSplit ? segment.position - 1 : 0;
        const baseX = this._systems.SYSTEMS_DIMENSIONS.START_X;
        const offset = this._segmentOffsetCorrection / 2;

        const xValue = baseX + systemIndex * width + offset;
        const correction = isStart ? 0 : width - this._segmentOffsetCorrection;

        return round(xValue + correction, 2);
    }

    /**
     * Private method: _calculateY.
     *
     * It calculates the y value of the content segment vertices.
     *
     * @param {FolioSegment} segment The given segment of the folio content.
     * @param {boolean} isStart The given flag if the y value is for the start.
     * @returns {number} The calculated y value of the content segment vertices.
     */
    private _calculateY(segment: FolioSegment, isStart: boolean): number {
        let systemIndex = isStart ? segment.startSystem - 1 : segment.endSystem - 1;
        // Reverse order of the system index if the systems are reversed
        if (this._systems.SYSTEMS_REVERSED) {
            systemIndex = this._systems.SYSTEMS_LINES.SYSTEMS_ARRAYS.length - 1 - systemIndex;
        }
        const systemLines = this._systems.SYSTEMS_LINES.SYSTEMS_ARRAYS[systemIndex];

        let offset: number;
        switch (segment.relativeToSystem) {
            case 'below':
                offset = 20;
                break;
            case 'above':
                offset = -20;
                break;
            default:
                offset = 0;
        }

        const yValue = isStart ? systemLines.at(0).START_POINT.y : systemLines.at(-1).END_POINT.y;
        const correction = this._segmentOffsetCorrection * (isStart ? -1 : 1) + offset;

        return round(yValue + correction, 2);
    }

    /**
     * Private method: getSegmentVerticesAsString.
     *
     * It returns the vertices of a content segment as a string.
     *
     * @returns {string} The vertices of a content segment as a string.
     */
    private _getSegmentVerticesAsString(): string {
        const vertices = [
            this.UPPER_LEFT_VERTEX,
            this.UPPER_RIGHT_VERTEX,
            this.LOWER_RIGHT_VERTEX,
            this.LOWER_LEFT_VERTEX,
            this.UPPER_LEFT_VERTEX,
        ];

        return vertices.map(vertex => `${vertex.x} ${vertex.y}`).join(' ');
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
     * The centered X position of the content segment.
     */
    centeredXPosition: number;

    /**
     * The centered y position of the content segment.
     */
    centeredYPosition: number;

    /**
     * The label for the id of the edition complex of the content segment.
     */
    complexId: string;

    /**
     * The link to a convolute description in the critical report.
     */
    linkTo: string;

    /**
     * The boolean flag if the content segment is reversed.
     */
    reversed: boolean;

    /**
     * The segment of a content segment.
     */
    segment: FolioSegment;

    /**
     * The segment split of the content segment.
     */
    segmentSplit: number;

    /**
     * The array of label strings for the content segment.
     */
    segmentLabelArray: string[];

    /**
     * The label for the content segment.
     */
    segmentLabel: string;

    /**
     * The boolean flag if the content segment can be selected.
     */
    selectable: boolean;

    /**
     * The label for the id of the content segment.
     */
    sheetId: string;

    /**
     * The label for the sigle of the content segment.
     */
    sigle: string;

    /**
     * The label for the sigle addendum of the content segment.
     */
    sigleAddendum: string;

    /**
     * The vertices of a content segment.
     */
    vertices: FolioCalculationContentSegmentVertices;

    /**
     * Constructor of the FolioCalculationContentSegment class.
     *
     * It initializes the class with values from the content segment,
     * the calculated systems and the segment offset correction.
     *
     * @param {FolioContent} content The given content segment.
     * @param {FolioCalculationSystems} _systems The given calculated systems.
     * @param {number} _segmentOffsetCorrection The given segment offset correction.
     */
    constructor(
        content: FolioContent,
        private readonly _systems: FolioCalculationSystems,
        private readonly _segmentOffsetCorrection: number
    ) {
        this.segmentSplit = content.segmentSplit ?? 1;

        this._getContentSegments(content);
    }

    /**
     * Private method: _getContentSegments.
     *
     * It gets the segments of a given folio content.
     *
     * @param {FolioContent} content The given folio content.
     * @returns {void} Gets the segments of a given folio content.
     */
    private _getContentSegments(content: FolioContent): void {
        if (!content.segments) {
            console.error('No segments array in content', content);
            return;
        }
        if (content.segments.length > this.segmentSplit) {
            console.error('Segments array is bigger than segmentSplit');
            return;
        }
        if (this._systems.NUMBER_OF_SYSTEMS === 0) {
            console.error('No systems in folio');
            return;
        }
        content.segments.forEach((segment: FolioSegment) => {
            this._setProperties(content, segment);
        });
    }

    /**
     * Private method: setProperties.
     *
     * It sets the properties of a content segment.
     *
     * @param {FolioContent} content The given folio content.
     * @param {FolioSegment} segment The given segment of the folio content.
     * @returns {void} Sets the properties of a content segment.
     */
    private _setProperties(content: FolioContent, segment: FolioSegment): void {
        const { complexId, sheetId, selectable = true, reversed = false, linkTo = '', sigle, sigleAddendum } = content;

        this.segment = segment;

        const label = new FolioCalculationContentSegmentLabel(sigle, sigleAddendum);

        this.vertices = new FolioCalculationContentSegmentVertices(
            segment,
            this._systems,
            this.segmentSplit,
            this._segmentOffsetCorrection
        );

        const centeredPositions = new FolioCalculationContentSegmentCenteredPositions(
            this.vertices,
            label.SEGMENT_LABEL_OFFSET,
            reversed
        );

        Object.assign(this, {
            complexId,
            sheetId,
            sigle,
            sigleAddendum,
            selectable: selectable,
            reversed: reversed,
            linkTo: linkTo,
            segmentLabelArray: label.SEGMENT_LABEL_ARRAY,
            segmentLabel: label.SEGMENT_LABEL,
            centeredXPosition: centeredPositions.CENTERED_X_POSITION,
            centeredYPosition: centeredPositions.CENTERED_Y_POSITION,
        });
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
     * The folio id of the sheet.
     */
    public readonly FOLIO_ID: string;

    /**
     * The width of the sheet.
     */
    public readonly SHEET_WIDTH: number;

    /**
     * The height of the sheet.
     */
    public readonly SHEET_HEIGHT: number;

    /**
     * The rectangle of the sheet.
     */
    public readonly SHEET_RECTANGLE: FolioCalculationRectangle;

    /**
     * The optional rectangle of the trademark on the sheet.
     */
    public readonly TRADEMARK_RECTANGLE?: FolioCalculationRectangle;

    /**
     * Constructor of the FolioCalculationSheet class.
     *
     * It initializes the class with values from folio settings, the folio id and zoom factor.
     *
     * @param {FolioSettings} folioSettings The given folio settings.
     * @param {string} folioId The given folio id.
     * @param {string} trademarkPosition The optional given trademark position.
     */
    constructor(
        { initialOffsetX, initialOffsetY, formatX, formatY, factor }: FolioSettings,
        folioId: string,
        trademarkPosition?: string
    ) {
        this.FOLIO_ID = folioId;
        this.SHEET_WIDTH = formatX * factor;
        this.SHEET_HEIGHT = formatY * factor;
        const sheetUpperLeftCorner = new FolioCalculationPoint(initialOffsetX, initialOffsetY);
        const sheetLowerRightCorner = new FolioCalculationPoint(this.SHEET_WIDTH, this.SHEET_HEIGHT);
        this.SHEET_RECTANGLE = new FolioCalculationRectangle(sheetUpperLeftCorner, sheetLowerRightCorner);
        this.TRADEMARK_RECTANGLE = this._calculateTrademarkRectangle(trademarkPosition);
    }

    /**
     * Private method: _calculateTrademarkRectangle.
     *
     * It calculates the rectanble of the trademark based on the given position string.
     *
     * @param {string} position The given trademark position string.
     * @returns {FolioCalculationRectangle} The calculated rectangle of the trademark.
     */
    private _calculateTrademarkRectangle(position: string): FolioCalculationRectangle {
        if (!position) {
            return undefined;
        }

        const trademarkRectangleWidth = 20;
        const trademarkRectangleHeight = 30;
        const marginOffset = 10;

        let x1: number, y1: number;

        switch (position) {
            case 'unten links':
                x1 = this.SHEET_RECTANGLE.UPPER_LEFT_CORNER.x + marginOffset;
                y1 = this.SHEET_RECTANGLE.LOWER_RIGHT_CORNER.y - marginOffset - trademarkRectangleHeight;

                break;
            case 'unten rechts':
                x1 = this.SHEET_RECTANGLE.LOWER_RIGHT_CORNER.x - marginOffset - trademarkRectangleWidth;
                y1 = this.SHEET_RECTANGLE.LOWER_RIGHT_CORNER.y - marginOffset - trademarkRectangleHeight;

                break;
            case 'oben links':
                x1 = this.SHEET_RECTANGLE.UPPER_LEFT_CORNER.x + marginOffset;
                y1 = this.SHEET_RECTANGLE.UPPER_LEFT_CORNER.y + marginOffset;

                break;
            case 'oben rechts':
                x1 = this.SHEET_RECTANGLE.LOWER_RIGHT_CORNER.x - marginOffset - trademarkRectangleWidth;
                y1 = this.SHEET_RECTANGLE.UPPER_LEFT_CORNER.y + marginOffset;

                break;
            default:
                x1 = 0;
                y1 = 0;
        }

        const x2: number = x1 + trademarkRectangleWidth;
        const y2: number = y1 + trademarkRectangleHeight;

        return new FolioCalculationRectangle(new FolioCalculationPoint(x1, y1), new FolioCalculationPoint(x2, y2));
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
     * The horizontal margin factor of the systems.
     */
    private static readonly HORIZONTAL_MARGIN_FACTOR = 1 / 6;

    /**
     * The vertical margin factor of the systems.
     */
    private static readonly VERTICAL_MARGIN_FACTOR = 0.05;

    /**
     * The vertical margin offset of the systems.
     */
    private static readonly VERTICAL_MARGIN_OFFSET = 25;

    /**
     * The horizontal margins of the systems.
     */
    public readonly HORIZONTAL_MARGINS: number;

    /**
     * The left margin of the systems.
     */
    public readonly LEFT_MARGIN: number;

    /**
     * The lower margin of the systems.
     */
    public readonly LOWER_MARGIN: number;

    /**
     * The right margin of the systems.
     */
    public readonly RIGHT_MARGIN: number;

    /**
     * The upper margin of the systems.
     */
    public readonly UPPER_MARGIN: number;

    /**
     * The vertical margins of the systems.
     */
    public readonly VERTICAL_MARGINS: number;

    /**
     * Constructor of the FolioCalculationSystemsMargins class.
     *
     * It initializes the class with values
     * from the sheet and the number of systems.
     *
     * @param {FolioCalculationSheet} _sheet The given calculated folio sheet.
     */
    constructor(private readonly _sheet: FolioCalculationSheet) {
        this.UPPER_MARGIN = this._calculateSheetMargin(
            this._sheet.SHEET_HEIGHT,
            FolioCalculationSystemsMargins.VERTICAL_MARGIN_FACTOR
        );
        this.UPPER_MARGIN += FolioCalculationSystemsMargins.VERTICAL_MARGIN_OFFSET;
        this.LOWER_MARGIN = this.UPPER_MARGIN;

        this.LEFT_MARGIN = this._calculateSheetMargin(
            this._sheet.SHEET_WIDTH,
            FolioCalculationSystemsMargins.HORIZONTAL_MARGIN_FACTOR
        );
        this.RIGHT_MARGIN = this._calculateSheetMargin(
            this._sheet.SHEET_WIDTH,
            FolioCalculationSystemsMargins.HORIZONTAL_MARGIN_FACTOR / 2
        );

        this.HORIZONTAL_MARGINS = this.LEFT_MARGIN + this.RIGHT_MARGIN;
        this.VERTICAL_MARGINS = this.UPPER_MARGIN + this.LOWER_MARGIN;
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
     * The end position (x-value) of the systems.
     */
    public readonly END_X: number;

    /**
     * The end position (y-value) of the systems.
     */
    public readonly END_Y: number;

    /**
     * The start position (x-value) of the systems.
     */
    public readonly START_X: number;

    /**
     * The start position (y-value) of the systems.
     */
    public readonly START_Y: number;

    /**
     * The width of the systems.
     */
    public readonly SYSTEMS_WIDTH: number;

    /**
     * The height of the systems.
     */
    public readonly SYSTEMS_HEIGHT: number;

    /**
     * Constructor of the FolioCalculationSystemsDimensions class.
     *
     * It initializes the class with values
     * from the sheet and the calculated margins.
     *
     * @param {FolioCalculationSheet} _sheet The given calculated folio sheet.
     * @param {FolioCalculationSystemsMargins} _systemsMargins The given calculated systems margins.
     */
    constructor(
        private readonly _sheet: FolioCalculationSheet,
        private readonly _systemsMargins: FolioCalculationSystemsMargins
    ) {
        const { SHEET_WIDTH, SHEET_HEIGHT, SHEET_RECTANGLE } = this._sheet;
        const { HORIZONTAL_MARGINS, VERTICAL_MARGINS, LEFT_MARGIN, UPPER_MARGIN } = this._systemsMargins;

        this.SYSTEMS_WIDTH = SHEET_WIDTH - HORIZONTAL_MARGINS;
        this.SYSTEMS_HEIGHT = SHEET_HEIGHT - VERTICAL_MARGINS;

        this.START_X = SHEET_RECTANGLE.UPPER_LEFT_CORNER.x + LEFT_MARGIN;
        this.START_Y = SHEET_RECTANGLE.UPPER_LEFT_CORNER.y + UPPER_MARGIN;

        this.END_X = this.START_X + this.SYSTEMS_WIDTH;
        this.END_Y = this.START_Y + this.SYSTEMS_HEIGHT;
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
     * The array of line arrays of the systems.
     */
    public readonly SYSTEMS_ARRAYS: FolioCalculationLine[][];

    /**
     * Constructor of the FolioCalculationSystemsLines class.
     *
     * It initializes the class with values
     * from the yArray and the calculated dimensions.
     *
     * @param {number[][]} _yArray The given y-value array for the systems.
     * @param {FolioCalculationSystemsDimensions} _systemsDimensions The given calculated systems dimensions.
     */
    constructor(
        private readonly _yArray: number[][],
        private readonly _systemsDimensions: FolioCalculationSystemsDimensions
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
        return this._yArray.map(lineArray => lineArray.map(this._calculateSystemLine));
    }

    /**
     * Private readonly arrow function: _calculateSystemLine.
     *
     * It calculates a single line of a system of a folio.
     *
     * @param {number} line The given line number.
     * @returns {FolioCalculationLine} The calculated line of a system.
     */
    private readonly _calculateSystemLine = (line: number): FolioCalculationLine => {
        const { START_X, END_X } = this._systemsDimensions;
        return new FolioCalculationLine(
            new FolioCalculationPoint(START_X, line),
            new FolioCalculationPoint(END_X, line)
        );
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
     * The label x start factor.
     */
    private static readonly LABEL_START_X_OFFSET_FACTOR = 0.6;

    /**
     * The label y offset correction factor.
     */
    private static readonly LABEL_START_Y_OFFSET_FACTOR = 3;

    /**
     * The line label array of the systems.
     */
    public readonly SYSTEMS_LABELS_ARRAY: FolioCalculationPoint[];

    /**
     * Constructor of the FolioCalculationSystemsLabels class.
     *
     * It initializes the class with values
     * from the yArray, the calculated margins and dimensions and the zoom factor.
     *
     * @param {number[][]} _yArray The given y-value array for the systems.
     * @param {FolioCalculationSystemsMargins} _systemsMargins The given calculated systems margins.
     * @param {FolioCalculationSystemsDimensions} _systemsDimensions The given calculated systems dimensions.
     * @param {number} _zoomFactor The given zoom factor.
     */
    constructor(
        private readonly _yArray: number[][],
        private readonly _systemsMargins: FolioCalculationSystemsMargins,
        private readonly _systemsDimensions: FolioCalculationSystemsDimensions,
        private readonly _zoomFactor: number
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
            this._systemsDimensions.START_X -
                this._systemsMargins.LEFT_MARGIN * FolioCalculationSystemsLabels.LABEL_START_X_OFFSET_FACTOR,
            2
        );
        const labelStartYOffset = round(
            FolioCalculationSystemsLabels.LABEL_START_Y_OFFSET_FACTOR / this._zoomFactor,
            2
        );

        return this._yArray.map(lineArray => {
            const labelStartY = lineArray[0] - labelStartYOffset;
            return new FolioCalculationPoint(labelStartX, labelStartY);
        });
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
     * The line space factor of the systems.
     */
    public lineSpaceFactor = 1.5;

    /**
     * The number of systems.
     */
    public readonly NUMBER_OF_SYSTEMS: number;

    /**
     * The flag if the systems are reversed
     */
    public readonly SYSTEMS_REVERSED: boolean;

    /**
     * The labels of the systems.
     */
    public readonly SYSTEMS_LABELS: FolioCalculationSystemsLabels;

    /**
     * The lines of the systems.
     */
    public readonly SYSTEMS_LINES: FolioCalculationSystemsLines;

    /**
     * The calculated margins of the systems.
     */
    public readonly SYSTEMS_MARGINS: FolioCalculationSystemsMargins;

    /**
     * The calculated dimensions of the systems.
     */
    public readonly SYSTEMS_DIMENSIONS: FolioCalculationSystemsDimensions;

    /**
     * The zoom factor.
     */
    public readonly ZOOM_FACTOR: number;

    /**
     * Constructor of the FolioCalculationSystems class.
     *
     * It initializes the class with values
     * from the calculated folio sheet, the systems string and the zoom factor.
     *
     * @param {FolioCalculationSheet} sheet The given calculated folio sheet.
     * @param {string} systems The given systems string.
     * @param {boolean} systemsReversed The given reversed flag.
     * @param {number} factor The given zoom factor.
     */
    constructor(sheet: FolioCalculationSheet, systems: string, systemsReversed: boolean = false, factor: number) {
        this.NUMBER_OF_SYSTEMS = systems ? parseInt(systems, 10) : 0;
        this.SYSTEMS_REVERSED = systemsReversed;
        this.ZOOM_FACTOR = factor;

        this.SYSTEMS_MARGINS = new FolioCalculationSystemsMargins(sheet);
        this.SYSTEMS_DIMENSIONS = new FolioCalculationSystemsDimensions(sheet, this.SYSTEMS_MARGINS);

        const Y_ARRAY = this._calculateSystemYArray();
        this.SYSTEMS_LINES = new FolioCalculationSystemsLines(Y_ARRAY, this.SYSTEMS_DIMENSIONS);
        this.SYSTEMS_LABELS = new FolioCalculationSystemsLabels(
            Y_ARRAY,
            this.SYSTEMS_MARGINS,
            this.SYSTEMS_DIMENSIONS,
            this.ZOOM_FACTOR
        );
    }

    /**
     * Private method: _calculateSystemYArray.
     *
     * It calculates the array of start positions of the systems of a folio.
     *
     * @returns {number[][]} The array of start position arrays (Y values) for the calculatedSystems.
     */
    private _calculateSystemYArray(): number[][] {
        const spacePerSystem = this.SYSTEMS_DIMENSIONS.SYSTEMS_HEIGHT / this.NUMBER_OF_SYSTEMS;
        const array = Array.from({ length: this.NUMBER_OF_SYSTEMS }, (_, i) => {
            const yStartValue = round(this.SYSTEMS_DIMENSIONS.START_Y + i * spacePerSystem, 2);
            return this._calculateSystemLineArray(yStartValue);
        });
        return array;
    }

    /**
     * Private method: _calculateSystemLineArray.
     *
     * It calculates the start position of the 5 lines per system of a folio.
     *
     * @param {number} y The Y start value of the first line of a system.
     * @returns {number[]} The start position array (Y values) of a system.
     */
    private _calculateSystemLineArray(y: number): number[] {
        const NUMBER_OF_LINES = 5;
        return Array.from({ length: NUMBER_OF_LINES }, (_, i) => y + i * this.lineSpaceFactor * this.ZOOM_FACTOR);
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
     * The calculated values for the sheet of a folio.
     */
    public readonly SHEET: FolioCalculationSheet;

    /**
     * The calculated values for the systems of a folio.
     */
    public readonly SYSTEMS: FolioCalculationSystems;

    /**
     * The calculated values for content segments of a folio.
     */
    public readonly CONTENT_SEGMENTS: FolioCalculationContentSegment[];

    /**
     * Constructor of the FolioCalculation class.
     *
     * It initializes the class with values from folio settings, folio data and segment offset correction.
     *
     * @param {FolioSettings} folioSettings The given folio settings.
     * @param {Folio} folioData The given folio data.
     * @param {number} [segmentOffsetCorrection] The optional given segment offset correction.
     */
    constructor(folioSettings: FolioSettings, folioData: Folio, segmentOffsetCorrection: number = 0) {
        this.SHEET = new FolioCalculationSheet(folioSettings, folioData.folioId, folioData.trademarkPosition);
        this.SYSTEMS = new FolioCalculationSystems(
            this.SHEET,
            folioData.systems,
            folioData.reversed,
            folioSettings.factor
        );
        this.CONTENT_SEGMENTS = folioData.content.map(
            (content: FolioContent) =>
                new FolioCalculationContentSegment(content, this.SYSTEMS, segmentOffsetCorrection)
        );
    }
}
