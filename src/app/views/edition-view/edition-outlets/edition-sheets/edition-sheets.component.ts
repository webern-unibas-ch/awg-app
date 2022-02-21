import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationExtras, ParamMap, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { ModalComponent } from '@awg-shared/modal/modal.component';
import {
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    EditionWork,
    FolioConvolute,
    FolioConvoluteList,
    TextcriticalComment,
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
    styleUrls: ['./edition-sheets.component.css'],
})
export class EditionSheetsComponent implements OnInit, OnDestroy {
    /**
     * ViewChild variable: modal.
     *
     * It keeps the reference to the awg-modal.
     */
    @ViewChild('modal', { static: true }) modal: ModalComponent;

    /**
     * Public variable: editionWork.
     *
     * It keeps the information about the current composition.
     */
    editionWork: EditionWork;

    /**
     * Public variable: folioConvoluteData.
     *
     * It keeps the folio convolute Data of the edition sheets.
     */
    folioConvoluteData: FolioConvoluteList;

    /**
     * Public variable: svgSheetsData.
     *
     * It keeps the svg sheets data of the edition sheets.
     */
    svgSheetsData: EditionSvgSheetList;

    /**
     * Public variable: filteredSvgSheetsData.
     *
     * It keeps a filtered excerpt of the svg sheets data of the edition sheets.
     */
    filteredSvgSheetsData: EditionSvgSheetList;

    /**
     * Public variable: textcriticsData.
     *
     * It keeps the textcritics data of the edition sheets.
     */
    textcriticsData: TextcriticsList;

    /**
     * Public variable: selectedConvolute.
     *
     * It keeps the selected convolute.
     */
    selectedConvolute: FolioConvolute;

    /**
     * Public variable: selectedOverlay.
     *
     * It keeps the selected svg overlay.
     */
    selectedOverlay: EditionSvgOverlay;

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
     * EditionDataService and EditionService,
     * ActivatedRoute and Router.
     *
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {ActivatedRoute} route Instance of the Angular ActivatedRoute.
     * @param {Router} router Instance of the Angular Router.
     */
    constructor(
        private editionDataService: EditionDataService,
        private editionService: EditionService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

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
     * It subscribes to the current edition work
     * of the edition service and gets all necessary edition data
     * from the EditionDataService and the queryParams.
     *
     * @returns {void} Gets the current edition work and all necessary edition data.
     */
    getEditionSheetsData(): void {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                switchMap(() => this.editionService.getEditionWork()),
                switchMap((work: EditionWork) => {
                    // Set current editionWork
                    this.editionWork = work;
                    // Return EditionSheetsData from editionDataService
                    return this.editionDataService.getEditionSheetsData(this.editionWork);
                }),
                map((data: [FolioConvoluteList, EditionSvgSheetList, TextcriticsList]) => {
                    this.folioConvoluteData = data[0];
                    this.svgSheetsData = data[1];
                    this.textcriticsData = data[2];

                    return this.route;
                }),
                map(
                    (route: ActivatedRoute) =>
                        // Snapshot of current route query params
                        route.snapshot.queryParamMap
                ),
                takeUntil(this._destroyed$)
            )
            .subscribe(
                (queryParams: ParamMap) => {
                    this._selectConvolute(queryParams);
                    this._filterSvgSheets();
                    this._selectSvgSheet(queryParams);
                },
                error => {
                    this.errorMessage = error as any;
                }
            );
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

        if (convolute.folios && convolute.folios.constructor === Array && convolute.folios.length === 0) {
            // If no folio data provided, open modal
            if (convolute.linkTo) {
                this.modal.open(convolute.linkTo);
            }
            return;
        }
        this.selectedConvolute = convolute;
        this._filterSvgSheets();

        const navigationExtras: NavigationExtras = {
            queryParams: { convolute: convolute.convoluteId, sketch: this.filteredSvgSheetsData.sheets[0].id },
        };

        this.router.navigate([this.editionWork.baseRoute, this.editionWork.sheetsRoute.route], navigationExtras);
    }

    /**
     * Public method: onOverlaySelect.
     *
     * It selects a given overlay and its corresponding textcritical comments.
     *
     * @param {EditionSvgOverlay} overlay The given svg overlay.
     * @returns {void} Sets the selectedOverlay,
     * selectedTextcriticalComments and showTka variable.
     */
    onOverlaySelect(overlay: EditionSvgOverlay): void {
        if (!this.textcriticsData && !this.selectedSvgSheet) {
            return;
        }
        const textcriticalComments: TextcriticalComment[] = this._findTextCriticalComments();

        this.selectedOverlay = overlay;
        this.selectedTextcriticalComments = this.editionService.getTextcriticalComments(
            textcriticalComments,
            this.selectedOverlay
        );
        this.showTkA = this.selectedTextcriticalComments !== [];
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
        // Set default id if none is given
        if (!id) {
            id = this.filteredSvgSheetsData.sheets[0].id;
        }
        this.selectedSvgSheet = this._findSvgSheet(id);
        this._clearOverlaySelection();

        const navigationExtras: NavigationExtras = {
            queryParams: { convolute: this.selectedConvolute.convoluteId, sketch: id },
            queryParamsHandling: 'merge',
        };

        this.router.navigate([this.editionWork.baseRoute, this.editionWork.sheetsRoute.route], navigationExtras);
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
     * Private method: _clearOverlaySelection.
     *
     * It clears the selected overlay and TkA.
     *
     * @returns {void} Clears the selection.
     */
    private _clearOverlaySelection(): void {
        this.selectedOverlay = null;
        this.showTkA = false;
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
        const findIndex = this.filteredSvgSheetsData.sheets.findIndex(sheets => sheets.id === id);
        if (findIndex >= 0) {
            sheetIndex = findIndex;
        }

        // Return the sheet with the given id
        return this.filteredSvgSheetsData.sheets[sheetIndex];
    }

    /**
     * Private method: _findTextCriticalComments.
     *
     * It finds the textcritical comments for an svg overlay.
     *
     * @returns {TextcriticalComment[]} The textcritical comments that were found.
     */
    private _findTextCriticalComments(): TextcriticalComment[] {
        if (!this.textcriticsData && !this.selectedSvgSheet) {
            return;
        }
        // Find index of the selected svg sheet id in textcriticsData.textcritics array
        const textcriticsIndex = this.textcriticsData.textcritics.findIndex(
            textcritic => textcritic.label === this.selectedSvgSheet.id
        );
        // Return the comments with the given id
        return this.textcriticsData.textcritics[textcriticsIndex].comments;
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
        this.filteredSvgSheetsData.sheets = this.svgSheetsData.sheets.filter(
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
        return queryParams.get('sketch') ? queryParams.get('sketch') : this.filteredSvgSheetsData.sheets[0].id;
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
        if (!queryParams.get('convolute')) {
            console.log('got no convolute');
            this.onConvoluteSelect(this.folioConvoluteData.convolutes[0].convoluteId);
            return;
        }

        return queryParams.get('convolute');
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
    }
}
