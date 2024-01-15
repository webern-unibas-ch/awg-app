import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { UtilityService } from '@awg-core/services';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, IntroList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

/**
 * The EditionIntro component.
 *
 * It contains the intro section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-intro',
    templateUrl: './edition-intro.component.html',
    styleUrls: ['./edition-intro.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionIntroComponent implements OnInit {
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
     * Public variable: editionIntroData$.
     *
     * It keeps the observable of the edition intro data.
     */
    editionIntroData$: Observable<IntroList>;

    /**
     * Public variable: errorObject.
     *
     * It keeps an errorObject for the service calls.
     */
    errorObject = null;

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: EditionIntroComponent;

    /**
     * Constructor of the EditionIntroComponent.
     *
     * It declares private instances of the EditionDataService, EditionService,
     * and the Angular Router; as well as a public instance of the UtilityService.
     *
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {Router} router Instance of the Router.
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor(
        private editionDataService: EditionDataService,
        private editionService: EditionService,
        private router: Router,
        public utils: UtilityService
    ) {
        this.ref = this;
    }

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
        this.getEditionIntroData();
    }

    /**
     * Public method: getEditionIntroData.
     *
     * It gets the current edition complex of the edition service
     * and the observable of the corresponding intro data
     * from the EditionDataService.
     *
     * @returns {void} Gets the current edition complex and the corresponding intro data.
     */
    getEditionIntroData(): void {
        this.editionIntroData$ = this.editionService
            // Get current editionComplex from editionService
            .getEditionComplex()
            .pipe(
                switchMap((complex: EditionComplex) => {
                    // Set current editionComplex
                    this.editionComplex = complex;
                    // Get intro data from editionDataService
                    return this.editionDataService.getEditionIntroData(this.editionComplex);
                }),
                // Error handling
                catchError(err => {
                    this.errorObject = err;
                    return EMPTY;
                })
            );
    }

    /**
     * Public method: navigateToReportFragment.
     *
     * It navigates to the '/report/' route with the given fragmentId.
     *
     * @param {string}  fragmentId The given fragment id.
     * @returns {void} Navigates to the edition report.
     */
    navigateToReportFragment(fragmentId: string): void {
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
     * Public method: openModal.
     *
     * It opens the {@link ModalComponent} with a given id of a modal snippet text.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Opens the modal with the snippet id.
     */
    openModal(id: string): void {
        if (!id) {
            return;
        }
        this.modal.open(id);
    }

    /**
     * Public method: selectSvgSheet.
     *
     * It navigates to the '/edition/complex/{complexRoute}/sheets/{sheetsId}'
     * route with the given id.
     *
     * @param {string} complexId The given complex id.
     * @param {string} sheetId The given sheet id.
     * @returns {void} Navigates to the given svg sheet id.
     */
    selectSvgSheet(complexId: string, sheetId: string): void {
        // Set default id if none is given
        const complexRoute = complexId ? `/edition/complex/${complexId}/` : this.editionComplex.baseRoute;
        const sheetRoute = sheetId ? sheetId : '';

        const navigationExtras: NavigationExtras = {
            queryParams: { id: sheetId },
            queryParamsHandling: '',
        };

        this.router.navigate([complexRoute, this.editionRouteConstants.EDITION_SHEETS.route], navigationExtras);
    }
}
