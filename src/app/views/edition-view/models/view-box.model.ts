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
     * Set to `100%` by default.
     */
    svgWidth: string;

    /**
     * The height of the svg (string).
     *
     * Set to `100%` by default.
     */
    svgHeight: string;

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
     * It sets the view box string from the given width and height.
     *
     * @param {number} width The width of the viewBox.
     * @param {number} height The height of the viewBox.
     */
    constructor(width: number, height: number) {
        // Set the viewBox string
        this.svgWidth = '100%';
        this.svgHeight = '100%';
        this.viewBox = `0 0 ${width} ${height}`;
    }
}
