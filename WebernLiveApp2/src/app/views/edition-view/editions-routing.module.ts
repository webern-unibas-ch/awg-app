import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition-view.component';
import { EditionDetailComponent } from './edition-outlets/edition-detail/edition-detail.component';
import { IntroComponent } from './edition-outlets/intro/intro.component';
import { EditionOverviewComponent } from './edition-outlets/edition-overview/edition-overview.component';
import { ReportComponent } from './edition-outlets/report/report.component';

const editionsRoutes: Routes = [
    { path: 'edition',  component: EditionViewComponent,
        children: [
            { path: '', component: EditionOverviewComponent,
                children: [
                    { path: 'intro', component: IntroComponent },
                    { path: 'report', component: ReportComponent },
                    { path: 'detail', component: EditionDetailComponent },
                    { path: 'detail/:id', component: EditionDetailComponent }
                ]
            }
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
    EditionDetailComponent,
    IntroComponent,
    EditionOverviewComponent,
    ReportComponent
];
