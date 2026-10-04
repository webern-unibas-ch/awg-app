/**
 * The DATA_TKK_ID constant.
 *
 * It keeps the name of the data attribute that links the parts of a multi-part tkk overlay.
 */
export const DATA_TKK_ID = 'data-tkk-id';

/**
 * The EditionSvgOverlayTypes enumeration.
 *
 * It stores the possible types of svg overlays
 * (identical to the class names of their svg groups).
 */
export enum EditionSvgOverlayTypes {
    linkBox = 'link-box',
    tkk = 'tkk',
}

/**
 * The EditionSvgOverlayLinkBox interface.
 *
 * It describes a link box overlay of an svg sheet
 * (a link box drawn in the svg sheet itself).
 */
export interface EditionSvgOverlayLinkBox {
    /**
     * The type of the svg overlay.
     */
    type: EditionSvgOverlayTypes.linkBox;

    /**
     * The id of the link box group (refers to the `svgGroupId` of the link boxes).
     */
    id: string;
}

/**
 * The EditionSvgOverlayTkk interface.
 *
 * It describes a tkk overlay of an svg sheet
 * (an overlay box drawn over a tkk group of the svg sheet).
 */
export interface EditionSvgOverlayTkk {
    /**
     * The type of the svg overlay.
     */
    type: EditionSvgOverlayTypes.tkk;

    /**
     * The id of the tkk group (refers to the `svgGroupId` of the textcritical comments).
     */
    id: string;

    /**
     * The data id of the tkk overlay (shared by all parts of a multi-part tkk overlay).
     */
    dataId: string;
}

/**
 * The EditionSvgOverlay type.
 *
 * It describes an svg overlay of an svg sheet: a tkk overlay or a link box overlay.
 */
export type EditionSvgOverlay = EditionSvgOverlayTkk | EditionSvgOverlayLinkBox;

/**
 * The EditionSvgOverlaysState interface.
 *
 * It describes the state of the svg overlays of a rendered svg sheet
 * (available tkk overlays, selection, hover and highlighting; link boxes have no state).
 */
export interface EditionSvgOverlaysState {
    /**
     * The available tkk overlays of the rendered svg sheet.
     */
    tkkOverlays: EditionSvgOverlayTkk[];

    /**
     * The data ids of the selected tkk overlays.
     */
    selectedDataIds: ReadonlySet<string>;

    /**
     * The data id of the hovered tkk overlay, if any.
     */
    hoveredDataId: string | undefined;

    /**
     * A boolean flag whether the tkk overlays are highlighted (i.e., visible; set by the additions panel).
     */
    isHighlighted: boolean;
}
