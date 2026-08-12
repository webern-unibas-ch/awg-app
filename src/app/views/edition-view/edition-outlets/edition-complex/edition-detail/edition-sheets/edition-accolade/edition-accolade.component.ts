import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';
import { ModalService } from '@awg-shared/modal/modal.service';
import {
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetsList,
    TextcriticalCommentary,
    Textcritics,
} from '@awg-views/edition-view/models';

/**
 * The EditionAccolade component.
 *
 * It contains the edition accolade section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-accolade',
    templateUrl: './edition-accolade.component.html',
    styleUrls: ['./edition-accolade.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionAccoladeComponent {
    /**
     * Private readonly injection variable: _modalService
     *
     * It keeps the instance of the injected ModalService.
     */
    private readonly _modalService = inject(ModalService);

    /**
     * Input variable: isSheetFacetMinimized.
     *
     * It keeps the toggle state of the sheet facet.
     */
    @Input()
    isSheetFacetMinimized: boolean;

    /**
     * Input variable: svgSheetsData.
     *
     * It keeps the svg sheets data.
     */
    @Input()
    svgSheetsData: EditionSvgSheetsList;

    /**
     * Input variable: selectedSvgSheet.
     *
     * It keeps the selected svg sheet.
     */
    @Input()
    selectedSvgSheet: EditionSvgSheet;

    /**
     * Input variable: selectedTextcriticalCommentary.
     *
     * It keeps the selected textcritical commentary.
     */
    @Input()
    selectedTextcriticalCommentary: TextcriticalCommentary;

    /**
     * Input variable: selectedTextcritics.
     *
     * It keeps the selected textcritics of a selected svg sheet.
     */
    @Input()
    selectedTextcritics: Textcritics;

    /**
     * Input variable: showTkA.
     *
     * If the textcritics shall be displayed.
     */
    @Input()
    showTkA: boolean;

    /**
     * Output variable: browseSvgSheetRequest.
     *
     * It keeps an event emitter for the next or pevious index of an svg sheet.
     */
    @Output()
    browseSvgSheetRequest: EventEmitter<number> = new EventEmitter();

    /**
     * Output variable: selectLinkBoxRequest.
     *
     * It keeps an event emitter for the selected link box.
     */
    @Output()
    selectLinkBoxRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: selectOverlaysRequest.
     *
     * It keeps an event emitter for the selected svg overlays.
     */
    @Output()
    selectOverlaysRequest: EventEmitter<EditionSvgOverlay[]> = new EventEmitter();

    /**
     * Output variable: toggleSheetFacetRequest.
     *
     * It keeps an event emitter for the toggle state of the sheet facet.
     */
    @Output()
    toggleSheetFacetRequest: EventEmitter<boolean> = new EventEmitter();

    /**
     * Readonly signal: isFullscreen.
     *
     * It holds the fullscreen status.
     */
    readonly isFullscreen = inject(FullscreenService).isFullscreen;

    /**
     * Public method: browseSvgSheet.
     *
     * It emits a given direction to the {@link browseSvgSheetRequest}
     * to browse to the previous or next sheet of the selected svg sheet.
     *
     * @param {number} direction A number indicating the direction of browsing. -1 for previous and 1 for next.
     *
     * @returns {void} Emits the direction.
     */
    browseSvgSheet(direction: number): void {
        if (!direction) {
            return;
        }
        this.browseSvgSheetRequest.emit(direction);
    }

    /**
     * Public method: openModal.
     *
     * It opens a text modal snippet via the {@link ModalService} for a given id.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Opens the text modal.
     */
    openModal(id: string): void {
        if (!id) {
            return;
        }
        this._modalService.openTextModal(id);
    }

    /**
     * Public method: selectLinkBox.
     *
     * It emits the given link box id
     * to the {@link selectLinkBoxRequest}.
     *
     * @param {string} linkBoxId The given link box id.
     *
     * @returns {void} Emits the id.
     */
    selectLinkBox(linkBoxId: string): void {
        this.selectLinkBoxRequest.emit(linkBoxId);
    }

    /**
     * Public method: selectOverlays.
     *
     * It emits the selected svg overlays
     * to the {@link selectOverlaysRequest}.
     *
     * @param {EditionSvgOverlay[]} overlays The given svg overlays.
     * @returns {void} Emits the overlays.
     */
    selectOverlays(overlays: EditionSvgOverlay[]): void {
        this.selectOverlaysRequest.emit(overlays);
    }

    /**
     * Public method: toggleSheetFacet.
     *
     * It emits the given boolean to the {@link toggleSheetFacetRequest}
     * to toggle the sheet facet.
     *
     * @param {boolean} isMinimized A boolean indicating the toggle state of the sheet facet.
     * @returns {void} Emits the boolean.
     */
    toggleSheetFacet(isMinimized: boolean): void {
        if (isMinimized === undefined) {
            return;
        }
        this.toggleSheetFacetRequest.emit(isMinimized);
    }
}
