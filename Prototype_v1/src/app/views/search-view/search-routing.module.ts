import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { SearchComponent } from './search.component';
import { SearchOverviewComponent } from './search-outlets/search-overview.component';
import { SearchPanelComponent } from './search-outlets/search-panel/search-panel.component';

import { ResourceDetailComponent } from './search-outlets/resource-detail/resource-detail.component';

import { TimelineComponent } from './search-outlets/timeline/timeline.component';


const searchRoutes: Routes = [
    { path: '',  component: SearchComponent,
        children: [
            { path: '', component: SearchOverviewComponent,
                children: [
                    { path: 'fulltext', component: SearchPanelComponent},
                    { path: 'timeline', component: TimelineComponent },
                    { path: 'detail/:id', redirectTo: '/resource/:id' }, // absolute redirect (replacement of route) to resource/:id,
                    { path: 'bibliography', loadChildren: './search-outlets/bibliography/bibliography.module#BibliographyModule'}
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
    SearchComponent,
    SearchOverviewComponent,
    SearchPanelComponent,
    ResourceDetailComponent,
    TimelineComponent
];
