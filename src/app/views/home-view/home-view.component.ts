import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MetaEdition, MetaSectionTypes } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

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
