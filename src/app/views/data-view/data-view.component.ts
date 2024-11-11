import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The DataView component.
 *
 * It contains the data view section of the app
 * with an {@link HeadingComponent} and
 * another router outlet for the data (search) routes.
 */
@Component({
    selector: 'awg-data',
    templateUrl: './data-view.component.html',
    styleUrls: ['./data-view.component.scss'],
})
export class DataViewComponent implements OnInit, OnDestroy {
    /**
     * Public variable: searchTitle.
     *
     * It keeps the title for the heading component
     * of the data view section.
     */
    searchTitle = 'Suche';

    /**
     * Public variable: searchId.
     *
     * It keeps the id for the heading component
     * of the data view section.
     */
    searchId = 'search';

    /**
     * Private readonly injection variable: _router.
     *
     * It keeps the instance of the injected Angular Router.
     */
    private readonly _router = inject(Router);

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.navigateToSideOutlet();
    }

    /**
     * Public method: navigateToSideOutlet.
     *
     * It activates the side outlet with the search-info.
     *
     * @returns {void} Activates the search-info side outlet.
     */
    navigateToSideOutlet(): void {
        // Opens the side-info outlet while preserving the router fragment for scrolling
        this._router.navigate([{ outlets: { side: 'searchInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve',
        });
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods when destroying the component.
     */
    ngOnDestroy() {
        // Navigate to an empty outlet to clear the side outlet
        this._router.navigate([{ outlets: { side: null } }]);
    }
}
