import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionAccoladeModule } from './edition-accolade/edition-accolade.module';
import { EditionConvoluteModule } from './edition-convolute/edition-convolute.module';
import { EditionSheetsRoutingModule, routedEditionSheetsComponents } from './edition-sheets-routing.module';

/**
 * The EditionSheets module.
 *
 * It embeds the edition sheets components and their
 * [routing definition]{@link EditionSheetsRoutingModule} as well as the
 * {@link EditionAccoladeModule}, {@link EditionConvoluteModule},
 * {@link FolioModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionAccoladeModule, EditionConvoluteModule, EditionSheetsRoutingModule],
    declarations: [routedEditionSheetsComponents],
})
export class EditionSheetsModule {}
