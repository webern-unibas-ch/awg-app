import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BibliographyComponent } from './bibliography.component';
import { BibliographyDetailComponent } from './bibliography-detail/bibliography-detail.component';

/* Routes of the BibliographyModule */
const bibliographyRoutes: Routes = [
    {
        path: '',
        component: BibliographyComponent,
        children: [{ path: 'detail/:id', component: BibliographyDetailComponent }],
    },
];

/**
 * Routed components of the {@link BibliographyModule}:
 * {@link BibliographyComponent} and {@link BibliographyDetailComponent}.
 */
export const routedBibliographyComponents = [BibliographyComponent, BibliographyDetailComponent];

/**
 * Bibliography module routing.
 *
 * It activates the bibliographyRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(bibliographyRoutes)],
    exports: [RouterModule],
})
export class BibliographyRoutingModule {}
