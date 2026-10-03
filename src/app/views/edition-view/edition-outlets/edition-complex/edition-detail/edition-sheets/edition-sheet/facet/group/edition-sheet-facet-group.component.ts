import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { EditionDisclaimerWorkeditionsComponent } from '@awg-views/edition-view/edition-disclaimer-workeditions/edition-disclaimer-workeditions.component';
import { EditionSvgSheet } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EditionTypeLabel } from '@awg-views/edition-view/models/edition-type.model';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The EditionSheetFacetGroup component.
 *
 * It contains a group of the sheet facet section
 * of the edition view of the app
 * and lets the user select an SVG sheet of a specific edition type.
 */
@Component({
    selector: 'awg-edition-sheet-facet-group',
    templateUrl: './edition-sheet-facet-group.component.html',
    styleUrls: ['./edition-sheet-facet-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionDisclaimerWorkeditionsComponent, NgbDropdownModule],
})
export class EditionSheetFacetGroupComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Readonly input signal: facetGroupLabel.
     *
     * It holds the label of the facet group.
     */
    readonly facetGroupLabel = input.required<EditionTypeLabel>();

    /**
     * Readonly input signal: svgSheets.
     *
     * It holds the svg sheets of the facet group.
     */
    readonly svgSheets = input.required<EditionSvgSheet[]>();

    /**
     * Readonly input signal: selectedSvgSheet.
     *
     * It holds the selected svg sheet.
     */
    readonly selectedSvgSheet = input.required<EditionSvgSheet | undefined>();

    /**
     * Readonly computed signal: selectedSheetIds.
     *
     * It computes the id and the (optional) partial of the selected svg sheet.
     * The content of a selected svg sheet with partials is reduced
     * to the selected partial by the EditionSheetsService.
     */
    readonly selectedSheetIds = computed(() => {
        const selectedSvgSheet = this.selectedSvgSheet();

        return { id: selectedSvgSheet?.id, partial: selectedSvgSheet?.content?.[0]?.partial };
    });

    /**
     * Public method: isSelectedSvgSheet.
     *
     * It compares a given id (optionally with a partial)
     * with the id (and partial) of the selected svg sheet.
     * The partials are only compared if both sides have one.
     *
     * @param {string} id The given sheet id.
     * @param {string} [partial] The optional given partial id.
     *
     * @returns {boolean} The boolean value of the comparison result.
     */
    isSelectedSvgSheet(id: string, partial?: string): boolean {
        const selected = this.selectedSheetIds();

        if (id !== selected.id) {
            return false;
        }

        return !partial || !selected.partial || partial === selected.partial;
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
