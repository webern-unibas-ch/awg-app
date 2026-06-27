import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { isActive, Router } from '@angular/router';

import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineSection } from '@awg-views/edition-view/models/edition-outline.model';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { LogoLinkComponent } from '../logo-link/logo-link.component';
import { Logos } from '../models/logos.model';
import { CoreService } from '../services/core-service/core.service';

import {
    NAVBAR_DISPLAYED_SECTION_IDS,
    NAVBAR_DROPDOWN_EDITION_GENERAL_LINKS,
    NAVBAR_DROPDOWN_EDITION_SECTION_LINKS,
    NAVBAR_ITEMS,
} from './data/navbar.data';
import { NavbarSection } from './models/navbar.model';
import { NavbarDropdownLinkComponent } from './navbar-dropdown-link/navbar-dropdown-link.component';
import { NavbarItemComponent } from './navbar-item/navbar-item.component';

/**
 * The Navbar component.
 *
 * It contains the header section of the app
 * with the navigation bar, menu and brand.
 */
@Component({
    selector: 'awg-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LogoLinkComponent, NavbarItemComponent, NavbarDropdownLinkComponent, NgbCollapse, NgbDropdownModule],
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
     * Public readonly property: navbarItems.
     *
     * It keeps the navigation items for the navbar.
     */
    readonly navbarItems = NAVBAR_ITEMS;

    /**
     * Public readonly property: generalEditionLinks.
     *
     * It keeps the general edition links for the navbar.
     */
    readonly generalEditionLinks = NAVBAR_DROPDOWN_EDITION_GENERAL_LINKS;

    /**
     * Public readonly property: sectionEditionLinks.
     *
     * It keeps the section edition links for the navbar.
     */
    readonly sectionEditionLinks = NAVBAR_DROPDOWN_EDITION_SECTION_LINKS;

    /**
     * Public readonly signal: isCollapsed.
     *
     * It holds the boolean value if the header menu is collapsed or not.
     */
    readonly isCollapsed = signal(true);

    /**
     * Public readonly signal: logosData.
     *
     * It holds the logos data for the footer.
     */
    readonly logosData = signal<Logos>(this._coreService.getLogos()).asReadonly();

    /**
     * Public readonly signal: sectionsData.
     *
     * It keeps the array of displayed edition sections as a read-only signal.
     */
    readonly sectionsData = signal(
        NAVBAR_DISPLAYED_SECTION_IDS.map(section =>
            EditionOutlineService.getEditionSectionById(section.seriesId, section.sectionId)
        )
    ).asReadonly();

    /**
     * Computed signal: displayedSections.
     *
     * It computes the array of edition sections to be displayed in the navbar.
     */
    readonly displayedSections = computed(() =>
        this.sectionsData().map(section => this._mapSectionToNavbarLink(section))
    );

    /**
     * Public readonly signal: isEditionRouteActive.
     *
     * It checks if the edition route is active.
     */
    readonly isEditionRouteActive = isActive('/edition', this._router);

    /**
     * Public method: toggleNav.
     *
     * It toggles the isCollapsed signal.
     *
     * @returns {void} Updates the isCollapsed signal.
     */
    toggleNav(): void {
        this.isCollapsed.update(collapsed => !collapsed);
    }

    /**
     * Private method: _mapSectionToNavbarLink.
     *
     * It maps a section to a navbar link object.
     *
     * @param {EditionOutlineSection} section The section to be mapped.
     *
     * @returns {object} The mapped navbar link object.
     */
    private _mapSectionToNavbarLink(section: EditionOutlineSection): NavbarSection {
        const baseRoute = [
            EDITION_ROUTE_CONSTANTS.EDITION.route,
            EDITION_ROUTE_CONSTANTS.SERIES.route,
            section.seriesParent.route,
            EDITION_ROUTE_CONSTANTS.SECTION.route,
            section.section.route,
        ];
        const shortTitle = `[${EDITION_ROUTE_CONSTANTS.EDITION.short} ${section.seriesParent.short}/${section.section.short}]`;

        return {
            baseRoute,
            shortTitle,
            fullTitle: section.section.full,
        };
    }
}
