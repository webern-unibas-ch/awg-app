import { Component, inject, OnInit } from '@angular/core';

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
export class EditionInfoComponent implements OnInit {
    /**
     * Public variable: editionInfoHeader.
     *
     * It keeps the header for the edition-info.
     */
    editionInfoHeader = 'Edition';

    /**
     * Public variable: selectedEditionSection$.
     *
     * It keeps the selected section of the edition as an Observable of EditionOutlineSection.
     */
    selectedEditionSection: EditionOutlineSection;

    /**
     * Readonly variable: DISPLAYED_SECTIONS.
     *
     * It keeps the array of displayed sections.
     */
    readonly DISPLAYED_SECTIONS = [
        EditionOutlineService.getEditionSectionById('1', '5'),
        EditionOutlineService.getEditionSectionById('2', '2a'),
    ];

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.setupEditionView();
    }

    /**
     * Public method: setupEditionView.
     *
     * It sets up the edition view by loading
     * the selected series, section, and edition complex
     * from the EditionStateService.
     *
     * @returns {void} Sets up the edition view.
     */
    setupEditionView(): void {
        this._editionStateService.getSelectedEditionSection().subscribe(section => {
            this.selectedEditionSection = section;
        });
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
