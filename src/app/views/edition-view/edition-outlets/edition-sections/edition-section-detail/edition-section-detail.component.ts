import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { delay, Subject } from 'rxjs';

import { EditionRoute, EditionSeriesRoutes } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';
import { takeUntil } from 'rxjs/operators';

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
})
export class EditionSectionDetailComponent implements OnInit, OnDestroy {
    /**
     * Public variable: selectedSeries.
     *
     * It keeps the selected series of the edition.
     */
    selectedSeries: EditionSeriesRoutes;

    /**
     * Public variable: selectedSection.
     *
     * It keeps the selected section of the edition.
     */
    selectedSection: EditionRoute;

    /**
     * Private variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor of the EditionSectionDetailComponent.
     *
     * It declares private instances of the Angular ActivatedRoute and the EditionService.
     *
     * @param {ActivatedRoute} route Instance of the ActivatedRoute.
     * @param {EditionService} editionService Instance of the EditionService.
     */
    constructor(private route: ActivatedRoute, private editionService: EditionService) {
        // Intentionally left empty until implemented
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getSection();
    }

    /**
     * Public method: getSection.
     *
     * It gets the selected section by ID from the EditionService and sets the editionRoute constant.
     *
     * @returns {void} Gets the edition section.
     */
    getSection(): void {
        const sectionId = this.route.snapshot.paramMap.get('id');

        this.editionService
            .getSelectedEditionSeries()
            .pipe(delay(0), takeUntil(this._destroyed$))
            .subscribe(series => {
                if (series) {
                    this.selectedSeries = series;
                    const seriesId = series.series.route;
                    this.selectedSection = this.editionService.getEditionSectionById(seriesId, sectionId);
                    this.editionService.updateSelectedEditionSection(this.selectedSection);
                }
            });
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     *
     * Destroys subscriptions.
     */
    ngOnDestroy() {
        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Now let's also complete the subject itself
        this._destroyed$.complete();
    }
}
