import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

import { EditionDisclaimerWorkeditionsComponent } from '@awg-views/edition-view/edition-disclaimer-workeditions/edition-disclaimer-workeditions.component';
import { EditionSvgSheet, EditionSvgSheetId } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EDITION_TYPE_LABEL_MAP, EditionTypeKey } from '@awg-views/edition-view/models/edition-type.model';

import { EditionSheetFacetItemComponent } from '../item/edition-sheet-facet-item.component';
import { EditionSheetFacetScrollDirective } from '../scroll/edition-sheet-facet-scroll.directive';

/**
 * The EditionSheetFacetGroup component.
 *
 * It contains a (collapsible) group of the sheet facet section
 * of the edition view of the app
 * and displays the svg sheets of a specific edition type.
 */
@Component({
    selector: 'awg-edition-sheet-facet-group',
    templateUrl: './edition-sheet-facet-group.component.html',
    styleUrls: ['./edition-sheet-facet-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionDisclaimerWorkeditionsComponent, EditionSheetFacetItemComponent, EditionSheetFacetScrollDirective],
})
export class EditionSheetFacetGroupComponent {
    /**
     * Readonly input signal: editionTypeKey.
     *
     * It holds the key of the edition type of the facet group.
     */
    readonly editionTypeKey = input.required<EditionTypeKey>();

    /**
     * Readonly input signal: svgSheets.
     *
     * It holds the svg sheets of the facet group.
     */
    readonly svgSheets = input.required<EditionSvgSheet[]>();

    /**
     * Readonly input signal: selectedSheetId.
     *
     * It holds the id and the (optional) partial of the selected svg sheet.
     */
    readonly selectedSheetId = input.required<EditionSvgSheetId>();

    /**
     * Readonly computed signal: facetGroupLabel.
     *
     * It computes the label of the facet group from its edition type key.
     */
    readonly facetGroupLabel = computed(() => EDITION_TYPE_LABEL_MAP[this.editionTypeKey()]);

    /**
     * Readonly computed signal: hasSelectedSheet.
     *
     * It computes if the selected svg sheet belongs to the facet group.
     */
    readonly hasSelectedSheet = computed(() => {
        const selectedId = this.selectedSheetId().id;

        return this.svgSheets().some(svgSheet => svgSheet.id === selectedId);
    });

    /**
     * Readonly linked signal: isOpen.
     *
     * It holds the open state of the facet group.
     * It is reset to {@link hasSelectedSheet} whenever the selection
     * moves into or out of the facet group, but can be toggled manually.
     */
    readonly isOpen = linkedSignal(() => this.hasSelectedSheet());
}
