import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition-view.component';
import { EditionDetailComponent } from './edition-outlets/edition-detail';
import { EditionOverviewComponent } from './edition-outlets/edition-overview.component';
import { EditionIntroComponent } from './edition-outlets/edition-intro';
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
                    { path: EditionConstants.editionIntro.path, component: EditionIntroComponent },
                    { path: EditionConstants.editionDetail.path, component: EditionDetailComponent },
                    { path: EditionConstants.editionReport.path, component: ReportComponent }
                ]
            }
        ]
    }
];

/**
 * Routed components of the {@link EditionModule}:
 * {@link EditionIntroComponent}, {@link EditionDetailComponent},
 * {@link ReportComponent}.
 */
export const routedEditionComponents = [
    EditionViewComponent,
    EditionDetailComponent,
    EditionIntroComponent,
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
