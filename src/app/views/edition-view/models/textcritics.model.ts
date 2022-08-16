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
     * The description of the textcritics.
     */
    description: string[];

    /**
     * The array of textcritical comments from a textcritics list.
     */
    comments: TextcriticalComment[];

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
