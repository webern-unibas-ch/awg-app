import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundViewComponent } from '@awg-views/page-not-found-view/page-not-found-view.component';

/* Routes of the PageNotFoundViewModule */
const PAGE_NOT_FOUND_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: PageNotFoundViewComponent,
        data: { title: 'AWG Online Edition – 404' },
    },
];

/**
 * Routed components of the {@link PageNotFoundViewModule}:
 * {@link PageNotFoundViewComponent}.
 */
export const routedPageNotFoundViewComponents = [PageNotFoundViewComponent];

/**
 * PageNotFound module routing.
 *
 * It activates the PAGE_NOT_FOUND_VIEW_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(PAGE_NOT_FOUND_VIEW_ROUTES)],
    exports: [RouterModule],
})
export class PageNotFoundViewRoutingModule {}
