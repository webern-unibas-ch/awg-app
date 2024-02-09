import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { delay, Observable } from 'rxjs';

import { UtilityService } from '@awg-app/core/services';
import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

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
     * It declares private instances of ActivatedRoute and EditionService,
     * and a public instance of the UtilityService.
     *
     * @param {ActivatedRoute} route Instance of the Angular ActivatedRoute.
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor(
        private route: ActivatedRoute,
        private editionService: EditionService,
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
        this.getEditionComplexFromRoute();
    }

    /**
     * Public method: getEditionComplexFromRoute.
     *
     * It subscribes to the route params to get the id of the current edition complex and load it from the edition service.
     *
     * @returns {void} Gets the current edition complex from the edition service.
     */
    getEditionComplexFromRoute(): void {
        this.route.paramMap.subscribe(params => {
            const id: string = params.get('complexId') ? params.get('complexId') : '';
            this.editionService.updateEditionComplex(EDITION_COMPLEXES[id.toUpperCase()]);
            this.selectedEditionComplex$ = this.editionService.getEditionComplex().pipe(delay(0));
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
        // Remove selected edition complex
        this.editionService.clearEditionComplex();
    }
}
