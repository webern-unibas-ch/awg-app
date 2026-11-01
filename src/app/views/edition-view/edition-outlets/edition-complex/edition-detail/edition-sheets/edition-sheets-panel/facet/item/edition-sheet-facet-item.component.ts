import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, UrlTree } from '@angular/router';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { POPPER_UTILS } from '@awg-shared/utils/popper-utils';

import { EditionSvgSheet, EditionSvgSheetSelection } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';
import { EDITION_SHEETS_UTILS } from '@awg-views/edition-view/utils/edition-sheets.utils';

import { EditionSheetFacetPartialLink } from '../edition-sheet-facet.model';

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
    styleUrl: './edition-sheet-facet-item.component.scss',
    imports: [NgbDropdownModule, RouterLink],
})
export class EditionSheetFacetItemComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Readonly input signal: svgSheet.
     *
     * It holds the svg sheet of the facet item.
     */
    readonly svgSheet = input.required<EditionSvgSheet>();

    /**
     * Readonly input signal: selectedSvgSheet.
     *
     * It holds the selected svg sheet (id, full id and selected content).
     */
    readonly selectedSvgSheet = input.required<EditionSvgSheetSelection | undefined>();

    /**
     * Readonly variable: dropdownPopperOptions.
     *
     * It keeps the popper options of the partials dropdown menu (fixed, height-limited to the viewport).
     */
    readonly dropdownPopperOptions = POPPER_UTILS.fixedDropdownPopperOptions;

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
    readonly isActive = computed(() => this.svgSheet().id === this.selectedSvgSheet()?.id);

    /**
     * Private readonly computed signal: _partialLinks.
     *
     * It computes the partial links (if present) of the svg sheet without their active state,
     * so that their routes are only rebuilt when the svg sheet changes.
     */
    private readonly _partialLinks = computed<Omit<EditionSheetFacetPartialLink, 'isActive'>[]>(() => {
        const svgSheet = this.svgSheet();

        if (svgSheet.content.length <= 1) {
            return [];
        }

        return svgSheet.content.map((content, index) => {
            const sheetId = EDITION_SHEETS_UTILS.toFullSheetId(svgSheet.id, content.partial);
            const sheetRoute = this._navigationService.getSvgSheetRoute({ complexId: '', sheetId });

            const indexLabel = `${index + 1}/${svgSheet.content.length}`;
            const positionLabel = content.partial ? `${content.partial} · ${indexLabel}` : indexLabel;

            return { sheetId, sheetRoute, positionLabel };
        });
    });

    /**
     * Readonly computed signal: sheetPartials.
     *
     * It computes the partial links (if present) of the svg sheet for the dropdown,
     * with the link of the selected partial marked as active.
     */
    readonly sheetPartials = computed<EditionSheetFacetPartialLink[]>(() => {
        const selectedFullId = this.selectedSvgSheet()?.fullId;

        return this._partialLinks().map(partialLink => {
            const isPartialActive = partialLink.sheetId === selectedFullId;

            return { ...partialLink, isActive: isPartialActive };
        });
    });

    /**
     * Readonly computed signal: sheetRoute.
     *
     * It computes the route to the svg sheet of the facet item.
     */
    readonly sheetRoute = computed<UrlTree>(() =>
        this._navigationService.getSvgSheetRoute({ complexId: '', sheetId: this.svgSheet().id })
    );
}
