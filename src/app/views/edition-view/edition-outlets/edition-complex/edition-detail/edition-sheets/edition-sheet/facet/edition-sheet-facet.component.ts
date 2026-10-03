import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAnglesLeft, faListUl } from '@fortawesome/free-solid-svg-icons';

import { EditionSvgSheet, EditionSvgSheetsList } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EDITION_TYPE_KEYS, EDITION_TYPE_LABEL_MAP } from '@awg-views/edition-view/models/edition-type.model';

import { EditionSheetFacetItemComponent } from './item/edition-sheet-facet-item.component';

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
    imports: [EditionSheetFacetItemComponent, FaIconComponent],
})
export class EditionSheetFacetComponent {
    /**
     * Readonly input signal: isMinimized.
     *
     * It holds the toggle state of the sheet facet.
     */
    readonly isMinimized = input<boolean>(false);

    /**
     * Readonly input signal: svgSheetsData.
     *
     * It holds the svg sheets data.
     */
    readonly svgSheetsData = input.required<EditionSvgSheetsList | null>();

    /**
     * Readonly input signal: selectedSvgSheet.
     *
     * It holds the selected svg sheet.
     */
    readonly selectedSvgSheet = input.required<EditionSvgSheet | undefined>();

    /**
     * Readonly output signal: toggleSheetFacetRequest.
     *
     * It emits the requested toggle state of the sheet facet.
     */
    readonly toggleSheetFacetRequest = output<boolean>();

    /**
     * Readonly variable: EDITION_TYPE_LABEL_MAP.
     *
     * It keeps the map of the edition type keys and their corresponding labels.
     */
    readonly EDITION_TYPE_LABEL_MAP = EDITION_TYPE_LABEL_MAP;

    /**
     * Readonly variable: EDITION_TYPE_KEYS.
     *
     * It keeps the available keys for the edition types.
     */
    readonly EDITION_TYPE_KEYS = EDITION_TYPE_KEYS;

    /**
     * Readonly computed signal: toggleIcon.
     *
     * It computes the fontawesome icon of the toggle button
     * depending on the toggle state of the sheet facet.
     */
    readonly toggleIcon = computed(() => (this.isMinimized() ? faListUl : faAnglesLeft));

    /**
     * Readonly computed signal: toggleLabel.
     *
     * It computes the title and aria label of the toggle button
     * depending on the toggle state of the sheet facet.
     */
    readonly toggleLabel = computed(() => (this.isMinimized() ? 'Maximize' : 'Minimize'));

    /**
     * Public method: toggleSheetFacet.
     *
     * It emits the next toggle state (the negation of {@link isMinimized})
     * to the {@link toggleSheetFacetRequest} to toggle the sheet facet.
     *
     * @returns {void} Emits the requested toggle state.
     */
    toggleSheetFacet(): void {
        this.toggleSheetFacetRequest.emit(!this.isMinimized());
    }
}
