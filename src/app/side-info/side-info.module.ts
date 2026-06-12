import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

/**
 * The side info module.
 *
 * It embeds the side info components and their
 * [routing definition]{@link SideInfoRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [],
})
export class SideInfoModule {}
