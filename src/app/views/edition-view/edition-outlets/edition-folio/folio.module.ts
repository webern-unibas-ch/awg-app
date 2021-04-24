import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { FolioOverviewComponent } from './folio-overview.component';

/**
 * The edition folio module.
 *
 * It embeds the {@link FolioOverviewComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [FolioOverviewComponent],
    exports: [FolioOverviewComponent],
})
export class FolioModule {}
