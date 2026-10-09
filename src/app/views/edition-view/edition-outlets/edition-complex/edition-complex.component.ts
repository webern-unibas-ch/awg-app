import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UTILS } from '@awg-shared/utils/object-utils';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplexesService } from '@awg-views/edition-view/services/edition-complexes.service';
import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet],
})
export class EditionComplexComponent {
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
     * Readonly input signal: complexId.
     *
     * It holds the route param id of the edition complex (automatically bound by the router).
     */
    readonly complexId = input<string | null>(null);

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._editionStateService.selectedEditionComplex;

    /**
     * Readonly variable: editionRouteConstants.
     *
     * It keeps the EDITION_ROUTE_CONSTANTS.
     */
    readonly editionRouteConstants = EDITION_ROUTE_CONSTANTS;

    /**
     * Constructor of the EditionComplexComponent.
     *
     * It calls a method to update the edition complex from the route.
     *
     */
    constructor() {
        this.updateEditionComplexFromRoute();
    }

    /**
     * Public method: updateEditionComplexFromRoute.
     *
     * It reactively tracks the route param id of the current edition complex
     * and updates the corresponding series, section and complex in the EditionStateService.
     *
     * @returns {void} Updates the current edition complex from the route.
     */
    updateEditionComplexFromRoute(): void {
        effect(onCleanup => {
            const currentComplexId = this.complexId();
            const complex = currentComplexId
                ? this._editionComplexesService.getEditionComplexById(currentComplexId)
                : null;

            if (!complex || UTILS.isEmptyObject(complex)) {
                this._editionStateService.updateSelectedEditionSeries(null);
                return;
            }

            const series = this._editionOutlineService.getEditionSeriesById(complex.pubStatement.series.route) ?? null;
            const section =
                this._editionOutlineService.getEditionSectionById(
                    complex.pubStatement.series.route,
                    complex.pubStatement.section.route
                ) ?? null;

            this._editionStateService.updateSelectedEditionSeries(series);
            this._editionStateService.updateSelectedEditionSection(section);
            this._editionStateService.updateSelectedEditionComplex(complex);

            onCleanup(() => {
                this._editionStateService.updateSelectedEditionSeries(null);
            });
        });
    }
}
