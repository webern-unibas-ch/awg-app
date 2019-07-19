import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

/* Routing Module */
import { ContactRoutingModule, routedContactComponents } from './contact-routing.module';

/**
 * The contact module.
 *
 * It embeds the {@link ContactViewComponent} and its
 * [routing definition]{@link ContactRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, ContactRoutingModule],
    declarations: [routedContactComponents]
})
export class ContactModule {}
