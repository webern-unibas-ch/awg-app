import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactInfoComponent } from './contact-info/contact-info.component';
import { EditionInfoComponent } from './edition-info/edition-info.component';
import { ResourceInfoComponent } from './resource-info/resource-info.component';
import { SearchInfoComponent } from './search-info/search-info.component';
import { StructureInfoComponent } from './structure-info/structure-info.component';

/* Routes of the SideInfoModule */
const sideInfoRoutes: Routes = [
    { path: 'contactInfo', component: ContactInfoComponent, outlet: 'side' },
    { path: 'editionInfo', component: EditionInfoComponent, outlet: 'side' },
    { path: 'resourceInfo', component: ResourceInfoComponent, outlet: 'side' },
    { path: 'searchInfo', component: SearchInfoComponent, outlet: 'side' },
    { path: 'structureInfo', component: StructureInfoComponent, outlet: 'side' }
];

/**
 * Routed components of the {@link SideInfoModule}:
 * {@link ContactInfoComponent}, {@link EditionInfoComponent},
 * {@link ResourceInfoComponent}, {@link SearchInfoComponent},
 * {@link StructureInfoComponent}.
 */
export const routedSideInfoComponents = [
    ContactInfoComponent,
    EditionInfoComponent,
    ResourceInfoComponent,
    SearchInfoComponent,
    StructureInfoComponent
];

/**
 * Side info module routing.
 *
 * It activates the sideInfoRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(sideInfoRoutes)],
    exports: [RouterModule]
})
export class SideInfoRoutingModule {}
