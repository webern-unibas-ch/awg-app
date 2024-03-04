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
 * The FolioCalculationContentSegmentCenteredPositions class.
 *
 * It is used in the context of the edition folio convolutes
 * to calculate the centered positions of a content segment on the folio canvas.
 *
 * Not exposed, only called internally from {@link FolioCalculation}.
 */
class FolioCalculationContentSegmentCenteredPositions {
    /**
     * The centered X position of the content segment (number).
     */
    public readonly CENTERED_X_POSITION: number;

    /**
     * The centered Y position of the content segment (number).
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
     * The label for the content segment (string).
     */
    public readonly SEGMENT_LABEL: string;

    /**
     * The array of label strings for the content segment (string[]).
     */
    public readonly SEGMENT_LABEL_ARRAY: string[];

    /**
     * The label offset for the content segment (number).
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
     * The vertices of a content segment as a string (string).
     */
    public readonly VERTICES_AS_STRING: string;

    /**
     * Constructor of the FolioCalculationContentSegmentVertices class.
     *
     * It initializes the class with four points
     * for upper and lower left and upper and lower right vertices.
     *
     * @param {FolioSection} section The given section of the folio content.
     * @param {FolioCalculationSystems} systems The given calculated systems.
     * @param {number} sectionPartition The given section partition.
     * @param {number} segmentOffsetCorrection The given segment offset correction.
     */
    constructor(
        section: FolioSection,
        private systems: FolioCalculationSystems,
        private sectionPartition: number,
        private segmentOffsetCorrection: number
    ) {
        const { startX, startY, endX, endY } = this._calculateVertices(section);

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
     * @param {FolioSection} section The given section of the folio content.
     * @returns {FolioCalculationPoint} The calculated vertices of a content segment.
     */
    private _calculateVertices(section: FolioSection): { startX: number; startY: number; endX: number; endY: number } {
        const startX = this._calculateX(section, true);
        const endX = this._calculateX(section, false);
        const startY = this._calculateY(section, true);
        const endY = this._calculateY(section, false);

        return { startX, startY, endX, endY };
    }

    /**
     * Private method: _calculateX.
     *
     * It calculates the x value of the content segment vertices.
     *
     * @param {FolioSection} section The given section of the folio content.
     * @param {boolean} isStart The given flag if the x value is for the start.
     * @returns {number} The calculated the content segment vertices.
     */
    private _calculateX(section: FolioSection, isStart: boolean): number {
        const width = round(this.systems.SYSTEMS_DIMENSIONS.SYSTEMS_WIDTH / this.sectionPartition, 2);

        const systemIndex = section.position && section.position <= this.sectionPartition ? section.position - 1 : 0;
        const baseX = this.systems.SYSTEMS_DIMENSIONS.START_X;
        const offset = this.segmentOffsetCorrection / 2;

        const xValue = baseX + systemIndex * width + offset;
        const correction = isStart ? 0 : width - this.segmentOffsetCorrection;

        return round(xValue + correction, 2);
    }

    /**
     * Private method: _calculateY.
     *
     * It calculates the y value of the content segment vertices.
     *
     * @param {FolioSection} section The given section of the folio content.
     * @param {boolean} isStart The given flag if the y value is for the start.
     * @returns {number} The calculated y value of the content segment vertices.
     */
    private _calculateY(section: FolioSection, isStart: boolean): number {
        const systemIndex = isStart ? section.startSystem - 1 : section.endSystem - 1;
        const systemLines = this.systems.SYSTEMS_LINES.SYSTEMS_ARRAYS[systemIndex];

        const yValue = isStart ? systemLines.at(0).START_POINT.y : systemLines.at(-1).END_POINT.y;
        const correction = this.segmentOffsetCorrection * (isStart ? -1 : 1);

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
     * The centered X position of the content segment (number).
     */
    centeredXPosition: number;

    /**
     * The centered y position of the content segment (number).
     */
    centeredYPosition: number;

    /**
     * The label for the id of the edition complex of the content segment (string).
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
     * The section of a content segment (FolioSection).
     */
    section: FolioSection;

    /**
     * The section partition of the content segment (number).
     */
    sectionPartition: number;

    /**
     * The array of label strings for the content segment (string[]).
     */
    segmentLabelArray: string[];

    /**
     * The label for the content segment (string).
     */
    segmentLabel: string;

    /**
     * The boolean flag if the content segment can be selected.
     */
    selectable: boolean;

    /**
     * The label for the id of the content segment (string).
     */
    sheetId: string;

    /**
     * The label for the sigle of the content segment (string).
     */
    sigle: string;

    /**
     * The label for the sigle addendum of the content segment (string).
     */
    sigleAddendum: string;

    /**
     * The vertices of a content segment (FolioCalculationContentSegmentVertices).
     */
    vertices: FolioCalculationContentSegmentVertices;

    /**
     * Constructor of the FolioCalculationContentSegment class.
     *
     * It initializes the class with values from the content segment,
     * the calculated systems and the segment offset correction.
     *
     * @param {FolioContent} content The given content segment.
     * @param {FolioCalculationSystems} systems The given calculated systems.
     * @param {number} segmentOffsetCorrection The given segment offset correction.
     */
    constructor(
        content: FolioContent,
        private systems: FolioCalculationSystems,
        private segmentOffsetCorrection: number
    ) {
        this.sectionPartition = content.sectionPartition ?? 1;

        this._getContentSections(content);
    }

    /**
     * Private method: _getContentSections.
     *
     * It gets the sections of a given folio content.
     *
     * @param {FolioContent} content The given folio content.
     * @returns {void} Gets the sections of a given folio content.
     */
    private _getContentSections(content: FolioContent): void {
        if (!content.sections) {
            console.error('No sections array in content', content);
            return;
        }
        if (content.sections.length > this.sectionPartition) {
            console.error('Sections array is bigger than sectionPartition');
            return;
        }
        if (this.systems.NUMBER_OF_SYSTEMS === 0) {
            console.error('No systems in folio');
            return;
        }
        content.sections.forEach((section: FolioSection, _sectionIndex: number) => {
            this._setProperties(content, section);
        });
    }

    /**
     * Private method: setProperties.
     *
     * It sets the properties of a content segment.
     *
     * @param {FolioContent} content The given folio content.
     * @param {FolioSection} section The given section of the folio content.
     * @returns {void} Sets the properties of a content segment.
     */
    private _setProperties(content: FolioContent, section: FolioSection): void {
        const { complexId, sheetId, selectable = true, reversed = false, linkTo = '', sigle, sigleAddendum } = content;

        this.section = section;

        const label = new FolioCalculationContentSegmentLabel(sigle, sigleAddendum);

        this.vertices = new FolioCalculationContentSegmentVertices(
            section,
            this.systems,
            this.sectionPartition,
            this.segmentOffsetCorrection
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
     * The horizontal margin factor of the systems (number).
     */
    private static readonly HORIZONTAL_MARGIN_FACTOR = 1 / 6;

    /**
     * The vertical margin factor of the systems (number).
     */
    private static readonly VERTICAL_MARGIN_FACTOR = 0.05;

    /**
     * The horizontal margins of the systems (number).
     */
    public readonly HORIZONTAL_MARGINS: number;

    /**
     * The left margin of the systems (number).
     */
    public readonly LEFT_MARGIN: number;

    /**
     * The lower margin of the systems (number).
     */
    public readonly LOWER_MARGIN: number;

    /**
     * The right margin of the systems (number).
     */
    public readonly RIGHT_MARGIN: number;

    /**
     * The upper margin of the systems (number).
     */
    public readonly UPPER_MARGIN: number;

    /**
     * The vertical margins of the systems (number).
     */
    public readonly VERTICAL_MARGINS: number;

    /**
     * Constructor of the FolioCalculationSystemsMargins class.
     *
     * It initializes the class with values
     * from the sheet and the number of systems.
     *
     * @param {FolioCalculationSheet} sheet The given calculated folio sheet.
     */
    constructor(private sheet: FolioCalculationSheet) {
        this.UPPER_MARGIN = this._calculateSheetMargin(
            this.sheet.SHEET_HEIGHT,
            FolioCalculationSystemsMargins.VERTICAL_MARGIN_FACTOR
        );
        this.LOWER_MARGIN = this.UPPER_MARGIN;

        this.LEFT_MARGIN = this._calculateSheetMargin(
            this.sheet.SHEET_WIDTH,
            FolioCalculationSystemsMargins.HORIZONTAL_MARGIN_FACTOR
        );
        this.RIGHT_MARGIN = this._calculateSheetMargin(
            this.sheet.SHEET_WIDTH,
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
     * The end position (x-value) of the systems (number).
     */
    public readonly END_X: number;

    /**
     * The end position (y-value) of the systems (number).
     */
    public readonly END_Y: number;

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
     * The height of the systems (number).
     */
    public readonly SYSTEMS_HEIGHT: number;

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
        const { SHEET_WIDTH, SHEET_HEIGHT, UPPER_LEFT_CORNER } = this.sheet;
        const { HORIZONTAL_MARGINS, VERTICAL_MARGINS, LEFT_MARGIN, UPPER_MARGIN } = this.systemsMargins;

        this.SYSTEMS_WIDTH = SHEET_WIDTH - HORIZONTAL_MARGINS;
        this.SYSTEMS_HEIGHT = SHEET_HEIGHT - VERTICAL_MARGINS;

        this.START_X = UPPER_LEFT_CORNER.x + LEFT_MARGIN;
        this.START_Y = UPPER_LEFT_CORNER.y + UPPER_MARGIN;

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
        const { START_X, END_X } = this.systemsDimensions;
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
     * The number of systems (number).
     */
    public readonly NUMBER_OF_SYSTEMS: number;

    /**
     * The labels of the systems (FolioCalculationSystemsLabels).
     */
    public readonly SYSTEMS_LABELS: FolioCalculationSystemsLabels;

    /**
     * The lines of the systems (FolioCalculationSystemsLines).
     */
    public readonly SYSTEMS_LINES: FolioCalculationSystemsLines;

    /**
     * The calculated margins of the systems (FolioCalculationSystemsMarginCalculator).
     */
    public readonly SYSTEMS_MARGINS: FolioCalculationSystemsMargins;

    /**
     * The calculated dimensions of the systems (FolioCalculationSystemsDimensions).
     */
    public readonly SYSTEMS_DIMENSIONS: FolioCalculationSystemsDimensions;

    /**
     * The zoom factor (number).
     */
    public readonly ZOOM_FACTOR: number;

    /**
     * Constructor of the FolioCalculationSheet class.
     *
     * It initializes the class with values
     * from the calculated folio sheet, the systems string and the zoom factor.
     *
     * @param {FolioCalculationSheet} sheet The given calculated folio sheet.
     * @param {string} systems The given systems string.
     * @param {number} factor The given zoom factor.
     */
    constructor(sheet: FolioCalculationSheet, systems: string, factor: number) {
        this.NUMBER_OF_SYSTEMS = systems ? parseInt(systems, 10) : 0;
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
     * The calculated values for the sheet
     * of a folio (FolioCalculationSheet).
     */
    public readonly SHEET: FolioCalculationSheet;

    /**
     * The calculated values for the systems
     * of a folio (FolioCalculationSystems).
     */
    public readonly SYSTEMS: FolioCalculationSystems;

    /**
     * The calculated values for content segments
     * of a folio (FolioCalculationContentSegment[]).
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
        this.SHEET = new FolioCalculationSheet(folioSettings, folioData.folioId);
        this.SYSTEMS = new FolioCalculationSystems(this.SHEET, folioData.systems, folioSettings.factor);
        this.CONTENT_SEGMENTS = folioData.content.map(
            (content: FolioContent) =>
                new FolioCalculationContentSegment(content, this.SYSTEMS, segmentOffsetCorrection)
        );
    }
}
