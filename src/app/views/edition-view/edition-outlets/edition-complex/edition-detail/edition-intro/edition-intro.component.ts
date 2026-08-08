import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';

import { fromEvent, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

import { LanguageId } from '@awg-shared/language-switcher/language.model';
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
