import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaTableModule } from '../../edition-tka-table/edition-tka-table.module';

import { EditionAccoladeComponent } from './edition-accolade.component';
import { EditionSvgSheetComponent } from './edition-svg-sheet';
import { EditionSvgSheetNavComponent } from './edition-svg-sheet-nav';
import { EditionSvgSheetNavItemComponent } from './edition-svg-sheet-nav/edition-svg-sheet-nav-item/edition-svg-sheet-nav-item.component';

/**
 * The EditionAccolade module.
 *
 * It embeds the edition accolade components as well as the
 * {@link EditionSvgSheetNavComponent}, {@link EditionSvgSheetNavItemComponent},
 * {@link EditionSvgSheetComponent}, {@link EditionTkaTableModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaTableModule],
    declarations: [
        EditionAccoladeComponent,
        EditionSvgSheetComponent,
        EditionSvgSheetNavComponent,
        EditionSvgSheetNavItemComponent,
    ],
    exports: [EditionAccoladeComponent],
})
export class EditionAccoladeModule {}
