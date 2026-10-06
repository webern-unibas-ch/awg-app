import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavLinkGroupComponent } from '@awg-shared/nav-link-group/nav-link-group.component';
import { NavLink } from '@awg-shared/nav-link-group/nav-link.model';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

/**
 * Constants: EDITION_INTRO, EDITION_SHEETS, EDITION_REPORT, EDITION_GRAPH.
 *
 * They keep the edition detail routes destructured from the {@link EDITION_ROUTE_CONSTANTS}.
 */
const { EDITION_INTRO, EDITION_SHEETS, EDITION_REPORT, EDITION_GRAPH } = EDITION_ROUTE_CONSTANTS;

/**
 * Constant: EDITION_DETAIL_ROUTES.
 *
 * It keeps the edition detail routes shown in the nav.
 */
const EDITION_DETAIL_ROUTES = [EDITION_INTRO, EDITION_SHEETS, EDITION_REPORT, EDITION_GRAPH];

/**
 * The EditionDetailNav component.
 *
 * It contains the overview section
 * of the edition view of the app
 * with a {@link NavLinkGroupComponent} and
 * another router outlet for the edition routes.
 */
@Component({
    selector: 'awg-edition-detail-nav',
    templateUrl: './edition-detail-nav.component.html',
    styleUrls: ['./edition-detail-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NavLinkGroupComponent, RouterOutlet],
})
export class EditionDetailNavComponent {
    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = inject(EditionStateService).selectedEditionComplex;

    /**
     * Readonly computed signal: editionDetailNavLinks.
     *
     * It holds the nav links based on the selected edition complex.
     */
    readonly editionDetailNavLinks = computed<NavLink[] | null>(() => {
        const complex = this.selectedEditionComplex();

        if (!complex) {
            return null;
        }

        return EDITION_DETAIL_ROUTES.map(({ route, short }) => new NavLink(complex.baseRoute, route, short, false));
    });
}
