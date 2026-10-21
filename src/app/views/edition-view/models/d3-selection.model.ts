import { Selection } from 'd3-selection';

/**
 * The D3Selection type.
 *
 * It represents the selection of a d3 element.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- general selection type for the drawing code; element and datum types vary by call
export type D3Selection = Selection<any, any, any, any>;
