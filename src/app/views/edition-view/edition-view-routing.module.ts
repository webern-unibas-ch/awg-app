import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionViewComponent } from './edition-view.component';
import { EditionDetailComponent } from './edition-outlets/edition-detail';
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
        component: EditionViewComponent,
        children: [
            {
                // compositionID (op12, M317, etc.
                path: 'composition/:compositionId',
                component: EditionOverviewComponent,
                children: [
                    {
                        path: EditionConstants.editionIntro.path,
                        component: EditionIntroComponent
                    },
                    {
                        path: EditionConstants.editionDetail.path,
                        component: EditionDetailComponent
                    },
                    { path: EditionConstants.editionReport.path, component: ReportComponent },
                    {
                        path: '',
                        redirectTo: '/' + EditionConstants.editionIntro.path,
                        pathMatch: 'full'
                    }
                ]
            }
        ]

        /*{
            { path: '', redirectTo: 'series', pathMatch: 'full' },
            { path: 'series', component: EditionOverviewComponent }
                // seriesID (series/1, etc.) // TODO: add Overview , cf. https://stackblitz.com/edit/angular-nested-routing-with-modules-with-bootstrap?embed=1&file=src/index.html
                path: 'series/:id',
                component: EditionSeriesDetailComponent,
                children: [
                    {
                        // sectionID (section/1, etc.)
                        path: 'section/:id',
                        component: EditionSectionComponent,
                        children: [
                            {
                                // compositionID (op12, M317, etc.
                                path: ':compositionId',
                                component: EditionOverviewComponent,
                                children: [
                                    {
                                        path: 'type/:id',
                                        component: EditionTypeComponent,
                                        children: [
                                            {
                                                path: EditionConstants.editionIntro.path,
                                                component: EditionIntroComponent
                                            },
                                            {
                                                path: EditionConstants.editionDetail.path,
                                                component: EditionDetailComponent
                                            },
                                            { path: EditionConstants.editionReport.path, component: ReportComponent },
                                            {
                                                path: '',
                                                redirectTo: '/' + EditionConstants.editionIntro.path,
                                                pathMatch: 'full'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            ]
        }*/
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
