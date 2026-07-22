import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UTILS } from '@awg-shared/utils/object-utils';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
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
    standalone: false,
})
export class EditionComplexComponent implements OnDestroy, OnInit {
    /**
     * Private readonly injection variable: _editionComplexesService.
     *
     * It keeps the instance of the injected EditionComplexesService.
     */
    private readonly _editionComplexesService = inject(EditionComplexesService);

    /**
     * Private readonly injection variable: _editionOutlineService.
     *
     * It keeps the instance of the injected EditionOutlineService.
     */
    private readonly _editionOutlineService = inject(EditionOutlineService);

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
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._editionStateService.selectedEditionComplex;

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
            const complex = this._editionComplexesService.getEditionComplexById(id);

            if (UTILS.isEmptyObject(complex)) {
                this._editionStateService.updateSelectedEditionSeries(null);
            } else {
                const series =
                    this._editionOutlineService.getEditionSeriesById(complex.pubStatement.series.route) ?? null;
                const section =
                    this._editionOutlineService.getEditionSectionById(
                        complex.pubStatement.series.route,
                        complex.pubStatement.section.route
                    ) ?? null;

                this._editionStateService.updateSelectedEditionSeries(series);
                this._editionStateService.updateSelectedEditionSection(section);
                this._editionStateService.updateSelectedEditionComplex(complex);
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
        this._editionStateService.updateSelectedEditionSeries(null);
    }
}
