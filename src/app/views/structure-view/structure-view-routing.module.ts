import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StructureViewComponent } from '@awg-views/structure-view/structure-view.component';

/* Routes of the StructureViewModule */
const STRUCTURE_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: StructureViewComponent,
        data: { title: 'AWG Online Edition – Structure' },
    },
];

/**
 * Routed components of the {@link StructureViewModule}:
 * {@link StructureViewComponent}.
 */
export const routedStructureViewComponents = [StructureViewComponent];

/**
 * StructureView module routing.
 *
 * It activates the STRUCTURE_VIEW_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(STRUCTURE_VIEW_ROUTES)],
    exports: [RouterModule],
})
export class StructureViewRoutingModule {}
