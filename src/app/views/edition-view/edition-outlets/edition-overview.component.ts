import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { EditionConstants, EditionPath } from '@awg-views/edition-view/models';
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
    styleUrls: ['./edition-overview.component.css']
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
    editionWork: EditionPath;

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
        this.subscription = this.editionService.getEditionWork().subscribe(work => {
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
                this.editionWork.rootRoute,
                this.editionWork.introRoute,
                EditionConstants.editionIntro.short,
                false
            ),
            new RouterLinkButton(
                this.editionWork.rootRoute,
                this.editionWork.detailRoute,
                EditionConstants.editionDetail.short,
                false
            ),
            new RouterLinkButton(
                this.editionWork.rootRoute,
                this.editionWork.reportRoute,
                EditionConstants.editionReport.short,
                false
            ),
            new RouterLinkButton(
                this.editionWork.rootRoute,
                this.editionWork.graphRoute,
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
        this.subscription.unsubscribe();
    }
}
