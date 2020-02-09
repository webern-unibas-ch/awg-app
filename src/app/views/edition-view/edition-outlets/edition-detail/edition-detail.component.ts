import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import {
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    EditionWork,
    FolioConvoluteList,
    TextcriticalComment,
    TextcriticsList
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

/**
 * The EditionDetail component.
 *
 * It contains the edition detail section
 * of the edition view of the app
 * with a {@link ModalComponent},
 * the {@link EditionConvoluteComponent}
 * and the {@link EditionAccoladeComponent}.
 */
@Component({
    selector: 'awg-edition-detail',
    templateUrl: './edition-detail.component.html',
    styleUrls: ['./edition-detail.component.css']
})
export class EditionDetailComponent implements OnInit {
    /**
     * Public variable: editionWork.
     *
     * It keeps the information about the current composition.
     */
    editionWork: EditionWork;

    /**
     * Public variable: folioConvoluteData.
     *
     * It keeps the folio convolute Data of the edition detail.
     */
    folioConvoluteData: FolioConvoluteList;

    /**
     * Public variable: svgSheetsData.
     *
     * It keeps the svg sheets data of the edition detail.
     */
    svgSheetsData: EditionSvgSheetList;

    /**
     * Public variable: textcriticsData.
     *
     * It keeps the textcritics data of the edition detail.
     */
    textcriticsData: TextcriticsList;

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
     * Public variable: selectedOverlay.
     *
     * It keeps the selected svg overlay.
     */
    selectedOverlay: EditionSvgOverlay;

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
     * Constructor of the EditionDetailComponent.
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
        this.getEditionDetailData();
    }

    /**
     * Public method: getEditionDetailData.
     *
     * It subscribes to the current edition work
     * of the edition service and gets all necessary edition data
     * from the EditionDataService and the queryParams.
     *
     * @returns {void} Gets the current edition work and all necessary edition data.
     */
    getEditionDetailData(): void {
        this.editionService
            // get current editionWork from editionService
            .getEditionWork()
            .pipe(
                switchMap((work: EditionWork) => {
                    // set current editionWork
                    this.editionWork = work;
                    // return EditionDetailData from editionDataService
                    return this.editionDataService.getEditionDetailData(this.editionWork);
                })
            )
            .pipe(
                switchMap((data: [FolioConvoluteList, EditionSvgSheetList, TextcriticsList]) => {
                    this.folioConvoluteData = data[0];
                    this.svgSheetsData = data[1];
                    this.textcriticsData = data[2];
                    if (this.svgSheetsData) {
                        // return queryParams if available
                        return this.route.queryParamMap;
                    }
                })
            )
            .subscribe(
                (queryParams: ParamMap) => {
                    const sheetId: string = this.getSketchParams(queryParams);
                    this.selectedSvgSheet = this.setSelectedSvgSheet(sheetId);
                },
                error => {
                    this.errorMessage = error as any;
                }
            );
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

        // shortcut
        const textcriticsIndex = this.textcriticsData.textcritics.findIndex(textcritic => {
            return textcritic.id === this.selectedSvgSheet.id;
        });
        const textcriticalComments = this.textcriticsData.textcritics[textcriticsIndex].comments;

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
     * navigates to the edition detail route
     * with this given id.
     *
     * @param {string} id The given svg sheet id.
     * @returns {void} Navigates to the edition detail.
     */
    onSvgSheetSelect(id: string): void {
        if (!id) {
            id = '';
        }
        this.selectedSvgSheet = this.setSelectedSvgSheet(id);
        this.showTkA = false;

        const navigationExtras: NavigationExtras = {
            queryParams: { sketch: id },
            queryParamsHandling: ''
        };

        this.router.navigate([this.editionWork.baseRoute, this.editionWork.detailRoute], navigationExtras);
    }

    /**
     * Private method: getSketchParams.
     *
     * It checks the route params for a sketch query
     * and returns the id of the selected sheet.
     *
     * @default first entry of this.svgSheetsData
     *
     * @param {ParamMap} queryParams The query paramMap of the activated route.
     * @returns {string} The id of the selected sheet.
     */
    private getSketchParams(queryParams?: ParamMap): string {
        // if there is no id in query params
        // take first entry of svg sheets data as default
        if (!queryParams.get('sketch')) {
            this.onSvgSheetSelect(this.svgSheetsData.sheets[0].id);
            return;
        }
        return queryParams.get('sketch') ? queryParams.get('sketch') : this.svgSheetsData.sheets[0].id;
    }

    /**
     * Private method: setSelectedSvgSheet.
     *
     * It sets the selectedSvg from a given id.
     *
     * @param {string} id The given id input.
     * @returns {EditionSvgSheet} The selected sheet.
     */
    private setSelectedSvgSheet(id: string): EditionSvgSheet {
        if (!id) {
            return;
        }
        // find index of given id in svgSheetsData.sheets array
        const sheetIndex = this.svgSheetsData.sheets.findIndex(sheets => sheets.id === id);
        // return the sheet with the given id
        return this.svgSheetsData.sheets[sheetIndex];
    }
}
