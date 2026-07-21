import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ACTIVE_EDITION_SECTION_IDS } from '@awg-views/edition-view/data/active-edition-sections.data';
import { EDITION_GENERAL_LINKS } from '@awg-views/edition-view/edition-links.constants';
import { EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionInfo component.
 *
 * It contains the side-info section of the edition view.
 */
@Component({
    selector: 'awg-edition-info',
    templateUrl: './edition-info.component.html',
    styleUrls: ['./edition-info.component.scss'],
    imports: [NgbAccordionModule, RouterLink],
})
export class EditionInfoComponent {
    /**
     * Private readonly injection variable: _editionOutlineService.
     *
     * It keeps the instance of the injected EditionOutlineService.
     */
    private readonly _editionOutlineService = inject(EditionOutlineService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Public variable: EDITION_INFO_HEADER.
     *
     * It keeps the header for the edition-info.
     */
    readonly EDITION_INFO_HEADER = 'Edition';

    /**
     * Readonly variable: generalEditionLinks.
     *
     * It keeps the general edition links for the navbar.
     */
    readonly generalEditionLinks = EDITION_GENERAL_LINKS;

    /**
     * Readonly signal: selectedEditionSection.
     *
     * It holds the state of the selected edition section.
     */
    readonly selectedEditionSection = this._editionStateService.selectedEditionSection;

    /**
     * Readonly signal: sectionsData.
     *
     * It holds the array of displayed edition sections based on active IDs.
     */
    readonly sectionsData = signal(
        ACTIVE_EDITION_SECTION_IDS.map(ids =>
            this._editionOutlineService.getEditionSectionById(ids.seriesId, ids.sectionId)
        )
    ).asReadonly();
}
