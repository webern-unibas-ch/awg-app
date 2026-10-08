import { Routes } from '@angular/router';

import { EditionGraphComponent } from './edition-graph.component';

/**
 * The routes of the EditionGraph.
 */
export const EDITION_GRAPH_ROUTES: Routes = [
    {
        path: '',
        component: EditionGraphComponent,
        data: { title: 'AWG Online Edition – Graph' },
    },
];
