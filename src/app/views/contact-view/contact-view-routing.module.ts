import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactViewComponent } from '@awg-views/contact-view/contact-view.component';

/* Routes of the ContactViewModule */
const CONTACT_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: ContactViewComponent,
        data: { title: 'AWG Online Edition – Contact' },
    },
];

/**
 * Routed components of the {@link ContactViewModule}:
 * {@link ContactViewComponent}.
 */
export const routedContactViewComponents = [ContactViewComponent];

/**
 * ContactView module routing.
 *
 * It activates the CONTACT_VIEW_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(CONTACT_VIEW_ROUTES)],
    exports: [RouterModule],
})
export class ContactViewRoutingModule {}
