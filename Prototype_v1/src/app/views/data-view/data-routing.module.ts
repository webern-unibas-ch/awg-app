import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataViewComponent } from './data-view.component';
import { ResourceDetailComponent } from './data-outlets/resource-detail/resource-detail.component';
import { SearchOverviewComponent } from './data-outlets/search-overview.component';
import { SearchPanelComponent } from './data-outlets/search-panel/search-panel.component';
import { TimelineComponent } from './data-outlets/timeline/timeline.component';

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
                    { path: 'timeline', component: TimelineComponent },
                    { path: 'detail/:id', redirectTo: 'resource/:id' }, // absolute redirect (replacement of route) to resource/:id,
                    // TODO: lazy loaded bibliography path muted for now
                    // { path: 'bibliography', loadChildren: './data-outlets/bibliography/bibliography.module#BibliographyModule'}
                    { path: '', pathMatch: 'full', redirectTo: 'fulltext' }
                ]
            }
        ]
    },
    { path: 'resource/:id', component: ResourceDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(dataRoutes)],
    exports: [RouterModule]
})
export class DataRoutingModule {}

export const routedComponents = [
    DataViewComponent,
    SearchOverviewComponent,
    SearchPanelComponent,
    ResourceDetailComponent,
    TimelineComponent
];
