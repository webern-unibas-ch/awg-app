import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

/* Routing Module */
import { ContactViewRoutingModule, routedContactViewComponents } from './contact-view-routing.module';

/**
 * The contactView module.
 *
 * It embeds the {@link ContactViewComponent} and its
 * [routing definition]{@link ContactViewRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, ContactViewRoutingModule],
    declarations: [routedContactViewComponents],
})
export class ContactViewModule {}
