import { Routes } from '@angular/router';

import { EditionPrefaceComponent } from './edition-preface.component';

/**
 * The routes of the EditionPreface.
 **/
export const EDITION_PREFACE_ROUTES: Routes = [
    {
        path: '',
        component: EditionPrefaceComponent,
        data: { title: 'AWG Online Edition – Preface' },
    },
];
