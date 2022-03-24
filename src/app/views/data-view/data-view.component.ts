import { Component, OnInit } from '@angular/core';
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
export class DataViewComponent implements OnInit {
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
     * Constructor of the DataViewComponent.
     *
     * It declares a private Router instance.
     *
     * @param {Router} router Instance of the Angular router.
     */
    constructor(private router: Router) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.routeToSidenav();
    }

    /**
     * Public method: routeToSidenav.
     *
     * It activates the secondary outlet with the search-info.
     *
     * @returns {void} Activates the search-info side outlet.
     */
    routeToSidenav(): void {
        // Opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'searchInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve',
        });
    }
}
