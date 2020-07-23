import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { EditionConstants, EditionWork } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';
import { takeUntil } from 'rxjs/operators';

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
    styleUrls: ['./edition-overview.component.css']
})
export class EditionOverviewComponent implements OnInit, OnDestroy {
    /**
     * Private variable: destroy$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private destroy$: Subject<boolean> = new Subject<boolean>();

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
     * Private variable: subscription.
     *
     * It keeps the subscriptions of the component.
     */
    private subscription: Subscription;

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
            .pipe(takeUntil(this.destroy$))
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
                EditionConstants.editionIntro.short,
                false
            ),
            new RouterLinkButton(
                this.editionWork.baseRoute,
                this.editionWork.detailRoute.route,
                EditionConstants.editionDetail.short,
                false
            ),
            new RouterLinkButton(
                this.editionWork.baseRoute,
                this.editionWork.reportRoute.route,
                EditionConstants.editionReport.short,
                false
            ),
            new RouterLinkButton(
                this.editionWork.baseRoute,
                this.editionWork.graphRoute.route,
                EditionConstants.editionGraph.short,
                false
            )
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
        // emit truthy value to end all subscriptions
        this.destroy$.next(true);

        // Now let's also unsubscribe from the subject itself:
        this.destroy$.unsubscribe();
    }
}
