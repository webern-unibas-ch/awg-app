import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BibliographyComponent } from './bibliography.component';
import { BibliographyDetailComponent } from './bibliography-detail/bibliography-detail.component';

const bibliographyRoutes: Routes = [
    { path: '', component: BibliographyComponent ,
        children: [
            { path: 'detail/:id', component: BibliographyDetailComponent }
            ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(bibliographyRoutes)],
    exports: [ RouterModule ]

})
export class BibliographyRoutingModule { }

export const routedComponents = [
    BibliographyComponent,
    BibliographyDetailComponent
];
