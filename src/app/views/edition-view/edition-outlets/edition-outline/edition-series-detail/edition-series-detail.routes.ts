import { Routes } from '@angular/router';

import { editionSectionGuard } from '../edition-sections/edition-section-detail/edition-section.guard';
import { editionSectionResolver } from '../edition-sections/edition-section-detail/edition-section.resolver';

import { EditionSectionsComponent } from '../edition-sections/edition-sections.component';
import { EditionSeriesDetailComponent } from './edition-series-detail.component';

/**
 * The routes of the EditionSeriesDetail.
 **/
export const EDITION_SERIES_DETAIL_ROUTES: Routes = [
    {
        path: '',
        component: EditionSeriesDetailComponent,
        children: [
            {
                path: 'sections',
                component: EditionSectionsComponent,
            },
            {
                path: 'section/:sectionId',
                canActivate: [editionSectionGuard],
                resolve: { section: editionSectionResolver },
                runGuardsAndResolvers: 'always',
                loadChildren: () =>
                    import('../edition-sections/edition-section-detail/edition-section-detail.routes').then(
                        m => m.EDITION_SECTION_DETAIL_ROUTES
                    ),
            },
            {
                path: 'sections/:sectionId',
                redirectTo: 'section/:sectionId',
                pathMatch: 'full',
            },
            {
                path: '',
                redirectTo: 'sections',
                pathMatch: 'full',
            },
        ],
    },
];
