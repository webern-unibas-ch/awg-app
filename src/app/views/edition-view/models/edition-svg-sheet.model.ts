/**
 * The EditionSvgSheet class.
 *
 * It is used in the context of the edition view
 * to store the data for a single svg sheet
 * from a svg sheet json file.
 */
export class EditionSvgSheet {
    /**
     * The sheet's id (string).
     */
    id: string;

    /**
     * The path to the svg file of the sheet.
     */
    svg: string;

    /**
     * The path to an alternative image file of the sheet.
     */
    image: string;

    /**
     * The alternative label for the sheet.
     */
    alt: string;

    /**
     * The associated convolute of the sheet.
     */
    convolute: string;
}

/**
 * The EditionSvgSheetList class.
 *
 * It is used in the context of the edition view
 * to store the data for a svg sheet list
 * from a svg sheet json file.
 */
export class EditionSvgSheetList {
    /**
     * The array of sheets from a svg sheet list.
     */
    sheets: EditionSvgSheet[];
}
