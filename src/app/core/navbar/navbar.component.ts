import { Component, OnInit } from '@angular/core';

import { faEnvelope, faFileAlt, faHome, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';

import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';
import { EditionConstants, EditionPath } from '@awg-views/edition-view/models';

/**
 * The Header component.
 *
 * It contains the header section of the app
 * with the navigation bar, menu and brand.
 */
@Component({
    selector: 'awg-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
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
     * It keeps the page meta data for the header.
     */
    pageMetaData: MetaPage;

    /**
     * Readonly constant: editionPath.
     *
     * It keeps the path to the edition sections of the current composition.
     */
    readonly editionPath = new EditionPath(EditionConstants.op12);

    /**
     * Constructor of the HeaderComponent.
     *
     * It declares a private CoreService instance
     * to get the meta data.
     *
     * @param {CoreService} coreService Instance of the CoreService.
     */
    constructor(private coreService: CoreService) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.provideMetaData();
    }

    /**
     * Public method: provideMetaData.
     *
     * It calls the CoreService to provide
     * the meta data for the header.
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
        return (this.isCollapsed = !this.isCollapsed);
    }
}
