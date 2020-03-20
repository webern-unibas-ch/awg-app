import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MetaEdition, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';
import { EditionWorks } from '@awg-views/edition-view/models';

/**
 * The HomeView component.
 *
 * It contains the home view section of the app
 * with basic information about the prototype.
 */
@Component({
    selector: 'awg-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeViewComponent implements OnInit {
    /**
     * Public variable: editionInfoHeaderOp12.
     *
     * It keeps the header information for the edition-info for Op12.
     */
    editionInfoHeaderOp12 = {
        section: 'AWG I/5',
        title: 'Vier Lieder',
        catalogueType: 'op.',
        catalogueNumber: '12',
        part: 'Skizzen'
    };

    /**
     * Public variable: editionInfoHeaderOp25.
     *
     * It keeps the header information for the edition-info for Op25.
     */
    editionInfoHeaderOp25 = {
        section: 'AWG I/5',
        title: 'Drei Lieder nach Gedichten von Hildegard Jone',
        catalogueType: 'op.',
        catalogueNumber: '25',
        part: 'Graph'
    };

    /**
     * Readonly constant: editionWorkOp12.
     *
     * It keeps the current composition.
     */
    readonly editionWorkOp12 = EditionWorks.op12;

    /**
     * Readonly constant: editionWorkOp25.
     *
     * It keeps the current composition.
     */
    readonly editionWorkOp25 = EditionWorks.op25;

    /**
     * Public variable: editionMetaData.
     *
     * It keeps the edition meta data for the home view.
     */
    editionMetaData: MetaEdition;

    /**
     * Constructor of the HomeViewComponent.
     *
     * It declares a private CoreService instance
     * to get the meta data and a private Router instance.
     *
     * @param {CoreService} coreService Instance of the CoreService.
     * @param {Router} router Instance of the Angular router.
     */
    constructor(private coreService: CoreService, private router: Router) {}

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
     * the meta data for the home view.
     *
     * @returns {void} Sets the editionMetaData variable.
     */
    provideMetaData(): void {
        this.editionMetaData = this.coreService.getMetaDataSection(MetaSectionTypes.edition);
    }

    /**
     * Public method: routeToSidenav.
     *
     * It activates the secondary outlet with the edition-info.
     *
     * @returns {void} Activates the edition-info side outlet.
     */
    routeToSidenav(): void {
        // opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'editionInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve'
        });
    }
}
