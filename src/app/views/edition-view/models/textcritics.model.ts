/**
 * The Textcritics class.
 *
 * It is used in the context of the edition view
 * to store the data for a single textcritical comment
 * from a textcritics json file.
 */
export class Textcritics {
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
 * The TextcriticsList class.
 *
 * It is used in the context of the edition view
 * to store the data for a list of textcritical comments
 * from a textcritics json file.
 */
export class TextcriticsList {
    /**
     * The array of textcritical comments from a textcritics list.
     */
    [key: string]: Textcritics[];
}
