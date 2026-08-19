import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

/**
 * The EditionSvgSheetViewerNav component.
 *
 * It contains the navigation panel for the edition svg sheet viewer.
 */
@Component({
    selector: 'awg-edition-svg-sheet-viewer-nav',
    templateUrl: './edition-svg-sheet-viewer-nav.component.html',
    styleUrls: ['./edition-svg-sheet-viewer-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionSvgSheetViewerNavComponent {
    /**
     * Output variable: browseSvgSheetRequest.
     *
     * It keeps an event emitter for the next or pevious index of an svg sheet.
     */
    @Output()
    browseSvgSheetRequest: EventEmitter<1 | -1> = new EventEmitter();

    /**
     * Public method: browseSvgSheet.
     *
     * It emits a given direction to the {@link browseSvgSheetRequest}
     * to browse to the previous or next sheet of the selected svg sheet.
     *
     * @param {1 | -1} direction A number indicating the direction of navigation. -1 for previous and 1 for next.
     *
     * @returns {void} Emits the direction.
     */
    browseSvgSheet(direction: 1 | -1): void {
        this.browseSvgSheetRequest.emit(direction);
    }
}
