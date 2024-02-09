/**
 * The LinkBox class.
 *
 * It is used in the context of the edition view
 * to store the data for a single link box
 * from a textcritics json file.
 */
export class EditionSvgLinkBox {
    /**
     * The svgGroupId of the link box.
     */
    svgGroupId?: string;

    /**
     * The link to another svg.
     */
    linkTo: { complexId: string; sheetId: string };
}
