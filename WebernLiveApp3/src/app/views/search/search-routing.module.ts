import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { SearchComponent } from './search.component';
import { SearchBibliographyComponent } from './search-bibliography/search-bibliography.component';
import { SearchFulltextComponent } from './search-fulltext/search-fulltext.component';
import { SearchOverviewComponent } from './search-overview/search-overview.component';
import { SearchTimelineComponent } from './search-timeline/search-timeline.component';


const searchRoutes: Routes = [
    { path: 'search', component: SearchComponent,
        children: [
            {
                path: '',
                children: [
                    { path: 'overview', component: SearchOverviewComponent },
                    { path: 'fulltext', component: SearchFulltextComponent },
                    { path: 'timeline', component: SearchTimelineComponent },
                    { path: 'bibliography', component: SearchBibliographyComponent },
                    { path: '', redirectTo: 'overview', pathMatch: 'full'}
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(searchRoutes)],
    exports: [RouterModule]
})
export class SearchRoutingModule { }

export const routedSearchComponents = [
    SearchComponent,
    SearchBibliographyComponent,
    SearchFulltextComponent,
    SearchOverviewComponent,
    SearchTimelineComponent
];
