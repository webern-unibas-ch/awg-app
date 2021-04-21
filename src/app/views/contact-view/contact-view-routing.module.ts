import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactViewComponent } from '@awg-views/contact-view/contact-view.component';

/* Routes of the ContactViewModule */
const contactViewRoutes: Routes = [
    {
        path: '',
        component: ContactViewComponent,
        data: { title: 'AWG Online Edition – Contact' }
    }
];

/**
 * Routed components of the {@link ContactViewModule}:
 * {@link ContactViewComponent}.
 */
export const routedContactViewComponents = [ContactViewComponent];

/**
 * ContactView module routing.
 *
 * It activates the contactViewRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(contactViewRoutes)],
    exports: [RouterModule]
})
export class ContactViewRoutingModule {}
