import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectToBe, expectToEqual } from './expect-helper';

import { createFakeCanvasContext, MockMediaQueryList, stubMatchMedia } from './canvas-helper';

describe('CanvasHelper (DONE)', () => {
    describe('#createFakeCanvasContext()', () => {
        it('... should have a function `createFakeCanvasContext`', () => {
            expect(createFakeCanvasContext).toBeDefined();
        });

        it('... should return a context without calls', () => {
            expectToEqual(createFakeCanvasContext().calls, []);
        });

        it('... should return a context with a canvas of the default size of the backing store', () => {
            const ctx = createFakeCanvasContext();

            expectToEqual({ width: ctx.canvas.width, height: ctx.canvas.height }, { width: 300, height: 150 });
        });

        it('... should return a context with a canvas of a given size of the backing store', () => {
            const ctx = createFakeCanvasContext({ width: 800, height: 400 });

            expectToEqual({ width: ctx.canvas.width, height: ctx.canvas.height }, { width: 800, height: 400 });
        });

        it('... should record the calls of the drawing methods with their arguments', () => {
            const ctx = createFakeCanvasContext();

            ctx.beginPath();
            ctx.moveTo(1, 2);
            ctx.lineTo(3, 4);

            expectToEqual(
                ctx.calls.map(call => [call.method, call.args]),
                [
                    ['beginPath', []],
                    ['moveTo', [1, 2]],
                    ['lineTo', [3, 4]],
                ]
            );
        });

        it('... should record the style state at the time of a call', () => {
            const ctx = createFakeCanvasContext();

            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.font = '12px serif';
            ctx.fillText('a', 0, 0);
            ctx.fillStyle = 'green';

            const [call] = ctx.calls;

            expectToBe(call.fillStyle, 'red');
            expectToBe(call.strokeStyle, 'blue');
            expectToBe(call.lineWidth, 2);
            expectToBe(call.font, '12px serif');
        });

        it('... should hold the calls of a given method', () => {
            const ctx = createFakeCanvasContext();

            ctx.fill();
            ctx.stroke();
            ctx.fill();

            expectToBe(ctx.callsOf('fill').length, 2);
            expectToBe(ctx.callsOf('stroke').length, 1);
        });
    });

    describe('#stubMatchMedia()', () => {
        afterEach(() => {
            vi.unstubAllGlobals();
        });

        it('... should have a function `stubMatchMedia`', () => {
            expect(stubMatchMedia).toBeDefined();
        });

        it('... should stub the global matchMedia with MockMediaQueryLists of the given media query', () => {
            stubMatchMedia();

            const mediaQueryList = window.matchMedia('(resolution: 2dppx)');

            expect(mediaQueryList).toBeInstanceOf(MockMediaQueryList);
            expectToBe(mediaQueryList.media, '(resolution: 2dppx)');
        });

        it('... should return all created media query lists', () => {
            const mockMediaQueryLists = stubMatchMedia();

            const mediaQueryList1 = window.matchMedia('(resolution: 1dppx)');
            const mediaQueryList2 = window.matchMedia('(resolution: 2dppx)');

            expectToEqual<object[]>(mockMediaQueryLists, [mediaQueryList1, mediaQueryList2]);
            expectToBe<object>(mockMediaQueryLists[0], mediaQueryList1);
        });

        it('... should call the added listeners on trigger', () => {
            const mockMediaQueryLists = stubMatchMedia();
            const listener = vi.fn();

            window.matchMedia('(resolution: 1dppx)').addEventListener('change', listener);
            mockMediaQueryLists[0].trigger();

            expect(listener).toHaveBeenCalledTimes(1);
        });

        it('... should call a listener added with `once` only on the first trigger', () => {
            const mockMediaQueryLists = stubMatchMedia();
            const listener = vi.fn();

            window.matchMedia('(resolution: 1dppx)').addEventListener('change', listener, { once: true });
            mockMediaQueryLists[0].trigger();
            mockMediaQueryLists[0].trigger();

            expect(listener).toHaveBeenCalledTimes(1);
        });

        it('... should not call the removed listeners on trigger', () => {
            const mockMediaQueryLists = stubMatchMedia();
            const listener = vi.fn();
            const mediaQueryList = window.matchMedia('(resolution: 1dppx)');

            mediaQueryList.addEventListener('change', listener);
            mediaQueryList.removeEventListener('change', listener);
            mockMediaQueryLists[0].trigger();

            expect(listener).not.toHaveBeenCalled();
        });
    });
});
