import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StructureInfoComponent } from '@awg-side-info/structure-info/structure-info.component';
import { StructureViewComponent } from '@awg-views/structure-view/structure-view.component';

/* Routes of the StructureViewModule */
const STRUCTURE_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: StructureViewComponent,
        data: { title: 'AWG Online Edition – Structure' },
    },
    {
        path: '',
        outlet: 'side',
        component: StructureInfoComponent,
    },
];

/**
 * Routed components of the {@link StructureViewModule}:
 * {@link StructureViewComponent}.
 */
export const routedStructureViewComponents = [StructureViewComponent, StructureInfoComponent];

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
