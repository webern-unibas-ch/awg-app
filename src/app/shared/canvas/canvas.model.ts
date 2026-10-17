/**
 * The CanvasBounds interface.
 *
 * It represents an area of a canvas (in css pixels) by its smallest and largest corner.
 */
export interface CanvasBounds {
    /**
     * The corner with the smallest coordinates (top left).
     */
    readonly min: CanvasPoint;

    /**
     * The corner with the largest coordinates (bottom right).
     */
    readonly max: CanvasPoint;
}

/**
 * The CanvasFrameScheduler interface.
 *
 * It represents a scheduler that runs a callback at most once per animation frame.
 */
export interface CanvasFrameScheduler {
    /**
     * It requests one run of the callback in the next animation frame (several requests are coalesced).
     */
    readonly schedule: () => void;
}

/**
 * The CanvasPoint interface.
 *
 * It represents a point of a canvas (in css pixels, relative to the top left corner of the canvas).
 */
export interface CanvasPoint {
    /**
     * The x coordinate.
     */
    readonly x: number;

    /**
     * The y coordinate.
     */
    readonly y: number;
}

/**
 * The CanvasSize interface.
 *
 * It represents the rendered size of a canvas (in css pixels).
 */
export interface CanvasSize {
    /**
     * The width of the canvas in css pixels.
     */
    readonly width: number;

    /**
     * The height of the canvas in css pixels.
     */
    readonly height: number;
}

/**
 * The CanvasViewport interface.
 *
 * It represents the rendered size of a canvas (in css pixels) and its device pixel ratio.
 */
export interface CanvasViewport extends CanvasSize {
    /**
     * The device pixel ratio (backing store pixels per css pixel).
     */
    readonly dpr: number;
}
