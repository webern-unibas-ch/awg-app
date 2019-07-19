import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactViewComponent } from '@awg-views/contact-view/contact-view.component';

/* routes of the ContactModule */
const contactRoutes: Routes = [
    {
        path: '',
        component: ContactViewComponent
    }
];

/**
 * Routed components of the {@link ContactModule}:
 * {@link ContactViewComponent}.
 */
export const routedContactComponents = [ContactViewComponent];

/**
 * Contact module routing.
 *
 * It activates the contactRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(contactRoutes)],
    exports: [RouterModule]
})
export class ContactRoutingModule {}
