import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionInfoComponent } from '@awg-side-info/edition-info/edition-info.component';

import { EditionComplexComponent } from './edition-outlets/edition-complex';
import { EditionDetailNavComponent } from './edition-outlets/edition-complex/edition-detail/edition-detail-nav/edition-detail-nav.component';
import { EditionSeriesComponent } from './edition-outlets/edition-series';
import { EditionSeriesDetailComponent } from './edition-outlets/edition-series-detail';
import { EditionSectionsComponent } from './edition-outlets/edition-series-detail/edition-sections';
import { EditionViewComponent } from './edition-view.component';

/* Routes of the EditionViewModule */
const EDITION_VIEW_ROUTES: Routes = [
    {
        path: '',
        outlet: 'side',
        component: EditionInfoComponent,
    },
    {
        path: '',
        component: EditionViewComponent,
        children: [
            {
                path: 'preface',
                loadChildren: () =>
                    import('./edition-outlets/edition-preface/edition-preface.module').then(
                        m => m.EditionPrefaceModule
                    ),
            },
            {
                path: 'row-tables',
                loadChildren: () =>
                    import('./edition-outlets/edition-row-tables/edition-row-tables.module').then(
                        m => m.EditionRowTablesModule
                    ),
            },
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
                        // Overview of sections.
                        path: 'sections',
                        component: EditionSectionsComponent,
                    },
                    {
                        // Section by id (1, 2, 3, 4, 5).
                        path: 'section/:id',
                        loadChildren: () =>
                            import(
                                './edition-outlets/edition-series-detail/edition-section-detail/edition-section-detail.module'
                            ).then(m => m.EditionSectionDetailModule),
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
                path: 'composition',
                redirectTo: 'complex',
                pathMatch: 'prefix',
            },
            {
                // ComplexID (OP12, M34, etc.).
                path: 'complex/:complexId',
                component: EditionComplexComponent,
                children: [
                    {
                        path: '',
                        component: EditionDetailNavComponent,
                        children: [
                            {
                                path: 'intro',
                                loadChildren: () =>
                                    import(
                                        './edition-outlets/edition-complex/edition-detail/edition-intro/edition-intro.module'
                                    ).then(m => m.EditionIntroModule),
                            },
                            {
                                path: 'sheets',
                                loadChildren: () =>
                                    import(
                                        './edition-outlets/edition-complex/edition-detail/edition-sheets/edition-sheets.module'
                                    ).then(m => m.EditionSheetsModule),
                            },
                            {
                                path: 'report',
                                loadChildren: () =>
                                    import(
                                        './edition-outlets/edition-complex/edition-detail/edition-report/edition-report.module'
                                    ).then(m => m.EditionReportModule),
                            },
                            {
                                path: 'graph',
                                loadChildren: () =>
                                    import(
                                        './edition-outlets/edition-complex/edition-detail/edition-graph/edition-graph.module'
                                    ).then(m => m.EditionGraphModule),
                            },
                            {
                                path: '',
                                redirectTo: 'sheets',
                                pathMatch: 'full',
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

/**
 * Routed components of the {@link EditionViewModule}:
 * {@link EditionViewComponent}, {@link EditionComplexComponent},
 * {@link EditionDetailNavComponent}, {@link EditionInfoComponent},
 * {@link EditionSectionsComponent}, {@link EditionSeriesComponent},
 * and {@link EditionSeriesDetailComponent}.
 */
export const routedEditionViewComponents = [
    EditionViewComponent,
    EditionComplexComponent,
    EditionDetailNavComponent,
    EditionInfoComponent,
    EditionSectionsComponent,
    EditionSeriesComponent,
    EditionSeriesDetailComponent,
];

/**
 * EditionView module routing.
 *
 * It activates the EDITION_VIEW_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(EDITION_VIEW_ROUTES)],
    exports: [RouterModule],
})
export class EditionViewRoutingModule {}
