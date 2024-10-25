import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { HomeViewCardComponent } from './home-view-card/home-view-card.component';

/**
 * The homeView module.
 *
 * It embeds the home components
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [HomeViewCardComponent],
    exports: [HomeViewCardComponent],
})
export class HomeViewModule {}
