import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundViewComponent } from '@awg-views/page-not-found-view/page-not-found-view.component';

/* routes of the PageNotFoundViewModule */
const pageNotFoundViewRoutes: Routes = [
    {
        path: '',
        component: PageNotFoundViewComponent,
        data: { title: 'AWG Online Edition – 404' }
    }
];

/**
 * Routed components of the {@link PageNotFoundViewModule}:
 * {@link PageNotFoundViewComponent}.
 */
export const routedPageNotFoundViewComponents = [PageNotFoundViewComponent];

/**
 * PageNotFound module routing.
 *
 * It activates the pageNotFoundViewRoutes.
 */
@NgModule({
    imports: [RouterModule.forChild(pageNotFoundViewRoutes)],
    exports: [RouterModule]
})
export class PageNotFoundViewRoutingModule {}
