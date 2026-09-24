import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionComplexComponent } from './edition-outlets/edition-complex';
import { EditionDetailNavComponent } from './edition-outlets/edition-complex/edition-detail/edition-detail-nav/edition-detail-nav.component';
import { EditionOutlineComponent } from './edition-outlets/edition-outline/edition-outline.component';
import { EditionSideInfoComponent } from './edition-side-info/edition-side-info.component';
import { EditionViewComponent } from './edition-view.component';

/* Routes of the EditionViewModule */
const EDITION_VIEW_ROUTES: Routes = [
    {
        path: '',
        outlet: 'side',
        component: EditionSideInfoComponent,
    },
    {
        path: '',
        component: EditionViewComponent,
        children: [
            {
                path: 'preface',
                loadChildren: () =>
                    import('./edition-outlets/edition-preface/edition-preface.routes').then(
                        m => m.EDITION_PREFACE_ROUTES
                    ),
            },
            {
                path: 'rowtables',
                loadChildren: () =>
                    import('./edition-outlets/edition-rowtables/edition-rowtables.routes').then(
                        m => m.EDITION_ROWTABLES_ROUTES
                    ),
            },
            {
                path: 'row-tables',
                redirectTo: 'rowtables',
                pathMatch: 'full',
            },
            {
                // Overview of series.
                path: 'series',
                component: EditionOutlineComponent,
            },
            {
                // Series by id (I, II, III).
                path: 'series/:seriesId',
                loadChildren: () =>
                    import('./edition-outlets/edition-outline/edition-series-detail/edition-series-detail.routes').then(
                        m => m.EDITION_SERIES_DETAIL_ROUTES
                    ),
            },
            {
                path: 'composition',
                redirectTo: 'complex',
                pathMatch: 'prefix',
            },
            {
                // ComplexID (op12, m34, etc.).
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
                                    import('./edition-outlets/edition-complex/edition-detail/edition-intro/edition-intro.module').then(
                                        m => m.EditionIntroModule
                                    ),
                            },
                            {
                                path: 'sheets',
                                loadChildren: () =>
                                    import('./edition-outlets/edition-complex/edition-detail/edition-sheets/edition-sheets.module').then(
                                        m => m.EditionSheetsModule
                                    ),
                            },
                            {
                                path: 'report',
                                loadChildren: () =>
                                    import('./edition-outlets/edition-complex/edition-detail/edition-report/edition-report.module').then(
                                        m => m.EditionReportModule
                                    ),
                            },
                            {
                                path: 'graph',
                                loadChildren: () =>
                                    import('./edition-outlets/edition-complex/edition-detail/edition-graph/edition-graph.module').then(
                                        m => m.EditionGraphModule
                                    ),
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
 * {@link EditionComplexComponent}, {@link EditionDetailNavComponent}.
 */
export const routedEditionViewComponents = [EditionComplexComponent, EditionDetailNavComponent];

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
