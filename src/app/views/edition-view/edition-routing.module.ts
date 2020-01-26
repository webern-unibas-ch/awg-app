import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition-view.component';
import { EditionDetailComponent } from './edition-outlets/edition-detail';
import { EditionOverviewComponent } from './edition-outlets/edition-overview.component';
import { IntroComponent } from './edition-outlets/intro';
import { ReportComponent } from './edition-outlets/report';

import { EditionConstants } from './models/edition-constants';

/* routes of the EditionModule */
const editionRoutes: Routes = [
    {
        path: '',
        component: EditionViewComponent,
        children: [
            {
                // compositionID (op12, M317, etc.)
                path: ':id',
                component: EditionOverviewComponent,
                children: [
                    { path: EditionConstants.editionIntro, component: IntroComponent },
                    { path: EditionConstants.editionDetail, component: EditionDetailComponent },
                    { path: EditionConstants.editionReport, component: ReportComponent }
                ]
            }
        ]
    }
];

/**
 * Routed components of the {@link EditionModule}:
 * {@link IntroComponent}, {@link EditionDetailComponent},
 * {@link ReportComponent}.
 */
export const routedEditionComponents = [
    EditionViewComponent,
    EditionDetailComponent,
    IntroComponent,
    EditionOverviewComponent,
    ReportComponent
];

/**
 * Edition module routing.
 *
 * It activates the editionRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(editionRoutes)],
    exports: [RouterModule]
})
export class EditionRoutingModule {}
