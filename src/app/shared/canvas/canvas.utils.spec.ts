import { DestroyRef } from '@angular/core';

import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { CANVAS_UTILS, createFrameScheduler, eventToCanvasPoint } from './canvas.utils';

/**
 * Helper function: createTouchEvent.
 *
 * It creates a touch event with touches at the given client points.
 */
const createTouchEvent = (...touches: { clientX: number; clientY: number }[]): TouchEvent =>
    ({ touches }) as unknown as TouchEvent;

describe('CanvasUtils (DONE)', () => {
    describe('CANVAS_UTILS', () => {
        it('... should reference all canvas utils methods', () => {
            expectToEqual(CANVAS_UTILS, { createFrameScheduler, eventToCanvasPoint });
        });
    });

    describe('METHODS', () => {
        describe('#createFrameScheduler()', () => {
            let frameCallbacks: FrameRequestCallback[];
            let destroyCallbacks: (() => void)[];
            let destroyRef: DestroyRef;
            let cancelAnimationFrameSpy: MockInstance<typeof cancelAnimationFrame>;

            const flushFrames = (): void => {
                const callbacks = frameCallbacks.splice(0);
                callbacks.forEach(callback => callback(0));
            };
            const destroy = (): void => destroyCallbacks.forEach(callback => callback());

            beforeEach(() => {
                frameCallbacks = [];
                destroyCallbacks = [];
                // The id of a frame is its number of requested frames
                vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => frameCallbacks.push(callback));
                cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
                destroyRef = {
                    onDestroy: (callback: () => void) => {
                        destroyCallbacks.push(callback);
                        return () => undefined;
                    },
                } as unknown as DestroyRef;
            });

            afterEach(() => {
                vi.restoreAllMocks();
            });

            it('... should have a method `createFrameScheduler`', () => {
                expect(createFrameScheduler).toBeDefined();
            });

            it('... should run the callback once in the next animation frame for several requests', () => {
                const callback = vi.fn();
                const scheduler = createFrameScheduler(callback, destroyRef);

                scheduler.schedule();
                scheduler.schedule();

                expectToBe(frameCallbacks.length, 1);
                expectSpyCall(callback, 0);

                flushFrames();

                expectSpyCall(callback, 1);
            });

            it('... should run the callback again for a request after the frame', () => {
                const callback = vi.fn();
                const scheduler = createFrameScheduler(callback, destroyRef);

                scheduler.schedule();
                flushFrames();
                scheduler.schedule();
                flushFrames();

                expectSpyCall(callback, 2);
            });

            it('... should cancel a requested run on destroy', () => {
                const scheduler = createFrameScheduler(vi.fn(), destroyRef);
                scheduler.schedule();
                const frameId = frameCallbacks.length;

                destroy();

                expectSpyCall(cancelAnimationFrameSpy, 1, frameId);
            });

            it('... should not cancel anything on destroy without a requested run', () => {
                const scheduler = createFrameScheduler(vi.fn(), destroyRef);
                scheduler.schedule();
                flushFrames();

                destroy();

                expectSpyCall(cancelAnimationFrameSpy, 0);
            });
        });

        describe('#eventToCanvasPoint()', () => {
            let canvas: HTMLCanvasElement;

            beforeEach(() => {
                canvas = document.createElement('canvas');
                // The canvas starts at (100, 50) of the client area
                vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ left: 100, top: 50 } as DOMRect);
            });

            it('... should have a method `eventToCanvasPoint`', () => {
                expect(eventToCanvasPoint).toBeDefined();
            });

            it('... should return the point of a mouse event relative to the canvas', () => {
                const event = new MouseEvent('click', { clientX: 110, clientY: 70 });
                const point = eventToCanvasPoint(event, canvas);

                expectToEqual(point, { x: 10, y: 20 });
            });

            it('... should return the point of the first touch of a touch event relative to the canvas', () => {
                const event = createTouchEvent({ clientX: 130, clientY: 90 }, { clientX: 500, clientY: 500 });
                const point = eventToCanvasPoint(event, canvas);

                expectToEqual(point, { x: 30, y: 40 });
            });

            it('... should return undefined for a touch event without touches', () => {
                const point = eventToCanvasPoint(createTouchEvent(), canvas);

                expect(point).toBeUndefined();
            });

            it('... should return the point relative to the content of the canvas (without its border, like d3-drag)', () => {
                Object.defineProperty(canvas, 'clientLeft', { value: 2 });
                Object.defineProperty(canvas, 'clientTop', { value: 3 });
                const event = new MouseEvent('click', { clientX: 110, clientY: 70 });
                const point = eventToCanvasPoint(event, canvas);

                expectToEqual(point, { x: 8, y: 17 });
            });
        });
    });
});
