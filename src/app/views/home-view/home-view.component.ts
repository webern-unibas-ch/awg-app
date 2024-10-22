import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';
import { EDITION_ROUTE_CONSTANTS, EDITION_TYPE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService } from '@awg-views/edition-view/services';

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
     * Public variable: homeViewTitle.
     *
     * It keeps the title for the heading component
     * of the home view section.
     */
    homeViewTitle = 'AWG-APP: die Online-Edition der Anton Webern Gesamtausgabe';

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
     * Readonly variable: DISPLAYED_EDITION_COMPLEXES.
     *
     * It keeps the array of displayed edition complexes.
     */
    readonly DISPLAYED_EDITION_COMPLEXES: EditionComplex[] = [
        EditionComplexesService.getEditionComplexById('OP3'),
        EditionComplexesService.getEditionComplexById('OP4'),
        EditionComplexesService.getEditionComplexById('OP12'),
        EditionComplexesService.getEditionComplexById('OP23'),
        EditionComplexesService.getEditionComplexById('OP25'),
        EditionComplexesService.getEditionComplexById('M22'),
        EditionComplexesService.getEditionComplexById('M30'),
        EditionComplexesService.getEditionComplexById('M31'),
        EditionComplexesService.getEditionComplexById('M34'),
        EditionComplexesService.getEditionComplexById('M35_42'),
        EditionComplexesService.getEditionComplexById('M37'),
    ];

    /**
     * Readonly variable: sliceIndex.
     *
     * It keeps the index for the slice of edition complexes.
     */
    readonly SLICE_INDEX = 5;

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
