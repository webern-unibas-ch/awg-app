import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionOverview component.
 *
 * It contains the overview section
 * of the edition view of the app
 * with a {@link RouterLinkButtonGroupComponent} and
 * another router outlet for the edition routes.
 */
@Component({
    selector: 'awg-edition-detail-nav',
    templateUrl: './edition-detail-nav.component.html',
    styleUrls: ['./edition-detail-nav.component.scss'],
    standalone: false,
})
export class EditionDetailNavComponent implements OnInit, OnDestroy {
    /**
     * Public variable: editionRouterLinkButtons.
     *
     * It keeps the array for the edition router link buttons.
     */
    editionRouterLinkButtons: RouterLinkButton[];

    /**
     * Public variable: editionComplex.
     *
     * It keeps the current edition complex.
     */
    editionComplex: EditionComplex;

    /**
     * Private readonly variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private readonly _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getEditionComplex();
    }

    /**
     * Public method: getEditionComplex.
     *
     * It subscribes to the current edition complex
     * of the EditionStateService.
     *
     * @returns {void} Gets the current edition complex.
     */
    getEditionComplex(): void {
        this._editionStateService
            .getSelectedEditionComplex()
            .pipe(takeUntil(this._destroyed$))
            .subscribe({
                next: (complex: EditionComplex) => {
                    this.editionComplex = complex;
                    this.setButtons();
                },
            });
    }

    /**
     * Public method: setButtons.
     *
     * It initializes the editionRouterLinkButtons.
     *
     * @returns {void} Sets the editionRouterLinkButtons.
     */
    setButtons(): void {
        this.editionRouterLinkButtons = [
            new RouterLinkButton(
                this.editionComplex.baseRoute,
                EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route,
                EDITION_ROUTE_CONSTANTS.EDITION_INTRO.short,
                false
            ),
            new RouterLinkButton(
                this.editionComplex.baseRoute,
                EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route,
                EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.short,
                false
            ),
            new RouterLinkButton(
                this.editionComplex.baseRoute,
                EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route,
                EDITION_ROUTE_CONSTANTS.EDITION_REPORT.short,
                false
            ),
            new RouterLinkButton(
                this.editionComplex.baseRoute,
                EDITION_ROUTE_CONSTANTS.EDITION_GRAPH.route,
                EDITION_ROUTE_CONSTANTS.EDITION_GRAPH.short,
                false
            ),
        ];
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
        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Now let's also complete the subject itself
        this._destroyed$.complete();
    }
}
