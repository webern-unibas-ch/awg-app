import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSvgSheetFacetModule } from './edition-svg-sheet-facet/edition-svg-sheet-facet.module';
import { EditionSvgSheetFooterComponent } from './edition-svg-sheet-footer/edition-svg-sheet-footer.component';
import { EditionSvgSheetViewerModule } from './edition-svg-sheet-viewer/edition-svg-sheet-viewer.module';

import { EditionAccoladeComponent } from './edition-accolade.component';

/**
 * The EditionAccolade module.
 *
 * It embeds the edition accolade components
 * as well as the {@link EditionSvgSheetFacetModule},
 * {@link EditionSvgSheetFooterComponent}, {@link EditionSvgSheetViewerModule}
 * and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionSvgSheetFacetModule, EditionSvgSheetFooterComponent, EditionSvgSheetViewerModule],
    declarations: [EditionAccoladeComponent],
    exports: [EditionAccoladeComponent],
})
export class EditionAccoladeModule {}
