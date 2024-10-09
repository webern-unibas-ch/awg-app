import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationExtras, Router } from '@angular/router';

import { EMPTY, fromEvent, Observable } from 'rxjs';
import { catchError, switchMap, throttleTime } from 'rxjs/operators';

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
export class EditionIntroComponent implements OnDestroy, OnInit {
    /**
     * ViewChild variable: modal.
     *
     * It keeps the reference to the awg-modal.
     */
    @ViewChild('modal', { static: true }) modal: ModalComponent;

    /**
     * Public variable: currentLanguage.
     *
     * It keeps the current language of the edition intro: 0 for German, 1 for English.
     */
    currentLanguage = 0;

    /**
     * Public variable: notesLables.
     *
     * It keeps the labels for the notes in the edition intro.
     */
    notesLables: Map<number, string> = new Map([
        [0, 'Anmerkungen'],
        [1, 'Notes'],
    ]);

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

        this._initScrollListener();
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
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     *
     * Destroys subscriptions.
     */
    ngOnDestroy() {
        this.editionService.clearIsIntroView();
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
        this.editionService.updateIsIntroView(true);

        this.editionIntroData$ = this.editionService
            // Get current editionComplex from editionService
            .getSelectedEditionComplex()
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
     * Public method: navigateToIntroFragment.
     *
     * It navigates to the '/intro/' route with the given complexId and fragmentId.
     *
     * @param {string} fragmentId The given fragment id.
     * @returns {void} Navigates to the edition intro fragment.
     */
    navigateToIntroFragment(introIds: { complexId: string; fragmentId: string }): void {
        const introRoute = this.editionRouteConstants.EDITION_INTRO.route;
        const navigationExtras: NavigationExtras = {
            fragment: introIds?.fragmentId ?? '',
        };
        this._navigateWithComplexId(introIds?.complexId, introRoute, navigationExtras);
    }

    /**
     * Public method: navigateToReportFragment.
     *
     * It navigates to the '/report/' route with the given complexId and fragmentId.
     *
     * @param {string}  fragmentId The given fragment id.
     * @returns {void} Navigates to the edition report fragment.
     */
    navigateToReportFragment(reportIds: { complexId: string; fragmentId: string }): void {
        const reportRoute = this.editionRouteConstants.EDITION_REPORT.route;
        const navigationExtras: NavigationExtras = {
            fragment: reportIds?.fragmentId ?? '',
        };
        this._navigateWithComplexId(reportIds?.complexId, reportRoute, navigationExtras);
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
     * It navigates to the '/sheet/' route using the provided sheetId
     * within the context of an edition complex identified by the provided complexId.
     *
     * @param {object} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Navigates to the edition sheets.
     */
    selectSvgSheet(sheetIds: { complexId: string; sheetId: string }): void {
        const sheetRoute = this.editionRouteConstants.EDITION_SHEETS.route;
        const navigationExtras: NavigationExtras = {
            queryParams: { id: sheetIds?.sheetId ?? '' },
            // .queryParamsHandling: '',
        };

        this._navigateWithComplexId(sheetIds?.complexId, sheetRoute, navigationExtras);
    }

    /**
     * Public method: setLanguage.
     *
     * It sets the current language of the edition intro.
     *
     * @param {number} language The given language number.
     * @returns {void} Sets the current language.
     */
    setLanguage(language: number): void {
        this.currentLanguage = language;
    }

    /**
     * Private method: _initScrollListener.
     *
     * It initializes the scroll listener for the window.
     *
     * @returns {void} Initializes the scroll listener.
     */
    private _initScrollListener(): void {
        fromEvent(window, 'scroll')
            .pipe(throttleTime(200), takeUntilDestroyed())
            .subscribe(event => this._onIntroScroll(event));
    }

    /**
     * Private method: _navigateWithComplexId.
     *
     * It navigates to a target route using the provided complexId.
     *
     * @param {string} complexId The given complex id.
     * @param {string} targetRoute The given target route.
     * @param {NavigationExtras} navigationExtras The given navigation extras.
     * @returns {void} Navigates to the target route.
     */
    private _navigateWithComplexId(complexId: string, targetRoute: string, navigationExtras: NavigationExtras): void {
        const complexRoute = complexId ? `/edition/complex/${complexId}/` : this.editionComplex.baseRoute;

        this.router.navigate([complexRoute, targetRoute], navigationExtras);
    }

    /**
     * Private method: _onIntroScroll.
     *
     * It handles the scroll event on the intro window
     * and highlights the corresponding section in the intro navigation.
     *
     * @param {Event} event The given event.
     * @returns {void} Highlights the corresponding section in the intro navigation
     * on window scroll.
     */
    private _onIntroScroll(event: Event): void {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        const introSections: NodeListOf<HTMLElement> = document.querySelectorAll('.awg-intro-section');
        const introNavLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a.awg-intro-nav-link');

        let activeIntroSectionFound = false;

        introSections.forEach((introSection: HTMLElement) => {
            const introSectionTop = introSection.offsetTop - 10;
            const introSectionBottom = introSection.offsetTop + introSection.offsetHeight;

            if (!activeIntroSectionFound && introSectionTop <= scrollPosition && introSectionBottom > scrollPosition) {
                introNavLinks.forEach((navLink: HTMLAnchorElement) => {
                    navLink.classList.toggle('active', navLink.hash.includes(introSection.id));

                    activeIntroSectionFound = true;
                });
            }
        });

        if (!activeIntroSectionFound) {
            introNavLinks.forEach((navLink: HTMLAnchorElement) => {
                navLink.classList.remove('active');
            });
        }
    }
}
