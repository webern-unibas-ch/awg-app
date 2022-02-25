import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionConstants } from './models';

import { EditionViewComponent } from './edition-view.component';
import { EditionComplexComponent } from './edition-outlets/edition-complex';
import { EditionDetailNavComponent } from './edition-outlets/edition-detail-nav.component';
import { EditionRowTablesComponent } from '@awg-views/edition-view/edition-outlets/edition-row-tables';
import { EditionSectionsComponent } from './edition-outlets/edition-sections';
import { EditionSectionDetailComponent } from './edition-outlets/edition-sections/edition-section-detail';
import { EditionSeriesComponent } from './edition-outlets/edition-series';
import { EditionSeriesDetailComponent } from './edition-outlets/edition-series/edition-series-detail';
import { EditionTypeComponent } from './edition-outlets/edition-type';

/* Routes of the EditionViewModule */
const editionViewRoutes: Routes = [
    {
        path: '',
        component: EditionViewComponent,
        children: [
            {
                // Overview of series.
                path: 'series',
                component: EditionSeriesComponent,
            },
            {
                // Series by id (I, II, III).
                path: 'series/:id',
                component: EditionSeriesDetailComponent,
                children: [
                    {
                        path: 'sections',
                        component: EditionSectionsComponent,
                    },
                    {
                        path: 'section/:id',
                        component: EditionSectionDetailComponent,
                    },
                    {
                        path: 'sections/:id',
                        redirectTo: 'section/:id',
                        pathMatch: 'full',
                    },
                    {
                        path: '',
                        redirectTo: 'sections',
                        pathMatch: 'full',
                    },
                ],
            },
            {
                // CompositionID (op12, M317, etc.).
                path: 'composition/:compositionId',
                component: EditionComplexComponent,
                children: [
                    {
                        path: '',
                        component: EditionDetailNavComponent,
                        children: [
                            {
                                path: EditionConstants.EDITION_INTRO.route,
                                loadChildren: () =>
                                    import('./edition-outlets/edition-intro/edition-intro.module').then(
                                        m => m.EditionIntroModule
                                    ),
                            },
                            {
                                path: EditionConstants.EDITION_SHEETS.route,
                                loadChildren: () =>
                                    import('./edition-outlets/edition-sheets/edition-sheets.module').then(
                                        m => m.EditionSheetsModule
                                    ),
                            },
                            {
                                path: EditionConstants.EDITION_REPORT.route,
                                loadChildren: () =>
                                    import('./edition-outlets/edition-report/edition-report.module').then(
                                        m => m.EditionReportModule
                                    ),
                            },
                            {
                                path: EditionConstants.EDITION_GRAPH.route,
                                loadChildren: () =>
                                    import('./edition-outlets/edition-graph/edition-graph.module').then(
                                        m => m.EditionGraphModule
                                    ),
                            },
                            {
                                path: '',
                                redirectTo: EditionConstants.EDITION_INTRO.route,
                                pathMatch: 'full',
                            },
                        ],
                    },
                ],
            },
            {
                // Overview of row tables.
                path: 'row-tables',
                component: EditionRowTablesComponent,
            },
        ],
    },
];

/**
 * Routed components of the {@link EditionViewModule}:
 * {@link EditionViewComponent}, {@link EditionDetailNavComponent},
 * {@link EditionSectionsComponent}, {@link EditionSeriesComponent}
 * and {@link EditionTypeComponent}.
 */
export const routedEditionViewComponents = [
    EditionViewComponent,
    EditionComplexComponent,
    EditionDetailNavComponent,
    EditionRowTablesComponent,
    EditionSectionsComponent,
    EditionSectionDetailComponent,
    EditionSeriesComponent,
    EditionSeriesDetailComponent,
    EditionTypeComponent,
];

/**
 * EditionView module routing.
 *
 * It activates the editionViewRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(editionViewRoutes)],
    exports: [RouterModule],
})
export class EditionViewRoutingModule {}
