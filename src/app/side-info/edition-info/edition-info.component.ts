import { Component, inject, signal } from '@angular/core';

import { ACTIVE_EDITION_SECTION_IDS } from '@awg-views/edition-view/data/active-edition-sections.data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineComplexItem, EditionOutlineSection } from '@awg-views/edition-view/models';
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
    standalone: false,
})
export class EditionInfoComponent {
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
        ACTIVE_EDITION_SECTION_IDS.map(ids => EditionOutlineService.getEditionSectionById(ids.seriesId, ids.sectionId))
    ).asReadonly();

    /**
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }

    /**
     * Public method: combineComplexes.
     *
     * It combines the opus and mnr complexes of a section.
     *
     * @param section {EditionOutlineSection} The edition outline section.
     *
     * @returns {EditionOutlineComplexItem[]} The combined complexes.
     */
    combineComplexes(section: EditionOutlineSection): EditionOutlineComplexItem[] {
        const opusComplexes = section?.content?.complexTypes?.opus || [];
        const mnrComplexes = section?.content?.complexTypes?.mnr || [];
        return [...opusComplexes, ...mnrComplexes];
    }
}
