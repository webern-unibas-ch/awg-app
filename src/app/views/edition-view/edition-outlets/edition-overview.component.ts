import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { EditionConstants, EditionWork } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

/**
 * The EditionOverview component.
 *
 * It contains the overview section
 * of the edition view of the app
 * with a {@link RouterLinkButtonGroupComponent} and
 * another router outlet for the edition routes.
 */
@Component({
    selector: 'awg-edition-overview',
    templateUrl: './edition-overview.component.html',
    styleUrls: ['./edition-overview.component.css'],
})
export class EditionOverviewComponent implements OnInit, OnDestroy {
    /**
     * Public variable: editionRouterLinkButtons.
     *
     * It keeps the array for the edition router link buttons.
     */
    editionRouterLinkButtons: RouterLinkButton[];

    /**
     * Public variable: editionWork.
     *
     * It keeps the current composition.
     */
    editionWork: EditionWork;

    /**
     * Private variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor of the EditionOverviewComponent.
     *
     * It declares a private instance of EditionService.
     *
     * @param {EditionService} editionService Instance of the EditionService.
     */
    constructor(private editionService: EditionService) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getEditionWork();
    }

    /**
     * Public method: getEditionWork.
     *
     * It subscribes to the current edition work
     * of the edition service.
     *
     * @returns {void} Gets the current edition work.
     */
    getEditionWork(): void {
        this.editionService
            .getEditionWork()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((work: EditionWork) => {
                this.editionWork = work;
                this.setButtons();
            });
    }

    /**
     * Public method: setButtons.
     *
     * It initializes the editionRouterLinkButtons.
     *
     * @returns {void} Sets the editionRouterLinkButtons.
     */
    setButtons(): void {
        this.editionRouterLinkButtons = [
            new RouterLinkButton(
                this.editionWork.baseRoute,
                this.editionWork.introRoute.route,
                EditionConstants.EDITION_INTRO.short,
                false
            ),
            new RouterLinkButton(
                this.editionWork.baseRoute,
                this.editionWork.detailRoute.route,
                EditionConstants.EDITION_DETAIL.short,
                false
            ),
            new RouterLinkButton(
                this.editionWork.baseRoute,
                this.editionWork.reportRoute.route,
                EditionConstants.EDITION_REPORT.short,
                false
            ),
            new RouterLinkButton(
                this.editionWork.baseRoute,
                this.editionWork.graphRoute.route,
                EditionConstants.EDITION_GRAPH.short,
                false
            ),
        ];
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
