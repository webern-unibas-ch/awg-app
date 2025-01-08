import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionSectionDetailOverviewComponent } from './edition-section-detail-overview/edition-section-detail-overview.component';
import { EditionSectionDetailComponent } from './edition-section-detail.component';

/* Routes of the EditionSectionDetailModule */
const EDITION_SECTION_DETAIL_ROUTES: Routes = [
    {
        path: '',
        component: EditionSectionDetailComponent,
        children: [
            {
                path: 'intro',
                loadChildren: () =>
                    import(
                        '../../../edition-outlets/edition-complex/edition-detail/edition-intro/edition-intro.module'
                    ).then(m => m.EditionIntroModule),
            },
            {
                path: '',
                component: EditionSectionDetailOverviewComponent,
            },
        ],
    },
];

/**
 * Routed components of the {@link EditionSectionDetailModule}:
 * {@link EditionSectionDetailComponent} and {@link EditionSectionDetailOverviewComponent}.
 */
export const routedEditionSectionDetailComponents = [
    EditionSectionDetailComponent,
    EditionSectionDetailOverviewComponent,
];

/**
 * EditionSectionDetail module routing.
 *
 * It activates the EDITION_SECTION_DETAIL_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(EDITION_SECTION_DETAIL_ROUTES)],
    exports: [RouterModule],
})
export class EditionSectionDetailRoutingModule {}
