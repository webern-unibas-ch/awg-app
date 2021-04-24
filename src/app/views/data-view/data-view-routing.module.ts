import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataViewComponent } from './data-view.component';
import { ResourceDetailComponent } from './data-outlets/resource-detail/resource-detail.component';
import { SearchOverviewComponent } from './data-outlets/search-overview.component';
import { SearchPanelComponent } from './data-outlets/search-panel/search-panel.component';
import { TimelineComponent } from './data-outlets/timeline/timeline.component';

/* Routes of the DataViewModule */
const dataViewRoutes: Routes = [
    {
        path: '',
        component: DataViewComponent,
        children: [
            {
                path: 'search',
                component: SearchOverviewComponent,
                children: [
                    {
                        path: 'fulltext',
                        component: SearchPanelComponent,
                        data: { title: 'AWG Online Edition – Search' },
                    },
                    { path: 'detail/:id', redirectTo: 'resource/:id' }, // Absolute redirect (replacement of route) to resource/:id,
                    /* Muted for now
                    { path: 'timeline', component: TimelineComponent },
                    {
                        path: 'bibliography',
                        loadChildren: () =>
                            import('./data-outlets/bibliography/bibliography.module').then(m => m.BibliographyModule)
                    },
                    */
                    { path: '', pathMatch: 'full', redirectTo: 'fulltext' },
                ],
            },
        ],
    },
    {
        path: 'resource/:id',
        component: ResourceDetailComponent,
        data: { title: 'AWG Online Edition – Resource Detail' },
    },
];

/**
 * Routed components of the {@link DataViewModule}:
 * {@link DataViewComponent}, {@link SearchOverviewComponent},
 * {@link SearchPanelComponent}, {@link ResourceDetailComponent}
 * and {@link TimelineComponent}.
 */
export const routedDataViewComponents = [
    DataViewComponent,
    SearchOverviewComponent,
    SearchPanelComponent,
    ResourceDetailComponent,
    // TimelineComponent
];

/**
 * DataView module routing.
 *
 * It activates the dataViewRoutes, also the lazy-loaded bibliography module.
 */
@NgModule({
    imports: [RouterModule.forChild(dataViewRoutes)],
    exports: [RouterModule],
})
export class DataViewRoutingModule {}
