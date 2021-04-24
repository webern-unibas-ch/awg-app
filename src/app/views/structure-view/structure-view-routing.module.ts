import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StructureViewComponent } from '@awg-views/structure-view/structure-view.component';

/* Routes of the StructureViewModule */
const structureViewRoutes: Routes = [
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
 * It activates the structureViewRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(structureViewRoutes)],
    exports: [RouterModule],
})
export class StructureViewRoutingModule {}
