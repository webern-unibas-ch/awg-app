import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditionIntroComponent } from './edition-intro.component';

/* Routes of the EditionIntroModule */
const editionIntroRoutes: Routes = [
    {
        path: '',
        component: EditionIntroComponent,
        data: { title: 'AWG Online Edition – Intro' }
    }
];

/**
 * Routed components of the {@link EditionIntroModule}:
 * {@link EditionIntroComponent}.
 */
export const routedEditionIntroComponents = [EditionIntroComponent];

/**
 * EditionIntro module routing.
 *
 * It activates the editionIntroRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(editionIntroRoutes)],
    exports: [RouterModule]
})
export class EditionIntroRoutingModule {}
