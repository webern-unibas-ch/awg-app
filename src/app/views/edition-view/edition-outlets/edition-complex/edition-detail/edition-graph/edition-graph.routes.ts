import { inject, provideEnvironmentInitializer } from '@angular/core';
import { Routes } from '@angular/router';

import { EditionGraphComponent } from './edition-graph.component';
import { RdfStoreService } from './graph-visualizer/rdf-store/rdf-store.service';

/**
 * The routes of the EditionGraph.
 *
 * The rdfstore module starts loading when the route is first activated,
 * in parallel with the graph data.
 */
export const EDITION_GRAPH_ROUTES: Routes = [
    {
        path: '',
        component: EditionGraphComponent,
        data: { title: 'AWG Online Edition – Graph' },
        providers: [provideEnvironmentInitializer(() => void inject(RdfStoreService).preload())],
    },
];
