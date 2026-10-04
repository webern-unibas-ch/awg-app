import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionFoliosViewerComponent } from './edition-folios-viewer.component';

/**
 * The EditionFoliosViewer module.
 *
 * It embeds the {@link EditionFoliosViewerComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [EditionFoliosViewerComponent],
    exports: [EditionFoliosViewerComponent],
})
export class EditionFoliosViewerModule {}
