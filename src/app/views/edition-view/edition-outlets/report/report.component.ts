import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';

import {
    EditionConstants,
    EditionWork,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';
import { catchError, switchMap } from 'rxjs/operators';

/**
 * The Report component.
 *
 * It contains the report section of the edition view of the app
 * with a {@link HeadingComponent}, a {@link ModalComponent},
 * the {@link SourcesComponent} and the {@link TextcriticsComponent}.
 */
@Component({
    selector: 'awg-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {
    /**
     * Public variable: editionWork.
     *
     * It keeps the information about the current composition.
     */
    editionWork: EditionWork;

    /**
     * Public variable: editionReportData$.
     *
     * Observable that keeps the report data.
     */
    editionReportData$: Observable<[SourceList, SourceDescriptionList, SourceEvaluationList, TextcriticsList]>;

    /**
     * Public variable: errorObject.
     *
     * It keeps an errorObject for the service calls.
     */
    errorObject = null;

    /**
     * Constructor of the ReportComponent.
     *
     * It declares a private EditionDataService instance
     * to get the report data and a private Router instance.
     *
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {Router} router Instance of the Router.
     */
    constructor(
        private editionDataService: EditionDataService,
        private editionService: EditionService,
        private router: Router
    ) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getEditionReportData();
    }

    /**
     * Public method: getEditionReportData.
     *
     * It calls the EditionDataService to provide
     * the data for the edition report.
     *
     * @returns {void} Sets the editionReportData observable.
     */
    getEditionReportData(): void {
        this.editionReportData$ = this.editionService
            // get current editionWork from editionService
            .getEditionWork()
            .pipe(
                switchMap((work: EditionWork) => {
                    // set current editionWork
                    this.editionWork = work;
                    // get intro data from editionDataService
                    return this.editionDataService.getEditionReportData(this.editionWork);
                }),
                // error handling
                catchError(err => {
                    this.errorObject = err;
                    return throwError(err);
                })
            );
    }

    /**
     * Public method: onReportFragmentNavigate.
     *
     * It navigates to the '/report/' route with the given fragmentId.
     *
     * @param {string}  fragmentId The given fragment id.
     * @returns {void} Navigates to the edition report.
     */
    onReportFragmentNavigate(fragmentId: string) {
        if (!fragmentId) {
            fragmentId = '';
        }
        const navigationExtras: NavigationExtras = {
            fragment: fragmentId
        };
        this.router.navigate([this.editionWork.baseRoute, this.editionWork.reportRoute], navigationExtras);
    }

    /**
     * Public method: onSvgSheetSelect.
     *
     * It navigates to the '/edition/composition/{id}/detail'
     * route with the given id.
     *
     * @param {string} id The given svg sheet id.
     * @returns {void} Navigates to the edition detail.
     */
    onSvgSheetSelect(id: string): void {
        if (!id) {
            id = '';
        }
        const navigationExtras: NavigationExtras = {
            queryParams: { sketch: id },
            queryParamsHandling: ''
        };

        this.router.navigate([this.editionWork.baseRoute, this.editionWork.detailRoute], navigationExtras);
    }
}
