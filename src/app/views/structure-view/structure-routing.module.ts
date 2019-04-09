import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StructureViewComponent } from '@awg-views/structure-view/structure-view.component';

const structureRoutes: Routes = [
    {
        path: '',
        component: StructureViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(structureRoutes)],
    exports: [RouterModule]
})
export class StructureRoutingModule {}

export const routedComponents = [StructureViewComponent];
