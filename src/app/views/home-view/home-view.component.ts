import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineService } from '@awg-views/edition-view/services';

/**
 * The HomeView component.
 *
 * It contains the home view section of the app
 * with basic information about the application.
 */
@Component({
    selector: 'awg-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeViewComponent implements OnInit {
    /**
     * Public variable: faArrowRight.
     *
     * It instantiates fontawesome's faArrowRight icon.
     */
    faArrowRight = faArrowRight;

    /**
     * Public variable: disclaimerInfoMessage.
     *
     * It keeps the disclaimer info message for the home view section.
     */
    disclaimerInfoMessage =
        'Die Online-Edition und die Datenbank-Suche werden in ihrer Funktionalität kontinuierlich erweitert.';

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
     * Public variable: pageMetaData.
     *
     * It keeps the page metadata for the contact view.
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
     * Constructor of the HomeViewComponent.
     *
     * It declares a private CoreService instance
     * to get the metadata.
     *
     * @param {CoreService} coreService Instance of the CoreService.
     */
    constructor(private coreService: CoreService) {}

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
        this.pageMetaData = this.coreService.getMetaDataSection(MetaSectionTypes.page);
    }
}
