import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionGraphComponent } from './edition-graph.component';

/* Routes of the EditionGraphModule */
const EDITION_GRAPH_ROUTES: Routes = [
    {
        path: '',
        component: EditionGraphComponent,
        data: { title: 'AWG Online Edition – Graph' },
    },
];

/**
 * Routed components of the {@link EditionGraphModule}:
 * {@link EditionGraphComponent}.
 */
export const routedEditionGraphComponents = [EditionGraphComponent];

/**
 * EditionGraph module routing.
 *
 * It activates the EDITION_GRAPH_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(EDITION_GRAPH_ROUTES)],
    exports: [RouterModule],
})
export class EditionGraphRoutingModule {}
