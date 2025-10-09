import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';

import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';

import { FullscreenService } from '@awg-core/services';

/**
 * The FullscreenToggle component.
 *
 * It contains the fullscreen toggle buttons for the app.
 */
@Component({
    selector: 'awg-fullscreen-toggle',
    templateUrl: './fullscreen-toggle.component.html',
    styleUrls: ['./fullscreen-toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class FullscreenToggleComponent {
    /**
     * Input variable: fsElement.
     *
     * It keeps the HTMLElement to be displayed in fullscreen mode.
     */
    @Input()
    fsElement: HTMLElement;

    /**
     * Output variable: toggleFullscreenRequest.
     *
     * It emits the fullscreen mode status.
     */
    @Output()
    toggleFullscreenRequest = new EventEmitter<boolean>();

    /**
     * Public variable: faExpand.
     *
     * It instantiates fontawesome's faExpand icon.
     */
    faExpand = faExpand;

    /**
     * Public variable: faCompress.
     *
     * It instantiates fontawesome's faCompress icon.
     */
    faCompress = faCompress;

    /**
     * Public variable: isFullscreen.
     *
     * It keeps the fullscreen mode status.
     */
    isFullscreen = false;

    /**
     * Private readonly injection variable: _fullscreenService.
     *
     * It keeps the instance of the injected FullscreenService.
     */
    private readonly _fullscreenService = inject(FullscreenService);

    /**
     * HostListener: document:fullscreenchange.
     *
     * It listens for fullscreen exit.
     */
    @HostListener('document:fullscreenchange', ['$event']) onFullscreenChange(): void {
        const fullscreenMode = this._fullscreenService.isFullscreen();
        this.toggleFullscreen(fullscreenMode);
    }

    /**
     * Public method: closeFullscreen.
     *
     * It closes fullscreen mode and sets isFullscreen flag to false.
     *
     * @returns {void} Sets isFullscreen flag to false.
     */
    closeFullscreen(): void {
        this._fullscreenService.closeFullscreen();
        this.toggleFullscreen(false);
    }

    /**
     * Public method: openFullscreen.
     *
     * It activates fullscreen mode and sets isFullscreen flag to true.
     *
     * @param {HTMLElement} el The HTMLElement to be displayed in fullscreen mode.     *
     * @returns {void} Sets isFullscreen flag to true.
     */
    openFullscreen(el: HTMLElement): void {
        this._fullscreenService.openFullscreen(el);
        this.toggleFullscreen(true);
    }

    /**
     * Public method: toggleFullscreen.
     *
     * It toggles the fullscreen mode and emits the fullscreen mode status.
     *
     * @param {boolean} fullScreenMode The fullscreen mode status.
     * @returns {void} Emits the fullscreen mode status.
     */
    toggleFullscreen(fullScreenMode: boolean): void {
        this.isFullscreen = fullScreenMode;
        this.toggleFullscreenRequest.emit(this.isFullscreen);
    }
}
