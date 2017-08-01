import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { BibliographyComponent } from './search-outlets/bibliography/bibliography.component';
import { BibliographyDetailComponent } from './search-outlets/bibliography/bibliography-detail/bibliography-detail.component';

import { SearchComponent } from './search.component';
import { SearchOverviewComponent } from './search-outlets/search-overview.component';
import { SearchPanelComponent } from './search-outlets/search-panel/search-panel.component';

import { ResourceDetailComponent } from './search-outlets/resource-detail/resource-detail.component';

import { TimelineComponent } from './search-outlets/timeline/timeline.component';


const searchRoutes: Routes = [
    { path: 'search',  component: SearchComponent,
        children: [
            { path: '', component: SearchOverviewComponent,
                children: [
                    { path: 'fulltext', component: SearchPanelComponent},
                    { path: 'detail/:id', redirectTo: '/resource/:id' }, // absolute redirect (replacement of route) to resource/:id
                    { path: 'timeline', component: TimelineComponent },
                    { path: 'bibliography', component: BibliographyComponent,
                        children: [
                            { path: 'detail/:id', component: BibliographyDetailComponent }
                        ]
                    }
                ]
            }
        ]
    },
    { path: 'resource/:id',  component: ResourceDetailComponent}
];

@NgModule({
    imports: [ RouterModule.forChild(searchRoutes) ],
    exports: [ RouterModule ]

})
export class SearchRoutingModule { }

export const routedComponents = [
    BibliographyComponent,
    BibliographyDetailComponent,
    SearchComponent,
    SearchOverviewComponent,
    SearchPanelComponent,
    ResourceDetailComponent,
    TimelineComponent
];
