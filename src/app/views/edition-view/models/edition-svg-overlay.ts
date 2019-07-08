/**
 * The EditionSvgOverlayTypes enumeration.
 *
 * It stores the possible svg overlay types.
 */
export enum EditionSvgOverlayTypes {
    measure = 'Takt',
    system = 'System',
    item = 'Anmerkung'
}

/**
 * The EditionSvgOverlay class.
 *
 * It is used in the context of the edition view
 * to store the data of a svg overlay.
 */
export class EditionSvgOverlay {
    /**
     * The type of an svg overlay (EditionSvgOverlayTypes).
     */
    type: EditionSvgOverlayTypes;

    /**
     * The id of an svg overlay.
     */
    id: string;

    /**
     * The type label of an svg overlay.
     */
    typeLabel?: string[];

    /**
     * Constructor of the EditionSvgOverlay class.
     *
     * It initializes the class with values from the EditionSvgOverlayTypes and an id.
     *
     * @param {EditionSvgOverlayTypes} type The given overlay type.
     * @param {string} id The given id of the overlay.
     */
    constructor(type: EditionSvgOverlayTypes, id: string) {
        this.type = type;
        this.id = id;
        if (!this.typeLabel) {
            this.typeLabel = EditionSvgOverlayTypes[type];
        }
    }
}
