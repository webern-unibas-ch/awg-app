import { DestroyRef } from '@angular/core';

import * as D3_SELECTION from 'd3-selection';

import { CanvasFrameScheduler, CanvasPoint } from './canvas.model';

/**
 * Utils method: createFrameScheduler.
 *
 * It creates a scheduler that runs the given callback at most once per animation frame
 * and cancels a requested run when the given DestroyRef is destroyed.
 *
 * @param {() => void} callback The given callback (e.g., a drawing of the canvas).
 * @param {DestroyRef} destroyRef The given DestroyRef of the owner of the scheduler.
 * @returns {CanvasFrameScheduler} The frame scheduler.
 */
export function createFrameScheduler(callback: () => void, destroyRef: DestroyRef): CanvasFrameScheduler {
    let frame: number | undefined;

    destroyRef.onDestroy(() => {
        if (frame !== undefined) {
            cancelAnimationFrame(frame);
        }
    });

    return {
        schedule: () => {
            if (frame !== undefined) {
                return;
            }
            frame = requestAnimationFrame(() => {
                frame = undefined;
                callback();
            });
        },
    };
}

/**
 * Utils method: eventToCanvasPoint.
 *
 * It gets the point of the given canvas of a given mouse or touch event (its first touch),
 * measured like d3-drag from the canvas content without border (so that clicks and drags match).
 *
 * @param {MouseEvent | TouchEvent} event The given event.
 * @param {HTMLCanvasElement} canvas The given canvas.
 * @returns {CanvasPoint | undefined} The point of the canvas, or undefined for a touch event without touches.
 */
export function eventToCanvasPoint(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): CanvasPoint | undefined {
    const source = 'touches' in event ? event.touches[0] : event;
    if (!source) {
        return undefined;
    }
    const [x, y] = D3_SELECTION.pointer(source, canvas);
    return { x, y };
}

/**
 * Utils constants: CANVAS_UTILS.
 *
 * It keeps a namespace reference to the canvas utils methods.
 */
export const CANVAS_UTILS = {
    createFrameScheduler,
    eventToCanvasPoint,
} as const;
