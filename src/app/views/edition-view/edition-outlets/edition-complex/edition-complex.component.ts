import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { delay, Observable } from 'rxjs';

import { EditionWork, EditionWorks } from '@awg-views/edition-view/models';
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
    styleUrls: ['./edition-complex.component.css'],
})
export class EditionComplexComponent implements OnInit {
    /**
     * Public variable: editionWork$.
     *
     * Observable that keeps the information
     * about the current composition.
     */
    editionWork$: Observable<EditionWork>;

    /**
     * Constructor of the EditionComplexComponent.
     *
     * It declares private instances of ActivatedRoute and EditionService.
     *
     * @param {ActivatedRoute} route Instance of the Angular ActivatedRoute.
     * @param {EditionService} editionService Instance of the EditionService.
     */
    constructor(private route: ActivatedRoute, private editionService: EditionService) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
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
            this.editionWork$ = this.editionService.getEditionWork().pipe(delay(0));
        });
    }
}
