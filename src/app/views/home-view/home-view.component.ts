import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MetaPage, MetaSectionTypes } from '@awg-core/models/meta.model';
import { CoreService } from '@awg-core/services/core-service/core.service';
import { AlertInfoComponent } from '@awg-shared/alert-info/alert-info.component';
import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { ACTIVE_EDITION_SECTION_IDS } from '@awg-views/edition-view/data/active-edition-sections.data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionSectionLink } from '@awg-views/edition-view/models';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { HOME_VIEW_CARD_DATA } from './home-view-card/data/home-view-card.data';
import { HomeViewCardComponent } from './home-view-card/home-view-card.component';
import { HomeViewCard } from './home-view-card/home-view-card.model';

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
     * Readonly signal: sectionLinksData.
     *
     * It keeps the array of displayed edition sections as a read-only signal.
     */
    readonly sectionLinksData = signal<EditionSectionLink[]>(
        ACTIVE_EDITION_SECTION_IDS.map((ids, index, array) => {
            const section = EditionOutlineService.getEditionSectionById(ids.seriesId, ids.sectionId);
            return new EditionSectionLink(section, index, array.length);
        })
    ).asReadonly();

    /**
     * Readonly signal: homeViewCardData.
     *
     * It holds the data for the home view cards.
     */
    readonly homeViewCardData = signal<HomeViewCard[]>(HOME_VIEW_CARD_DATA).asReadonly();

    /**
     * Readonly signal: pageMetaData.
     *
     * It holds the page metadata for the home view via the injected CoreService.
     */
    readonly pageMetaData = signal<MetaPage>(this._coreService.getMetaDataSection(MetaSectionTypes.page)).asReadonly();

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
