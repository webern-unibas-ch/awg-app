import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

/**
 * The side info module.
 *
 * It embeds the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [],
})
export class SideInfoModule {}
