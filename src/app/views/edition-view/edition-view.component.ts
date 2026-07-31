import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { EDITION_ROUTE_CONSTANTS } from './edition-routes.constants';
import { EditionBreadcrumbService } from './services/edition-breadcrumb.service';
import { EditionStateService } from './services/edition-state.service';
import { EditionViewService } from './services/edition-view.service';

/**
 * The EditionView component.
 *
 * It contains the edition view section of the app
 * with a {@link HeadingComponent} and
 * another router outlet for the edition routes.
 */
@Component({
    selector: 'awg-edition-view',
    templateUrl: './edition-view.component.html',
    styleUrls: ['./edition-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class EditionViewComponent {
    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Readonly variable: EDITION_VIEW_ID.
     *
     * It keeps the id of the edition view section.
     */
    readonly EDITION_VIEW_ID = 'awg-edition-view';

    /**
     * Readonly variable: EDITION_VIEW_TITLE
     *
     * It keeps the title of the edition view section.
     */
    readonly EDITION_VIEW_TITLE = 'Editionsübersicht';

    /**
     * Readonly signal: viewContext.
     *
     * It holds the state of the view context.
     */
    readonly viewContext = inject(EditionViewService).viewContext;

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._editionStateService.selectedEditionComplex;

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
    readonly breadcrumbItems = inject(EditionBreadcrumbService).getBreadcrumbItems(
        this.viewContext,
        this.selectedEditionComplex,
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

        return this.EDITION_VIEW_TITLE;
    });
}
