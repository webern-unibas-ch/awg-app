import { Component, OnInit } from '@angular/core';

import { faEnvelope, faFileAlt, faHome, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';

import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';
import { EditionWorks } from '@awg-views/edition-view/data';
import { EditionWork } from '@awg-views/edition-view/models';
import { Router } from '@angular/router';

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
     * Public variable: selectedEditionWork.
     *
     * It keeps the currently selected composition.
     */
    selectedEditionWork: EditionWork;

    /**
     * Readonly constant: EDITION_WORKS.
     *
     * It keeps the array of compositions.
     */
    readonly EDITION_WORKS: EditionWork[] = [EditionWorks.OP12, EditionWorks.OP25];

    /**
     * Constructor of the HeaderComponent.
     *
     * It declares private instances of the CoreService and the Angular Router.
     *
     * @param {CoreService} coreService Instance of the CoreService.
     * @param {Router} router Instance of the Angular Router.
     */
    constructor(private coreService: CoreService, private router: Router) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getEditionWork();
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
     * Public method: getEditionWork.
     *
     * It gets the selected EditionWork.
     *
     * @returns {void} Sets the selectedEditionWork variable.
     */
    getEditionWork(): void {
        this.selectedEditionWork = this.EDITION_WORKS[0];
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
