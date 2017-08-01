import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchComponent } from './search.component';

import { BibliographyComponent } from './search-outlets/bibliography/bibliography.component';
import { BibliographyDetailComponent } from './search-outlets/bibliography/bibliography-detail/bibliography-detail.component';
import { SearchFormComponent } from './search-outlets/search-panel/search-form/search-form.component';
import { SearchOverviewComponent } from './search-outlets/search-overview.component';
import { SearchPanelComponent } from './search-outlets/search-panel/search-panel.component';
import { SearchResultDetailComponent } from './search-outlets/search-panel/search-result-detail/search-result-detail.component';
import { SearchResultListComponent } from './search-outlets/search-panel/search-result-list/search-result-list.component';
import { SearchDetailTabsComponent } from './search-outlets/search-detail-tabs/search-detail-tabs.component';
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
    { path: 'resource/:id',  component: SearchDetailTabsComponent}
];

@NgModule({
    imports: [ RouterModule.forChild(searchRoutes) ],
    exports: [ RouterModule ]

})
export class SearchRoutingModule { }

export const routedComponents = [
    SearchComponent,
    BibliographyComponent,
    BibliographyDetailComponent,
    SearchOverviewComponent,
    SearchPanelComponent,
    SearchResultDetailComponent,
    SearchResultListComponent,
    SearchDetailTabsComponent,
    TimelineComponent
];
