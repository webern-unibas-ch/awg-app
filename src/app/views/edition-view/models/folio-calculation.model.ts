import {
    FolioSvgContentSegment,
    FolioSvgData,
    FolioSvgLine,
    FolioSvgPoint,
    FolioSvgRectangle,
    FolioSvgSheet,
    FolioSvgSystems,
} from './folio-svg-data.model';
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
 * Interface: SystemsCalculation.
 *
 * The calculated systems of a folio together with
 * the horizontal dimensions of the systems area (needed for the content segments).
 */
interface SystemsCalculation {
    systems: FolioSvgSystems;
    startX: number;
    width: number;
}

/**
 * Utility method: round.
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
 * Method: isValidFolioContent.
 *
 * It checks if a given folio content can be calculated:
 * it needs exactly one segment, a segment split not smaller than its segments,
 * and a folio with systems. Invalid contents are logged.
 *
 * @param {FolioContent} content The given folio content.
 * @param {number} numberOfSystems The given number of systems of the folio.
 * @returns {boolean} The result of the check.
 */
function isValidFolioContent(content: FolioContent, numberOfSystems: number): content is ValidFolioContent {
    if (content.segments?.length !== 1) {
        console.error('[FolioCalculation] Content needs exactly one segment', content);
        return false;
    }
    if (content.segments.length > (content.segmentSplit ?? 1)) {
        console.error('[FolioCalculation] Segments array is bigger than segmentSplit', content);
        return false;
    }
    if (numberOfSystems === 0) {
        console.error('[FolioCalculation] No systems in folio', content);
        return false;
    }
    return true;
}

/**
 * Method: calculateTrademarkRectangle.
 *
 * It calculates the rectangle of the trademark based on the given position string.
 *
 * @param {FolioSvgRectangle} sheetRectangle The given rectangle of the sheet.
 * @param {string} position The given trademark position string.
 * @returns {FolioSvgRectangle} The calculated rectangle of the trademark.
 */
function calculateTrademarkRectangle(sheetRectangle: FolioSvgRectangle, position: string): FolioSvgRectangle {
    const { upperLeft, lowerRight } = sheetRectangle;
    const left = upperLeft.x + TRADEMARK_MARGIN;
    const right = lowerRight.x - TRADEMARK_MARGIN - TRADEMARK_WIDTH;
    const top = upperLeft.y + TRADEMARK_MARGIN;
    const bottom = lowerRight.y - TRADEMARK_MARGIN - TRADEMARK_HEIGHT;

    let x = 0;
    let y = 0;
    switch (position) {
        case 'unten links':
            [x, y] = [left, bottom];
            break;
        case 'unten rechts':
            [x, y] = [right, bottom];
            break;
        case 'oben links':
            [x, y] = [left, top];
            break;
        case 'oben rechts':
            [x, y] = [right, top];
            break;
    }

    return { upperLeft: { x, y }, lowerRight: { x: x + TRADEMARK_WIDTH, y: y + TRADEMARK_HEIGHT } };
}

/**
 * Method: calculateSheet.
 *
 * It calculates the sheet (rectangle and optional trademark) of a given folio.
 *
 * @param {FolioSettings} folioSettings The given folio settings.
 * @param {Folio} folio The given folio.
 * @returns {FolioSvgSheet} The calculated sheet.
 */
function calculateSheet(
    { initialOffsetX, initialOffsetY, formatX, formatY, factor }: FolioSettings,
    folio: Folio
): FolioSvgSheet {
    const rectangle: FolioSvgRectangle = {
        upperLeft: { x: initialOffsetX, y: initialOffsetY },
        lowerRight: { x: formatX * factor, y: formatY * factor },
    };

    return {
        folioId: folio.folioId,
        rectangle,
        trademarkRectangle: folio.trademarkPosition
            ? calculateTrademarkRectangle(rectangle, folio.trademarkPosition)
            : undefined,
    };
}

/**
 * Method: calculateSystems.
 *
 * It calculates the systems (staff lines and label positions) of a given folio
 * within the systems area of its sheet.
 *
 * @param {FolioSettings} folioSettings The given folio settings.
 * @param {FolioSvgSheet} sheet The given calculated sheet.
 * @param {Folio} folio The given folio.
 * @returns {SystemsCalculation} The calculated systems with the horizontal dimensions of the systems area.
 */
function calculateSystems(
    { formatX, formatY, factor }: FolioSettings,
    sheet: FolioSvgSheet,
    folio: Folio
): SystemsCalculation {
    const numberOfSystems = folio.systems ? Number.parseInt(folio.systems, 10) : 0;
    const sheetWidth = formatX * factor;
    const sheetHeight = formatY * factor;

    // Margins of the systems area on the sheet
    const upperMargin = round(sheetHeight * SYSTEMS_VERTICAL_MARGIN_FACTOR, 2) + SYSTEMS_VERTICAL_MARGIN_OFFSET;
    const leftMargin = round(sheetWidth * SYSTEMS_HORIZONTAL_MARGIN_FACTOR, 2);
    const rightMargin = round(sheetWidth * (SYSTEMS_HORIZONTAL_MARGIN_FACTOR / 2), 2);

    // Dimensions of the systems area
    const width = sheetWidth - (leftMargin + rightMargin);
    const startX = sheet.rectangle.upperLeft.x + leftMargin;
    const endX = startX + width;
    const startY = sheet.rectangle.upperLeft.y + upperMargin;
    const height = sheetHeight - (upperMargin + upperMargin);

    // Y values of the staff lines per system
    const spacePerSystem = height / numberOfSystems;
    const yArray = Array.from({ length: numberOfSystems }, (_, systemIndex) => {
        const yStart = round(startY + systemIndex * spacePerSystem, 2);
        return Array.from(
            { length: SYSTEM_NUMBER_OF_LINES },
            (__, lineIndex) => yStart + lineIndex * SYSTEM_LINE_SPACE_FACTOR * factor
        );
    });

    const labelX = round(startX - leftMargin * SYSTEMS_LABEL_X_OFFSET_FACTOR, 2);
    const labelYOffset = round(SYSTEMS_LABEL_Y_OFFSET_FACTOR / factor, 2);

    return {
        systems: {
            labelPositions: yArray.map(lineArray => ({ x: labelX, y: lineArray[0] - labelYOffset })),
            lines: yArray.map(lineArray =>
                lineArray.map((y): FolioSvgLine => ({ start: { x: startX, y }, end: { x: endX, y } }))
            ),
            reversed: folio.reversed ?? false,
        },
        startX,
        width,
    };
}

/**
 * Method: calculateContentSegmentX.
 *
 * It calculates the x value of the start or end vertices of a content segment.
 *
 * @param {FolioSegment} segment The given segment of the folio content.
 * @param {SystemsCalculation} systemsCalculation The given calculated systems.
 * @param {number} segmentSplit The given segment split.
 * @param {number} offsetCorrection The given (adjusted) offset correction.
 * @param {boolean} isStart The given flag if the x value is for the start.
 * @returns {number} The calculated x value.
 */
function calculateContentSegmentX(
    segment: FolioSegment,
    { startX, width: systemsWidth }: SystemsCalculation,
    segmentSplit: number,
    offsetCorrection: number,
    isStart: boolean
): number {
    const width = round(systemsWidth / segmentSplit, 2);
    const splitIndex = segment.position && segment.position <= segmentSplit ? segment.position - 1 : 0;

    const xValue = startX + splitIndex * width + offsetCorrection / 2;
    const correction = isStart ? 0 : width - offsetCorrection;

    return round(xValue + correction, 2);
}

/**
 * Method: calculateContentSegmentY.
 *
 * It calculates the y value of the start or end vertices of a content segment.
 *
 * @param {FolioSegment} segment The given segment of the folio content.
 * @param {FolioSvgSystems} systems The given calculated systems.
 * @param {number} offsetCorrection The given (adjusted) offset correction.
 * @param {boolean} isStart The given flag if the y value is for the start.
 * @returns {number} The calculated y value.
 */
function calculateContentSegmentY(
    segment: FolioSegment,
    { lines, reversed }: FolioSvgSystems,
    offsetCorrection: number,
    isStart: boolean
): number {
    let systemIndex = (isStart ? segment.startSystem : segment.endSystem) - 1;
    // Reverse order of the system index if the systems are reversed
    if (reversed) {
        systemIndex = lines.length - 1 - systemIndex;
    }
    const systemLines = lines[systemIndex];

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

    const yValue = isStart ? systemLines[0].start.y : systemLines[systemLines.length - 1].end.y;
    const correction = offsetCorrection * (isStart ? -1 : 1) + relativeOffset;

    return round(yValue + correction, 2);
}

/**
 * Method: calculateContentSegment.
 *
 * It calculates a content segment (polygon vertices, label and its center) of a given valid folio content.
 *
 * @param {ValidFolioContent} content The given valid folio content.
 * @param {SystemsCalculation} systemsCalculation The given calculated systems.
 * @param {number} segmentOffsetCorrection The given segment offset correction.
 * @returns {FolioSvgContentSegment} The calculated content segment.
 */
function calculateContentSegment(
    content: ValidFolioContent,
    systemsCalculation: SystemsCalculation,
    segmentOffsetCorrection: number
): FolioSvgContentSegment {
    const { complexId, sheetId, selectable = true, reversed = false, linkTo = '', sigle, sigleAddendum } = content;
    const { systems } = systemsCalculation;

    // Dynamically adjust the offset correction based on the number of systems (reference: 18 systems)
    const offsetCorrection = segmentOffsetCorrection * (FOLIO_DEFAULT_NUMBER_OF_SYSTEMS / systems.lines.length);
    const segmentSplit = content.segmentSplit ?? 1;
    const segment = content.segments[0];

    const startX = calculateContentSegmentX(segment, systemsCalculation, segmentSplit, offsetCorrection, true);
    const endX = calculateContentSegmentX(segment, systemsCalculation, segmentSplit, offsetCorrection, false);
    const startY = calculateContentSegmentY(segment, systems, offsetCorrection, true);
    const endY = calculateContentSegmentY(segment, systems, offsetCorrection, false);

    // Closed polygon: upper left, upper right, lower right, lower left, upper left
    const vertices: FolioSvgPoint[] = [
        { x: startX, y: startY },
        { x: endX, y: startY },
        { x: endX, y: endY },
        { x: startX, y: endY },
        { x: startX, y: startY },
    ];

    const labelOffset = sigleAddendum ? CONTENT_SEGMENT_LABEL_ADDENDUM_OFFSET : 0;

    return {
        sheetIds: { complexId, sheetId },
        linkTo,
        selectable,
        label: sigleAddendum ? `${sigle} ${sigleAddendum}` : sigle,
        labelLines: [sigle, sigleAddendum ? ` ${sigleAddendum}` : ''],
        reversed,
        vertices: vertices.map(({ x, y }) => `${x} ${y}`).join(' '),
        center: {
            x: (startX + endX) / 2,
            y: (startY + endY) / 2 - (reversed ? -labelOffset : labelOffset),
        },
    };
}

/**
 * Method: calculateFolioSvgData.
 *
 * It calculates the svg data (sheet, systems, content segments and view box) of a given folio.
 * Invalid folio contents are skipped (see {@link isValidFolioContent}).
 *
 * @param {FolioSettings} folioSettings The given folio settings.
 * @param {Folio} folio The given folio.
 * @param {number} [segmentOffsetCorrection] The optional given segment offset correction.
 * @returns {FolioSvgData} The calculated folio svg data.
 */
export function calculateFolioSvgData(
    folioSettings: FolioSettings,
    folio: Folio,
    segmentOffsetCorrection: number = 0
): FolioSvgData {
    const { factor, formatX, formatY, initialOffsetX, initialOffsetY } = folioSettings;

    const sheet = calculateSheet(folioSettings, folio);
    const systemsCalculation = calculateSystems(folioSettings, sheet, folio);
    const numberOfSystems = systemsCalculation.systems.lines.length;

    return {
        viewBox: new ViewBox((formatX + 2 * initialOffsetX) * factor, (formatY + 2 * initialOffsetY) * factor),
        sheet,
        systems: systemsCalculation.systems,
        contentSegments: folio.content
            .filter(content => isValidFolioContent(content, numberOfSystems))
            .map(content => calculateContentSegment(content, systemsCalculation, segmentOffsetCorrection)),
    };
}
