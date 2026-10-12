/**
 * The IntroBlock interface.
 *
 * It is used in the context of the edition view
 * to store the data for a single intro block
 * from a intro json file.
 */
export interface IntroBlock {
    /**
     * The id of an intro block.
     */
    blockId: string;

    /**
     * The header of an intro block.
     */
    blockHeader: string;

    /**
     * The content array of an intro block.
     */
    blockContent: string[];

    /**
     * The notes array of an intro block.
     */
    blockNotes?: string[];
}

/**
 * The Intro interface.
 *
 * It is used in the context of the edition view
 * to store the data for a single intro
 * from a intro json file.
 */
export interface Intro {
    /**
     * The id of an intro.
     */
    id: string;

    /**
     * The content array of an intro.
     */
    content?: IntroBlock[];
}

/**
 * The IntroList class.
 *
 * It is used in the context of the edition view
 * to store the data for a intro list
 * from a intro json file.
 */
export class IntroList {
    /**
     * The array of intros from a intro list.
     */
    intro: Intro[] = [];
}
