import { Routes } from '@angular/router';

import { EditionReportComponent } from './edition-report.component';

/**
 * The routes of the EditionReport.
 */
export const EDITION_REPORT_ROUTES: Routes = [
    {
        path: '',
        component: EditionReportComponent,
        data: { title: 'AWG Online Edition – Report' },
    },
];
