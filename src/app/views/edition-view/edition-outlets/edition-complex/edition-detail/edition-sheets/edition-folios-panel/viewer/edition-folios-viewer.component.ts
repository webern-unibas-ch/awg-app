import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { EditionSvgSheet, EditionSvgSheetId } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { Folio, FolioConvolute } from '@awg-views/edition-view/models/folio.model';

import { EditionFoliosViewerSvgComponent } from './svg/edition-folios-viewer-svg.component';

/**
 * The EditionFoliosViewer component.
 *
 * It contains the viewer of the folios panel
 * of the edition view of the app
 * and displays all folios of the selected convolute
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
     * Readonly input signal: selectedConvolute.
     *
     * It holds the selected convolute.
     */
    readonly selectedConvolute = input.required<FolioConvolute>();

    /**
     * Readonly input signal: selectedSvgSheet.
     *
     * It holds the selected svg sheet.
     */
    readonly selectedSvgSheet = input.required<EditionSvgSheet>();

    /**
     * Readonly computed signal: folios.
     *
     * It holds the folios of the selected convolute.
     */
    readonly folios = computed<Folio[]>(() => this.selectedConvolute().folios ?? []);

    /**
     * Readonly computed signal: selectedSheetId.
     *
     * It holds the id and the (optional) partial of the selected svg sheet.
     * The content of a selected svg sheet with partials is reduced
     * to the selected partial by the EditionSheetsService.
     */
    readonly selectedSheetId = computed<EditionSvgSheetId>(() => {
        const selectedSvgSheet = this.selectedSvgSheet();

        return { id: selectedSvgSheet.id, partial: selectedSvgSheet.content?.[0]?.partial };
    });
}
