import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { faAnglesLeft, faListUl } from '@fortawesome/free-solid-svg-icons';

import { EditionSvgSheet, EditionSvgSheetsList } from '@awg-views/edition-view/models';

/**
 * The EditionSvgSheetFacet component.
 *
 * It contains the svg sheet facet section
 * of the edition view of the app
 * and lets the user select an SVG sheet.
 */
@Component({
    selector: 'awg-edition-svg-sheet-facet',
    templateUrl: './edition-svg-sheet-facet.component.html',
    styleUrls: ['./edition-svg-sheet-facet.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionSvgSheetFacetComponent {
    /**
     * Public variable: isMinimized.
     *
     * It keeps the toggle state of the sheet facet.
     */
    @Input()
    isMinimized = false;

    /**
     * Input variable: svgSheetsData.
     *
     * It keeps the svg sheets data.
     */
    @Input()
    svgSheetsData: EditionSvgSheetsList;

    /**
     * Input variable: selectedSvgSheet.
     *
     * It keeps the selected svg sheet.
     */
    @Input()
    selectedSvgSheet: EditionSvgSheet;

    /**
     * Output variable: toggleSheetFacetRequest.
     *
     * It keeps an event emitter for the toggle state of the sheet facet.
     */
    @Output()
    toggleSheetFacetRequest: EventEmitter<boolean> = new EventEmitter();

    /**
     * Public variable: faAnglesLeft.
     *
     * It instantiates fontawesome's faAnglesLeft icon.
     */
    faAnglesLeft = faAnglesLeft;

    /**
     * Public variable: faListUl.
     *
     * It instantiates fontawesome's faListUl icon.
     */
    faListUl = faListUl;

    /**
     * Public method: toggleSheetFacet.
     *
     * It emits the next toggle state (the negation of {@link isMinimized})
     * to the {@link toggleSheetFacetRequest} to toggle the sheet facet.
     *
     * @returns {void} Emits the updated toggle state.
     */
    toggleSheetFacet(): void {
        this.toggleSheetFacetRequest.emit(!this.isMinimized);
    }
}
