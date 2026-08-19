import { ChangeDetectionStrategy, Component, inject, input, Input } from '@angular/core';

import { UTILS } from '@awg-shared/utils/object-utils';

import { EditionSvgSheet } from '@awg-app/views/edition-view/models/edition-svg-sheets.model';
import { EditionTypeLabel } from '@awg-views/edition-view/models/edition-type.model';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The EditionSvgSheetFacetItem component.
 *
 * It contains an item of the svg sheet facet section
 * of the edition view of the app
 * and lets the user select an SVG sheet of a specific edition type.
 */
@Component({
    selector: 'awg-edition-svg-sheet-facet-item',
    templateUrl: './edition-svg-sheet-facet-item.component.html',
    styleUrls: ['./edition-svg-sheet-facet-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionSvgSheetFacetItemComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Readonly input signal: facetItemLabel.
     *
     * It holds the label of the facet item.
     */
    facetItemLabel = input.required<EditionTypeLabel>();

    /**
     * Input variable: svgSheets.
     *
     * It keeps the svg sheets.
     */
    @Input()
    svgSheets: EditionSvgSheet[] = [];

    /**
     * Input variable: selectedSvgSheet.
     *
     * It keeps the selected svg sheet.
     */
    @Input()
    selectedSvgSheet: EditionSvgSheet | undefined;

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Public method: isSelectedSvgSheet.
     *
     * It compares a given id (optionally with a partial) with the id
     * of the latest selected svg sheet.
     *
     * @param {string} id The given sheet id.
     * @param {string} [partial] The optional given partial id.
     *
     * @returns {boolean} The boolean value of the comparison result.
     */
    isSelectedSvgSheet(id: string, partial?: string): boolean {
        let givenId = id;
        let selectedId = this.selectedSvgSheet?.id;

        // Compare partial id if needed
        if (partial && this.selectedSvgSheet?.content?.[0]?.partial) {
            givenId += partial;
            selectedId += this.selectedSvgSheet.content[0].partial;
        }

        return givenId === selectedId;
    }

    /**
     * Public method: selectSvgSheet.
     *
     * It delegates the navigation for the given complex and SVG sheet IDs
     * directly to the {@link EditionNavigationService}.
     *
     * @param {SheetClickEvent} sheetIds The given sheet ids as SheetClickEvent.
     * @returns {void} Navigates to the selected SVG sheet.
     */
    selectSvgSheet(sheetIds: SheetClickEvent): void {
        if (!sheetIds.sheetId) {
            return;
        }
        this._navigationService.navigateToSvgSheet(sheetIds);
    }
}
