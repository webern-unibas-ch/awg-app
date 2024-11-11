import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Private readonly injection variable: _route.
     *
     * It keeps the instance of the injected Angular ActivatedRoute.
     */
    private readonly _route = inject(ActivatedRoute);

    /**
     * Private readonly injection variable: _utils.
     *
     * It keeps the instance of the injected UtilityService.
     */
    private readonly _utils = inject(UtilityService);

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
        this._route.paramMap.subscribe(params => {
            const id: string = params.get('complexId') || '';
            const complex = EditionComplexesService.getEditionComplexById(id.toUpperCase());

            if (this._utils.isNotEmptyObject(complex)) {
                const series = EditionOutlineService.getEditionSeriesById(complex.pubStatement.series.route);
                const section = EditionOutlineService.getEditionSectionById(
                    complex.pubStatement.series.route,
                    complex.pubStatement.section.route
                );

                this._editionStateService.updateSelectedEditionSeries(series);
                this._editionStateService.updateSelectedEditionSection(section);
                this._editionStateService.updateSelectedEditionComplex(complex);

                this.selectedEditionComplex$ = this._editionStateService.getSelectedEditionComplex().pipe(delay(0));
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
        this._editionStateService.clearSelectedEditionComplex();
        this._editionStateService.clearSelectedEditionSeries();
        this._editionStateService.clearSelectedEditionSection();
    }
}
