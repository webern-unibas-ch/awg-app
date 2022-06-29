import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionRowTablesComponent } from './edition-row-tables.component';

/* Routes of the EditionRowTablesModule */
const EDITION_ROW_TABLES_ROUTES: Routes = [
    {
        path: '',
        component: EditionRowTablesComponent,
        data: { title: 'AWG Online Edition – Row tables' },
    },
];

/**
 * Routed components of the {@link EditionRowTablesModule}:
 * {@link EditionRowTablesComponent}.
 */
export const routedEditionRowTablesComponents = [EditionRowTablesComponent];

/**
 * EditionRowTables module routing.
 *
 * It activates the EDITION_ROW_TABLES_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(EDITION_ROW_TABLES_ROUTES)],
    exports: [RouterModule],
})
export class EditionRowTablesRoutingModule {}
