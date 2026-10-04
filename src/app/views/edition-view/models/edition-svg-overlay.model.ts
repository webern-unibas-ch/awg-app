/**
 * The EditionSvgOverlayTypes enumeration.
 *
 * It stores the possible svg overlay type selectors and related
 * attribute-name constants (e.g., data attributes used to identify overlays).
 */
export enum EditionSvgOverlayTypes {
    dataTkkId = 'data-tkk-id',
    linkBox = 'link-box',
    tkk = 'tkk',
}

/**
 * The EditionSvgOverlayTarget type.
 *
 * It describes the svg overlay hit by a pointer event:
 * a tkk overlay (identified by its data id) or a link box (identified by its group id).
 */
export type EditionSvgOverlayTarget =
    { type: EditionSvgOverlayTypes.tkk; dataId: string } | { type: EditionSvgOverlayTypes.linkBox; id: string };

/**
 * The EditionSvgOverlayColorState interface.
 *
 * It describes the state the colors of the tkk overlays are derived from.
 */
export interface EditionSvgOverlayColorState {
    /**
     * The data ids of the selected tkk overlays.
     */
    selectedDataIds: ReadonlySet<string>;

    /**
     * The data id of the hovered tkk overlay, if any.
     */
    hoveredDataId: string | undefined;

    /**
     * A boolean flag whether the tkk overlays are highlighted (i.e., visible).
     */
    isHighlighted: boolean;
}

/**
 * The EditionSvgOverlay class.
 *
 * It is used in the context of the edition view
 * to store the data of a svg overlay.
 */
export class EditionSvgOverlay {
    /**
     * The actual id of the SVG element (unique per element, if present).
     */
    id: string;

    /**
     * The data id of an svg overlay (e.g., data-tkk-id value).
     */
    dataId: string;

    /**
     * The type of an svg overlay (EditionSvgOverlayTypes).
     */
    type: EditionSvgOverlayTypes;

    /**
     * Constructor of the EditionSvgOverlay class.
     *
     * It initializes the class with values from the EditionSvgOverlayTypes, data id, and actual id.
     * (The selection state of overlays is kept by the consuming component, not by the overlay itself.)
     *
     * @param {EditionSvgOverlayTypes} typeValue The given overlay type value.
     * @param {string} actualId The actual id of the SVG element (unique per element, if present).
     * @param {string} dataId The data id of the overlay (e.g., data-tkk-id value).
     */
    constructor(typeValue: EditionSvgOverlayTypes, actualId: string, dataId: string) {
        this.id = actualId;
        this.dataId = dataId;
        this.type = typeValue;
    }
}
