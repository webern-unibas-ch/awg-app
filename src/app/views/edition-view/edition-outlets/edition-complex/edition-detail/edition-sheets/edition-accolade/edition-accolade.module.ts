import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaModule } from '../../edition-tka/edition-tka.module';
import { EditionSvgSheetNavModule } from './edition-svg-sheet-nav/edition-svg-sheet-nav.module';
import { EditionSvgSheetViewerModule } from './edition-svg-sheet-viewer/edition-svg-sheet-viewer.module';

import { EditionAccoladeComponent } from './edition-accolade.component';
import { EditionSvgSheetFooterComponent } from './edition-svg-sheet-footer';

/**
 * The EditionAccolade module.
 *
 * It embeds the edition accolade components
 * as well as the {@link EditionSvgSheetFooterComponent},
 * {@link EditionSvgSheetNavModule}, {@link EditionSvgSheetViewerModule}, {@link EditionTkaModule}
 * and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionSvgSheetNavModule, EditionSvgSheetViewerModule, EditionTkaModule],
    declarations: [EditionAccoladeComponent, EditionSvgSheetFooterComponent],
    exports: [EditionAccoladeComponent],
})
export class EditionAccoladeModule {}
