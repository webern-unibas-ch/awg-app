import { NgModule } from '@angular/core';
import { ButtonUsageHintsComponent } from '@awg-shared/button-usage-hints/button-usage-hints.component';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSheetFacetComponent } from './facet/edition-sheet-facet.component';
import { EditionSheetFooterComponent } from './footer/edition-sheet-footer.component';
import { EditionSheetViewerComponent } from './viewer/edition-sheet-viewer.component';

import { EditionSheetComponent } from './edition-sheet.component';

/**
 * The EditionSheet module.
 *
 * It embeds the edition sheet components
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
    declarations: [EditionSheetComponent],
    exports: [EditionSheetComponent],
})
export class EditionSheetModule {}
