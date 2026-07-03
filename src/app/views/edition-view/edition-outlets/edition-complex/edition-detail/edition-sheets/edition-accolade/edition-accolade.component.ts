import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';
import {
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    TextcriticalCommentary,
    Textcritics,
} from '@awg-views/edition-view/models';

/**
 * The EditionAccolade component.
 *
 * It contains the edition accolade section
 * of the edition view of the app
 * with the {@link EditionSvgSheetFacetComponent},
 * the {@link EditionSvgSheetListComponent}
 * and the {@link EditionTkaTableComponent}.
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
     * Private readonly injection variable: _fullscreenService.
     *
     * It keeps the instance of the injected FullscreenService.
     */
    private readonly _fullscreenService = inject(FullscreenService);

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
    svgSheetsData: EditionSvgSheetList;

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
     * Output variable: navigateToReportFragment.
     *
     * It keeps an event emitter for the selected ids of an edition complex and report fragment.
     */
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();

    /**
     * Output variable: openModalRequest.
     *
     * It keeps an event emitter to open the modal
     * with the selected modal text snippet.
     */
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();

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
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected ids of an edition complex and svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();

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
    readonly isFullscreen = this._fullscreenService.isFullscreen;

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
     * Public method: navigateToReportFragment.
     *
     * It emits the given ids of a selected edition complex and report fragment
     * to the {@link navigateToReportFragmentRequest}.
     *
     * @param {object} reportIds The given report ids as { complexId: string, fragmentId: string }.
     * @returns {void} Emits the ids.
     */
    navigateToReportFragment(reportIds: { complexId: string; fragmentId: string }): void {
        if (!reportIds?.fragmentId) {
            return;
        }
        this.navigateToReportFragmentRequest.emit(reportIds);
    }

    /**
     * Public method: openModal.
     *
     * It emits a given id of a modal snippet text
     * to the {@link openModalRequest}.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Emits the id.
     */
    openModal(id: string): void {
        if (!id) {
            return;
        }
        this.openModalRequest.emit(id);
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
     * Public method: selectSvgSheet.
     *
     * It emits the given ids of a selected edition complex
     * and svg sheet to the {@link selectSvgSheetRequest}.
     *
     * @param {object} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Emits the ids.
     */
    selectSvgSheet(sheetIds: { complexId: string; sheetId: string }): void {
        if (!sheetIds?.sheetId) {
            return;
        }
        this.selectSvgSheetRequest.emit(sheetIds);
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
