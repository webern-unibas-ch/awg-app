import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { delay, Observable } from 'rxjs';

import {
    EditionConstants,
    EditionRoute,
    EditionSeriesRoutes,
    EditionWork,
    EditionWorks,
} from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

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
    styleUrls: ['./edition-view.component.css'],
})
export class EditionViewComponent implements OnInit {
    /**
     * Public variable: editionViewTitle
     *
     * It keeps the title of the edition view section.
     */
    editionViewTitle = 'Beispieledition ausgewählter Skizzen';

    /**
     * Public variable: editionViewId.
     *
     * It keeps the id of the edition view section.
     */
    editionViewId = 'awg-edition-view';

    /**
     * Public variable: editionWork$.
     *
     * Observable that keeps the information
     * about the current composition.
     */
    editionWork$: Observable<EditionWork>;

    editionRoute: EditionRoute;
    seriesRoute: EditionRoute;
    selectedSeries$: Observable<EditionSeriesRoutes>;
    selectedSection$: Observable<EditionRoute>;

    /**
     * Constructor of the EditionViewComponent.
     *
     * It declares private instances of
     * EditionService, ActivatedRoute and Router.
     *
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {ActivatedRoute} route Instance of the Angular ActivatedRoute.
     * @param {Router} router Instance of the Angular router.
     */
    constructor(private editionService: EditionService, private route: ActivatedRoute, private router: Router) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.routeToSidenav();
        this.getSeriesFromRoute();
        this.getEditionWorkFromRoute();
    }

    /**
     * Public method: getEditionWorkFromRoute.
     *
     * It subscribes to the route params to get the compositionId of the current work and load it from the edition service.
     *
     * @returns {void} Gets the current work from the edition service.
     */
    getEditionWorkFromRoute(): void {
        this.route.paramMap.subscribe(params => {
            const id: string = params.get('compositionId') ? params.get('compositionId') : '';
            this.editionService.updateEditionWork(EditionWorks[id.toUpperCase()]);
            this.editionWork$ = this.editionService.getEditionWork();
        });
    }

    /**
     * Public method: getSeriesFromRoute.
     *
     * It loads the selected series and section from the edition service (if given).
     *
     * @returns {void} Gets the selected series and section from the edition service.
     */
    getSeriesFromRoute(): void {
        this.editionRoute = EditionConstants.EDITION;
        this.seriesRoute = EditionConstants.SERIES;
        this.selectedSeries$ = this.editionService.getSelectedEditionSeries().pipe(delay(0));
        this.selectedSection$ = this.editionService.getSelectedEditionSection().pipe(delay(0));
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
        });
    }
}
