import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

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
     * Private readonly variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private readonly _destroyed$: Subject<boolean> = new Subject<boolean>();

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
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.updateSectionFromRoute();
    }

    /**
     * Public method: updateSectionFromRoute.
     *
     * It fetches the route params to get the id of the current section
     * and updates the EditionStateService.
     *
     * @returns {void} Updates the edition section.
     */
    updateSectionFromRoute(): void {
        const sectionId = this._route.snapshot.paramMap.get('id');

        this._editionStateService
            .getSelectedEditionSeries()
            .pipe(
                takeUntil(this._destroyed$),
                filter(series => !!series)
            )
            .subscribe(series => {
                const seriesId = series?.series?.route;
                const selectedSection = EditionOutlineService.getEditionSectionById(seriesId, sectionId);
                this._editionStateService.updateSelectedEditionSection(selectedSection);
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
