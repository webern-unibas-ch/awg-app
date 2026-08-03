import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { fromEvent, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

import { LanguageId } from '@awg-shared/language-switcher/language.model';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import { UTILS } from '@awg-shared/utils/object-utils';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

/**
 * The EditionIntro component.
 *
 * It contains the intro section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-intro',
    templateUrl: './edition-intro.component.html',
    styleUrls: ['./edition-intro.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionIntroComponent implements OnDestroy {
    /**
     * ViewChild variable: modal.
     *
     * It keeps the reference to the awg-modal.
     */
    @ViewChild('modal', { static: true }) modal: ModalComponent;

    /**
     * Private readonly injection variable: _router.
     *
     * It keeps the instance of the injected Angular Router.
     */
    private readonly _router = inject(Router);

    /**
     * Private readonly variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private readonly _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = inject(EditionStateService).selectedEditionComplex;

    /**
     * Readonly signal: introData.
     *
     * It holds the state of the intro view data.
     */
    readonly viewData = inject(EditionViewService).introViewData;

    /**
     * Public signal: selectedLanguage.
     *
     * It holds the selected language of the edition intro.
     */
    selectedLanguage = signal<LanguageId>(LanguageId.DE);

    /**
     * Readonly signal: notesSectionLabel.
     *
     * It computes the label for the notes section in the edition intro based on the selected language.
     */
    readonly notesSectionLabel = computed(() => (this.selectedLanguage() === LanguageId.DE ? 'Anmerkungen' : 'Notes'));

    /**
     * Constructor of the EditionIntroComponent.
     *
     * It initializes the scroll listener for the window.
     */
    constructor() {
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
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     *
     * Destroys subscriptions.
     */
    ngOnDestroy() {
        this._destroyed$.next(true);
        this._destroyed$.complete();
    }

    /**
     * Public method: onIntroFragmentNavigate.
     *
     * It navigates to the '/intro/' route with the given complexId and fragmentId.
     *
     * @param {object} introIds The given intro ids as { complexId: string, fragmentId: string }.
     * @returns {void} Navigates to the edition intro fragment.
     */
    onIntroFragmentNavigate(introIds: { complexId: string; fragmentId: string }): void {
        const navigationExtras: NavigationExtras = {
            fragment: introIds?.fragmentId ?? '',
        };
        this._router.navigate([], navigationExtras);
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
     * It navigates to the '/report/' route with the given complexId and fragmentId.
     *
     * @param {object} reportIds The given report ids as { complexId: string, fragmentId: string }.
     * @returns {void} Navigates to the edition report fragment.
     */
    onReportFragmentNavigate(reportIds: { complexId: string; fragmentId: string }): void {
        const reportRoute = this.editionRouteConstants.EDITION_REPORT.route;
        const navigationExtras: NavigationExtras = {
            fragment: reportIds?.fragmentId ?? '',
        };
        this._navigateWithComplexId(reportIds?.complexId, reportRoute, navigationExtras);
    }

    /**
     * Public method: onSvgSheetSelect.
     *
     * It navigates to the '/sheet/' route using the provided sheetId
     * within the context of an edition complex identified by the provided complexId.
     *
     * @param {object} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Navigates to the edition sheets.
     */
    onSvgSheetSelect(sheetIds: { complexId: string; sheetId: string }): void {
        const sheetRoute = this.editionRouteConstants.EDITION_SHEETS.route;
        const navigationExtras: NavigationExtras = {
            queryParams: { id: sheetIds?.sheetId ?? '' },
            // .queryParamsHandling: '',
        };

        this._navigateWithComplexId(sheetIds?.complexId, sheetRoute, navigationExtras);
    }

    /**
     * Private method: _initScrollListener.
     *
     * It initializes the scroll listener for the window.
     *
     * @returns {void} Initializes the scroll listener.
     */
    private _initScrollListener(): void {
        fromEvent(globalThis, 'scroll')
            .pipe(throttleTime(200), takeUntil(this._destroyed$))
            .subscribe({
                next: event => this._onIntroScroll(event),
            });
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
        const complexRoute = complexId
            ? `/edition/complex/${complexId}`
            : (this.selectedEditionComplex()?.baseRoute ?? '/edition/series');

        this._router.navigate([complexRoute, targetRoute], navigationExtras);
    }

    /**
     * Private method: _onIntroScroll.
     *
     * It handles the scroll event on the intro window
     * and highlights the corresponding section in the intro navigation.
     *
     * @param {Event} event The given scroll event.
     * @returns {void} Highlights the corresponding section in the intro navigation
     * on window scroll.
     */
    private _onIntroScroll(event: Event): void {
        if (event?.type === 'scroll') {
            const scrollPosition = globalThis.scrollY || document.documentElement.scrollTop;
            const introSections: NodeListOf<HTMLElement> = document.querySelectorAll('.awg-edition-intro-section');
            const introNavLinks: NodeListOf<HTMLAnchorElement> =
                document.querySelectorAll('a.awg-edition-intro-nav-link');

            let activeIntroSectionId: string | null = null;

            introSections.forEach((introSection: HTMLElement) => {
                const introSectionTop = introSection.offsetTop - 10;
                const introSectionBottom = introSection.offsetTop + introSection.offsetHeight;

                if (introSectionTop <= scrollPosition && introSectionBottom > scrollPosition) {
                    activeIntroSectionId = introSection.id;
                }
            });

            introNavLinks.forEach((navLink: HTMLAnchorElement) => {
                navLink.classList.toggle('active', navLink.hash.includes(activeIntroSectionId));
            });
        }
    }
}
