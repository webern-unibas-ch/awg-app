import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';

import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import { LoadingService, UtilityService } from '@awg-core/services';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    FolioConvolute,
    FolioConvoluteList,
    TextcriticalCommentBlock,
    Textcritics,
    TextcriticsList,
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
})
export class EditionSheetsComponent implements OnInit, OnDestroy {
    /**
     * ViewChild variable: modal.
     *
     * It keeps the reference to the awg-modal.
     */
    @ViewChild('modal', { static: true }) modal: ModalComponent;

    /**
     * Public variable: editionComplex.
     *
     * It keeps the information about the current edition complex.
     */
    editionComplex: EditionComplex;

    /**
     * Public variable: errorObject.
     *
     * It keeps an errorObject for the service calls.
     */
    errorObject = null;

    /**
     * Public variable: folioConvoluteData.
     *
     * It keeps the folio convolute Data of the edition sheets.
     */
    folioConvoluteData: FolioConvoluteList;

    /**
     * Public variable: isFullscreen.
     *
     * It keeps the fullscreen mode status.
     */
    isFullscreen = false;

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
     * Public variable: selectedTextcriticalCommentBlocks.
     *
     * It keeps the selected textcritical comment blocks.
     */
    selectedTextcriticalCommentBlocks: TextcriticalCommentBlock[];

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
     * Public variable: svgSheetsData.
     *
     * It keeps the SVG sheets data of the edition sheets.
     */
    svgSheetsData: EditionSvgSheetList;

    /**
     * Public variable: textcriticsData.
     *
     * It keeps the textcritics data of the edition sheets.
     */
    textcriticsData: TextcriticsList;

    /**
     * Private variable: _isFirstPageLoad.
     *
     * It keeps the information if the page is loaded for the first time.
     */
    private _isFirstPageLoad = true;

    /**
     * Private readonly variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private readonly _destroyed$: Subject<boolean> = new Subject<boolean>();

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
     * Private readonly injection variable: _loadingService.
     *
     * It keeps the instance of the injected LoadingService.
     */
    private readonly _loadingService = inject(LoadingService);

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
     * Private readonly injection variable: utils.
     *
     * It keeps the instance of the injected UtilityService.
     */
    private readonly _utils = inject(UtilityService);

    /**
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }

    /**
     * Gets the loading status observable from the {@link LoadingService}.
     *
     * @returns {Observable<boolean>}
     */
    get isLoading$(): Observable<boolean> {
        return this._loadingService.getLoadingStatus();
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this.getEditionSheetsData();
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Now let's also complete the subject itself
        this._destroyed$.complete();
    }

    /**
     * Public method: getEditionSheetsData.
     *
     * It subscribes to the combined observables of the route paramMap and queryParamMap and then fetches the edition complex data and all necessary edition data.
     *
     * @returns {void} Gets the current edition complex and all necessary edition data.
     */
    getEditionSheetsData(): void {
        this.errorObject = null;

        this.snapshotQueryParamsId = this._route.snapshot.queryParamMap.get('id');

        combineLatest([this._route.paramMap, this._route.queryParamMap])
            .pipe(
                switchMap(([_params, queryParams]) => this._fetchEditionComplexData(queryParams)),
                // Error handling
                catchError(err => {
                    this.errorObject = err;
                    return EMPTY;
                }),
                takeUntil(this._destroyed$)
            )
            .subscribe();
    }

    /**
     *
     * Public method: onBrowseSvgSheet.
     *
     * It evaluates the id of the previous or next SVG sheet
     * based on the given direction and calls it with onSvgSheetSelect.
     *
     * @param {number} direction - A number indicating the direction of navigation. -1 for previous and 1 for next.
     * @returns {void} Evaluates the sheet id to be called with onSvgSheetSelect.
     */
    onBrowseSvgSheet(direction: number): void {
        const editionType = this._editionSheetsService.getCurrentEditionType(
            this.selectedSvgSheet,
            this.svgSheetsData.sheets
        );
        if (!editionType) {
            return;
        }

        const editionTypeSheets = this.svgSheetsData.sheets[editionType];
        const nextSheetId = this._editionSheetsService.getNextSheetId(
            direction,
            this.selectedSvgSheet,
            editionTypeSheets
        );

        this.onSvgSheetSelect({ complexId: '', sheetId: nextSheetId });
    }

    /**
     * Public method: onFullscreenToggle.
     *
     * It toggles the fullscreen mode and sets the isFullscreen flag.
     *
     * @param {boolean} isFullscreen A boolean indicating the fullscreen mode.
     * @returns {void} Toggles the fullscreen mode and sets the isFullscreen flag.
     */
    onFullscreenToggle(isFullscreen: boolean): void {
        this.isFullscreen = isFullscreen;
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
     * It finds the corresponding textcritical comments to a list of selected overlays.
     *
     * @param {EditionSvgOverlay[]} overlays The given SVG overlays.
     * @returns {void} Sets the selectedTextcriticalComments and showTka variable.
     */
    onOverlaySelect(overlays: EditionSvgOverlay[]): void {
        this.selectedTextcriticalCommentBlocks = this._editionSheetsService.getTextcriticalCommentsForOverlays(
            this.selectedTextcritics.comments,
            overlays
        );

        this.showTkA = this._utils.isNotEmptyArray(this.selectedTextcriticalCommentBlocks);
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
        const reportRoute = this.editionRouteConstants.EDITION_REPORT.route;
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
        const sheetRoute = this.editionRouteConstants.EDITION_SHEETS.route;
        const navigationExtras: NavigationExtras = {
            queryParams: { id: sheetIds?.sheetId ?? '' },
            queryParamsHandling: 'merge',
        };

        this._navigateWithComplexId(sheetIds?.complexId, sheetRoute, navigationExtras);
    }

    /**
     * Private method: _assignData.
     *
     * It assigns the fetched data to the corresponding variables.
     *
     * @param {[FolioConvoluteList, EditionSvgSheetList, TextcriticsList]} data The fetched data.
     * @returns {void} Assigns the fetched data to the corresponding variables.
     */
    private _assignData(data: [FolioConvoluteList, EditionSvgSheetList, TextcriticsList]): void {
        this.folioConvoluteData = data[0];
        this.svgSheetsData = data[1];
        this.textcriticsData = data[2];
    }

    /**
     * Private method: _fetchEditionComplexData.
     *
     * It fetches the current edition complex and all necessary edition data
     * from the EditionDataService, assigns the data and handles the query params.
     *
     * @param {ParamMap} queryParams The given query paramMap of the activated route.
     * @returns {Observable<EditionComplex | [FolioConvoluteList, EditionSvgSheetList, TextcriticsList]>} The edition complex data and all necessary edition data.
     */
    private _fetchEditionComplexData(
        queryParams: ParamMap
    ): Observable<EditionComplex | [FolioConvoluteList, EditionSvgSheetList, TextcriticsList]> {
        return this._editionStateService.getSelectedEditionComplex().pipe(
            // Set editionComplex
            tap((complex: EditionComplex) => (this.editionComplex = complex)),
            // Get editionSheetsData
            switchMap((complex: EditionComplex) => this._editionDataService.getEditionSheetsData(complex)),
            // Assign data
            tap((data: [FolioConvoluteList, EditionSvgSheetList, TextcriticsList]) => this._assignData(data)),
            // Handle queryParams
            tap(() => this._handleQueryParams(queryParams))
        );
    }

    /**
     * Private method: _getDefaultSheetId.
     *
     * It returns the id of the first sheet of the svgSheetsData as default.
     *
     * @returns {string} The default sheet id.
     */
    private _getDefaultSheetId(): string {
        const sheets = this.svgSheetsData?.sheets;
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
     * @returns {void} Handles the query params and selects the corresponding SVG sheet.
     */
    private _handleQueryParams(queryParams: ParamMap): void {
        let sheetIdFromQueryParams = queryParams?.get('id');

        if (sheetIdFromQueryParams && this.svgSheetsData) {
            this._selectSvgSheet(sheetIdFromQueryParams);
        } else {
            sheetIdFromQueryParams =
                this._isFirstPageLoad && this.snapshotQueryParamsId
                    ? this.snapshotQueryParamsId
                    : this._getDefaultSheetId();

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

        this._isFirstPageLoad = false;
    }

    /**
     * Private method: _navigateWithComplexId.
     *
     * It navigates to a target route using the provided complexId.
     *
     * @param {string} complexId The given complex id.
     * @param {string} targetRoute The given target route.
     * @param {NavigationExtras} navigationExtras The given navigation extras.
     * @returns {void} Navigates to the target route.
     */
    private _navigateWithComplexId(complexId: string, targetRoute: string, navigationExtras: NavigationExtras): void {
        const complexRoute = complexId ? `/edition/complex/${complexId}/` : this.editionComplex.baseRoute;

        this._router.navigate([complexRoute, targetRoute], navigationExtras);
    }

    /**
     * Private method: _selectSvgSheet.
     *
     * It selects an SVG sheet by the given query params.
     *
     * @param {ParamMap} queryParams The given query params.
     *
     * @returns {void} Selects the SVG sheet.
     */
    private _selectSvgSheet(sheetId: string): void {
        if (!sheetId) {
            return;
        }
        this.selectedSvgSheet = this._editionSheetsService.selectSvgSheetById(this.svgSheetsData.sheets, sheetId);
        this.selectedConvolute = this._editionSheetsService.selectConvolute(
            this.folioConvoluteData.convolutes,
            this.svgSheetsData.sheets,
            this.selectedSvgSheet
        );
        this.selectedTextcritics = this._editionSheetsService.findTextcritics(
            this.textcriticsData.textcritics,
            this.selectedSvgSheet
        );

        // Clear overlay selections and textcritical comments
        this.onOverlaySelect([]);

        if (
            this._utils.isNotEmptyObject(this.selectedTextcritics) &&
            this._utils.isNotEmptyArray(this.selectedTextcritics.comments)
        ) {
            this.selectedTextcriticalCommentBlocks = this.selectedTextcritics.comments;
        }
    }
}
