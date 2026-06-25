import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { isActive, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faFileAlt, faHome, faNetworkWired } from '@fortawesome/free-solid-svg-icons';

import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { Logos } from '../core-models/logos.model';
import { LogoLinkComponent } from '../logo-link/logo-link.component';
import { CoreService } from '../services/core-service/core.service';

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
    imports: [FaIconComponent, LogoLinkComponent, NgbCollapse, NgbDropdownModule, RouterLink, RouterLinkActive],
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
     * Public signal: isCollapsed.
     *
     * It holds the boolean value if the header menu is collapsed or not.
     */
    isCollapsed = signal(true);

    /**
     * Public readonly signal: logosData.
     *
     * It holds the logos data for the footer.
     */
    logosData = signal<Logos>(this._coreService.getLogos()).asReadonly();

    /**
     * Readonly signal: sectionsData.
     *
     * It keeps the array of displayed edition sections as a read-only signal.
     */
    sectionsData = signal([
        EditionOutlineService.getEditionSectionById('1', '5'),
        EditionOutlineService.getEditionSectionById('2', '2a'),
    ]).asReadonly();

    /**
     * Computed signal: displayedSections.
     *
     * It computes the array of edition sections to be displayed in the navbar.
     */
    displayedSections = computed(() =>
        this.sectionsData().map(section => {
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
        })
    );

    /**
     * Public signal: isEditionRouteActive.
     *
     * It checks if the edition route is active.
     */
    isEditionRouteActive = isActive('/edition', this._router);

    /**
     * Public variable: navItems.
     *
     * It keeps the navigation items for the navbar.
     */
    navItems = {
        home: {
            id: 'home',
            path: ['/home'],
            label: 'Home',
            icon: faHome,
            spanClass: 'd-sm-none d-md-inline order-md-2',
            iconClass: '',
        },
        edition: {
            id: 'edition',
            path: ['/edition'],
            label: 'Edition',
            icon: faFileAlt,
            spanClass: 'd-sm-none d-md-inline',
            iconClass: 'order-md-minus-1',
        },
        structure: {
            id: 'structure',
            path: ['/structure'],
            label: 'Strukturmodell',
            icon: faNetworkWired,
            spanClass: 'd-sm-none d-md-inline order-md-2',
            iconClass: '',
        },
        contact: {
            id: 'contact',
            path: ['/contact'],
            label: 'Kontakt',
            spanClass: 'd-sm-none d-lg-inline',
            icon: faEnvelope,
            iconClass: '',
        },
    } as const;

    /**
     * Readonly variable: GENERAL_EDITION_LINKS.
     *
     * It keeps the array of general edition links.
     */
    readonly GENERAL_EDITION_LINKS = [
        {
            path: [EDITION_ROUTE_CONSTANTS.EDITION.route, EDITION_ROUTE_CONSTANTS.SERIES.route],
            label: EDITION_ROUTE_CONSTANTS.SERIES.full,
        },
        {
            path: [EDITION_ROUTE_CONSTANTS.EDITION.route, EDITION_ROUTE_CONSTANTS.ROWTABLES.route],
            label: EDITION_ROUTE_CONSTANTS.ROWTABLES.full,
        },
        {
            path: [EDITION_ROUTE_CONSTANTS.EDITION.route, EDITION_ROUTE_CONSTANTS.PREFACE.route],
            label: EDITION_ROUTE_CONSTANTS.PREFACE.full,
        },
    ];

    /**
     * Readonly variable: SECTION_EDITION_LINKS.
     *
     * It keeps the array of section edition links.
     */
    readonly SECTION_EDITION_LINKS = [
        {
            suffix: [EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route],
            label: 'Einleitung / Intro',
        },
        {
            suffix: [],
            label: 'Übersicht',
        },
    ];

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
