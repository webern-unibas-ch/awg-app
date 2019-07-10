import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { SourceList, TextcriticsList } from '@awg-views/edition-view/models';
import { EditionDataService } from '@awg-views/edition-view/services';

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
     * Public variable: editionReportData$.
     *
     * Observable that keeps the report data.
     */
    editionReportData$: Observable<[SourceList, TextcriticsList]>;

    /**
     * Public variable: reportId.
     *
     * It keeps the id of the report section.
     */
    reportId = 'report';

    /**
     * Public variable: reportTitle.
     *
     * It keeps the title of the report section.
     */
    reportTitle = 'Kritischer Bericht';

    /**
     * Constructor of the ReportComponent.
     *
     * It declares a private EditionDataService instance
     * to get the report data and a private Router instance.
     *
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     * @param {Router} router Instance of the Router.
     */
    constructor(private editionDataService: EditionDataService, private router: Router) {}

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
        this.editionReportData$ = this.editionDataService.getEditionReportData();
    }

    /**
     * Public method: onSvgSheetSelect.
     *
     * It navigates to the '/edition/detail'
     * route with the given id.
     *
     * @param {string} id The given svg sheet id.
     * @returns {void} Navigates to the edition detail.
     */
    onSvgSheetSelect(id: string): void {
        this.router.navigate(['/edition/detail', id]);
    }
}
