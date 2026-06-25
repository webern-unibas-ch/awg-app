import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionSeriesDetail component.
 *
 * It contains the detail of a series
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-series-detail',
    templateUrl: './edition-series-detail.component.html',
    styleUrls: ['./edition-series-detail.component.scss'],
    standalone: false,
})
export class EditionSeriesDetailComponent implements OnInit, OnDestroy {
    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Private readonly injection variable: _route.
     *
     * It keeps the instance of the injected Angular ActivatedRoute.
     */
    private readonly _route = inject(ActivatedRoute);

    /**
     * Private readonly variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private readonly _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.updateSeriesFromRoute();
    }

    /**
     * Public method: updateSeriesFromRoute.
     *
     * It fetches the route params to get the id of the current series
     * and updates the EditionStateService.
     *
     * @returns {void} Updates the edition series.
     */
    updateSeriesFromRoute(): void {
        this._route.paramMap.pipe(takeUntil(this._destroyed$)).subscribe({
            next: paramMap => {
                const id = paramMap.get('id');
                const selectedSeries = EditionOutlineService.getEditionSeriesById(id);
                this._editionStateService.updateSelectedEditionSeries(selectedSeries);
            },
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
