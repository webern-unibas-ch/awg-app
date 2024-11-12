import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

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
     * Public method: isFullscreen.
     *
     * It checks if the document is in fullscreen mode.
     *
     * @returns {boolean} Returns true if the document is in fullscreen mode, false otherwise.
     */
    isFullscreen(): boolean {
        return !!this._document.fullscreenElement;
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
