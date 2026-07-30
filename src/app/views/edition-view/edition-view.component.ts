import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionView component.
 *
 * It contains the edition view section of the app
 * with a {@link HeadingComponent} and
 * another router outlet for the edition routes.
 */
@Component({
    selector: 'awg-edition-view',
    templateUrl: './edition-view.component.html',
    styleUrls: ['./edition-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class EditionViewComponent {
    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Readonly variable: EDITION_VIEW_ID.
     *
     * It keeps the id of the edition view section.
     */
    readonly EDITION_VIEW_ID = 'awg-edition-view';

    /**
     * Readonly variable: EDITION_VIEW_TITLE
     *
     * It keeps the title of the edition view section.
     */
    readonly EDITION_VIEW_TITLE = 'Editionsübersicht';

    /**
     * Readonly signal: isIntroView.
     *
     * It holds the state of the intro view.
     */
    readonly isIntroView = this._editionStateService.isIntroView;

    /**
     * Readonly signal: isPrefaceView.
     *
     * It holds the state of the preface view.
     */
    readonly isPrefaceView = this._editionStateService.isPrefaceView;

    /**
     * Readonly signal: isRowtablesView.
     *
     * It holds the state of the rowtables view.
     */
    readonly isRowtablesView = this._editionStateService.isRowtablesView;

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._editionStateService.selectedEditionComplex;

    /**
     * Readonly signal: selectedEditionSection.
     *
     * It holds the state of the selected edition section.
     */
    readonly selectedEditionSection = this._editionStateService.selectedEditionSection;

    /**
     * Readonly signal: selectedEditionSeries.
     *
     * It holds the state of the selected edition series.
     */
    readonly selectedEditionSeries = this._editionStateService.selectedEditionSeries;

    /**
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }
}
