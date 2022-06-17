import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BibliographyComponent } from './bibliography.component';
import { BibliographyDetailComponent } from './bibliography-detail/bibliography-detail.component';

/* Routes of the BibliographyModule */
const BIBLIOGRAPHY_ROUTES: Routes = [
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
 * It activates the BIBLIOGRAPHY_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(BIBLIOGRAPHY_ROUTES)],
    exports: [RouterModule],
})
export class BibliographyRoutingModule {}
