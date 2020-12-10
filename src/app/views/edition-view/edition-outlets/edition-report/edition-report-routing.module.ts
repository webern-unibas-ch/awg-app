import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionReportComponent } from './edition-report.component';

/* routes of the EditionReportModule */
const editionReportRoutes: Routes = [
    {
        path: '',
        component: EditionReportComponent,
        data: { title: 'AWG Online Edition – Report' }
    }
];

/**
 * Routed components of the {@link EditionReportModule}:
 * {@link EditionReportComponent}.
 */
export const routedEditionReportComponents = [EditionReportComponent];

/**
 * EditionReport module routing.
 *
 * It activates the editionReportRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(editionReportRoutes)],
    exports: [RouterModule]
})
export class EditionReportRoutingModule {}
