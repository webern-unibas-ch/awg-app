import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaModule } from '../../edition-tka/edition-tka.module';
import { EditionSvgSheetNavModule } from './edition-svg-sheet-nav/edition-svg-sheet-nav.module';

import { EditionAccoladeComponent } from './edition-accolade.component';
import { EditionSvgSheetFooterComponent } from './edition-svg-sheet-footer';

import { EditionSvgSheetViewerComponent } from './edition-svg-sheet-viewer';

/**
 * The EditionAccolade module.
 *
 * It embeds the edition accolade components
 * as well as the {@link EditionSvgSheetFooterComponent},
 * {@link EditionSvgSheetViewerComponent}, {@link EditionSvgSheetNavModule},
 * {@link EditionTkaModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionSvgSheetNavModule, EditionTkaModule],
    declarations: [EditionAccoladeComponent, EditionSvgSheetFooterComponent, EditionSvgSheetViewerComponent],
    exports: [EditionAccoladeComponent],
})
export class EditionAccoladeModule {}
