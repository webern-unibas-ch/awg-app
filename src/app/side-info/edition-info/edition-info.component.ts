import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionRouteConstant } from '@awg-views/edition-view/models';

/**
 * The EditionInfo component.
 *
 * It contains the side-info section of the edition view.
 */
@Component({
    selector: 'awg-edition-info',
    templateUrl: './edition-info.component.html',
    styleUrls: ['./edition-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionInfoComponent {
    /**
     * Readonly variable: EDITION_ROW_TABLES.
     *
     * It keeps the row tables route.
     */
    readonly EDITION_ROW_TABLES = EDITION_ROUTE_CONSTANTS.ROWTABLES;

    /**
     * Readonly variable: EDITION_COMPLEX_M34.
     *
     * It keeps the edition complex M 34.
     */
    readonly EDITION_COMPLEX_M34 = EDITION_COMPLEXES.M34;

    /**
     * Readonly variable: EDITION_COMPLEX_OP12.
     *
     * It keeps the edition complex op. 12.
     */
    readonly EDITION_COMPLEX_OP12 = EDITION_COMPLEXES.OP12;

    /**
     * Readonly variable: EDITION_COMPLEX_OP25.
     *
     * It keeps the edition complex op. 25.
     */
    readonly EDITION_COMPLEX_OP25 = EDITION_COMPLEXES.OP25;

    /**
     * Readonly variable: EDITION_ROUTE.
     *
     * It keeps the edition route.
     */
    readonly EDITION_ROUTE: EditionRouteConstant = EDITION_ROUTE_CONSTANTS.EDITION;
}
