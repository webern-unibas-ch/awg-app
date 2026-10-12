import { DOCUMENT, inject, Injectable, signal } from '@angular/core';

/**
 * The Fullscreen service.
 *
 * It handles the fullscreen mode for the document.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class FullscreenService {
    /**
     * Private readonly injection variable: _document.
     *
     * It keeps the instance of the injected DOCUMENT.
     */
    private readonly _document = inject(DOCUMENT);

    /**
     * Private readonly signal: _isFullscreen.
     *
     * It holds the fullscreen state for internal use.
     */
    private readonly _isFullscreen = signal<boolean>(!!this._document.fullscreenElement);

    /**
     * Public readonly signal: isFullscreen.
     *
     * It holds the fullscreen state for components and templates.
     */
    readonly isFullscreen = this._isFullscreen.asReadonly();

    /**
     * Public method: updateState.
     *
     * It updates the fullscreen state based on the document's fullscreen element.
     *
     * @returns {void} Updates the fullscreen state.
     */
    updateState(): void {
        this._isFullscreen.set(!!this._document.fullscreenElement);
    }

    /**
     * Public method: closeFullscreen.
     *
     * It exits fullscreen mode.
     *
     * @returns {void} Exits fullscreen mode.
     */
    closeFullscreen(): void {
        if (this._document.exitFullscreen) {
            this._document.exitFullscreen().catch((err: Error) => console.error(err));
        }
    }

    /**
     * Public method: openFullscreen.
     *
     * It requests fullscreen mode for a given element.
     *
     * @param {HTMLElement} element The given element.
     * @returns {void} Requests fullscreen mode for the given element.
     */
    openFullscreen(element: HTMLElement): void {
        if (!this._document.fullscreenElement) {
            element.requestFullscreen().catch((err: Error) => console.error(err));
        }
    }
}
