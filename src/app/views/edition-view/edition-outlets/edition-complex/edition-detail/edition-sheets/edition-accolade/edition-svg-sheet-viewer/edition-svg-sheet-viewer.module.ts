import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSvgSheetViewerSettingsComponent } from './edition-svg-sheet-viewer-settings';
import { EditionSvgSheetViewerComponent } from './edition-svg-sheet-viewer.component';

/**
 * The edition svg sheet viewer module.
 *
 * It embeds the {@link EditionSvgSheetViewerComponent},
 * {@link EditionSvgSheetViewerSettingsComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [EditionSvgSheetViewerComponent, EditionSvgSheetViewerSettingsComponent],
    exports: [EditionSvgSheetViewerComponent, EditionSvgSheetViewerSettingsComponent],
})
export class EditionSvgSheetViewerModule {}
