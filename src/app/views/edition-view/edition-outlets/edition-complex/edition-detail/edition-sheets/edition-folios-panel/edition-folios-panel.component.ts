import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { EditionSvgSheetIds } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { Folio, FolioConvolute } from '@awg-views/edition-view/models/folio.model';

import { EditionFoliosLegendComponent } from './legend/edition-folios-legend.component';
import { EditionFoliosViewerComponent } from './viewer/edition-folios-viewer.component';

/**
 * The EditionFoliosPanel component.
 *
 * It contains the folios panel (convolute overview)
 * of the edition view of the app
 * with the {@link EditionFoliosViewerComponent}
 * and the {@link EditionFoliosLegendComponent}.
 */
@Component({
    selector: 'awg-edition-folios-panel',
    templateUrl: './edition-folios-panel.component.html',
    styleUrls: ['./edition-folios-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionFoliosLegendComponent, EditionFoliosViewerComponent, NgbAccordionModule, RouterLink],
})
export class EditionFoliosPanelComponent {
    /**
     * Readonly input signal: selectedConvolute.
     *
     * It holds the selected convolute.
     */
    readonly selectedConvolute = input.required<FolioConvolute>();

    /**
     * Readonly input signal: selectedSheetIds.
     *
     * It holds the id and the full id (incl. partial) of the selected svg sheet.
     */
    readonly selectedSheetIds = input.required<EditionSvgSheetIds>();

    /**
     * Readonly computed signal: folios.
     *
     * It holds the folios of the selected convolute.
     */
    readonly folios = computed<Folio[]>(() => this.selectedConvolute().folios ?? []);

    /**
     * Readonly computed signal: reportFragment.
     *
     * It holds the fragment of the source description
     * of the selected convolute in the critical report.
     */
    readonly reportFragment = computed<string>(() => `source_${this.selectedConvolute().convoluteId}`);
}
