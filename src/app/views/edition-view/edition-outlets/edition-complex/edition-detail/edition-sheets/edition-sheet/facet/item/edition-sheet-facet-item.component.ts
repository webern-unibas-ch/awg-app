import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { EditionDisclaimerWorkeditionsComponent } from '@awg-views/edition-view/edition-disclaimer-workeditions/edition-disclaimer-workeditions.component';
import { EditionSvgSheet } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EditionTypeLabel } from '@awg-views/edition-view/models/edition-type.model';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The EditionSheetFacetItem component.
 *
 * It contains an item of the sheet facet section
 * of the edition view of the app
 * and lets the user select an SVG sheet of a specific edition type.
 */
@Component({
    selector: 'awg-edition-sheet-facet-item',
    templateUrl: './edition-sheet-facet-item.component.html',
    styleUrls: ['./edition-sheet-facet-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionDisclaimerWorkeditionsComponent, NgbDropdownModule],
})
export class EditionSheetFacetItemComponent {
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
    readonly facetItemLabel = input.required<EditionTypeLabel>();

    /**
     * Readonly input signal: svgSheets.
     *
     * It holds the svg sheets of the facet item.
     */
    readonly svgSheets = input.required<EditionSvgSheet[]>();

    /**
     * Readonly input signal: selectedSvgSheet.
     *
     * It holds the selected svg sheet.
     */
    readonly selectedSvgSheet = input.required<EditionSvgSheet | undefined>();

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
        const selectedSvgSheet = this.selectedSvgSheet();

        let givenId = id;
        let selectedId = selectedSvgSheet?.id;

        // Compare partial id if needed
        if (partial && selectedSvgSheet?.content?.[0]?.partial) {
            givenId += partial;
            selectedId += selectedSvgSheet.content[0].partial;
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
