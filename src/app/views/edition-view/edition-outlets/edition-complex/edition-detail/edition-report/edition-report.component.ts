import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { ModalComponent } from '@awg-shared/modal/modal.component';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

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
    standalone: false,
})
export class EditionReportComponent {
    /**
     * ViewChild variable: modal.
     *
     * It keeps the reference to the awg-modal.
     */
    @ViewChild('modal', { static: true }) modal: ModalComponent;

    /**
     * Private readonly injection variable: _editionDataService.
     *
     * It keeps the instance of the injected EditionDataService.
     */
    private readonly _editionDataService = inject(EditionDataService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Private readonly injection variable: _router.
     *
     * It keeps the instance of the injected Angular Router.
     */
    private readonly _router: any = inject(Router);

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._editionStateService.selectedEditionComplex;

    /**
     * Readonly signal: viewData.
     *
     * It holds the state of the report view data.
     */
    readonly viewData = this._editionDataService.reportViewData;

    /**
     * Readonly signal: viewReady.
     *
     * It holds a flag indicating if the view is ready.
     */
    readonly viewReady = signal<boolean>(false);

    /**
     * Readonly variable: titles.
     *
     * It keeps an object for the titles of the report sections.
     */
    readonly titles = {
        sourceList: '1. Quellenübersicht',
        sourceDescription: '2. Quellenbeschreibung',
        sourceEvaluation: '3. Quellenbewertung',
        tka: '4. Textkritische Anmerkungen',
    };

    /**
     * Constructor of the EditionReportComponent.
     *
     * It initializes the component and sets the viewReady signal to true after a short delay
     * to show the loadingSpinner when switching between complex views.
     *
     */
    constructor() {
        setTimeout(() => {
            this.viewReady.set(true);
        }, 0);
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
     * It navigates to the '/report/' route using the provided fragmentId
     * within the context of an edition complex identified by the provided complexId.
     *
     * @param {object}  reportIds The given report ids as { complexId: string, fragmentId: string }.
     * @returns {void} Navigates to the edition report.
     */
    onReportFragmentNavigate(reportIds: { complexId: string; fragmentId: string }): void {
        const reportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
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
        const sheetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
        const navigationExtras: NavigationExtras = {
            queryParams: { id: sheetIds?.sheetId ?? '' },
            // .queryParamsHandling: '',
        };

        this._navigateWithComplexId(sheetIds?.complexId, sheetRoute, navigationExtras);
    }

    /**
     * Private method: _navigateWithComplexId.
     *
     * It navigates to a target route using the provided complexId.
     *
     * @param {string | undefined} complexId The given complex id.
     * @param {string} targetRoute The given target route.
     * @param {NavigationExtras} navigationExtras The given navigation extras.
     * @returns {void} Navigates to the target route.
     */
    private _navigateWithComplexId(
        complexId: string | undefined,
        targetRoute: string,
        navigationExtras: NavigationExtras
    ): void {
        const complexRoute = complexId
            ? `/edition/complex/${complexId}`
            : (this.selectedEditionComplex()?.baseRoute ?? '/edition/series');

        this._router.navigate([complexRoute, targetRoute], navigationExtras);
    }
}
