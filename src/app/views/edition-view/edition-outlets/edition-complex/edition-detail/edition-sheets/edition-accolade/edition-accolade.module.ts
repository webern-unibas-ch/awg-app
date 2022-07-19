import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaTableModule } from '../../edition-tka-table/edition-tka-table.module';

import { EditionAccoladeComponent } from './edition-accolade.component';
import { EditionSvgSheetNavComponent } from './edition-svg-sheet-nav';
import { EditionSvgSheetListComponent } from './edition-svg-sheet-list';

/**
 * The EditionAccolade module.
 *
 * It embeds the edition accolade components as well as the
 * {@link EditionSvgSheetComponent}, {@link EditionSvgSheetNavComponent},
 * {@link EditionSvgSheetListComponent},
 * {@link EditionTkaTableModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaTableModule],
    declarations: [
        EditionAccoladeComponent,
        EditionSvgSheetNavComponent,
        EditionSvgSheetListComponent,
    ],
    exports: [EditionAccoladeComponent],
})
export class EditionAccoladeModule {}
