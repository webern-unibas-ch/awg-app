import { EditionSvgLinkBox } from './edition-svg-link-box.model';

/**
 * The TextcriticalBlock class.
 *
 * It is used in the context of the edition view
 * to store the data for a single textcritical block
 * from a textcritics json file.
 */
export class TextcriticalCommentBlock {
    /**
     * An optional header of the textcritical block.
     */
    blockHeader?: string;

    /**
     * The array of textcritical comments in the textcritical block.
     */
    blockComments: TextcriticalComment[];
}

/**
 * The TextcriticalComment class.
 *
 * It is used in the context of the edition view
 * to store the data for a single textcritical comment
 * from a textcritics json file.
 */
export class TextcriticalComment {
    /**
     * The svgGroupId of the textcritical comment.
     */
    svgGroupId?: string;

    /**
     * The measure that the textcritical comment is addressing.
     */
    measure: string;

    /**
     * The system that the textcritical comment is addressing.
     */
    system: string;

    /**
     * The position within the measure that the textcritical comment is addressing.
     */
    position: string;

    /**
     * The textcritical comment.
     */
    comment: string;
}

/**
 * The TextcriticalCommentary class.
 *
 * It is used in the context of the edition view
 * to store the data for the textcritical commentary
 * from a textcritics json file.
 */
export class TextcriticalCommentary {
    /**
     * The preamble of the textcritical commentary.
     */
    preamble: string;

    /**
     * The array of textcritical comment blocks from a textcritics list.
     */
    comments: TextcriticalCommentBlock[];
}

/**
 * The Textcritics class.
 *
 * It is used in the context of the edition view
 * to store the data for a single textcritical comment
 * from a textcritics json file.
 */
export class Textcritics {
    /**
     * The id of the textcritics.
     */
    id: string;

    /**
     * The label of the textcritics.
     */
    label: string;

    /**
     * The evaluations of the textcritics.
     */
    evaluations: string[];

    /**
     * The commentary of the textcritics.
     */
    commentary: TextcriticalCommentary;

    /**
     * The array of link boxes from a textcritics list.
     */
    linkBoxes?: EditionSvgLinkBox[];

    /**
     * A boolean flag to indicate if the textcritics describe a row table.
     */
    rowtable?: boolean;
}

/**
 * The TextcriticsList class.
 *
 * It is used in the context of the edition view
 * to store the data for a list of textcritical comments
 * from a textcritics json file.
 */
export class TextcriticsList {
    /**
     * The array of textcritics from a textcritics list.
     */
    textcritics: Textcritics[];
}
