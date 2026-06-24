import { Router } from '@angular/router';
import { Component, inject, signal } from '@angular/core';

import { faEnvelope, faFileAlt, faHome, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';

import { Logos } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService } from '@awg-views/edition-view/services';

/**
 * The Header component.
 *
 * It contains the header section of the app
 * with the navigation bar, menu and brand.
 */
@Component({
    selector: 'awg-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false,
})
export class NavbarComponent {
    /**
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

    /**
     * Private readonly injection variable: _router.
     *
     * It keeps the instance of the injected Angular Router.
     */
    private readonly _router = inject(Router);

    /**
     * Public variable: isCollapsed.
     *
     * It keeps the boolean value if the header menu is collapsed or not.
     */
    isCollapsed = true;

    /**
     * Public readonly signal: logosData.
     *
     * It holds the logos data for the footer.
     */
    logosData = signal<Logos>(this._coreService.getLogos()).asReadonly();

    /**
     * Public variable: navbarIcons.
     *
     * It keeps the fontawesome icons for the navbar.
     */
    navbarIcons = {
        contact: faEnvelope,
        edition: faFileAlt,
        home: faHome,
        structure: faNetworkWired,
        search: faSearch,
    };

    /**
     * Public variable: navbarLabels.
     *
     * It keeps the labels for the navbar.
     */
    navbarLabels = {
        home: 'Home',
        complexes: 'Auswahl Skizzenkomplexe',
        contact: 'Kontakt',
        edition: 'Edition',
        general: 'Allgemein',
        search: 'Datenbank-Suche',
        structure: 'Strukturmodell',
    };

    /**
     * Readonly variable: DISPLAYED_EDITION_COMPLEXES.
     *
     * It keeps the array of displayed edition complexes.
     */
    readonly DISPLAYED_EDITION_COMPLEXES: EditionComplex[] = [
        EditionComplexesService.getEditionComplexById('op3'),
        EditionComplexesService.getEditionComplexById('op4'),
        EditionComplexesService.getEditionComplexById('op12'),
        EditionComplexesService.getEditionComplexById('op23'),
        EditionComplexesService.getEditionComplexById('op25'),
        EditionComplexesService.getEditionComplexById('m22'),
        EditionComplexesService.getEditionComplexById('m30'),
        EditionComplexesService.getEditionComplexById('m31'),
        EditionComplexesService.getEditionComplexById('m34'),
        EditionComplexesService.getEditionComplexById('m35_42'),
        EditionComplexesService.getEditionComplexById('m37'),
    ];

    /**
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }

    /**
     *
     */
    /**
     * Public method: isActiveRoute.
     *
     * It checks if a given route is active.

     * @param {string} route The route to check.
     *
     * @returns {boolean} The boolean value of the check.
     */
    isActiveRoute(route: string): boolean {
        return this._router.isActive(route, {
            paths: 'subset',
            queryParams: 'subset',
            fragment: 'ignored',
            matrixParams: 'ignored',
        });
    }

    /**
     * Public method: toggleNav.
     *
     * It toggles the isCollapsed flag.
     *
     * @returns {boolean} Sets the isCollapsed flag.
     */
    toggleNav(): boolean {
        this.isCollapsed = !this.isCollapsed;
        return this.isCollapsed;
    }
}
