import { Component, computed, inject } from '@angular/core';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionOverview component.
 *
 * It contains the overview section
 * of the edition view of the app
 * with a {@link RouterLinkButtonGroupComponent} and
 * another router outlet for the edition routes.
 */
@Component({
    selector: 'awg-edition-detail-nav',
    templateUrl: './edition-detail-nav.component.html',
    styleUrls: ['./edition-detail-nav.component.scss'],
    standalone: false,
})
export class EditionDetailNavComponent {
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
     * Readonly signal: editionRouterLinkButtons.
     *
     * It computes the router link buttons based on the selected edition complex.
     */
    readonly editionRouterLinkButtons = computed(() => {
        const complex = this.selectedEditionComplex();

        if (!complex) {
            return null;
        }

        const route = EDITION_ROUTE_CONSTANTS;
        const buttonConfigs = [route.EDITION_INTRO, route.EDITION_SHEETS, route.EDITION_REPORT, route.EDITION_GRAPH];

        return buttonConfigs.map(config => new RouterLinkButton(complex.baseRoute, config.route, config.short, false));
    });
}
