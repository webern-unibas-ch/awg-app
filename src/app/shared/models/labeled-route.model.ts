/**
 * The LabeledRoute interface.
 *
 * It defines the structure of a labeled route.
 */
export interface LabeledRoute {
    /**
     * The label of the route.
     */
    readonly label: string;

    /**
     * The route segments.
     */
    readonly route: string[];
}
