import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AlertInfoComponent } from '@awg-shared/alert-info/alert-info.component';
import { ExternalLinkDirective } from '@awg-shared/external-link/external-link.directive';
import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { META_DATA } from '@awg-shared/meta/meta.data';
import { MetaSectionTypes } from '@awg-shared/meta/meta.model';
import { ScrollToTopButtonComponent } from '@awg-shared/scroll-to-top-button/scroll-to-top-button.component';

import { ACTIVE_EDITION_SECTION_IDS } from '@awg-views/edition-view/data/active-edition-sections.data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionSectionLink } from '@awg-views/edition-view/models';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { HomeViewCardComponent } from './home-view-card/home-view-card.component';
import { HOME_VIEW_CARD_DATA } from './home-view-card/home-view-card.data';

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
    imports: [
        AlertInfoComponent,
        ExternalLinkDirective,
        HeadingComponent,
        HomeViewCardComponent,
        RouterLink,
        ScrollToTopButtonComponent,
    ],
})
export class HomeViewComponent {
    /**
     * Readonly variable: HOME_VIEW_ID.
     *
     * It keeps the id for the heading component
     * of the home view section.
     */
    readonly HOME_VIEW_ID = 'awg-home-view-heading';

    /**
     * Readonly variable: HOME_VIEW_TITLE.
     *
     * It keeps the title for the heading component
     * of the home view section.
     */
    readonly HOME_VIEW_TITLE = 'Anton Webern Gesamtausgabe: Online-Edition';

    /**
     * Readonly variable: DISCLAIMER_MESSAGE.
     *
     * It keeps the disclaimer message for the home view section.
     */
    readonly DISCLAIMER_MESSAGE =
        'Die Online-Edition wird in Bezug auf Umfang und Funktionalität kontinuierlich erweitert.';

    /**
     * Readonly variable: homeViewCardData.
     *
     * It keeps the data for the home view cards.
     */
    readonly homeViewCardData = HOME_VIEW_CARD_DATA;

    /**
     * Readonly variable: pageMetaData.
     *
     * It keeps the page metadata for the home view.
     */
    readonly pageMetaData = META_DATA[MetaSectionTypes.page];

    /**
     * Readonly signal: sectionLinksData.
     *
     * It holds the array of displayed edition sections as a read-only signal.
     */
    readonly sectionLinksData = signal<EditionSectionLink[]>(
        ACTIVE_EDITION_SECTION_IDS.map((ids, index, array) => {
            const section = EditionOutlineService.getEditionSectionById(ids.seriesId, ids.sectionId);
            return new EditionSectionLink(section, index, array.length);
        })
    ).asReadonly();

    /**
     * Readonly signal: rowtablesRoute.
     *
     * It holds the router link array for the rowtables link.
     */
    readonly rowtablesRoute = signal([
        EDITION_ROUTE_CONSTANTS.EDITION.route,
        EDITION_ROUTE_CONSTANTS.ROWTABLES.route,
    ]).asReadonly();
}
