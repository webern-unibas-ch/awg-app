import { afterNextRender, DestroyRef, Directive, ElementRef, inject, output, signal } from '@angular/core';

import { CanvasViewport } from '../canvas.model';

/**
 * The CanvasViewport directive.
 *
 * It measures the size and device pixel ratio of the host canvas on every resize or change of the device pixel ratio
 * and sizes its backing store to them (only on a change, then it emits `resized`).
 */
@Directive({
    selector: 'canvas[awgCanvasViewport]',
})
export class CanvasViewportDirective {
    /**
     * Private readonly injection variable: _destroyRef.
     *
     * It keeps the instance of the injected DestroyRef.
     */
    private readonly _destroyRef = inject(DestroyRef);

    /**
     * Private readonly injection variable: _elementRef.
     *
     * It keeps the reference to the host canvas element.
     */
    private readonly _elementRef = inject<ElementRef<HTMLCanvasElement>>(ElementRef);

    /**
     * Readonly output signal: resized.
     *
     * It emits the new viewport when the backing store of the canvas has been resized
     * (which clears the canvas, so it should be redrawn at once, before the next paint).
     */
    readonly resized = output<CanvasViewport>();

    /**
     * Private readonly variable: _canvasEl.
     *
     * It keeps the host canvas element.
     */
    private readonly _canvasEl = this._elementRef.nativeElement;

    /**
     * Private readonly signal: _viewport.
     *
     * It holds the current viewport of the canvas.
     */
    private readonly _viewport = signal<CanvasViewport>({ width: 0, height: 0, dpr: 1 });

    /**
     * Readonly signal: viewport.
     *
     * It holds the current viewport of the canvas (readonly).
     */
    readonly viewport = this._viewport.asReadonly();

    /**
     * Constructor of the CanvasViewportDirective.
     *
     * It measures the canvas after the first rendering and observes its resizes
     * and the changes of the device pixel ratio until destroy.
     */
    constructor() {
        afterNextRender(() => {
            this._measure();
            this._observeResize();
            this._observeDevicePixelRatio();
        });
    }

    /**
     * Private method: _measure.
     *
     * It sets the viewport to the rendered size of the canvas and the device pixel ratio,
     * and sizes the backing store of the canvas accordingly, if it has changed (then it emits `resized`).
     *
     * @returns {void} Sets the viewport.
     */
    private _measure(): void {
        const { clientWidth: width, clientHeight: height } = this._canvasEl;
        const dpr = window.devicePixelRatio || 1;
        const backingWidth = Math.round(width * dpr);
        const backingHeight = Math.round(height * dpr);

        const viewport: CanvasViewport = { width, height, dpr };
        this._viewport.set(viewport);

        // Sizing the backing store clears the canvas, even with the same size
        if (this._canvasEl.width === backingWidth && this._canvasEl.height === backingHeight) {
            return;
        }
        this._canvasEl.width = backingWidth;
        this._canvasEl.height = backingHeight;
        this.resized.emit(viewport);
    }

    /**
     * Private method: _observeDevicePixelRatio.
     *
     * It remeasures the canvas on every change of the device pixel ratio (e.g. on another screen, without resize),
     * renewing the media query of the current ratio each time (if `matchMedia` is available).
     *
     * @returns {void} Observes the device pixel ratio.
     */
    private _observeDevicePixelRatio(): void {
        if (typeof window.matchMedia !== 'function') {
            return;
        }
        let unobserve: (() => void) | undefined;

        const observe = (): void => {
            const mediaQueryList = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
            const onChange = (): void => {
                this._measure();
                observe();
            };
            mediaQueryList.addEventListener('change', onChange, { once: true });
            unobserve = () => mediaQueryList.removeEventListener('change', onChange);
        };

        observe();
        this._destroyRef.onDestroy(() => unobserve?.());
    }

    /**
     * Private method: _observeResize.
     *
     * It remeasures the canvas on every resize (also without a window resize, e.g. in fullscreen).
     *
     * @returns {void} Observes the resizes of the canvas.
     */
    private _observeResize(): void {
        const resizeObserver = new ResizeObserver(() => this._measure());
        resizeObserver.observe(this._canvasEl);
        this._destroyRef.onDestroy(() => resizeObserver.disconnect());
    }
}
