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
     * Constructor of the EditionSvgOverlay class.
     *
     * It initializes the class with values from the EditionSvgOverlayTypes and an id.
     *
     * @param {EditionSvgOverlayTypes} typeValue The given overlay type value.
     * @param {string} id The given id of the overlay.
     */
    constructor(typeValue: EditionSvgOverlayTypes, id: string) {
        this.type = typeValue;
        this.id = id;
        this.typeKey = this._getEnumKeyFromValue(typeValue);
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
