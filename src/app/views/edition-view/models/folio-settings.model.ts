/**
 * The folio settings class.
 *
 * It is used to store the basic settings of the edition folios.
 */
export class FolioSettings {
    /**
     * The zoom factor to be applied.
     */
    factor: number;

    /**
     * The x value (width) of the folio format.
     */
    formatX: number;

    /**
     * The y value (height) of the folio format.
     */
    formatY: number;

    /**
     * The initial offset (x-position) to be applied.
     */
    initialOffsetX: number;

    /**
     * The initial offset (y-position) to be applied.
     */
    initialOffsetY: number;

    /**
     * The number of folios.
     */
    numberOfFolios: number;
}
