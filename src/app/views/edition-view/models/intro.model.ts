/**
 * The Intro class.
 *
 * It is used in the context of the edition view
 * to store the data for a single intro
 * from a intro json file.
 */
export class Intro {
    /**
     * The id of an intro.
     */
    id: string;

    /**
     * The content array of an intro.
     */
    content: string[];
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
    intro: Intro[];
}
