import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionFoliosPanelComponent } from './edition-folios-panel.component';
import { EditionFoliosViewerComponent } from './viewer/edition-folios-viewer.component';

/**
 * The EditionFoliosPanel module.
 *
 * It embeds the {@link EditionFoliosPanelComponent} as well as the
 * {@link EditionFoliosViewerComponent} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionFoliosViewerComponent],
    declarations: [EditionFoliosPanelComponent],
    exports: [EditionFoliosPanelComponent],
})
export class EditionFoliosPanelModule {}
