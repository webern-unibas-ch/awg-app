import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition-view.component';

const editionsRoutes: Routes = [
    { path: 'editions',  component: EditionViewComponent },
    { path: 'edition/:id', component: EditionViewComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(editionsRoutes)
    ],
    exports: [
        RouterModule
    ]

})
export class EditionsRoutingModule { }
