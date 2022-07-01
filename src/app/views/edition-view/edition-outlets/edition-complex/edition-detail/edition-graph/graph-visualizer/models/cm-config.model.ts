/**
 * The CmConfig interface.
 *
 * It represents the configuration for a code mirror editor object.
 */
export interface CmConfig {
    /**
     * A flag to display line numbers in the CM editor.
     */
    lineNumbers: boolean;

    /**
     * The first line number to display in the CM editor.
     */
    firstLineNumber: number;

    /**
     * A flag for line wrapping in the CM editor.
     */
    lineWrapping: true;

    /**
     * A flag for bracket matching in the CM editor.
     */
    matchBrackets: boolean;

    /**
     * The mode of the CM editor.
     */
    mode: string;
}
