import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';
import type { Options } from '@popperjs/core';

import { SheetNavigationTarget } from '@awg-views/edition-view/models/edition-navigation.model';
import { EditionSvgSheet, EditionSvgSheetIds } from '@awg-views/edition-view/models/edition-svg-sheets.model';

import { EDITION_SHEETS_UTILS } from '../../../edition-sheets.utils';
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
     * Readonly input signal: selectedSheetIds.
     *
     * It holds the id and the full id (incl. partial) of the selected svg sheet.
     */
    readonly selectedSheetIds = input.required<EditionSvgSheetIds>();

    /**
     * Readonly variable: dropdownPopperOptions.
     *
     * It positions the partials dropdown menu with a `fixed` strategy,
     * so that it is neither clipped by the scrollable facet group list
     * nor moved out of the (fullscreen) accordion like with `container="body"`.
     *
     * @param {Partial<Options>} options The default popper options.
     * @returns {Partial<Options>} The popper options with a fixed positioning strategy.
     */
    readonly dropdownPopperOptions = (options: Partial<Options>): Partial<Options> => ({
        ...options,
        strategy: 'fixed',
    });

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
    readonly isActive = computed(() => this.svgSheet().id === this.selectedSheetIds().id);

    /**
     * Readonly computed signal: partialLinks.
     *
     * It computes the partial links (if present) of the svg sheet for the dropdown.
     */
    readonly partialLinks = computed<EditionSheetFacetPartialLink[]>(() => {
        const svgSheet = this.svgSheet();

        if (svgSheet.content.length <= 1) {
            return [];
        }

        const selectedFullId = this.selectedSheetIds().fullId;

        return svgSheet.content.map((content, index) => {
            const indexLabel = `${index + 1}/${svgSheet.content.length}`;
            const sheetId = EDITION_SHEETS_UTILS.toFullSheetId(svgSheet.id, content.partial);

            return {
                sheetTarget: { complexId: '', sheetId },
                positionLabel: content.partial ? `${content.partial} · ${indexLabel}` : indexLabel,
                isActive: sheetId === selectedFullId,
            };
        });
    });

    /**
     * Readonly computed signal: sheetTarget.
     *
     * It computes the navigation target of the svg sheet of the facet item.
     */
    readonly sheetTarget = computed<SheetNavigationTarget>(() => ({ complexId: '', sheetId: this.svgSheet().id }));
}
