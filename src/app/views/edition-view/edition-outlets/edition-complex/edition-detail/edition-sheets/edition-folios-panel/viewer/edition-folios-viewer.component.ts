import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { EditionSvgSheetIds } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { Folio } from '@awg-views/edition-view/models/folio.model';

import { EditionFoliosViewerSvgComponent } from './svg/edition-folios-viewer-svg.component';

/**
 * Constant: FOLIOS_PER_ROW_OPTIONS.
 *
 * It keeps the possible numbers of folios per row on large screens
 * (divisors of the 12 bootstrap grid columns, so that each yields a valid `col-lg-*` class).
 */
const FOLIOS_PER_ROW_OPTIONS = [1, 2, 3, 4, 6];

/**
 * Constant: FOLIOS_PER_ROW_MAX_WRAPPED.
 *
 * It keeps the number of folios per row on large screens
 * if there are more folios than the largest option (the folios wrap into several rows).
 */
const FOLIOS_PER_ROW_MAX_WRAPPED = 4;

/**
 * The EditionFoliosViewer component.
 *
 * It contains the viewer of the folios panel
 * of the edition view of the app
 * and displays the given folios in a grid
 * with the {@link EditionFoliosViewerSvgComponent}.
 */
@Component({
    selector: 'awg-edition-folios-viewer',
    templateUrl: './edition-folios-viewer.component.html',
    styleUrls: ['./edition-folios-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionFoliosViewerSvgComponent],
})
export class EditionFoliosViewerComponent {
    /**
     * Readonly input signal: folios.
     *
     * It holds the folios to be displayed.
     */
    readonly folios = input.required<Folio[]>();

    /**
     * Readonly input signal: selectedSheetIds.
     *
     * It holds the id and the full id (incl. partial) of the selected svg sheet.
     */
    readonly selectedSheetIds = input.required<EditionSvgSheetIds>();

    /**
     * Readonly computed signal: colSize.
     *
     * It holds the bootstrap column span of each folio on large screens:
     * all folios in one row if their number fits a divisor of 12 (1, 2, 3, 4 or 6 folios),
     * otherwise rows of 4 folios.
     */
    readonly colSize = computed<number>(() => {
        const numberOfFolios = this.folios().length;
        const foliosPerRow =
            FOLIOS_PER_ROW_OPTIONS.find(option => option >= numberOfFolios) ?? FOLIOS_PER_ROW_MAX_WRAPPED;

        return 12 / foliosPerRow;
    });
}
