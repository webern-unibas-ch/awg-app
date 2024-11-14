import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    inject,
    Input,
    Output,
} from '@angular/core';
import { FullscreenService } from '@awg-app/core/services';

import {
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    TextcriticalCommentBlock,
    Textcritics,
} from '@awg-views/edition-view/models';
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';

/**
 * The EditionAccolade component.
 *
 * It contains the edition accolade section
 * of the edition view of the app
 * with the {@link EditionSvgSheetNavComponent},
 * the {@link EditionSvgSheetListComponent}
 * and the {@link EditionTkaTableComponent}.
 */
@Component({
    selector: 'awg-edition-accolade',
    templateUrl: './edition-accolade.component.html',
    styleUrls: ['./edition-accolade.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionAccoladeComponent {
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
     * Input variable: selectedTextcriticalCommentBlocks.
     *
     * It keeps the selected textcritical comment blocks.
     */
    @Input()
    selectedTextcriticalCommentBlocks: TextcriticalCommentBlock[];

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
     * HostBinding: isFullscreen.
     *
     * It binds to the is-fullscreen CSS class.
     */
    @HostBinding('class.is-fullscreen') isFullscreen = false;

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
     * Private readonly injection variable: _accoladeElRef.
     *
     * It keeps the instance of the injected ElementRef.
     */
    private readonly _elRef = inject(ElementRef);

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
    @HostListener('document:fullscreenchange', ['$event']) onFullscreenChange(_event: Event) {
        this.isFullscreen = this._fullscreenService.isFullscreen();
    }

    /**
     * Public method: browseSvgSheet.
     *
     * It emits a given direction to the {@link browseSvgSheetRequest}
     * to browse to the previous or next sheet of the selected svg sheet.
     *
     * @param {number} direction A number indicating the direction of navigation. -1 for previous and 1 for next.
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
     * Public method: closeFullscreen.
     *
     * It closes fullscreen mode and sets isFullscreen flag to false.
     *
     * @returns {void} Sets isFullscreen flag to false.
     */
    closeFullscreen(): void {
        this._fullscreenService.closeFullscreen();
        this.isFullscreen = false;
    }

    /**
     * Public method: openFullscreen.
     *
     * It activates fullscreen mode and sets isFullscreen flag to true.
     *
     * @returns {void} Sets isFullscreen flag to true.
     */
    openFullscreen(): void {
        const el = this._elRef.nativeElement;
        this._fullscreenService.openFullscreen(el);
        this.isFullscreen = true;
    }
}
