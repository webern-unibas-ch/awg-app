import { Routes } from '@angular/router';

import { StructureSideInfoComponent } from './structure-side-info/structure-side-info.component';
import { StructureViewComponent } from './structure-view.component';

/**
 * The routes for the structure view.
 */
export const STRUCTURE_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: StructureViewComponent,
        data: { title: 'AWG Online Edition – Structure' },
    },
    {
        path: '',
        outlet: 'side',
        component: StructureSideInfoComponent,
    },
];
