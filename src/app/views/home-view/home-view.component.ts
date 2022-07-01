import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EditionWorks } from '@awg-views/edition-view/data';

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
     * Readonly constant: EDITION_COMPLEX_OP12.
     *
     * It keeps the current composition.
     */
    readonly EDITION_COMPLEX_OP12 = EditionWorks.OP12;

    /**
     * Readonly constant: EDITION_COMPLEX_OP25.
     *
     * It keeps the current composition.
     */
    readonly EDITION_COMPLEX_OP25 = EditionWorks.OP25;

    /**
     * Constructor of the HomeViewComponent.
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
        // Opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'editionInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve',
        });
    }
}
