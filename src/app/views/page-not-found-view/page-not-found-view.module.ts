import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

/* Routing Module */
import { PageNotFoundViewRoutingModule, routedPageNotFoundViewComponents } from './page-not-found-view-routing.module';

/**
 * The pageNotFoundView module.
 *
 * It embeds the {@link PageNotFoundViewComponent} and its
 * [routing definition]{@link PageNotFoundViewRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, PageNotFoundViewRoutingModule],
    declarations: [routedPageNotFoundViewComponents]
})
export class PageNotFoundViewModule {}
