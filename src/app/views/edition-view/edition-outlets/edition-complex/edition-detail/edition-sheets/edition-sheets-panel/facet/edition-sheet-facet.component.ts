import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { EditionSvgSheetId, EditionSvgSheetsList } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EDITION_TYPE_KEYS } from '@awg-views/edition-view/models/edition-type.model';

import { EditionSheetFacetGroupComponent } from './group/edition-sheet-facet-group.component';
import { EditionSheetFacetToggleComponent } from './toggle/edition-sheet-facet-toggle.component';

/**
 * The EditionSheetFacet component.
 *
 * It contains the sheet facet section
 * of the edition view of the app
 * and lets the user select an SVG sheet.
 */
@Component({
    selector: 'awg-edition-sheet-facet',
    templateUrl: './edition-sheet-facet.component.html',
    styleUrls: ['./edition-sheet-facet.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionSheetFacetGroupComponent, EditionSheetFacetToggleComponent],
})
export class EditionSheetFacetComponent {
    /**
     * Readonly input signal: svgSheetsData.
     *
     * It holds the svg sheets data.
     */
    readonly svgSheetsData = input.required<EditionSvgSheetsList | null>();

    /**
     * Readonly input signal: selectedSheetId.
     *
     * It holds the id and the full id (incl. partial) of the selected svg sheet.
     */
    readonly selectedSheetId = input.required<EditionSvgSheetId>();

    /**
     * Readonly model signal: isMinimized.
     *
     * It holds the toggle state of the sheet facet.
     * @default false
     */
    readonly isMinimized = model<boolean>(false);

    /**
     * Readonly variable: EDITION_TYPE_KEYS.
     *
     * It keeps the available keys for the edition types.
     */
    readonly EDITION_TYPE_KEYS = EDITION_TYPE_KEYS;
}
