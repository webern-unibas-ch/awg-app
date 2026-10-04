import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionFoliosPanelComponent } from './edition-folios-panel.component';
import { EditionFoliosViewerModule } from './viewer/edition-folios-viewer.module';

/**
 * The EditionFoliosPanel module.
 *
 * It embeds the {@link EditionFoliosPanelComponent} as well as the
 * {@link EditionFoliosViewerModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionFoliosViewerModule],
    declarations: [EditionFoliosPanelComponent],
    exports: [EditionFoliosPanelComponent],
})
export class EditionFoliosPanelModule {}
