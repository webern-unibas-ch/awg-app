import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition-view.component';
import { EditionComponent } from './edition/edition.component';
import { IntroComponent } from './intro/intro.component';
import { OverviewComponent } from './overview/overview.component';
import { ReportComponent } from './report/report.component';

const editionsRoutes: Routes = [
    { path: 'edition',  component: EditionViewComponent,
        children: [
            { path: '', component: OverviewComponent },
            { path: 'intro', component: IntroComponent },
            { path: 'report', component: ReportComponent },
            { path: ':id', component: EditionComponent }

        ]
    },
    // { path: 'edition/intro', component: IntroComponent },
    // { path: 'edition/:id', component: EditionComponent },
    { path: 'editions', redirectTo: 'edition', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forChild(editionsRoutes)
    ],
    exports: [
        RouterModule
    ]

})
export class EditionsRoutingModule { }

export const routedComponents = [ EditionViewComponent, EditionComponent, IntroComponent, OverviewComponent, ReportComponent ];
