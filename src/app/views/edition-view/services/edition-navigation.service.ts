import { inject, Service } from '@angular/core';
import { NavigationExtras, Router, UrlCreationOptions, UrlTree } from '@angular/router';

import { EDITION_ROUTE_CONSTANTS } from '../edition-routes.constants';
import { EditionNavigationFragmentTarget, EditionNavigationSheetTarget } from '../models/edition-navigation.model';

import { EditionStateService } from './edition-state.service';

/**
 * The EditionNavigationService.
 *
 * It provides navigation functionality for the edition view of the app.
 */
@Service()
export class EditionNavigationService {
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
    private readonly _router = inject(Router);

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._editionStateService.selectedEditionComplex;

    /**
     * Public method: getReportFragmentRoute.
     *
     * It returns the '/report/' route with the given complexId and fragmentId.
     *
     * @param {EditionNavigationFragmentTarget} reportTarget The given report fragment navigation target.
     * @returns {UrlTree} The route to the edition report fragment.
     */
    getReportFragmentRoute(reportTarget: EditionNavigationFragmentTarget): UrlTree {
        const reportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
        const urlCreationOptions: UrlCreationOptions = {
            fragment: reportTarget?.fragmentId ?? '',
        };
        return this._getComplexRoute(reportTarget?.complexId, reportRoute, urlCreationOptions);
    }

    /**
     * Public method: getSvgSheetRoute.
     *
     * It returns the '/sheets/' route with the provided sheetId
     * within the context of an edition complex identified by the provided complexId.
     *
     * @param {EditionNavigationSheetTarget} sheetTarget The given sheet navigation target.
     * @returns {UrlTree} The route to the edition sheet.
     */
    getSvgSheetRoute(sheetTarget: EditionNavigationSheetTarget): UrlTree {
        const sheetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
        const urlCreationOptions: UrlCreationOptions = {
            queryParams: { id: sheetTarget?.sheetId ?? '' },
        };
        return this._getComplexRoute(sheetTarget?.complexId, sheetRoute, urlCreationOptions);
    }

    /**
     * Public method: navigateToIntroFragment.
     *
     * It navigates to the given fragmentId on the current page.
     *
     * @param {EditionNavigationFragmentTarget} introTarget The given intro fragment navigation target.
     * @returns {void} Navigates to the edition intro fragment.
     */
    navigateToIntroFragment(introTarget: EditionNavigationFragmentTarget): void {
        const navigationExtras: NavigationExtras = {
            fragment: introTarget?.fragmentId ?? '',
        };
        void this._router.navigate([], navigationExtras);
    }

    /**
     * Public method: navigateToReportFragment.
     *
     * It navigates to the route of the given report fragment navigation target.
     *
     * @param {EditionNavigationFragmentTarget} reportTarget The given report fragment navigation target.
     * @returns {void} Navigates to the edition report fragment.
     */
    navigateToReportFragment(reportTarget: EditionNavigationFragmentTarget): void {
        void this._router.navigateByUrl(this.getReportFragmentRoute(reportTarget));
    }

    /**
     * Public method: navigateToSvgSheet.
     *
     * It navigates to the route of the given sheet navigation target.
     *
     * @param {EditionNavigationSheetTarget} sheetTarget The given sheet navigation target.
     * @returns {void} Navigates to the edition sheets.
     */
    navigateToSvgSheet(sheetTarget: EditionNavigationSheetTarget): void {
        void this._router.navigateByUrl(this.getSvgSheetRoute(sheetTarget));
    }

    /**
     * Private method: _getComplexRoute.
     *
     * It returns a target route within the edition complex of the provided complexId,
     * or of the selected edition complex if no complexId is given
     * (the series overview if no complex is selected).
     *
     * @param {string} complexId The given complex id.
     * @param {string} targetRoute The given target route.
     * @param {UrlCreationOptions} urlCreationOptions The given url creation options.
     * @returns {UrlTree} The target route.
     */
    private _getComplexRoute(complexId: string, targetRoute: string, urlCreationOptions: UrlCreationOptions): UrlTree {
        const selectedComplex = this.selectedEditionComplex();

        const complexRoute = complexId
            ? `/edition/complex/${complexId}`
            : (selectedComplex?.baseRoute ?? '/edition/series');

        return this._router.createUrlTree([complexRoute, targetRoute], urlCreationOptions);
    }
}
