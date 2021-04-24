import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionDetailComponent } from './edition-detail.component';

/* Routes of the EditionDetailModule */
const editionDetailRoutes: Routes = [
    {
        path: '',
        component: EditionDetailComponent,
        data: { title: 'AWG Online Edition – Detail' },
    },
];

/**
 * Routed components of the {@link EditionDetailModule}:
 * {@link EditionDetailComponent}.
 */
export const routedEditionDetailComponents = [EditionDetailComponent];

/**
 * EditionDetail module routing.
 *
 * It activates the editionDetailRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(editionDetailRoutes)],
    exports: [RouterModule],
})
export class EditionDetailRoutingModule {}
