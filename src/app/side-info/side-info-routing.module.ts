import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResourceInfoComponent } from './resource-info/resource-info.component';
import { SearchInfoComponent } from './search-info/search-info.component';

/* Routes of the SideInfoModule */
const SIDE_INFO_ROUTES: Routes = [
    { path: 'resourceInfo', component: ResourceInfoComponent, outlet: 'side' },
    { path: 'searchInfo', component: SearchInfoComponent, outlet: 'side' },
];

/**
 * Routed components of the {@link SideInfoModule}:
 * {@link ResourceInfoComponent}, {@link SearchInfoComponent}.
 */
export const routedSideInfoComponents = [ResourceInfoComponent, SearchInfoComponent];

/**
 * Side info module routing.
 *
 * It activates the SIDE_INFO_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(SIDE_INFO_ROUTES)],
    exports: [RouterModule],
})
export class SideInfoRoutingModule {}
