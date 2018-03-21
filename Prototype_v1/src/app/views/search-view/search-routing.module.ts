import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchOverviewComponent } from './search-outlets/search-overview.component';
import { SearchPanelComponent } from './search-outlets/search-panel/search-panel.component';

import { ResourceDetailComponent } from './search-outlets/resource-detail/resource-detail.component';

import { SearchViewComponent } from './search.component';
import { TimelineComponent } from './search-outlets/timeline/timeline.component';


const searchRoutes: Routes = [
    { path: '',  component: SearchViewComponent,
        children: [
            { path: '', component: SearchOverviewComponent,
                children: [
                    { path: '', pathMatch: 'full', redirectTo: 'fulltext'},
                    { path: 'fulltext', component: SearchPanelComponent},
                    { path: 'timeline', component: TimelineComponent },
                    { path: 'detail/:id', redirectTo: '/resource/:id' }, // absolute redirect (replacement of route) to resource/:id,
                    // TODO: lazy loaded bibliography path muted for now
                    // { path: 'bibliography', loadChildren: './search-outlets/bibliography/bibliography.module#BibliographyModule'}
                ]
            }
        ]
    },
    { path: 'resource/:id',  component: ResourceDetailComponent}
];

@NgModule({
    imports: [ RouterModule.forChild(searchRoutes)],
    exports: [ RouterModule ]

})
export class SearchRoutingModule { }

export const routedComponents = [
    SearchViewComponent,
    SearchOverviewComponent,
    SearchPanelComponent,
    ResourceDetailComponent,
    TimelineComponent
];
