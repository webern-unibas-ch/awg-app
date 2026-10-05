import { Routes } from '@angular/router';

import { EditionSheetsComponent } from './edition-sheets.component';

/**
 * The routes of the EditionSheets.
 */
export const EDITION_SHEETS_ROUTES: Routes = [
    {
        path: '',
        component: EditionSheetsComponent,
        data: { title: 'AWG Online Edition – Sheets' },
    },
];
