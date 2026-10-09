import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { EditionComplexesService } from '@awg-views/edition-view/services/edition-complexes.service';
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
     * Private readonly computed signal: _complexFromRoute.
     *
     * It holds the edition complex for the given route param id, otherwise null.
     */
    private readonly _complexFromRoute = computed<EditionComplex | null>(() => {
        const currentComplexId = this.complexId();

        return currentComplexId
            ? (this._editionComplexesService.getEditionComplexById(currentComplexId) ?? null)
            : null;
    });

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
     * It syncs the edition complex of the current route to the EditionStateService
     * (which derives the corresponding series and section from it)
     * and resets it on cleanup.
     *
     * @returns {void} Updates the current edition complex from the route.
     */
    updateEditionComplexFromRoute(): void {
        effect(onCleanup => {
            this._editionStateService.updateSelectedEditionComplex(this._complexFromRoute());

            onCleanup(() => {
                this._editionStateService.updateSelectedEditionComplex(null);
            });
        });
    }
}
