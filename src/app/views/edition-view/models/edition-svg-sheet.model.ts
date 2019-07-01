/**
 * The EditionSvgSheet class.
 *
 * It is used in the context of the edition view
 * to store the data of a svg sheet
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
}
