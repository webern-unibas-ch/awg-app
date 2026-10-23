/**
 * The AlertError interface.
 *
 * It defines the structure of an error object displayed in an error alert.
 */
export interface AlertError {
    /**
     * The optional key of the error source (displayed as label).
     */
    key?: string;

    /**
     * The error itself (e.g., an Error, an HTTP error response or a message string).
     */
    error: unknown;
}
