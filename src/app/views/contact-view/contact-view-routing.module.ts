import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactViewComponent } from '@awg-views/contact-view/contact-view.component';

/* routes of the ContactViewModule */
const contactViewRoutes: Routes = [
    {
        path: '',
        component: ContactViewComponent
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
