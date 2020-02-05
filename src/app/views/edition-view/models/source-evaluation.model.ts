/**
 * The SourceEvaluation class.
 *
 * It is used in the context of the edition view
 * to store the data for a single source evaluation
 * from a source evaluation json file.
 */
export class SourceEvaluation {
    /**
     * The id of a sourceEvaluation.
     */
    id: string;

    /**
     * The content array of a sourceEvaluation.
     */
    content: string[];
}

/**
 * The SourceEvaluationList class.
 *
 * It is used in the context of the edition view
 * to store the data for a source evaluation list
 * from a source evaluation json file.
 */
export class SourceEvaluationList {
    /**
     * The array of sources from a source evaluation list.
     */
    sources: SourceEvaluation[];
}
