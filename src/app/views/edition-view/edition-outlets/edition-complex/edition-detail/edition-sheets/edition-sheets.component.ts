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

        const navigationExtras: NavigationExtras = {
            queryParams: {
                convolute: convolute.convoluteId,
                sketch: this.svgSheetsData.sheets.sketchEditions[0].id,
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
     * It finds the target SVG sheet of a link box and selects it.
     *
     * @param {string} linkBoxId The given link box id.
     * @returns {void} Finds and selects the target SVG sheet of a link box.
     */
    onLinkBoxSelect(linkBoxId: string): void {
        if (!this.selectedSvgSheet) {
            return;
        }

        const linkBoxes: EditionSvgLinkBox[] = this._findLinkBoxes();
        const selectedLinkBox = linkBoxes.find(linkBox => linkBox.svgGroupId === linkBoxId);

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
        this.selectedTextcriticalComments = this.editionService.getTextcriticalCommentsForOverlays(
            this.selectedTextcritics.comments,
            overlays
        );

        this.showTkA = this.utils.isNotEmptyArray(this.selectedTextcriticalComments);
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
        // Clear overlay selections
        this.onOverlaySelect([]);

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
     * It finds the link boxes for an SVG.
     *
     * @returns {EditionSvgLinkBox[]} The link boxes that were found.
     */
    private _findLinkBoxes(): EditionSvgLinkBox[] {
        if (!this.selectedSvgSheet || !this.selectedTextcritics?.linkBoxes) {
            // Return empty array if no link boxes were found
            return [];
        }

        // Return the link boxes
        return this.selectedTextcritics.linkBoxes;
    }

    /**
     * Private method: _findSvgSheetById.
     *
     * It finds a SVG sheet by a given id.
     *
     * @param {string} id The given id.
     * @returns {EditionSvgSheet} The sheet that was found.
     */
    private _findSvgSheetById(id: string): EditionSvgSheet {
        // Find index of given id in svgSheetsData.sheets array
        const indexes = {
            workEditions: this._findSvgSheetIndex(this.svgSheetsData.sheets.workEditions, id),
            textEditions: this._findSvgSheetIndex(this.svgSheetsData.sheets.textEditions, id),
            sketchEditions: this._findSvgSheetIndex(this.svgSheetsData.sheets.sketchEditions, id),
        };

        for (const [type, index] of Object.entries(indexes)) {
            if (index >= 0) {
                const sheet = this._getSheetContent(this.svgSheetsData.sheets[type], index, id);
                if (type === 'sketchEditions') {
                    this._selectConvolute(sheet.convolute);
                }
                return sheet;
            }
        }

        return new EditionSvgSheet();
    }

    /**
     * Private method: _findSvgSheetIndex.
     *
     * It finds the index of an SVG sheet in a given array of sheets.
     *
     * @param {EditionSvgSheet[]} sheets The given array of sheets.
     * @param {string} id The given id.
     * @returns {number} The index of the sheet in the array.
     */
    private _findSvgSheetIndex(sheets: EditionSvgSheet[], id: string): number {
        return sheets.findIndex(sheet => {
            let sheetId = sheet.id;
            // If we have partial sheets, look into content array for id with extra partial
            if (sheet.content.length > 1) {
                const partialIndex = this._findSvgSheetPartialIndex(sheet, id);
                if (partialIndex >= 0) {
                    sheetId += sheet.content[partialIndex].partial;
                }
            }
            return sheetId === id;
        });
    }

    /**
     * Private method: _findSvgSheetPartialIndex.
     *
     * It checks if a given id includes an SVG sheet partial and returns its index.
     *
     * @param {EditionSvgSheet} sheet The given sheet.
     * @param {string} id The given id.
     * @returns {number} The index of the sheet partial in the sheet.
     */
    private _findSvgSheetPartialIndex(sheet: EditionSvgSheet, id: string): number {
        return sheet.content.findIndex(content => sheet.id + content.partial === id);
    }

    /**
     * Private method: _findTextcritics.
     *
     * It finds the textcritics for a selected SVG sheet.
     *
     * @returns {Textcritics} The textcritics that were found.
     */
    private _findTextcritics(): Textcritics {
        if (!this.textcriticsData && !this.selectedSvgSheet) {
            return new Textcritics();
        }

        // Find the textcritics for the selected SVG sheet id in textcriticsData.textcritics array
        const textcritics = this.textcriticsData.textcritics.find(
            textcritic => textcritic.id === this.selectedSvgSheet.id
        );

        // Return the textcritics with the given id or empty object if no comments were found
        return textcritics || new Textcritics();
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
     * Private method: _getSheetContent.
     *
     * It gets the content of an SVG sheet by its id within a given array of sheets.
     *
     * @param {EditionSvgSheet[]} sheets The given array of sheets.
     * @param {number} sheetIndex The index of the sheet in the array.
     * @param {string} id The given id.
     * @returns {EditionSvgSheet} The sheet that was found.
     */
    private _getSheetContent(sheets: EditionSvgSheet[], sheetIndex: number, id: string): EditionSvgSheet {
        let sheet = new EditionSvgSheet();
        let partialIndex = -1;

        // Copy filtered sheets data for output
        sheet = {
            ...sheets[sheetIndex],
        };

        partialIndex = this._findSvgSheetPartialIndex(sheet, id);

        // Reduce content array to the SVG of partial id only
        if (partialIndex >= 0) {
            sheet.content = [sheets[sheetIndex].content[partialIndex]];
        }

        return sheet;
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
     * It selects an SVG sheet by the given query params.
     *
     * @param {ParamMap} queryParams The given query params.
     * @returns {void} Selects the SVG sheet.
     */
    private _selectSvgSheet(queryParams: ParamMap): void {
        const sheetId: string = this._getIdFromQueryParams(queryParams);
        this.selectedSvgSheet = this._findSvgSheetById(sheetId);
        this.selectedTextcritics = this._findTextcritics();
        if (
            this.utils.isNotEmptyObject(this.selectedTextcritics) &&
            this.utils.isNotEmptyArray(this.selectedTextcritics.comments)
        ) {
            this.selectedTextcriticalComments = this.selectedTextcritics.comments;
        }
    }
}
