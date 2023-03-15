import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { UtilityService } from '@awg-core/services';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    FolioConvolute,
    FolioConvoluteList,
    TextcriticalComment,
    Textcritics,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService, EditionSheetsService } from '@awg-views/edition-view/services';

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
     * Public variable: folioConvoluteData.
     *
     * It keeps the folio convolute Data of the edition sheets.
     */
    folioConvoluteData: FolioConvoluteList;

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
     * Public variable: selectedTextcriticalComments.
     *
     * It keeps the selected textcritical comments.
     */
    selectedTextcriticalComments: TextcriticalComment[];

    /**
     * Public variable: selectedTextcritics.
     *
     * It keeps the textcritics of the selected SVG sheet.
     */
    selectedTextcritics: Textcritics;

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
     * Public variable: errorMessage.
     *
     * It keeps an errorMessage for the service calls.
     */
    errorMessage: string = undefined;

    /**
     * Public variable: showTka.
     *
     * If the textcritics shall be displayed.
     */
    showTkA = false;

    /**
     * Private variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor of the EditionSheetsComponent.
     *
     * It declares private instances of
     * EditionDataService, EditionSheetsService, EditionService, UtilityService,
     * ActivatedRoute and Router.
     *
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     * @param {EditionSheetsService} editionSheetsService Instance of the EditionSheetsService.
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {UtilityService} utils Instance of the UtilityService.
     * @param {ActivatedRoute} route Instance of the Angular ActivatedRoute.
     * @param {Router} router Instance of the Angular Router.
     */
    constructor(
        private editionDataService: EditionDataService,
        private editionSheetsService: EditionSheetsService,
        private editionService: EditionService,
        private utils: UtilityService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    /**
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getEditionSheetsData();
    }

    /**
     * Public method: getEditionSheetsData.
     *
     * It subscribes to the current edition complex
     * of the edition service and gets all necessary edition data
     * from the EditionDataService and the queryParams.
     *
     * @returns {void} Gets the current edition complex and all necessary edition data.
     */
    getEditionSheetsData(): void {
        this.route.paramMap
            .pipe(
                switchMap(() => this.editionService.getEditionComplex()),
                switchMap((complex: EditionComplex) => {
                    // Set current editionComplex
                    this.editionComplex = complex;
                    // Return EditionSheetsData from editionDataService
                    return this.editionDataService.getEditionSheetsData(this.editionComplex);
                }),
                switchMap((data: [FolioConvoluteList, EditionSvgSheetList, TextcriticsList]) => {
                    this.folioConvoluteData = data[0];
                    this.svgSheetsData = data[1];
                    this.textcriticsData = data[2];

                    return this.route.queryParamMap;
                }),
                takeUntil(this._destroyed$)
            )
            .subscribe({
                next: (queryParams: ParamMap) => {
                    this._selectSvgSheet(queryParams);
                },
                error: err => {
                    this.errorMessage = err;
                },
            });
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
            const linkToSvgSheet = selectedLinkBox.linkTo;
            this.onSvgSheetSelect(linkToSvgSheet);
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
        this.selectedTextcriticalComments = this.editionSheetsService.getTextcriticalCommentsForOverlays(
            this.selectedTextcritics.comments,
            overlays
        );

        this.showTkA = this.utils.isNotEmptyArray(this.selectedTextcriticalComments);
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
        const editionType = this.editionSheetsService.getCurrentEditionType(
            this.selectedSvgSheet,
            this.svgSheetsData.sheets
        );
        if (!editionType) {
            return;
        }

        const editionTypeSheets = this.svgSheetsData.sheets[editionType];
        const nextSheetId = this.editionSheetsService.getNextSheetId(
            direction,
            this.selectedSvgSheet,
            editionTypeSheets
        );

        this.onSvgSheetSelect(nextSheetId);
    }

    /**
     * Public method: onSvgSheetSelect.
     *
     * It selects a SVG sheet by its id and
     * navigates to the edition sheets route
     * with this given id.
     *
     * @param {string} id The given SVG sheet id.
     * @returns {void} Navigates to the edition sheets.
     */
    onSvgSheetSelect(sheetId: string): void {
        // Set default id if none is given
        if (!sheetId) {
            sheetId = this.svgSheetsData.sheets.sketchEditions[0].id;
        }

        const navigationExtras: NavigationExtras = {
            queryParams: { id: sheetId },
            queryParamsHandling: 'merge',
        };

        this.router.navigate(
            [this.editionComplex.baseRoute, this.editionRouteConstants.EDITION_SHEETS.route],
            navigationExtras
        );
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
     * Private method: _getIdFromQueryParams.
     *
     * It checks the route params for an id of the selected sheet
     * and returns it.
     *
     * @default first entry of this.svgSheetsData
     *
     * @param {ParamMap} queryParams The query paramMap of the activated route.
     * @returns {string} The id of the selected sheet.
     */
    private _getIdFromQueryParams(queryParams?: ParamMap): string {
        // If there is no id in query params
        // Take first entry of filtered svg sheets data as default
        return queryParams.get('id') ? queryParams.get('id') : this.svgSheetsData.sheets.sketchEditions[0].id;
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
    private _selectSvgSheet(queryParams: ParamMap): void {
        const sheetId: string = this._getIdFromQueryParams(queryParams);
        this.selectedSvgSheet = this.editionSheetsService.selectSvgSheetById(this.svgSheetsData.sheets, sheetId);
        this.selectedConvolute = this.editionSheetsService.selectConvolute(
            this.folioConvoluteData.convolutes,
            this.svgSheetsData.sheets,
            this.selectedSvgSheet
        );
        this.selectedTextcritics = this.editionSheetsService.findTextcritics(
            this.textcriticsData.textcritics,
            this.selectedSvgSheet
        );

        // Clear overlay selections and textcritical comments
        this.onOverlaySelect([]);
        if (
            this.utils.isNotEmptyObject(this.selectedTextcritics) &&
            this.utils.isNotEmptyArray(this.selectedTextcritics.comments)
        ) {
            this.selectedTextcriticalComments = this.selectedTextcritics.comments;
        }
    }
}
