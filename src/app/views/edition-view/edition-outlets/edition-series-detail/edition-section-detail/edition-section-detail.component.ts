import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/operators';

import { EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionSectionDetail component.
 *
 * It contains the detail of a section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-section-detail',
    templateUrl: './edition-section-detail.component.html',
    styleUrls: ['./edition-section-detail.component.scss'],
    standalone: false,
})
export class EditionSectionDetailComponent {
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
     * Constructor of the EditionSectionDetailComponent.
     *
     * It calls a method to update the edition section from the route.
     *
     */
    constructor() {
        this.updateSectionFromRoute();
    }

    /**
     * Public method: updateSectionFromRoute.
     *
     * It reactively tracks the route params and the selected series
     * to update the corresponding edition section in the EditionStateService.
     *
     * @returns {void} Updates the edition section from the route.
     */
    updateSectionFromRoute(): void {
        effect(() => {
            const series = this._editionStateService.selectedEditionSeries();
            if (!series) {
                return;
            }

            this._route.paramMap.pipe(map(paramMap => paramMap.get('id'))).subscribe(sectionId => {
                const seriesId = series.series?.route;
                const selectedSection = EditionOutlineService.getEditionSectionById(seriesId, sectionId);

                this._editionStateService.updateSelectedEditionSection(selectedSection);
            });
        });
    }
}
