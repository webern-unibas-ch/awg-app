import { ChangeDetectionStrategy, Component, computed, inject, ViewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NavigationExtras, Router } from '@angular/router';

import { EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { ModalComponent } from '@awg-shared/modal/modal.component';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionReport component.
 *
 * It contains the report section of the edition view of the app
 * with a {@link HeadingComponent}, a {@link ModalComponent},
 * the {@link SourcesComponent} and the {@link TextcriticsComponent}.
 */
@Component({
    selector: 'awg-edition-report',
    templateUrl: './edition-report.component.html',
    styleUrls: ['./edition-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionReportComponent {
    /**
     * ViewChild variable: modal.
     *
     * It keeps the reference to the awg-modal.
     */
    @ViewChild('modal', { static: true }) modal: ModalComponent;

    /**
     * Private readonly injection variable: _editionDataService.
     *
     * It keeps the instance of the injected EditionDataService.
     */
    private readonly _editionDataService = inject(EditionDataService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Private readonly injection variable: _router.
     *
     * It keeps the instance of the injected Angular Router.
     */
    private readonly _router: any = inject(Router);

    /**
     * Public variable: editionComplex.
     *
     * It keeps the information about the current edition complex.
     */
    editionComplex: EditionComplex;

    /**
     * Public variable: errorObject.
     *
     * It keeps an errorObject for the service calls.
     */
    errorObject = null;

    /**
     * Readonly signal: editionReportData.
     *
     * It holds the report data for the selected edition complex.
     */
    readonly editionReportData = toSignal(
        toObservable(this._editionStateService.selectedEditionComplex).pipe(
            switchMap((complex: EditionComplex | null) => {
                if (!complex) {
                    return EMPTY;
                }
                this.editionComplex = complex;
                return this._editionDataService.getEditionReportData(complex);
            }),
            catchError(err => {
                this.errorObject = err;
                return EMPTY;
            })
        )
    );

    /**
     * Readonly signal: sourceListData.
     *
     * It computes the source list data from the complete report data.
     */
    readonly sourceListData = computed(() => {
        const report = this.editionReportData();
        return report && report[0] ? (report[0] as SourceList) : null;
    });

    /**
     * Readonly signal: sourceDescriptionListData.
     *
     * It computes the source description list data from the complete report data.
     */
    readonly sourceDescriptionListData = computed(() => {
        const report = this.editionReportData();
        return report && report[1] ? (report[1] as SourceDescriptionList) : null;
    });

    /**
     * Readonly signal: sourceEvaluationListData.
     *
     * It computes the source evaluation list data from the complete report data.
     */
    readonly sourceEvaluationListData = computed(() => {
        const report = this.editionReportData();
        return report && report[2] ? (report[2] as SourceEvaluationList) : null;
    });

    /**
     * Readonly signal: textcriticsListData.
     *
     * It computes the textcritics list data from the complete report data.
     */
    readonly textcriticsListData = computed(() => {
        const report = this.editionReportData();
        return report && report[3] ? (report[3] as TextcriticsList) : null;
    });

    /**
     * Readonly variable: titles.
     *
     * It keeps an object for the titles of the report sections.
     */
    readonly titles = {
        sourceList: '1. Quellenübersicht',
        sourceDescription: '2. Quellenbeschreibung',
        sourceEvaluation: '3. Quellenbewertung',
        tka: '4. Textkritische Anmerkungen',
    };

    /**
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }

    /**
     * Public method: onModalOpen.
     *
     * It opens the {@link ModalComponent} with a given id of a modal snippet text.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Opens the modal with the snippet id.
     */
    onModalOpen(id: string): void {
        if (!id) {
            return;
        }
        this.modal.open(id);
    }

    /**
     * Public method: onReportFragmentNavigate.
     *
     * It navigates to the '/report/' route using the provided fragmentId
     * within the context of an edition complex identified by the provided complexId.
     *
     * @param {object}  reportIds The given report ids as { complexId: string, fragmentId: string }.
     * @returns {void} Navigates to the edition report.
     */
    onReportFragmentNavigate(reportIds: { complexId: string; fragmentId: string }): void {
        const reportRoute = this.editionRouteConstants.EDITION_REPORT.route;
        const navigationExtras: NavigationExtras = {
            fragment: reportIds?.fragmentId ?? '',
        };

        this._navigateWithComplexId(reportIds?.complexId, reportRoute, navigationExtras);
    }

    /**
     * Public method: onSvgSheetSelect.
     *
     * It navigates to the '/sheet/' route using the provided sheetId
     * within the context of an edition complex identified by the provided complexId.
     *
     * @param {object} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Navigates to the edition sheets.
     */
    onSvgSheetSelect(sheetIds: { complexId: string; sheetId: string }): void {
        const sheetRoute = this.editionRouteConstants.EDITION_SHEETS.route;
        const navigationExtras: NavigationExtras = {
            queryParams: { id: sheetIds?.sheetId ?? '' },
            // .queryParamsHandling: '',
        };

        this._navigateWithComplexId(sheetIds?.complexId, sheetRoute, navigationExtras);
    }

    /**
     * Private method: _navigateWithComplexId.
     *
     * It navigates to a target route using the provided complexId.
     *
     * @param {string} complexId The given complex id.
     * @param {string} targetRoute The given target route.
     * @param {NavigationExtras} navigationExtras The given navigation extras.
     * @returns {void} Navigates to the target route.
     */
    private _navigateWithComplexId(complexId: string, targetRoute: string, navigationExtras: NavigationExtras): void {
        const complexRoute = complexId ? `/edition/complex/${complexId}` : this.editionComplex.baseRoute;

        this._router.navigate([complexRoute, targetRoute], navigationExtras);
    }
}
