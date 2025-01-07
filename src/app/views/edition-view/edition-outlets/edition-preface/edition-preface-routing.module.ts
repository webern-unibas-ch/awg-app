import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionPrefaceComponent } from './edition-preface.component';

/* Routes of the EditionPrefaceModule */
const EDITION_PREFACE_ROUTES: Routes = [
    {
        path: '',
        component: EditionPrefaceComponent,
        data: { title: 'AWG Online Edition – Preface' },
    },
];

/**
 * Routed components of the {@link EditionPrefaceModule}:
 * {@link EditionPrefaceComponent}.
 */
export const routedEditionPrefaceComponents = [EditionPrefaceComponent];

/**
 * EditionPreface module routing.
 *
 * It activates the EDITION_PREFACE_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(EDITION_PREFACE_ROUTES)],
    exports: [RouterModule],
})
export class EditionPrefaceRoutingModule {}
