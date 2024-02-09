import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { faEnvelope, faFileAlt, faHome, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';

import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';
import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';

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
})
export class NavbarComponent implements OnInit {
    /**
     * Public variable: faEnvelope.
     *
     * It instantiates fontawesome's faEnvelope icon.
     */
    faEnvelope = faEnvelope;

    /**
     * Public variable: faFileAlt.
     *
     * It instantiates fontawesome's faFileAlt icon.
     */
    faFileAlt = faFileAlt;

    /**
     * Public variable: faHome.
     *
     * It instantiates fontawesome's faHome icon.
     */
    faHome = faHome;

    /**
     * Public variable: faNetworkWired.
     *
     * It instantiates fontawesome's faNetworkWired icon.
     */
    faNetworkWired = faNetworkWired;

    /**
     * Public variable: faSearch.
     *
     * It instantiates fontawesome's faSearch icon.
     */
    faSearch = faSearch;

    /**
     * Public variable: isCollapsed.
     *
     * If the header menu is collapsed or not.
     */
    isCollapsed = true;

    /**
     * Public variable: pageMetaData.
     *
     * It keeps the page metadata for the header.
     */
    pageMetaData: MetaPage;

    /**
     * Public variable: selectedEditionComplex.
     *
     * It keeps the currently selected edition complex.
     */
    selectedEditionComplex: EditionComplex;

    /**
     * Readonly variable: DISPLAYED_EDITION_COMPLEXES.
     *
     * It keeps the array of displayed edition complexes.
     */
    readonly DISPLAYED_EDITION_COMPLEXES: EditionComplex[] = [
        EDITION_COMPLEXES.OP12,
        EDITION_COMPLEXES.OP25,
        EDITION_COMPLEXES.M30,
        EDITION_COMPLEXES.M31,
        EDITION_COMPLEXES.M34,
        EDITION_COMPLEXES.M37,
    ];

    /**
     * Constructor of the HeaderComponent.
     *
     * It declares private instances of the CoreService and the Angular Router.
     *
     * @param {CoreService} coreService Instance of the CoreService.
     * @param {Router} router Instance of the Angular Router.
     */
    constructor(
        private coreService: CoreService,
        private router: Router
    ) {}

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
        this.getEditionComplex();
        this.provideMetaData();
    }

    /**
     * Public method: isActiveRoute.
     *
     * It checks if a given route is active.

     * @param {string} route The route to check.
     *
     * @returns {boolean} The boolean value of the check.
     */
    isActiveRoute(route: string): boolean {
        return this.router.isActive(route, {
            paths: 'subset',
            queryParams: 'subset',
            fragment: 'ignored',
            matrixParams: 'ignored',
        });
    }

    /**
     * Public method: getEditionComplex.
     *
     * It gets the selected edition complex.
     *
     * @returns {void} Sets the selectedEditionComplex variable.
     */
    getEditionComplex(): void {
        this.selectedEditionComplex = this.DISPLAYED_EDITION_COMPLEXES[0];
    }

    /**
     * Public method: provideMetaData.
     *
     * It calls the CoreService to provide
     * the metadata for the header.
     *
     * @returns {void} Sets the pageMetaData variable.
     */
    provideMetaData(): void {
        this.pageMetaData = this.coreService.getMetaDataSection(MetaSectionTypes.page);
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
