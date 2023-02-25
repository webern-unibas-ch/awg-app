import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionConvoluteComponent } from './edition-convolute.component';
import { EditionFolioViewerFolioModule } from './edition-folio-viewer/edition-folio-viewer.module';

/**
 * The EditionConvolute module.
 *
 * It embeds the edition convolute components as well as the
 * {@link FolioModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionFolioViewerFolioModule],
    declarations: [EditionConvoluteComponent],
    exports: [EditionConvoluteComponent],
})
export class EditionConvoluteModule {}
