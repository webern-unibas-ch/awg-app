import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

/* Routing Module */
import { HomeViewRoutingModule, routedHomeViewComponents } from './home-view-routing.module';

/**
 * The homeView module.
 *
 * It embeds the {@link HomeViewComponent} and its
 * [routing definition]{@link HomeViewRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, HomeViewRoutingModule],
    declarations: [routedHomeViewComponents]
})
export class HomeViewModule {}
