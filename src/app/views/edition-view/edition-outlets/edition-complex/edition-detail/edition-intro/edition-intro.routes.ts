import { Routes } from '@angular/router';

import { EditionIntroComponent } from './edition-intro.component';

/**
 * The routes of the EditionIntro.
 **/
export const EDITION_INTRO_ROUTES: Routes = [
    {
        path: '',
        component: EditionIntroComponent,
        data: { title: 'AWG Online Edition – Intro' },
    },
];
