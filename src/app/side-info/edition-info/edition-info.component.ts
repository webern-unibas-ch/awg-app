import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS, EDITION_TYPE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';

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
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }

    /**
     * Getter variable: editionTypeConstants.
     *
     *  It returns the EDITION_TYPE_CONSTANTS.
     **/
    get editionTypeConstants(): typeof EDITION_TYPE_CONSTANTS {
        return EDITION_TYPE_CONSTANTS;
    }
}
