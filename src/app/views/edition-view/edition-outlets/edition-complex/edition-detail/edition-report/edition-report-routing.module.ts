import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionReportComponent } from './edition-report.component';

/* Routes of the EditionReportModule */
const EDITION_REPORT_ROUTES: Routes = [
    {
        path: '',
        component: EditionReportComponent,
        data: { title: 'AWG Online Edition – Report' },
    },
];

/**
 * EditionReport module routing.
 *
 * It activates the EDITION_REPORT_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(EDITION_REPORT_ROUTES)],
    exports: [RouterModule],
})
export class EditionReportRoutingModule {}
