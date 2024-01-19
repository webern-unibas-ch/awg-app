import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { ModalComponent } from '@awg-shared/modal/modal.component';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

/**
 * The EditionReport component.
 *
 * It contains the report section of the edition view of the app
 * with a {@link HeadingComponent}, a {@link ModalComponent},
 * the {@link SourcesComponent} and the {@link TextcriticsComponent}.
 */
@Component({
    selector: 'awg-edition-report',
    templateUrl: './edition-report.component.html',
    styleUrls: ['./edition-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionReportComponent implements OnInit {
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
     * Public variable: editionReportData$.
     *
     * Observable that keeps the report data.
     */
    editionReportData$: Observable<(SourceList | SourceDescriptionList | SourceEvaluationList | TextcriticsList)[]>;

    /**
     * Public variable: errorObject.
     *
     * It keeps an errorObject for the service calls.
     */
    errorObject = null;

    /**
     * Public variable: titles.
     *
     * It keeps an object for the titles of the report sections.
     */
    titles = {
        sourceList: '1. Quellenübersicht',
        sourceDescription: '2. Quellenbeschreibung',
        sourceEvaluation: '3. Quellenbewertung',
        tka: '4. Textkritische Anmerkungen',
    };

    /**
     * Constructor of the EditionReportComponent.
     *
     * It declares a private EditionDataService instance
     * to get the report data and a private Router instance.
     *
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {Router} router Instance of the Router.
     */
    constructor(
        private editionDataService: EditionDataService,
        private editionService: EditionService,
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
        this.getEditionReportData();
    }

    /**
     * Public method: getEditionReportData.
     *
     * It calls the EditionDataService to provide
     * the data for the edition report.
     *
     * @returns {void} Sets the editionReportData observable.
     */
    getEditionReportData(): void {
        this.editionReportData$ = this.editionService
            // Get current editionComplex from editionService
            .getEditionComplex()
            .pipe(
                switchMap((complex: EditionComplex) => {
                    // Set current editionComplex
                    this.editionComplex = complex;
                    // Get intro data from editionDataService
                    return this.editionDataService.getEditionReportData(this.editionComplex);
                }),
                // Error handling
                catchError(err => {
                    this.errorObject = err;
                    return EMPTY;
                })
            );
    }

    /**
     * Public method: onModalOpen.
     *
     * It opens the {@link ModalComponent} with a given id of a modal snippet text.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Opens the modal with the snippet id.
     */
    onModalOpen(id: string): void {
        if (!id) {
            return;
        }
        this.modal.open(id);
    }

    /**
     * Public method: onReportFragmentNavigate.
     *
     * It navigates to the '/report/' route with the given fragmentId.
     *
     * @param {string}  fragmentId The given fragment id.
     * @returns {void} Navigates to the edition report.
     */
    onReportFragmentNavigate(fragmentId: string) {
        if (!fragmentId) {
            fragmentId = '';
        }
        const navigationExtras: NavigationExtras = {
            fragment: fragmentId,
        };
        this.router.navigate(
            [this.editionComplex.baseRoute, this.editionRouteConstants.EDITION_REPORT.route],
            navigationExtras
        );
    }

    /**
     * Public method: onSvgSheetSelect.
     *
     * It selects a SVG sheet by its edition complex
     * and sheet ids and navigates to the edition sheets route
     * with this given id.
     *
     * @param {object} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Navigates to the edition sheets.
     */
    onSvgSheetSelect(sheetIds: { complexId: string; sheetId: string }): void {
        // Set default id if none is given
        const complexRoute = sheetIds.complexId
            ? `/edition/complex/${sheetIds.complexId}/`
            : this.editionComplex.baseRoute;
        const sheetRoute = sheetIds.sheetId ? sheetIds.sheetId : '';

        const navigationExtras: NavigationExtras = {
            queryParams: { id: sheetRoute },
            // .queryParamsHandling: '',
        };

        this.router.navigate([complexRoute, this.editionRouteConstants.EDITION_SHEETS.route], navigationExtras);
    }
}
