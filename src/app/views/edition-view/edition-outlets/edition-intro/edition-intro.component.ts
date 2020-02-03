import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { ModalComponent } from '@awg-shared/modal/modal.component';

import { EditionWork, IntroList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

/**
 * The Intro component.
 *
 * It contains the intro section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-intro',
    templateUrl: './edition-intro.component.html',
    styleUrls: ['./edition-intro.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionIntroComponent implements OnInit {
    @ViewChild('modal', { static: true }) modal: ModalComponent;

    /**
     * Public variable: editionWork.
     *
     * It keeps the information about the current composition.
     */
    editionWork: EditionWork;

    /**
     * Public variable: introData.
     *
     * It keeps the svg sheets data of the edition detail.
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
     * Constructor of the EditionDetailComponent.
     *
     * It declares private instances of
     * EditionDataService, EditionService
     * and the Angular Router.
     *
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {Router} router Instance of the Router.
     */
    constructor(
        private editionService: EditionService,
        private editionDataService: EditionDataService,
        private router: Router
    ) {
        this.ref = this;
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getIntroData();
    }

    /**
     * Public method: getIntroData.
     *
     * It gets the the current edition work of the edition service
     * and the observable of the corresponding intro data
     * from the EditionDataService.
     *
     * @returns {void} Gets the current edition work and the corresponding intro data.
     */
    getIntroData(): void {
        this.editionIntroData$ = this.editionService
            // get current editionWork from editionService
            .getEditionWork()
            .pipe(
                switchMap((work: EditionWork) => {
                    // set current editionWork
                    this.editionWork = work;
                    // get intro data from editionDataService
                    return this.editionDataService.getEditionIntroData(this.editionWork);
                }),
                // error handling
                catchError(err => {
                    this.errorObject = err;
                    return throwError(err);
                })
            );
    }

    /**
     * Public method: navigateToSourceDescription.
     *
     * It navigates to the '/report/' route with the given fragmentId.
     *
     * @param {string}  fragmentId The given fragment id.
     * @returns {void} Navigates to the edition report.
     */
    navigateToSourceDescription(fragmentId: string) {
        if (!fragmentId) {
            fragmentId = '';
        }
        const navigationExtras: NavigationExtras = {
            fragment: fragmentId
        };
        this.router.navigate([this.editionWork.baseRoute, this.editionWork.reportRoute], navigationExtras);
    }

    /**
     * Public method: openModal.
     *
     * It emits a given id of a modal snippet text
     * to the {@link openModalRequest}.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Emits the id.
     */
    openModal(id: string): void {
        this.modal.open(id);
    }

    /**
     * Public method: selectSvgSheet.
     *
     * It navigates to the '/edition/composition/{id}/detail'
     * route with the given id.
     *
     * @param {string} id The given svg sheet id.
     * @returns {void} Navigates to the edition detail.
     */
    selectSvgSheet(id: string): void {
        if (!id) {
            id = '';
        }
        const navigationExtras: NavigationExtras = {
            queryParams: { sketch: id },
            queryParamsHandling: ''
        };

        this.router.navigate([this.editionWork.baseRoute, this.editionWork.detailRoute], navigationExtras);
    }
}
