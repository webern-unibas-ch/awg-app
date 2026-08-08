import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { UTILS } from '@awg-shared/utils/object-utils';

import {
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    FolioConvolute,
    TextcriticalCommentary,
    Textcritics,
} from '@awg-views/edition-view/models';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';
import { EditionSheetsService } from '@awg-views/edition-view/services/edition-sheets.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

/**
 * The EditionSheets component.
 *
 * It contains the edition sheets section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-sheets',
    templateUrl: './edition-sheets.component.html',
    styleUrls: ['./edition-sheets.component.scss'],
    standalone: false,
})
export class EditionSheetsComponent {
    /**
     * Private readonly injection variable: _editionSheetsService.
     *
     * It keeps the instance of the injected EditionSheetsService.
     */
    private readonly _editionSheetsService = inject(EditionSheetsService);

    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Private readonly injection variable: _route.
     *
     * It keeps the instance of the injected Angular ActivatedRoute.
     */
    private readonly _route = inject(ActivatedRoute);

    /**
     * Private readonly signal: _queryParams.
     *
     * It holds the query parameters of the current route as a signal.
     */
    private readonly _queryParams = toSignal(this._route.queryParamMap, {
        initialValue: this._route.snapshot.queryParamMap,
    });

    /**
     * Public variable: isSheetFacetMinimized.
     *
     * It keeps the toggle state of the sheet facet.
     */
    isSheetFacetMinimized = false;

    /**
     * Public variable: selectedConvolute.
     *
     * It keeps the selected convolute.
     */
    selectedConvolute: FolioConvolute;

    /**
     * Public variable: selectedSvgSheet.
     *
     * It keeps the selected SVG sheet.
     */
    selectedSvgSheet: EditionSvgSheet;

    /**
     * Public variable: selectedTextcriticalCommentary.
     *
     * It keeps the selected textcritical commentary.
     */
    selectedTextcriticalCommentary: TextcriticalCommentary;

    /**
     * Public variable: selectedTextcritics.
     *
     * It keeps the textcritics of the selected SVG sheet.
     */
    selectedTextcritics: Textcritics;

    /**
     * Public variable: showTka.
     *
     * If the textcritics shall be displayed.
     */
    showTkA = false;

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = inject(EditionStateService).selectedEditionComplex;

    /**
     * Readonly signal: viewData.
     *
     * It holds the state of the sheets view data.
     */
    readonly viewData = inject(EditionViewService).sheetsViewData;

    /**
     * Readonly signal: isFirstPageLoad.
     *
     * It holds the information if the page is loaded for the first time.
     */
    readonly isFirstPageLoad = signal<boolean>(true);

    /**
     * Constructor of the EditionSheetsComponent.
     *
     * It sets up an effect to handle query parameters and select the corresponding SVG sheet.
     */
    constructor() {
        effect(() => {
            const queryParams = this._queryParams();
            const svgSheetsData = this.viewData().data.svgSheetsData;
            const complex = this.selectedEditionComplex();

            if (!complex || !svgSheetsData?.sheets) {
                return;
            }

            this._handleQueryParams(queryParams, svgSheetsData);
        });
    }

    /**
     *
     * Public method: onBrowseSvgSheet.
     *
     * It evaluates the id of the previous or next SVG sheet
     * based on the given direction and calls it with onSvgSheetSelect.
     *
     * @param {number} direction - A number indicating the direction of browsing. -1 for previous and 1 for next.
     * @returns {void} Evaluates the sheet id to be called with onSvgSheetSelect.
     */
    onBrowseSvgSheet(direction: number): void {
        const sheets = this.viewData().data.svgSheetsData.sheets;
        const editionType = this._editionSheetsService.getCurrentEditionType(this.selectedSvgSheet, sheets);
        if (!editionType) {
            return;
        }

        const editionTypeSheets = sheets[editionType];
        const nextSheetId = this._editionSheetsService.getNextSheetId(
            direction,
            this.selectedSvgSheet,
            editionTypeSheets
        );

        this.onSvgSheetSelect({ complexId: '', sheetId: nextSheetId });
    }

    /**
     * Public method: onLinkBoxSelect.
     *
     * It finds the target SVG sheet of a link box and selects it.
     *
     * @param {string} linkBoxId The given link box id.
     * @returns {void} Finds and selects the target SVG sheet of a link box.
     */
    onLinkBoxSelect(linkBoxId: string): void {
        if (!this.selectedSvgSheet || !this.selectedTextcritics?.linkBoxes) {
            return;
        }

        const selectedLinkBox = this.selectedTextcritics.linkBoxes.find(linkBox => linkBox.svgGroupId === linkBoxId);

        if (selectedLinkBox) {
            const linkedSheetIds = selectedLinkBox.linkTo;
            this.onSvgSheetSelect(linkedSheetIds);
        }
    }

    /**
     * Public method: onOverlaySelect.
     *
     * It finds the corresponding textcritical comments for a list of selected overlays.
     *
     * @param {EditionSvgOverlay[]} overlays The given SVG overlays.
     * @returns {void} Sets the selectedTextcriticalComments and showTka variable.
     */
    onOverlaySelect(overlays: EditionSvgOverlay[]): void {
        this.selectedTextcriticalCommentary = this._editionSheetsService.filterTextcriticalCommentaryForOverlays(
            this.selectedTextcritics.commentary,
            overlays
        );

        this.showTkA = !UTILS.isEmptyArray(this.selectedTextcriticalCommentary.comments);
    }

    /**
     * Public method: onSvgSheetSelect.
     *
     * It delegates the navigation for the given complex and SVG sheet IDs
     * directly to the {@link EditionNavigationService}.
     *
     * @param {object} sheetIds The given sheet ids as SheetClickEvent.
     * @returns {void} Navigates to the selected SVG sheet.
     */
    onSvgSheetSelect(sheetIds: SheetClickEvent): void {
        if (!sheetIds?.sheetId) {
            return;
        }
        this._navigationService.navigateToSvgSheet(sheetIds);
    }

    /**
     * Public method: onToggleSheetFacet.
     *
     * It sets/updates the sheet facet state and the isSheetFacetMinimized flag.
     *
     * @param {boolean} isMinimized A boolean indicating the minimized state of the sheet facet.
     * @returns {void} Sets/updates the sheet facet state and the isSheetFacetMinimized flag.
     */
    onToggleSheetFacet(isMinimized: boolean): void {
        this.isSheetFacetMinimized = isMinimized;
    }

    /**
     * Private method: _getDefaultSheetId.
     *
     * It returns the id of the first sheet of the svgSheetsData as default.
     *
     * @param {EditionSvgSheetList} svgSheetsData The given svgSheetsData.     *
     * @returns {string} The default sheet id.
     */
    private _getDefaultSheetId(svgSheetsData: EditionSvgSheetList): string {
        const sheets = svgSheetsData?.sheets;
        const defaultSheet = sheets?.textEditions?.[0] || sheets?.sketchEditions?.[0];
        const defaultSheetContentPartial = defaultSheet?.content?.[0]?.partial ?? '';

        return (defaultSheet?.id || '') + defaultSheetContentPartial;
    }

    /**
     * Private method: _handleQueryParams.
     *
     * It handles the query params and selects the corresponding SVG sheet.
     *
     * @param {ParamMap} queryParams The given query paramMap of the activated route.
     * @param {EditionSvgSheetList} svgSheetsData The given svgSheetsData.
     * @returns {void} Handles the query params and selects the corresponding SVG sheet.
     */
    private _handleQueryParams(queryParams: ParamMap, svgSheetsData: EditionSvgSheetList): void {
        const sheetIdFromQueryParams = queryParams?.get('id');

        if (sheetIdFromQueryParams && svgSheetsData) {
            this._selectSvgSheet(sheetIdFromQueryParams);
        } else {
            const fallbackSheetId = this._getDefaultSheetId(svgSheetsData);

            // Reset selectedSvgSheet if no fallback sheet is provided
            if (fallbackSheetId === '') {
                this.selectedSvgSheet = undefined;
            }

            // Navigate once more to the fallback sheet
            this.onSvgSheetSelect({
                complexId: '',
                sheetId: fallbackSheetId,
            });
        }

        if (this.isFirstPageLoad()) {
            this.isFirstPageLoad.set(false);
        }
    }

    /**
     * Private method: _selectSvgSheet.
     *
     * It selects an SVG sheet by the given query params.
     *
     * @param {string} sheetId The given sheet id.
     *
     * @returns {void} Selects the SVG sheet.
     */
    private _selectSvgSheet(sheetId: string): void {
        if (!sheetId) {
            return;
        }
        const view = this.viewData();
        const sheets = view.data.svgSheetsData.sheets;
        const convolutes = view.data.folioConvoluteData.convolutes;
        const textcritics = view.data.textcriticsData.textcritics;

        this.selectedSvgSheet = this._editionSheetsService.selectSvgSheetById(sheets, sheetId);
        this.selectedConvolute = this._editionSheetsService.selectConvolute(convolutes, sheets, this.selectedSvgSheet);
        this.selectedTextcritics = this._editionSheetsService.findTextcritics(textcritics, this.selectedSvgSheet);

        // Clear overlay selections and textcritical comments
        this.onOverlaySelect([]);

        if (!UTILS.isEmptyObject(this.selectedTextcritics?.commentary)) {
            this.selectedTextcriticalCommentary = this.selectedTextcritics.commentary;
        }
    }
}
