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
 * The EDITION_SVG_SHEETS_KEYS const.
 *
 * It is used in the context of the edition view
 * to define the keys of a svg sheets list.
 */
export const EDITION_SVG_SHEETS_KEYS = ['workEditions', 'textEditions', 'sketchEditions'] as const;

/**
 * The EditionSvgSheetsKey type.
 *
 * It is used in the context of the edition view
 * to define the type of a svg sheet list.
 */
export type EditionSvgSheetsKey = (typeof EDITION_SVG_SHEETS_KEYS)[number];

/**
 * The EditionSvgSheetsList class.
 *
 * It is used in the context of the edition view
 * to store the data for a svg sheets list
 * from a svg sheet json file.
 */
export class EditionSvgSheetsList {
    /**
     * The array of sheets from a svg sheet list.
     */
    sheets: {
        [key in EditionSvgSheetsKey]: EditionSvgSheet[];
    };
}
