import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactViewComponent } from '@awg-views/contact-view/contact-view.component';

const contactRoutes: Routes = [
    {
        path: '',
        component: ContactViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(contactRoutes)],
    exports: [RouterModule]
})
export class ContactRoutingModule {}

export const routedComponents = [ContactViewComponent];
