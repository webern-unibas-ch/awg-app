/**
 * The Preface class.
 *
 * It is used in the context of the edition view
 * to store the data for a single preface
 * from a preface json file.
 */
export class Preface {
    /**
     * The id of a preface.
     */
    id: string;

    /**
     * The content array of a preface.
     */
    content: string[];
}

/**
 * The PrefaceList class.
 *
 * It is used in the context of the edition view
 * to store the data for a preface list
 * from a preface json file.
 */
export class PrefaceList {
    /**
     * The array of prefaces from a preface list.
     */
    preface: Preface[];
}
