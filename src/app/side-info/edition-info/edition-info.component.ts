import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { EditionWorks } from '@awg-views/edition-view/models';

/**
 * The EditionInfo component.
 *
 * It contains the side-info section of the edition view.
 */
@Component({
    selector: 'awg-edition-info',
    templateUrl: './edition-info.component.html',
    styleUrls: ['./edition-info.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionInfoComponent implements OnInit {
    /**
     * Public variable: editionInfoViewTitle.
     *
     * It keeps the title for the heading
     * of the edition info view section.
     */
    editionInfoViewTitle = 'Beispieleditionen ausgewählter Skizzen';

    /**
     * Readonly constant: EDITION_WORK_OP12.
     *
     * It keeps the current composition.
     */
    readonly EDITION_WORK_OP12 = EditionWorks.OP12;

    /**
     * Readonly constant: EDITION_WORK_OP25.
     *
     * It keeps the current composition.
     */
    readonly EDITION_WORK_OP25 = EditionWorks.OP25;

    /**
     * Constructor of the EditionInfoComponent.
     */
    constructor() {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {}
}
