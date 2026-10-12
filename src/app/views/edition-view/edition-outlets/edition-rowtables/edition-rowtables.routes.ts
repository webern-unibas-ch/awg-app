import { Routes } from '@angular/router';

import { EditionRowtablesComponent } from './edition-rowtables.component';

/**
 * The routes for the EditionRowtables.
 * */
export const EDITION_ROWTABLES_ROUTES: Routes = [
    {
        path: '',
        component: EditionRowtablesComponent,
        data: { title: 'AWG Online Edition – Row tables' },
    },
];
