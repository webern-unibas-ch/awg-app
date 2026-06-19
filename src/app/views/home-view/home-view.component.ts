import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';
import { AlertInfoComponent } from '@awg-shared/alert-info/alert-info.component';
import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineSection, EditionSectionLink } from '@awg-views/edition-view/models';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { HOME_VIEW_CARD_DATA } from './home-view-card/data/home-view-card.data';
import { HomeViewCardComponent } from './home-view-card/home-view-card.component';
import { HomeViewCard } from './home-view-card/models/home-view-card.model';

/**
 * The HomeView component.
 *
 * It contains the home view section of the app
 * with the landing page.
 */
@Component({
    selector: 'awg-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AlertInfoComponent, HeadingComponent, HomeViewCardComponent, RouterLink],
})
export class HomeViewComponent {
    /**
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

    /**
     * Public variable: HOME_VIEW_ID.
     *
     * It keeps the id for the heading component
     * of the home view section.
     */
    readonly HOME_VIEW_ID = 'awg-home-view-heading';

    /**
     * Public variable: HOME_VIEW_TITLE.
     *
     * It keeps the title for the heading component
     * of the home view section.
     */
    readonly HOME_VIEW_TITLE = 'Anton Webern Gesamtausgabe: Online-Edition';

    /**
     * Public variable: DISCLAIMER_MESSAGE.
     *
     * It keeps the disclaimer message for the home view section.
     */
    readonly DISCLAIMER_MESSAGE =
        'Die Online-Edition wird in Bezug auf Umfang und Funktionalität kontinuierlich erweitert.';

    /**
     * Public readonly signal: displayedSectionLinks.
     *
     * It holds the displayed section links for the home view section.
     */
    displayedSectionLinks = signal<EditionSectionLink[]>(
        HomeViewComponent.createEditionSectionLinks([
            EditionOutlineService.getEditionSectionById('1', '5'),
            EditionOutlineService.getEditionSectionById('1', '2'),
        ])
    ).asReadonly();

    /**
     * Public readonly signal: homeViewCardData.
     *
     * It holds the data for the home view cards.
     */
    homeViewCardData = signal<HomeViewCard[]>(HOME_VIEW_CARD_DATA).asReadonly();

    /**
     * Public readonly signal: pageMetaData.
     *
     * It holds the page metadata for the contact view via the injected CoreService.
     */
    pageMetaData = signal<MetaPage>(this._coreService.getMetaDataSection(MetaSectionTypes.page)).asReadonly();

    /**
     * Public readonly signal: rowtablesRoute.
     *
     * It holds the router link array for the rowtables link.
     */
    rowtablesRoute = signal([
        EDITION_ROUTE_CONSTANTS.EDITION.route,
        EDITION_ROUTE_CONSTANTS.ROWTABLES.route,
    ]).asReadonly();

    /**
     * Public static method: createEditionSectionLinks.
     *
     * It creates the formatted edition section links for the home view section.
     *
     * @param {EditionOutlineSection[]} sections The edition sections to be formatted.
     * @returns {EditionSectionLink[]} The formatted edition section links for the home view section.
     */
    static createEditionSectionLinks(sections: EditionOutlineSection[]): EditionSectionLink[] {
        const routes = EDITION_ROUTE_CONSTANTS;
        return sections.map((section, index, array) => {
            const routerLink = [
                routes.EDITION.route,
                routes.SERIES.route,
                section?.seriesParent?.route,
                routes.SECTION.route,
                section?.section?.route,
            ];

            const label = `${routes.EDITION.short} ${section?.seriesParent?.short}/${section?.section?.short}`;
            const separator = HomeViewComponent.getSeparator(index, array.length);

            return { section, routerLink, label, separator };
        });
    }

    /**
     * Public static method: getSeparator.
     *
     * It returns the appropriate separator for the displayed sections in the home view section.
     *
     * @param {number} index The index of the current section in the displayed sections array.
     * @param {number} totalLength The total length of the displayed sections array.
     * @returns {string} The appropriate separator for the displayed sections in the home view section.
     */
    static getSeparator(index: number, totalLength: number): string {
        if (index === totalLength - 1) {return '';}
        if (index === totalLength - 2) {return ' und ';}
        return ', ';
    }
}
