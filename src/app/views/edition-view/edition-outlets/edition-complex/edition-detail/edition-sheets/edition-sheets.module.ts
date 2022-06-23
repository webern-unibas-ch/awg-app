import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { FolioModule } from './edition-convolute/edition-folio/folio.module';
import { EditionTkaTableModule } from '../edition-tka-table/edition-tka-table.module';

import { EditionAccoladeComponent } from './edition-accolade';
import { EditionSvgSheetNavComponent } from './edition-accolade/edition-svg-sheet-nav';
import { EditionSvgSheetListComponent } from './edition-accolade/edition-svg-sheet-list';
import { EditionConvoluteComponent } from './edition-convolute';
import { EditionSvgSheetComponent } from './edition-svg-sheet_TODO';
import { EditionSheetsRoutingModule, routedEditionSheetsComponents } from './edition-sheets-routing.module';

/**
 * The edition detail module.
 *
 * It embeds the edition detail components and their
 * [routing definition]{@link EditionSheetsRoutingModule} as well as the
 * {@link EditionAccoladeComponent}, {@link EditionConvoluteComponent},
 * {@link EditionSvgSheetNavComponent}, {@link EditionSvgSheetListComponent},
 * {@link EditionTkaTableModule}, {@link FolioModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, FolioModule, EditionTkaTableModule, EditionSheetsRoutingModule],
    declarations: [
        EditionAccoladeComponent,
        EditionConvoluteComponent,
        EditionSvgSheetComponent,
        EditionSvgSheetNavComponent,
        EditionSvgSheetListComponent,
        routedEditionSheetsComponents,
    ],
})
export class EditionSheetsModule {}
