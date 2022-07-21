import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { EditionRowTablesRoutingModule, routedEditionRowTablesComponents } from './edition-row-tables-routing.module';

/**
 * The editionRowTables module.
 *
 * It embeds the {@link EditionRowTablesComponent} and its
 * [routing definition]{@link EditionRowTablesRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionRowTablesRoutingModule],
    declarations: [routedEditionRowTablesComponents],
})
export class EditionRowTablesModule {}
