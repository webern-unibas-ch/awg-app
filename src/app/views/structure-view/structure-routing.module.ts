import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StructureViewComponent } from '@awg-views/structure-view/structure-view.component';

/* routes of the StructureModule */
const structureRoutes: Routes = [
    {
        path: '',
        component: StructureViewComponent
    }
];

/**
 * Routed components of the {@link StructureModule}:
 * {@link StructureViewComponent}.
 */
export const routedStructureComponents = [StructureViewComponent];

/**
 * Structure module routing.
 *
 * It activates the structureRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(structureRoutes)],
    exports: [RouterModule]
})
export class StructureRoutingModule {}
