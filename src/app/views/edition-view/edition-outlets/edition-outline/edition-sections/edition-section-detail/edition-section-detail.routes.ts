import { Routes } from '@angular/router';

import { EditionSectionDetailOverviewComponent } from './edition-section-detail-overview/edition-section-detail-overview.component';
import { EditionSectionDetailComponent } from './edition-section-detail.component';

/**
 * The routes of the EditionSectionDetail.
 **/
export const EDITION_SECTION_DETAIL_ROUTES: Routes = [
    {
        path: '',
        component: EditionSectionDetailComponent,
        children: [
            {
                path: 'intro',
                loadChildren: () =>
                    import('../../../edition-complex/edition-detail/edition-intro/edition-intro.routes').then(
                        m => m.EDITION_INTRO_ROUTES
                    ),
            },
            {
                path: '',
                component: EditionSectionDetailOverviewComponent,
            },
        ],
    },
];
