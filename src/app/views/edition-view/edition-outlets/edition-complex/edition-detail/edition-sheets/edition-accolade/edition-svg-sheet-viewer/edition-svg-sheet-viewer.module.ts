import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSvgSheetViewerComponent } from './edition-svg-sheet-viewer.component';

/**
 * The edition svg sheet nav module.
 *
 * It embeds the {@link EditionSvgSheetViewerComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [EditionSvgSheetViewerComponent],
    exports: [EditionSvgSheetViewerComponent],
})
export class EditionSvgSheetViewerModule {}
