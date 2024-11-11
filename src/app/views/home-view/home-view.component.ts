import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { HOME_VIEW_CARD_DATA } from '@awg-views/home-view/data';
import { HomeViewCard } from '@awg-views/home-view/models';

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
    changeDetection: ChangeDetectionStrategy.Default,
})
export class HomeViewComponent implements OnInit {
    /**
     * Public variable: disclaimerInfoMessage.
     *
     * It keeps the disclaimer info message for the home view section.
     */
    disclaimerInfoMessage = 'Die Online-Edition wird in Bezug auf Umfang und Funktionalität kontinuierlich erweitert.';

    /**
     * Public variable: homeViewTitle.
     *
     * It keeps the title for the heading component
     * of the home view section.
     */
    homeViewTitle = 'Anton Webern Gesamtausgabe: Online-Edition';

    /**
     * Public variable: homeId.
     *
     * It keeps the id for the heading component
     * of the home view section.
     */
    homeViewId = 'awg-home-view';

    /**
     * Public variable: homeViewCardData.
     *
     * It keeps the data for the home view cards.
     */
    homeViewCardData: HomeViewCard[] = HOME_VIEW_CARD_DATA;

    /**
     * Public variable: pageMetaData.
     *
     * It keeps the page metadata for the home view.
     */
    pageMetaData: MetaPage;

    /**
     * Readonly variable: DISPLAYED_SECTIONS.
     *
     * It keeps the array of displayed sections.
     */
    readonly DISPLAYED_SECTIONS = [
        EditionOutlineService.getEditionSectionById('1', '5'),
        EditionOutlineService.getEditionSectionById('2', '2a'),
    ];

    /**
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

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
        this.provideMetaData();
    }

    /**
     * Public method: provideMetaData.
     *
     * It calls the CoreService to provide
     * the metadata for the contact view.
     *
     * @returns {void} Sets the pageMetaData variable.
     */
    provideMetaData(): void {
        this.pageMetaData = this._coreService.getMetaDataSection(MetaSectionTypes.page);
    }
}
