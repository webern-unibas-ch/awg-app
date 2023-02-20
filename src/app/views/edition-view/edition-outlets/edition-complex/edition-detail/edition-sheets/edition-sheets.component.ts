import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { UtilityService } from '@awg-core/services';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionSvgLinkBox,
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    FolioConvolute,
    FolioConvoluteList,
    TextcriticalComment,
    Textcritics,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

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
     * Public variable: filteredSvgSheetsData.
     *
     * It keeps a filtered excerpt of the svg sheets data of the edition sheets.
     */
    filteredSvgSheetsData: EditionSvgSheetList;

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
     * Public variable: selectedOverlays.
     *
     * It keeps the selected svg overlays.
     */
    selectedOverlays: EditionSvgOverlay[];

    /**
     * Public variable: selectedSvgSheet.
     *
     * It keeps the selected svg sheet.
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
     * It keeps the textcritics of the selected svg sheet.
     */
    selectedTextcritics: Textcritics;

    /**
     * Public variable: svgSheetsData.
     *
     * It keeps the svg sheets data of the edition sheets.
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
     * EditionDataService, EditionService, UtilityService,
     * ActivatedRoute and Router.
     *
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {UtilityService} utils Instance of the UtilityService.
     * @param {ActivatedRoute} route Instance of the Angular ActivatedRoute.
     * @param {Router} router Instance of the Angular Router.
     */
    constructor(
        private editionDataService: EditionDataService,
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
                    this._selectConvolute(queryParams);
                    this._filterSvgSheets();
                    this._selectSvgSheet(queryParams);
                },
                error: err => {
                    this.errorMessage = err;
                },
            });
    }

    /**
     * Public method: onConvoluteSelect.
     *
     * It selects a convolute by its id.
     *
     * @param {string} id The given id.
     * @returns {void} Sets the selectedConvolute variable.
     */
    onConvoluteSelect(id: string): void {
        if (!id) {
            id = this.folioConvoluteData.convolutes[0].convoluteId || '';
        }
        const convolute: FolioConvolute = this._findConvolute(id);

        if (!this.utils.isNotEmptyArray(convolute.folios)) {
            // If no folio data provided, open modal
            if (convolute.linkTo) {
                this.modal.open(convolute.linkTo);
                return;
            }
        }
        this.selectedConvolute = convolute;
        this._filterSvgSheets();

        const navigationExtras: NavigationExtras = {
            queryParams: {
                convolute: convolute.convoluteId,
                sketch: this.filteredSvgSheetsData.sheets.sketchEditions[0].id,
            },
        };

        this.router.navigate(
            [this.editionComplex.baseRoute, this.editionRouteConstants.EDITION_SHEETS.route],
            navigationExtras
        );
    }

    /**
     * Public method: onLinkBoxSelect.
     *
     * It finds the target svg sheet of a link box and selects it.
     *
     * @param {string} linkBoxId The given link box id.
     * @returns {void} Finds and selects the target svg sheet of a link box.
     */
    onLinkBoxSelect(linkBoxId: string): void {
        if (!this.selectedSvgSheet) {
            return;
        }

        const linkBoxes: EditionSvgLinkBox[] = this._findLinkBoxes();

        const selectedLinkBox = linkBoxes.filter(linkBox => linkBox.svgGroupId === linkBoxId);
        if (this.utils.isNotEmptyArray(selectedLinkBox)) {
            const linkToSvgSheet = selectedLinkBox[0].linkTo;

            this.onSvgSheetSelect(linkToSvgSheet);
        }
    }

    /**
     * Public method: onOverlaySelect.
     *
     * It finds the corresponding textcritical comments to a list of selected overlays.
     *
     * @param {EditionSvgOverlay[]} overlays The given svg overlays.
     * @returns {void} Sets the selectedOverlay, selectedTextcriticalComments and showTka variable.
     */
    onOverlaySelect(overlays: EditionSvgOverlay[]): void {
        if (!this.textcriticsData && !this.selectedSvgSheet) {
            return;
        }

        this.selectedTextcritics = this._findTextcritics();
        if (
            this.utils.isNotEmptyObject(this.selectedTextcritics) &&
            this.utils.isNotEmptyArray(this.selectedTextcritics.comments)
        ) {
            this.selectedTextcriticalComments = this.editionService.getTextcriticalCommentsForOverlays(
                this.selectedTextcritics.comments,
                overlays
            );
        }

        this.showTkA = this.utils.isNotEmptyArray(this.selectedTextcriticalComments);
    }

    /**
     * Public method: onSvgSheetSelect.
     *
     * It selects a svg sheet by its id and
     * navigates to the edition sheets route
     * with this given id.
     *
     * @param {string} id The given svg sheet id.
     * @returns {void} Navigates to the edition sheets.
     */
    onSvgSheetSelect(id: string): void {
        // Make sure that there is a convolute selected first
        if (!this.selectedConvolute) {
            this.onConvoluteSelect('');
        }

        // Clear overlay selections
        this.onOverlaySelect([]);

        // Set default id if none is given
        if (!id) {
            id = this.filteredSvgSheetsData.sheets.sketchEditions[0].id;
        }
        this.selectedSvgSheet = this._findSvgSheet(id);

        const navigationExtras: NavigationExtras = {
            queryParams: { convolute: this.selectedConvolute.convoluteId, sketch: id },
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
     * Private method: _findConvolute.
     *
     * It finds a convolute with a given id.
     *
     * @param {string} id The given id input.
     * @returns {FolioConvolute} The convolute that was found.
     */
    private _findConvolute(id: string): FolioConvolute {
        // Find index of given id in folioConvoluteData.convolutes array
        let convoluteIndex = 0;
        const findIndex = this.folioConvoluteData.convolutes.findIndex(convolute => convolute.convoluteId === id);
        if (findIndex >= 0) {
            convoluteIndex = findIndex;
        }

        // Return the convolute with the given id
        return this.folioConvoluteData.convolutes[convoluteIndex];
    }

    /**
     * Private method: _findLinkBoxes.
     *
     * It finds the link boxes for an svg.
     *
     * @returns {EditionSvgLinkBox[]} The link boxes that were found.
     */
    private _findLinkBoxes(): EditionSvgLinkBox[] {
        if (!this.textcriticsData && !this.selectedSvgSheet) {
            return undefined;
        }

        // Find index of the selected link box id in textcriticsData.textcritics array
        const textcriticsIndex = this.textcriticsData.textcritics.findIndex(
            textcritic => textcritic.id === this.selectedSvgSheet.id
        );

        if (
            textcriticsIndex > -1 &&
            this.textcriticsData.textcritics[textcriticsIndex] &&
            this.textcriticsData.textcritics[textcriticsIndex].linkBoxes
        ) {
            // Return the link boxes
            return this.textcriticsData.textcritics[textcriticsIndex].linkBoxes;
        }
        // Return empty array if no link boxes were found
        return [];
    }

    /**
     * Private method: _findSvgSheet.
     *
     * It finds a svg sheet with a given id.
     *
     * @param {string} id The given id input.
     * @returns {EditionSvgSheet} The sheet that was found.
     */
    private _findSvgSheet(id: string): EditionSvgSheet {
        // Find index of given id in svgSheetsData.sheets array
        let sheetIndex = 0;
        let partialIndex;
        const findIndex = this.filteredSvgSheetsData.sheets.sketchEditions.findIndex(sheets => {
            let i = sheets.id;
            // If we have partial sheets, look into content array for id with extra partial
            if (sheets.content.length > 1) {
                partialIndex = sheets.content.findIndex(content => i + content.partial === id);
                if (partialIndex >= 0) {
                    i = i + sheets.content[partialIndex].partial;
                }
            }
            return i === id;
        });

        if (findIndex >= 0) {
            sheetIndex = findIndex;
        }

        // Copy filtered sheets data for output
        const output = {
            ...this.filteredSvgSheetsData.sheets.sketchEditions[sheetIndex],
        };

        // Reduce content array to the svg of partial id only
        if (partialIndex >= 0) {
            output.content = [this.filteredSvgSheetsData.sheets.sketchEditions[sheetIndex].content[partialIndex]];
        }

        // Return the sheet with the given id
        return output;
    }

    /**
     * Private method: _findTextcritics.
     *
     * It finds the textcritics for a selected svg sheet.
     *
     * @returns {Textcritics} The textcritics that were found.
     */
    private _findTextcritics(): Textcritics {
        if (!this.textcriticsData && !this.selectedSvgSheet) {
            return undefined;
        }

        // Find index of the selected svg sheet id in textcriticsData.textcritics array
        const textcriticsIndex = this.textcriticsData.textcritics.findIndex(
            textcritic => textcritic.id === this.selectedSvgSheet.id
        );

        if (textcriticsIndex > -1 && this.utils.isNotEmptyObject(this.textcriticsData.textcritics[textcriticsIndex])) {
            // Return the textcritics with the given id
            return this.textcriticsData.textcritics[textcriticsIndex];
        }
        // Return undefined if no comments were found
        return undefined;
    }

    /**
     * Private method: _filterSvgSheets.
     *
     * It filters the svg sheets data by the selected convolute id.
     *
     * @returns {void} Filters the svh sheets data.
     */
    private _filterSvgSheets(): void {
        this.filteredSvgSheetsData = new EditionSvgSheetList();
        this.filteredSvgSheetsData.sheets = { workEditions: [], textEditions: [], sketchEditions: [] };
        this.filteredSvgSheetsData.sheets.sketchEditions = this.svgSheetsData.sheets.sketchEditions.filter(
            sheet => sheet.convolute === this.selectedConvolute.convoluteId
        );
    }

    /**
     * Private method: _getSketchParams.
     *
     * It checks the route params for a sketch query
     * and returns the id of the selected sheet.
     *
     * @default first entry of this.svgSheetsData
     *
     * @param {ParamMap} queryParams The query paramMap of the activated route.
     * @returns {string} The id of the selected sheet.
     */
    private _getSketchParams(queryParams?: ParamMap): string {
        // If there is no id in query params
        // Take first entry of filtered svg sheets data as default
        return queryParams.get('sketch')
            ? queryParams.get('sketch')
            : this.filteredSvgSheetsData.sheets.sketchEditions[0].id;
    }

    /**
     * Private method: _getConvoluteParams.
     *
     * It checks the route params for a convolute param
     * and returns the id of the selected convolute.
     *
     * @default first entry of this.folioConvoluteData
     *
     * @param {ParamMap} queryParams The query paramMap of the activated route.
     * @returns {string} The id of the selected convolute.
     */
    private _getConvoluteParams(queryParams?: ParamMap): string {
        // If there is no id in query params
        // Take first entry of folio convolute data as default
        return queryParams.get('convolute')
            ? queryParams.get('convolute')
            : this.folioConvoluteData.convolutes[0].convoluteId;
    }

    /**
     * Private method: _selectConvolute.
     *
     * It selects a convolute by the given query params.
     *
     * @param {ParamMap} queryParams The given query params.
     * @returns {void} Selects the convolute.
     */
    private _selectConvolute(queryParams: ParamMap): void {
        const convId: string = this._getConvoluteParams(queryParams);
        this.selectedConvolute = this._findConvolute(convId);
    }

    /**
     * Private method: _selectSvgSheet.
     *
     * It selects an svg sheet by the given query params.
     *
     * @param {ParamMap} queryParams The given query params.
     * @returns {void} Selects the svg sheet.
     */
    private _selectSvgSheet(queryParams: ParamMap): void {
        const sheetId: string = this._getSketchParams(queryParams);
        this.selectedSvgSheet = this._findSvgSheet(sheetId);
        this.selectedTextcritics = this._findTextcritics();
        if (
            this.utils.isNotEmptyObject(this.selectedTextcritics) &&
            this.utils.isNotEmptyArray(this.selectedTextcritics.comments)
        ) {
            this.selectedTextcriticalComments = this.selectedTextcritics.comments;
        }
    }
}
