/**
 * The CanvasZoomFilter type.
 *
 * It represents an extra filter for the events that may start a pan (e.g., not a pointer-down on a node).
 */
export type CanvasZoomFilter = (event: MouseEvent | TouchEvent) => boolean;
