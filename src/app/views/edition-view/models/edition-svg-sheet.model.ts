/**
 * The EditionSvgSheetContent class.
 *
 * It is used in the context of the edition view
 * to store the data for the content of a single svg sheet
 * in a svg sheet json file.
 */
export class EditionSvgSheetContent {
    /**
     * The path to the svg file of the sheet.
     */
    svg: string;

    /**
     * The path to an alternative image file of the sheet.
     */
    image: string;

    /**
     * Optional: The sheet's content partial id as an extra to the sheet id (string).
     */
    partial?: string;

    /**
     * The associated convolute of the sheet.
     */
    convolute?: string;
}

/**
 * The EditionSvgSheet class.
 *
 * It is used in the context of the edition view
 * to store the data for a single svg sheet
 * in a svg sheet json file.
 */
export class EditionSvgSheet {
    /**
     * The sheet's id (string).
     */
    id: string;

    /**
     * The label for the sheet.
     */
    label: string;

    /**
     * The content of the sheet.
     */
    content: EditionSvgSheetContent[];
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
    sheets: {
        workEditions: EditionSvgSheet[];
        textEditions: EditionSvgSheet[];
        sketchEditions: EditionSvgSheet[];
    };
}
