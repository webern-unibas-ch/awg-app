import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EditionConstants, EditionWorks } from '@awg-views/edition-view/models';

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
     * Readonly constant: EDITION_ROW_TABLES.
     *
     * It keeps the row tables route.
     */
    readonly EDITION_ROW_TABLES = EditionConstants.ROWTABLES;

    /**
     * Readonly constant: EDITION_COMPLEX_OP12.
     *
     * It keeps the edition complex for op. 12.
     */
    readonly EDITION_COMPLEX_OP12 = EditionWorks.OP12;

    /**
     * Readonly constant: EDITION_COMPLEX_OP25.
     *
     * It keeps the edition complex for op. 25.
     */
    readonly EDITION_COMPLEX_OP25 = EditionWorks.OP25;
}
