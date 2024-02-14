import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS, EDITION_TYPE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';

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
     * Public variable: editionInfoHeader.
     *
     * It keeps the header for the edition-info.
     */
    editionInfoHeader = 'Edition';

    /**
     * Readonly variable: DISPLAYED_EDITION_COMPLEXES.
     *
     * It keeps the array of displayed edition complexes.
     */
    readonly DISPLAYED_EDITION_COMPLEXES: EditionComplex[] = [
        EDITION_COMPLEXES.OP12,
        EDITION_COMPLEXES.OP25,
        EDITION_COMPLEXES.M30,
        EDITION_COMPLEXES.M31,
        EDITION_COMPLEXES.M34,
        EDITION_COMPLEXES.M35_42,
        EDITION_COMPLEXES.M37,
    ];

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
