/**
 * The SelectResponse interface.
 *
 * It represents the response of a select query.
 */
export interface SelectResponse {
    /**
     * The head of the select response with the variable names.
     */
    head: SelectResponseHead;

    /**
     * The body of the select response with the bindings.
     */
    body: SelectResponseBody;
}

/**
 * The SelectResponseHead interface.
 *
 * It represents the head of a select query response.
 */
export interface SelectResponseHead {
    /**
     * The variable names of the select response head.
     */
    vars: string[];
}

/**
 * The SelectResponseBody interface.
 *
 * It represents the body of a select query response.
 */
export interface SelectResponseBody {
    /**
     * The bindings of the select response body.
     */
    bindings: SelectResponseBindings[];
}

/**
 * The SelectResponseBindings interface.
 *
 * It represents the bindings of a select query response.
 */
export interface SelectResponseBindings {
    /**
     * The key-value pair bindings of the select response body.
     */
    [key: string]: any;
}
