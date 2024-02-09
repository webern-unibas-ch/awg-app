import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSvgSheetFooterModule } from './edition-svg-sheet-footer/edition-svg-sheet-footer.module';
import { EditionSvgSheetNavModule } from './edition-svg-sheet-nav/edition-svg-sheet-nav.module';
import { EditionSvgSheetViewerModule } from './edition-svg-sheet-viewer/edition-svg-sheet-viewer.module';

import { EditionAccoladeComponent } from './edition-accolade.component';

/**
 * The EditionAccolade module.
 *
 * It embeds the edition accolade components
 * as well as the {@link EditionSvgSheetFooterModule},
 * {@link EditionSvgSheetNavModule}, {@link EditionSvgSheetViewerModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionSvgSheetFooterModule, EditionSvgSheetNavModule, EditionSvgSheetViewerModule],
    declarations: [EditionAccoladeComponent],
    exports: [EditionAccoladeComponent],
})
export class EditionAccoladeModule {}
