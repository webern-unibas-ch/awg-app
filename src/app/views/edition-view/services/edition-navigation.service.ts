import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { EDITION_ROUTE_CONSTANTS } from '../edition-routes.constants';
import { EditionNavigationFragmentTarget, EditionNavigationSheetTarget } from '../models/edition-navigation.model';

import { EditionStateService } from './edition-state.service';

/**
 * The EditionNavigationService.
 *
 * It provides navigation functionality for the edition view of the app.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionNavigationService {
    /**
     * Private readonly injection variable: _router.
     *
     * It keeps the instance of the injected Angular Router.
     */
    private readonly _router = inject(Router);

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = inject(EditionStateService).selectedEditionComplex;

    /**
     * Public method: navigateToIntroFragment.
     *
     * It navigates to the '/intro/' route with the given complexId and fragmentId.
     *
     * @param {EditionNavigationFragmentTarget} introTarget The given intro fragment navigation target.
     * @returns {void} Navigates to the edition intro fragment.
     */
    navigateToIntroFragment(introTarget: EditionNavigationFragmentTarget): void {
        const introRoute = EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route;
        const navigationExtras: NavigationExtras = {
            fragment: introTarget?.fragmentId ?? '',
        };
        this._navigateWithComplexId(introTarget?.complexId, introRoute, navigationExtras);
    }

    /**
     * Public method: navigateToReportFragment.
     *
     * It navigates to the '/report/' route with the given complexId and fragmentId.
     *
     * @param {EditionNavigationFragmentTarget} reportTarget The given report fragment navigation target.
     * @returns {void} Navigates to the edition report fragment.
     */
    navigateToReportFragment(reportTarget: EditionNavigationFragmentTarget): void {
        const reportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
        const navigationExtras: NavigationExtras = {
            fragment: reportTarget?.fragmentId ?? '',
        };
        this._navigateWithComplexId(reportTarget?.complexId, reportRoute, navigationExtras);
    }

    /**
     * Public method: navigateToSvgSheet.
     *
     * It navigates to the '/sheet/' route using the provided sheetId
     * within the context of an edition complex identified by the provided complexId.
     *
     * @param {EditionNavigationSheetTarget} sheetTarget The given sheet navigation target.
     * @returns {void} Navigates to the edition sheets.
     */
    navigateToSvgSheet(sheetTarget: EditionNavigationSheetTarget): void {
        const sheetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
        const navigationExtras: NavigationExtras = {
            queryParams: { id: sheetTarget?.sheetId ?? '' },
            // .queryParamsHandling: '',
        };

        this._navigateWithComplexId(sheetTarget?.complexId, sheetRoute, navigationExtras);
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
        const selectedComplex = this.selectedEditionComplex();

        const complexRoute = complexId
            ? `/edition/complex/${complexId}`
            : (selectedComplex?.baseRoute ?? '/edition/series');

        const routeCommands =
            targetRoute === EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route ? [] : [complexRoute, targetRoute];

        this._router.navigate(routeCommands, navigationExtras);
    }
}
