import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
    Folio,
    EditionSvgSheet,
    EditionSvgOverlay,
    Textcritics,
    TextcriticsList
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

/**
 * The EditionDetail component.
 *
 * It contains the edition detail section
 * of the edition view of the app
 * with a {@link ModalComponent},
 * the {@link ConvoluteComponent}
 * and the {@link AccoladeComponent}.
 */
@Component({
    selector: 'awg-edition-detail',
    templateUrl: './edition-detail.component.html',
    styleUrls: ['./edition-detail.component.css']
})
export class EditionDetailComponent implements OnInit {
    /**
     * Public variable: folioData.
     *
     * It keeps the folio data of the edition detail.
     */
    folioData: Folio[];

    /**
     * Public variable: svgSheetsData.
     *
     * It keeps the svg sheets data of the edition detail.
     */
    svgSheetsData: EditionSvgSheet[];

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
     * Public variable: selectedTextcritics.
     *
     * It keeps the selected textcritics.
     */
    selectedTextcritics: Textcritics[];

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
     * It declares a private instances of
     * EditionDataService and EditionService,
     * ActivatedRoute and Router.
     *
     * @param {ActivatedRoute} route Instance of the Angular ActivatedRoute.
     * @param {Router} router Instance of the Angular Router.
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     * @param {EditionService} editionService Instance of the EditionService.
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
     * It calls the EditionDataService to provide
     * the data for the edition detail.
     *
     * @returns {void} Sets the folioData,
     * svgSheetsData and textcriticsData.
     */
    getEditionDetailData(): void {
        this.editionDataService.getEditionDetailData().subscribe(
            (data: [Folio[], EditionSvgSheet[], TextcriticsList]) => {
                this.folioData = data[0]['convolute'];
                this.svgSheetsData = data[1];
                this.textcriticsData = data[2];
                if (this.svgSheetsData) {
                    this.getRouteParams();
                }
            },
            error => {
                this.errorMessage = error as any;
            }
        );
    }

    /**
     * Private method: getRouteParams.
     *
     * It checks the route params for a given sheet id
     * and sets the selected sheet if any.
     *
     * @returns {void} Sets selectd sheet.
     */
    private getRouteParams(): void {
        this.route.params.forEach((params: Params) => {
            // if there is no id in route params
            // take first entry of svg sheets data as default
            const fileId: string = params['id'] ? params['id'] : Object.keys(this.svgSheetsData)[0];
            this.selectedSvgSheet = this.svgSheetsData[fileId];
        });
    }

    /**
     * Public method: onSvgSheetSelect.
     *
     * It selects a svg sheet by its id and
     * navigates to the '/edition/detail' route
     * with this given id.
     *
     * @param {string} id The given svg sheet id.
     * @returns {void} Navigates to the edition detail.
     */
    onSvgSheetSelect(id: string): void {
        this.selectedSvgSheet = this.svgSheetsData[id];
        this.showTkA = false;
        this.router.navigate(['/edition/detail', id]);
    }

    /**
     * Public method: onTextcriticSelect.
     *
     * It selects the textcritics for a given overlay.
     *
     * @param {EditionSvgOverlay} overlay The given svg overlay.
     * @returns {void} Sets the selectedOverlay,
     * selectedTextcritis and showTka variable.
     */
    onTextcriticSelect(overlay: EditionSvgOverlay): void {
        if (!this.textcriticsData && !this.selectedSvgSheet) {
            return;
        }

        // shortcut
        const textcritics = this.textcriticsData[this.selectedSvgSheet.id];

        this.selectedOverlay = overlay;
        this.selectedTextcritics = this.editionService.getTextcritics(textcritics, this.selectedOverlay);
        this.showTkA = this.selectedTextcritics !== [];
    }
}
