import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { FolioComponent } from './folio.component';

/**
 * The edition folio module.
 *
 * It embeds the {@link FolioComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [FolioComponent],
    exports: [FolioComponent]
})
export class FolioModule {}
