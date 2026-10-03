import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EditionDisclaimerWorkeditionsComponent } from '@awg-views/edition-view/edition-disclaimer-workeditions/edition-disclaimer-workeditions.component';
import { EditionSvgSheet, EditionSvgSheetId } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EditionTypeLabel } from '@awg-views/edition-view/models/edition-type.model';

import { EditionSheetFacetItemComponent } from '../item/edition-sheet-facet-item.component';

/**
 * The EditionSheetFacetGroup component.
 *
 * It contains a group of the sheet facet section
 * of the edition view of the app
 * and displays the svg sheets of a specific edition type.
 */
@Component({
    selector: 'awg-edition-sheet-facet-group',
    templateUrl: './edition-sheet-facet-group.component.html',
    styleUrls: ['./edition-sheet-facet-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionDisclaimerWorkeditionsComponent, EditionSheetFacetItemComponent],
})
export class EditionSheetFacetGroupComponent {
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
     * Readonly input signal: selectedSheetId.
     *
     * It holds the id and the (optional) partial of the selected svg sheet.
     */
    readonly selectedSheetId = input.required<EditionSvgSheetId>();
}
