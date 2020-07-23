import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition-view.component';
import { EditionOverviewComponent } from './edition-outlets/edition-overview.component';
import { EditionSectionComponent } from './edition-outlets/edition-section';
import { EditionSeriesComponent } from './edition-outlets/edition-series';
import { EditionTypeComponent } from './edition-outlets/edition-type';

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
                            /* {
                                path: EditionConstants.editionGraph.route,
                                loadChildren: () =>
                                    import(
                                        '@awg-views/edition-view/edition-outlets/edition-graph/edition-graph.module'
                                    ).then(m => m.EditionGraphModule)
                            },*/
                            {
                                path: EditionConstants.editionIntro.route,
                                loadChildren: () =>
                                    import('./edition-outlets/edition-intro/edition-intro.module').then(
                                        m => m.EditionIntroModule
                                    )
                            },
                            {
                                path: EditionConstants.editionDetail.route,
                                loadChildren: () =>
                                    import('./edition-outlets/edition-detail/edition-detail.module').then(
                                        m => m.EditionDetailModule
                                    )
                            },
                            {
                                path: EditionConstants.editionReport.route,
                                loadChildren: () =>
                                    import('./edition-outlets/edition-report/edition-report.module').then(
                                        m => m.EditionReportModule
                                    )
                            },
                            {
                                path: '',
                                redirectTo: '/' + EditionConstants.editionIntro.route,
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
 * {@link EditionViewComponent}, {@link EditionOverviewComponent},
 * {@link EditionSectionComponent}, {@link EditionSeriesComponent}
 * and {@link EditionTypeComponent}.
 */
export const routedEditionViewComponents = [
    EditionViewComponent,
    EditionOverviewComponent,
    EditionSectionComponent,
    EditionSeriesComponent,
    EditionTypeComponent
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
