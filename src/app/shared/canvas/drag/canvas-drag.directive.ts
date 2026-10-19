import { Directive, ElementRef, inject, input, output } from '@angular/core';

import * as D3_DRAG from 'd3-drag';
import * as D3_SELECTION from 'd3-selection';

import { CanvasDragEvent, CanvasDragGesture, CanvasDragMove, CanvasDragSubjectAccessor } from './canvas-drag.model';

/**
 * The CanvasDrag directive.
 *
 * It binds a d3 drag behaviour to the host canvas and emits every move and the end of a drag.
 * Only gestures starting on a `dragSubject` are drags (others are left, e.g., to a pan), one touch at a time.
 */
@Directive({
    selector: 'canvas[awgCanvasDrag]',
})
export class CanvasDragDirective<T> {
    /**
     * Private readonly injection variable: _elementRef.
     *
     * It keeps the reference to the host canvas element.
     */
    private readonly _elementRef = inject<ElementRef<HTMLCanvasElement>>(ElementRef);

    /**
     * Readonly input signal: dragSubject.
     *
     * It holds the accessor that finds the drag subject at a given point of the canvas.
     */
    readonly dragSubject = input.required<CanvasDragSubjectAccessor<T>>();

    /**
     * Readonly output signal: dragMove.
     *
     * It emits the subject and the current point of the pointer on every move of a drag.
     */
    readonly dragMove = output<CanvasDragMove<T>>();

    /**
     * Readonly output signal: dragEnd.
     *
     * It emits the subject when a drag ends (a gesture with at least one move).
     */
    readonly dragEnd = output<T>();

    /**
     * Private readonly variable: _canvasEl.
     *
     * It keeps the host canvas element.
     */
    private readonly _canvasEl = this._elementRef.nativeElement;

    /**
     * Private readonly variable: _canvas.
     *
     * It keeps the D3 selection of the host canvas element.
     */
    private readonly _canvas = D3_SELECTION.select<HTMLCanvasElement, unknown>(this._canvasEl);

    /**
     * Private readonly variable: _dragBehaviour.
     *
     * It keeps the D3 drag behaviour bound to the host canvas element
     * (pointer positions relative to the canvas itself).
     */
    private readonly _dragBehaviour = D3_DRAG.drag<HTMLCanvasElement, unknown, CanvasDragGesture<T>>()
        .container(() => this._canvasEl)
        // A gesture without subject is ignored by d3-drag, but its typings require a subject
        .subject((event: CanvasDragEvent<T>) => this._findGesture(event) as CanvasDragGesture<T>)
        .on('start', (event: CanvasDragEvent<T>) => {
            this._activeGesture = event.subject;
        })
        .on('drag', (event: CanvasDragEvent<T>) => {
            event.subject.isMoved = true;
            this.dragMove.emit({ subject: event.subject.subject, point: { x: event.x, y: event.y } });
        })
        .on('end', (event: CanvasDragEvent<T>) => {
            this._activeGesture = undefined;
            // D3-drag also ends a gesture without move (a click), which is no drag
            if (event.subject.isMoved) {
                this.dragEnd.emit(event.subject.subject);
            }
        });

    /**
     * Private variable: _activeGesture.
     *
     * It keeps the gesture of the running drag, if any.
     */
    private _activeGesture: CanvasDragGesture<T> | undefined;

    /**
     * Constructor of the CanvasDragDirective.
     *
     * It binds the drag behaviour to the host canvas element.
     */
    constructor() {
        this._canvas.call(this._dragBehaviour);
    }

    /**
     * Private method: _findGesture.
     *
     * It finds the drag subject at the start point of a given gesture and wraps it (not moved yet).
     * D3-drag ignores a gesture without subject, or a further touch during a drag (a mouse gesture replaces it).
     *
     * @param {CanvasDragEvent<T>} event The given d3 drag event (before the start).
     * @returns {CanvasDragGesture<T> | undefined} The wrapped drag subject (undefined if none is found).
     */
    private _findGesture(event: CanvasDragEvent<T>): CanvasDragGesture<T> | undefined {
        if (this._activeGesture && event.identifier !== 'mouse') {
            return undefined;
        }
        const subject = this.dragSubject()({ x: event.x, y: event.y });
        return subject === undefined ? undefined : { subject, isMoved: false };
    }
}
