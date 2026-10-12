import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

/**
 * The EditionComplex component.
 *
 * It contains the edition complex section of the app
 * with another router outlet for the edition detail routes.
 *
 * The selected edition complex is set by the {@link editionComplexResolver}
 * during the navigation and reset by this component on destroy.
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
     * Private readonly injection variable: _destroyRef.
     *
     * It keeps the instance of the injected Angular DestroyRef.
     */
    private readonly _destroyRef = inject(DestroyRef);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

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
     * It calls a method to reset the selected edition complex on destroy.
     */
    constructor() {
        this._resetEditionComplexOnDestroy();
    }

    /**
     * Private method: _resetEditionComplexOnDestroy.
     *
     * It resets the selected edition complex in the EditionStateService
     * when the component is destroyed (i.e. when leaving the complex routes).
     *
     * @returns {void} Registers the reset of the edition complex.
     */
    private _resetEditionComplexOnDestroy(): void {
        this._destroyRef.onDestroy(() => {
            this._editionStateService.updateSelectedEditionComplex(null);
        });
    }
}
