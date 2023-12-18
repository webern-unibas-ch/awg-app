import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MetaPage, MetaSectionTypes } from '@awg-app/core/core-models';
import { CoreService } from '@awg-app/core/services';
import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS, EDITION_TYPE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';

/**
 * The HomeView component.
 *
 * It contains the home view section of the app
 * with basic information about the prototype.
 */
@Component({
    selector: 'awg-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeViewComponent implements OnInit {
    /**
     * Public variable: homeViewTitle.
     *
     * It keeps the title for the heading component
     * of the home view section.
     */
    homeViewTitle = 'Beispieleditionen ausgewählter Skizzen';

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
     * Readonly constant: EDITION_COMPLEX_M30.
     *
     * It keeps the edition complex M 30.
     */
    readonly EDITION_COMPLEX_M30 = EDITION_COMPLEXES.M30;

    /**
     * Readonly constant: EDITION_COMPLEX_M34.
     *
     * It keeps the edition complex M 34.
     */
    readonly EDITION_COMPLEX_M34 = EDITION_COMPLEXES.M34;

    /**
     * Readonly variable: EDITION_COMPLEX_OP12.
     *
     * It keeps the edition complex Opus 12.
     */
    readonly EDITION_COMPLEX_OP12 = EDITION_COMPLEXES.OP12;

    /**
     * Readonly variable: EDITION_COMPLEX_OP25.
     *
     * It keeps the edition complex Opus 25.
     */
    readonly EDITION_COMPLEX_OP25 = EDITION_COMPLEXES.OP25;

    /**
     * Constructor of the HomeViewComponent.
     *
     * It declares a private CoreService instance
     * to get the metadata and a private Router instance.
     *
     * @param {CoreService} coreService Instance of the CoreService.
     * @param {Router} router Instance of the Angular router.
     */
    constructor(
        private coreService: CoreService,
        private router: Router
    ) {}

    /**
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }

    /**
     * Getter variable: editionTypeConstants.
     *
     *  It returns the EDITION_TYPES.
     **/
    get editionTypeConstants(): typeof EDITION_TYPE_CONSTANTS {
        return EDITION_TYPE_CONSTANTS;
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.routeToSidenav();
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

    /**
     * Public method: routeToSidenav.
     *
     * It activates the secondary outlet with the edition-info.
     *
     * @returns {void} Activates the edition-info side outlet.
     */
    routeToSidenav(): void {
        // Opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'editionInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve',
        });
    }
}
