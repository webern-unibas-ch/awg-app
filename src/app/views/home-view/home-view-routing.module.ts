import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeViewComponent } from '@awg-views/home-view/home-view.component';

/* Routes of the PageNotFoundViewModule */
const HOME_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: HomeViewComponent,
        data: { title: 'AWG Online Edition – Home' },
    },
];

/**
 * Routed components of the {@link HomeViewModule}:
 * {@link HomeViewComponent}.
 */
export const routedHomeViewComponents = [HomeViewComponent];

/**
 * HomeView module routing.
 *
 * It activates the HOME_VIEW_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(HOME_VIEW_ROUTES)],
    exports: [RouterModule],
})
export class HomeViewRoutingModule {}
