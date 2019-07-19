import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataViewComponent } from './data-view.component';
import { ResourceDetailComponent } from './data-outlets/resource-detail/resource-detail.component';
import { SearchOverviewComponent } from './data-outlets/search-overview.component';
import { SearchPanelComponent } from './data-outlets/search-panel/search-panel.component';
import { TimelineComponent } from './data-outlets/timeline/timeline.component';

/* routes of the DataModule */
const dataRoutes: Routes = [
    {
        path: '',
        component: DataViewComponent,
        children: [
            {
                path: 'search',
                component: SearchOverviewComponent,
                children: [
                    { path: 'fulltext', component: SearchPanelComponent },
                    { path: 'detail/:id', redirectTo: 'resource/:id' }, // absolute redirect (replacement of route) to resource/:id,
                    { path: 'timeline', component: TimelineComponent },
                    {
                        path: 'bibliography',
                        loadChildren: () =>
                            import('./data-outlets/bibliography/bibliography.module').then(m => m.BibliographyModule)
                    },
                    { path: '', pathMatch: 'full', redirectTo: 'fulltext' }
                ]
            }
        ]
    },
    { path: 'resource/:id', component: ResourceDetailComponent }
];

/**
 * Routed components of the {@link DataModule}:
 * {@link DataViewComponent}, {@link SearchOverviewComponent},
 * {@link SearchPanelComponent}, {@link ResourceDetailComponent}
 * and {@link TimelineComponent}.
 */
export const routedDataComponents = [
    DataViewComponent,
    SearchOverviewComponent,
    SearchPanelComponent,
    ResourceDetailComponent,
    TimelineComponent
];

/**
 * Data module routing.
 *
 * It activates the dataRoutes, also the lazy-loaded bibliography module.
 */
@NgModule({
    imports: [RouterModule.forChild(dataRoutes)],
    exports: [RouterModule]
})
export class DataRoutingModule {}
