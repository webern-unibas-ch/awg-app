import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { delay, EMPTY, Observable } from 'rxjs';

import { UtilityService } from '@awg-core/services';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionComplex component.
 *
 * It contains the edition complex section of the app
 * with another router outlet for the edition detail routes.
 */
@Component({
    selector: 'awg-edition-complex',
    templateUrl: './edition-complex.component.html',
    styleUrls: ['./edition-complex.component.scss'],
})
export class EditionComplexComponent implements OnDestroy, OnInit {
    /**
     * Public variable: selectedEditionComplex$.
     *
     * Observable that keeps the information
     * about the current edition complex.
     */
    selectedEditionComplex$: Observable<EditionComplex>;

    /**
     * Constructor of the EditionComplexComponent.
     *
     * It declares private instances of ActivatedRoute and EditionStateService,
     * and a public instance of the UtilityService.
     *
     * @param {ActivatedRoute} route Instance of the Angular ActivatedRoute.
     * @param {EditionStateService} editionStateService Instance of the EditionStateService.
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor(
        private route: ActivatedRoute,
        private editionStateService: EditionStateService,
        public utils: UtilityService
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
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this.updateEditionComplexFromRoute();
    }

    /**
     * Public method: updateEditionComplexFromRoute.
     *
     * It fetches the route params to get the id of the current edition complex
     * and updates the EditionStateService.
     *
     * @returns {void} Updates the current edition complex from the route.
     */
    updateEditionComplexFromRoute(): void {
        this.route.paramMap.subscribe(params => {
            const id: string = params.get('complexId') || '';
            const complex = EditionComplexesService.getEditionComplexById(id.toUpperCase());

            if (this.utils.isNotEmptyObject(complex)) {
                const series = EditionOutlineService.getEditionSeriesById(complex.pubStatement.series.route);
                const section = EditionOutlineService.getEditionSectionById(
                    complex.pubStatement.series.route,
                    complex.pubStatement.section.route
                );

                this.editionStateService.updateSelectedEditionSeries(series);
                this.editionStateService.updateSelectedEditionSection(section);
                this.editionStateService.updateSelectedEditionComplex(complex);

                this.selectedEditionComplex$ = this.editionStateService.getSelectedEditionComplex().pipe(delay(0));
            } else {
                this.selectedEditionComplex$ = EMPTY;
            }
        });
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     *
     * Destroys subscriptions.
     */
    ngOnDestroy() {
        this.editionStateService.clearSelectedEditionComplex();
        this.editionStateService.clearSelectedEditionSeries();
        this.editionStateService.clearSelectedEditionSection();
    }
}
