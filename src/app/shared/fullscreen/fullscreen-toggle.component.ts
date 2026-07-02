import { ChangeDetectionStrategy, Component, effect, HostListener, inject, input, output } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';

import { FullscreenService } from './fullscreen.service';

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
    imports: [FaIconComponent],
})
export class FullscreenToggleComponent {
    /**
     * Private readonly injection variable: _fullscreenService.
     *
     * It keeps the instance of the injected FullscreenService.
     */
    private readonly _fullscreenService = inject(FullscreenService);

    /**
     * Input signal: fsElement.
     *
     * It holds the HTMLElement to be displayed in fullscreen mode.
     */
    readonly fsElement = input.required<HTMLElement>();

    /**
     * Output signal: toggleFullscreenRequest.
     *
     * It emits the fullscreen mode status.
     */
    readonly toggleFullscreenRequest = output<boolean>();

    /**
     * Public readonly variable: isFullscreen.
     *
     * It holds the fullscreen mode status.
     */
    readonly isFullscreen = this._fullscreenService.isFullscreen;

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
     * The constructor of the FullscreenToggleComponent.
     *
     * It sets up an effect to emit the fullscreen mode status whenever it changes.
     */
    constructor() {
        effect(() => {
            this.toggleFullscreenRequest.emit(this.isFullscreen());
        });
    }

    /**
     * HostListener: document:fullscreenchange.
     *
     * It listens changes in the document's fullscreen state.
     */
    @HostListener('document:fullscreenchange') onFullscreenChange(): void {
        this._fullscreenService.updateState();
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
    }

    /**
     * Public method: openFullscreen.
     *
     * It activates fullscreen mode and sets isFullscreen flag to true.
     *
     * @returns {void} Sets isFullscreen flag to true.
     */
    openFullscreen(): void {
        this._fullscreenService.openFullscreen(this.fsElement());
    }
}
