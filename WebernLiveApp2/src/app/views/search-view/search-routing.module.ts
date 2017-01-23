import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchViewComponent } from './search-view.component';
import { TimelineComponent } from './search-outlets/timeline/timeline.component';

const searchRoutes: Routes = [
    { path: 'search',  component: SearchViewComponent,
        children: [
            { path: '', component: SearchViewComponent,
                children: [
                    { path: 'timeline', component: TimelineComponent }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(searchRoutes) ],
    exports: [ RouterModule ]

})
export class SearchRoutingModule { }

export const routedComponents = [
    SearchViewComponent,
    TimelineComponent
];
