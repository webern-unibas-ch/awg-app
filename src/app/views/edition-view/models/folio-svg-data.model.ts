import {
    FolioCalculation,
    FolioCalculationContentSegment,
    FolioCalculationLine,
    FolioCalculationPoint,
    FolioCalculationRectangle,
    FolioCalculationSheet,
    FolioCalculationSystems,
} from './folio-calculation.model';
import type { SheetClickEvent } from '../services/edition-navigation.service';

import { ViewBox } from './view-box.model';

/**
 * Constant: FOLIO_SVG_CONTENT_SEGMENT_GROUP_CLASS.
 *
 * It keeps the css class of the content segment groups of the rendered folio svgs
 * (drawn by the EditionFolioDrawingService, resolved by the EditionFolioSegmentService).
 */
export const FOLIO_SVG_CONTENT_SEGMENT_GROUP_CLASS = 'content-segment-group';

/**
 * The FolioSvgSheet class.
 *
 * It is used in the context of the edition folio convolutes
 * to store and expose the svg data for the sheet of a folio.
 */
export class FolioSvgSheet {
    /**
     * The id of the folio.
     */
    readonly folioId: string;

    /**
     * The rectangle of the sheet.
     */
    readonly rectangle: FolioCalculationRectangle;

    /**
     * The optional rectangle of the trademark on the sheet.
     */
    readonly trademarkRectangle?: FolioCalculationRectangle;

    /**
     * Constructor of the FolioSvgSheet class.
     *
     * It initializes the class with values from the folio sheet calculation.
     *
     * @param {FolioCalculationSheet} calculatedSheet The given calculated folio sheet.
     */
    constructor(calculatedSheet: FolioCalculationSheet) {
        this.folioId = calculatedSheet.FOLIO_ID;
        this.rectangle = calculatedSheet.SHEET_RECTANGLE;
        this.trademarkRectangle = calculatedSheet.TRADEMARK_RECTANGLE;
    }
}

/**
 * The FolioSvgSystems class.
 *
 * It is used in the context of the edition folio convolutes
 * to store and expose the svg data for the systems of a folio.
 */
export class FolioSvgSystems {
    /**
     * The positions of the system labels.
     */
    readonly labelPositions: FolioCalculationPoint[];

    /**
     * The lines of the systems (per system an array of its staff lines).
     */
    readonly lines: FolioCalculationLine[][];

    /**
     * The boolean flag if the systems are reversed.
     */
    readonly reversed: boolean;

    /**
     * Constructor of the FolioSvgSystems class.
     *
     * It initializes the class with values from the folio system calculation.
     *
     * @param {FolioCalculationSystems} calculatedSystems The given calculated folio systems.
     */
    constructor(calculatedSystems: FolioCalculationSystems) {
        this.labelPositions = calculatedSystems.SYSTEMS_LABEL_POSITIONS;
        this.lines = calculatedSystems.SYSTEMS_LINES;
        this.reversed = calculatedSystems.SYSTEMS_REVERSED;
    }
}

/**
 * The FolioSvgContentSegment class.
 *
 * It is used in the context of the edition folio convolutes
 * to store and expose the svg data for a content segment of a folio.
 */
export class FolioSvgContentSegment {
    /**
     * The ids (complex id and sheet id incl. partial) of the svg sheet of the content segment.
     */
    readonly sheetIds: SheetClickEvent;

    /**
     * The key of the text that is shown in a modal
     * if the content segment cannot be selected.
     */
    readonly linkTo: string;

    /**
     * The boolean flag if the content segment can be selected.
     */
    readonly selectable: boolean;

    /**
     * The label of the content segment.
     */
    readonly label: string;

    /**
     * The lines of the label of the content segment (sigle and addendum).
     */
    readonly labelLines: string[];

    /**
     * The boolean flag if the content segment is reversed.
     */
    readonly reversed: boolean;

    /**
     * The vertices of the content segment polygon (as svg points string).
     */
    readonly vertices: string;

    /**
     * The center point of the content segment.
     */
    readonly center: FolioCalculationPoint;

    /**
     * Constructor of the FolioSvgContentSegment class.
     *
     * It initializes the class with values from the folio content segment calculation.
     *
     * @param {FolioCalculationContentSegment} calculatedContentSegment The given calculated folio content segment.
     */
    constructor(calculatedContentSegment: FolioCalculationContentSegment) {
        this.sheetIds = {
            complexId: calculatedContentSegment.complexId,
            sheetId: calculatedContentSegment.sheetId,
        };
        this.linkTo = calculatedContentSegment.linkTo;
        this.selectable = calculatedContentSegment.selectable;
        this.label = calculatedContentSegment.segmentLabel;
        this.labelLines = calculatedContentSegment.segmentLabelArray;
        this.reversed = calculatedContentSegment.reversed;
        this.vertices = calculatedContentSegment.vertices;
        this.center = new FolioCalculationPoint(
            calculatedContentSegment.centeredXPosition,
            calculatedContentSegment.centeredYPosition
        );
    }
}

/**
 * The FolioSvgData class.
 *
 * It is used in the context of the edition folio convolutes
 * to store and expose the svg data (sheet, systems, content segments and view box) for a folio.
 */
export class FolioSvgData {
    /**
     * The sheet of the folio.
     */
    readonly sheet: FolioSvgSheet;

    /**
     * The systems of the folio.
     */
    readonly systems: FolioSvgSystems;

    /**
     * The content segments of the folio.
     */
    readonly contentSegments: FolioSvgContentSegment[];

    /**
     * The view box of the svg of the folio.
     */
    readonly viewBox: ViewBox;

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
        this.viewBox = calculation.VIEW_BOX;
    }
}
