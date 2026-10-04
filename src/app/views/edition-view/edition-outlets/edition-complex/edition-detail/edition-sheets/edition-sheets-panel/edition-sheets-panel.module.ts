import { NgModule } from '@angular/core';
import { ButtonUsageHintsComponent } from '@awg-shared/button-usage-hints/button-usage-hints.component';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSheetFacetComponent } from './facet/edition-sheet-facet.component';
import { EditionSheetFooterComponent } from './footer/edition-sheet-footer.component';
import { EditionSheetViewerComponent } from './viewer/edition-sheet-viewer.component';

import { EditionSheetsPanelComponent } from './edition-sheets-panel.component';

/**
 * The EditionSheetsPanel module.
 *
 * It embeds the {@link EditionSheetsPanelComponent}
 * as well as the {@link EditionSheetFacetComponent},
 * {@link EditionSheetFooterComponent}, {@link EditionSheetViewerComponent}
 * and {@link SharedModule}.
 */
@NgModule({
    imports: [
        SharedModule,
        ButtonUsageHintsComponent,
        EditionSheetFacetComponent,
        EditionSheetFooterComponent,
        EditionSheetViewerComponent,
    ],
    declarations: [EditionSheetsPanelComponent],
    exports: [EditionSheetsPanelComponent],
})
export class EditionSheetsPanelModule {}
