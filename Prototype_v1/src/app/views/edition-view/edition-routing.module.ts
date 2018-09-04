import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionDetailComponent } from './edition-outlets/edition-detail';
import { EditionOverviewComponent } from './edition-outlets/edition-overview.component';
import { EditionViewComponent } from './edition.component';
import { IntroComponent } from './edition-outlets/intro';
import { ReportComponent } from './edition-outlets/report';


const editionRoutes: Routes = [
    { path: '',  component: EditionViewComponent,
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
