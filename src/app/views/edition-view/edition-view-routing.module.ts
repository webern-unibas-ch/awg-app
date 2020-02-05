import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition-view.component';
import { EditionDetailComponent } from './edition-outlets/edition-detail';
import { EditionGraphComponent } from './edition-outlets/edition-graph';
import { EditionIntroComponent } from './edition-outlets/edition-intro';
import { EditionOverviewComponent } from './edition-outlets/edition-overview.component';
import { EditionSectionComponent } from './edition-outlets/edition-section';
import { EditionSeriesComponent } from './edition-outlets/edition-series';
import { EditionTypeComponent } from './edition-outlets/edition-type';
import { ReportComponent } from './edition-outlets/report';

import { EditionConstants } from './models/edition-constants';

/* routes of the EditionViewModule */
const editionViewRoutes: Routes = [
    {
        path: '',
        component: EditionSectionComponent,
        children: [
            {
                // compositionID (op12, M317, etc.
                path: 'composition/:compositionId',
                component: EditionViewComponent,
                children: [
                    {
                        path: '',
                        component: EditionOverviewComponent,
                        children: [
                            {
                                // value.of() needed for not string routes due to a bug in compodoc (or deeper dependencies)
                                // cf. https://github.com/compodoc/compodoc/issues/525#issuecomment-488822477
                                path: EditionConstants.editionGraph.route.valueOf(),
                                component: EditionGraphComponent
                            },
                            {
                                path: EditionConstants.editionIntro.route.valueOf(),
                                component: EditionIntroComponent
                            },
                            {
                                path: EditionConstants.editionDetail.route.valueOf(),
                                component: EditionDetailComponent
                            },
                            { path: EditionConstants.editionReport.route.valueOf(), component: ReportComponent },
                            {
                                path: '',
                                redirectTo: '/' + EditionConstants.editionIntro.route.valueOf(),
                                pathMatch: 'full'
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

/**
 * Routed components of the {@link EditionViewModule}:
 * {@link EditionIntroComponent}, {@link EditionDetailComponent},
 * {@link ReportComponent}.
 */
export const routedEditionViewComponents = [
    EditionViewComponent,
    EditionDetailComponent,
    EditionGraphComponent,
    EditionIntroComponent,
    EditionOverviewComponent,
    EditionSectionComponent,
    EditionSeriesComponent,
    EditionTypeComponent,
    ReportComponent
];

/**
 * EditionView module routing.
 *
 * It activates the editionViewRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(editionViewRoutes)],
    exports: [RouterModule]
})
export class EditionViewRoutingModule {}
