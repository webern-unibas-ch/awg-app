import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

/**
 * The homeView module.
 *
 * It embeds the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
})
export class HomeViewModule {}
