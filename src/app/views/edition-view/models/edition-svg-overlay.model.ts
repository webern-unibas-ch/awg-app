/**
 * The EditionSvgOverlayTypes enumeration.
 *
 * It stores the possible svg overlay types.
 */
export enum EditionSvgOverlayTypes {
    dataTkkId = 'data-tkk-id',
    linkBox = 'link-box',
    tkk = 'tkk',
}

/**
 * The EditionSvgOverlayActionTypes enumeration.
 *
 * It stores the possible svg overlay action types.
 */
export enum EditionSvgOverlayActionTypes {
    hover = 'hover',
    fill = 'fill',
    transparent = 'transparent',
}

/**
 * The EditionSvgOverlayState interface.
 *
 * It stores the state of the svg overlays,
 * including the available and selected overlays.
 */
export interface EditionSvgOverlayState {
    /**
     * An array of available svg overlays.
     */
    available: EditionSvgOverlay[];

    /**
     * An array of selected svg overlays.
     */
    selected: EditionSvgOverlay[];
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
     * The key string of an svg overlay type (EditionSvgOverlayTypes).
     */
    typeKey: string;

    /**
     * A boolean value indicating whether the overlay is selected.
     */
    isSelected?: boolean;

    /**
     * Constructor of the EditionSvgOverlay class.
     *
     * It initializes the class with values from the EditionSvgOverlayTypes, data id, and actual id.
     *
     * @param {EditionSvgOverlayTypes} typeValue The given overlay type value.
     * @param {string} actualId The actual id of the SVG element (unique per element, if present).
     * @param {string} dataId The data id of the overlay (e.g., data-tkk-id value).
     * @param {boolean} [isSelected] The given boolean value indicating whether the overlay is selected.
     *
     */
    constructor(typeValue: EditionSvgOverlayTypes, actualId: string, dataId: string, isSelected?: boolean) {
        this.id = actualId;
        this.dataId = dataId;
        this.type = typeValue;
        this.typeKey = this._getEnumKeyFromValue(typeValue);
        this.isSelected = isSelected || false;
    }

    /**
     * Private method: _getEnumKeyFromValue.
     *
     * It gets the type of a string enum by its value.
     *
     * Cf. https://www.tutorialsteacher.com/typescript/typescript-enum
     *
     * @param {EditionSvgOverlayTypes} enumValue The given overlay enum value.
     *
     * @returns {string} Filtered key of the EditionSvgOverlayTypes.
     */
    private _getEnumKeyFromValue(enumValue: EditionSvgOverlayTypes): string {
        const enumKey: string = Object.keys(EditionSvgOverlayTypes)
            // Find key of enumValue
            .find((key: string) => EditionSvgOverlayTypes[key] === enumValue);
        return enumKey;
    }
}
