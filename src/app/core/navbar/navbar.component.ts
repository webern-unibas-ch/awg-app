import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { isActive, Router } from '@angular/router';

import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { LogoComponent } from '@awg-shared/logos/logo.component';
import { LOGOS_DATA } from '@awg-shared/logos/logos.data';
import { ACTIVE_EDITION_SECTION_IDS } from '@awg-views/edition-view/data/active-edition-sections.data';
import { EditionSectionLink } from '@awg-views/edition-view/models';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { NavbarDropdownLinkComponent } from './navbar-dropdown-link/navbar-dropdown-link.component';
import { NavbarItemComponent } from './navbar-item/navbar-item.component';
import {
    NAVBAR_DROPDOWN_EDITION_GENERAL_LINKS,
    NAVBAR_DROPDOWN_EDITION_SECTION_LINKS,
    NAVBAR_ITEMS,
} from './navbar.data';

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
    imports: [LogoComponent, NavbarItemComponent, NavbarDropdownLinkComponent, NgbCollapse, NgbDropdownModule],
})
export class NavbarComponent {
    /**
     * Private readonly injection variable: _router.
     *
     * It keeps the instance of the injected Angular Router.
     */
    private readonly _router = inject(Router);

    /**
     * Readonly property: navbarItems.
     *
     * It keeps the navigation items for the navbar.
     */
    readonly navbarItems = NAVBAR_ITEMS;

    /**
     * Readonly property: generalEditionLinks.
     *
     * It keeps the general edition links for the navbar.
     */
    readonly generalEditionLinks = NAVBAR_DROPDOWN_EDITION_GENERAL_LINKS;

    /**
     * Readonly property: sectionEditionLinks.
     *
     * It keeps the section edition links for the navbar.
     */
    readonly sectionEditionLinks = NAVBAR_DROPDOWN_EDITION_SECTION_LINKS;

    /**
     * Readonly variable: logosData.
     *
     * It keeps the logos data for the footer.
     */
    readonly logosData = LOGOS_DATA;

    /**
     * Readonly signal: isCollapsed.
     *
     * It holds the boolean value if the header menu is collapsed or not.
     */
    readonly isCollapsed = signal(true);

    /**
     * Readonly signal: sectionLinksData.
     *
     * It keeps the array of displayed edition sections as a read-only signal.
     */
    readonly sectionLinksData = signal(
        ACTIVE_EDITION_SECTION_IDS.map((ids, index, array) => {
            const section = EditionOutlineService.getEditionSectionById(ids.seriesId, ids.sectionId);
            return new EditionSectionLink(section, index, array.length);
        })
    ).asReadonly();

    /**
     * Readonly signal: isEditionRouteActive.
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
}
