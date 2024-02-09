import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionFolioViewerComponent } from './edition-folio-viewer.component';

/**
 * The edition folio module.
 *
 * It embeds the {@link EditionFolioViewerComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [EditionFolioViewerComponent],
    exports: [EditionFolioViewerComponent],
})
export class EditionFolioViewerFolioModule {}
