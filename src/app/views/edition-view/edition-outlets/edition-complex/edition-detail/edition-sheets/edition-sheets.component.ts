import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';

import { ModalComponent } from '@awg-shared/modal/modal.component';
import { UTILS } from '@awg-shared/utils/object-utils';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import {
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    FolioConvolute,
    TextcriticalCommentary,
    Textcritics,
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionSheetsService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionSheets component.
 *
 * It contains the edition sheets section
 * of the edition view of the app
 * with a {@link ModalComponent},
 * the {@link EditionConvoluteComponent}
 * and the {@link EditionAccoladeComponent}.
 */
@Component({
    selector: 'awg-edition-sheets',
    templateUrl: './edition-sheets.component.html',
    styleUrls: ['./edition-sheets.component.scss'],
    standalone: false,
})
export class EditionSheetsComponent {
    /**
     * ViewChild variable: modal.
     *
     * It keeps the reference to the awg-modal.
     */
    @ViewChild('modal', { static: true }) modal: ModalComponent;

    /**
     * Private readonly injection variable: _editionDataService.
     *
     * It keeps the instance of the injected EditionDataService.
     */
    private readonly _editionDataService = inject(EditionDataService);

    /**
     * Private readonly injection variable: _editionSheetsService.
     *
     * It keeps the instance of the injected EditionSheetsService.
     */
    private readonly _editionSheetsService = inject(EditionSheetsService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Private readonly injection variable: _route.
     *
     * It keeps the instance of the injected Angular ActivatedRoute.
     */
    private readonly _route = inject(ActivatedRoute);

    /**
     * Private readonly injection variable: _router.
     *
     * It keeps the instance of the injected Angular Router.
     */
    private readonly _router: any = inject(Router);

    /**
     * Private readonly signal: _queryParams.
     *
     * It holds the query parameters of the current route as a signal.
     */
    private readonly _queryParams = toSignal(this._route.queryParamMap);

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
     * Public variable: snapshotQueryParamsId.
     *
     * It keeps the snapshot of the queryParams id.
     */
    snapshotQueryParamsId: string;

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._editionStateService.selectedEditionComplex;

    /**
     * Readonly signal: viewData.
     *
     * It holds the state of the sheets view data.
     */
    readonly viewData = this._editionDataService.sheetsViewData;

    /**
     * Readonly signal: viewReady.
     *
     * It holds a flag indicating if the view is ready.
     */
    readonly viewReady = signal<boolean>(false);

    /**
     * Readonly signal: isFirstPageLoad.
     *
     * It holds the information if the page is loaded for the first time.
     */
    readonly isFirstPageLoad = signal<boolean>(true);

    /**
     * Constructor of the EditionSheetsComponent.
     *
     * It sets up an effect to handle query parameters and select the corresponding SVG sheet
     * and sets the viewReady signal to true after a short delay
     * to show the loadingSpinner when switching between complex views.
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

        setTimeout(() => {
            this.viewReady.set(true);
        }, 0);
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
     * Public method: onReportFragmentNavigate.
     *
     * It navigates to the '/report/' route using the provided fragmentId
     * within the context of an edition complex identified by the provided complexId.
     *
     * @param {object}  reportIds The given report ids as { complexId: string, fragmentId: string }.
     * @returns {void} Navigates to the edition report.
     */
    onReportFragmentNavigate(reportIds: { complexId: string; fragmentId: string }): void {
        const reportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
        const navigationExtras: NavigationExtras = {
            fragment: reportIds?.fragmentId ?? '',
        };

        this._navigateWithComplexId(reportIds?.complexId, reportRoute, navigationExtras);
    }

    /**
     * Public method: onSvgSheetSelect.
     *
     * It navigates to the '/sheet/' route using the provided sheetId
     * within the context of an edition complex identified by the provided complexId.
     *
     * @param {object} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Navigates to the edition sheets.
     */
    onSvgSheetSelect(sheetIds: { complexId: string; sheetId: string }): void {
        const sheetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
        const navigationExtras: NavigationExtras = {
            queryParams: { id: sheetIds?.sheetId ?? '' },
            queryParamsHandling: 'merge',
        };

        this._navigateWithComplexId(sheetIds?.complexId, sheetRoute, navigationExtras);
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
        let sheetIdFromQueryParams = queryParams?.get('id');

        if (sheetIdFromQueryParams && svgSheetsData) {
            this._selectSvgSheet(sheetIdFromQueryParams);
        } else {
            sheetIdFromQueryParams =
                this.isFirstPageLoad() && this.snapshotQueryParamsId
                    ? this.snapshotQueryParamsId
                    : this._getDefaultSheetId(svgSheetsData);

            // Reset selectedSvgSheet if no sheetId is provided
            if (sheetIdFromQueryParams === '') {
                this.selectedSvgSheet = undefined;
            }

            // Navigate once more to the selected sheet
            this.onSvgSheetSelect({
                complexId: '',
                sheetId: sheetIdFromQueryParams,
            });
        }

        this.isFirstPageLoad.set(false);
    }

    /**
     * Private method: _navigateWithComplexId.
     *
     * It navigates to a target route using the provided complexId.
     *
     * @param {string | undefined} complexId The given complex id.
     * @param {string} targetRoute The given target route.
     * @param {NavigationExtras} navigationExtras The given navigation extras.
     * @returns {void} Navigates to the target route.
     */
    private _navigateWithComplexId(
        complexId: string | undefined,
        targetRoute: string,
        navigationExtras: NavigationExtras
    ): void {
        const complexRoute = complexId
            ? `/edition/complex/${complexId}`
            : (this.selectedEditionComplex()?.baseRoute ?? '/edition/series');

        this._router.navigate([complexRoute, targetRoute], navigationExtras);
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
