import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { FullscreenToggleComponent } from '@awg-shared/fullscreen/fullscreen-toggle.component';
import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';

import { EditionSvgOverlayTkk } from '@awg-views/edition-view/models/edition-svg-overlay.model';
import {
    EditionSvgSheetSelection,
    EditionSvgSheetsList,
} from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { Textcritics } from '@awg-views/edition-view/models/textcritics.model';
import { UsageHintsComponent } from '@awg-views/edition-view/shared/usage-hints/usage-hints.component';

import { EditionSheetFacetComponent } from './facet/edition-sheet-facet.component';
import { EditionSheetFooterComponent } from './footer/edition-sheet-footer.component';
import { EditionSheetViewerComponent } from './viewer/edition-sheet-viewer.component';

/**
 * The EditionSheetsPanel component.
 *
 * It contains the edition sheets panel (facet, viewer and footer)
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-sheets-panel',
    templateUrl: './edition-sheets-panel.component.html',
    styleUrls: ['./edition-sheets-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        EditionSheetFacetComponent,
        EditionSheetFooterComponent,
        EditionSheetViewerComponent,
        FullscreenToggleComponent,
        NgbAccordionModule,
        UsageHintsComponent,
    ],
})
export class EditionSheetsPanelComponent {
    /**
     * Model signal: isSheetFacetMinimized.
     *
     * It holds the toggle state of the sheet facet (two-way bound).
     */
    readonly isSheetFacetMinimized = model.required<boolean>();

    /**
     * Readonly input signal: svgSheetsData.
     *
     * It holds the svg sheets data.
     */
    readonly svgSheetsData = input.required<EditionSvgSheetsList | null>();

    /**
     * Readonly input signal: selectedSvgSheet.
     *
     * It holds the selected svg sheet (id, full id and selected content).
     */
    readonly selectedSvgSheet = input.required<EditionSvgSheetSelection | undefined>();

    /**
     * Readonly input signal: selectedTextcritics.
     *
     * It holds the textcritics of the selected svg sheet
     * with the commentary filtered for the selected tkk overlays.
     */
    readonly selectedTextcritics = input.required<Textcritics | undefined>();

    /**
     * Readonly output signal: browseSheetRequest.
     *
     * It emits the direction (-1 for previous, 1 for next) to browse the svg sheets.
     */
    readonly browseSheetRequest = output<1 | -1>();

    /**
     * Readonly output signal: selectLinkBoxRequest.
     *
     * It emits the id of a selected link box.
     */
    readonly selectLinkBoxRequest = output<string>();

    /**
     * Readonly output signal: selectTkkOverlaysRequest.
     *
     * It emits the selected tkk overlays.
     */
    readonly selectTkkOverlaysRequest = output<EditionSvgOverlayTkk[]>();

    /**
     * Readonly signal: isFullscreen.
     *
     * It holds the fullscreen status.
     */
    readonly isFullscreen = inject(FullscreenService).isFullscreen;
}
