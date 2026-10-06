/**
 * Utilities of the EditionFolioDrawingService.
 *
 * They calculate the svg data (sheet, systems, content segments and view box) of a folio
 * as pure functions (entry point: {@link calculateFolioSvgData}).
 */
import { NUMBER_UTILS } from '@awg-shared/utils/number-utils';

import {
    FolioSettings,
    FolioSvgContentSegment,
    FolioSvgData,
    FolioSvgLine,
    FolioSvgPoint,
    FolioSvgRectangle,
    FolioSvgSheet,
    FolioSvgSystems,
} from '../models/folio-svg-data.model';
import { Folio, FolioContent, FolioSegment } from '../models/folio.model';
import { ViewBox } from '../models/view-box.model';

/**
 * Constant: FOLIO_DEFAULT_NUMBER_OF_SYSTEMS.
 *
 * It keeps the default number of systems of a folio
 * (reference for the content segment offset correction and stroke width).
 */
export const FOLIO_DEFAULT_NUMBER_OF_SYSTEMS = 18;

// Constants for the calculation of the systems

/**
 * Constant: SYSTEM_NUMBER_OF_LINES.
 *
 * It keeps the number of staff lines per system.
 */
const SYSTEM_NUMBER_OF_LINES = 5;

/**
 * Constant: SYSTEM_LINE_SPACE_FACTOR.
 *
 * It keeps the space between two staff lines,
 * relative to the folio factor.
 */
const SYSTEM_LINE_SPACE_FACTOR = 1.5;

/**
 * Constant: SYSTEM_MAX_STAFF_SHARE.
 *
 * It keeps the maximum share of the space per system taken by the staff lines
 * (the rest keeps the systems apart).
 */
const SYSTEM_MAX_STAFF_SHARE = 0.6;

/**
 * Constant: SYSTEMS_LEFT_MARGIN_FACTOR.
 *
 * It keeps the left margin of the systems area,
 * relative to the sheet width.
 */
const SYSTEMS_LEFT_MARGIN_FACTOR = 0.13;

/**
 * Constant: SYSTEMS_RIGHT_MARGIN_FACTOR.
 *
 * It keeps the right margin of the systems area,
 * relative to the sheet width.
 */
const SYSTEMS_RIGHT_MARGIN_FACTOR = 1 / 12;

/**
 * Constant: SYSTEMS_VERTICAL_MARGIN_FACTOR.
 *
 * It keeps the upper and lower margin of the systems area,
 * relative to the sheet height.
 */
const SYSTEMS_VERTICAL_MARGIN_FACTOR = 0.05;

/**
 * Constant: SYSTEMS_VERTICAL_MARGIN_OFFSET.
 *
 * It keeps the fixed offset added to the upper and lower margin of the systems area.
 */
const SYSTEMS_VERTICAL_MARGIN_OFFSET = 25;

/**
 * Constant: SYSTEMS_LABEL_MAX_FONT_SIZE.
 *
 * It keeps the maximum font size of the system labels.
 */
const SYSTEMS_LABEL_MAX_FONT_SIZE = 16;

/**
 * Constant: SYSTEMS_LABEL_FONT_SHARE.
 *
 * It keeps the maximum share of the space per system
 * taken by the font size of the system labels.
 */
const SYSTEMS_LABEL_FONT_SHARE = 0.8;

/**
 * Constant: SYSTEMS_LABEL_GAP_FACTOR.
 *
 * It keeps the gap between the (right-aligned) system labels and the systems,
 * relative to the label font size.
 */
const SYSTEMS_LABEL_GAP_FACTOR = 0.6;

/**
 * Constant: SYSTEMS_LABEL_BASELINE_FACTOR.
 *
 * It keeps half the height of the digits, relative to the label font size
 * (to center the labels at the middle line).
 */
const SYSTEMS_LABEL_BASELINE_FACTOR = 0.35;

// Constants for the calculation of the trademark

/**
 * Constant: TRADEMARK_WIDTH.
 *
 * It keeps the width of the trademark.
 */
const TRADEMARK_WIDTH = 20;

/**
 * Constant: TRADEMARK_HEIGHT.
 *
 * It keeps the height of the trademark.
 */
const TRADEMARK_HEIGHT = 30;

/**
 * Constant: TRADEMARK_MARGIN.
 *
 * It keeps the margin between the trademark and the sheet edges.
 */
const TRADEMARK_MARGIN = 10;

// Constants for the calculation of the content segments

/**
 * Constant: CONTENT_SEGMENT_RELATIVE_TO_SYSTEM_OFFSET.
 *
 * It keeps the vertical offset of content segments
 * that are placed above or below a system.
 */
const CONTENT_SEGMENT_RELATIVE_TO_SYSTEM_OFFSET = 20;

/**
 * Constant: CONTENT_SEGMENT_LABEL_ADDENDUM_OFFSET.
 *
 * It keeps the vertical offset of the label center
 * of content segments with a sigle addendum.
 */
const CONTENT_SEGMENT_LABEL_ADDENDUM_OFFSET = 5;

/**
 * Constant: CONTENT_SEGMENT_MAX_GAP_SHARE.
 *
 * It keeps the maximum share of the gap between two systems
 * taken by the vertical padding of the content segments.
 */
const CONTENT_SEGMENT_MAX_GAP_SHARE = 0.3;

/**
 * Type: ValidFolioContent.
 *
 * A folio content with its segments (checked by {@link isValidFolioContent}).
 */
type ValidFolioContent = FolioContent & { segments: FolioSegment[] };

/**
 * Interface: FolioSystemsLayout.
 *
 * The calculated systems of a folio together with
 * the horizontal dimensions of the systems area and the gap between two systems
 * (needed for the content segments).
 */
interface FolioSystemsLayout {
    /**
     * The calculated systems of the folio.
     */
    systems: FolioSvgSystems;

    /**
     * The x value of the start of the systems area.
     */
    startX: number;

    /**
     * The width of the systems area.
     */
    width: number;

    /**
     * The gap between two systems (space per system without the staff lines).
     */
    gap: number;
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
 * @returns {FolioSystemsLayout} The calculated systems layout (systems, horizontal dimensions of the systems area and gap).
 */
function calculateSystems(
    { formatX, formatY, factor }: FolioSettings,
    sheet: FolioSvgSheet,
    folio: Folio
): FolioSystemsLayout {
    const numberOfSystems = folio.systems ? Number.parseInt(folio.systems, 10) : 0;
    const sheetWidth = formatX * factor;
    const sheetHeight = formatY * factor;

    // Margins of the systems area on the sheet
    const upperMargin =
        NUMBER_UTILS.roundToDecimals(sheetHeight * SYSTEMS_VERTICAL_MARGIN_FACTOR, 2) + SYSTEMS_VERTICAL_MARGIN_OFFSET;
    const leftMargin = NUMBER_UTILS.roundToDecimals(sheetWidth * SYSTEMS_LEFT_MARGIN_FACTOR, 2);
    const rightMargin = NUMBER_UTILS.roundToDecimals(sheetWidth * SYSTEMS_RIGHT_MARGIN_FACTOR, 2);

    // Dimensions of the systems area
    const width = sheetWidth - (leftMargin + rightMargin);
    const startX = sheet.rectangle.upperLeft.x + leftMargin;
    const endX = startX + width;
    const startY = sheet.rectangle.upperLeft.y + upperMargin;
    const height = sheetHeight - (upperMargin + upperMargin);

    // Y values of the staff lines per system
    const spacePerSystem = height / numberOfSystems;
    // Shrink the line space if the staff lines would take more than their maximum share of the space per system
    const maxLineSpace = (spacePerSystem * SYSTEM_MAX_STAFF_SHARE) / (SYSTEM_NUMBER_OF_LINES - 1);
    const isLineSpaceLimited = SYSTEM_LINE_SPACE_FACTOR * factor > maxLineSpace;
    const staffHeight =
        (isLineSpaceLimited ? maxLineSpace : SYSTEM_LINE_SPACE_FACTOR * factor) * (SYSTEM_NUMBER_OF_LINES - 1);
    const yArray = Array.from({ length: numberOfSystems }, (_, systemIndex) => {
        const yStart = NUMBER_UTILS.roundToDecimals(startY + systemIndex * spacePerSystem, 2);
        return Array.from({ length: SYSTEM_NUMBER_OF_LINES }, (__, lineIndex) =>
            isLineSpaceLimited
                ? NUMBER_UTILS.roundToDecimals(yStart + lineIndex * maxLineSpace, 2)
                : yStart + lineIndex * SYSTEM_LINE_SPACE_FACTOR * factor
        );
    });

    // System labels: font size limited by the space per system, right-aligned before the systems,
    // With their digits vertically centered at the middle line
    const labelFontSize = NUMBER_UTILS.roundToDecimals(
        Math.min(SYSTEMS_LABEL_MAX_FONT_SIZE, spacePerSystem * SYSTEMS_LABEL_FONT_SHARE),
        2
    );
    const labelX = NUMBER_UTILS.roundToDecimals(startX - labelFontSize * SYSTEMS_LABEL_GAP_FACTOR, 2);
    const labelBaselineOffset = labelFontSize * SYSTEMS_LABEL_BASELINE_FACTOR;
    const middleLineIndex = Math.floor(SYSTEM_NUMBER_OF_LINES / 2);

    return {
        systems: {
            labelFontSize,
            labelPositions: yArray.map(lineArray => ({
                x: labelX,
                y: NUMBER_UTILS.roundToDecimals(lineArray[middleLineIndex] + labelBaselineOffset, 2),
            })),
            lines: yArray.map(lineArray =>
                lineArray.map((y): FolioSvgLine => ({ start: { x: startX, y }, end: { x: endX, y } }))
            ),
            reversed: folio.reversed ?? false,
        },
        startX,
        width,
        gap: spacePerSystem - staffHeight,
    };
}

/**
 * Method: calculateContentSegmentX.
 *
 * It calculates the x value of the start or end vertices of a content segment.
 *
 * @param {FolioSegment} segment The given segment of the folio content.
 * @param {FolioSystemsLayout} folioSystemsLayout The given calculated systems layout.
 * @param {number} segmentSplit The given segment split.
 * @param {number} offsetCorrection The given (adjusted) offset correction.
 * @param {boolean} isStart The given flag if the x value is for the start.
 * @returns {number} The calculated x value.
 */
function calculateContentSegmentX(
    segment: FolioSegment,
    { startX, width: systemsWidth }: FolioSystemsLayout,
    segmentSplit: number,
    offsetCorrection: number,
    isStart: boolean
): number {
    const width = NUMBER_UTILS.roundToDecimals(systemsWidth / segmentSplit, 2);
    const splitIndex = segment.position && segment.position <= segmentSplit ? segment.position - 1 : 0;

    const xValue = startX + splitIndex * width + offsetCorrection / 2;
    const correction = isStart ? 0 : width - offsetCorrection;

    return NUMBER_UTILS.roundToDecimals(xValue + correction, 2);
}

/**
 * Method: calculateContentSegmentY.
 *
 * It calculates the y value of the start or end vertices of a content segment.
 *
 * @param {FolioSegment} segment The given segment of the folio content.
 * @param {FolioSvgSystems} systems The given calculated systems.
 * @param {number} verticalPadding The given vertical padding above and below the systems.
 * @param {boolean} isStart The given flag if the y value is for the start.
 * @returns {number} The calculated y value.
 */
function calculateContentSegmentY(
    segment: FolioSegment,
    { lines, reversed }: FolioSvgSystems,
    verticalPadding: number,
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
    const correction = verticalPadding * (isStart ? -1 : 1) + relativeOffset;

    return NUMBER_UTILS.roundToDecimals(yValue + correction, 2);
}

/**
 * Method: calculateContentSegment.
 *
 * It calculates a content segment (polygon vertices, label and its center) of a given valid folio content.
 *
 * @param {ValidFolioContent} content The given valid folio content.
 * @param {FolioSystemsLayout} folioSystemsLayout The given calculated systems layout.
 * @param {number} segmentOffsetCorrection The given segment offset correction.
 * @returns {FolioSvgContentSegment} The calculated content segment.
 */
function calculateContentSegment(
    content: ValidFolioContent,
    folioSystemsLayout: FolioSystemsLayout,
    segmentOffsetCorrection: number
): FolioSvgContentSegment {
    const { complexId, sheetId, selectable = true, reversed = false, linkTo = '', sigle, sigleAddendum } = content;
    const { systems } = folioSystemsLayout;

    // Dynamically adjust the offset correction based on the number of systems (reference: 18 systems)
    const offsetCorrection = segmentOffsetCorrection * (FOLIO_DEFAULT_NUMBER_OF_SYSTEMS / systems.lines.length);
    const segmentSplit = content.segmentSplit ?? 1;
    const segment = content.segments[0];

    const startX = calculateContentSegmentX(segment, folioSystemsLayout, segmentSplit, offsetCorrection, true);
    const endX = calculateContentSegmentX(segment, folioSystemsLayout, segmentSplit, offsetCorrection, false);
    // Limit the vertical padding by the gap between two systems, so that the segments keep apart
    const verticalPadding = Math.min(offsetCorrection, folioSystemsLayout.gap * CONTENT_SEGMENT_MAX_GAP_SHARE);
    const startY = calculateContentSegmentY(segment, systems, verticalPadding, true);
    const endY = calculateContentSegmentY(segment, systems, verticalPadding, false);

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
        sheetTarget: { complexId, sheetId },
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
    const folioSystemsLayout = calculateSystems(folioSettings, sheet, folio);
    const numberOfSystems = folioSystemsLayout.systems.lines.length;

    return {
        viewBox: new ViewBox((formatX + 2 * initialOffsetX) * factor, (formatY + 2 * initialOffsetY) * factor),
        sheet,
        systems: folioSystemsLayout.systems,
        contentSegments: folio.content
            .filter(content => isValidFolioContent(content, numberOfSystems))
            .map(content => calculateContentSegment(content, folioSystemsLayout, segmentOffsetCorrection)),
    };
}
