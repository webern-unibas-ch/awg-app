import { EditionTypeKey } from './edition-type.model';

/**
 * The EditionSvgSheetIds interface.
 *
 * It is used in the context of the edition view
 * to store the id and the full id (incl. partial)
 * of a (selected) svg sheet.
 */
export interface EditionSvgSheetIds {
    /**
     * The sheet's id (string).
     */
    id: string | undefined;

    /**
     * The sheet's full id, i.e. the sheet id incl. the selected partial id, if any (string).
     */
    fullId: string | undefined;
}

/**
 * The EditionSvgSheetContent interface.
 *
 * It is used in the context of the edition view
 * to store the data for the content of a single svg sheet
 * in a svg sheet json file.
 */
export interface EditionSvgSheetContent {
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
    convolute: string;
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
    id = '';

    /**
     * The label for the sheet.
     */
    label = '';

    /**
     * The content of the sheet.
     */
    content: EditionSvgSheetContent[] = [];
}

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
    sheets: { [key in EditionTypeKey]: EditionSvgSheet[] } = {
        workEditions: [],
        textEditions: [],
        sketchEditions: [],
    };
}

/**
 * The EditionSvgSheetContext interface.
 *
 * It is used in the context of the edition view
 * to store a (selected) svg sheet
 * together with its edition type.
 */
export interface EditionSvgSheetContext {
    /**
     * The svg sheet (with its content reduced to the selected partial, if any).
     */
    sheet: EditionSvgSheet;

    /**
     * The edition type of the svg sheet.
     */
    editionType: EditionTypeKey;

    /**
     * The full id of the svg sheet, i.e. the sheet id incl. the selected partial id, if any.
     * For a sheet with partials selected by its plain id, it is the full id of the first partial.
     */
    fullId: string;
}
