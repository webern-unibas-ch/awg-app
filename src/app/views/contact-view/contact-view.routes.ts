import { Routes } from '@angular/router';

import { ContactSideInfoComponent } from './contact-side-info/contact-side-info.component';
import { ContactViewComponent } from './contact-view.component';

/**
 * The routes for the contact view.
 */
export const CONTACT_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: ContactViewComponent,
        data: { title: 'AWG Online Edition – Contact' },
    },
    {
        path: '',
        outlet: 'side',
        component: ContactSideInfoComponent,
    },
];
