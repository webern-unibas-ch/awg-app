import { FolioSettings } from './folio-settings.model';

/**
 * The ViewBox class.
 *
 * It is used for the calculation of the svg view box measures of the edition folios.
 * It takes folio settings as input to return the main svg view box values.
 */
export class ViewBox {
    /**
     * The width of the svg (string).
     *
     * Set to `100%`.
     */
    svgWidth = '100%';

    /**
     * The height of the svg (string).
     *
     * Set to `100%`.
     */
    svgHeight = '100%';

    /**
     * The svg viewBox attribute (string).
     *
     * Calculated in the constructor from the folio settings.
     *
     * @example
     * viewBox: `0 0 540 270`;
     */
    viewBox: string;

    /**
     * Constructor of the ViewBox class.
     *
     * It calculates the view box string from the folio settings.
     *
     * @param {FolioSettings} folioSettings The given folio settings.
     */
    constructor(folioSettings: FolioSettings) {
        // Calculate the width for the viewBox string
        const width = (folioSettings.formatX + 2 * folioSettings.initialOffsetX) * folioSettings.factor;

        // Calculate the height for the viewBox string
        const height = (folioSettings.formatY + 2 * folioSettings.initialOffsetY) * folioSettings.factor;

        // Set the viewBox string
        this.viewBox = '0 0 ' + width + ' ' + height;
    }
}
