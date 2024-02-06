/**
 * The EditionSvgOverlayTypes enumeration.
 *
 * It stores the possible svg overlay types.
 */
export enum EditionSvgOverlayTypes {
    measure = 'Takt',
    system = 'System',
    item = 'Anmerkung',
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
 * The EditionSvgOverlay class.
 *
 * It is used in the context of the edition view
 * to store the data of a svg overlay.
 */
export class EditionSvgOverlay {
    /**
     * The id of an svg overlay.
     */
    id: string;

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
     * It initializes the class with values from the EditionSvgOverlayTypes and an id.
     *
     * @param {EditionSvgOverlayTypes} typeValue The given overlay type value.
     * @param {string} id The given id of the overlay.
     * @param {boolean} [isSelected] The given boolean value indicating whether the overlay is selected.
     *
     */
    constructor(typeValue: EditionSvgOverlayTypes, id: string, isSelected?: boolean) {
        this.type = typeValue;
        this.id = id;
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
