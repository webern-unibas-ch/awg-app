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
 * The FolioSvgPoint interface.
 *
 * It is used in the context of the edition folio convolutes
 * to store a point (in px) on the folio svg.
 */
export interface FolioSvgPoint {
    /**
     * The x value (in px) of the point.
     */
    readonly x: number;

    /**
     * The y value (in px) of the point.
     */
    readonly y: number;
}

/**
 * The FolioSvgLine interface.
 *
 * It is used in the context of the edition folio convolutes
 * to store a line on the folio svg.
 */
export interface FolioSvgLine {
    /**
     * The starting point of the line.
     */
    readonly start: FolioSvgPoint;

    /**
     * The ending point of the line.
     */
    readonly end: FolioSvgPoint;
}

/**
 * The FolioSvgRectangle interface.
 *
 * It is used in the context of the edition folio convolutes
 * to store a rectangle on the folio svg.
 */
export interface FolioSvgRectangle {
    /**
     * The upper left corner of the rectangle.
     */
    readonly upperLeft: FolioSvgPoint;

    /**
     * The lower right corner of the rectangle.
     */
    readonly lowerRight: FolioSvgPoint;
}

/**
 * The FolioSvgSheet interface.
 *
 * It is used in the context of the edition folio convolutes
 * to store the svg data for the sheet of a folio.
 */
export interface FolioSvgSheet {
    /**
     * The id of the folio.
     */
    readonly folioId: string;

    /**
     * The rectangle of the sheet.
     */
    readonly rectangle: FolioSvgRectangle;

    /**
     * The optional rectangle of the trademark on the sheet.
     */
    readonly trademarkRectangle?: FolioSvgRectangle;
}

/**
 * The FolioSvgSystems interface.
 *
 * It is used in the context of the edition folio convolutes
 * to store the svg data for the systems of a folio.
 */
export interface FolioSvgSystems {
    /**
     * The positions of the system labels.
     */
    readonly labelPositions: FolioSvgPoint[];

    /**
     * The lines of the systems (per system an array of its staff lines).
     */
    readonly lines: FolioSvgLine[][];

    /**
     * The boolean flag if the systems are reversed.
     */
    readonly reversed: boolean;
}

/**
 * The FolioSvgContentSegment interface.
 *
 * It is used in the context of the edition folio convolutes
 * to store the svg data for a content segment of a folio.
 */
export interface FolioSvgContentSegment {
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
     * The center point of the content segment label.
     */
    readonly center: FolioSvgPoint;
}

/**
 * The FolioSvgData interface.
 *
 * It is used in the context of the edition folio convolutes
 * to store the svg data (sheet, systems, content segments and view box) for a folio,
 * as calculated by `calculateFolioSvgData` (see folio-calculation.model).
 */
export interface FolioSvgData {
    /**
     * The view box of the svg of the folio.
     */
    readonly viewBox: ViewBox;

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
}
