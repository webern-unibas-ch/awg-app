import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionRowtablesComponent } from './edition-rowtables.component';

/* Routes of the EditionRowtablesModule */
const EDITION_ROWTABLES_ROUTES: Routes = [
    {
        path: '',
        component: EditionRowtablesComponent,
        data: { title: 'AWG Online Edition – Row tables' },
    },
];

/**
 * Routed components of the {@link EditionRowtablesModule}:
 * {@link EditionRowtablesComponent}.
 */
export const routedEditionRowtablesComponents = [EditionRowtablesComponent];

/**
 * EditionRowtables module routing.
 *
 * It activates the EDITION_ROW_TABLES_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(EDITION_ROWTABLES_ROUTES)],
    exports: [RouterModule],
})
export class EditionRowtablesRoutingModule {}
