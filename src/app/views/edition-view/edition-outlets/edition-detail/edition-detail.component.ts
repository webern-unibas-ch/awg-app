import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import { ModalComponent } from '@awg-shared/modal/modal.component';
import {
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    EditionWork,
    FolioConvolute,
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
                    this.selectedSvgSheet = this.findSvgSheet(sheetId);
                    if (
                        !this.selectedConvolute &&
                        this.folioConvoluteData.convolutes &&
                        this.folioConvoluteData.convolutes.constructor === Array &&
                        this.folioConvoluteData.convolutes.length > 0
                    ) {
                        this.selectedConvolute = this.folioConvoluteData.convolutes[0];
                    }
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
            return;
        }
        const convolute: FolioConvolute = this.findConvolute(id);

        if (convolute.folios && convolute.folios.constructor === Array && convolute.folios.length === 0) {
            // if no folio data provided, open modal
            if (convolute.linkTo) {
                this.modal.open(convolute.linkTo);
            }
            return;
        }
        this.selectedConvolute = convolute;
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
        const textcriticalComments: TextcriticalComment[] = this.findTextCriticalComments();

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
        this.selectedSvgSheet = this.findSvgSheet(id);
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
     * Private method: findConvolute.
     *
     * It finds a convolute with a given id.
     *
     * @param {string} id The given id input.
     * @returns {FolioConvolute} The convolute that was found.
     */
    private findConvolute(id: string): FolioConvolute {
        if (!id) {
            return;
        }
        // find index of given id in folioConvoluteData.convolutes array
        const convoluteIndex = this.folioConvoluteData.convolutes.findIndex(convolute => convolute.convoluteId === id);
        // return the convolute with the given id
        return this.folioConvoluteData.convolutes[convoluteIndex];
    }

    /**
     * Private method: findSvgSheet.
     *
     * It finds a svg sheet with a given id.
     *
     * @param {string} id The given id input.
     * @returns {EditionSvgSheet} The sheet that was found.
     */
    private findSvgSheet(id: string): EditionSvgSheet {
        if (!id) {
            return;
        }
        // find index of given id in svgSheetsData.sheets array
        const sheetIndex = this.svgSheetsData.sheets.findIndex(sheets => sheets.id === id);
        // return the sheet with the given id
        return this.svgSheetsData.sheets[sheetIndex];
    }

    /**
     * Private method: findTextCriticalComments.
     *
     * It finds the textcritical comments for an svg overlay.
     *
     * @returns {TextcriticalComment[]} The textcritical comments that were found.
     */
    private findTextCriticalComments(): TextcriticalComment[] {
        if (!this.textcriticsData && !this.selectedSvgSheet) {
            return;
        }
        // find index of teh selected svg sheet id in textcriticsData.textcritics array
        const textcriticsIndex = this.textcriticsData.textcritics.findIndex(
            textcritic => textcritic.id === this.selectedSvgSheet.id
        );
        // return the comments with the given id
        return this.textcriticsData.textcritics[textcriticsIndex].comments;
    }
}
