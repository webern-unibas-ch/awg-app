import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { EditionSvgSheet, EditionSvgSheetId } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionSheetFacetPartialLink } from '../edition-sheet-facet.model';

import { EditionSheetFacetItemLinkDirective } from './edition-sheet-facet-item-link.directive';

/**
 * The EditionSheetFacetItem component.
 *
 * It contains a single svg sheet of a sheet facet group
 * of the edition view of the app
 * and lets the user select it (or one of its partials).
 */
@Component({
    selector: 'awg-edition-sheet-facet-item',
    templateUrl: './edition-sheet-facet-item.component.html',
    styleUrls: ['./edition-sheet-facet-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionSheetFacetItemLinkDirective, NgbDropdownModule],
})
export class EditionSheetFacetItemComponent {
    /**
     * Readonly input signal: svgSheet.
     *
     * It holds the svg sheet of the facet item.
     */
    readonly svgSheet = input.required<EditionSvgSheet>();

    /**
     * Readonly input signal: selectedSheetId.
     *
     * It holds the id and the (optional) partial of the selected svg sheet.
     */
    readonly selectedSheetId = input.required<EditionSvgSheetId>();

    /**
     * Readonly computed signal: dropdownId.
     *
     * It computes the unique id of the dropdown toggle for svg sheets with partials.
     */
    readonly dropdownId = computed(() => `awg-edition-sheet-facet-item-dropdown-${this.svgSheet().id}`);

    /**
     * Readonly computed signal: isActive.
     *
     * It computes if the svg sheet of the facet item is selected
     * (regardless of a selected partial).
     */
    readonly isActive = computed(() => this.svgSheet().id === this.selectedSheetId().id);

    /**
     * Readonly computed signal: partialLinks.
     *
     * It computes the partial links of the svg sheet for the dropdown.
     * A partial is active if the svg sheet is selected
     * and the partials match (they are only compared if both sides have one).
     */
    readonly partialLinks = computed<EditionSheetFacetPartialLink[]>(() => {
        const svgSheet = this.svgSheet();
        const isActive = this.isActive();
        const selectedPartial = this.selectedSheetId().partial;

        return svgSheet.content.map((content, index) => {
            const indexLabel = `${index + 1}/${svgSheet.content.length}`;

            return {
                sheetIds: { complexId: '', sheetId: svgSheet.id + (content.partial ?? '') },
                positionLabel: content.partial ? `${content.partial} · ${indexLabel}` : indexLabel,
                isActive: isActive && (!content.partial || !selectedPartial || content.partial === selectedPartial),
            };
        });
    });

    /**
     * Readonly computed signal: sheetIds.
     *
     * It computes the sheet ids to navigate to the svg sheet of the facet item.
     */
    readonly sheetIds = computed<SheetClickEvent>(() => ({ complexId: '', sheetId: this.svgSheet().id }));
}
