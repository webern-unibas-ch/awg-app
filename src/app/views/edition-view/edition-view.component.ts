import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ButtonScrollToTopComponent } from '@awg-shared/button-scroll-to-top/button-scroll-to-top.component';
import { MetaIdentifierBadgesComponent } from '@awg-shared/meta/meta-identifier-badges/meta-identifier-badges.component';

import { EditionBreadcrumbComponent } from './edition-breadcrumb/edition-breadcrumb.component';
import { EditionJumbotronComponent } from './edition-jumbotron/edition-jumbotron.component';
import { EDITION_ROUTE_CONSTANTS } from './edition-routes.constants';

import { EditionBreadcrumbService } from './services/edition-breadcrumb.service';
import { EditionStateService } from './services/edition-state.service';
import { EditionViewService } from './services/edition-view.service';
import { EditionComplexPartsComponent } from './shared/complex/edition-complex-parts/edition-complex-parts.component';

/**
 * The EditionView component.
 *
 * It contains the edition view section of the app
 * with the edition breadcrumb and the edition jumbotron,
 * as well as the router outlet for the edition view child routes.
 *
 * The selected edition state is set by the route resolvers during the navigation
 * and reset by this component on destroy (i.e. when leaving the edition view).
 */
@Component({
    selector: 'awg-edition-view',
    templateUrl: './edition-view.component.html',
    styleUrl: './edition-view.component.scss',
    imports: [
        ButtonScrollToTopComponent,
        EditionBreadcrumbComponent,
        EditionComplexPartsComponent,
        EditionJumbotronComponent,
        MetaIdentifierBadgesComponent,
        DatePipe,
        RouterOutlet,
    ],
})
export class EditionViewComponent {
    /**
     * Private readonly injection variable: _destroyRef.
     *
     * It keeps the instance of the injected Angular DestroyRef.
     */
    private readonly _destroyRef = inject(DestroyRef);

    /**
     * Private readonly injection variable: _editionBreadcrumbService.
     *
     * It keeps the instance of the injected EditionBreadcrumbService.
     */
    private readonly _editionBreadcrumbService = inject(EditionBreadcrumbService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Private readonly injection variable: _editionViewService.
     *
     * It keeps the instance of the injected EditionViewService.
     */
    private readonly _editionViewService = inject(EditionViewService);

    /**
     * Readonly variable: editionViewId.
     *
     * It keeps the id of the edition view section.
     */
    readonly editionViewId = 'awg-edition-view';

    /**
     * Readonly variable: editionViewTitle
     *
     * It keeps the title of the edition view section.
     */
    readonly editionViewTitle = 'Editionsübersicht';

    /**
     * Readonly signal: viewContext.
     *
     * It holds the state of the view context.
     */
    readonly viewContext = this._editionViewService.viewContext;

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._editionStateService.selectedEditionComplex;

    /**
     * Readonly signal: selectedOutlineComplexItem.
     *
     * It holds the outline item of the selected edition complex.
     */
    readonly selectedOutlineComplexItem = this._editionStateService.selectedOutlineComplexItem;

    /**
     * Readonly signal: selectedEditionSection.
     *
     * It holds the state of the selected edition section.
     */
    readonly selectedEditionSection = this._editionStateService.selectedEditionSection;

    /**
     * Readonly signal: selectedEditionSeries.
     *
     * It holds the state of the selected edition series.
     */
    readonly selectedEditionSeries = this._editionStateService.selectedEditionSeries;

    /**
     * Readonly signal: breadcrumbItems.
     *
     * It holds the labeled route items for the breadcrumb.
     */
    readonly breadcrumbItems = this._editionBreadcrumbService.getBreadcrumbItems(
        this.viewContext,
        this.selectedEditionComplex,
        this.selectedOutlineComplexItem,
        this.selectedEditionSeries,
        this.selectedEditionSection
    );

    /**
     * Readonly signal: jumbotronTitle.
     *
     * It computes the title of the jumbotron.
     */
    readonly jumbotronTitle = computed<string>(() => {
        const context = this.viewContext();
        const series = this.selectedEditionSeries();
        const section = this.selectedEditionSection();
        const complex = this.selectedEditionComplex();
        const { PREFACE, EDITION_INTRO } = EDITION_ROUTE_CONSTANTS;

        if (context.isPreface) {
            return PREFACE.full;
        }

        if (context.isRowtables) {
            return 'Übersicht';
        }

        if (complex) {
            return complex.complexId.full;
        }

        if (context.isIntro) {
            return EDITION_INTRO.full;
        }

        if (section) {
            return section.section.full;
        }

        if (series) {
            return series.series.full;
        }

        return this.editionViewTitle;
    });

    /**
     * Constructor of the EditionViewComponent.
     *
     * It calls a method to reset the selected edition state on destroy.
     */
    constructor() {
        this._resetEditionStateOnDestroy();
    }

    /**
     * Private method: _resetEditionStateOnDestroy.
     *
     * It resets the selected edition complex, series and section in the EditionStateService
     * when the component is destroyed (i.e. when leaving the edition view).
     *
     * Within the edition view, the state is set and reset by the route resolvers only,
     * because they run before the components of the previous route are destroyed.
     *
     * @returns {void} Registers the reset of the edition state.
     */
    private _resetEditionStateOnDestroy(): void {
        this._destroyRef.onDestroy(() => {
            // Resetting the complex also resets the manually selected series and section
            this._editionStateService.updateSelectedEditionComplex(null);
        });
    }
}
