import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition-view.component';
import { EditionComponent } from './edition-outlets/edition/edition.component';
import { IntroComponent } from './edition-outlets/intro/intro.component';
import { OverviewComponent } from './edition-outlets/overview/overview.component';

const editionsRoutes: Routes = [
    { path: 'edition',  component: EditionViewComponent,
        children: [
            { path: '', component: OverviewComponent },
            { path: 'intro', component: IntroComponent },
            // path: 'report' in ReportModule
            { path: 'detail/:id', component: EditionComponent }
        ]
    },
    { path: 'editions', redirectTo: 'edition', pathMatch: 'full' }
];

@NgModule({
    imports: [ RouterModule.forChild(editionsRoutes) ],
    exports: [ RouterModule ]

})
export class EditionsRoutingModule { }

export const routedComponents = [
    EditionViewComponent,
    EditionComponent,
    IntroComponent,
    OverviewComponent
];
