import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaTableModule } from '../../edition-tka-table/edition-tka-table.module';

import { EditionAccoladeComponent } from './edition-accolade.component';
import { EditionSvgSheetFooterComponent } from './edition-svg-sheet-footer';
import { EditionSvgSheetNavComponent } from './edition-svg-sheet-nav';
import { EditionSvgSheetNavItemComponent } from './edition-svg-sheet-nav/edition-svg-sheet-nav-item/edition-svg-sheet-nav-item.component';
import { EditionSvgSheetViewerComponent } from './edition-svg-sheet-viewer';

/**
 * The EditionAccolade module.
 *
 * It embeds the edition accolade components as well as the {@link EditionSvgSheetFooterComponent},
 * {@link EditionSvgSheetNavComponent}, {@link EditionSvgSheetNavItemComponent},
 * {@link EditionSvgSheetViewerComponent}, {@link EditionTkaTableModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaTableModule],
    declarations: [
        EditionAccoladeComponent,
        EditionSvgSheetFooterComponent,
        EditionSvgSheetNavComponent,
        EditionSvgSheetNavItemComponent,
        EditionSvgSheetViewerComponent,
    ],
    exports: [EditionAccoladeComponent],
})
export class EditionAccoladeModule {}
