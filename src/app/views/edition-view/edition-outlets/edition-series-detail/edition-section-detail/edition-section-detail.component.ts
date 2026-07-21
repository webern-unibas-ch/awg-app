import { Component, effect, inject, input } from '@angular/core';

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
     * Input signal: sectionId.
     *
     * It holds the route param id of the edition section (automatically bound by the router).
     */
    sectionId = input<string | null>(null);

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
            const currentSectionId = this.sectionId();

            if (!series) {
                return;
            }

            const seriesId = series.series?.route;
            const selectedSection = this._editionOutlineService.getEditionSectionById(seriesId, currentSectionId);

            this._editionStateService.updateSelectedEditionSection(selectedSection);
        });
    }
}
