import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { delay, Observable } from 'rxjs';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
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
    changeDetection: ChangeDetectionStrategy.Default,
})
export class EditionViewComponent implements OnInit {
    /**
     * Public variable: editionViewTitle
     *
     * It keeps the title of the edition view section.
     */
    editionViewTitle = 'Editionsübersicht';

    /**
     * Public variable: editionViewId.
     *
     * It keeps the id of the edition view section.
     */
    editionViewId = 'awg-edition-view';

    /**
     * Public variable: isIntroView$.
     *
     * Observable that keeps the information
     * about the flag for the intro view.
     */
    isIntroView$: Observable<boolean>;

    /**
     * Public variable: isPrefaceView$.
     *
     * Observable that keeps the information
     * about the flag for the preface view.
     */
    isPrefaceView$: Observable<boolean>;

    /**
     * Public variable: isRowTableView$.
     *
     * Observable that keeps the information
     * about the flag for the row table view.
     */
    isRowTableView$: Observable<boolean>;

    /**
     * Public variable: selectedEditionComplex$.
     *
     * Observable that keeps the information
     * about the current edition complex.
     */
    selectedEditionComplex$: Observable<EditionComplex>;

    /**
     * Public variable: selectedEditionSection$.
     *
     * It keeps the selected section of the edition as an Observable of EditionOutlineSection.
     */
    selectedEditionSection$: Observable<EditionOutlineSection>;

    /**
     * Public variable: selectedEditionSeries$.
     *
     * It keeps the selected series of the edition as an Observable of EditionOutlineSeries.
     */
    selectedEditionSeries$: Observable<EditionOutlineSeries>;

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

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
    ngOnInit() {
        this.setupEditionView();
    }

    /**
     * Public method: setupEditionView.
     *
     * It sets up the edition view by loading
     * the selected series, section, and edition complex
     * from the EditionStateService.
     *
     * @returns {void} Sets up the edition view.
     */
    setupEditionView(): void {
        this.selectedEditionSeries$ = this._editionStateService.getSelectedEditionSeries().pipe(delay(0));
        this.selectedEditionSection$ = this._editionStateService.getSelectedEditionSection().pipe(delay(0));
        this.selectedEditionComplex$ = this._editionStateService.getSelectedEditionComplex().pipe(delay(0));
        this.isIntroView$ = this._editionStateService.getIsIntroView().pipe(delay(0));
        this.isPrefaceView$ = this._editionStateService.getIsPrefaceView().pipe(delay(0));
        this.isRowTableView$ = this._editionStateService.getIsRowTableView().pipe(delay(0));
    }
}
