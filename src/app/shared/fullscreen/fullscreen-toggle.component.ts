import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';

import { FullscreenToggleConfig } from './fullscreen.model';
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
    host: {
        '(document:fullscreenchange)': 'onFullscreenChange()',
    },
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
     * Readonly input signal: fsElement.
     *
     * It holds the HTMLElement to be displayed in fullscreen mode.
     */
    readonly fsElement = input.required<HTMLElement>();

    /**
     * Readonly signal: isFullscreen.
     *
     * It holds the fullscreen status from the FullscreenService.
     */
    readonly isFullscreen = this._fullscreenService.isFullscreen;

    /**
     * Readonly computed signal: fullscreenToggleBtn.
     *
     * It holds the configuration for the fullscreen toggle button.
     */
    readonly fullscreenToggleBtn = computed<FullscreenToggleConfig>(() => {
        const isFs = this.isFullscreen();

        return {
            icon: isFs ? faCompress : faExpand,
            title: isFs ? 'Close fullscreen' : 'Open fullscreen',
            customClass: isFs ? 'btn-info' : 'btn-outline-info',
            action: () => (isFs ? this.closeFullscreen() : this.openFullscreen()),
        };
    });

    /**
     * Public method: closeFullscreen.
     *
     * It requests to exit fullscreen mode via the FullscreenService.
     *
     * @returns {void} Requests to exit fullscreen mode.
     */
    closeFullscreen(): void {
        this._fullscreenService.closeFullscreen();
    }

    /**
     * Public method: openFullscreen.
     *
     * It requests to enter fullscreen mode for the component's fsElement via the FullscreenService.
     *
     * @returns {void} Requests to enter fullscreen mode.
     */
    openFullscreen(): void {
        this._fullscreenService.openFullscreen(this.fsElement());
    }

    /**
     * Protected method: onFullscreenChange.
     *
     * It listens to changes in the document's fullscreen state
     * and updates the state of the FullscreenService.
     *
     * @returns {void} Updates the fullscreen state.
     */
    protected onFullscreenChange(): void {
        this._fullscreenService.updateState();
    }
}
