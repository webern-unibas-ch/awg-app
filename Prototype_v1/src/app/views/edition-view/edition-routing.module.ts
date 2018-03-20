import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition.component';
import { EditionDetailComponent } from './edition-outlets/edition-detail/edition-detail.component';
import { IntroComponent } from './edition-outlets/intro/intro.component';
import { EditionOverviewComponent } from './edition-outlets/edition-overview/edition-overview.component';
import { ReportComponent } from './edition-outlets/report/report.component';


const editionRoutes: Routes = [
    { path: 'edition',  component: EditionViewComponent,
        children: [
            { path: '', component: EditionOverviewComponent,
                children: [
                    { path: 'intro', component: IntroComponent },
                    { path: 'detail', component: EditionDetailComponent },
                    { path: 'detail/:id', component: EditionDetailComponent },
                    { path: 'report', component: ReportComponent }
                ]
            }
        ]
    },
    { path: 'editions', redirectTo: 'edition', pathMatch: 'full' }
];

@NgModule({
    imports: [ RouterModule.forChild(editionRoutes) ],
    exports: [ RouterModule ]

})
export class EditionRoutingModule { }

export const routedComponents = [
    EditionViewComponent,
    EditionDetailComponent,
    IntroComponent,
    EditionOverviewComponent,
    ReportComponent
];
