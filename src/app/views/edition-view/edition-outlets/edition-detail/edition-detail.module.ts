import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { FolioModule } from '../edition-folio/folio.module';
import { EditionTkaTableModule } from '../edition-tka-table/edition-tka-table.module';

import { EditionAccoladeComponent } from './edition-accolade';
import { EditionConvoluteComponent } from './edition-convolute';
import { EditionSvgSheetComponent } from './edition-svg-sheet';
import { EditionSvgSheetNavComponent } from './edition-svg-sheet-nav';
import { EditionSvgSheetListComponent } from './edition-svg-sheet-list';
import { EditionDetailRoutingModule, routedEditionDetailComponents } from './edition-detail-routing.module';

/**
 * The edition detail module.
 *
 * It embeds the edition detail components and their
 * [routing definition]{@link EditionDetailRoutingModule} as well as the
 * {@link EditionAccoladeComponent}, {@link EditionConvoluteComponent},
 * {@link EditionSvgSheetNavComponent}, {@link EditionSvgSheetListComponent},
 * {@link EditionTkaTableModule}, {@link FolioModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, FolioModule, EditionTkaTableModule, EditionDetailRoutingModule],
    declarations: [
        EditionAccoladeComponent,
        EditionConvoluteComponent,
        EditionSvgSheetComponent,
        EditionSvgSheetNavComponent,
        EditionSvgSheetListComponent,
        routedEditionDetailComponents,
    ],
})
export class EditionDetailModule {}
