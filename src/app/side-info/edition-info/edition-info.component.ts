import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EDITION_ROUTE_CONSTANTS, EDITION_TYPE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService } from '@awg-views/edition-view/services';

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
        EditionComplexesService.getEditionComplexById('OP3'),
        EditionComplexesService.getEditionComplexById('OP4'),
        EditionComplexesService.getEditionComplexById('OP12'),
        EditionComplexesService.getEditionComplexById('OP23'),
        EditionComplexesService.getEditionComplexById('OP25'),
        EditionComplexesService.getEditionComplexById('M22'),
        EditionComplexesService.getEditionComplexById('M30'),
        EditionComplexesService.getEditionComplexById('M31'),
        EditionComplexesService.getEditionComplexById('M34'),
        EditionComplexesService.getEditionComplexById('M35_42'),
        EditionComplexesService.getEditionComplexById('M37'),
    ];

    /**
     * Readonly variable: SLICE_INDEX.
     *
     * It keeps the index for the slice of edition complexes.
     */
    readonly SLICE_INDEX = 5;

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
