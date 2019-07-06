import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The EditionView component.
 *
 * It contains the edition view section of the app
 * with a {@link HeadingComponent} and
 * another router outlet for the edition routes.
 */
@Component({
    selector: 'awg-edition-view',
    templateUrl: './edition-view.component.html',
    styleUrls: ['./edition-view.component.css']
})
export class EditionViewComponent implements OnInit {
    /**
     * Public variable: editionTitle.
     *
     * It keeps the title of the edition view section.
     */
    editionTitle = 'Beispieledition ausgewählter Skizzen zu <em>Vier Lieder</em> op. 12, Nr. 1';

    /**
     * Public variable: editionId.
     *
     * It keeps the id of the edition view section.
     */
    editionId = 'edition';

    /**
     * Constructor of the EditionViewComponent.
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
