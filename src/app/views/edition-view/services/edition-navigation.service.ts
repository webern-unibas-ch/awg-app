import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { EDITION_ROUTE_CONSTANTS } from '../edition-routes.constants';

import { EditionStateService } from './edition-state.service';

/**
 * The FragmentClickEvent interface.
 *
 * It defines the structure for the intro fragment click event.
 */
export interface FragmentClickEvent {
    /**
     * The complex id of the click event.
     */
    complexId: string;

    /**
     * The intro fragment id of the click event.
     */
    fragmentId: string;
}

/**
 * The SheetClickEvent interface.
 *
 * It defines the structure for the SVG sheet click event.
 */
export interface SheetClickEvent {
    /**
     * The complex id of the click event.
     */
    complexId: string;

    /**
     * The sheet id of the click event.
     */
    sheetId: string;
}

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
     * @param {FragmentClickEvent} introIds The given intro ids as { complexId: string, fragmentId: string }.
     * @returns {void} Navigates to the edition intro fragment.
     */
    navigateToIntroFragment(introIds: FragmentClickEvent): void {
        const introRoute = EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route;
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
     * @param {FragmentClickEvent} reportIds The given report ids as { complexId: string, fragmentId: string }.
     * @returns {void} Navigates to the edition report fragment.
     */
    navigateToReportFragment(reportIds: FragmentClickEvent): void {
        const reportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
        const navigationExtras: NavigationExtras = {
            fragment: reportIds?.fragmentId ?? '',
        };
        this._navigateWithComplexId(reportIds?.complexId, reportRoute, navigationExtras);
    }

    /**
     * Public method: navigateToSvgSheet.
     *
     * It navigates to the '/sheet/' route using the provided sheetId
     * within the context of an edition complex identified by the provided complexId.
     *
     * @param {SheetClickEvent} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Navigates to the edition sheets.
     */
    navigateToSvgSheet(sheetIds: SheetClickEvent): void {
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
