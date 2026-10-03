import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSheetFacetModule } from './facet/edition-sheet-facet.module';
import { EditionSheetFooterComponent } from './footer/edition-sheet-footer.component';
import { EditionSheetViewerModule } from './viewer/edition-sheet-viewer.module';

import { EditionSheetComponent } from './edition-sheet.component';

/**
 * The EditionSheet module.
 *
 * It embeds the edition sheet components
 * as well as the {@link EditionSheetFacetModule},
 * {@link EditionSheetFooterComponent}, {@link EditionSheetViewerModule}
 * and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionSheetFacetModule, EditionSheetFooterComponent, EditionSheetViewerModule],
    declarations: [EditionSheetComponent],
    exports: [EditionSheetComponent],
})
export class EditionSheetModule {}
