import type { D3DragEvent } from 'd3-drag';

import type { CanvasPoint } from '../canvas.model';

/**
 * The CanvasDragEvent type.
 *
 * It represents a d3 drag event on a canvas element.
 */
export type CanvasDragEvent<T> = D3DragEvent<HTMLCanvasElement, unknown, CanvasDragGesture<T>>;

/**
 * The CanvasDragGesture interface.
 *
 * It represents the found subject of a d3 drag gesture and the flag if it has been moved,
 * wrapped without x/y (d3 then reports canvas coordinates).
 */
export interface CanvasDragGesture<T> {
    /**
     * The found drag subject.
     */
    readonly subject: T;

    /**
     * The flag if the subject has been moved during the gesture (a gesture without move is no drag, e.g., a click).
     */
    isMoved: boolean;
}

/**
 * The CanvasDragMove interface.
 *
 * It represents a move of a drag gesture on a canvas.
 */
export interface CanvasDragMove<T> {
    /**
     * The dragged subject.
     */
    readonly subject: T;

    /**
     * The current point of the pointer on the canvas.
     */
    readonly point: CanvasPoint;
}

/**
 * The CanvasDragSubjectAccessor type.
 *
 * It represents a function that finds the drag subject at a point of the canvas (undefined: no drag).
 */
export type CanvasDragSubjectAccessor<T> = (point: CanvasPoint) => T | undefined;
