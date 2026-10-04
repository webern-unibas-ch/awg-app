import { Folio, FolioContent, FolioSegment } from './folio.model';
import { ViewBox } from './view-box.model';

/**
 * The FolioSettings interface.
 *
 * It is used in the context of the edition folio convolutes
 * to store the basic settings (format, zoom factor, offsets)
 * for the calculation of a folio.
 */
export interface FolioSettings {
    /**
     * The zoom factor to be applied.
     */
    factor: number;

    /**
     * The x value (width) of the folio format.
     */
    formatX: number;

    /**
     * The y value (height) of the folio format.
     */
    formatY: number;

    /**
     * The initial offset (x-position) to be applied.
     */
    initialOffsetX: number;

    /**
     * The initial offset (y-position) to be applied.
     */
    initialOffsetY: number;
}

/**
 * Constant: FOLIO_DEFAULT_NUMBER_OF_SYSTEMS.
 *
 * It keeps the default number of systems of a folio
 * (reference for the content segment offset correction and stroke width).
 */
export const FOLIO_DEFAULT_NUMBER_OF_SYSTEMS = 18;

/**
 * Constants for the calculation of the systems.
 */
const SYSTEM_NUMBER_OF_LINES = 5;
const SYSTEM_LINE_SPACE_FACTOR = 1.5;
const SYSTEMS_HORIZONTAL_MARGIN_FACTOR = 1 / 6;
const SYSTEMS_VERTICAL_MARGIN_FACTOR = 0.05;
const SYSTEMS_VERTICAL_MARGIN_OFFSET = 25;
const SYSTEMS_LABEL_X_OFFSET_FACTOR = 0.6;
const SYSTEMS_LABEL_Y_OFFSET_FACTOR = 3;

/**
 * Constants for the calculation of the trademark.
 */
const TRADEMARK_WIDTH = 20;
const TRADEMARK_HEIGHT = 30;
const TRADEMARK_MARGIN = 10;

/**
 * Constants for the calculation of the content segments.
 */
const CONTENT_SEGMENT_RELATIVE_TO_SYSTEM_OFFSET = 20;
const CONTENT_SEGMENT_LABEL_ADDENDUM_OFFSET = 5;

/**
 * Type: ValidFolioContent.
 *
 * A folio content with its segments (checked by {@link isValidFolioContent}).
 */
type ValidFolioContent = FolioContent & { segments: FolioSegment[] };

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
        return Number.NaN;
    }
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

/**
 * The FolioCalculationPoint class.
 *
 * It is used in the context of the edition folio convolutes
 * to store the values of a point on the folio svg.
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
 * to store the values of a line on the folio svg.
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
 * to store the values of a rectangle on the folio svg.
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
 * Function: isValidFolioContent.
 *
 * It checks if a given folio content can be calculated:
 * it needs exactly one segment, a segment split not smaller than its segments,
 * and a folio with systems. Invalid contents are logged.
 *
 * @param {FolioContent} content The given folio content.
 * @param {FolioCalculationSystems} systems The given calculated systems.
 * @returns {boolean} The result of the check.
 */
function isValidFolioContent(content: FolioContent, systems: FolioCalculationSystems): content is ValidFolioContent {
    if (content.segments?.length !== 1) {
        console.error('[FolioCalculation] Content needs exactly one segment', content);
        return false;
    }
    if (content.segments.length > (content.segmentSplit ?? 1)) {
        console.error('[FolioCalculation] Segments array is bigger than segmentSplit', content);
        return false;
    }
    if (systems.NUMBER_OF_SYSTEMS === 0) {
        console.error('[FolioCalculation] No systems in folio', content);
        return false;
    }
    return true;
}

/**
 * Function: calculateTrademarkRectangle.
 *
 * It calculates the rectangle of the trademark based on the given position string.
 *
 * @param {FolioCalculationRectangle} sheetRectangle The given rectangle of the sheet.
 * @param {string} position The given trademark position string.
 * @returns {FolioCalculationRectangle} The calculated rectangle of the trademark.
 */
function calculateTrademarkRectangle(
    sheetRectangle: FolioCalculationRectangle,
    position: string
): FolioCalculationRectangle {
    const { UPPER_LEFT_CORNER: upperLeft, LOWER_RIGHT_CORNER: lowerRight } = sheetRectangle;
    const left = upperLeft.x + TRADEMARK_MARGIN;
    const right = lowerRight.x - TRADEMARK_MARGIN - TRADEMARK_WIDTH;
    const top = upperLeft.y + TRADEMARK_MARGIN;
    const bottom = lowerRight.y - TRADEMARK_MARGIN - TRADEMARK_HEIGHT;

    let x1 = 0;
    let y1 = 0;
    switch (position) {
        case 'unten links':
            [x1, y1] = [left, bottom];
            break;
        case 'unten rechts':
            [x1, y1] = [right, bottom];
            break;
        case 'oben links':
            [x1, y1] = [left, top];
            break;
        case 'oben rechts':
            [x1, y1] = [right, top];
            break;
    }

    return new FolioCalculationRectangle(
        new FolioCalculationPoint(x1, y1),
        new FolioCalculationPoint(x1 + TRADEMARK_WIDTH, y1 + TRADEMARK_HEIGHT)
    );
}

/**
 * Function: calculateContentSegmentX.
 *
 * It calculates the x value of the start or end vertices of a content segment.
 *
 * @param {FolioSegment} segment The given segment of the folio content.
 * @param {FolioCalculationSystems} systems The given calculated systems.
 * @param {number} segmentSplit The given segment split.
 * @param {number} offsetCorrection The given (adjusted) offset correction.
 * @param {boolean} isStart The given flag if the x value is for the start.
 * @returns {number} The calculated x value.
 */
function calculateContentSegmentX(
    segment: FolioSegment,
    systems: FolioCalculationSystems,
    segmentSplit: number,
    offsetCorrection: number,
    isStart: boolean
): number {
    const width = round(systems.SYSTEMS_WIDTH / segmentSplit, 2);
    const splitIndex = segment.position && segment.position <= segmentSplit ? segment.position - 1 : 0;

    const xValue = systems.START_X + splitIndex * width + offsetCorrection / 2;
    const correction = isStart ? 0 : width - offsetCorrection;

    return round(xValue + correction, 2);
}

/**
 * Function: calculateContentSegmentY.
 *
 * It calculates the y value of the start or end vertices of a content segment.
 *
 * @param {FolioSegment} segment The given segment of the folio content.
 * @param {FolioCalculationSystems} systems The given calculated systems.
 * @param {number} offsetCorrection The given (adjusted) offset correction.
 * @param {boolean} isStart The given flag if the y value is for the start.
 * @returns {number} The calculated y value.
 */
function calculateContentSegmentY(
    segment: FolioSegment,
    systems: FolioCalculationSystems,
    offsetCorrection: number,
    isStart: boolean
): number {
    let systemIndex = (isStart ? segment.startSystem : segment.endSystem) - 1;
    // Reverse order of the system index if the systems are reversed
    if (systems.SYSTEMS_REVERSED) {
        systemIndex = systems.SYSTEMS_LINES.length - 1 - systemIndex;
    }
    const systemLines = systems.SYSTEMS_LINES[systemIndex];

    if (!systemLines || systemLines.length === 0) {
        throw new Error(
            `[FolioCalculation] Cannot calculate Y value: No system lines found for system ${systemIndex}.`
        );
    }

    let relativeOffset = 0;
    if (segment.relativeToSystem === 'below') {
        relativeOffset = CONTENT_SEGMENT_RELATIVE_TO_SYSTEM_OFFSET;
    } else if (segment.relativeToSystem === 'above') {
        relativeOffset = -CONTENT_SEGMENT_RELATIVE_TO_SYSTEM_OFFSET;
    }

    const yValue = isStart ? systemLines[0].START_POINT.y : systemLines[systemLines.length - 1].END_POINT.y;
    const correction = offsetCorrection * (isStart ? -1 : 1) + relativeOffset;

    return round(yValue + correction, 2);
}

/**
 * The FolioCalculationSheet class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of the sheet of a folio.
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
     * It initializes the class with values from folio settings, the folio id and the trademark position.
     *
     * @param {FolioSettings} folioSettings The given folio settings.
     * @param {string} folioId The given folio id.
     * @param {string} [trademarkPosition] The optional given trademark position.
     */
    constructor(
        { initialOffsetX, initialOffsetY, formatX, formatY, factor }: FolioSettings,
        folioId: string,
        trademarkPosition?: string
    ) {
        this.FOLIO_ID = folioId;
        this.SHEET_WIDTH = formatX * factor;
        this.SHEET_HEIGHT = formatY * factor;
        this.SHEET_RECTANGLE = new FolioCalculationRectangle(
            new FolioCalculationPoint(initialOffsetX, initialOffsetY),
            new FolioCalculationPoint(this.SHEET_WIDTH, this.SHEET_HEIGHT)
        );
        this.TRADEMARK_RECTANGLE = trademarkPosition
            ? calculateTrademarkRectangle(this.SHEET_RECTANGLE, trademarkPosition)
            : undefined;
    }
}

/**
 * The FolioCalculationSystems class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of the systems of a folio.
 */
export class FolioCalculationSystems {
    /**
     * The number of systems.
     */
    public readonly NUMBER_OF_SYSTEMS: number;

    /**
     * The flag if the systems are reversed.
     */
    public readonly SYSTEMS_REVERSED: boolean;

    /**
     * The start position (x-value) of the systems.
     */
    public readonly START_X: number;

    /**
     * The width of the systems.
     */
    public readonly SYSTEMS_WIDTH: number;

    /**
     * The lines of the systems (per system an array of its staff lines).
     */
    public readonly SYSTEMS_LINES: FolioCalculationLine[][];

    /**
     * The positions of the system labels.
     */
    public readonly SYSTEMS_LABEL_POSITIONS: FolioCalculationPoint[];

    /**
     * Constructor of the FolioCalculationSystems class.
     *
     * It initializes the class with values
     * from the calculated folio sheet, the zoom factor and the systems string.
     *
     * @param {FolioCalculationSheet} sheet The given calculated folio sheet.
     * @param {number} factor The given zoom factor.
     * @param {string} systems The given systems string.
     * @param {boolean} [systemsReversed] The optional given reversed flag.
     */
    constructor(sheet: FolioCalculationSheet, factor: number, systems: string, systemsReversed: boolean = false) {
        this.NUMBER_OF_SYSTEMS = systems ? Number.parseInt(systems, 10) : 0;
        this.SYSTEMS_REVERSED = systemsReversed;

        // Margins of the systems area on the sheet
        const upperMargin =
            round(sheet.SHEET_HEIGHT * SYSTEMS_VERTICAL_MARGIN_FACTOR, 2) + SYSTEMS_VERTICAL_MARGIN_OFFSET;
        const leftMargin = round(sheet.SHEET_WIDTH * SYSTEMS_HORIZONTAL_MARGIN_FACTOR, 2);
        const rightMargin = round(sheet.SHEET_WIDTH * (SYSTEMS_HORIZONTAL_MARGIN_FACTOR / 2), 2);

        // Dimensions of the systems area
        const { x: sheetX, y: sheetY } = sheet.SHEET_RECTANGLE.UPPER_LEFT_CORNER;
        this.SYSTEMS_WIDTH = sheet.SHEET_WIDTH - (leftMargin + rightMargin);
        this.START_X = sheetX + leftMargin;
        const endX = this.START_X + this.SYSTEMS_WIDTH;
        const startY = sheetY + upperMargin;
        const systemsHeight = sheet.SHEET_HEIGHT - (upperMargin + upperMargin);

        // Y values of the staff lines per system
        const spacePerSystem = systemsHeight / this.NUMBER_OF_SYSTEMS;
        const yArray = Array.from({ length: this.NUMBER_OF_SYSTEMS }, (_, systemIndex) => {
            const yStart = round(startY + systemIndex * spacePerSystem, 2);
            return Array.from(
                { length: SYSTEM_NUMBER_OF_LINES },
                (__, lineIndex) => yStart + lineIndex * SYSTEM_LINE_SPACE_FACTOR * factor
            );
        });

        this.SYSTEMS_LINES = yArray.map(lineArray =>
            lineArray.map(
                y =>
                    new FolioCalculationLine(
                        new FolioCalculationPoint(this.START_X, y),
                        new FolioCalculationPoint(endX, y)
                    )
            )
        );

        const labelX = round(this.START_X - leftMargin * SYSTEMS_LABEL_X_OFFSET_FACTOR, 2);
        const labelYOffset = round(SYSTEMS_LABEL_Y_OFFSET_FACTOR / factor, 2);
        this.SYSTEMS_LABEL_POSITIONS = yArray.map(
            lineArray => new FolioCalculationPoint(labelX, lineArray[0] - labelYOffset)
        );
    }
}

/**
 * The FolioCalculationContentSegment class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the values of a content segment of a folio.
 * The given content is expected to be valid (see {@link isValidFolioContent}).
 */
export class FolioCalculationContentSegment {
    /**
     * The id of the edition complex of the content segment.
     */
    public readonly complexId: string;

    /**
     * The id of the svg sheet of the content segment.
     */
    public readonly sheetId: string;

    /**
     * The key of the text that is shown in a modal
     * if the content segment cannot be selected.
     */
    public readonly linkTo: string;

    /**
     * The boolean flag if the content segment can be selected.
     */
    public readonly selectable: boolean;

    /**
     * The boolean flag if the content segment is reversed.
     */
    public readonly reversed: boolean;

    /**
     * The label of the content segment.
     */
    public readonly segmentLabel: string;

    /**
     * The lines of the label of the content segment (sigle and addendum).
     */
    public readonly segmentLabelArray: string[];

    /**
     * The vertices of the content segment polygon (as svg points string).
     */
    public readonly vertices: string;

    /**
     * The centered x position of the content segment.
     */
    public readonly centeredXPosition: number;

    /**
     * The centered y position of the content segment.
     */
    public readonly centeredYPosition: number;

    /**
     * Constructor of the FolioCalculationContentSegment class.
     *
     * It initializes the class with values from the folio content,
     * the calculated systems and the segment offset correction.
     *
     * @param {ValidFolioContent} content The given (valid) folio content.
     * @param {FolioCalculationSystems} systems The given calculated systems.
     * @param {number} segmentOffsetCorrection The given segment offset correction.
     */
    constructor(content: ValidFolioContent, systems: FolioCalculationSystems, segmentOffsetCorrection: number) {
        const { complexId, sheetId, selectable = true, reversed = false, linkTo = '', sigle, sigleAddendum } = content;

        this.complexId = complexId;
        this.sheetId = sheetId;
        this.linkTo = linkTo;
        this.selectable = selectable;
        this.reversed = reversed;

        this.segmentLabelArray = [sigle, sigleAddendum ? ` ${sigleAddendum}` : ''];
        this.segmentLabel = sigleAddendum ? `${sigle} ${sigleAddendum}` : sigle;

        // Dynamically adjust the offset correction based on the number of systems (reference: 18 systems)
        const offsetCorrection =
            segmentOffsetCorrection * (FOLIO_DEFAULT_NUMBER_OF_SYSTEMS / systems.NUMBER_OF_SYSTEMS);
        const segmentSplit = content.segmentSplit ?? 1;
        const segment = content.segments[0];

        const startX = calculateContentSegmentX(segment, systems, segmentSplit, offsetCorrection, true);
        const endX = calculateContentSegmentX(segment, systems, segmentSplit, offsetCorrection, false);
        const startY = calculateContentSegmentY(segment, systems, offsetCorrection, true);
        const endY = calculateContentSegmentY(segment, systems, offsetCorrection, false);

        // Closed polygon: upper left, upper right, lower right, lower left, upper left
        this.vertices = [
            [startX, startY],
            [endX, startY],
            [endX, endY],
            [startX, endY],
            [startX, startY],
        ]
            .map(([x, y]) => `${x} ${y}`)
            .join(' ');

        const labelOffset = sigleAddendum ? CONTENT_SEGMENT_LABEL_ADDENDUM_OFFSET : 0;
        this.centeredXPosition = (startX + endX) / 2;
        this.centeredYPosition = (startY + endY) / 2 - (reversed ? -labelOffset : labelOffset);
    }
}

/**
 * The FolioCalculation class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate all the values needed for the folio svg.
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
     * The calculated values for the (valid) content segments of a folio.
     */
    public readonly CONTENT_SEGMENTS: FolioCalculationContentSegment[];

    /**
     * The calculated view box of the svg of a folio
     * (folio format plus initial offsets on both sides, zoomed by the factor).
     */
    public readonly VIEW_BOX: ViewBox;

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
            folioSettings.factor,
            folioData.systems,
            folioData.reversed
        );
        this.CONTENT_SEGMENTS = folioData.content
            .filter(content => isValidFolioContent(content, this.SYSTEMS))
            .map(content => new FolioCalculationContentSegment(content, this.SYSTEMS, segmentOffsetCorrection));
        this.VIEW_BOX = new ViewBox(
            (folioSettings.formatX + 2 * folioSettings.initialOffsetX) * folioSettings.factor,
            (folioSettings.formatY + 2 * folioSettings.initialOffsetY) * folioSettings.factor
        );
    }
}
