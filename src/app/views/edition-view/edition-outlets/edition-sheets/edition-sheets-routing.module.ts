import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionSheetsComponent } from './edition-sheets.component';

/* Routes of the EditionSheetsModule */
const editionSheetsRoutes: Routes = [
    {
        path: '',
        component: EditionSheetsComponent,
        data: { title: 'AWG Online Edition – Sheets' },
    },
];

/**
 * Routed components of the {@link EditionSheetsModule}:
 * {@link EditionSheetsComponent}.
 */
export const routedEditionSheetsComponents = [EditionSheetsComponent];

/**
 * EditionSheets module routing.
 *
 * It activates the editionSheetsRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(editionSheetsRoutes)],
    exports: [RouterModule],
})
export class EditionSheetsRoutingModule {}
