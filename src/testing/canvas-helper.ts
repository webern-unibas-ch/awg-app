import { vi } from 'vitest';

/**
 * The CanvasCall interface.
 *
 * It represents a recorded call of a method of a fake 2D canvas context
 * with the style state at the time of the call.
 */
export interface CanvasCall {
    /**
     * The name of the called method.
     */
    readonly method: string;

    /**
     * The arguments of the call.
     */
    readonly args: unknown[];

    /**
     * The fill style at the time of the call.
     */
    readonly fillStyle: unknown;

    /**
     * The stroke style at the time of the call.
     */
    readonly strokeStyle: unknown;

    /**
     * The line width at the time of the call.
     */
    readonly lineWidth: number;

    /**
     * The font at the time of the call.
     */
    readonly font: string;
}

/**
 * The FakeCanvasContext type.
 *
 * It represents a fake 2D canvas context that records its method calls
 * (jsdom does not implement the canvas).
 */
export type FakeCanvasContext = CanvasRenderingContext2D & {
    /**
     * The recorded calls.
     */
    readonly calls: CanvasCall[];

    /**
     * Gets the recorded calls of the given method.
     */
    callsOf(method: string): CanvasCall[];
};

/**
 * The FakeCanvasSize type.
 *
 * It represents the size of the backing store of the canvas of a fake 2D canvas context.
 */
export type FakeCanvasSize = Pick<HTMLCanvasElement, 'width' | 'height'>;

/**
 * Constant: RECORDED_CANVAS_METHODS.
 *
 * It keeps the names of the methods recorded by the fake 2D canvas context.
 */
const RECORDED_CANVAS_METHODS = [
    'arc',
    'beginPath',
    'clearRect',
    'closePath',
    'ellipse',
    'fill',
    'fillText',
    'lineTo',
    'moveTo',
    'rect',
    'restore',
    'save',
    'setTransform',
    'stroke',
] as const;

/**
 * Helper function: createFakeCanvasContext.
 *
 * It creates a fake 2D canvas context that records all calls of the drawing methods
 * together with the current fill/stroke style, line width and font.
 * Its canvas has the given size of the backing store.
 *
 * @param {FakeCanvasSize} [canvasSize] The given size of the backing store (default: 300 × 150, as in the DOM).
 * @returns {FakeCanvasContext} The fake context.
 */
export function createFakeCanvasContext(canvasSize: FakeCanvasSize = { width: 300, height: 150 }): FakeCanvasContext {
    const calls: CanvasCall[] = [];
    const context: Record<string, unknown> = {
        calls,
        canvas: { ...canvasSize },
        fillStyle: '#000',
        strokeStyle: '#000',
        lineWidth: 1,
        font: '10px sans-serif',
        callsOf: (method: string) => calls.filter(call => call.method === method),
    };

    RECORDED_CANVAS_METHODS.forEach(method => {
        context[method] = (...args: unknown[]) => {
            calls.push({
                method,
                args,
                fillStyle: context['fillStyle'],
                strokeStyle: context['strokeStyle'],
                lineWidth: context['lineWidth'] as number,
                font: context['font'] as string,
            });
        };
    });

    return context as unknown as FakeCanvasContext;
}

/**
 * The MockMediaQueryList class.
 *
 * It stands in for a media query list of `window.matchMedia` (missing in jsdom)
 * and keeps its `change` listeners to call them on demand (a listener added with `once` only on the first trigger).
 */
export class MockMediaQueryList {
    /**
     * The `change` listeners of the media query list.
     */
    readonly listeners: { readonly listener: () => void; readonly once: boolean }[] = [];

    /**
     * The mocked `addEventListener` method: it keeps the given listener.
     */
    readonly addEventListener = vi.fn(
        (_type: string, listener: () => void, options?: AddEventListenerOptions): void => {
            this.listeners.push({ listener, once: !!options?.once });
        }
    );

    /**
     * The mocked `removeEventListener` method: it drops the given listener.
     */
    readonly removeEventListener = vi.fn((_type: string, listener: () => void): void => {
        const index = this.listeners.findIndex(entry => entry.listener === listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    });

    /**
     * Constructor of the MockMediaQueryList.
     *
     * @param {string} media The given media query.
     */
    constructor(readonly media: string) {}

    /**
     * Public method: trigger.
     *
     * It calls the current `change` listeners (as on a change of the match of the media query).
     *
     * @returns {void} Calls the listeners.
     */
    trigger(): void {
        const entries = [...this.listeners];
        entries.filter(entry => entry.once).forEach(entry => this.listeners.splice(this.listeners.indexOf(entry), 1));
        entries.forEach(entry => entry.listener());
    }
}

/**
 * Test helper function: stubMatchMedia.
 *
 * It stubs the global `matchMedia` (missing in jsdom) with a function that creates {@link MockMediaQueryList}s
 * and keeps all created media query lists. Restore it with `vi.unstubAllGlobals()`.
 *
 * @returns {MockMediaQueryList[]} The created mock media query lists.
 */
export function stubMatchMedia(): MockMediaQueryList[] {
    const mockMediaQueryLists: MockMediaQueryList[] = [];

    vi.stubGlobal('matchMedia', (media: string) => {
        const mediaQueryList = new MockMediaQueryList(media);
        mockMediaQueryLists.push(mediaQueryList);
        return mediaQueryList;
    });

    return mockMediaQueryLists;
}
